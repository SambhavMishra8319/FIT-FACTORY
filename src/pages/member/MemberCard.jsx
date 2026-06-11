import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { differenceInDays } from "date-fns";

export default function MemberCard() {
  const { profile } = useAuth();
  const [member, setMember] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (profile?.phone) fetchMember();
  }, [profile]);

  async function fetchMember() {
    try {
      const snap = await getDocs(
        query(collection(db, "members"), where("phone", "==", profile.phone))
      );
      if (!snap.empty) setMember({ id: snap.docs[0].id, ...snap.docs[0].data() });
    } catch (e) { console.error(e); }
  }

  const initials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "F2";

  const daysLeft = member?.expiryDate
    ? differenceInDays(new Date(member.expiryDate), new Date())
    : null;

  const statusColor = daysLeft === null ? "var(--muted2)"
    : daysLeft <= 0 ? "var(--red)"
    : daysLeft <= 7 ? "var(--orange)"
    : "var(--green)";

  const statusLabel = daysLeft === null ? "Unknown"
    : daysLeft <= 0 ? "Expired"
    : daysLeft <= 7 ? `Expiring in ${daysLeft}d`
    : "Active";

  const handleShare = async () => {
    const text = `🏋️ F2 fit-factory By Nimesh Mishra\n👤 ${profile?.name}\n📱 +91 ${profile?.phone}\n🎫 ${member?.plan || "Member"}\n📅 Valid till: ${member?.expiryDate || "—"}\n\n💪 Crushing goals at F2 Fit Factory!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "F2 fit-factory Membership", text });
      } catch {}
    } else {
      navigator.clipboard?.writeText(text);
      toast.success("Card details copied to clipboard!");
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="page-title">My Membership Card</div>
        <div className="topbar-right">
          <button className="btn btn-primary" onClick={handleShare}>📤 Share Card</button>
        </div>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          {/* Digital Membership Card */}
          <div ref={cardRef} className="membership-card mb-16">
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, position: "relative", zIndex: 1 }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: 2, background: "linear-gradient(135deg, var(--gold), #fff8d6, var(--gold2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  F2 FIT FACTORY
                </div>
                <div style={{ fontSize: 9, color: "var(--muted2)", letterSpacing: 3, textTransform: "uppercase", marginTop: 3, fontFamily: "'Exo 2', sans-serif" }}>
                  BY NIMESH MISHRA
                </div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold2), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "var(--black)", fontFamily: "'Orbitron', sans-serif", border: "2px solid rgba(240,180,41,0.3)", boxShadow: "0 0 20px rgba(240,180,41,0.2)" }}>
                {initials}
              </div>
            </div>

            {/* Gold divider */}
            <div className="gold-divider" />

            {/* Member info */}
            <div style={{ margin: "18px 0", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, marginBottom: 4 }}>
                Member Name
              </div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: 1, background: "linear-gradient(135deg, var(--white), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {profile?.name || "—"}
              </div>
            </div>

            {/* Card details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative", zIndex: 1 }}>
              {[
                { label: "Member ID", value: member?.memberId || "F2-XXXX" },
                { label: "Phone", value: `+91 ${profile?.phone || "—"}` },
                { label: "Plan", value: member?.plan || "—" },
                { label: "Goal", value: member?.goal || "—" },
                { label: "Valid From", value: member?.joinDate || "—" },
                { label: "Valid Till", value: member?.expiryDate || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 8, color: "var(--muted)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "'Exo 2', sans-serif" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Status bar */}
            <div style={{ marginTop: 20, position: "relative", zIndex: 1 }}>
              <div className="gold-divider" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <div style={{ fontSize: 10, color: "var(--muted2)", fontFamily: "'Exo 2', sans-serif", fontWeight: 600, letterSpacing: 1 }}>
                  MEMBERSHIP STATUS
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: statusColor, fontFamily: "'Exo 2', sans-serif", letterSpacing: 1 }}>
                    {statusLabel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="card">
            <div className="card-title">Membership Details</div>
            {[
              { icon: "📅", label: "Days Remaining", value: daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days` : "Expired") : "—", color: statusColor },
              { icon: "🏋️", label: "Home Gym", value: "F2 Fit Factory By Nimesh Mishra", color: "var(--gold)" },
              { icon: "⏰", label: "Gym Hours", value: "6:00 AM – 9:00 PM", color: "var(--text)" },
              { icon: "📞", label: "Contact", value: "Visit gym for info", color: "var(--text)" },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--card2)", borderRadius: 5, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {daysLeft !== null && daysLeft <= 10 && daysLeft > 0 && (
            <div className="info-box danger mt-12">
              ⚠ Your membership expires in <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""}</strong>. Please visit the gym to renew and continue your fitness journey!
            </div>
          )}

          {daysLeft !== null && daysLeft <= 0 && (
            <div className="info-box danger mt-12">
              ❌ Your membership has expired. Please visit F2 fit-factory to renew and get back on track!
            </div>
          )}

          <button
            className="btn btn-primary mt-12"
            style={{ width: "100%", padding: 13, justifyContent: "center" }}
            onClick={handleShare}
          >
            📤 Share My Membership Card
          </button>
        </div>
      </div>
    </>
  );
}
