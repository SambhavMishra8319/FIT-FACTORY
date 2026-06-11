import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const FEATURE_LABELS = {
  workout: "Workout Plans",
  diet: "Diet Plans",
  bca: "BCA Analysis",
  steam: "Steam Bath Booking",
  progress: "Progress Tracking",
  leaderboard: "Leaderboard",
};

const CONTACT_PHONE = "+91 8319802425";

/* ─────────────────────────────────────────────
   PLANS
───────────────────────────────────────────── */
const PLANS = [
  {
    key: "monthly",
    name: "Monthly",
    price: "₹1,500",
    duration: "1 Month",
    color: "#c9a227",
    popular: false,
    features: [
      "Full Workout Plans",
      "Indian Diet Plans",
      "BCA Tracking",
      "Steam Bath Booking",
      "Progress & Streaks",
    ],
  },
  {
    key: "quarterly",
    name: "Quarterly",
    price: "₹3,500",
    duration: "3 Months",
    color: "#f5c842",
    popular: true,
    features: [
      "Everything in Monthly",
      "Save ₹1,000",
      "Priority Steam Slots",
      "Leaderboard Access",
    ],
  },
  {
    key: "6month",
    name: "6 Months",
    price: "₹7,000",
    duration: "6 Months",
    color: "#fcd95b",
    popular: false,
    features: [
      "Everything in Quarterly",
      "Save ₹2,000",
      "Free BCA Every Month",
    ],
  },
  {
    key: "annual",
    name: "Annual",
    price: "₹12,000",
    duration: "12 Months",
    color: "#f5c842",
    popular: false,
    features: [
      "Everything Included",
      "Save ₹6,000",
      "VIP Steam Access",
    ],
  },
];

/* ─────────────────────────────────────────────
   MEMBERSHIP BANNER
───────────────────────────────────────────── */
export function MembershipBanner({ membership }) {
  const navigate = useNavigate();

  if (!membership || membership?.isPaid) return null;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(201,162,39,0.06))",
        border: "1px solid rgba(245,200,66,0.3)",
        borderRadius: "var(--r-md)",
        padding: "14px 16px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
        animation: "fadeDown 0.4s ease",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 10,
            color: "var(--gold)",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          🆓 FREE ACCOUNT
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
          You're browsing F2 Fit Factory.{" "}
          <strong style={{ color: "var(--gold)" }}>
            Purchase a membership
          </strong>{" "}
          to unlock all features.
        </div>
      </div>

      <button
        className="btn btn-primary tap-scale btn-ripple"
        onClick={() => navigate("/member/upgrade")}
        style={{ flexShrink: 0, fontSize: 11, padding: "8px 16px" }}
      >
        View Plans →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EXPIRY BANNER
───────────────────────────────────────────── */
export function ExpiryBanner({ membership }) {
  const navigate = useNavigate();

  if (!membership || !membership.isPaid) return null;
  if (membership.daysLeft > 7) return null;

  const expired = membership.daysLeft <= 0;

  return (
    <div
      className={`info-box ${expired ? "danger" : "warning"} mb-16`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <span>
        {expired
          ? "❌ Your membership has expired. Renew to keep access."
          : `⚠ Membership expires in ${membership.daysLeft} day${
              membership.daysLeft !== 1 ? "s" : ""
            }! Renew soon.`}
      </span>

      <button
        className="btn btn-primary btn-sm tap-scale"
        onClick={() => navigate("/member/upgrade")}
      >
        Renew Now
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOCK OVERLAY
───────────────────────────────────────────── */
function LockOverlay({ feature }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 999,
        pointerEvents: "all",
        background: "rgba(8,8,8,0.75)",
        backdropFilter: "blur(3px)",
        borderRadius: "var(--r-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 20,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(201,162,39,0.08))",
          border: "1px solid rgba(245,200,66,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          animation: "pulse-gold 2s ease infinite",
        }}
      >
        🔒
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 12,
          color: "var(--gold)",
          letterSpacing: 2,
        }}
      >
        {FEATURE_LABELS[feature] || "PREMIUM FEATURE"}
      </div>

      <div style={{ fontSize: 12, color: "var(--muted2)", maxWidth: 200 }}>
        Unlock with any membership plan
      </div>

      <button
        className="btn btn-primary tap-scale btn-ripple"
        onClick={() => navigate("/member/upgrade")}
        style={{ fontSize: 11, padding: "8px 18px" }}
      >
        Unlock Now →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOCK GATE
───────────────────────────────────────────── */
export function LockGate({ feature, children, membership }) {
  if (!membership) return null;

  if (membership?.canAccess?.(feature)) return children;

  return (
    <div style={{ position: "relative", minHeight: "60vh" }}>
      <div
        style={{
          filter: "blur(5px)",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.5,
          overflow: "hidden",
          maxHeight: "70vh",
        }}
      >
        {children}
      </div>

      <LockOverlay feature={feature} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION LOCK
───────────────────────────────────────────── */
export function SectionLock({ feature, membership, children, label }) {
  const navigate = useNavigate();

  if (!membership) return null;
  if (membership?.canAccess?.(feature)) return children;

  return (
    <div style={{ position: "relative", borderRadius: "var(--r-md)", overflow: "hidden" }}>
      <div style={{ filter: "blur(4px)", pointerEvents: "none", opacity: 0.45 }}>
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(8,8,8,0.7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          textAlign: "center",
          padding: 16,
        }}
      >
        <div style={{ fontSize: 20 }}>🔒</div>

        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 10,
            color: "var(--gold)",
            letterSpacing: 2,
          }}
        >
          {label || "MEMBERS ONLY"}
        </div>

        <button
          className="btn btn-primary btn-sm tap-scale"
          onClick={() => navigate("/member/upgrade")}
          style={{ fontSize: 10 }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UPGRADE PAGE
───────────────────────────────────────────── */
export function UpgradePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="topbar">
        <div className="page-title">Membership Plans</div>
        <div className="topbar-right">
          <button
            className="btn btn-outline tap-scale"
            onClick={() => navigate("/member/dashboard")}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* HERO */}
        <div
          style={{
            textAlign: "center",
            padding: "28px 20px",
            background:
              "linear-gradient(135deg, rgba(245,200,66,0.08), transparent)",
            border: "1px solid rgba(245,200,66,0.2)",
            borderRadius: "var(--r-lg)",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,200,66,0.07), transparent)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 4,
              background: "var(--grad-gold2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}
          >
            JOIN F2 FIT FACTORY BY Nimesh Mishra
          </div>

          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>
             BCA machine, steam bath, expert trainers.
          </div>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              color: "var(--gold-dark)",
              letterSpacing: 2,
            }}
          >
            
          </div>
        </div>

        {/* PLANS */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 10,
            color: "var(--gold-dark)",
            letterSpacing: 3,
            marginBottom: 14,
          }}
        >
          CHOOSE YOUR PLAN
        </div>

        <div className="grid-2">
          {PLANS.map((plan, i) => (
            <div
              key={plan.key}
              style={{
                background: plan.popular
                  ? "linear-gradient(135deg, rgba(245,200,66,0.08), rgba(201,162,39,0.04))"
                  : "var(--card)",
                border: `1px solid ${plan.popular ? plan.color : "var(--border)"}`,
                borderRadius: "var(--r-md)",
                padding: "18px 16px",
                position: "relative",
                opacity: 0,
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "var(--grad-gold)",
                    color: "var(--black)",
                    fontSize: 8,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                  }}
                >
                  BEST VALUE
                </div>
              )}

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 700,
                  color: plan.color,
                }}
              >
                {plan.name}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 900,
                }}
              >
                {plan.price}
              </div>

              <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 12 }}>
                {plan.duration}
              </div>

              {plan.features.map((f, fi) => (
                <div
                  key={fi}
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    display: "flex",
                    gap: 7,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ color: plan.color, fontWeight: 700 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* INFO */}
        <div className="info-box warning mt-20">
          <div style={{ fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
            HOW TO ACTIVATE
          </div>
          <div style={{ lineHeight: 1.8, fontSize: 13 }}>
            1. Visit <strong>F2 Fit Factory</strong>
            <br />
            2. Choose your plan & pay at the counter
            <br />
            3. Admin activates membership
            <br />
            4. App unlocks automatically
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 6 }}>
            Questions? Contact us
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--gold)" }}>
            📞 {CONTACT_PHONE}
          </div>
        </div>
      </div>
    </>
  );
}