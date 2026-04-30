

type Props = {
  setNumber: number;
  scoreA: number;
  scoreB: number;
  teamA: string;
  teamB: string;
};

const MatchHeader = ({ setNumber, scoreA, scoreB, teamA, teamB}: Props) => {
  // Score states

  return (
    <div className="bg-[#121821] p-4 rounded-2xl shadow-lg text-center">

        <h2 className="text-gray-400 text-sm mb-1">
            Set {setNumber}
        </h2>
        <div className="text-2xl font-bold">
            {scoreA} - {scoreB}
        </div>
        <div className="text-gray-400 text-sm mt-2">
            {teamA} vs {teamB}
        </div>
    </div>
  )
}

export default MatchHeader