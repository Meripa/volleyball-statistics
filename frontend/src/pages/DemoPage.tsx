import BeachMatch from "./match/BeachMatch"
import type { Game } from "../types/match"

const demoGame: Game = {
  id: 0,
  matchType: "beach",
  teamASize: 2,
  teamBSize: 2,
  teamA: "Blue Side",
  teamB: "Green Side",
  date: new Date().toISOString().split("T")[0],
  scoreA: 0,
  scoreB: 0,
  visibility: "public",
  canManage: true,
  playerNames: {
    "1": "Mia",
    "2": "Karl",
    "3": "Laura",
    "4": "Rasmus",
  },
}

const DemoPage = () => {
  return <BeachMatch game={demoGame} isDemo />
}

export default DemoPage
