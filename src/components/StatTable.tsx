import logo from '../assets/images/logo.png'

const tds = "px-3 py-2 border border-white-700"
{/* Addable Players*/}
const players = ["1", "2", "3", "4"];
{/* Addable Results*/}
const statTypes = [
  
  "serveAce",
  "serveError",
  "attackPoint",
  "attackError",
  "receptionError",
  "blockPoint",
];

{/* Change names in inputs*/}
const statLabels: Record<string, string> = {
  serveAce: "Serve Ace",
  serveError: "Serve Error",
  attackPoint: "Attack Point",
  attackError: "Attack Error",
  receptionError: "Reception Error",
  blockPoint: "Block Point",
};

type Props = {
  stats: { [key: string]: number}
}

const StatTable = ({stats}: Props) => {
  return (
    <div className="result flex-1 bg-gray-900 p-4 rounded-2xl shadow-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr >
            {/* Creates heading for inputs */}
            <th className='border text-white'><img className="h-18 mx-auto object-fill" src={logo}/></th>
              {statTypes.map((stat) => (
              <th
                key={stat}
                className={tds}
                >
              {statLabels[stat]}
          </th>

        ))}
          </tr>
         </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player}>
                <td className={tds}>Player {player}</td>

                {statTypes.map((stat) => (
                  <td key={stat} className={tds}>
                    {stats[stat + player] || 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
  </div>
  )
}

export default StatTable