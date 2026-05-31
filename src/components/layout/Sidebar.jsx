import { useState, useCallback, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "../../styles/sidebar.css";
/* ─────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────── */
const navItems = [
  {
    section: "Member",
    items: [
      { to: "/dashboard", icon: "⚡", label: "Dashboard" },
      { to: "/bca", icon: "📊", label: "BCA Analysis", badge: "USP" },
      { to: "/workout", icon: "🏋️", label: "Workout Plans" },
      { to: "/diet", icon: "🥗", label: "Diet Plans" },
      { to: "/steam", icon: "🌫️", label: "Steam Bath" },
      { to: "/progress", icon: "📈", label: "My Progress" },
      { to: "/leaderboard", icon: "🏆", label: "Leaderboard" },

      // { to: "/notifications", icon: "🔔", label: "Notifications" },
    ],
  },
  {
    section: "Admin",
    items: [
      { to: "/members", icon: "👥", label: "Members" },
      { to: "/payments", icon: "💳", label: "Payments" },
      { to: "/balance-sheet", icon: "📒", label: "Balance Sheet" },
      { to: "/analytics", icon: "📉", label: "Analytics" },

      // TRAINERS
//       { to: "/trainers", icon: "🧑‍🏫", label: "Trainers" },
//       { to: "/add-trainer", icon: "➕", label: "Add Trainer" },
//       { to: "/trainer-payments", icon: "💰", label: "Trainer Payments" },
// {
//   to: "/trainer-analytics",
//   label: "Trainer Analytics",
//   icon: "📈",
// },
{ to: "/trainers", icon: "🧑‍🏫", label: "Trainers" },
      { to: "/add-member", icon: "➕", label: "Add Member" },
      { to: "/notifications", icon: "🔔", label: "Notifications" },
      { to: "/equipments", icon: "🏋️", label: "Equipment Guide" },
    ],

    // section: "Admin",

    // items: [
    //   { to: "/members", icon: "👥", label: "Members" },
    //   { to: "/payments", icon: "💳", label: "Payments" },
    //   { to: "/balance-sheet", icon: "📒", label: "Balance Sheet" },
    //   { to: "/analytics", icon: "📉", label: "Analytics" },
    //   { to: "/add-member", icon: "➕", label: "Add Member" },
    //   { to: "/notifications", icon: "🔔", label: "Notifications" },
    //   { to: "/equipments", icon: "🏋️", label: "Equipment Guide" },
    // ],
  },
];

/* ─────────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────────── */
function NavLinks({ onClose }) {
  return (
    <nav className="nav">
      {navItems.map(({ section, items }) => (
        <div key={section}>
          <div className="nav-section-label">{section}</div>

          {items.map(({ to, icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
              onClick={onClose}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>
              {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   DESKTOP SIDEBAR
───────────────────────────────────────────── */
export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success("Logged out.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  }, [logout, navigate]);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="brand-wrap">
          <div className="logo-f2">
            <span className="logo-line1">F2 FIT</span>
            <span className="logo-line2">FACTORY</span>
          </div>

          <div className="brand-owner">by Nimesh Mishra</div>
        </div>
      </div>
      <NavLinks onClose={() => {}} />

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout}>
          <div className="sidebar-user-avatar">F2</div>

          <div>
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Tap to Logout →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE HEADER + DRAWER
───────────────────────────────────────────── */
export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    setOpen(false);
    try {
      await logout();
      toast.success("Logged out.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  }, [logout, navigate]);

  const closeDrawer = useCallback(() => setOpen(false), []);

  const email = useMemo(() => user?.email || "Admin", [user?.email]);

  return (
    <>
      {/* Top Bar */}
      <div className="mobile-header">
        <div className="mobile-logo-wrap">
          <div className="mobile-logo-main">F2 FIT-FACTORY</div>

          <div className="mobile-logo-sub">by Nimesh Mishra</div>
        </div>

        <button
          className="hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Overlay */}
      {open && <div className="drawer-overlay" onClick={closeDrawer} />}

      {/* Drawer */}
      <div className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="drawer-logo-main">F2 FIT-FACTORY</div>

            <div className="drawer-logo-sub">by Nimesh Mishra</div>
          </div>
          <button
            className="drawer-close"
            onClick={closeDrawer}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <NavLinks onClose={closeDrawer} />
        </div>

        <div className="sidebar-footer">
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              padding: "4px 8px 8px",
              textAlign: "center",
            }}
          >
            {email}
          </div>

          <div className="sidebar-user" onClick={handleLogout}>
            <div className="sidebar-user-avatar">F2</div>

            <div>
              <div className="sidebar-user-name">Admin</div>
              <div className="sidebar-user-role">Tap to Logout →</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
