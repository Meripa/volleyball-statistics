const express = require("express")
const cors = require("cors")
const pool = require("./db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const decodeHeaderValue = (value) => {
  if (!value) return null

  try {
    return decodeURIComponent(value)
  } catch (error) {
    return value
  }
}

let clerkJwksCache = null
let clerkJwksFetchedAt = 0

const getClerkSigningKey = async (issuer, kid) => {
  const cacheMaxAgeMs = 60 * 60 * 1000

  if (
    !clerkJwksCache ||
    Date.now() - clerkJwksFetchedAt > cacheMaxAgeMs
  ) {
    const response = await fetch(`${issuer}/.well-known/jwks.json`)

    if (!response.ok) {
      throw new Error("Failed to fetch Clerk JWKS")
    }

    clerkJwksCache = await response.json()
    clerkJwksFetchedAt = Date.now()
  }

  const jwk = clerkJwksCache.keys.find(
    (key) => key.kid === kid
  )

  if (!jwk) {
    throw new Error("Clerk signing key not found")
  }

  return crypto.createPublicKey({
    key: jwk,
    format: "jwk",
  })
}

const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || ""
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded = jwt.decode(token, {
      complete: true,
    })

    if (!decoded?.header?.kid || !decoded?.payload?.iss) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const issuer = decoded.payload.iss
    const expectedIssuer = process.env.CLERK_ISSUER || issuer

    const signingKey = await getClerkSigningKey(
      expectedIssuer,
      decoded.header.kid
    )

    const verified = jwt.verify(token, signingKey, {
      algorithms: ["RS256"],
      issuer: expectedIssuer,
    })

    req.auth = {
      userId: verified.sub,
    }

    const displayName =
      decodeHeaderValue(req.headers["x-user-name"]) ||
      verified.name ||
      null

    const email =
      decodeHeaderValue(req.headers["x-user-email"]) ||
      verified.email ||
      null

    await pool.query(
      `INSERT INTO app_users (
        clerk_user_id,
        display_name,
        email
      )
       VALUES ($1, $2, $3)
       ON CONFLICT (clerk_user_id)
       DO UPDATE SET
         display_name = COALESCE(EXCLUDED.display_name, app_users.display_name),
         email = COALESCE(EXCLUDED.email, app_users.email)`,
      [
        req.auth.userId,
        displayName,
        email,
      ]
    )

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

const adminRequired = async (req, res, next) => {
  const result = await pool.query(
    `SELECT is_admin
     FROM app_users
     WHERE clerk_user_id = $1`,
    [req.auth.userId]
  )

  if (!result.rows[0]?.is_admin) {
    return res.status(403).json({ message: "Admin access required" })
  }

  next()
}

const mapGame = (row) => ({
  id: row.id,
  matchType: row.matchtype,
  teamASize: row.teamasize,
  teamBSize: row.teambsize,
  teamA: row.teama,
  teamB: row.teamb,
  date: row.date,
  createdByName: row.createdbyname,
  createdByEmail: row.createdbyemail,
  scoreA: row.scorea,
  scoreB: row.scoreb,

  stats:
    typeof row.stats === "string"
      ? JSON.parse(row.stats)
      : (row.stats || {}),

  log:
    typeof row.log === "string"
      ? JSON.parse(row.log)
      : (row.log || []),

  playerNames:
    typeof row.playernames === "string"
      ? JSON.parse(row.playernames)
      : (row.playernames || {}),
})

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id SERIAL PRIMARY KEY,
      clerk_user_id TEXT UNIQUE NOT NULL,
      display_name TEXT,
      email TEXT,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    ALTER TABLE app_users
    ADD COLUMN IF NOT EXISTS display_name TEXT
  `)

  await pool.query(`
    ALTER TABLE app_users
    ADD COLUMN IF NOT EXISTS email TEXT
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      matchtype TEXT NOT NULL DEFAULT 'beach',
      teama TEXT NOT NULL,
      teamb TEXT NOT NULL,
      date TEXT NOT NULL,
      scorea INTEGER NOT NULL DEFAULT 0,
      scoreb INTEGER NOT NULL DEFAULT 0,
      stats JSONB NOT NULL DEFAULT '{}'::jsonb,
      log JSONB NOT NULL DEFAULT '[]'::jsonb,
      playernames JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `)
  await pool.query(`
    ALTER TABLE games
    ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  `)

  await pool.query(`
    ALTER TABLE games
    ADD COLUMN IF NOT EXISTS clerk_user_id TEXT
  `)

  await pool.query(`
    ALTER TABLE games
    ADD COLUMN IF NOT EXISTS createdbyname TEXT
  `)

  await pool.query(`
    ALTER TABLE games
    ADD COLUMN IF NOT EXISTS createdbyemail TEXT
  `)

  await pool.query(`
    ALTER TABLE games
    ADD COLUMN IF NOT EXISTS playernames JSONB NOT NULL DEFAULT '{}'::jsonb
  `)
  await pool.query(`
  ALTER TABLE games
  ADD COLUMN IF NOT EXISTS matchtype TEXT NOT NULL DEFAULT 'beach'
  `)

  await pool.query(`
  ALTER TABLE games
  ADD COLUMN IF NOT EXISTS teamasize INTEGER NOT NULL DEFAULT 2
  `)

  await pool.query(`
    ALTER TABLE games
    ADD COLUMN IF NOT EXISTS teambsize INTEGER NOT NULL DEFAULT 2
  `)
}


app.get("/games", authRequired, async (req,res) => {
  const result = await pool.query(
    "SELECT * FROM games WHERE clerk_user_id = $1 ORDER BY id DESC",
    [req.auth.userId]
  )
    res.json(result.rows.map(mapGame))
})

app.get("/admin/games", authRequired, adminRequired, async (req,res) => {
  const result = await pool.query(
    "SELECT * FROM games ORDER BY id DESC"
  )

  res.json(result.rows.map(mapGame))
})

app.post("/games", authRequired, async (req,res) => {
    const {
      teamA,
      teamB,
      date,
      matchType,
      teamASize,
      teamBSize,
      createdByName,
      createdByEmail,
    } = req.body

    const result = await pool.query(
      `INSERT INTO games (
        clerk_user_id,
        createdbyname,
        createdbyemail,
        matchtype,
        teamasize,
        teambsize,
        teama,
        teamb,
        date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        req.auth.userId,
        createdByName || null,
        createdByEmail || null,
        matchType || "beach",
        teamASize || 2,
        teamBSize || 2,
        teamA,
        teamB,
        date,
      ]
    )

    res.status(201).json(mapGame(result.rows[0]))
})

app.post("/register", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing fields"
      })
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
      INSERT INTO users (
        email,
        password
      )
      VALUES ($1, $2)
      RETURNING id, email
      `,
      [email, hashedPassword]
    )

    res.status(201).json({
      message: "User created",
      user: result.rows[0]
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
})

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    const user = result.rows[0]

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Server error"
    })
  }
})

app.get("/", (req, res) => {
  res.json({ message: "RallyIQ API is running veryy good" })
})

app.get("/games/:id", authRequired, async (req, res) =>{
    const gameId = Number(req.params.id)

    const result = await pool.query(
      "SELECT * FROM games WHERE id = $1 AND clerk_user_id = $2",
      [gameId, req.auth.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Game not found" })
    }

    res.json(mapGame(result.rows[0]))
})

app.delete("/games/:id", authRequired, async (req, res) =>{
    const gameId = Number(req.params.id)

    const result = await pool.query(
      "DELETE FROM games WHERE id = $1 AND clerk_user_id = $2 RETURNING *",
      [gameId, req.auth.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Game not found" })
    }

    res.json({ message: "Game deleted!"})
}) 


app.post("/games/:id/events", authRequired, async (req, res) => {
  const gameId = Number(req.params.id)
  const { player, type } = req.body

  const result = await pool.query(
    "SELECT * FROM games WHERE id = $1 AND clerk_user_id = $2",
    [gameId, req.auth.userId]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Game not found" })
  }

  const game = result.rows[0]

  let stats = game.stats || {}
  let log = game.log || []
  let scoreA = game.scorea
  let scoreB = game.scoreb

  const key = type + player
  const totalPointsKey = "totalPoints" + player
  const plussesMinusesKey = "plussesMinuses" + player

  stats[key] = (stats[key] || 0) + 1

  const isTeamAPlayer =
    player <= game.teamasize
  const isError = type.includes("Error")

  if (isTeamAPlayer) {
    if (isError) {
      scoreB += 1
      stats[plussesMinusesKey] = (stats[plussesMinusesKey] || 0) - 1
    } else {
      scoreA += 1
      stats[totalPointsKey] = (stats[totalPointsKey] || 0) + 1
      stats[plussesMinusesKey] = (stats[plussesMinusesKey] || 0) + 1
    }
  } else {
    if (isError) {
      scoreA += 1
      stats[plussesMinusesKey] = (stats[plussesMinusesKey] || 0) - 1
    } else {
      scoreB += 1
      stats[totalPointsKey] = (stats[totalPointsKey] || 0) + 1
      stats[plussesMinusesKey] = (stats[plussesMinusesKey] || 0) + 1
    }
  }

  log.push({ player, type })

  const updated = await pool.query(
    `UPDATE games
     SET scorea = $1,
         scoreb = $2,
         stats = $3,
         log = $4
     WHERE id = $5 AND clerk_user_id = $6
     RETURNING *`,
    [
      scoreA,
      scoreB,
      JSON.stringify(stats),
      JSON.stringify(log),
      gameId,
      req.auth.userId,
    ]
  )
  res.json(mapGame(updated.rows[0]))
})

app.patch("/games/:id", authRequired, async (req, res) => {
    const gameId = Number(req.params.id)

    const { scoreA, scoreB, stats, log, playerNames } = req.body

    const result = await pool.query(
    `UPDATE games
     SET scorea = $1,
         scoreb = $2,
         stats = $3,
         log = $4,
         playernames = $5
     WHERE id = $6 AND clerk_user_id = $7
     RETURNING *`,
     [
      scoreA,
      scoreB,
      JSON.stringify(stats),
      JSON.stringify(log),
      JSON.stringify(playerNames || {}),
      gameId,
      req.auth.userId,
    ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({message: "Game not found"})
    }



    res.json(mapGame(result.rows[0]))
})

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()")
  res.json(result.rows)
})


initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Failed to initialize database", error)
    process.exit(1)
  })
