import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import BeachMatch from "./match/BeachMatch"
import TrainingMatch from "./match/TrainingMatch"

import { API_URL } from "../components/Games"

import type { Game } from "../types/match"

const MatchPage = () => {

  const { id } = useParams()

  const [game, setGame] =
    useState<Game | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    if (!id) return

    fetch(`${API_URL}/games/${id}`)
      .then((res) => res.json())
      .then((data) => {

        setGame(data)

      })
      .finally(() => {

        setLoading(false)

      })

  }, [id])

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