import { actions } from "./constants"

type Props = {
  selectedPlayer: number | null
  playerNames: Record<string, string>
  handleClick: (player: number, type: string) => void
  setSelectedPlayer: React.Dispatch<
    React.SetStateAction<number | null>
  >
}

const ActionPanel = ({
  selectedPlayer,
  playerNames,
  handleClick,
  setSelectedPlayer,
}: Props) => {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">
      <h2 className="text-2xl font-bold">
        {selectedPlayer
          ? playerNames[selectedPlayer]
          : "Select a Player"}
      </h2>

      <div className="mt-4 flex gap-2">
        {actions.map((action) => (
          <button
            key={action.type}
            disabled={!selectedPlayer}
            onClick={() => {
              if (!selectedPlayer) return
              handleClick(selectedPlayer, action.type)
            }}
              className={`
                ${action.color}

                flex-1
                min-w-0

                rounded-xl
                px-3
                py-3
                pt-5
                pb-5

                

                text-sm
                font-bold
                text-white

                transition-all
                duration-150

                hover:scale-[1.02]

                active:scale-95
                active:brightness-125

                disabled:cursor-not-allowed
                disabled:bg-slate-800
                disabled:text-slate-500
              `}
          >
            {action.label}
          </button>
        ))}
      </div>

      {selectedPlayer && (
        <button
          onClick={() => setSelectedPlayer(null)}
        >
          Cancel
        </button>
      )}
    </div>
  )
}

export default ActionPanel