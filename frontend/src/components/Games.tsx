import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/clerk-react"
import NewMatchModel from "../components/NewMatchModel"
import MatchCard from "../components/MatchCard"
import type { Game } from "../types/match"

export const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://volleyball-statistics.onrender.com"

type NewGameData = {
    teamA: string,
    teamB: string,
    date: string
    matchType: "beach" | "training"
    teamASize: number
    teamBSize: number
}


const Games = () => {
    const { getToken } = useAuth()
    const { user } = useUser()
    const [games, setGames] = useState<Game[]>([])
    const [showModel, setShowModel] = useState(false)
    const [viewMode, setViewMode] =
        useState<"my" | "public">("my")

    const clerkUserHeaders = () => {
        const displayName =
            user?.fullName ||
            user?.username ||
            user?.primaryEmailAddress?.emailAddress ||
            ""

        const email =
            user?.primaryEmailAddress?.emailAddress ||
            ""

        return {
            "X-User-Name": encodeURIComponent(displayName),
            "X-User-Email": encodeURIComponent(email),
        }
    }

    const handleCreateGame = async (newGame: NewGameData) => {
        const token = await getToken()
        const res = await fetch(`${API_URL}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...clerkUserHeaders(),
            },
            body: JSON.stringify({
                ...newGame,
                createdByName:
                    user?.fullName ||
                    user?.username ||
                    user?.primaryEmailAddress?.emailAddress,
                createdByEmail:
                    user?.primaryEmailAddress?.emailAddress,
            })
        })
        const createdGame = await res.json()
        console.log(createdGame)
        setGames((prev) => [createdGame, ...prev])
        setShowModel(false)
    }

    const handleDeleteGame = async (id:number) => {
        const token = await getToken()
        await fetch(`${API_URL}/games/${id}`, {
            method: "Delete",
            headers: {
              Authorization: `Bearer ${token}`,
              ...clerkUserHeaders(),
            },
        })
        setGames((prev) => prev.filter((game) => game.id !== id))

    }

    const handleVisibilityChange = async (
        id: number,
        visibility: "private" | "public"
    ) => {
        const token = await getToken()
        const res = await fetch(
            `${API_URL}/games/${id}/visibility`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...clerkUserHeaders(),
                },
                body: JSON.stringify({
                    visibility,
                }),
            }
        )

        if (!res.ok) {
            alert("Visibility update failed")
            return
        }

        const updatedGame = await res.json()

        setGames((prev) => {
            if (
                viewMode === "public" &&
                updatedGame.visibility !== "public"
            ) {
                return prev.filter((game) => game.id !== id)
            }

            return prev.map((game) =>
                game.id === id
                    ? updatedGame
                    : game
            )
        })
    }

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const loadGames = async () => {
          try {
            const token = await getToken()
            const endpoint =
                viewMode === "my"
                    ? "/games"
                    : "/public/games"

            const res = await fetch(`${API_URL}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...clerkUserHeaders(),
                },
            })

            if (!res.ok) {
              throw new Error("Failed to load matches")
            }

            const data = await res.json()

            if (isMounted) {
              setGames(data)
            }
          } catch (err) {
            console.error(err)
          } finally {
            if (isMounted) {
              setLoading(false)
            }
          }
        }

        loadGames()

        return () => {
          isMounted = false
        }
    }, [getToken, user, viewMode])

    if (loading) {
  return (
    <div className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-linear-to-br
      from-slate-950
      via-slate-900
      to-black
    ">

      <div className="text-center">

        {/* Spinner */}
        <div className="
          mx-auto
          h-12
          w-12
          animate-spin
          rounded-full
          border-4
          border-slate-700
          border-t-cyan-400
        " />

        <p className="mt-4 text-sm text-slate-400">
          Loading matches...
        </p>

      </div>

    </div>
  )
}
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-white px-6 py-10">
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
              View your saved matches or browse public matches.
            </p>
          </div>

          <button onClick={() => setShowModel(true)} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95">
            + New Match
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode("my")}
            className={`
              rounded-xl
              px-4
              py-2
              text-sm
              font-bold
              transition

              ${
                viewMode === "my"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            My Games
          </button>

          <button
            onClick={() => setViewMode("public")}
            className={`
              rounded-xl
              px-4
              py-2
              text-sm
              font-bold
              transition

              ${
                viewMode === "public"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            Public Games
          </button>
        </div>

        <div className="space-y-5">

          {showModel && (
            <NewMatchModel 
              onClose={() => setShowModel(false)} 
              onCreateGame={handleCreateGame}
            />
          )}

          {games.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
              {viewMode === "my"
                ? "No matches yet."
                : "No public matches yet."}
            </div>
          )}

          {games.map((game) => (
            <MatchCard
              key={game.id}
              {...game}
              matchType={game.matchType}
              onDelete={handleDeleteGame}
              onVisibilityChange={
                game.canManage
                  ? handleVisibilityChange
                  : undefined
              }
            />
          ))}

        </div>
      </div>
    </div>
  )
}

export default Games
