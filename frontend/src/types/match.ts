// Stats type
export type Stats = {
  [key: string]: number | any

  scoreA: number
  scoreB: number

  setsWonA: number
  setsWonB: number

  currentSet: number

  setHistory: {
    scoreA: number
    scoreB: number
  }[]
}

export type MatchType =
  | "beach"
  | "training"

// Game type



export type Game = {
  id: number

  matchType: MatchType

  teamASize: number
  teamBSize: number

  teamA: string
  teamB: string

  date: string

  scoreA: number
  scoreB: number

  stats?: Stats
  log?: LogItem[]
  playerNames?: Record<string, string>
}

// Log type

export type LogItem = {
    player: number
    type: string
}


