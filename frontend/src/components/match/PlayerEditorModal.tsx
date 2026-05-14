type Props = {
  open: boolean

  playerNames: Record<string, string>

  teamASize: number
  teamBSize: number

  setPlayerNames: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >

  onClose: () => void
}

const PlayerEditorModal = ({
  open,
  playerNames,
  setPlayerNames,
  teamASize,
  teamBSize,
  onClose,
}: Props) => {

  if (!open) return null

  const teamAPlayers = Array.from(
    { length: teamASize },
    (_, index) => (index + 1).toString()
  )

  const teamBPlayers = Array.from(
    { length: teamBSize },
    (_, index) =>
      (teamASize + index + 1).toString()
  )

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
      <div className="grid grid-cols-2 gap-6">

        {/* TEAM A */}
        <div className="space-y-3">

          <h2 className="
            text-sm
            font-bold
            uppercase
            tracking-wide
            text-cyan-400
          ">
            Team A
          </h2>

          {teamAPlayers.map((player) => (

              <div
                key={player}
                className="space-y-1"
              >

                <label className="
                  text-sm
                  text-slate-400
                ">
                  Player {player}
                </label>

                <input
                  type="text"

                  value={
                    playerNames[player]
                  }

                  onChange={(e) =>
                    setPlayerNames((prev) => ({
                      ...prev,

                      [player]:
                        e.target.value,
                    }))
                  }

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
                />

              </div>

          ))}

        </div>

        {/* TEAM B */}
        <div className="space-y-3">

          <h2 className="
            text-sm
            font-bold
            uppercase
            tracking-wide
            text-pink-400
          ">
            Team B
          </h2>

          {teamBPlayers.map((player) => (

              <div
                key={player}
                className="space-y-1"
              >

                <label className="
                  text-sm
                  text-slate-400
                ">
                  Player {player}
                </label>

                <input
                  type="text"

                  value={
                    playerNames[player]
                  }

                  onChange={(e) =>
                    setPlayerNames((prev) => ({
                      ...prev,

                      [player]:
                        e.target.value,
                    }))
                  }

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
                />

              </div>

          ))}

        </div>

      </div>

      </div>
    </div>
  )
}

export default PlayerEditorModal
