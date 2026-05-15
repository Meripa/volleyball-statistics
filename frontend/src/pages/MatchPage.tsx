import { useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useParams } from "react-router-dom"

import BeachMatch from "./match/BeachMatch"
import TrainingMatch from "./match/TrainingMatch"

import { API_URL } from "../components/Games"

import type { Game } from "../types/match"

const MatchPage = () => {

  const { id } = useParams()
  const { getToken } = useAuth()

  const [game, setGame] =
    useState<Game | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    if (!id) return

    let isMounted = true

    const loadMatch = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/games/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Match not found")
        }

        const data = await res.json()

        if (isMounted) {
          setGame(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMatch()

    return () => {
      isMounted = false
    }

  }, [id, getToken])

  if (loading) {

    return (
      <div className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-black
        text-white
      ">
        Loading match...
      </div>
    )
  }

  if (!game) {

    return (
      <div className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-black
        text-white
      ">
        Match not found
      </div>
    )
  }

  // Training
  if (game.matchType === "training") {

    return (
      <TrainingMatch
        game={game}
      />
    )
  }

  // Beach default
  return (
    <BeachMatch
      game={game}
    />
  )
}

export default MatchPage
