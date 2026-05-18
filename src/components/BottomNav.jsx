import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/dashboard", icon: "⚡", label: "Home" },
  { to: "/members",   icon: "👥", label: "Members" },
  { to: "/bca",       icon: "📊", label: "BCA" },
  { to: "/steam",     icon: "🌫️", label: "Steam" },
  { to: "/payments",  icon: "💳", label: "Payments" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item${isActive ? " active" : ""}`}
        >
          <span className="bottom-nav-icon">{icon}</span>
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
