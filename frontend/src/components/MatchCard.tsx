import { Link } from "react-router-dom"
import type { Stats } from "../types/match"

type Props = {
  id: number
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  date: string
  createdByName?: string | null
  createdByEmail?: string | null
  matchType: string
  stats?: Stats
  playerNames?: Record<string, string>
  onDelete: (id: number) => void
}

const MatchCard = ({
  id,
  teamA,
  teamB,
  scoreA,
  scoreB,
  playerNames,
  matchType,
  stats,
  date,
  createdByName,
  createdByEmail,
  onDelete,
}: Props) => {

  const handleDeleteClick = () => {

    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${teamAPlayers} vs ${teamBPlayers}?`
    )

    if (!isConfirmed) return

    onDelete(id)
  }
  const hasPlayerNames =
    matchType !== "training" &&
    playerNames &&
    Object.keys(playerNames).length > 0

  const teamAPlayers =
    hasPlayerNames
      ? Object.keys(playerNames)
          .filter(
            (player) =>
              Number(player) <=
              Object.keys(playerNames).length / 2
          )
          .map(
            (player) =>
              playerNames[player]
          )
          .join(" / ")
      : teamA

  const teamBPlayers =
    hasPlayerNames
      ? Object.keys(playerNames)
          .filter(
            (player) =>
              Number(player) >
              Object.keys(playerNames).length / 2
          )
          .map(
            (player) =>
              playerNames[player]
          )
          .join(" / ")
      : teamB

  const setsWonA = stats?.setsWonA || 0
  const setsWonB = stats?.setsWonB || 0
  const setHistory = stats?.setHistory || []
  const creator =
    createdByName || createdByEmail || "Unknown"

  return (

    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/70
        px-6
        py-5
        shadow-xl
        transition
        hover:border-slate-700
      "
    >

      <div
        className="
          flex
          flex-col
          gap-6
          xl:flex-row
          xl:items-center
        "
      >

        {/* LEFT */}
        <div
          className="
            flex
            min-w-[180px]
            items-center
            justify-between
            xl:flex-col
            xl:items-start
            xl:justify-center
            xl:gap-3
          "
        >

          <span
            className="
              w-fit
              rounded-full
              bg-slate-800
              px-3
              py-1
              text-xs
              font-semibold
              text-slate-200
            "
          >
            {
              matchType === "training"
                ? "Training Match"
                : "Beach Volley"
            }
          </span>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {date}
          </p>

          <p
            className="
              max-w-[180px]
              truncate
              text-xs
              text-slate-500
            "
            title={creator}
          >
            Created by {creator}
          </p>

        </div>

        {/* CENTER */}
        <div
          className="
            flex
            flex-1
            flex-col
            items-center
            gap-6
            xl:flex-row
            xl:justify-between
          "
        >

          {/* TEAM A */}
          <div
            className="
              w-full
              xl:max-w-[300px]
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Team A
            </p>

            <h2
              className="
                mt-1
                break-words
                text-xl
                font-bold
                leading-tight
                text-white
              "
            >
              {teamAPlayers}
            </h2>

          </div>

          {/* SCORE */}
          <div
            className="
              rounded-2xl
              bg-black/40
              px-7
              py-4
              text-center
              shadow-inner
            "
          >

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-slate-500
              "
            >
              Sets
            </p>

            <p
              className="
                whitespace-nowrap
                text-4xl
                font-black
                tracking-tight
                text-white
              "
            >
              {setsWonA}

              <span className="mx-2 text-slate-500">
                :
              </span>

              {setsWonB}
            </p>

            <p
              className="
                mt-1
                text-xs
                font-semibold
                text-slate-400
              "
            >
              Points {scoreA}:{scoreB}
            </p>

            {setHistory.length > 0 && (
              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  justify-center
                  gap-1.5
                "
              >
                {setHistory.map((set, index) => (
                  <span
                    key={index}
                    className="
                      rounded-md
                      bg-slate-800
                      px-2
                      py-1
                      text-[11px]
                      font-bold
                      text-slate-300
                    "
                  >
                    {set.scoreA}-{set.scoreB}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* TEAM B */}
          <div
            className="
              w-full
              text-left
              xl:max-w-[300px]
              xl:text-right
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Team B
            </p>

            <h2
              className="
                mt-1
                break-words
                text-xl
                font-bold
                leading-tight
                text-white
              "
            >
              {teamBPlayers}
            </h2>

          </div>

        </div>

        {/* ACTIONS */}
        <div
          className="
            flex
            gap-3
          "
        >

          <Link
            to={`/games/${id}`}

            className="
              rounded-2xl
              border
              border-slate-700
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:border-blue-500
              hover:bg-blue-500/10
            "
          >
            Open
          </Link>

          <button
            onClick={handleDeleteClick}

            className="
              rounded-2xl
              border
              border-red-500/20
              px-5
              py-3
              text-sm
              font-bold
              text-red-400
              transition
              hover:bg-red-500/10
            "
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  )
}

export default MatchCard
