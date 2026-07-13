import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors";

export default function NavBar() {
  return (
    <div className="relative z-10 flex items-center justify-between max-w-4xl mx-auto px-5 pt-6 pb-2">
      <NavLink to="/" className="font-display text-xl font-semibold text-ink">
        Synapse
      </NavLink>
      <nav className="flex gap-1 bg-panel/60 border border-panelEdge rounded-full p-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-amber text-[#1c1305]" : "text-muted hover:text-ink"}`
          }
        >
          Play
        </NavLink>
        <NavLink
          to="/daily"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-amber text-[#1c1305]" : "text-muted hover:text-ink"}`
          }
        >
          Daily
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-amber text-[#1c1305]" : "text-muted hover:text-ink"}`
          }
        >
          Progress
        </NavLink>
        <NavLink
          to="/learn"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-amber text-[#1c1305]" : "text-muted hover:text-ink"}`
          }
        >
          Learn
        </NavLink>
      </nav>
    </div>
  );
}
