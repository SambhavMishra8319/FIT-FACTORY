import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { format } from "date-fns";
import { useMembership } from "../../hooks/useMembership";
import { MembershipBanner, ExpiryBanner, SectionLock } from "../../components/LockGate";

// Sample preview data shown to free members (blurred)
const SAMPLE_BCA = { weight: "72.4", fat: "22.5%", muscle: "35.8 kg", bmi: "22.4" };
const SAMPLE_EXERCISES = ["Flat Bench Press", "Incline DB Press", "Cable Crossover", "Tricep Pushdown"];
const SAMPLE_MEALS = [
  { time: "🌅 Early Morning", desc: "10 almonds + 2 eggs + lemon water", kcal: 180 },
  { time: "🍳 Breakfast",     desc: "4 egg whites + 2 roti + dahi",      kcal: 520 },
  { time: "🍱 Lunch",         desc: "2 roti + rajma + chawal + salad",   kcal: 680 },
];

export default function MemberDashboard() {
  const { profile } = useAuth();
  const { membership, loading: mLoading } = useMembership();
  const navigate = useNavigate();
  const [member, setMember]     = useState(null);
  const [bcaLatest, setBcaLatest] = useState(null);
  const [steamBookings, setSteamBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [visible, setVisible]   = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const hour  = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    if (!mLoading) {
      fetchData();
      setTimeout(() => setVisible(true), 80);
    }
  }, [mLoading, membership]);

  async function fetchData() {
    if (!profile?.phone) { setLoading(false); return; }
    try {
      const mSnap = await getDocs(query(collection(db, "members"), where("email", "==", (profile.email || "").toLowerCase())));
      if (!mSnap.empty) setMember({ id: mSnap.docs[0].id, ...mSnap.docs[0].data() });

      if (membership?.memberId) {
        const [bcaSnap, steamSnap] = await Promise.all([
          getDocs(query(collection(db, "bca_readings"), where("memberId", "==", membership.memberId), orderBy("date", "desc"), limit(1))),
          getDocs(query(collection(db, "steam_bookings"), where("memberId", "==", membership.memberId), where("date", ">=", today))),
        ]);
        if (!bcaSnap.empty) setBcaLatest(bcaSnap.docs[0].data());
        setSteamBookings(steamSnap.docs.map(d => d.data()));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const initials = profile?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "M";
  const isPaid   = membership?.isPaid;

  const anim = (delay, style = {}) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    ...style,
  });

  if (mLoading) return (
    <div style={{ padding: 20 }}>
      {[1,2,3].map(i => <div key={i} className="skeleton mb-12" style={{ height: 60, borderRadius: "var(--r-md)" }} />)}
    </div>
  );

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">{greeting}! 💪</div>
        <div className="topbar-right">
          <span style={{ fontSize: 11, color: "var(--muted2)" }}>{format(new Date(), "EEE, d MMM")}</span>
        </div>
      </div>

      <div className="page-body">
        {/* Free user banner */}
        <MembershipBanner membership={membership} />
        <ExpiryBanner membership={membership} />

        {/* Profile card */}
        <div className="profile-header mb-16" style={anim(0.05)}>
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="profile-name">{profile?.name || "Member"}</div>
            <div className="profile-meta">📱 {profile?.email || "Member"}</div>
            <div className="profile-tags" style={{ marginTop: 8 }}>
              {isPaid ? (
                <>
                  <span className="badge badge-gold">{membership.plan}</span>
                  <span className="badge badge-green">Active</span>
                  {membership.daysLeft > 0 && <span className="badge badge-blue">{membership.daysLeft}d left</span>}
                </>
              ) : (
                <>
                  <span className="badge badge-gray">🆓 Free Account</span>
                  <span className="badge badge-gold" style={{ cursor: "pointer" }} onClick={() => navigate("/member/upgrade")}>
                    Upgrade →
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Membership stats */}
        <div className="stats-grid mb-20" style={anim(0.1)}>
          <div className="stat-card s-gold">
            <div className="stat-label">Plan</div>
            <div className="stat-value c-gold" style={{ fontSize: isPaid ? 18 : 14 }}>
              {isPaid ? membership.plan : "Free"}
            </div>
            <div className="stat-sub">{isPaid ? "Active member" : "Upgrade to unlock"}</div>
          </div>
          <div className="stat-card s-green">
            <div className="stat-label">Days Left</div>
            <div className="stat-value c-green">{isPaid ? membership.daysLeft : "—"}</div>
            <div className="stat-sub">{isPaid ? `Till ${membership.expiryDate}` : "No active plan"}</div>
          </div>
          {/* BCA stats — locked for free */}
          <div className="stat-card s-gold" style={{ position: "relative", overflow: "hidden" }}>
            {!isPaid && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(8,8,8,0.7)",
                backdropFilter: "blur(3px)", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer",
                zIndex: 2,
              }} onClick={() => navigate("/member/upgrade")}>
                <span style={{ fontSize: 18 }}>🔒</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--gold)", letterSpacing: 1 }}>MEMBERS ONLY</span>
              </div>
            )}
            <div className="stat-label">Weight</div>
            <div className="stat-value c-gold" style={{ fontSize: 22 }}>
              {isPaid && bcaLatest ? bcaLatest.weight : SAMPLE_BCA.weight}
            </div>
            <div className="stat-sub">{isPaid ? (bcaLatest ? `kg · ${bcaLatest.date}` : "No BCA yet") : "kg (sample)"}</div>
          </div>
          <div className="stat-card s-red" style={{ position: "relative", overflow: "hidden" }}>
            {!isPaid && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(8,8,8,0.7)",
                backdropFilter: "blur(3px)", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer",
                zIndex: 2,
              }} onClick={() => navigate("/member/upgrade")}>
                <span style={{ fontSize: 18 }}>🔒</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--gold)", letterSpacing: 1 }}>MEMBERS ONLY</span>
              </div>
            )}
            <div className="stat-label">Body Fat</div>
            <div className="stat-value c-red" style={{ fontSize: 22 }}>
              {isPaid && bcaLatest ? `${bcaLatest.fat}%` : SAMPLE_BCA.fat}
            </div>
            <div className="stat-sub">{isPaid ? (bcaLatest ? "Last reading" : "No BCA yet") : "(sample)"}</div>
          </div>
        </div>

        {/* ── WORKOUT SECTION ── always visible, locked for free */}
        <div style={anim(0.15)}>
          <div className="section-header mb-12">
            <div className="section-title">🏋️ Today's Workout</div>
            {!isPaid && <span className="badge badge-gold" style={{ cursor: "pointer" }} onClick={() => navigate("/member/upgrade")}>🔒 Unlock</span>}
          </div>

          <SectionLock feature="workout" membership={membership} label="WORKOUT PLANS — MEMBERS ONLY">
            {/* Real content if paid */}
            <div style={{ padding: "4px 0" }}>
              {SAMPLE_EXERCISES.map((ex, i) => (
                <div key={i} className="exercise-row" style={{ pointerEvents: "none" }}>
                  <div className="ex-num" style={{ background: "var(--grad-gold)", color: "var(--black)" }}>{i + 1}</div>
                  <div className="ex-info">
                    <div className="ex-name">{ex}</div>
                    <div className="ex-detail">3 sets × 12 reps · Rest 60 sec</div>
                  </div>
                  <span className="ex-muscle">Chest</span>
                </div>
              ))}
            </div>
          </SectionLock>

          {isPaid && (
            <button
              className="btn btn-primary tap-scale btn-ripple"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/member/workout")}
            >
              Open Full Workout Plan →
            </button>
          )}
        </div>

        {/* ── DIET SECTION ── always visible, locked for free */}
        <div style={{ ...anim(0.22), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">🥗 Today's Diet</div>
            {!isPaid && <span className="badge badge-gold" style={{ cursor: "pointer" }} onClick={() => navigate("/member/upgrade")}>🔒 Unlock</span>}
          </div>

          <SectionLock feature="diet" membership={membership} label="DIET PLANS — MEMBERS ONLY">
            <div>
              {SAMPLE_MEALS.map((m, i) => (
                <div key={i} className="meal-card" style={{ pointerEvents: "none" }}>
                  <div style={{ flex: 1 }}>
                    <div className="meal-name">{m.time}</div>
                    <div className="meal-desc">{m.desc}</div>
                  </div>
                  <div className="meal-kcal">{m.kcal}<span style={{ fontSize: 11, color: "var(--muted2)" }}> kcal</span></div>
                </div>
              ))}
            </div>
          </SectionLock>

          {isPaid && (
            <button
              className="btn btn-outline tap-scale"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/member/diet")}
            >
              View Full Meal Plan →
            </button>
          )}
        </div>

        {/* ── BCA SECTION ── */}
        <div style={{ ...anim(0.28), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">📊 Body Analysis (BCA)</div>
            {!isPaid && <span className="badge badge-gold" style={{ cursor: "pointer" }} onClick={() => navigate("/member/upgrade")}>🔒 Unlock</span>}
          </div>

          <SectionLock feature="bca" membership={membership} label="BCA TRACKING — MEMBERS ONLY">
            <div className="card" style={{ pointerEvents: "none" }}>
              {Object.entries(SAMPLE_BCA).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--muted2)", textTransform: "capitalize" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{v}</span>
                </div>
              ))}
            </div>
          </SectionLock>

          {isPaid && (
            <button className="btn btn-outline tap-scale" style={{ width: "100%", marginTop: 10 }} onClick={() => navigate("/member/bca")}>
              View BCA Progress →
            </button>
          )}
        </div>

        {/* ── STEAM SECTION ── */}
        <div style={{ ...anim(0.34), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">🌫️ Steam Bath</div>
            {!isPaid && <span className="badge badge-gold" style={{ cursor: "pointer" }} onClick={() => navigate("/member/upgrade")}>🔒 Unlock</span>}
          </div>

          <SectionLock feature="steam" membership={membership} label="STEAM BOOKING — MEMBERS ONLY">
            <div className="slot-grid" style={{ pointerEvents: "none" }}>
              {["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"].map((t, i) => (
                <div key={i} className={`slot ${i < 2 ? "booked" : ""} ${i === 2 ? "selected" : ""}`}>
                  <div className="slot-time">{t}</div>
                  <div className="slot-label">{i < 2 ? "Booked" : i === 2 ? "Available" : "Available"}</div>
                </div>
              ))}
            </div>
          </SectionLock>

          {isPaid && steamBookings.length > 0 && (
            <div className="info-box success mt-10">
              ✓ You have a booking at <strong>{steamBookings[0].slot}</strong>!
            </div>
          )}
          {isPaid && (
            <button className="btn btn-outline tap-scale" style={{ width: "100%", marginTop: 10 }} onClick={() => navigate("/member/steam")}>
              Book Steam Bath →
            </button>
          )}
        </div>

        {/* ── FREE USER — big upgrade CTA at bottom ── */}
        {!isPaid && (
          <div style={{
            ...anim(0.4),
            marginTop: 28,
            background: "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(201,162,39,0.06))",
            border: "1px solid rgba(245,200,66,0.3)",
            borderRadius: "var(--r-lg)", padding: "24px 20px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>⭐</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 900, color: "var(--gold)", letterSpacing: 2, marginBottom: 10 }}>
              UNLOCK EVERYTHING
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 18 }}>
              You can see what's waiting for you above — workout plans, Indian diet, BCA body tracking, steam bath booking and more. All locked until you get a membership.
            </div>
            <button
              className="btn btn-primary tap-scale btn-ripple"
              style={{ width: "100%", padding: "13px", fontSize: 14 }}
              onClick={() => navigate("/member/upgrade")}
            >
              View Membership Plans →
            </button>
            <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 10 }}>
              Starting at just <strong style={{ color: "var(--gold)" }}>₹1,500/month</strong> · Visit F2 Fit Factory, Mandla
            </div>
          </div>
        )}

        {/* ── PAID USER — Equipment Guide quick link ── */}
        {isPaid && (
          <div style={{ ...anim(0.4), marginTop: 24 }}>
            <div className="card tap-scale" style={{ cursor: "pointer", border: "1px solid rgba(245,200,66,0.15)" }}
              onClick={() => navigate("/equipment")}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>🔧</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--gold)", letterSpacing: 1 }}>EQUIPMENT GUIDE</div>
                  <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Learn how to use every machine at F2 Fit Factory</div>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--muted2)" }}>→</span>
              </div>
            </div>
          </div>
        )}

        {/* Motivational footer */}
        <div style={{
          ...anim(0.45),
          marginTop: 24,
          background: "linear-gradient(135deg, rgba(245,200,66,0.06), transparent)",
          border: "1px solid rgba(245,200,66,0.12)",
          borderRadius: "var(--r-md)", padding: "16px 18px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 900, letterSpacing: 3, color: "var(--gold)", lineHeight: 1.3, marginBottom: 5 }}>
            PUSH YOUR LIMITS EVERY DAY
          </div>
          <div style={{ fontSize: 11, color: "var(--muted2)" }}>F2 Fit Factory · Mandla's Best Gym 🏆</div>
        </div>
      </div>
    </div>
  );
}
