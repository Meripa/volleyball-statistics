import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Link } from "react-router-dom"

import type {
  Game,
  Stats,
  LogItem,
} from "../../types/match"

import { API_URL } from "../../components/Games"
import MatchHeader from "../../components/match/MatchHeader"
import ActionPanel from "../../components/match/ActionPanel"
import RecentEvents from "../../components/match/RecentEvents"
import PlayerEditorModal from "../../components/match/PlayerEditorModal"
import StatTable from "../../components/StatTable"

type Props = {
  game: Game
}

const generatePlayers = (
  teamASize: number,
  teamBSize: number
) => {

  const totalPlayers =
    teamASize + teamBSize

  const result: Record<string, string> = {}

  for (
    let i = 1;
    i <= totalPlayers;
    i++
  ) {

    result[i.toString()] =
      `Player ${i}`
  }

  return result
}

const TrainingMatch = ({
  game,
}: Props) => {
  const { getToken } = useAuth()
  const canManage =
    game.canManage !== false

  const [selectedPlayer, setSelectedPlayer] =
    useState<number | null>(null)

  const [playerNames, setPlayerNames] =
    useState({

      ...generatePlayers(
        game.teamASize,
        game.teamBSize
      ),

      ...(game.playerNames || {}),
    })

  const [stats, setStats] =
    useState<Stats>({
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
    useState<"match" | number>(
      "match"
    )

  const [log, setLog] =
    useState<LogItem[]>(
      game.log || []
    )

  const teamAPlayers =
    Object.keys(playerNames)
      .map(Number)
      .filter(
        (player) =>
          player <= game.teamASize
      )

  const teamBPlayers =
    Object.keys(playerNames)
      .map(Number)
      .filter(
        (player) =>
          player > game.teamASize
      )

  const TARGET_SCORE = 25
  const checkSetWinner = (
  scoreA: number,
  scoreB: number
  ) => {

    const target = TARGET_SCORE

    const hasTeamAWon =
      scoreA >= target &&
      scoreA - scoreB >= 2

    const hasTeamBWon =
      scoreB >= target &&
      scoreB - scoreA >= 2

    if (!hasTeamAWon && !hasTeamBWon)
      return null

    return hasTeamAWon
      ? "A"
      : "B"
  }
  const [showPlayerEditor, setShowPlayerEditor] =
    useState(false)

  const handleClick = (
    player: number,
    type: string
  ) => {
    if (!canManage) return

    if (navigator.vibrate) {
      navigator.vibrate(40)
    }

    const key = type + player
    const totalPointsKey =
      "totalPoints" + player
    const plussesMinusesKey =
      "plussesMinuses" + player
    const isTeamAPlayer =
      player <= game.teamASize
    const isError =
      type.includes("Error")
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

          [key]:
            (currentSetStats[key] || 0) + 1,
        }
        

        if (!isError) {

          updatedSetStats[totalPointsKey] =
            (
              currentSetStats[
                totalPointsKey
              ] || 0
            ) + 1
        }

        updatedSetStats[plussesMinusesKey] =
          (
            currentSetStats[
              plussesMinusesKey
            ] || 0
          ) + (isError ? -1 : 1)

        return {

          ...prev,

          [stats.currentSet]:
            updatedSetStats,
        }
      })

    setStats((prev) => {

      const newStats = {
        ...prev,

        [key]:
          (prev[key] || 0) + 1,
      }

      if (isTeamAPlayer) {

        if (isError) {

          newStats.scoreB =
            prev.scoreB + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) - 1

        } else {

          newStats.scoreA =
            prev.scoreA + 1

          newStats[totalPointsKey] =
            (prev[totalPointsKey] || 0) + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) + 1
        }

      } else {

        if (isError) {

          newStats.scoreA =
            prev.scoreA + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) - 1

        } else {

          newStats.scoreB =
            prev.scoreB + 1

          newStats[totalPointsKey] =
            (prev[totalPointsKey] || 0) + 1

          newStats[plussesMinusesKey] =
            (prev[plussesMinusesKey] || 0) + 1
        }
      }
      const winner = checkSetWinner(
          newStats.scoreA,
          newStats.scoreB
        )

        if (winner) {

          setPendingSetWinner(winner)

          setPendingSetScore({
            scoreA: newStats.scoreA,
            scoreB: newStats.scoreB,
          })
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
    const token = await getToken()
    const res = await fetch(
      `${API_URL}/games/${game.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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

    const handleConfirmSet = async () => {

  if (!canManage) return
  if (!pendingSetWinner) return

  const newStats = {
    ...stats,
  }

  if (pendingSetWinner === "A") {

    newStats.setsWonA =
      (stats.setsWonA || 0) + 1

  } else {

    newStats.setsWonB =
      (stats.setsWonB || 0) + 1
  }

  newStats.setHistory = [
    ...(stats.setHistory || []),

    {
      scoreA: stats.scoreA,
      scoreB: stats.scoreB,
    },
  ]

  newStats.currentSet += 1

  newStats.scoreA = 0
  newStats.scoreB = 0

  setStats(newStats)

  setPendingSetWinner(null)
  await saveMatchData(newStats, false)
}
  const handleUndo = () => {
    if (!canManage) return

    const last =
      log[log.length - 1]

    if (!last) return

    const key =
      last.type + last.player

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
            Math.max(
              prev.scoreB - 1,
              0
            )

          newStats[plussesMinusesKey] =
            (prev[
              plussesMinusesKey
            ] || 0) + 1

        } else {

          newStats.scoreA =
            Math.max(
              prev.scoreA - 1,
              0
            )

          newStats[totalPointsKey] =
            Math.max(
              (prev[
                totalPointsKey
              ] || 0) - 1,
              0
            )

          newStats[plussesMinusesKey] =
            (prev[
              plussesMinusesKey
            ] || 0) - 1
        }

      } else {

        if (isError) {

          newStats.scoreA =
            Math.max(
              prev.scoreA - 1,
              0
            )

          newStats[plussesMinusesKey] =
            (prev[
              plussesMinusesKey
            ] || 0) + 1

        } else {

          newStats.scoreB =
            Math.max(
              prev.scoreB - 1,
              0
            )

          newStats[totalPointsKey] =
            Math.max(
              (prev[
                totalPointsKey
              ] || 0) - 1,
              0
            )

          newStats[plussesMinusesKey] =
            (prev[
              plussesMinusesKey
            ] || 0) - 1
        }
      }

      return newStats
    })

    setLog((prev) =>
      prev.slice(0, -1)
    )
    
  }
  const displayedStats =
    selectedStatsView === "match"
      ? stats
      : {
          scoreA: 0,
          scoreB: 0,

          ...(setStatsData[
            selectedStatsView
          ] || {}),
        }

  const handleSaveMatch = async () => {
    if (!canManage) return
    await saveMatchData(stats)
  }

  return (
    <div className="
      min-h-screen
      bg-linear-to-br
      from-slate-950
      via-slate-900
      to-black
      p-6
      text-white
    ">

      <div className="
        mx-auto
        max-w-7xl
        space-y-6
      ">

        <MatchHeader
          currentSet={stats.currentSet}
          setsWonA={stats.setsWonA}
          setsWonB={stats.setsWonB}
          scoreA={stats.scoreA}
          scoreB={stats.scoreB}
          playerNames={playerNames}
          setHistory={stats.setHistory}
          teamA={game.teamA}
          teamB={game.teamB}
        />
        <div className="flex flex-wrap gap-3">

        <Link
          to="/games"
          className="
            rounded-xl
            bg-slate-800
            px-4
            py-2
            text-sm
            font-bold
            text-white
            hover:bg-slate-700
          "
        >
          Back to Games
        </Link>

        {canManage && (
          <>
            <button
              onClick={handleSaveMatch}
              className="
                rounded-xl
                bg-green-600
                px-4
                py-2
                text-sm
                font-bold
                text-white
                hover:bg-green-500
              "
            >
              Save Match
            </button>

            <button
              onClick={() =>
                setShowPlayerEditor(true)
              }

              className="
                rounded-xl
                bg-slate-800
                px-4
                py-2
                text-sm
                font-bold
                text-white
                hover:bg-slate-700
              "
            >
              Edit Players
            </button>

            <button
              onClick={() => {

                if (
                  stats.scoreA === 0 &&
                  stats.scoreB === 0
                ) return

                const winner =
                  stats.scoreA > stats.scoreB
                    ? "A"
                    : "B"

                setPendingSetWinner(winner)

                setPendingSetScore({
                  scoreA: stats.scoreA,
                  scoreB: stats.scoreB,
                })
              }}

              className="
                rounded-xl
                bg-orange-600
                px-4
                py-2
                text-sm
                font-bold
                text-white
                hover:bg-orange-500
              "
            >
              End Set
            </button>
          </>
        )}
      </div>

        {canManage && (
          <div className="
            grid
            gap-6
            lg:grid-cols-3
          ">

            {/* TEAM A */}
            <div className="
              rounded-2xl
              bg-slate-900/80
              p-4
            ">

              <h2 className="
                mb-4
                text-lg
                font-bold
              ">
                {game.teamA}
              </h2>

              <div className="space-y-2">

                {teamAPlayers.map((player) => (

                  <button
                    key={player}

                    onClick={() =>
                      setSelectedPlayer(player)
                    }

                    className={`
                      w-full
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      transition

                      ${
                        selectedPlayer === player
                          ? "bg-cyan-600"
                          : "bg-slate-800 hover:bg-slate-700"
                      }
                    `}
                  >
                    {
                      playerNames[player]
                    }
                  </button>

                ))}

              </div>
            </div>
        

            {/* ACTIONS */}
            <ActionPanel
              selectedPlayer={selectedPlayer}
              playerNames={playerNames}
              handleClick={handleClick}
              setSelectedPlayer={setSelectedPlayer}
            />

            {/* TEAM B */}
            <div className="
              rounded-2xl
              bg-slate-900/80
              p-4
            ">

              <h2 className="
                mb-4
                text-lg
                font-bold
              ">
                {game.teamB}
              </h2>

              <div className="space-y-2">

                {teamBPlayers.map((player) => (

                  <button
                    key={player}

                    onClick={() =>
                      setSelectedPlayer(player)
                    }

                    className={`
                      w-full
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      transition

                      ${
                        selectedPlayer === player
                          ? "bg-cyan-600"
                          : "bg-slate-800 hover:bg-slate-700"
                      }
                    `}
                  >
                    {
                      playerNames[player]
                    }
                  </button>

                ))}

              </div>
            </div>

          </div>
        )}
      <div className="space-y-4">

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() =>
              setSelectedStatsView(
                "match"
              )
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
            length: stats.currentSet
          }).map((_, index) => {

            const setNumber =
              index + 1

            return (

              <button
                key={setNumber}

                onClick={() =>
                  setSelectedStatsView(
                    setNumber
                  )
                }

                className={`
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-bold

                  ${
                    selectedStatsView ===
                    setNumber
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

            <div className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/70
              p-4
            ">

              <div className="
                w-full
                max-w-md
                rounded-2xl
                bg-slate-900
                p-6
                shadow-2xl
              ">

                <h2 className="
                  text-2xl
                  font-bold
                  text-white
                ">
                  End Set?
                </h2>

                <p className="
                  mt-3
                  text-slate-300
                ">
                  Final score:

                  {" "}

                  {pendingSetScore.scoreA}

                  {" - "}

                  {pendingSetScore.scoreB}
                </p>

                <div className="
                  mt-6
                  flex
                  gap-3
                ">

                  <button
                    onClick={handleConfirmSet}

                    className="
                      flex-1
                      rounded-xl
                      bg-green-600
                      px-4
                      py-3
                      font-bold
                      text-white
                      hover:bg-green-500
                    "
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() =>
                      setPendingSetWinner(null)
                    }

                    className="
                      flex-1
                      rounded-xl
                      bg-slate-700
                      px-4
                      py-3
                      font-bold
                      text-white
                      hover:bg-slate-600
                    "
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
          onClose={() =>
            setShowPlayerEditor(false)
          }
        />
    </div>
  )
}

export default TrainingMatch
