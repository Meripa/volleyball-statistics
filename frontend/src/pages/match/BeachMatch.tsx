import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
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
  isDemo?: boolean
}


const BeachMatch = ({ game, isDemo = false }: Props) => {
  const { getToken } = useAuth()
  const canManage =
    game.canManage !== false

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
        game.teamASize || 2,
        game.teamBSize || 2
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

  const [setStatsData, setSetStatsData] =
    useState<Record<number, any>>({
      1: {},
      ...(game.stats?.setStatsData || {}),
    })

  const [selectedStatsView, setSelectedStatsView] =
    useState<"match" | number>("match")

  const [pendingSetWinner, setPendingSetWinner] =
    useState<"A" | "B" | null>(null)

  const [pendingSetScore, setPendingSetScore] =
  useState({
    scoreA: 0,
    scoreB: 0,
  })

  const saveMatchData = async (
    nextStats: Stats,
    showSuccess = true
  ) => {

    if (!game?.id) return false
    if (isDemo) {
      if (showSuccess) {
        alert("Demo match is not saved.")
      }

      return true
    }

    const token = await getToken()

    const res = await fetch(
      `${API_URL}/games/${game.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          scoreA: nextStats.scoreA,
          scoreB: nextStats.scoreB,
          stats: {
            ...nextStats,
            setStatsData,
          },
          log,
          playerNames,
        }),
      }
    )

    if (!res.ok) {
      alert("Save failed")
      return false
    }

    if (showSuccess) {
      alert("Match saved!")
    }

    return true
  }
  
  // Confirm set win

  const handleConfirmSet = async () => {

  if (!canManage) return
  if (!pendingSetWinner) return

  const newStats = { ...stats }

  if (pendingSetWinner === "A") {

    newStats.setsWonA =
      (stats.setsWonA || 0) + 1

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
      (stats.setsWonB || 0) + 1

    if (newStats.setsWonB === 2) {

      alert(`${game?.teamB} wins match!`)

    } else {

      newStats.currentSet += 1
      newStats.scoreA = 0
      newStats.scoreB = 0
    }
  }

  newStats.setHistory = [
    ...(stats.setHistory || []),
    {
      scoreA: stats.scoreA,
      scoreB: stats.scoreB,
    },
  ]

  setStats(newStats)

  setPendingSetWinner(null)
  await saveMatchData(newStats, false)
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
    Object.keys(playerNames)
      .map(Number)
      .sort((a, b) => a - b)


  // Handle stat click
  const handleClick = (
    player: number,
    type: string
  ) => {
    if (!canManage) return

    if (navigator.vibrate) {
      navigator.vibrate(40)
    }
    const key = type + player
    const totalPointsKey = "totalPoints" + player
    const plussesMinusesKey =
      "plussesMinuses" + player
    const isError = type.includes("Error")
    const isTeamAPlayer =
      player <= game.teamASize
    const nextScoreA =
      stats.scoreA +
      (
        isTeamAPlayer
          ? (isError ? 0 : 1)
          : (isError ? 1 : 0)
      )
    const nextScoreB =
      stats.scoreB +
      (
        isTeamAPlayer
          ? (isError ? 1 : 0)
          : (isError ? 0 : 1)
      )

    setSetStatsData((prev) => {
      const currentSetStats =
        prev[stats.currentSet] || {}

      const updatedSetStats = {
        ...currentSetStats,
        [key]: (currentSetStats[key] || 0) + 1,
      }

      if (!isError) {
        updatedSetStats[totalPointsKey] =
          (currentSetStats[totalPointsKey] || 0) + 1
      }

      updatedSetStats[plussesMinusesKey] =
        (currentSetStats[plussesMinusesKey] || 0) +
        (isError ? -1 : 1)

      return {
        ...prev,
        [stats.currentSet]: updatedSetStats,
      }
    })

    setStats((prev) => {

      const newStats = {
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }

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
      {
        player,
        type,
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        setNumber: stats.currentSet,
      },
    ])
  }
  // Save
const handleSaveMatch = async () => {
  if (!canManage) return
  await saveMatchData(stats)
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
    if (!canManage) return

    const last = log[log.length - 1]

    if (!last) return

    const key = last.type + last.player
    const totalPointsKey =
      "totalPoints" + last.player

    const plussesMinusesKey =
      "plussesMinuses" + last.player

    const currentSet = stats.currentSet

    setSetStatsData((prev) => {
      const currentSetStats =
        prev[currentSet] || {}
      const isError =
        last.type.includes("Error")

      return {
        ...prev,
        [currentSet]: {
          ...currentSetStats,
          [key]: Math.max(
            (currentSetStats[key] || 0) - 1,
            0
          ),
          [totalPointsKey]: isError
            ? currentSetStats[totalPointsKey] || 0
            : Math.max(
                (currentSetStats[totalPointsKey] || 0) - 1,
                0
              ),
          [plussesMinusesKey]:
            (currentSetStats[plussesMinusesKey] || 0) +
            (isError ? 1 : -1),
        },
      }
    })

    setStats((prev) => {

      const newStats = {
        ...prev,
        [key]: Math.max(
          (prev[key] || 0) - 1,
          0
        ),
      }

      const isTeamAPlayer =
        last.player <= game.teamASize

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

  const displayedStats =
    selectedStatsView === "match"
      ? stats
      : {
          scoreA: 0,
          scoreB: 0,
          ...(setStatsData[selectedStatsView] || {}),
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

          {canManage && (
            <>
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
            </>
          )}
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

            {canManage && (
              <>
                <PlayerGrid
                  playerOrder={playerOrder}
                  playerNames={playerNames}
                  selectedPlayer={selectedPlayer}
                  stats={stats}
                  layoutMode={layoutMode}
                  setSelectedPlayer={setSelectedPlayer}
                />

                <ActionPanel
                  selectedPlayer={selectedPlayer}
                  playerNames={playerNames}
                  handleClick={handleClick}
                  setSelectedPlayer={setSelectedPlayer}
                />
              </>
            )}

            <div className="space-y-4">

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() =>
                    setSelectedStatsView("match")
                  }
                  className={`
                    rounded-xl
                    px-4
                    py-2
                    text-sm
                    font-bold

                    ${
                      selectedStatsView === "match"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }
                  `}
                >
                  Match
                </button>

                {Array.from({
                  length: stats.currentSet,
                }).map((_, index) => {
                  const setNumber = index + 1

                  return (
                    <button
                      key={setNumber}
                      onClick={() =>
                        setSelectedStatsView(setNumber)
                      }
                      className={`
                        rounded-xl
                        px-4
                        py-2
                        text-sm
                        font-bold

                        ${
                          selectedStatsView === setNumber
                            ? "bg-cyan-600 text-white"
                            : "bg-slate-800 text-slate-300"
                        }
                      `}
                    >
                      Set {setNumber}
                    </button>
                  )
                })}

              </div>

              <StatTable
                stats={displayedStats}
                playerNames={playerNames}
              />

            </div>
            <RecentEvents
              log={log}
              playerNames={playerNames}
              teamASize={game.teamASize}
              handleUndo={handleUndo}
              canUndo={canManage}
            />
          </div>
          {canManage && pendingSetWinner && (
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
          open={canManage && showPlayerEditor}
          playerNames={playerNames}
          teamASize={game.teamASize}
          teamBSize={game.teamBSize}
          setPlayerNames={setPlayerNames}
          onClose={() => setShowPlayerEditor(false)}
        />

        </div>
      </div>
    </div>
  )
}

export default BeachMatch
