import StatInput from './StatInput'
import StatTable from './StatTable'
import {useState} from 'react'


type Stats = {
  [key: string]: number;
};

  const NewMatch = () => {
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
    };
  return (
    <div className="container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row">
        <StatInput handleClick={handleClick} />
        <StatTable stats={stats}/>
    </div>
    
    
  )
}

export default NewMatch