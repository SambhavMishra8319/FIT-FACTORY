import { useEffect, useState } from "react";
import { subscribeLeaderboard } from "../../firebase/service";

const rankColor = r => r === 1 ? "var(--gold)" : r === 2 ? "#9ca3af" : r === 3 ? "#cd7c4a" : "var(--muted2)";
const rankLabel = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : r;

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ✅ Realtime onSnapshot — updates live when points change
    const unsub = subscribeLeaderboard(data => {
      setLeaders(data);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    });
    return () => unsub();
  }, []);

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Leaderboard</div>
        <div className="topbar-right">
          <span style={{ fontSize: 11, color: "var(--muted2)" }}>
            🔴 Live · Updates in real-time
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Points guide */}
        <div className="card mb-20" style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease 0.1s",
          background: "linear-gradient(135deg, rgba(245,200,66,0.05), transparent)",
          border: "1px solid rgba(245,200,66,0.15)",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 10, color: "var(--gold-dark)", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
            How to earn points
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { action: "Daily Check-in",    pts: "10 pts",  icon: "✓" },
              { action: "Full Workout",       pts: "50 pts",  icon: "🏋️" },
              { action: "BCA Reading",        pts: "30 pts",  icon: "📊" },
              { action: "Steam Bath",         pts: "20 pts",  icon: "🌫️" },
              { action: "7-Day Streak",       pts: "100 pts", icon: "🔥" },
              { action: "30-Day Streak",      pts: "500 pts", icon: "🏆" },
            ].map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 10px", background: "var(--card2)",
                borderRadius: "var(--r-sm)", fontSize: 12,
              }}>
                <span>{p.icon}</span>
                <span style={{ color: "var(--text2)" }}>{p.action}</span>
                <span style={{ color: "var(--gold)", fontWeight: 700, fontFamily: "var(--font-display)" }}>+{p.pts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-header mb-12">
          <div className="section-title">Top Members This Month</div>
          <span style={{ fontSize: 12, color: "var(--muted2)" }}>
            {leaders.length} member{leaders.length !== 1 ? "s" : ""} on board
          </span>
        </div>

        {loading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div className="skeleton" style={{ height: 58, borderRadius: "var(--r-sm)" }} />
            </div>
          ))
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted2)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 2, color: "var(--gold)", marginBottom: 8 }}>
              NO LEADERBOARD DATA YET
            </div>
            <div style={{ fontSize: 13 }}>
              Members earn points by checking in, completing workouts, and BCA readings.
            </div>
          </div>
        ) : leaders.map((m, i) => (
          <div
            key={m.id}
            className="lb-row"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s`,
              border: m.rank === 1 ? "1px solid rgba(245,200,66,0.3)" : undefined,
              background: m.rank === 1 ? "linear-gradient(135deg, rgba(245,200,66,0.08), var(--card2))" : undefined,
            }}
          >
            <div className="lb-rank" style={{ color: rankColor(m.rank), fontSize: m.rank <= 3 ? 22 : 18 }}>
              {rankLabel(m.rank)}
            </div>
            <div className="lb-avatar" style={{
              background: m.rank === 1 ? "var(--grad-gold)" : "var(--card3)",
              color: m.rank === 1 ? "var(--black)" : "var(--text)",
            }}>
              {m.memberName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
            </div>
            <div className="lb-info">
              <div className="lb-name">{m.memberName || "Member"}</div>
              <div className="lb-streak" style={{ fontSize: 11 }}>
                Member since {m.createdAt?.toDate?.()?.toLocaleDateString?.("en-IN") || "—"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="lb-pts">{m.points?.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--muted2)", fontFamily: "var(--font-display)", letterSpacing: 1 }}>POINTS</div>
            </div>
          </div>
        ))}

        {leaders.length > 0 && (
          <div className="info-box warning mt-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.5s" }}>
            🏆 Leaderboard resets every month. Keep checking in to maintain your rank!
          </div>
        )}
      </div>
    </div>
  );
}
