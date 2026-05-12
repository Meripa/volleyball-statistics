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

// Game type

export type Game = {
    id: number,
    teamA: string,
    teamB: string,
    date: string,
    scoreA: number,
    scoreB: number,
    playerNames?: Record<string, string>
}

// Log type

export type LogItem = {
    player: number
    type: string
}
