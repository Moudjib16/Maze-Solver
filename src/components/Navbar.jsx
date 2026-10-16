import { Link, NavLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-slate-900 bg-amber-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 rotate-3 grid-cols-3 gap-px rounded-xl border-2 border-slate-900 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-1.5 shadow-[2px_2px_0_0_#0f172a] transition-transform group-hover:rotate-6" aria-hidden="true">
            <span className="rounded-[2px] bg-white" />
            <span className="rounded-[2px] bg-white" />
            <span className="rounded-[2px] bg-transparent" />
            <span className="rounded-[2px] bg-transparent" />
            <span className="rounded-[2px] bg-white" />
            <span className="rounded-[2px] bg-white" />
            <span className="rounded-[2px] bg-white" />
            <span className="rounded-[2px] bg-transparent" />
            <span className="rounded-[2px] bg-white" />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            Maze<span className="text-violet-600"> Runner</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold">
          <NavItem to="/" text="Home" dot="bg-sky-400" />
          <NavItem to="/maze" text="Play" dot="bg-emerald-400" />
          <NavItem to="/docs" text="Learn" dot="bg-amber-400" />
          <NavItem to="/contact" text="Say hi" dot="bg-rose-400" />
        </nav>

        <a
          href="https://github.com/Moudjib16/AI-assignment"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0_0_#c4b5fd] transition-transform hover:-translate-y-0.5"
        >
          <FaGithub className="text-sm" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}

function NavItem({ to, text, dot }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 transition-all ${
          isActive
            ? "border-slate-900 bg-white shadow-[2px_2px_0_0_#0f172a]"
            : "border-transparent text-slate-600 hover:border-slate-900 hover:bg-white hover:text-slate-900 hover:shadow-[2px_2px_0_0_#0f172a]"
        }`
      }
    >
      <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
      {text}
    </NavLink>
  );
}
