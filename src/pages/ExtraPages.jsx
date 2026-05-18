// ── Equipment Guide ───────────────────────────────────────
export function Equipment() {
  const machines = [
    {
      category: "Cardio",
      icon: "🏃",
      items: [
        { name: "Treadmill", muscle: "Full Body Cardio", how: "Start slow at 4–5 km/h, increase to 8–12 km/h for fat burn. Hold rails lightly. 30 min recommended.", level: "Beginner" },
        { name: "Stationary Bike", muscle: "Legs & Cardio", how: "Adjust seat so knees are slightly bent at bottom. Maintain 70–90 RPM. Great for warm-up.", level: "Beginner" },
        { name: "Cross Trainer / Elliptical", muscle: "Full Body", how: "Push and pull handles for upper body. Stride smoothly. 20–40 min for cardio.", level: "Beginner" },
      ]
    },
    {
      category: "Chest",
      icon: "💪",
      items: [
        { name: "Flat Bench Press (Barbell)", muscle: "Chest, Triceps, Shoulders", how: "Lie flat, grip slightly wider than shoulders. Lower bar to chest, press up. Keep feet on floor.", level: "Intermediate" },
        { name: "Incline Dumbbell Press", muscle: "Upper Chest", how: "Set bench to 30–45°. Press dumbbells up and slightly together. Control the descent.", level: "Beginner" },
        { name: "Cable Crossover", muscle: "Chest (inner)", how: "Stand in center of cable machine. Pull handles together in front of chest. Squeeze for 1 sec.", level: "Intermediate" },
      ]
    },
    {
      category: "Back",
      icon: "🔙",
      items: [
        { name: "Lat Pulldown", muscle: "Lats, Biceps", how: "Sit, grip bar wide, pull to upper chest. Lean back slightly. Slow on the way up.", level: "Beginner" },
        { name: "Seated Cable Row", muscle: "Mid Back, Biceps", how: "Sit tall, pull handle to abdomen. Squeeze shoulder blades. Slow controlled return.", level: "Beginner" },
        { name: "Deadlift", muscle: "Full Back, Legs", how: "Feet shoulder-width. Keep back straight, hinge at hips. Drive through heels to stand.", level: "Advanced" },
      ]
    },
    {
      category: "Legs",
      icon: "🦵",
      items: [
        { name: "Leg Press Machine", muscle: "Quads, Glutes, Hamstrings", how: "Place feet shoulder-width on platform. Push until legs are nearly straight. Don't lock knees.", level: "Beginner" },
        { name: "Leg Extension Machine", muscle: "Quadriceps", how: "Sit, align knee with machine pivot. Extend legs fully, hold 1 sec, lower slowly.", level: "Beginner" },
        { name: "Leg Curl Machine", muscle: "Hamstrings", how: "Lie face down. Curl legs toward glutes. Squeeze hamstrings at top, lower slowly.", level: "Beginner" },
      ]
    },
    {
      category: "BCA Machine",
      icon: "📊",
      items: [
        { name: "Body Composition Analyzer (BCA)", muscle: "Full Body Scan — F2 Fit Factory USP", how: "Stand barefoot on metal pads. Hold handles. Stay still for 30 sec. Get report of fat%, muscle mass, BMI, water%.", level: "USP" },
      ]
    },
    {
      category: "Steam Bath",
      icon: "🌫️",
      items: [
        { name: "Steam Room", muscle: "Recovery & Detox — F2 Fit Factory USP", how: "Enter after workout. Stay 15–20 min at 80–90°C. Drink water before and after. Helps muscle recovery, skin detox, stress relief.", level: "USP" },
      ]
    },
  ];

  const levelColor = (l) => {
    if (l === "USP")          return "badge-gold";
    if (l === "Advanced")     return "badge-red";
    if (l === "Intermediate") return "badge-blue";
    return "badge-green";
  };

  return (
    <>
      <div className="topbar">
        <div className="page-title">Equipment Guide</div>
      </div>
      <div className="page-body">
        <div className="info-box warning mb-20">
          💡 Ask your trainer before using any machine for the first time. Proper form prevents injury.
        </div>
        {machines.map(cat => (
          <div key={cat.category} style={{ marginBottom: 24 }}>
            <div className="section-header mb-12">
              <div className="section-title">{cat.icon} {cat.category}</div>
            </div>
            {cat.items.map((m, i) => (
              <div key={i} className="card mb-8">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "var(--text)" }}>
                    {m.name}
                  </div>
                  <span className={`badge ${levelColor(m.level)}`}>{m.level}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--gold-dark)", fontFamily: "var(--font-display)", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                  🎯 {m.muscle}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{m.how}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Admin Analytics ───────────────────────────────────────
import { useEffect, useState } from "react";
import { getAllMembers, getPayments } from "../firebase/service";
import { format, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import toast from "react-hot-toast";

export function Analytics() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllMembers(), getPayments()])
      .then(([m, p]) => { setMembers(m); setPayments(p); })
      .catch(() => toast.error("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  // Revenue by month (last 6 months)
  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const key = format(d, "yyyy-MM");
    const label = format(d, "MMM");
    const rev = payments.filter(p => p.date?.startsWith(key)).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    return { month: label, revenue: rev };
  });

  // Members by goal
  const goalCount = members.reduce((acc, m) => {
    acc[m.goal || "Other"] = (acc[m.goal || "Other"] || 0) + 1;
    return acc;
  }, {});
  const goalData = Object.entries(goalCount).map(([name, value]) => ({ name, value }));

  // Members by plan
  const planCount = members.reduce((acc, m) => {
    acc[m.plan || "Other"] = (acc[m.plan || "Other"] || 0) + 1;
    return acc;
  }, {});
  const planData = Object.entries(planCount).map(([name, value]) => ({ name, value }));

  // Payment methods
  const methodCount = payments.reduce((acc, p) => {
    acc[p.method || "Other"] = (acc[p.method || "Other"] || 0) + 1;
    return acc;
  }, {});
  const methodData = Object.entries(methodCount).map(([name, value]) => ({ name, value }));

  const COLORS = ["#f5c842", "#c9a227", "#e63329", "#22c55e", "#3b82f6", "#888"];

  const totalRevenue = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const thisMonth = format(new Date(), "yyyy-MM");
  const monthRevenue = payments.filter(p => p.date?.startsWith(thisMonth)).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const avgPerMember = members.length ? Math.round(totalRevenue / members.length) : 0;

  const tooltipStyle = { background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-body)" };

  return (
    <>
      <div className="topbar">
        <div className="page-title">Analytics</div>
        <div className="topbar-right">
          <span style={{ fontSize: 11, color: "var(--muted2)", fontFamily: "var(--font-body)" }}>
            Real-time from Firebase
          </span>
        </div>
      </div>
      <div className="page-body">
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted2)" }}>Loading analytics…</div>
        ) : (
          <>
            {/* Key metrics */}
            <div className="stats-grid mb-20">
              <div className="stat-card s-gold">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value c-gold" style={{ fontSize: 22 }}>
                  ₹{totalRevenue >= 100000 ? (totalRevenue / 100000).toFixed(1) + "L" : (totalRevenue / 1000).toFixed(1) + "k"}
                </div>
                <div className="stat-sub">All time</div>
              </div>
              <div className="stat-card s-green">
                <div className="stat-label">This Month</div>
                <div className="stat-value c-green" style={{ fontSize: 22 }}>
                  ₹{monthRevenue >= 1000 ? (monthRevenue / 1000).toFixed(1) + "k" : monthRevenue}
                </div>
                <div className="stat-sub">{format(new Date(), "MMMM yyyy")}</div>
              </div>
              <div className="stat-card s-blue">
                <div className="stat-label">Avg / Member</div>
                <div className="stat-value c-blue" style={{ fontSize: 22 }}>₹{avgPerMember.toLocaleString()}</div>
                <div className="stat-sub">Lifetime value</div>
              </div>
              <div className="stat-card s-gold">
                <div className="stat-label">Total Members</div>
                <div className="stat-value c-gold" style={{ fontSize: 22 }}>{members.length}</div>
                <div className="stat-sub">{members.filter(m => m.status === "active").length} active</div>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="card mb-16">
              <div className="card-title">Revenue — Last 6 Months</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11, fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#666", fontSize: 11, fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `₹${v/1000}k` : `₹${v}`} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(245,200,66,0.06)" }} formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {revenueByMonth.map((_, i) => (
                      <Cell key={i} fill={i === revenueByMonth.length - 1 ? "#f5c842" : "#c9a227"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid-2 mb-16">
              {/* Members by Goal */}
              <div className="card">
                <div className="card-title">Members by Goal</div>
                {goalData.length === 0 ? (
                  <div style={{ color: "var(--muted2)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No data yet.</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={goalData} cx="50%" cy="50%" outerRadius={55} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                          {goalData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>

              {/* Payment methods */}
              <div className="card">
                <div className="card-title">Payment Methods</div>
                {methodData.length === 0 ? (
                  <div style={{ color: "var(--muted2)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No payments yet.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
                    {methodData.map((m, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: "var(--text2)" }}>{m.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{m.value}</span>
                        </div>
                        <div className="bca-track">
                          <div className="bca-fill gold" style={{ width: `${(m.value / payments.length) * 100}%`, background: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Plans */}
            <div className="card mb-16">
              <div className="card-title">Members by Plan</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {planData.map((p, i) => (
                  <div key={i} style={{
                    flex: 1, minWidth: 100, padding: "12px 14px",
                    background: "var(--card2)", borderRadius: "var(--r-sm)",
                    border: `1px solid ${COLORS[i % COLORS.length]}33`,
                  }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: COLORS[i % COLORS.length], letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                      {p.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                      {p.value}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 3 }}>
                      {((p.value / members.length) * 100).toFixed(0)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
