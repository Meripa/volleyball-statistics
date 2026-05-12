import PlayerCard from "./PlayerCard"

type Props = {
  playerOrder: number[]
  playerNames: Record<string, string>
  selectedPlayer: number | null
  stats: any
  setSelectedPlayer: React.Dispatch<
    React.SetStateAction<number | null>
  >
}

const PlayerGrid = ({
  playerOrder,
  playerNames,
  selectedPlayer,
  stats,
  setSelectedPlayer,
}: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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