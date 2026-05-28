// StaticPages.jsx — Workout and Diet only
// Progress → src/pages/Progress.jsx (real Firebase data)
// Leaderboard → src/pages/Leaderboard.jsx (real Firebase + onSnapshot)

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// ── WORKOUT ───────────────────────────────────────────────
const PLANS = {
  "Weight Loss": [
    { name: "Treadmill Run",       sets: "1", reps: "30 min",  muscle: "Cardio"     },
    { name: "Jump Rope",           sets: "3", reps: "5 min",   muscle: "Full Body"  },
    { name: "Burpees",             sets: "4", reps: "15 reps", muscle: "Full Body"  },
    { name: "Box Jumps",           sets: "3", reps: "12 reps", muscle: "Legs"       },
    { name: "Mountain Climbers",   sets: "3", reps: "20 reps", muscle: "Core"       },
    { name: "Plank Hold",          sets: "3", reps: "60 sec",  muscle: "Core"       },
  ],
  "Muscle Gain": [
    { name: "Flat Bench Press",    sets: "4", reps: "10 reps", muscle: "Chest"       },
    { name: "Incline DB Press",    sets: "3", reps: "12 reps", muscle: "Upper Chest" },
    { name: "Cable Crossover",     sets: "3", reps: "15 reps", muscle: "Chest"       },
    { name: "Tricep Pushdown",     sets: "3", reps: "15 reps", muscle: "Triceps"     },
    { name: "Overhead Tricep Ext", sets: "3", reps: "12 reps", muscle: "Triceps"     },
    { name: "Dips",                sets: "3", reps: "Max",     muscle: "Triceps"     },
  ],
  "Body Recomp": [
    { name: "Deadlift",            sets: "4", reps: "8 reps",  muscle: "Back/Legs"  },
    { name: "Pull-ups",            sets: "3", reps: "Max",     muscle: "Back"        },
    { name: "Barbell Row",         sets: "3", reps: "10 reps", muscle: "Back"        },
    { name: "Dumbbell Curl",       sets: "3", reps: "12 reps", muscle: "Biceps"      },
    { name: "Hammer Curl",         sets: "3", reps: "12 reps", muscle: "Biceps"      },
    { name: "Face Pull",           sets: "3", reps: "15 reps", muscle: "Rear Delt"   },
  ],
};

export function Workout() {
  const [active, setActive]   = useState("Muscle Gain");
  const [done, setDone]       = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const exercises = PLANS[active] || PLANS["Muscle Gain"];
  const toggle    = (i) => setDone(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const percent   = Math.round((done.length / exercises.length) * 100);

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Workout Plans</div>
        <div className="topbar-right">
          {done.length > 0 && (
            <button className="btn btn-outline btn-sm tap-scale" onClick={() => setDone([])}>Reset</button>
          )}
          <button
            className="btn btn-primary btn-sm tap-scale btn-ripple"
            onClick={() => {
              setDone(exercises.map((_, i) => i));
              toast.success("Workout complete! 💪");
            }}
          >
            ✓ All Done
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Plan selector */}
        <div className="grid-3 mb-20">
          {Object.keys(PLANS).map((plan, i) => (
            <div
              key={plan}
              className="tap-scale"
              onClick={() => { setActive(plan); setDone([]); }}
              style={{
                padding: "14px 12px",
                background: active === plan
                  ? "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(201,162,39,0.05))"
                  : "var(--card)",
                border: `1px solid ${active === plan ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "var(--r-md)", cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                transform: active === plan ? "scale(1.02)" : "scale(1)",
                opacity: visible ? 1 : 0,
                transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s`,
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--muted2)", letterSpacing: 2, marginBottom: 4 }}>PLAN</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: active === plan ? "var(--gold)" : "var(--text)" }}>
                {plan}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 3 }}>{PLANS[plan].length} exercises</div>
            </div>
          ))}
        </div>

        {/* Progress header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--r-md)", padding: "14px 16px", marginBottom: 12,
          opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.2s",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--muted2)", letterSpacing: 2, marginBottom: 3 }}>TODAY'S PLAN</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--gold)" }}>{active}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--muted2)", letterSpacing: 2, marginBottom: 3 }}>PROGRESS</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: percent === 100 ? "var(--green)" : "var(--text)" }}>
              {percent}%
            </div>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="bca-track mb-16" style={{ height: 6 }}>
          <div style={{
            height: "100%", borderRadius: 3,
            background: percent === 100 ? "var(--green)" : "var(--grad-gold)",
            width: `${percent}%`,
            transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
          }} />
        </div>

        <div className="section-header mb-12">
          <div className="section-title">Exercises</div>
          <span style={{ fontSize: 12, color: "var(--muted2)" }}>{done.length}/{exercises.length}</span>
        </div>

        {exercises.map((ex, i) => (
          <div
            key={i}
            className="exercise-row tap-scale"
            style={{
              opacity: done.includes(i) ? 0.38 : visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transition: `opacity 0.2s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${0.25 + i * 0.05}s`,
            }}
            onClick={() => toggle(i)}
          >
            <div className="ex-num" style={{
              background: done.includes(i) ? "var(--green)" : "var(--grad-gold)",
              color: "var(--black)",
              transition: "background 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              {done.includes(i) ? "✓" : i + 1}
            </div>
            <div className="ex-info">
              <div className="ex-name" style={{ textDecoration: done.includes(i) ? "line-through" : "none" }}>{ex.name}</div>
              <div className="ex-detail">{ex.sets} sets × {ex.reps}</div>
            </div>
            <span className="ex-muscle">{ex.muscle}</span>
          </div>
        ))}

        {percent === 100 && (
          <div className="info-box success mt-12" style={{ animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
            🎉 Workout complete! Amazing work. Rest well and come back stronger!
          </div>
        )}
      </div>
    </div>
  );
}

// ── DIET ──────────────────────────────────────────────────
const DIET_PLANS = {
  "Muscle Gain": {
    calories: 2800, protein: 160, carbs: 300, fat: 80,
    meals: [
      { time: "🌅 Early Morning (6 AM)",   desc: "10 soaked almonds + 2 boiled eggs + warm lemon water",    kcal: 180 },
      { time: "🍳 Breakfast (8 AM)",       desc: "4 egg whites + 2 whole wheat roti + dahi + banana",       kcal: 520 },
      { time: "🥤 Pre-Workout (11 AM)",    desc: "1 scoop whey protein + apple OR banana with peanut butter",kcal: 300 },
      { time: "🍱 Lunch (1:30 PM)",        desc: "2 roti + rajma/chana + chawal + salad + dahi",            kcal: 680 },
      { time: "🥛 Post-Workout (4:30 PM)", desc: "1 scoop whey + 2 boiled eggs + 1 banana (within 30 min)",kcal: 420 },
      { time: "🌙 Dinner (8 PM)",          desc: "2 roti + paneer sabzi / chicken curry + salad + dal",     kcal: 580 },
      { time: "🌛 Before Bed (10 PM)",     desc: "1 glass warm milk + 5 almonds OR 1 scoop casein",        kcal: 150 },
    ],
  },
  "Weight Loss": {
    calories: 1800, protein: 130, carbs: 180, fat: 50,
    meals: [
      { time: "🌅 Early Morning", desc: "Warm lemon water + 5 soaked almonds",                            kcal: 60  },
      { time: "🍳 Breakfast",     desc: "2 egg whites + 1 multigrain roti + cucumber + green tea",        kcal: 280 },
      { time: "🥤 Mid Morning",   desc: "1 fruit (apple/guava/papaya) + 1 glass buttermilk",             kcal: 150 },
      { time: "🍱 Lunch",         desc: "1 roti + dal + sabzi + salad (no rice)",                        kcal: 380 },
      { time: "🥗 Evening",       desc: "Sprouts chaat OR roasted chana + green tea",                    kcal: 150 },
      { time: "🌙 Dinner",        desc: "2 egg whites / 100g grilled chicken + soup + salad",           kcal: 300 },
      { time: "🌛 Before Bed",    desc: "1 glass warm haldi milk (no sugar)",                           kcal: 80  },
    ],
  },
  "General Fitness": {
    calories: 2200, protein: 120, carbs: 240, fat: 65,
    meals: [
      { time: "🌅 Early Morning", desc: "Warm water + 8 almonds + 2 walnuts",                           kcal: 120 },
      { time: "🍳 Breakfast",     desc: "2 whole eggs + 2 roti + seasonal sabzi + chai",                kcal: 420 },
      { time: "🥤 Mid Morning",   desc: "1 fruit + handful of mixed nuts",                              kcal: 200 },
      { time: "🍱 Lunch",         desc: "2 roti + dal + sabzi + 1 small rice + dahi + salad",          kcal: 550 },
      { time: "🥗 Snack",         desc: "Poha/upma OR 2 whole wheat biscuits + green tea",             kcal: 250 },
      { time: "🌙 Dinner",        desc: "2 roti + sabzi + dal OR khichdi + salad",                     kcal: 480 },
      { time: "🌛 Before Bed",    desc: "1 glass warm milk",                                           kcal: 120 },
    ],
  },
};

export function Diet() {
  const [goal, setGoal]       = useState("Muscle Gain");
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const plan = DIET_PLANS[goal] || DIET_PLANS["General Fitness"];

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Diet Plans</div>
        <div className="topbar-right">
          <select className="form-input" style={{ width: "auto", fontSize: 12 }} value={goal} onChange={e => setGoal(e.target.value)}>
            {Object.keys(DIET_PLANS).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
      </div>
      <div className="page-body">
        <div className="stats-grid mb-16">
          {[
            { label: "Calories", value: plan.calories,        cls: "s-red",   val: "c-red"   },
            { label: "Protein",  value: `${plan.protein}g`,   cls: "s-gold",  val: "c-gold"  },
            { label: "Carbs",    value: `${plan.carbs}g`,     cls: "s-green", val: "c-green" },
            { label: "Fats",     value: `${plan.fat}g`,       cls: "s-blue",  val: "c-blue"  },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.cls}`} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.92)",
              transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s`,
            }}>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`} style={{ fontSize: 22 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="section-header mb-12">
          <div className="section-title">Meal Schedule — {goal}</div>
        </div>

        {plan.meals.map((m, i) => (
          <div key={i} className="meal-card tap-scale" style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-12px)",
            transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.07}s`,
          }}>
            <div style={{ flex: 1 }}>
              <div className="meal-name">{m.time}</div>
              <div className="meal-desc">{m.desc}</div>
            </div>
            <div className="meal-kcal">
              {m.kcal}<span style={{ fontSize: 11, color: "var(--muted2)" }}> kcal</span>
            </div>
          </div>
        ))}

        <div className="info-box warning mt-12">
          💧 Drink 3–4 litres of water daily · Avoid sugar and fried food · Follow consistently for best results
        </div>
      </div>
    </div>
  );
}
