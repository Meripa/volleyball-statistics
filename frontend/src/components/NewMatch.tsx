import { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import StatInput from './StatInput'
import StatTable from './StatTable'
import EventLog from './EventLog'
import MatchHeader from './MatchHeader'

import { API_URL} from '../components/Games'



type Stats = {
  [key: string]: number
  scoreA: number
  scoreB: number
}

type LogItem = {
  player: number
  type: string
}

type Game = {
  id: number
  teamA: string
  teamB: string
  date: string
  scoreA: number
  scoreB: number
  playerNames?: Record<string, string>
}

const statTypes = [
  "totalPoints",
  "plussesMinuses",
  "serveAce",
  "serveError",
  "receptionError",
  "attackPoint",
  "attackError",
  "blockPoint",
]

const statLabels: Record<string, string> = {
  totalPoints: "Total Points",
  plussesMinuses: "+/-",
  serveAce: "Serve Ace",
  serveError: "Serve Error",
  attackPoint: "Attack Point",
  attackError: "Attack Error",
  receptionError: "Reception Error",
  blockPoint: "Block Point",
}

const NewMatch = () => {
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({
    "1": "Player 1",
    "2": "Player 2",
    "3": "Player 3",
    "4": "Player 4",
  })

  const [stats, setStats] = useState<Stats>({
    scoreA: 0,
    scoreB: 0,
  })

  const [game, setGame] = useState<Game | null>(null)

  const [log, setLog] = useState<LogItem[]>([])
    const handleClick = (player: number, type: string) => {
      const key = type + player
      const totalPointsKey = "totalPoints" + player
      const plussesMinusesKey = "plussesMinuses" + player

      setStats((prev) => {
        const newStats = {
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }

        const isTeamAPlayer = player <= 2;
        const isError = type.includes("Error")


        if (isTeamAPlayer) {
          if (isError){
            newStats.scoreB = prev.scoreB + 1
            newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1
            
          }else {
            newStats.scoreA = prev.scoreA + 1
            newStats[totalPointsKey] = (prev[totalPointsKey] || 0) + 1
            newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
          } 
        } else {
          if (isError){
            newStats.scoreA = prev.scoreA + 1
            newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1

          } else {
            newStats.scoreB = prev.scoreB + 1
            newStats[totalPointsKey] = (prev[totalPointsKey] || 0) + 1
            newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
          }
        } 

        return newStats
      })

      setLog((prev) => [...prev, { player, type }])
    }


const handleSaveMatch = async () => {
  if (!id) return

  const res = await fetch(`${API_URL}/games/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scoreA: stats.scoreA,
      scoreB: stats.scoreB,
      stats,
      log,
      playerNames,
    })
  })

  const updatedGame = await res.json()
  setGame(updatedGame)

  alert("")
}

const handleDownloadPdf = () => {
  const printWindow = window.open("", "_blank", "width=1000,height=800")

  if (!printWindow) {
    alert("Allow popups to download the PDF.")
    return
  }

  const players = ["1", "2", "3", "4"]
  const rows = players
    .map((player) => `
      <tr>
        <td>${playerNames[player] || `Player ${player}`}</td>
        ${statTypes.map((stat) => `<td>${stats[stat + player] || 0}</td>`).join("")}
      </tr>
    `)
    .join("")

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${game?.teamA || "Team A"} vs ${game?.teamB || "Team B"} stats</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #111827;
            margin: 32px;
          }

          h1 {
            font-size: 24px;
            margin: 0 0 8px;
          }

          .meta {
            color: #4b5563;
            margin-bottom: 24px;
          }

          .score {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th,
          td {
            border: 1px solid #9ca3af;
            padding: 8px;
            text-align: left;
          }

          th {
            background: #f3f4f6;
          }

          @media print {
            body {
              margin: 18mm;
            }
          }
        </style>
      </head>
      <body>
        <h1>${game?.teamA || "Team A"} vs ${game?.teamB || "Team B"}</h1>
        <div class="meta">${game?.date || ""}</div>
        <div class="score">${stats.scoreA} - ${stats.scoreB}</div>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              ${statTypes.map((stat) => `<th>${statLabels[stat]}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

const handleUndo = () => {
  const last = log[log.length - 1]

  if (!last) return

  const key = last.type + last.player
  const totalPointsKey = "totalPoints" + last.player
  const plussesMinusesKey = "plussesMinuses" + last.player

  setStats((prev) => {
    const newStats = {
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0),
    }

    const isTeamAPlayer = last.player <= 2
    const isError = last.type.includes("Error")

    if (isTeamAPlayer) {
      if (isError) {
        newStats.scoreB = Math.max(prev.scoreB - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
      } else {
        newStats.scoreA = Math.max(prev.scoreA - 1, 0)
        newStats[totalPointsKey] = Math.max((prev[totalPointsKey] || 0) - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1
      }
    } else {
      if (isError) {
        newStats.scoreA = Math.max(prev.scoreA - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
      } else {
        newStats.scoreB = Math.max(prev.scoreB - 1, 0)
        newStats[totalPointsKey] = Math.max((prev[totalPointsKey] || 0) - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1
      }
    }

    return newStats
  })

  setLog((prev) => prev.slice(0, -1))
}

const { id } = useParams()

useEffect(() => {
  if (!id) return

  fetch(`${API_URL}/games/${id}`)
    .then(res => res.json())
    .then(data => {
      setGame(data)
      setStats({
        scoreA: data.scoreA,
        scoreB: data.scoreB,
        ...(data.stats || {})
      })

      setLog(data.log || [])
      setPlayerNames({
        "1": "Player 1",
        "2": "Player 2",
        "3": "Player 3",
        "4": "Player 4",
        ...(data.playerNames || {}),
      })

    })
}, [id])

return (
  <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-white py-10 px-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <MatchHeader
        setNumber={1}
        scoreA={stats.scoreA}
        scoreB={stats.scoreB}
        teamA={game?.teamA || "Team A"}
      teamB={game?.teamB || "Team B"}
      />
      <div className="flex flex-wrap gap-3">
        <Link
          to="/games"
          className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
        >
          Back to Games
        </Link>

        <button
          onClick={handleSaveMatch}
          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
        >
          Save Match
        </button>

        <button
          onClick={handleDownloadPdf}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          <div className="rounded-2xl bg-gray-900 p-4 shadow-lg">
            <h2 className="mb-3 text-lg font-bold text-white">Player Names</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["1", "2", "3", "4"].map((player) => (
                <label key={player} className="space-y-1 text-sm text-slate-300">
                  <span>Player {player}</span>
                  <input
                    value={playerNames[player] || ""}
                    onChange={(event) =>
                      setPlayerNames((prev) => ({
                        ...prev,
                        [player]: event.target.value,
                      }))
                    }
                    maxLength={20}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
                    placeholder={`Player ${player}`}
                  />
                  <span className="block text-xs text-slate-500">
                    {(playerNames[player] || "").length}/20 characters
                  </span>
                </label>
              ))}
            </div>
          </div>

          <StatInput handleClick={handleClick} playerNames={playerNames} />

          <StatTable stats={stats} playerNames={playerNames} />
        </div>

        <div className="lg:sticky lg:top-6">
          <EventLog log={log} undo={handleUndo} playerNames={playerNames} />
        </div>
      </div>
    </div>
  </div>
)
}

export default NewMatch
