import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "../../styles/MemberLayout.css";
import BrandLogo from "../common/BrandLogo";
import {
  LayoutDashboard,
  Activity,
  Dumbbell,
  Salad,
  Wind,
  TrendingUp,
  Trophy,
  Armchair,
  ShieldCheck,
} from "lucide-react";

function MemberNavLinks({ onClose }) {
  // const memberNav = [
  //   {
  //     to: "/member/dashboard",
  //     icon: "⚡",
  //     label: "Dashboard",
  //   },
  //   {
  //     to: "/member/bca",
  //     icon: "📊",
  //     label: "BCA Analysis",
  //   },
  //   {
  //     to: "/member/workout",
  //     icon: "🏋️",
  //     label: "Workout Plans",
  //   },
  //   {
  //     to: "/member/diet",
  //     icon: "🥗",
  //     label: "Diet Plans",
  //   },
  //   {
  //     to: "/member/steam",
  //     icon: "🌫️",
  //     label: "Steam Bath",
  //   },
  //   {
  //     to: "/member/massage",
  //     icon: <Armchair size={16} />,
  //     label: "Massage Chair",
  //   },
  //   {
  //     to: "/member/progress",
  //     icon: "📈",
  //     label: "My Progress",
  //   },
  //   {
  //     to: "/member/leaderboard",
  //     icon: "🏆",
  //     label: "Leaderboard",
  //   },
  //   {
  //     to: "/member/equipment",
  //     icon: "🏋️",
  //     label: "Equipment Guide",
  //   },
  // ];
const memberNav = [
  {
    to: "/member/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
  },
  {
    to: "/member/bca",
    icon: <Activity size={18} />,
    label: "BCA Analysis",
  },
  {
    to: "/member/workout",
    icon: <Dumbbell size={18} />,
    label: "Workout Plans",
  },
  {
    to: "/member/diet",
    icon: <Salad size={18} />,
    label: "Diet Plans",
  },
  {
    to: "/member/steam",
    icon: <Wind size={18} />,
    label: "Steam Bath",
  },
  {
    to: "/member/massage",
    icon: <Armchair size={18} />,
    label: "Massage Chair",
  },
  {
    to: "/member/progress",
    icon: <TrendingUp size={18} />,
    label: "My Progress",
  },
  {
    to: "/member/leaderboard",
    icon: <Trophy size={18} />,
    label: "Leaderboard",
  },
  {
    to: "/member/equipment",
    icon: <ShieldCheck size={18} />,
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
          <span className="nav-icon" style={{ fontSize: 16 }}>
            {icon}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

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

export function MemberMobileHeader() {
  const [open, setOpen] = useState(false);
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="mobile-header">
        <div className="mobile-brand">
          <div className="mobile-brand-logo">F2</div>

          <div className="mobile-brand-text">
            <div className="mobile-brand-name">FIT FACTORY</div>
            <div className="mobile-brand-owner">by Nimesh Mishra</div>
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
          <BrandLogo small />

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
            <div className="sidebar-user-avatar">
              {profile?.name?.charAt(0)?.toUpperCase() || "M"}
            </div>

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

export function MemberBottomNav() {
  // const bottomTabs = [
  //   {
  //     to: "/member/diet",
  //     icon: "🥗",
  //     label: "Diet",
  //   },
  //   {
  //     to: "/member/workout",
  //     icon: "🏋️",
  //     label: "Workout",
  //   },
  //   {
  //     to: "/member/dashboard",
  //     icon: "⚡",
  //     label: "Home",
  //   },
  //   {
  //     to: "/member/bca",
  //     icon: "📊",
  //     label: "BCA",
  //   },
  //   {
  //     to: "/member/steam",
  //     icon: "🌫️",
  //     label: "Steam",
  //   },
  //   {
  //     to: "/member/massage",
  //     icon: <Armchair size={18} />,
  //     label: "Massage",
  //   },
  // ];
const bottomTabs = [
  {
    to: "/member/diet",
    icon: <Salad size={20} />,
    label: "Diet",
  },
  {
    to: "/member/workout",
    icon: <Dumbbell size={20} />,
    label: "Workout",
  },
  {
    to: "/member/dashboard",
    icon: <LayoutDashboard size={20} />,
    label: "Home",
  },
  {
    to: "/member/bca",
    icon: <Activity size={20} />,
    label: "BCA",
  },
  {
    to: "/member/massage",
    icon: <Armchair size={20} />,
    label: "Massage",
  },
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