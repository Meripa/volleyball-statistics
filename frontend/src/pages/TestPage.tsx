
import {useState} from 'react'

const TestPage = () => {
    const [scoreA, setScoreA] = useState(0)
  return (
    <div className='text-white'>
        <p>Score: {scoreA}</p>
        <button onClick={() => setScoreA(scoreA + 1)}>
            Team A +1
        </button>
    </div>
  )
}

export default TestPage