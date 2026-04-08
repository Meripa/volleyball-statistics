type Props = {
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const btn = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
const plyr = "text-2xl text-white pt-2"

const StatInput = ({handleClick}: Props) => {
  return (
    
        <div className="statistics">
            <ul className="stats-group">
                <h2 id="player1" className={plyr}>Player 1</h2>
                <button data-player="1" data-type="serveAce" className={btn} onClick={handleClick}>Serve Ace</button>
                <button data-player="1" data-type="serveError" className={btn} onClick={handleClick}>Serve Error</button>
                <button data-player="1" data-type="attackPoint" className={btn} onClick={handleClick}>Attack Point</button>
                <button data-player="1" data-type="attackError" className={btn} onClick={handleClick}>Attack Error</button>
                <button data-player="1" data-type="receptionError" className={btn} onClick={handleClick}>Reception Error</button>
                <button data-player="1" data-type="blockPoint" className={btn} onClick={handleClick}>Block Point</button>
            </ul>
            <ul className="stats-group">
                <h2 id="player2" className={plyr}>Player 2</h2>
                <button data-player="2" data-type="serveAce" className={btn} onClick={handleClick}>Serve Ace</button>
                <button data-player="2" data-type="serveError" className={btn} onClick={handleClick}>Serve Error</button>
                <button data-player="2" data-type="attackPoint" className={btn} onClick={handleClick}>Attack Point</button>
                <button data-player="2" data-type="attackError" className={btn} onClick={handleClick}>Attack Error</button>
                <button data-player="2" data-type="receptionError" className={btn} onClick={handleClick}>Reception Error</button>
                <button data-player="2" data-type="blockPoint" className={btn} onClick={handleClick}>Block Point</button>
            </ul>
            <ul className="stats-group">
                <h2 id="player3" className={plyr}>Player 3</h2>
                <button data-player="3" data-type="serveAce" className={btn} onClick={handleClick}>Serve Ace</button>
                <button data-player="3" data-type="serveError" className={btn} onClick={handleClick}>Serve Error</button>
                <button data-player="3" data-type="attackPoint" className={btn} onClick={handleClick}>Attack Point</button>
                <button data-player="3" data-type="attackError" className={btn} onClick={handleClick}>Attack Error</button>
                <button data-player="3" data-type="receptionError" className={btn} onClick={handleClick}>Reception Error</button>
                <button data-player="3" data-type="blockPoint" className={btn} onClick={handleClick}>Block Point</button>
            </ul>
            <ul className="stats-group">
                <h2 id="player4" className={plyr}>Player 4</h2>
                <button data-player="4" data-type="serveAce" className={btn} onClick={handleClick}>Serve Ace</button>
                <button data-player="4" data-type="serveError" className={btn} onClick={handleClick}>Serve Error</button>
                <button data-player="4" data-type="attackPoint" className={btn} onClick={handleClick}>Attack Point</button>
                <button data-player="4" data-type="attackError" className={btn} onClick={handleClick}>Attack Error</button>
                <button data-player="4" data-type="receptionError" className={btn} onClick={handleClick}>Reception Error</button>
                <button data-player="4" data-type="blockPoint" className={btn} onClick={handleClick}>Block Point</button>
            </ul>
        </div>
  )
}

export default StatInput