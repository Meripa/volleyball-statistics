const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "rallyiq",
  password: "1234", // pane oma
  port: 5432,
})

module.exports = pool