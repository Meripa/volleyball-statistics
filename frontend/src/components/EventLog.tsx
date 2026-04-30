const statLabels: Record<string, string> = {
  serveAce: "Serve Ace",
  serveError: "Serve Error",
  attackPoint: "Attack Point",
  attackError: "Attack Error",
  receptionError: "Reception Error",
  blockPoint: "Block Point",
};

type LogEvent = {
    player: number;
    type: string;
}

type Props = {
    log: LogEvent[];
    undo: () => void;
};


const EventLog = ({log, undo}: Props) => {
  return (
    <div className=" bg-gray-900 p-4 rounded-xl" >
    <h2 className="text-xl mb-3 text-white">Event Log</h2>
      <button
            onClick={undo}
            disabled={log.length === 0}
            className="bg-orange-500 hover:bg-orange-600 disabled:hidden text-white px-3 py-1 rounded"
        >
            Undo
        </button>

    <div className="h-64 overflow-y-auto space-y-1 ">
        {[...log].reverse().map((event, index) => (
        <div 
            key={index}
            className="text-white py-1 border-b border-gray-700"
        >
            {log.length - index}. Player {event.player} - {statLabels[event.type]}
        </div>
        ))}
    </div>
    </div>
  );
};
 
export default EventLog