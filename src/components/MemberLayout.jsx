
import { useState, useMemo, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */
const memberNav = [
  { to: "/member/dashboard", icon: "⚡", label: "Home" },
  { to: "/member/workout", icon: "🏋️", label: "Workout" },
  { to: "/member/diet", icon: "🥗", label: "Diet" },
  { to: "/member/bca", icon: "📊", label: "My BCA" },
  { to: "/member/steam", icon: "🌫️", label: "Steam" },
  { to: "/member/progress", icon: "📈", label: "Progress" },
  { to: "/equipment", icon: "🔧", label: "Equipment" },
];

/* ─────────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────────── */
function MemberNavLinks({ onClose }) {
  return (
    <nav className="nav">
      <div className="nav-section-label">My Fitness</div>

      {memberNav.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""}`
          }
          onClick={onClose}
        >
          <span style={{ fontSize: 16 }}>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   DESKTOP SIDEBAR
───────────────────────────────────────────── */
export function MemberSidebar() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const initials = useMemo(() => {
    if (!profile?.name) return "M";
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile?.name]);

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
        <div className="logo-f2">
          F2 FIT<br />FACTORY
        </div>
        <div className="logo-tagline"> By NIMESH MISHRA</div>
      </div>

      <MemberNavLinks onClose={() => {}} />

      <div className="sidebar-footer">
        <div style={{ fontSize: 11, color: "var(--muted)", padding: "4px 8px 8px" }}>
          {profile?.name || "Member"} · {profile?.email || "No email"}
        </div>

        <div className="sidebar-user" onClick={handleLogout}>
          <div className="sidebar-user-avatar" style={{ fontSize: 14 }}>
            {initials}
          </div>
          <div>
            <div className="sidebar-user-name">
              {profile?.name || "Member"}
            </div>
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
export function MemberMobileHeader() {
  const [open, setOpen] = useState(false);
  const { logout, profile } = useAuth();
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

  return (
    <>
      <div className="mobile-header">
        <div className="mobile-logo">F2 FIT FACTORY</div>

        <button className="hamburger" onClick={() => setOpen(true)}>
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      <div className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          <div className="logo-f2" style={{ fontSize: 18 }}>
            F2 FIT FACTORY
          </div>

          <button className="drawer-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <MemberNavLinks onClose={() => setOpen(false)} />
        </div>

        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: "var(--muted)", padding: "4px 8px 8px" }}>
            {profile?.name || "Member"} · {profile?.email || "No email"}
          </div>

          <div className="sidebar-user" onClick={handleLogout}>
            <div className="sidebar-user-avatar">M</div>

            <div>
              <div className="sidebar-user-name">
                {profile?.name || "Member"}
              </div>
              <div className="sidebar-user-role">Logout →</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MOBILE BOTTOM NAV
───────────────────────────────────────────── */
export function MemberBottomNav() {
  const bottomTabs = useMemo(
    () => [
      { to: "/member/dashboard", icon: "⚡", label: "Home" },
      { to: "/member/workout", icon: "🏋️", label: "Workout" },
      { to: "/member/bca", icon: "📊", label: "BCA" },
      { to: "/member/steam", icon: "🌫️", label: "Steam" },
      { to: "/member/diet", icon: "🥗", label: "Diet" },
    ],
    []
  );

  return (
    <nav className="bottom-nav">
      {bottomTabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? " active" : ""}`
          }
        >
          <span className="bottom-nav-icon">{icon}</span>
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}