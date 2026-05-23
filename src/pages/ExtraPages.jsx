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
