// import { useState } from "react";

// const EQUIPMENT = [
//   {
//     icon: "🏋️",
//     name: "Barbell Bench Press",
//     target: "Chest · Triceps · Shoulders",
//     muscles: ["Chest", "Triceps"],
//     desc: "Lie flat on bench, grip bar shoulder-width apart. Lower to chest, press up explosively. Keep feet flat, back slightly arched.",
//     tips: "Never lift heavy without a spotter. Keep wrists straight.",
//     level: "Intermediate",
//   },
//   {
//     icon: "💪",
//     name: "Cable Crossover Machine",
//     target: "Chest · Inner Pec",
//     muscles: ["Chest"],
//     desc: "Set cables at shoulder height. Grab handles, step forward, bring hands together in front of chest with slight bend in elbow.",
//     tips: "Focus on squeezing chest at the end of each rep.",
//     level: "Beginner",
//   },
//   {
//     icon: "🦵",
//     name: "Leg Press Machine",
//     target: "Quads · Glutes · Hamstrings",
//     muscles: ["Legs"],
//     desc: "Sit in machine, place feet shoulder-width on platform. Push platform away without locking knees. Control the descent.",
//     tips: "Keep lower back pressed into seat. Don't let knees cave inward.",
//     level: "Beginner",
//   },
//   {
//     icon: "🔄",
//     name: "Lat Pulldown Machine",
//     target: "Back · Biceps · Lats",
//     muscles: ["Back", "Biceps"],
//     desc: "Grip bar wider than shoulders. Pull bar down to upper chest while leaning back slightly. Control the bar going back up.",
//     tips: "Squeeze shoulder blades together at the bottom.",
//     level: "Beginner",
//   },
//   {
//     icon: "⬆️",
//     name: "Shoulder Press Machine",
//     target: "Shoulders · Triceps",
//     muscles: ["Shoulders"],
//     desc: "Sit upright, grip handles at shoulder level. Press upward until arms are almost extended. Lower slowly.",
//     tips: "Don't arch your lower back. Keep core tight throughout.",
//     level: "Beginner",
//   },
//   {
//     icon: "🚴",
//     name: "Treadmill",
//     target: "Cardio · Legs · Full Body",
//     muscles: ["Cardio"],
//     desc: "Start slow (5 km/h) and warm up for 2 min. Increase speed gradually. For fat loss: 30-45 min at 60-70% max heart rate.",
//     tips: "Hold handrails only for balance, not support. Land midfoot.",
//     level: "Beginner",
//   },
//   {
//     icon: "🔁",
//     name: "Cable Row Machine",
//     target: "Back · Biceps · Rear Delt",
//     muscles: ["Back"],
//     desc: "Sit with feet on platform, grab handle. Pull towards lower chest keeping elbows close to body. Sit tall, don't lean back excessively.",
//     tips: "Pull with your back, not your arms. Pause at the peak contraction.",
//     level: "Beginner",
//   },
//   {
//     icon: "🦾",
//     name: "Preacher Curl Machine",
//     target: "Biceps · Brachialis",
//     muscles: ["Biceps"],
//     desc: "Rest upper arms on pad, grip EZ bar or handles. Curl upward squeezing biceps at top. Lower slowly and completely.",
//     tips: "Full range of motion is key. Don't use momentum.",
//     level: "Beginner",
//   },
//   {
//     icon: "📊",
//     name: "BCA Machine",
//     target: "Full Body Composition",
//     muscles: ["Analysis"],
//     desc: "Stand barefoot on the platform, hold handles. Stand still for 30-60 seconds. Machine measures fat %, muscle mass, water %, BMI.",
//     tips: "Test at same time each week for consistent results. Don't test right after workout or eating.",
//     level: "USP ⭐",
//   },
//   {
//     icon: "🌫️",
//     name: "Steam Room",
//     target: "Recovery · Detox · Relaxation",
//     muscles: ["Recovery"],
//     desc: "Enter steam room after workout. Stay for 10-20 minutes at 80-90°C. Shower before entering. Stay hydrated before and after.",
//     tips: "Don't stay more than 20 min. Exit immediately if feeling dizzy.",
//     level: "USP ⭐",
//   },
//   {
//     icon: "🏃",
//     name: "Elliptical Trainer",
//     target: "Cardio · Full Body Low Impact",
//     muscles: ["Cardio"],
//     desc: "Low-impact cardio that's easy on joints. Push and pull handles to engage upper body. Ideal for warm-up or cardio days.",
//     tips: "Great alternative to running for knee issues.",
//     level: "Beginner",
//   },
//   {
//     icon: "🪑",
//     name: "Leg Extension Machine",
//     target: "Quadriceps",
//     muscles: ["Legs"],
//     desc: "Sit with back against pad, hook ankles under roller. Extend legs until straight. Lower slowly back to starting position.",
//     tips: "Don't lock knees out forcefully. Controlled movement throughout.",
//     level: "Beginner",
//   },
// ];

// const MUSCLES = ["All", "Chest", "Back", "Legs", "Shoulders", "Biceps", "Cardio", "Recovery", "Analysis"];

// const levelColor = (l) => {
//   if (l === "USP ⭐") return "badge-gold";
//   if (l === "Intermediate") return "badge-orange";
//   return "badge-green";
// };

// export default function Equipment() {
//   const [filter, setFilter] = useState("All");
//   const [expanded, setExpanded] = useState(null);

//   const filtered = filter === "All"
//     ? EQUIPMENT
//     : EQUIPMENT.filter(e => e.muscles.includes(filter));

//   return (
//     <>
//       <div className="topbar">
//         <div className="page-title">Equipment Guide</div>
//       </div>

//       <div className="page-body">
//         {/* Filter chips */}
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
//           {MUSCLES.map(m => (
//             <button
//               key={m}
//               onClick={() => setFilter(m)}
//               style={{
//                 padding: "6px 14px",
//                 borderRadius: 20,
//                 border: `1px solid ${filter === m ? "var(--gold)" : "var(--border2)"}`,
//                 background: filter === m ? "var(--gold-soft)" : "var(--card2)",
//                 color: filter === m ? "var(--gold)" : "var(--muted2)",
//                 fontSize: 11, fontWeight: 700, cursor: "pointer",
//                 fontFamily: "'Exo 2', sans-serif",
//                 letterSpacing: "0.5px",
//                 textTransform: "uppercase",
//                 transition: "all 0.15s",
//               }}
//             >
//               {m}
//             </button>
//           ))}
//         </div>

//         {/* Equipment grid */}
//         <div className="grid-3">
//           {filtered.map((eq, i) => (
//             <div
//               key={i}
//               className="equipment-card"
//               onClick={() => setExpanded(expanded === i ? null : i)}
//             >
//               <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
//                 <div className="equipment-icon">{eq.icon}</div>
//                 <span className={`badge ${levelColor(eq.level)}`}>{eq.level}</span>
//               </div>
//               <div className="equipment-name">{eq.name}</div>
//               <div className="equipment-target">{eq.target}</div>

//               {expanded === i && (
//                 <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
//                   <div className="equipment-desc">{eq.desc}</div>
//                   <div style={{
//                     marginTop: 10, padding: "8px 10px",
//                     background: "var(--gold-soft)",
//                     border: "1px solid rgba(240,180,41,0.15)",
//                     borderRadius: 4, fontSize: 11, color: "var(--gold-dim)",
//                     lineHeight: 1.6,
//                   }}>
//                     💡 {eq.tips}
//                   </div>
//                 </div>
//               )}

//               <div style={{ marginTop: 10, fontSize: 11, color: "var(--muted)", textAlign: "right" }}>
//                 {expanded === i ? "▲ Less" : "▼ How to use"}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
import { useState, useMemo } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const EQUIPMENT = [ /* same data unchanged */ ];

const MUSCLES = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Cardio",
  "Recovery",
  "Analysis",
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const levelColor = (l) => {
  if (l === "USP ⭐") return "badge-gold";
  if (l === "Intermediate") return "badge-orange";
  return "badge-green";
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Equipment() {
  const [filter, setFilter] = useState("All");

  // FIX 1: store object instead of index (prevents wrong toggle after filtering)
  const [expandedId, setExpandedId] = useState(null);

  // FIX 2: memoized filter (performance)
  const filtered = useMemo(() => {
    return filter === "All"
      ? EQUIPMENT
      : EQUIPMENT.filter((e) => e.muscles.includes(filter));
  }, [filter]);

  const toggle = (name) => {
    setExpandedId((prev) => (prev === name ? null : name));
  };

  return (
    <>
      <div className="topbar">
        <div className="page-title">Equipment Guide</div>
      </div>

      <div className="page-body">
        {/* FILTER CHIPS */}
        <div style={styles.chipWrap}>
          {MUSCLES.map((m) => (
            <button
              key={m}
              onClick={() => {
                setFilter(m);
                setExpandedId(null); // reset expanded on filter change
              }}
              style={{
                ...styles.chip,
                borderColor:
                  filter === m ? "var(--gold)" : "var(--border2)",
                background:
                  filter === m ? "var(--gold-soft)" : "var(--card2)",
                color:
                  filter === m ? "var(--gold)" : "var(--muted2)",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid-3">
          {filtered.map((eq) => {
            const isOpen = expandedId === eq.name;

            return (
              <div
                key={eq.name}
                className="equipment-card"
                role="button"
                tabIndex={0}
                onClick={() => toggle(eq.name)}
                onKeyDown={(e) => e.key === "Enter" && toggle(eq.name)}
              >
                <div style={styles.header}>
                  <div className="equipment-icon">{eq.icon}</div>
                  <span className={`badge ${levelColor(eq.level)}`}>
                    {eq.level}
                  </span>
                </div>

                <div className="equipment-name">{eq.name}</div>
                <div className="equipment-target">{eq.target}</div>

                {isOpen && (
                  <div style={styles.expanded}>
                    <div className="equipment-desc">{eq.desc}</div>

                    <div style={styles.tipBox}>
                      💡 {eq.tips}
                    </div>
                  </div>
                )}

                <div style={styles.toggleText}>
                  {isOpen ? "▲ Less" : "▼ How to use"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   STYLES (optimized reuse)
───────────────────────────────────────────── */
const styles = {
  chipWrap: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  chip: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Exo 2', sans-serif",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    transition: "all 0.15s",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  expanded: {
    marginTop: 12,
    borderTop: "1px solid var(--border)",
    paddingTop: 12,
  },

  tipBox: {
    marginTop: 10,
    padding: "8px 10px",
    background: "var(--gold-soft)",
    border: "1px solid rgba(240,180,41,0.15)",
    borderRadius: 4,
    fontSize: 11,
    color: "var(--gold-dim)",
    lineHeight: 1.6,
  },

  toggleText: {
    marginTop: 10,
    fontSize: 11,
    color: "var(--muted)",
    textAlign: "right",
  },
};