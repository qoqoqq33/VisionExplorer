import { Link, NavLink } from "react-router-dom";

function Navbar({ minimal = false }) {
  return (
    <header className="h-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-gradient-to-br from-sky-400 to-pink-400" />
          <span className="font-semibold">Vision Explorer</span>
        </Link>
        {!minimal && (
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a className="hover:text-white" href="#features">
              Features
            </a>
            <a className="hover:text-white" href="#docs">
              Docs
            </a>
            <a className="hover:text-white" href="#about">
              About
            </a>
          </nav>
        )}
        <div className="flex items-center gap-3">
          <NavLink
            to="/explore"
            className="px-3 py-1.5 rounded-md glass-panel text-sm"
          >
            Open App
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
