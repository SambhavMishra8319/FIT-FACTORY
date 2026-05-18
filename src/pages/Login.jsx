import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ADMIN_CODE = "F2MANDLA2026";

// ── Small reusable components ────────────────────────────
const Tab = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: "9px 0", border: "none",
    borderRadius: "var(--r-sm)",
    fontFamily: "var(--font-display)", fontWeight: 700,
    fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
    cursor: "pointer", transition: "all 0.18s",
    background: active ? "var(--grad-gold)" : "transparent",
    color: active ? "var(--black)" : "var(--muted2)",
  }}>
    {children}
  </button>
);

const SubTab = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: "8px 0",
    border: `1px solid ${active ? "var(--gold-dark)" : "var(--border)"}`,
    borderRadius: "var(--r-sm)",
    fontFamily: "var(--font-body)", fontWeight: 600,
    fontSize: 12, cursor: "pointer", transition: "all 0.18s",
    background: active ? "var(--gold-dim)" : "transparent",
    color: active ? "var(--gold)" : "var(--muted2)",
  }}>
    {children}
  </button>
);

const ErrorBox = ({ msg }) => !msg ? null : (
  <div style={{
    background: "rgba(230,51,41,0.1)", border: "1px solid rgba(230,51,41,0.25)",
    borderRadius: "var(--r-sm)", padding: "10px 13px",
    marginBottom: 16, fontSize: 12, color: "var(--red)",
  }}>
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
  const { loginAdmin, signupAdmin, loginMember, signupMember } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]         = useState("member"); // "member" | "admin"
  const [memberTab, setMemberTab] = useState("login"); // "login" | "signup"
  const [adminTab, setAdminTab]   = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Member fields
  const [mName, setMName]   = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPass, setMPass]   = useState("");
  const [mGoal, setMGoal]   = useState("General Fitness");

  // Admin fields
  const [aName, setAName]   = useState("");
  const [aEmail, setAEmail] = useState("");
  const [aPass, setAPass]   = useState("");
  const [aConf, setAConf]   = useState("");
  const [aCode, setACode]   = useState("");

  const clear = () => setError("");

  const switchTab = (t) => { setTab(t); clear(); };
  const switchMemberTab = (t) => { setMemberTab(t); clear(); };
  const switchAdminTab  = (t) => { setAdminTab(t);  clear(); };

  // ── Member Login ─────────────────────────────────────────
  const handleMemberLogin = async (e) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      await loginMember(mEmail, mPass);
      toast.success("Welcome back! 💪");
      navigate("/member/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Wrong email or password. Please try again.");
      } else {
        setError("Login failed. Check your details.");
      }
    } finally { setLoading(false); }
  };

  // ── Member Signup ─────────────────────────────────────────
  const handleMemberSignup = async (e) => {
    e.preventDefault(); clear();
    if (!mName.trim())   { setError("Please enter your full name."); return; }
    if (mPass.length < 6){ setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await signupMember(mEmail, mPass, mName.trim(), mGoal);
      toast.success(`Welcome to F2 Fit Factory, ${mName}! 🎉`);
      navigate("/member/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally { setLoading(false); }
  };

  // ── Admin Login ──────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault(); clear(); setLoading(true);
    try {
      await loginAdmin(aEmail, aPass);
      toast.success("Welcome back! 💪");
      navigate("/dashboard");
    } catch {
      setError("Wrong email or password.");
    } finally { setLoading(false); }
  };

  // ── Admin Signup ─────────────────────────────────────────
  const handleAdminSignup = async (e) => {
    e.preventDefault(); clear();
    if (aCode !== ADMIN_CODE) { setError("Invalid admin code. Contact the gym owner."); return; }
    if (aPass.length < 6)     { setError("Password must be at least 6 characters."); return; }
    if (aPass !== aConf)      { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await signupAdmin(aEmail, aPass, aName.trim());
      toast.success(`Welcome, ${aName}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.code === "auth/email-already-in-use"
        ? "Email already registered. Please login."
        : "Signup failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo" style={{ marginBottom: 22 }}>
          <div className="f2">F2 FIT<br />FACTORY</div>
          <div className="sub">📍 Best Gym in Mandla</div>
        </div>

        {/* Top tabs */}
        <div style={{ display: "flex", background: "var(--card2)", borderRadius: "var(--r-sm)", padding: 3, marginBottom: 22, gap: 3 }}>
          <Tab active={tab === "member"} onClick={() => switchTab("member")}>Member</Tab>
          <Tab active={tab === "admin"}  onClick={() => switchTab("admin")}>Admin</Tab>
        </div>

        <ErrorBox msg={error} />

        {/* ══ MEMBER TAB ══════════════════════════════════ */}
        {tab === "member" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              <SubTab active={memberTab === "login"}  onClick={() => switchMemberTab("login")}>Login</SubTab>
              <SubTab active={memberTab === "signup"} onClick={() => switchMemberTab("signup")}>Create Account</SubTab>
            </div>

            {/* Member Login */}
            {memberTab === "login" && (
              <form onSubmit={handleMemberLogin}>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>👋</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 2, color: "var(--text)", marginBottom: 4 }}>WELCOME BACK</div>
                  <div style={{ fontSize: 12, color: "var(--muted2)" }}>Login with your email and password</div>
                </div>
                <Input label="Email Address" type="email" placeholder="you@email.com"
                  value={mEmail} onChange={e => setMEmail(e.target.value)} required autoFocus />
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input className="form-input" type={showPass ? "text" : "password"} placeholder="••••••••"
                      value={mPass} onChange={e => setMPass(e.target.value)} required style={{ paddingRight: 52 }} />
                    <span onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--muted2)", cursor: "pointer" }}>
                      {showPass ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading} style={{ width: "100%", padding: 12, fontSize: 13, marginBottom: 14 }}>
                  {loading ? "Logging in…" : "Login →"}
                </button>
                <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted2)" }}>
                  New here?{" "}
                  <span style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => switchMemberTab("signup")}>Create account</span>
                </div>
              </form>
            )}

            {/* Member Signup */}
            {memberTab === "signup" && (
              <form onSubmit={handleMemberSignup}>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>🏋️</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 2, color: "var(--text)", marginBottom: 4 }}>JOIN F2 FIT FACTORY</div>
                  <div style={{ fontSize: 12, color: "var(--muted2)" }}>Free account — upgrade anytime to unlock all features</div>
                </div>

                <Input label="Full Name *" placeholder="Rahul Sharma"
                  value={mName} onChange={e => setMName(e.target.value)} required autoFocus />
                <Input label="Email Address *" type="email" placeholder="you@email.com"
                  value={mEmail} onChange={e => setMEmail(e.target.value)} required />

                <div className="form-group">
                  <label className="form-label">Password * (min 6 chars)</label>
                  <div style={{ position: "relative" }}>
                    <input className="form-input" type={showPass ? "text" : "password"}
                      placeholder="Choose a strong password" value={mPass}
                      onChange={e => setMPass(e.target.value)} required style={{ paddingRight: 52 }} />
                    <span onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--muted2)", cursor: "pointer" }}>
                      {showPass ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Fitness Goal</label>
                  <select className="form-input" value={mGoal} onChange={e => setMGoal(e.target.value)}>
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Body Toning</option>
                    <option>General Fitness</option>
                  </select>
                </div>

                {/* What free account includes */}
                <div style={{
                  background: "var(--gold-dim)", border: "1px solid rgba(245,200,66,0.2)",
                  borderRadius: "var(--r-sm)", padding: "12px 14px", marginBottom: 16,
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--gold-dark)", letterSpacing: 2, marginBottom: 8 }}>FREE ACCOUNT INCLUDES</div>
                  {["Browse equipment guide", "Preview workout & diet plans", "See membership pricing", "Upgrade anytime to unlock all features"].map((f, i) => (
                    <div key={i} style={{ fontSize: 12, color: "var(--text2)", display: "flex", gap: 7, marginBottom: 5 }}>
                      <span style={{ color: "var(--gold)", flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading} style={{ width: "100%", padding: 12, fontSize: 13, marginBottom: 14 }}>
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
                <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted2)" }}>
                  Already have an account?{" "}
                  <span style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => switchMemberTab("login")}>Login</span>
                </div>
              </form>
            )}
          </>
        )}

        {/* ══ ADMIN TAB ═══════════════════════════════════ */}
        {tab === "admin" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              <SubTab active={adminTab === "login"}  onClick={() => switchAdminTab("login")}>Login</SubTab>
              <SubTab active={adminTab === "signup"} onClick={() => switchAdminTab("signup")}>Create Account</SubTab>
            </div>

            {/* Admin Login */}
            {adminTab === "login" && (
              <form onSubmit={handleAdminLogin}>
                <Input label="Email Address" type="email" placeholder="admin@f2fitfactory.com"
                  value={aEmail} onChange={e => setAEmail(e.target.value)} required autoFocus />
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: "relative" }}>
                    <input className="form-input" type={showPass ? "text" : "password"} placeholder="••••••••"
                      value={aPass} onChange={e => setAPass(e.target.value)} required style={{ paddingRight: 52 }} />
                    <span onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--muted2)", cursor: "pointer" }}>
                      {showPass ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading} style={{ width: "100%", padding: 12, fontSize: 13 }}>
                  {loading ? "Logging in…" : "Admin Login →"}
                </button>
              </form>
            )}

            {/* Admin Signup */}
            {adminTab === "signup" && (
              <form onSubmit={handleAdminSignup}>
                <Input label="Your Name" placeholder="Gym Owner / Manager"
                  value={aName} onChange={e => setAName(e.target.value)} required />
                <Input label="Email Address" type="email" placeholder="owner@f2fitfactory.com"
                  value={aEmail} onChange={e => setAEmail(e.target.value)} required />
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="Min 6 chars"
                      value={aPass} onChange={e => setAPass(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm</label>
                    <input className="form-input" type="password" placeholder="Re-enter"
                      value={aConf} onChange={e => setAConf(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">🔐 Admin Secret Code</label>
                  <div style={{ position: "relative" }}>
                    <input className="form-input" type={showCode ? "text" : "password"}
                      placeholder="Enter secret code" value={aCode}
                      onChange={e => setACode(e.target.value)} style={{ paddingRight: 52 }} required />
                    <span onClick={() => setShowCode(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--muted2)", cursor: "pointer" }}>
                      {showCode ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary tap-scale btn-ripple"
                  disabled={loading} style={{ width: "100%", padding: 12, fontSize: 13 }}>
                  {loading ? "Creating…" : "Create Admin Account →"}
                </button>
              </form>
            )}
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "var(--muted)" }}>
          F2 Fit Factory · Mandla, Madhya Pradesh
        </div>
      </div>
    </div>
  );
}
