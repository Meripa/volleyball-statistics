type Props = {
  currentSet: number
  setsWonA: number
  setsWonB: number

  scoreA: number
  scoreB: number

  teamA: string
  teamB: string

  playerNames: Record<string, string>

  setHistory: {
    scoreA: number
    scoreB: number
  }[]
}

const MatchHeader = ({
  currentSet,
  setsWonA,
  setsWonB,
  scoreA,
  scoreB,
  playerNames,
  setHistory,
}: Props) => {

  return (
    <div className="rounded-2xl bg-[#121821] px-6 py-4 shadow-lg">

      {/* Top row */}
      <div className="flex items-center justify-between">

        {/* Team A */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Team A
          </p>

          <h2 className="text-lg font-bold text-white">
            {playerNames["1"]} / {playerNames["2"]}
          </h2>
        </div>

        {/* Center */}
        <div className="text-center">

          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Set {currentSet}
          </p>

          <div className="mt-1 text-4xl font-black tracking-tight text-white">

            {scoreA}

            <span className="mx-2 text-slate-600">
              -
            </span>

            {scoreB}

          </div>

          <p className="mt-1 text-xs text-slate-400">
            Sets {setsWonA} - {setsWonB}
          </p>

        </div>

        {/* Team B */}
        <div className="text-right">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Team B
          </p>

          <h2 className="text-lg font-bold text-white">
            {playerNames["3"]} / {playerNames["4"]}
          </h2>
        </div>

      </div>

      {/* Previous sets */}
      {setHistory?.length > 0 && (

        <div className="mt-4 flex justify-center gap-2">

          {setHistory.map((set, index) => (

            <div
              key={index}
              className="
                rounded-md
                bg-slate-800
                px-2.5
                py-1
                text-xs
                font-medium
                text-slate-300
              "
            >
              {set.scoreA}-{set.scoreB}
            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default MatchHeader