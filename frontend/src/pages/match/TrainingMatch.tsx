import { useState } from "react"

import type {
  Game,
  Stats,
  LogItem,
} from "../../types/match"

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
  const [showPlayerEditor, setShowPlayerEditor] =
    useState(false)
  const handleClick = (
    player: number,
    type: string
  ) => {

    const key = type + player

    const totalPointsKey =
      "totalPoints" + player

    const plussesMinusesKey =
      "plussesMinuses" + player

    setStats((prev) => {

      const newStats = {
        ...prev,

        [key]:
          (prev[key] || 0) + 1,
      }

      const isTeamAPlayer =
        player <= game.teamASize

      const isError =
        type.includes("Error")

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

      return newStats
    })

    setLog((prev) => [
      ...prev,
      { player, type },
    ])
  }

  const handleUndo = () => {

    const last =
      log[log.length - 1]

    if (!last) return

    const key =
      last.type + last.player

    setStats((prev) => ({

      ...prev,

      [key]: Math.max(
        (prev[key] || 0) - 1,
        0
      ),
    }))

    setLog((prev) =>
      prev.slice(0, -1)
    )
  }

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
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
        <div className="flex gap-3">

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

      </div>

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
      <PlayerEditorModal
          open={showPlayerEditor}
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          onClose={() =>
            setShowPlayerEditor(false)
          }
        />
    </div>
  )
}

export default TrainingMatch