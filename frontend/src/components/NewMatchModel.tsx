import { useState } from "react"
type NewGameData = {
  teamA: string
  teamB: string

  date: string

  matchType:
    | "beach"
    | "training"

  teamASize: number
  teamBSize: number
}

type Props = {
  onClose: () => void
  onCreateGame: (game: NewGameData) => void
}


const NewMatchModal = ({ onClose, onCreateGame }: Props) => {
    const today = new Date().toISOString().split("T")[0]
    const [teamA, setTeamA] = useState("")
    const [teamB, setTeamB] = useState("")
    const [date, setDate] = useState(today)

    const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault()

      if (creating) return

      if (!teamA.trim() || !teamB.trim())
        return

      try {

        setCreating(true)

        await onCreateGame({
          teamA: teamA.trim(),
          teamB: teamB.trim(),

          date,

          matchType,

          teamASize,
          teamBSize,
        })

      } finally {

        setCreating(false)

      }
    }
    const [matchType, setMatchType] = useState<
      "beach" | "training"
    >("beach")

    const [teamASize, setTeamASize] =
     useState(2)

    const [teamBSize, setTeamBSize] =
      useState(2)

    const [creating, setCreating] =
       useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Create new match
            </h2>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
          >
            ✕ 
          </button>
        </div>

        <form onSubmit = {handleSubmit}className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Team A
            </label>
            <input
              type="text"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              maxLength={20}
              placeholder="Tartu"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
            <span className="mt-1 block text-xs text-slate-500">
              {teamA.length}/20 characters
            </span>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Team B
            </label>
            <input
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              maxLength={20}
              placeholder="Tallinn"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
            <span className="mt-1 block text-xs text-slate-500">
              {teamB.length}/20 characters
            </span>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Team A
            </label>
            
            <input
              type="date"
              
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          {/* Match Type and player count */}
          <div className="space-y-2">

          <label className="text-sm text-slate-400">
            Match Type
          </label>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => {
                setMatchType("beach")
                setTeamASize(2)
                setTeamBSize(2)
              }}

              className={`
                flex-1
                rounded-xl
                px-4
                py-3
                font-semibold
                transition

                ${
                  matchType === "beach"
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }
              `}
            >
              Beach
            </button>

            <button
              type="button"
              onClick={() =>
                setMatchType("training")
              }

              className={`
                flex-1
                rounded-xl
                px-4
                py-3
                font-semibold
                transition

                ${
                  matchType === "training"
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }
              `}
            >
              Training
            </button>

          </div>

        </div>

        {matchType === "training" && (

          <div className="grid grid-cols-2 gap-4">

            {/* Team A */}
            <div>

              <label className="text-sm text-slate-400">
                Team A Players
              </label>

              <input
                type="number"
                min={1}
                max={6}

                value={teamASize}

                onChange={(e) =>
                  setTeamASize(
                    Number(e.target.value)
                  )
                }

                className="
                  mt-2
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

            {/* Team B */}
            <div>

              <label className="text-sm text-slate-400">
                Team B Players
              </label>

              <input
                type="number"
                min={1}
                max={6}

                value={teamBSize}

                onChange={(e) =>
                  setTeamBSize(
                    Number(e.target.value)
                  )
                }

                className="
                  mt-2
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

          </div>
        )}


          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewMatchModal
