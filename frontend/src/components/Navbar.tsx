import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/games"
      ? location.pathname.startsWith("/games")
      : location.pathname === path;

  const navItemClass = (path: string) => `
    flex
    min-w-0
    flex-1
    flex-col
    items-center
    justify-center
    gap-0.5
    rounded-xl
    px-2
    py-2
    text-[11px]
    font-bold
    transition

    ${
      isActive(path)
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }
  `;

  return (
    <>
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

              <Link 
                to="/demo" 
                className={`font-medium transition-colors hover:text-white ${isActive('/demo') ? 'text-white' : 'text-slate-400'}`}
              >
                Demo
              </Link>

              <Link 
                to="/how-it-works" 
                className={`font-medium transition-colors hover:text-white ${isActive('/how-it-works') ? 'text-white' : 'text-slate-400'}`}
              >
                How it works
              </Link>

              <SignedIn>
                <Link
                  to="/admin/games"
                  className={`font-medium transition-colors hover:text-white ${isActive('/admin/games') ? 'text-white' : 'text-slate-400'}`}
                >
                  Admin
                </Link>
              </SignedIn>

              <SignedOut>
                <>
                  <Link to="/login"
                  className={`font-medium transition-colors hover:text-white ${isActive('/login') ? 'text-white' : 'text-slate-400'}`}
                  >
                    Login
                  </Link>

                  <Link to="/register"
                  className={`font-medium transition-colors hover:text-white ${isActive('/register') ? 'text-white' : 'text-slate-400'}`}
                  >
                    Register
                  </Link>
                </>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
              
            </div>
          </div>
        </div>
      </nav>

      <nav className="border-b border-slate-800 bg-slate-950 px-3 py-2 md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <Link to="/" className={navItemClass("/")}>
            <span className="text-base leading-none">⌂</span>
            Home
          </Link>

          <Link to="/games" className={navItemClass("/games")}>
            <span className="text-base leading-none">▦</span>
            Games
          </Link>

          <Link to="/demo" className={navItemClass("/demo")}>
            <span className="text-base leading-none">▶</span>
            Demo
          </Link>

          <Link to="/how-it-works" className={navItemClass("/how-it-works")}>
            <span className="text-base leading-none">?</span>
            Guide
          </Link>

          <SignedOut>
            <Link to="/login" className={navItemClass("/login")}>
              <span className="text-base leading-none">↗</span>
              Login
            </Link>
          </SignedOut>

          <SignedIn>
            <Link to="/admin/games" className={navItemClass("/admin/games")}>
              <span className="text-base leading-none">★</span>
              Admin
            </Link>
          </SignedIn>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
