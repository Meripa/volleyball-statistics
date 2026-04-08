import StatInput from './StatInput'
import StatTable from './StatTable'
import EventLog from './EventLog';
import {useState} from 'react'



type Stats = {
  [key: string]: number;
};

  const NewMatch = () => {
    {/* For Log */}
    const [log, setLog] = useState<
      { player: string; type: string }[]
    >([]);

    {/* For Undo */}
    const handleUndo = () => {
      const last = log[log.length -1];

      if(!last) return

      const key = last.type + last.player

      setStats((prev) => ({
        ...prev,
        [key]: Math.max((prev[key] || 0) - 1, 0),
      }));

      setLog((prev) => prev.slice(0, -1));
    };

    const [stats, setStats] = useState<Stats>({});

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const player = e.currentTarget.dataset.player;
      const type = e.currentTarget.dataset.type;

      if (!player || !type) return;

      const key = type + player;

      

      setStats((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }));
      setLog((prev) => [...prev, { player, type }]);
    };
  

    
  return (
    <div className="min-h-screen text-white py-10 px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <StatInput handleClick={handleClick} />
        <StatTable stats={stats} />
        <EventLog log={log} undo={handleUndo}/>
      </div>
          

      
    </div>
    
    
  )
}

export default NewMatch