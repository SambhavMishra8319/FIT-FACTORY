
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