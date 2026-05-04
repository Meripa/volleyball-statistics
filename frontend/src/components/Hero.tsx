import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Main Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
          RallyIQ
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto">
          To start - Start New match, Create game and start tracking in game events. Provides also overall scoreboard.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/games"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-semibold text-lg transition-all active:scale-95"
          >
            Go to games!
          </Link>

        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="p-8 bg-slate-900/70 border border-slate-800 rounded-3xl hover:border-slate-600 transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-3">Detailed Statistics</h3>
            <p className="text-slate-400">
              Track points, serves, blocks, attacks, reception and errors in every match.
            </p>
          </div>

          <div className="p-8 bg-slate-900/70 border border-slate-800 rounded-3xl hover:border-slate-600 transition">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-3">Match History</h3>
            <p className="text-slate-400">
              Save all your matches and see your progress over time.
            </p>
          </div>

          <div className="p-8 bg-slate-900/70 border border-slate-800 rounded-3xl hover:border-slate-600 transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-2xl font-bold mb-3">Performance Insights</h3>
            <p className="text-slate-400">
              Get efficiency metrics and understand where you need to improve.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;