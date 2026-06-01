import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
// import "MemberLayout.css";
import "../../styles/MemberLayout.css";
import BrandLogo from "../common/BrandLogo";
import { House, Dumbbell, Salad, TrendingUp, Activity } from "lucide-react";
import { useEffect } from "react";
const bottomTabs = [
  { to: "/member/dashboard", icon: House, label: "Home" },
  { to: "/member/workout", icon: Dumbbell, label: "Workout" },
  { to: "/member/diet", icon: Salad, label: "Diet" },
  { to: "/member/progress", icon: TrendingUp, label: "Progress" },
  { to: "/member/bca", icon: Activity, label: "BCA" },
];
// const memberNav = [
//     {
//     to: "/member/notifications",
//     icon: "🔔",
//     label: "Notifications",
//   },

//   { to: "/member/dashboard", icon: "⚡", label: "Home" },
//   { to: "/member/workout",   icon: "🏋️", label: "Workout" },
//   { to: "/member/diet",      icon: "🥗", label: "Diet" },
//   { to: "/member/bca",       icon: "📊", label: "My BCA" },
//   { to: "/member/steam",     icon: "🌫️", label: "Steam" },
//   { to: "/member/progress",  icon: "📈", label: "Progress" },
//   // { to: "/equipment",        icon: "🔧", label: "Equipment" },
//   //  { to: "/member/equipment", icon: "🔧", label: "Equipment" },
//   { to: "/member/equipment", icon: "🔧", label: "Equipment Guide" },
// ];

function MemberNavLinks({ onClose }) {
  const memberNav = [
    {
      to: "/member/dashboard",
      icon: "⚡",
      label: "Dashboard",
    },
    {
      to: "/member/bca",
      icon: "📊",
      label: "BCA Analysis",
    },
    {
      to: "/member/workout",
      icon: "🏋️",
      label: "Workout Plans",
    },
    {
      to: "/member/diet",
      icon: "🥗",
      label: "Diet Plans",
    },
    {
      to: "/member/steam",
      icon: "🌫️",
      label: "Steam Bath",
    },
    {
      to: "/member/progress",
      icon: "📈",
      label: "My Progress",
    },
    {
      to: "/member/leaderboard",
      icon: "🏆",
      label: "Leaderboard",
    },
    {
      to: "/member/equipment",
      icon: "🏋️",
      label: "Equipment Guide",
    },
  ];

  return (
    <nav className="nav">
      <div className="nav-section-label">Member</div>

      {memberNav.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          onClick={onClose}
        >
          <span style={{ fontSize: 16 }}>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
// Desktop sidebar for members
export function MemberSidebar() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "M";

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        {/* <div className="logo-brand">
    <div className="logo-f2">
      F2 FIT<br />FACTORY
    </div>

    <div className="logo-owner">
      by Nimesh Mishra
    </div>

    
  </div> */}
        <BrandLogo />
      </div>
      <MemberNavLinks onClose={() => {}} />
      <div className="sidebar-footer">
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            padding: "4px 8px 8px",
          }}
        >
          {profile?.name} · {profile?.email}
        </div>
        <div
          className="sidebar-user"
          onClick={async () => {
            await logout();
            navigate("/login");
            toast.success("Logged out.");
          }}
        >
          <div className="sidebar-user-avatar" style={{ fontSize: 14 }}>
            {initials}
          </div>
          <div>
            <div className="sidebar-user-name">{profile?.name || "Member"}</div>
            <div className="sidebar-user-role">Tap to Logout →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile header + drawer for members
export function MemberMobileHeader() {
  const [open, setOpen] = useState(false);
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="mobile-header">
        <div className="mobile-logo">
          <div className="brand-title">F2 FIT-FACTORY</div>
          <div className="brand-subtitle">by Nimesh Mishra</div>
        </div>
        <button className="hamburger" onClick={() => setOpen(true)}>
          <span />
          <span />
          <span />
        </button>
      </div> */}
      <div className="mobile-header">
  <div className="mobile-brand">
    <div className="mobile-brand-logo">
      F2
    </div>

    <div className="mobile-brand-text">
      <div className="mobile-brand-name">
        FIT FACTORY
      </div>

      <div className="mobile-brand-owner">
        by Nimesh Mishra
      </div>
    </div>
  </div>

  <button className="hamburger" onClick={() => setOpen(true)}>
    <span />
    <span />
    <span />
  </button>
</div>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      <div className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          {/* <div className="logo-brand">
  <div className="logo-f2" style={{ fontSize: 18 }}>
    F2 FIT-FACTORY
  </div>

  <div className="logo-owner">
    by Nimesh Mishra
  </div>
</div> */}
          <BrandLogo small />
          {/* <div className="logo-f2" style={{ fontSize: 18 }}>F2 FIT-FACTORY</div> */}
          <button className="drawer-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <MemberNavLinks onClose={() => setOpen(false)} />
        </div>
        <div className="sidebar-footer">
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              padding: "4px 8px 8px",
            }}
          >
            {profile?.name} · {profile?.email}
          </div>
          <div
            className="sidebar-user"
            onClick={async () => {
              setOpen(false);
              await logout();
              navigate("/login");
              toast.success("Logged out.");
            }}
          >
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

// Bottom nav for members (mobile)
export function MemberBottomNav() {
  const bottomTabs = [
    { to: "/member/diet", icon: "🥗", label: "Diet" },
    { to: "/member/workout", icon: "🏋️", label: "Workout" },
    { to: "/member/dashboard", icon: "⚡", label: "Home" },
    { to: "/member/bca", icon: "📊", label: "BCA" },
    { to: "/member/steam", icon: "🌫️", label: "Steam" },
  ];

  return (
    <nav className="bottom-nav">
      {bottomTabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
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
