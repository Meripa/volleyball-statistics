import { useState } from "react"
type NewGameData = {
    teamA: string,
    teamB: string,
    date: string,
}

type Props = {
  onClose: () => void
  onCreateGame: (game: NewGameData) => void
}

const NewMatchModal = ({ onClose, onCreateGame }: Props) => {
    // For date
    const today = new Date().toISOString().split("T")[0]
    const [teamA, setTeamA] = useState("")
    const [teamB, setTeamB] = useState("")
    const [date, setDate] = useState(today)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!teamA.trim() || !teamB.trim()) return

    onCreateGame({
        teamA,
        teamB,
        date,
        })
    }
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
              placeholder="Tartu"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Team B
            </label>
            <input
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="Tallinn"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
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
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500"
            >
              Create match
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewMatchModal