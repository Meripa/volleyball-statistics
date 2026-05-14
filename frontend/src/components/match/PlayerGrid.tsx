import PlayerCard from "./PlayerCard"

type Props = {
  playerOrder: number[]
  playerNames: Record<string, string>
  selectedPlayer: number | null
  stats: any
  layoutMode?: "vertical" | "horizontal"
  setSelectedPlayer: React.Dispatch<
    React.SetStateAction<number | null>
  >
}

const PlayerGrid = ({
  playerOrder,
  playerNames,
  selectedPlayer,
  stats,
  layoutMode = "horizontal",
  setSelectedPlayer,
}: Props) => {
  return (
    <div
      className={
        layoutMode === "horizontal"
          ? "grid grid-cols-2 gap-4 lg:grid-cols-4"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2"
      }
    >
      {playerOrder.map((player) => {
        const isTeamA = player <= 2

        return (
          <PlayerCard
            key={player}
            player={player}
            playerName={playerNames[player]}
            stats={stats}
            isSelected={selectedPlayer === player}
            isTeamA={isTeamA}
            onSelect={() =>
              setSelectedPlayer((prev) =>
                prev === player ? null : player
              )
            }
          />
        )
      })}
    </div>
  )
}

export default PlayerGrid
