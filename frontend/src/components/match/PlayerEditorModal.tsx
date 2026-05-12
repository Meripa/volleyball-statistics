type Props = {
  open: boolean

  playerNames: Record<string, string>

  setPlayerNames: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >

  onClose: () => void
}

const PlayerEditorModal = ({
  open,
  playerNames,
  setPlayerNames,
  onClose,
}: Props) => {

  if (!open) return null

  return (
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
        max-w-xl
        rounded-2xl
        bg-slate-900
        p-6
        shadow-2xl
      ">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Edit Players
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              bg-slate-800
              px-3
              py-2
              text-slate-300
              hover:bg-slate-700
            "
          >
            Close
          </button>

        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {["1", "2", "3", "4"].map((player) => (

            <label
              key={player}
              className="space-y-2"
            >

              <span className="text-sm text-slate-400">
                Player {player}
              </span>

              <input
                value={playerNames[player] || ""}

                onChange={(event) =>
                  setPlayerNames((prev) => ({
                    ...prev,
                    [player]: event.target.value,
                  }))
                }

                maxLength={20}

                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-cyan-500
                "

                placeholder={`Player ${player}`}
              />

            </label>

          ))}

        </div>

      </div>
    </div>
  )
}

export default PlayerEditorModal