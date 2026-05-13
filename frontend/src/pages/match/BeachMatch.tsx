import { useState } from "react"
import { Link } from "react-router-dom"


import MatchHeader from "../../components/match/MatchHeader"
import PlayerGrid from "../../components/match/PlayerGrid"
import ActionPanel from "../../components/match/ActionPanel"
import RecentEvents from "../../components/match/RecentEvents"
import StatTable from "../../components/StatTable"
import PlayerEditorModal from "../../components/match/PlayerEditorModal"
import { API_URL } from "../../components/Games"

import type { Stats, Game, LogItem } from "../../types/match"
import { statTypes, statLabels } from "../../components/match/constants"
const generatePlayers = (
  teamASize: number,
  teamBSize: number
) => {

  const totalPlayers =
    teamASize + teamBSize

  const result: Record<string, string> = {}

  for (let i = 1; i <= totalPlayers; i++) {

    result[i.toString()] =
      `Player ${i}`
  }

  return result
}

type Props = {
  game: Game
}


const BeachMatch = ({ game, }: Props) => {

  // States
  const [layoutMode, setLayoutMode] = useState<
    "vertical" | "horizontal"
  >("horizontal")

  const [selectedPlayer, setSelectedPlayer] =
    useState<number | null>(null)

  const [playerNames, setPlayerNames] = useState<
  Record<string, string>
    >({
      ...generatePlayers(
        game.teamASize,
        game.teamBSize
      ),

      ...(game.playerNames || {}),
    })

  // Set point constants
    const [stats, setStats] = useState<Stats>({
      scoreA: game.scoreA || 0,
      scoreB: game.scoreB || 0,

      setsWonA: 0,
      setsWonB: 0,

      currentSet: 1,

      setHistory: [],

      ...(game.stats || {}),
    })

  const [pendingSetWinner, setPendingSetWinner] =
    useState<"A" | "B" | null>(null)

  const [pendingSetScore, setPendingSetScore] =
  useState({
    scoreA: 0,
    scoreB: 0,
  })
  
  // Confirm set win

  const handleConfirmSet = () => {

  if (!pendingSetWinner) return

  setStats((prev) => {

    const newStats = { ...prev }

    if (pendingSetWinner === "A") {

      newStats.setsWonA =
        (prev.setsWonA || 0) + 1

      if (newStats.setsWonA === 2) {

        alert(`${game?.teamA} wins match!`)

      } else {

        newStats.currentSet += 1
        newStats.scoreA = 0
        newStats.scoreB = 0
      }
    }

    if (pendingSetWinner === "B") {

      newStats.setsWonB =
        (prev.setsWonB || 0) + 1

      if (newStats.setsWonB === 2) {

        alert(`${game?.teamB} wins match!`)

      } else {

        newStats.currentSet += 1
        newStats.scoreA = 0
        newStats.scoreB = 0
      }
    }
    newStats.setHistory = [
   ...(prev.setHistory || []),
      {
        scoreA: prev.scoreA,
        scoreB: prev.scoreB,
      },
    ]
    return newStats
  })

  setPendingSetWinner(null)
}

  const getTargetScore = () => {
  return stats.currentSet === 3 ? 15 : 21
  }

  const checkSetWinner = (
  scoreA: number,
  scoreB: number
) => {

  const target = getTargetScore()

  const hasTeamAWon =
    scoreA >= target &&
    scoreA - scoreB >= 2

  const hasTeamBWon =
    scoreB >= target &&
    scoreB - scoreA >= 2

  if (!hasTeamAWon && !hasTeamBWon)
    return null

  return hasTeamAWon ? "A" : "B"
}

  const [log, setLog] = useState<LogItem[]>(
  game.log || []
)

  const [showPlayerEditor, setShowPlayerEditor] =
  useState(false)

  // Player order
  const playerOrder =
    Object.keys(playerNames).map(Number)


  // Handle stat click
  const handleClick = (
    player: number,
    type: string
  ) => {

    const key = type + player
    const totalPointsKey = "totalPoints" + player
    const plussesMinusesKey =
      "plussesMinuses" + player

    setStats((prev) => {

      const newStats = {
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }

      const isTeamAPlayer =
        player <= game.teamASize
      const isError = type.includes("Error")

      if (isTeamAPlayer) {

        if (isError) {
          newStats.scoreB = prev.scoreB + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) - 1

        } else {

          newStats.scoreA = prev.scoreA + 1

          newStats[totalPointsKey] =
            (prev[totalPointsKey] || 0) + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) + 1
        }

      } else {

        if (isError) {

          newStats.scoreA = prev.scoreA + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) - 1

        } else {

          newStats.scoreB = prev.scoreB + 1

          newStats[totalPointsKey] =
            (prev[totalPointsKey] || 0) + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) + 1
        }
      }

      // Set winner
      const winner = checkSetWinner(
          newStats.scoreA,
          newStats.scoreB
        )

        if (winner === "A" || winner === "B") {

          setPendingSetWinner(winner)

          setPendingSetScore({
            scoreA: newStats.scoreA,
            scoreB: newStats.scoreB,
          })

          return newStats
        }
      return newStats
    })

    setLog((prev) => [
      ...prev,
      { player, type },
    ])
  }
  // Save
const handleSaveMatch = async () => {

  if (!game?.id) return

  await fetch(
    `${API_URL}/games/${game.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        scoreA: stats.scoreA,
        scoreB: stats.scoreB,
        stats,
        log,
        playerNames,
      }),
    }
  )

  alert("Match saved!")
}
  
  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank", "width=1000,height=800")
  
    if (!printWindow) {
      alert("Allow popups to download the PDF.")
      return
    }
  
    const players =
        Object.keys(playerNames)
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


  // Undo
  const handleUndo = () => {

    const last = log[log.length - 1]

    if (!last) return

    const key = last.type + last.player
    const totalPointsKey =
      "totalPoints" + last.player

    const plussesMinusesKey =
      "plussesMinuses" + last.player

    setStats((prev) => {

      const newStats = {
        ...prev,
        [key]: Math.max(
          (prev[key] || 0) - 1,
          0
        ),
      }

      const isTeamAPlayer =
        last.player <= 2

      const isError =
        last.type.includes("Error")

      if (isTeamAPlayer) {

        if (isError) {

          newStats.scoreB =
            Math.max(prev.scoreB - 1, 0)

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) + 1

        } else {

          newStats.scoreA =
            Math.max(prev.scoreA - 1, 0)

          newStats[totalPointsKey] =
            Math.max(
              (prev[totalPointsKey] || 0) - 1,
              0
            )

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) - 1
        }

      } else {

        if (isError) {

          newStats.scoreA =
            Math.max(prev.scoreA - 1, 0)

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) + 1

        } else {

          newStats.scoreB =
            Math.max(prev.scoreB - 1, 0)

          newStats[totalPointsKey] =
            Math.max(
              (prev[totalPointsKey] || 0) - 1,
              0
            )

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) - 1
        }
      }

      return newStats
    })

    setLog((prev) => prev.slice(0, -1))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-white py-10 px-6">

      <div className="mx-auto max-w-7xl space-y-6">

        <MatchHeader
          currentSet={stats.currentSet}
          setsWonA={stats.setsWonA}
          setsWonB={stats.setsWonB}
          scoreA={stats.scoreA}
          scoreB={stats.scoreB}
          playerNames={playerNames}
          setHistory={stats.setHistory}
          teamA={game?.teamA || "Team A"}
          teamB={game?.teamB || "Team B"}
        />

        {/* Controls */}
        <div className="flex flex-wrap gap-3">

          <Link
            to="/games"
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-600"
          >
            Back to Games
          </Link>

          <button
            onClick={handleSaveMatch}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold hover:bg-green-500"
          >
            Save Match
          </button>
          <button
            onClick={() => setShowPlayerEditor(true)}
            className="
              rounded-xl
              bg-slate-700
              px-4
              py-2
              text-sm
              font-bold
              hover:bg-slate-600
            "
          >
            Edit Players
          </button>
          <button
            onClick={handleDownloadPdf}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold hover:bg-sky-500"
          >
            Export PDF
          </button>

          <button
            onClick={() =>
              setLayoutMode((prev) =>
                prev === "horizontal"
                  ? "vertical"
                  : "horizontal"
              )
            }
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-600"
          >
            {layoutMode === "horizontal"
              ? "↕ Stack Teams"
              : "↔ Side by Side"}
          </button>

        </div>

        <div className="">

          <div className="space-y-6">

            <PlayerGrid
              playerOrder={playerOrder}
              playerNames={playerNames}
              selectedPlayer={selectedPlayer}
              stats={stats}
              setSelectedPlayer={setSelectedPlayer}
            />

            <ActionPanel
              selectedPlayer={selectedPlayer}
              playerNames={playerNames}
              handleClick={handleClick}
              setSelectedPlayer={setSelectedPlayer}
            />

            <StatTable
              stats={stats}
              playerNames={playerNames}
            />
            <RecentEvents
              log={log}
              playerNames={playerNames}
              handleUndo={handleUndo}
            />
          </div>
          {pendingSetWinner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl">

              <h2 className="text-2xl font-bold text-white">
                End Set?
              </h2>

              <p className="mt-3 text-slate-300">
                Final score:
                {" "}
                {pendingSetScore.scoreA}
                {" - "}
                {pendingSetScore.scoreB}
              </p>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={handleConfirmSet}
                  className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-500"
                >
                  Confirm
                </button>

                <button
                  onClick={() => setPendingSetWinner(null)}
                  className="flex-1 rounded-xl bg-slate-700 px-4 py-3 font-bold text-white hover:bg-slate-600"
                >
                  Cancel
                </button>

              </div>
            </div>
          </div>
        )}
        <PlayerEditorModal
          open={showPlayerEditor}
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          onClose={() => setShowPlayerEditor(false)}
        />

        </div>
      </div>
    </div>
  )
}

export default BeachMatch