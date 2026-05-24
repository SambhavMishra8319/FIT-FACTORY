import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import { Sidebar, MobileHeader } from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import { MemberSidebar, MemberMobileHeader, MemberBottomNav } from "./components/MemberLayout";

// Admin pages
import Login         from "./pages/Login";
import Dashboard     from "./pages/Dashboard";
import Members       from "./pages/Members";
import AddMember     from "./pages/AddMember";
import EditMember    from "./pages/EditMember";
import BCA           from "./pages/BCA";
import SteamBath     from "./pages/SteamBath";
import SteamSlotManager from "./pages/SteamSlotManager";
import Payments      from "./pages/Payments";
import Notifications from "./pages/Notifications";
import { Workout, Diet } from "./pages/StaticPages";
import Equipment  from "./pages/EquipmentGuide";
import {Analytics}     from "./pages/Analytics";
import BalanceSheet from "./pages/BalanceSheet";
import Progress    from "./pages/Progress";
import Leaderboard from "./pages/Leaderboard";

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard";
import { MemberWorkout, MemberDiet, MemberBCA, MemberSteam, MemberProgress } from "./pages/member/MemberPages";
import { UpgradePage } from "./components/LockGate";

import "./index.css";
// import "./styles/main.css"
// import "./animations.css";
import "./styles/base/animations.css";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";

// ── Loading screen ───────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--black)",
      flexDirection: "column", gap: 16,
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: 28,
        letterSpacing: 6, fontWeight: 900,
        background: "var(--grad-gold2)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        F2 FIT FACTORY
      </div>
      <div style={{ color: "var(--muted2)", fontSize: 12, fontFamily: "var(--font-body)", letterSpacing: 2 }}>
        LOADING…
      </div>
    </div>
  );
}

// ── Smart root redirect ──────────────────────────────────
function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={role === "admin" ? "/dashboard" : "/member/dashboard"} replace />;
}

// ── Admin layout ─────────────────────────────────────────
function AdminLayout({ children }) {
  const { user, role, loading } = useAuth();
  // Wait until BOTH auth and role are fully resolved
  if (loading || (user && role === null)) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === "member") return <Navigate to="/member/dashboard" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <MobileHeader />
      <div className="main-content">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
      <BottomNav />
    </div>
  );
}

// ── Member layout ─────────────────────────────────────────
function MemberLayout({ children }) {
  const { user, role, loading } = useAuth();
  // Wait until BOTH auth and role are fully resolved
  if (loading || (user && role === null)) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/dashboard" replace />;
  return (
    <div className="app-layout">
      <MemberSidebar />
      <MemberMobileHeader />
      <div className="main-content">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
      <MemberBottomNav />
    </div>
  );
}

// ── Routes ───────────────────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
      <Route path="/"      element={<RootRedirect />} />

      {/* Admin */}
      <Route path="/dashboard"     element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/bca"           element={<AdminLayout><BCA /></AdminLayout>} />
      <Route path="/workout"       element={<AdminLayout><Workout /></AdminLayout>} />
      <Route path="/diet"          element={<AdminLayout><Diet /></AdminLayout>} />
      <Route path="/steam"         element={<AdminLayout><SteamBath /></AdminLayout>} />
      {/* <Route path="/steam" element={<AdminLayout><SteamSlotManager /></AdminLayout>} /> */}
      <Route path="/progress"      element={<AdminLayout><Progress /></AdminLayout>} />
      <Route path="/leaderboard"   element={<AdminLayout><Leaderboard /></AdminLayout>} />
      <Route path="/members"       element={<AdminLayout><Members /></AdminLayout>} />
      <Route path="/members/:id/edit" element={<AdminLayout><EditMember /></AdminLayout>} />
      <Route path="/payments"      element={<AdminLayout><Payments /></AdminLayout>} />
      <Route path="/add-member"    element={<AdminLayout><AddMember /></AdminLayout>} />
      <Route path="/notifications" element={<AdminLayout><Notifications /></AdminLayout>} />
      <Route path="/analytics"     element={<AdminLayout><Analytics /></AdminLayout>} />
      <Route path="/balance-sheet" element={<AdminLayout><BalanceSheet /></AdminLayout>} />

      {/* Member — free + locked */}
      <Route path="/member/dashboard" element={<MemberLayout><MemberDashboard /></MemberLayout>} />
      <Route path="/member/workout"   element={<MemberLayout><MemberWorkout /></MemberLayout>} />
      <Route path="/member/diet"      element={<MemberLayout><MemberDiet /></MemberLayout>} />
      <Route path="/member/bca"       element={<MemberLayout><MemberBCA /></MemberLayout>} />
      <Route path="/member/steam"     element={<MemberLayout><MemberSteam /></MemberLayout>} />
      <Route path="/member/progress"  element={<MemberLayout><MemberProgress /></MemberLayout>} />
      <Route path="/member/upgrade"   element={<MemberLayout><UpgradePage /></MemberLayout>} />

      {/* Shared — equipment accessible to all logged-in */}
      <Route path="/equipments" element={<MemberLayout><Equipment /></MemberLayout>} />

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
        <Toaster position="top-right" toastOptions={{
          style: { background:"#141414",color:"#f0f0f0",border:"1px solid #2a2a2a",fontFamily:"'Exo 2',sans-serif",fontSize:"13px",maxWidth:"340px" },
          success: { iconTheme: { primary:"#22c55e",secondary:"#fff" } },
          error:   { iconTheme: { primary:"#e63329",secondary:"#fff"  } },
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}