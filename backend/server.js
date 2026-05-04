const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const mapGame = (row) => ({
  id: row.id,
  teamA: row.teama,
  teamB: row.teamb,
  date: row.date,
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
})

let games = []

app.get("/games", async (req,res) => {
  const result = await pool.query("SELECT * FROM games ORDER BY id DESC")
    res.json(result.rows.map(mapGame))
})

app.post("/games", async (req,res) => {
    const { teamA, teamB, date} = req.body

    const result = await pool.query(
      `INSERT INTO games (teama, teamb, date)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [teamA, teamB, date]
    )

    res.status(201).json(mapGame(result.rows[0]))
})

app.get("/", (req, res) => {
  res.json({ message: "RallyIQ API is running veryy good" })
})

app.get("/games/:id", async (req, res) =>{
    const gameId = Number(req.params.id)

    const result = await pool.query(
      "SELECT * FROM games WHERE id = $1",
      [gameId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Game not found" })
    }

    res.json(mapGame(result.rows[0]))
})

app.delete("/games/:id", async (req, res) =>{
    const gameId = Number(req.params.id)

    const result = await pool.query(
      "DELETE FROM games WHERE id = $1 RETURNING *",
      [gameId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Game not found" })
    }

    res.json({ message: "Game deleted!"})
}) 


// Events
app.post("/games/:id/events", async (req, res) => {
  const gameId = Number(req.params.id)
  const { player, type } = req.body

  const result = await pool.query(
    "SELECT * FROM games WHERE id = $1",
    [gameId]
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

  const isTeamAPlayer = player <= 2
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
     WHERE id = $5
     RETURNING *`,
    [
      scoreA,
      scoreB,
      JSON.stringify(stats),
      JSON.stringify(log),
      gameId,
    ]
  )
  consolelog(data)
  res.json(mapGame(updated.rows[0]))
})

app.patch("/games/:id", async (req, res) => {
    const gameId = Number(req.params.id)

    const { scoreA, scoreB, stats, log} = req.body

    const result = await pool.query(
    `UPDATE games
     SET scorea = $1,
         scoreb = $2,
         stats = $3,
         log = $4
     WHERE id = $5
     RETURNING *`,
     [scoreA, scoreB, JSON.stringify(stats), JSON.stringify(log), gameId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({message: "Game not found"})
    }



    res.json(mapGame(result.rows[0]))
})

const pool = require("./db")

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()")
  res.json(result.rows)
})


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})