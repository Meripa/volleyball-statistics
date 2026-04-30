import { Link} from "react-router-dom"

type Props = {
  id: number
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  date: string
  onDelete: (id:number) => void
}

const MatchCard = ({
  id, 
  teamA, 
  teamB, 
  scoreA, 
  scoreB, 
  date, 
  onDelete 
}: Props) => {
  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${teamA} vs ${teamB}?`
    )

    if (!isConfirmed) return

    onDelete(id)
  }

  
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl transition hover:-translate-y-1 hover:border-slate-700">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
          Indoor match
        </span>

        <span className="text-xs text-slate-500">{date}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Team A
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">{teamA}</h2>
        </div>

        <div className="rounded-2xl bg-slate-950 px-5 py-3 text-center shadow-inner">
          <p className="text-3xl font-black tabular-nums text-white">
            {scoreA} : {scoreB}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Team B
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">{teamB}</h2>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Link
        to={`/games/${id}`}
        className="flex-1 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
          Open
        </Link>

        <button
          onClick = {handleDeleteClick}
         className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20">
          Delete
        </button>
      </div>
    </div>
  )
}

export default MatchCard