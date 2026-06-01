import { NavLink } from "react-router-dom";
import {
  Home,
  UsersRound,
  WalletCards,
  ReceiptIndianRupee,
  UserPlus,
} from "lucide-react";
const tabs = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/members", icon: UsersRound, label: "Members" },
  { to: "/payments", icon: WalletCards, label: "Payments" },
 {
  to: "/balance-sheet",
  icon: ReceiptIndianRupee,
  label: "Accounts",
},
  { to: "/add-member", icon: UserPlus, label: "Add" },
];
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? " active" : ""}`
          }
        >
          <Icon className="bottom-nav-icon" size={21} strokeWidth={2.4} />
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}