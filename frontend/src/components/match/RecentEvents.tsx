import type { LogItem } from "../../types/match"

type Props = {
  log: LogItem[]
  playerNames: Record<string, string>
  handleUndo: () => void
}

const RecentEvents = ({
  log,
  playerNames,
  handleUndo,
}: Props) => {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <div className="flex justify-between">
        <h2>Recent Events</h2>

        <button onClick={handleUndo}>
          Undo
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {log.slice().reverse().slice(0, 8).map((item, index) => (
          <div
            key={index}
            className="rounded-lg bg-slate-800 p-2"
          >
            {playerNames[item.player]} - {item.type}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentEvents