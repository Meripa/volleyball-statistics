import type { Game } from "../../types/match"

type Props = {
  game: Game
}

const TrainingMatch = ({
  game,
}: Props) => {

  return (
    <div className="
      min-h-screen
      bg-slate-950
      p-10
      text-white
    ">

      <h1 className="text-4xl font-black">
        Training Match
      </h1>

      <p className="mt-2 text-slate-400">
        {game.teamASize} vs {game.teamBSize}
      </p>

    </div>
  )
}

export default TrainingMatch