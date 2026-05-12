type Props = {
  player: number
  playerName: string
  stats: any
  isSelected: boolean
  isTeamA: boolean
  onSelect: () => void
}

const PlayerCard = ({
  player,
  playerName,
  stats,
  isSelected,
  isTeamA,
  onSelect,
}: Props) => {

  return (
    <button
      onClick={onSelect}
      className={`
        relative
        rounded-2xl
        border
        p-4
        text-left
        transition-all
        duration-200

        ${
          isSelected
            ? isTeamA
              ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)]"
              : "border-red-400 shadow-[0_0_25px_rgba(248,113,113,0.4)]"
            : "border-slate-700 hover:border-slate-500"
        }

        bg-slate-900/80
      `}
    >

      {/* Player name */}
      <h2 className="text-xl font-bold text-white">
        {playerName}
      </h2>

      {/* Stats */}
      <div className="mt-3 space-y-1 text-sm">

        <div className="flex justify-between text-slate-400">
          <span>Total</span>
          <span className="font-bold text-white">
            {stats["totalPoints" + player] || 0}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Kills</span>
          <span className="font-bold text-white">
            {stats["attackPoint" + player] || 0}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Errors</span>
          <span className="font-bold text-white">
            {stats["attackError" + player] || 0}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Aces</span>
          <span className="font-bold text-white">
            {stats["serveAce" + player] || 0}
          </span>
        </div>

      </div>

    </button>
  )
}

export default PlayerCard