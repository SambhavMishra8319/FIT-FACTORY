import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useState,
  lazy,
  Suspense,
} from "react";

import { Toaster } from "react-hot-toast";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

// Layouts
import {
  Sidebar,
  MobileHeader,
} from "./components/layout/Sidebar";

import BottomNav from "./components/layout/BottomNav";

import {
  MemberSidebar,
  MemberMobileHeader,
  MemberBottomNav,
} from "./components/layout/MemberLayout";

// Shared
import SplashScreen from "./components/system/SplashScreen";
import ErrorBoundary from "./components/system/ErrorBoundary";

import {
  UpgradePage,
} from "./components/auth/LockGate";
import MemberNotifications from "./pages/member/MemberNotifications";
// Styles
import "./index.css";
import "./styles/animations.css";
import MemberProfile from "./pages/admin/MemberProfile";
import { Workout, Diet } from "./pages/static/StaticPages";
// ── Lazy Admin Pages ─────────────────────────────────────
const Login = lazy(() =>
  import("./pages/Login")
);

const Dashboard = lazy(() =>
  import("./pages/admin/Dashboard")
);

const Members = lazy(() =>
  import("./pages/admin/Members")
);

const AddMember = lazy(() =>
  import("./pages/admin/AddMember")
);

const EditMember = lazy(() =>
  import("./pages/admin/EditMember")
);

const BCA = lazy(() =>
  import("./pages/admin/BCA")
);

const SteamBath = lazy(() =>
  import("./pages/admin/SteamBath")
);

const Payments = lazy(() =>
  import("./pages/admin/Payments")
);

const Notifications = lazy(() =>
  import("./pages/admin/Notifications")
);

const Equipment = lazy(() =>
  import("./pages/shared/EquipmentGuide") // OR move later
);

const Analytics = lazy(() =>
  import("./pages/admin/Analytics")
);

const BalanceSheet = lazy(() =>
  import("./pages/admin/BalanceSheet")
);

const Progress = lazy(() =>
  import("./pages/admin/Progress")
);

const Leaderboard = lazy(() =>
  import("./pages/admin/Leaderboard")
);

const StaticPages = lazy(() =>
  import("./pages/static/StaticPages")
);

// ── Lazy Member Pages ────────────────────────────────────
const MemberDashboard = lazy(() =>
  import(
    "./pages/member/MemberDashboard"
  )
);

const MemberWorkout = lazy(() =>
  import(
    "./pages/member/MemberWorkout"
  )
);

const MemberDiet = lazy(() =>
  import(
    "./pages/member/MemberDiet"
  )
);

const MemberBCA = lazy(() =>
  import(
    "./pages/member/MemberBCA"
  )
);

const MemberSteam = lazy(() =>
  import(
    "./pages/member/MemberSteam"
  )
);

const MemberProgress = lazy(() =>
  import(
    "./pages/member/MemberProgress"
  )
);

// ── Loading Screen ───────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        background:
          "var(--black)",

        flexDirection: "column",

        gap: 16,
      }}
    >
      <div
        style={{
          fontFamily:
            "var(--font-display)",

          fontSize: 28,

          letterSpacing: 6,

          fontWeight: 900,

          background:
            "var(--grad-gold2)",

          WebkitBackgroundClip:
            "text",

          WebkitTextFillColor:
            "transparent",
        }}
      >
        F2 FIT FACTORY
      </div>

      <div
        style={{
          color: "var(--muted2)",

          fontSize: 12,

          fontFamily:
            "var(--font-body)",

          letterSpacing: 2,
        }}
      >
        LOADING…
      </div>
    </div>
  );
}

// ── Root Redirect ────────────────────────────────────────
function RootRedirect() {
  const {
    user,
    role,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <Navigate
      to={
        role === "admin"
          ? "/dashboard"
          : "/member/dashboard"
      }
      replace
    />
  );
}

// ── Admin Layout ─────────────────────────────────────────
function AdminLayout({
  children,
}) {
  const {
    user,
    role,
    loading,
  } = useAuth();

  if (
    loading ||
    (user && role === null)
  ) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (role === "member") {
    return (
      <Navigate
        to="/member/dashboard"
        replace
      />
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <MobileHeader />

      <div className="main-content">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>

      <BottomNav />
    </div>
  );
}

// ── Member Layout ────────────────────────────────────────
function MemberLayout({
  children,
}) {
  const {
    user,
    role,
    loading,
  } = useAuth();

  if (
    loading ||
    (user && role === null)
  ) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (role === "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <div className="app-layout">
      <MemberSidebar />

      <MemberMobileHeader />

      <div className="main-content">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>

      <MemberBottomNav />
    </div>
  );
}
function AuthEquipmentWrapper({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return role === "admin" ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <MemberLayout>{children}</MemberLayout>
  );
}
// ── Shared Layout ────────────────────────────────────────
function SharedLayout({
  children,
}) {
  const {
    user,
    role,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return role === "admin" ? (
    <AdminLayout>
      {children}
    </AdminLayout>
  ) : (
    <MemberLayout>
      {children}
    </MemberLayout>
  );
}

// ── Routes ───────────────────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <RootRedirect />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/"
        element={<RootRedirect />}
      />

      {/* Admin */}
      <Route
        path="/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/bca"
        element={
          <AdminLayout>
            <BCA />
          </AdminLayout>
        }
      />

      <Route
        path="/steam"
        element={
          <AdminLayout>
            <SteamBath />
          </AdminLayout>
        }
      />

      <Route
        path="/progress"
        element={
          <AdminLayout>
            <Progress />
          </AdminLayout>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <AdminLayout>
            <Leaderboard />
          </AdminLayout>
        }
      />

      <Route
        path="/members"
        element={
          <AdminLayout>
            <Members />
          </AdminLayout>
        }
      />
      <Route
  path="/members/:id"
  element={
    <AdminLayout>
      <MemberProfile />
    </AdminLayout>
  }
/>
      <Route
  path="/workout"
  element={
    <AdminLayout>
      <Workout />
    </AdminLayout>
  }
/>

<Route
  path="/diet"
  element={
    <AdminLayout>
      <Diet />
    </AdminLayout>
  }
/>

      <Route
        path="/members/:id/edit"
        element={
          <AdminLayout>
            <EditMember />
          </AdminLayout>
        }
      />

      <Route
        path="/payments"
        element={
          <AdminLayout>
            <Payments />
          </AdminLayout>
        }
      />

      <Route
        path="/add-member"
        element={
          <AdminLayout>
            <AddMember />
          </AdminLayout>
        }
      />

      <Route
        path="/notifications"
        element={
          <AdminLayout>
            <Notifications />
          </AdminLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <AdminLayout>
            <Analytics />
          </AdminLayout>
        }
      />

      <Route
        path="/balance-sheet"
        element={
          <AdminLayout>
            <BalanceSheet />
          </AdminLayout>
        }
      />

      {/* Member */}
      <Route
        path="/member/dashboard"
        element={
          <MemberLayout>
            <MemberDashboard />
          </MemberLayout>
        }
      />

      <Route
        path="/member/workout"
        element={
          <MemberLayout>
            <MemberWorkout />
          </MemberLayout>
        }
      />

      <Route
        path="/member/diet"
        element={
          <MemberLayout>
            <MemberDiet />
          </MemberLayout>
        }
      />

      <Route
        path="/member/bca"
        element={
          <MemberLayout>
            <MemberBCA />
          </MemberLayout>
        }
      />

      <Route
        path="/member/steam"
        element={
          <MemberLayout>
            <MemberSteam />
          </MemberLayout>
        }
      />

      <Route
        path="/member/progress"
        element={
          <MemberLayout>
            <MemberProgress />
          </MemberLayout>
        }
      />

      <Route
        path="/member/upgrade"
        element={
          <MemberLayout>
            <UpgradePage />
          </MemberLayout>
        }
      />
      <Route
  path="/member/notifications"
  element={<MemberNotifications />}
/>

      {/* Shared */}
      <Route
        path="/equipments"
        element={
          <SharedLayout>
            <Equipment />
          </SharedLayout>
        }
      />

      <Route
        path="*"
        element={<RootRedirect />}
      />
      <Route
  path="/member/equipment"
  element={
    <MemberLayout>
      <Equipment />
    </MemberLayout>
  }
/>

<Route
  path="/equipments"
  element={
    <AdminLayout>
      <Equipment />
    </AdminLayout>
  }
/>
    </Routes>
    
  );
}

// ── App ──────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] =
    useState(true);

  return (
    <AuthProvider>
      <BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
        {showSplash && (
          <SplashScreen
            onDone={() =>
              setShowSplash(false)
            }
          />
        )}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background:
                "#141414",

              color: "#f0f0f0",

              border:
                "1px solid #2a2a2a",

              fontFamily:
                "'Exo 2',sans-serif",

              fontSize: "13px",

              maxWidth: "340px",
            },

            success: {
              iconTheme: {
                primary:
                  "#22c55e",

                secondary:
                  "#fff",
              },
            },

            error: {
              iconTheme: {
                primary:
                  "#e63329",

                secondary:
                  "#fff",
              },
            },
          }}
        />

        <Suspense
          fallback={<LoadingScreen />}
        >
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}   

