import type { LogItem } from "../../types/match"
import { statLabels } from "./constants"

type Props = {
  log: LogItem[]
  playerNames: Record<string, string>
  teamASize: number
  handleUndo: () => void
  canUndo?: boolean
}

const RecentEvents = ({
  log,
  playerNames,
  teamASize,
  handleUndo,
  canUndo = true,
}: Props) => {
  const getEventColor = (type: string) => {
    if (type.includes("Error")) {
      return "bg-red-600 text-white"
    }

    if (type === "serveAce") {
      return "bg-sky-500 text-white"
    }

    return "bg-green-600 text-white"
  }

  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          Recent Events
        </h2>

        {canUndo && (
          <button
            onClick={handleUndo}
            className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-slate-700"
          >
            Undo
          </button>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        {log.slice().reverse().slice(0, 12).map((item, index) => {
          const isTeamA =
            item.player <= teamASize

          const event = (
            <div
              className={`
                inline-flex
                max-w-full
                flex-col
                items-start
                gap-1
                ${isTeamA ? "" : "items-end"}
              `}
            >
              <span className="max-w-44 truncate text-xs text-slate-300">
                {playerNames[item.player] || `Player ${item.player}`}
              </span>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-bold
                  leading-none
                  ${getEventColor(item.type)}
                `}
              >
                {statLabels[item.type] || item.type}
              </span>
            </div>
          )

          return (
            <div
              key={`${item.player}-${item.type}-${index}`}
              className="
                grid
                grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
                items-center
                gap-3
                border-b
                border-slate-800
                bg-slate-950/40
                px-4
                py-3
                last:border-b-0
              "
            >
              <div className="min-w-0">
                {isTeamA && event}
              </div>

              <div className="text-center">
                <div className="text-xs text-slate-500">
                  {item.setNumber
                    ? `Set ${item.setNumber}`
                    : ""}
                </div>

                <div className="mt-1 whitespace-nowrap text-sm font-black text-white">
                  {typeof item.scoreA === "number" &&
                  typeof item.scoreB === "number"
                    ? (
                      <>
                        <span className="rounded-full bg-yellow-300 px-2 py-1 text-slate-950">
                          {item.scoreA}
                        </span>
                        <span className="mx-1 text-slate-500">
                          -
                        </span>
                        <span className="rounded-full bg-yellow-300 px-2 py-1 text-slate-950">
                          {item.scoreB}
                        </span>
                      </>
                    )
                    : "-"}
                </div>
              </div>

              <div className="min-w-0 text-right">
                {!isTeamA && event}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentEvents
