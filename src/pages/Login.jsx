import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ADMIN_CODE = "F2MANDLA2026";

const Tab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      padding: "9px 0",
      border: "none",
      borderRadius: "var(--r-sm)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "all 0.18s",
      background: active ? "var(--grad-gold)" : "transparent",
      color: active ? "var(--black)" : "var(--muted2)",
    }}
  >
    {children}
  </button>
);

const SubTab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1,
      padding: "8px 0",
      border: `1px solid ${active ? "var(--gold-dark)" : "var(--border)"}`,
      borderRadius: "var(--r-sm)",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: 12,
      cursor: "pointer",
      transition: "all 0.18s",
      background: active ? "var(--gold-dim)" : "transparent",
      color: active ? "var(--gold)" : "var(--muted2)",
    }}
  >
    {children}
  </button>
);

const ErrorBox = ({ msg }) =>
  !msg ? null : (
    <div
      style={{
        background: "rgba(230,51,41,0.1)",
        border: "1px solid rgba(230,51,41,0.25)",
        borderRadius: "var(--r-sm)",
        padding: "10px 13px",
        marginBottom: 16,
        fontSize: 12,
        color: "var(--red)",
      }}
    >
      ⚠ {msg}
    </div>
  );

const Input = ({ label, ...props }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input className="form-input" {...props} />
  </div>
);

export default function Login() {
  const {
    loginAdmin,
    signupAdmin,
    googleMemberLogin,
    activateMemberWithGoogle,
    signupNewMemberWithGoogle,
  } = useAuth();

  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const showAdmin = params.get("admin") === ADMIN_CODE;

  const [tab, setTab] = useState("member");
  const [memberTab, setMemberTab] = useState("activate");
  const [adminTab, setAdminTab] = useState("login");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const [mPhone, setMPhone] = useState("");

  const [aName, setAName] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [aPass, setAPass] = useState("");
  const [aConf, setAConf] = useState("");
  const [aCode, setACode] = useState("");

  const clear = () => setError("");

  const handleGoogleLogin = async () => {
    clear();
    setLoading(true);

    try {
      await googleMemberLogin();
      toast.success("Welcome back to F2 FIT-FACTORY 🎉");
      navigate("/member/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateMember = async (e) => {
    e.preventDefault();
    clear();

    if (!mPhone.trim()) {
      setError("Please enter your registered phone number.");
      return;
    }

    setLoading(true);

    try {
      await activateMemberWithGoogle(mPhone);
      toast.success("Account activated successfully 🎉");
      navigate("/member/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Account activation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewMemberSignup = async () => {
    clear();
    setLoading(true);

    try {
      await signupNewMemberWithGoogle();
      toast.success("Account created! Choose a plan to unlock features 🎉");
      navigate("/member/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    clear();
    setLoading(true);

    try {
      await loginAdmin(aEmail, aPass);
      toast.success("Welcome back! 💪");
      navigate("/dashboard");
    } catch {
      setError("Wrong email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    clear();

    if (aCode !== ADMIN_CODE) {
      setError("Invalid admin code. Contact the gym owner.");
      return;
    }

    if (aPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (aPass !== aConf) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signupAdmin(aEmail, aPass, aName.trim());
      toast.success(`Welcome, ${aName}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "Email already registered. Please login."
          : "Signup failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo" style={{ marginBottom: 22 }}>
          <div className="f2">
            F2 FIT
            <br />
            FACTORY
          </div>
          <div className="sub">📍 By NIMESH MISHRA</div>
        </div>

        <div
          style={{
            display: "flex",
            background: "var(--card2)",
            borderRadius: "var(--r-sm)",
            padding: 3,
            marginBottom: 22,
            gap: 3,
          }}
        >
          <Tab
            active={tab === "member"}
            onClick={() => {
              setTab("member");
              clear();
            }}
          >
            Member
          </Tab>

          {showAdmin && (
            <Tab
              active={tab === "admin"}
              onClick={() => {
                setTab("admin");
                clear();
              }}
            >
              Admin
            </Tab>
          )}
        </div>

        <ErrorBox msg={error} />

        {tab === "member" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              <SubTab
                active={memberTab === "activate"}
                onClick={() => {
                  setMemberTab("activate");
                  clear();
                }}
              >
                Activate
              </SubTab>

              <SubTab
                active={memberTab === "signup"}
                onClick={() => {
                  setMemberTab("signup");
                  clear();
                }}
              >
                New Signup
              </SubTab>

              <SubTab
                active={memberTab === "login"}
                onClick={() => {
                  setMemberTab("login");
                  clear();
                }}
              >
                Login
              </SubTab>
            </div>

            {memberTab === "activate" && (
              <form onSubmit={handleActivateMember}>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>📱</div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      letterSpacing: 2,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    ACTIVATE MEMBER ACCOUNT
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted2)" }}>
                    For members already added by gym admin
                  </div>
                </div>

                <Input
                  label="Registered Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  value={mPhone}
                  onChange={(e) => setMPhone(e.target.value)}
                  required
                  autoFocus
                />

                <div
                  style={{
                    background: "var(--gold-dim)",
                    border: "1px solid rgba(245,200,66,0.2)",
                    borderRadius: "var(--r-sm)",
                    padding: "12px 14px",
                    marginBottom: 16,
                  }}
                >
                  {[
                    "Phone number must exist in admin member list",
                    "No dummy Gmail can create active membership",
                    "After phone match, Google account will be linked",
                  ].map((f, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        display: "flex",
                        gap: 7,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ color: "var(--gold)", flexShrink: 0 }}>
                        ✓
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 13,
                    marginBottom: 14,
                  }}
                >
                  {loading ? "Activating…" : "Activate with Google →"}
                </button>

                <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted2)" }}>
                  New member?{" "}
                  <span
                    style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => setMemberTab("signup")}
                  >
                    Create locked account
                  </span>
                </div>
              </form>
            )}

            {memberTab === "signup" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>🆕</div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      letterSpacing: 2,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    NEW MEMBER SIGNUP
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted2)" }}>
                    Create account first, then buy a plan
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--gold-dim)",
                    border: "1px solid rgba(245,200,66,0.2)",
                    borderRadius: "var(--r-sm)",
                    padding: "12px 14px",
                    marginBottom: 16,
                  }}
                >
                  {[
                    "Create free account with Google",
                    "Workout, diet, BCA, steam stay locked",
                    "Buy plan or request membership from app",
                    "Admin approval/payment unlocks full access",
                  ].map((f, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        display: "flex",
                        gap: 7,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ color: "var(--gold)", flexShrink: 0 }}>
                        ✓
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNewMemberSignup}
                  disabled={loading}
                  className="btn tap-scale"
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 13,
                    marginBottom: 14,
                    background: "#fff",
                    color: "#111",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    fontWeight: 600,
                  }}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="google"
                    style={{ width: 18, height: 18 }}
                  />
                  Continue with Google
                </button>
              </div>
            )}

            {memberTab === "login" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>👋</div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      letterSpacing: 2,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    MEMBER LOGIN
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted2)" }}>
                    Existing users continue with Google
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="btn tap-scale"
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 13,
                    marginBottom: 14,
                    background: "#fff",
                    color: "#111",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    fontWeight: 600,
                  }}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="google"
                    style={{ width: 18, height: 18 }}
                  />
                  Continue with Google
                </button>
              </div>
            )}
          </>
        )}

        {showAdmin && tab === "admin" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              <SubTab
                active={adminTab === "login"}
                onClick={() => {
                  setAdminTab("login");
                  clear();
                }}
              >
                Login
              </SubTab>

              <SubTab
                active={adminTab === "signup"}
                onClick={() => {
                  setAdminTab("signup");
                  clear();
                }}
              >
                Create Account
              </SubTab>
            </div>

            {adminTab === "login" && (
              <form onSubmit={handleAdminLogin}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="admin@f2fitfactory.com"
                  value={aEmail}
                  onChange={(e) => setAEmail(e.target.value)}
                  required
                  autoFocus
                />

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-input"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={aPass}
                      onChange={(e) => setAPass(e.target.value)}
                      required
                      style={{ paddingRight: 52 }}
                    />

                    <span
                      onClick={() => setShowPass((p) => !p)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 11,
                        color: "var(--muted2)",
                        cursor: "pointer",
                      }}
                    >
                      {showPass ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading}
                  style={{ width: "100%", padding: 12, fontSize: 13 }}
                >
                  {loading ? "Logging in…" : "Admin Login →"}
                </button>
              </form>
            )}

            {adminTab === "signup" && (
              <form onSubmit={handleAdminSignup}>
                <Input
                  label="Your Name"
                  placeholder="Gym Owner / Manager"
                  value={aName}
                  onChange={(e) => setAName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="owner@f2fitfactory.com"
                  value={aEmail}
                  onChange={(e) => setAEmail(e.target.value)}
                  required
                />

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Min 6 chars"
                      value={aPass}
                      onChange={(e) => setAPass(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Re-enter"
                      value={aConf}
                      onChange={(e) => setAConf(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🔐 Admin Secret Code</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-input"
                      type={showCode ? "text" : "password"}
                      placeholder="Enter secret code"
                      value={aCode}
                      onChange={(e) => setACode(e.target.value)}
                      style={{ paddingRight: 52 }}
                      required
                    />

                    <span
                      onClick={() => setShowCode((p) => !p)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 11,
                        color: "var(--muted2)",
                        cursor: "pointer",
                      }}
                    >
                      {showCode ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading}
                  style={{ width: "100%", padding: 12, fontSize: 13 }}
                >
                  {loading ? "Creating…" : "Create Admin Account →"}
                </button>
              </form>
            )}
          </>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 10,
            color: "var(--muted)",
          }}
        >
          F2 FIT-FACTORY BY NIMESH MISHRA
        </div>
      </div>
    </div>
  );
}