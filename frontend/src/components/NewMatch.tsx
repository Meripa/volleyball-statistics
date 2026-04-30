import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import StatInput from './StatInput'
import StatTable from './StatTable'
import EventLog from './EventLog'
import MatchHeader from './MatchHeader'


type Stats = {
  [key: string]: number
  scoreA: number
  scoreB: number
}

type LogItem = {
  player: number
  type: string
}

type Game = {
  id: number
  teamA: string
  teamB: string
  date: string
  scoreA: number
  scoreB: number
}

const NewMatch = () => {
  const [stats, setStats] = useState<Stats>({
    scoreA: 0,
    scoreB: 0,
  })

  const [game, setGame] = useState<Game | null>(null)

  const [log, setLog] = useState<LogItem[]>([])
  // Adding scores
    const handleClick = (player: number, type: string) => {
      const key = type + player
      // Total points per person
      const totalPointsKey = "totalPoints" + player
      // Plusses minuses per person
      const plussesMinusesKey = "plussesMinuses" + player

      setStats((prev) => {
        const newStats = {
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }

        const isTeamAPlayer = player <= 2;
        const isError = type.includes("Error")


        // Adding Main Score
        if (isTeamAPlayer) {
          if (isError){
            newStats.scoreB = prev.scoreB + 1
            // Plusses minuses -
            newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1
            
          }else {
            newStats.scoreA = prev.scoreA + 1
            // Total point per person
            newStats[totalPointsKey] = (prev[totalPointsKey] || 0) + 1
            newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
          } 
        } else {
          if (isError)
            newStats.scoreA = prev.scoreA + 1
          
          else {
            newStats.scoreB = prev.scoreB + 1
            // Total point per person
            newStats[totalPointsKey] = (prev[totalPointsKey] || 0) + 1
          }
        } 

        return newStats
      })

      setLog((prev) => [...prev, { player, type }])
    }

const handleSaveMatch = async () => {
  if (!id) return

  const res = await fetch(`http://localhost:5000/games/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scoreA: stats.scoreA,
      scoreB: stats.scoreB,
      stats,
      log,
    })
  })

  const updatedGame = await res.json()
  setGame(updatedGame)
}

const handleUndo = () => {
  const last = log[log.length - 1]

  if (!last) return

  const key = last.type + last.player
  const totalPointsKey = "totalPoints" + last.player
  const plussesMinusesKey = "plussesMinuses" + last.player

  setStats((prev) => {
    const newStats = {
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0),
    }

    const isTeamAPlayer = last.player <= 2
    const isError = last.type.includes("Error")

    if (isTeamAPlayer) {
      if (isError) {
        // Click: Team A player error -> scoreB +1, +/- -1
        // Undo: scoreB -1, +/- +1
        newStats.scoreB = Math.max(prev.scoreB - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
      } else {
        // Click: Team A player positive -> scoreA +1, totalPoints +1, +/- +1
        // Undo: scoreA -1, totalPoints -1, +/- -1
        newStats.scoreA = Math.max(prev.scoreA - 1, 0)
        newStats[totalPointsKey] = Math.max((prev[totalPointsKey] || 0) - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1
      }
    } else {
      if (isError) {
        // Click: Team B player error -> scoreA +1, +/- -1
        // Undo: scoreA -1, +/- +1
        newStats.scoreA = Math.max(prev.scoreA - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) + 1
      } else {
        // Click: Team B player positive -> scoreB +1, totalPoints +1, +/- +1
        // Undo: scoreB -1, totalPoints -1, +/- -1
        newStats.scoreB = Math.max(prev.scoreB - 1, 0)
        newStats[totalPointsKey] = Math.max((prev[totalPointsKey] || 0) - 1, 0)
        newStats[plussesMinusesKey] = (prev[plussesMinusesKey] || 0) - 1
      }
    }

    return newStats
  })

  setLog((prev) => prev.slice(0, -1))
}

const { id } = useParams()

useEffect(() => {
  if (!id) return

  fetch(`http://localhost:5000/games/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setGame(data)

      setStats((prev) => ({
        ...prev,
        scoreA: data.scoreA,
        scoreB: data.scoreB,
      }))
    })
    .catch((err) => console.log(err))
}, [id])

return (
  <div className="min-h-screen  from-slate-950 via-slate-900 to-slate-950 text-white py-10 px-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <MatchHeader
        setNumber={1}
        scoreA={stats.scoreA}
        scoreB={stats.scoreB}
        teamA={game?.teamA || "Team A"}
      teamB={game?.teamB || "Team B"}
      />
      <button
        onClick={handleSaveMatch}
        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
      >
        Save Match
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          <StatInput handleClick={handleClick} />

          <StatTable stats={stats} />
        </div>

        <div className="lg:sticky lg:top-6">
          <EventLog log={log} undo={handleUndo} />
        </div>
      </div>
    </div>
  </div>
)
}

export default NewMatch