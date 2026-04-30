import { useEffect, useState } from "react"
import NewMatchModel from "../components/NewMatchModel"
import MatchCard from "../components/MatchCard"

const API_URL = "http://localhost:5000"

type NewGameData = {
    teamA: string,
    teamB: string,
    date: string
}

type Game = NewGameData & {
    id: number
    scoreA: number
    scoreB: number
}



const GamesPage = () => {
    const [games, setGames] = useState<Game[]>([])
    const [showModel, setShowModel] = useState(false)


    const handleCreateGame = async (newGame: NewGameData) => {
        const res = await fetch(`${API_URL}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newGame)
        })
        const createdGame = await res.json()
        console.log(createdGame)
        setGames((prev) => [createdGame, ...prev])
        setShowModel(false)
    }

    const handleDeleteGame = async (id:number) => {
        await fetch(`${API_URL}/games/${id}`, {
            method: "Delete",
        })
        setGames((prev) => prev.filter((game) => game.id !== id))

    }

    useEffect(() => {
        fetch(`${API_URL}/games`)
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch((err) => console.error(err))
    }, [])

  return (
    <div className="min-h-screen text-white px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              RallyIQ
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Games
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              View saved matches, continue stat tracking, or start a new game.
            </p>
          </div>

          <button onClick={() => setShowModel(true)} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95">
            + New Match
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {showModel && (
            <NewMatchModel 
            onClose={() => setShowModel(false)} 
            onCreateGame={handleCreateGame}
            />
          )}
          {games.map((game) => (
            <MatchCard key={game.id}
            {...game} 
            onDelete={handleDeleteGame}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GamesPage