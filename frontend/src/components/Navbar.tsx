import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="RallyIQ Logo" 
              className="h-9 w-auto" 
            />
            <span className="font-bold text-2xl tracking-tight text-white">
              RallyIQ
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
           <Link 
              to="/games" 
              className={`font-medium transition-colors hover:text-white ${isActive('/games') ? 'text-white' : 'text-slate-400'}`}
            >
              Games
            </Link>

            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-white ${isActive('/') ? 'text-white' : 'text-slate-400'}`}
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
