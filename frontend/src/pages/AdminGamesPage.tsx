import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"

import MatchCard from "../components/MatchCard"
import { API_URL } from "../components/Games"
import type { Game } from "../types/match"

const AdminGamesPage = () => {
  const { getToken } = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadGames = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/admin/games`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to load admin games"
          )
        }

        if (isMounted) {
          setGames(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load admin games"
          )
        }
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
  }, [getToken])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading admin view...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            All Games
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            View matches created by every user.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        ) : (
          <div className="space-y-5">
            {games.map((game) => (
              <MatchCard
                key={game.id}
                {...game}
                matchType={game.matchType}
                onDelete={() => undefined}
                canDelete={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminGamesPage
