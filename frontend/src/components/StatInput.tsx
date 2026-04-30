type Props = {
  handleClick: (player: number, stat: string) => void
}

const players = [1, 2, 3, 4]

const statTypes = [
  'serveAce',
  'serveError',
  'attackPoint',
  'attackError',
  'receptionError',
  'blockPoint',
]

const statLabels: Record<string, string> = {
  serveAce: 'Serve Ace',
  serveError: 'Serve Error',
  attackPoint: 'Attack Point',
  attackError: 'Attack Error',
  receptionError: 'Reception Error',
  blockPoint: 'Block Point',
}

const btn =
  'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'

const plyr = 'text-lg font-semibold mb-2 text-gray-300'

const StatInput = ({ handleClick }: Props) => {
  return (
    <div className="statistics flex-1 bg-gray-900 p-4 rounded-2xl shadow-lg">
      {players.map((player) => (
        <div key={player} className="stats-group mb-4">
          <h2 className={plyr}>Player {player}</h2>

          {statTypes.map((stat) => (
            <button
              key={stat}
              onClick={() => handleClick(player, stat)}
              className={btn}
            >
              {statLabels[stat]}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default StatInput