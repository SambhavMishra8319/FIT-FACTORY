// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { format, subDays } from "date-fns";
// import toast from "react-hot-toast";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { useMembership } from "../../hooks/useMembership";
// import { LockGate, ExpiryBanner } from "../../components/LockGate";
// // import {
// //   bookSteamSlot, subscribeSteamBookings, deleteSteamBooking,
// //   saveWorkoutLog, getTodayWorkoutLog,
// //   getBCAReadings,
// //   getAchievements, checkAndAwardAchievements,
// //   subscribeLeaderboard,
// // } from "../../firebase/service";
// import {
//   bookSteamSlot, subscribeSteamSlots,
// deleteSteamSlot,
//   saveWorkoutLog, getTodayWorkoutLog,
//   getBCAReadings,
//   getAchievements, checkAndAwardAchievements,
//   subscribeLeaderboard,
// } from "../../firebase/service";

// // ── Shared skeleton loader ───────────────────────────────
// function Skeleton({ h = 14, w = "100%", mb = 8 }) {
//   return <div className="skeleton" style={{ height: h, width: w, marginBottom: mb, borderRadius: "var(--r-sm)" }} />;
// }

// function PageLoading() {
//   return (
//     <div style={{ padding: 20 }}>
//       {[80, 60, 80, 60].map((w, i) => <Skeleton key={i} h={16} w={`${w}%`} mb={12} />)}
//     </div>
//   );
// }

// // ── WORKOUT ───────────────────────────────────────────────
// const WORKOUT_PLANS = {
//   "Weight Loss":    [
//     { name: "Treadmill Run",       sets: "1", reps: "30 min",  muscle: "Cardio"     },
//     { name: "Jump Rope",           sets: "3", reps: "5 min",   muscle: "Full Body"  },
//     { name: "Burpees",             sets: "4", reps: "15 reps", muscle: "Full Body"  },
//     { name: "Box Jumps",           sets: "3", reps: "12 reps", muscle: "Legs"       },
//     { name: "Mountain Climbers",   sets: "3", reps: "20 reps", muscle: "Core"       },
//     { name: "Plank Hold",          sets: "3", reps: "60 sec",  muscle: "Core"       },
//   ],
//   "Muscle Gain":    [
//     { name: "Flat Bench Press",    sets: "4", reps: "10 reps", muscle: "Chest"      },
//     { name: "Incline DB Press",    sets: "3", reps: "12 reps", muscle: "Upper Chest"},
//     { name: "Cable Crossover",     sets: "3", reps: "15 reps", muscle: "Chest"      },
//     { name: "Tricep Pushdown",     sets: "3", reps: "15 reps", muscle: "Triceps"    },
//     { name: "Overhead Tricep Ext", sets: "3", reps: "12 reps", muscle: "Triceps"    },
//     { name: "Dips",                sets: "3", reps: "Max",     muscle: "Triceps"    },
//   ],
//   "Body Toning":    [
//     { name: "Squats",              sets: "4", reps: "15 reps", muscle: "Legs"       },
//     { name: "Lunges",              sets: "3", reps: "12 each", muscle: "Legs"       },
//     { name: "Glute Bridge",        sets: "3", reps: "15 reps", muscle: "Glutes"     },
//     { name: "Dumbbell Row",        sets: "3", reps: "12 reps", muscle: "Back"       },
//     { name: "Lateral Raises",      sets: "3", reps: "15 reps", muscle: "Shoulders"  },
//     { name: "Plank",               sets: "3", reps: "45 sec",  muscle: "Core"       },
//   ],
//   "General Fitness":[
//     { name: "Warm-up Walk",        sets: "1", reps: "10 min",  muscle: "Cardio"     },
//     { name: "Bodyweight Squats",   sets: "3", reps: "15 reps", muscle: "Legs"       },
//     { name: "Push-ups",            sets: "3", reps: "12 reps", muscle: "Chest"      },
//     { name: "Dumbbell Curl",       sets: "3", reps: "12 reps", muscle: "Biceps"     },
//     { name: "Seated Row",          sets: "3", reps: "12 reps", muscle: "Back"       },
//     { name: "Cool-down Stretch",   sets: "1", reps: "10 min",  muscle: "Flexibility"},
//   ],
// };

// export function MemberWorkout() {
//   const { membership, loading } = useMembership();
//   const { profile } = useAuth();
//   const [goal, setGoal]         = useState("General Fitness");
//   const [done, setDone]         = useState([]);
//   const [saving, setSaving]     = useState(false);
//   const [todayLog, setTodayLog] = useState(null);
//   const [visible, setVisible]   = useState(false);

//   useEffect(() => {
//     if (!profile?.phone) return;
//     // Fetch member's goal from Firestore
//     getDocs(query(collection(db, "members"), where("email", "==", (profile.email || "").toLowerCase())))
//       .then(snap => {
//         if (!snap.empty) {
//           const g = snap.docs[0].data().goal;
//           if (WORKOUT_PLANS[g]) setGoal(g);
//         }
//       }).catch(console.error);

//     // Load today's workout log
//     if (membership?.memberId) {
//       getTodayWorkoutLog(membership.memberId).then(log => {
//         if (log) {
//           setDone(Array.from({ length: log.exercisesDone }, (_, i) => i));
//           setTodayLog(log);
//         }
//         setTimeout(() => setVisible(true), 60);
//       });
//     } else {
//       setTimeout(() => setVisible(true), 60);
//     }
//   }, [profile, membership]);

//   const exercises = WORKOUT_PLANS[goal] || WORKOUT_PLANS["General Fitness"];

//   const toggle = (i) => setDone(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

//   const handleSave = async () => {
//     if (!membership?.memberId) { toast.error("Member account not linked."); return; }
//     setSaving(true);
//     try {
//       await saveWorkoutLog({
//         memberId:     membership.memberId,
//         memberName:   profile?.name,
//         plan:         goal,
//         exercisesDone: done.length,
//         total:        exercises.length,
//       });
//       if (done.length === exercises.length) {
//         toast.success("Workout complete! +50 pts earned 💪");
//       } else {
//         toast.success(`Progress saved: ${done.length}/${exercises.length} exercises`);
//       }
//     } catch { toast.error("Could not save progress."); }
//     finally  { setSaving(false); }
//   };

//   const percent = Math.round((done.length / exercises.length) * 100);

//   if (loading) return <PageLoading />;

//   return (
//     <LockGate feature="workout" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar">
//           <div className="page-title">My Workout</div>
//           <div className="topbar-right">
//             {done.length > 0 && (
//               <button className="btn btn-outline btn-sm tap-scale" onClick={() => setDone([])}>Reset</button>
//             )}
//             <button className="btn btn-primary btn-sm tap-scale btn-ripple" onClick={handleSave} disabled={saving}>
//               {saving ? "Saving…" : "💾 Save"}
//             </button>
//           </div>
//         </div>
//         <div className="page-body">
//           <ExpiryBanner membership={membership} />

//           {/* Goal banner */}
//           <div style={{
//             display: "flex", justifyContent: "space-between", alignItems: "center",
//             background: "var(--card)", border: "1px solid var(--border)",
//             borderRadius: "var(--r-md)", padding: "14px 16px", marginBottom: 12,
//             opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.1s",
//           }}>
//             <div>
//               <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--muted2)", letterSpacing: 2, marginBottom: 3 }}>YOUR GOAL</div>
//               <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--gold)" }}>{goal}</div>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: "var(--muted2)", letterSpacing: 2, marginBottom: 3 }}>TODAY</div>
//               <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: percent === 100 ? "var(--green)" : "var(--text)" }}>
//                 {percent}%
//               </div>
//             </div>
//           </div>

//           {/* Progress bar */}
//           <div className="bca-track mb-16" style={{ height: 6 }}>
//             <div style={{
//               height: "100%", borderRadius: 3,
//               background: percent === 100 ? "var(--green)" : "var(--grad-gold)",
//               width: `${percent}%`,
//               transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
//             }} />
//           </div>

//           <div className="section-header mb-12">
//             <div className="section-title">Today's Exercises</div>
//             <span style={{ fontSize: 12, color: "var(--muted2)" }}>{done.length}/{exercises.length}</span>
//           </div>

//           {exercises.map((ex, i) => (
//             <div
//               key={i}
//               className="exercise-row tap-scale"
//               style={{
//                 opacity: done.includes(i) ? 0.38 : visible ? 1 : 0,
//                 transform: visible ? "translateX(0)" : "translateX(-16px)",
//                 transition: `opacity 0.2s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.05}s`,
//               }}
//               onClick={() => toggle(i)}
//             >
//               <div className="ex-num" style={{
//                 background: done.includes(i) ? "var(--green)" : "var(--grad-gold)",
//                 color: "var(--black)",
//                 transition: "background 0.3s ease",
//               }}>
//                 {done.includes(i) ? "✓" : i + 1}
//               </div>
//               <div className="ex-info">
//                 <div className="ex-name" style={{ textDecoration: done.includes(i) ? "line-through" : "none" }}>
//                   {ex.name}
//                 </div>
//                 <div className="ex-detail">{ex.sets} sets × {ex.reps}</div>
//               </div>
//               <span className="ex-muscle">{ex.muscle}</span>
//             </div>
//           ))}

//           {percent === 100 && (
//             <div className="info-box success mt-12" style={{ animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
//               🎉 Workout complete! +50 points added to your leaderboard score. Rest well!
//             </div>
//           )}

//           <div className="info-box warning mt-12">
//             💡 Tap any exercise to mark it done · Progress is saved to Firebase automatically
//           </div>
//         </div>
//       </div>
//     </LockGate>
//   );
// }

// // ── DIET ──────────────────────────────────────────────────
// const DIET_PLANS = {
//   "Muscle Gain": { calories: 2800, protein: 160, carbs: 300, fat: 80, meals: [
//     { time: "🌅 Early Morning (6 AM)",   desc: "10 soaked almonds + 2 boiled eggs + warm lemon water", kcal: 180 },
//     { time: "🍳 Breakfast (8 AM)",       desc: "4 egg whites + 2 whole wheat roti + dahi + banana",    kcal: 520 },
//     { time: "🥤 Pre-Workout (11 AM)",    desc: "1 scoop whey protein + apple OR banana with peanut butter", kcal: 300 },
//     { time: "🍱 Lunch (1:30 PM)",        desc: "2 roti + rajma/chana + chawal + salad + dahi",         kcal: 680 },
//     { time: "🥛 Post-Workout (4:30 PM)", desc: "1 scoop whey + 2 boiled eggs + 1 banana (within 30 min)", kcal: 420 },
//     { time: "🌙 Dinner (8 PM)",          desc: "2 roti + paneer sabzi / chicken curry + salad + dal",  kcal: 580 },
//     { time: "🌛 Before Bed (10 PM)",     desc: "1 glass warm milk + 5 almonds OR 1 scoop casein",     kcal: 150 },
//   ]},
//   "Weight Loss": { calories: 1800, protein: 130, carbs: 180, fat: 50, meals: [
//     { time: "🌅 Early Morning",  desc: "Warm lemon water + 5 soaked almonds",                         kcal: 60  },
//     { time: "🍳 Breakfast",      desc: "2 egg whites + 1 multigrain roti + cucumber + green tea",     kcal: 280 },
//     { time: "🥤 Mid Morning",    desc: "1 fruit (apple/guava/papaya) + 1 glass buttermilk",          kcal: 150 },
//     { time: "🍱 Lunch",          desc: "1 roti + dal + sabzi + salad (no rice)",                     kcal: 380 },
//     { time: "🥗 Evening",        desc: "Sprouts chaat OR roasted chana + green tea",                 kcal: 150 },
//     { time: "🌙 Dinner",         desc: "2 egg whites / 100g grilled chicken + soup + salad",        kcal: 300 },
//     { time: "🌛 Before Bed",     desc: "1 glass warm haldi milk (no sugar)",                        kcal: 80  },
//   ]},
//   "Body Toning": { calories: 2000, protein: 140, carbs: 200, fat: 60, meals: [
//     { time: "🌅 Early Morning",  desc: "Warm water + 8 almonds + 2 walnuts",                        kcal: 100 },
//     { time: "🍳 Breakfast",      desc: "3 egg whites + 1 whole egg + 1 roti + green tea",           kcal: 380 },
//     { time: "🥤 Pre-Workout",    desc: "Banana + 1 scoop whey OR peanut butter on toast",           kcal: 280 },
//     { time: "🍱 Lunch",          desc: "2 roti + dal + grilled paneer/chicken + salad + dahi",      kcal: 580 },
//     { time: "🥛 Post-Workout",   desc: "1 scoop whey protein + 1 fruit",                           kcal: 250 },
//     { time: "🌙 Dinner",         desc: "1 roti + vegetable sabzi + dal + salad",                   kcal: 380 },
//     { time: "🌛 Before Bed",     desc: "1 glass warm milk",                                        kcal: 100 },
//   ]},
//   "General Fitness": { calories: 2200, protein: 120, carbs: 240, fat: 65, meals: [
//     { time: "🌅 Early Morning",  desc: "Warm water + 8 almonds + 2 walnuts",                       kcal: 120 },
//     { time: "🍳 Breakfast",      desc: "2 whole eggs + 2 roti + seasonal sabzi + chai",            kcal: 420 },
//     { time: "🥤 Mid Morning",    desc: "1 fruit + handful of mixed nuts",                          kcal: 200 },
//     { time: "🍱 Lunch",          desc: "2 roti + dal + sabzi + 1 small rice + dahi + salad",      kcal: 550 },
//     { time: "🥗 Snack",          desc: "Poha/upma OR 2 whole wheat biscuits + green tea",         kcal: 250 },
//     { time: "🌙 Dinner",         desc: "2 roti + sabzi + dal OR khichdi + salad",                 kcal: 480 },
//     { time: "🌛 Before Bed",     desc: "1 glass warm milk",                                       kcal: 120 },
//   ]},
// };

// export function MemberDiet() {
//   const { membership, loading } = useMembership();
//   const { profile } = useAuth();
//   const [goal, setGoal]       = useState("General Fitness");
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (!profile?.phone) { setTimeout(() => setVisible(true), 60); return; }
//     getDocs(query(collection(db, "members"), where("email", "==", (profile.email || "").toLowerCase())))
//       .then(snap => { if (!snap.empty) { const g = snap.docs[0].data().goal; if (DIET_PLANS[g]) setGoal(g); } })
//       .catch(console.error)
//       .finally(() => setTimeout(() => setVisible(true), 60));
//   }, [profile]);

//   if (loading) return <PageLoading />;
//   const plan = DIET_PLANS[goal] || DIET_PLANS["General Fitness"];

//   return (
//     <LockGate feature="diet" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar">
//           <div className="page-title">My Diet Plan</div>
//           <div className="topbar-right">
//             <select className="form-input" style={{ width: "auto", fontSize: 12 }} value={goal} onChange={e => setGoal(e.target.value)}>
//               {Object.keys(DIET_PLANS).map(k => <option key={k}>{k}</option>)}
//             </select>
//           </div>
//         </div>
//         <div className="page-body">
//           <ExpiryBanner membership={membership} />
//           <div className="stats-grid mb-16">
//             {[
//               { label: "Calories", value: plan.calories, cls: "s-red",   val: "c-red"   },
//               { label: "Protein",  value: `${plan.protein}g`, cls: "s-gold",  val: "c-gold"  },
//               { label: "Carbs",    value: `${plan.carbs}g`,   cls: "s-green", val: "c-green" },
//               { label: "Fats",     value: `${plan.fat}g`,     cls: "s-blue",  val: "c-blue"  },
//             ].map((s, i) => (
//               <div key={i} className={`stat-card ${s.cls}`} style={{ opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${i*0.07}s` }}>
//                 <div className="stat-label">{s.label}</div>
//                 <div className={`stat-value ${s.val}`} style={{ fontSize: 22 }}>{s.value}</div>
//               </div>
//             ))}
//           </div>
//           <div className="section-header mb-12"><div className="section-title">Meal Schedule — {goal}</div></div>
//           {plan.meals.map((m, i) => (
//             <div key={i} className="meal-card tap-scale" style={{
//               opacity: visible ? 1 : 0,
//               transform: visible ? "translateX(0)" : "translateX(-12px)",
//               transition: `all 0.4s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.07}s`,
//             }}>
//               <div style={{ flex: 1 }}>
//                 <div className="meal-name">{m.time}</div>
//                 <div className="meal-desc">{m.desc}</div>
//               </div>
//               <div className="meal-kcal">{m.kcal}<span style={{ fontSize: 11, color: "var(--muted2)" }}> kcal</span></div>
//             </div>
//           ))}
//           <div className="info-box warning mt-12">💧 3–4 litres water daily · Avoid sugar and fried food · Follow consistently</div>
//         </div>
//       </div>
//     </LockGate>
//   );
// }

// // ── BCA ───────────────────────────────────────────────────
// export function MemberBCA() {
//   const { membership, loading } = useMembership();
//   const [readings, setReadings] = useState([]);
//   const [fetching, setFetching] = useState(true);
//   const [visible, setVisible]   = useState(false);

//   useEffect(() => {
//     if (!membership?.memberId) { setFetching(false); setTimeout(() => setVisible(true), 60); return; }
//     getBCAReadings(membership.memberId)
//       .then(setReadings).catch(console.error)
//       .finally(() => { setFetching(false); setTimeout(() => setVisible(true), 60); });
//   }, [membership]);

//   if (loading || fetching) return <PageLoading />;

//   const latest   = readings[0] || null;
//   const previous = readings[1] || null;
//   const diff = k => {
//     if (!latest || !previous || !latest[k] || !previous[k]) return null;
//     const d = (latest[k] - previous[k]).toFixed(1);
//     return Number(d) > 0 ? `+${d}` : `${d}`;
//   };
//   const diffColor = (k, lowerBetter = true) => {
//     const d = diff(k); if (!d) return "var(--muted2)";
//     return (lowerBetter ? Number(d) < 0 : Number(d) > 0) ? "var(--green)" : "var(--red)";
//   };
//   const chartData = [...readings].reverse().map(r => ({ date: r.date?.slice(5), weight: r.weight, fat: r.fat, muscle: r.muscle }));

//   return (
//     <LockGate feature="bca" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar"><div className="page-title">My Body Analysis</div></div>
//         <div className="page-body">
//           <ExpiryBanner membership={membership} />
//           {readings.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted2)" }}>
//               <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
//               <div style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 2, color: "var(--gold)", marginBottom: 8 }}>NO BCA READINGS YET</div>
//               <div style={{ fontSize: 13 }}>Ask your trainer at F2 Fit Factory to record your first body analysis reading.</div>
//             </div>
//           ) : (
//             <>
//               <div className="stats-grid mb-16">
//                 {[
//                   { label: "Weight",  value: `${latest?.weight}`, unit: "kg",  cls: "s-red",  val: "c-red",   diffKey: "weight",  lb: true  },
//                   { label: "Body Fat",value: `${latest?.fat}`,    unit: "%",   cls: "s-gold", val: "c-gold",  diffKey: "fat",     lb: true  },
//                   { label: "Muscle",  value: `${latest?.muscle}`, unit: "kg",  cls: "s-green",val: "c-green", diffKey: "muscle",  lb: false },
//                   { label: "BMI",     value: `${latest?.bmi}`,    unit: "",    cls: "s-blue", val: "c-blue",  diffKey: "bmi",     lb: true  },
//                 ].map((s, i) => (
//                   <div key={i} className={`stat-card ${s.cls}`} style={{ opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${i*0.07}s` }}>
//                     <div className="stat-label">{s.label}</div>
//                     <div className={`stat-value ${s.val}`} style={{ fontSize: 22 }}>{s.value || "—"}<span style={{ fontSize: 12 }}>{s.unit}</span></div>
//                     {diff(s.diffKey) && <div className="stat-sub" style={{ color: diffColor(s.diffKey, s.lb) }}>{diff(s.diffKey)} vs prev</div>}
//                   </div>
//                 ))}
//               </div>

//               <div className="grid-2 mb-16">
//                 <div className="card" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.3s" }}>
//                   <div className="card-title">Body Composition</div>
//                   {latest?.fat > 0 && (
//                     <div className="bca-bar-wrap">
//                       <div className="bca-label-row"><span className="label">Body Fat %</span><span style={{ color: "var(--orange)", fontWeight: 600 }}>{latest.fat}%</span></div>
//                       <div className="bca-track"><div className="bca-fill fat" style={{ width: `${Math.min(latest.fat, 100)}%` }} /></div>
//                     </div>
//                   )}
//                   {latest?.muscle > 0 && (
//                     <div className="bca-bar-wrap">
//                       <div className="bca-label-row"><span className="label">Muscle Mass</span><span style={{ color: "var(--blue)", fontWeight: 600 }}>{latest.muscle} kg</span></div>
//                       <div className="bca-track"><div className="bca-fill muscle" style={{ width: `${Math.min((latest.muscle / 80) * 100, 100)}%` }} /></div>
//                     </div>
//                   )}
//                   {latest?.water > 0 && (
//                     <div className="bca-bar-wrap">
//                       <div className="bca-label-row"><span className="label">Body Water</span><span style={{ color: "var(--green)", fontWeight: 600 }}>{latest.water}%</span></div>
//                       <div className="bca-track"><div className="bca-fill water" style={{ width: `${Math.min(latest.water, 100)}%` }} /></div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="card" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.35s" }}>
//                   <div className="card-title">Progress Chart</div>
//                   {chartData.length < 2 ? (
//                     <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted2)", fontSize: 12, textAlign: "center" }}>
//                       Add 2+ readings<br />to see chart
//                     </div>
//                   ) : (
//                     <ResponsiveContainer width="100%" height={140}>
//                       <LineChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
//                         <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} />
//                         <YAxis tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} />
//                         <Tooltip contentStyle={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12 }} />
//                         <Line type="monotone" dataKey="weight" stroke="#f5c842" strokeWidth={2} dot={{ r: 3, fill: "#f5c842" }} name="Weight" />
//                         {chartData.some(d => d.muscle) && <Line type="monotone" dataKey="muscle" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} name="Muscle" />}
//                         {chartData.some(d => d.fat)    && <Line type="monotone" dataKey="fat"    stroke="#e63329" strokeWidth={2} dot={{ r: 3, fill: "#e63329" }} name="Fat%" />}
//                       </LineChart>
//                     </ResponsiveContainer>
//                   )}
//                 </div>
//               </div>

//               <div className="section-header mb-12"><div className="section-title">All Readings</div></div>
//               <div className="table-wrap">
//                 <table>
//                   <thead><tr><th>Date</th><th>Weight</th><th>Fat%</th><th>Muscle</th><th>BMI</th></tr></thead>
//                   <tbody>
//                     {readings.map(r => (
//                       <tr key={r.id}>
//                         <td><strong>{r.date}</strong></td>
//                         <td>{r.weight ? `${r.weight} kg` : "—"}</td>
//                         <td>{r.fat ? `${r.fat}%` : "—"}</td>
//                         <td>{r.muscle ? `${r.muscle} kg` : "—"}</td>
//                         <td>{r.bmi || "—"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </LockGate>
//   );
// }

// // ── STEAM ─────────────────────────────────────────────────
// const ALL_SLOTS = [
//   { time: "6:00 AM", period: "Morning" }, { time: "7:00 AM", period: "Morning" },
//   { time: "8:00 AM", period: "Morning" }, { time: "9:00 AM", period: "Morning" },
//   { time: "5:00 PM", period: "Evening" }, { time: "6:00 PM", period: "Evening" },
//   { time: "7:00 PM", period: "Evening" }, { time: "8:00 PM", period: "Evening" },
// ];

// export function MemberSteam() {
//   const { membership, loading } = useMembership();
//   const { profile } = useAuth();
//   const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
//   const [bookings, setBookings]         = useState([]);
//   const [selected, setSelected]         = useState(null);
//   const [saving, setSaving]             = useState(false);

//   useEffect(() => {
//     // ✅ Realtime listener
//     // const unsub = subscribeSteamBookings(selectedDate, setBookings);
//     const unsub = subscribeSteamSlots(selectedDate, setBookings);
//     return () => unsub();
//   }, [selectedDate]);

//   const bookedSlots = bookings.map(b => b.slot);
//   const myBookings  = bookings.filter(b => b.memberId === membership?.memberId);
//   const mySlots     = myBookings.map(b => b.slot);
//   const available   = ALL_SLOTS.filter(s => !bookedSlots.includes(s.time)).length;

//   const book = async () => {
//     if (!selected) { toast.error("Select a slot."); return; }
//     if (!membership?.memberId) { toast.error("Member account not linked."); return; }
//     setSaving(true);
//     try {
//       // ✅ FIX #2 — Uses Firestore transaction
//       await bookSteamSlot({
//         date:        selectedDate,
//         slot:        selected,
//         memberId:    membership.memberId,
//         memberName:  profile?.name,
//         memberPhone: profile?.email || "",
//       });
//       toast.success(`Booked at ${selected} 🌫️`);
//       setSelected(null);
//     } catch (err) {
//       toast.error(err.message || "Booking failed. Please try again.");
//     } finally { setSaving(false); }
//   };

//   const cancel = async (id, slot) => {
//     if (!window.confirm(`Cancel your ${slot} booking?`)) return;
//     try { await deleteSteamSlot(id); toast.success("Cancelled."); }
//     catch { toast.error("Could not cancel."); }
//   };

//   if (loading) return <PageLoading />;

//   return (
//     <LockGate feature="steam" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar">
//           <div className="page-title">Steam Bath</div>
//           <div className="topbar-right">
//             <input className="form-input" type="date" value={selectedDate}
//               min={format(new Date(), "yyyy-MM-dd")}
//               onChange={e => { setSelectedDate(e.target.value); setSelected(null); }}
//               style={{ width: "auto", fontSize: 13 }} />
//           </div>
//         </div>
//         <div className="page-body">
//           <ExpiryBanner membership={membership} />
//           <div className="stats-grid mb-16" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
//             <div className="stat-card s-green"><div className="stat-label">Available</div><div className="stat-value c-green">{available}</div></div>
//             <div className="stat-card s-red"><div className="stat-label">Booked</div><div className="stat-value c-red">{bookings.length}</div></div>
//             <div className="stat-card s-gold"><div className="stat-label">Duration</div><div className="stat-value c-gold">20<span style={{ fontSize: 14 }}>min</span></div></div>
//           </div>

//           {["Morning", "Evening"].map(period => (
//             <div key={period}>
//               <div className="section-header mb-12"><div className="section-title">{period} Slots</div></div>
//               <div className="slot-grid mb-16">
//                 {ALL_SLOTS.filter(s => s.period === period).map(s => {
//                   const isBooked = bookedSlots.includes(s.time) && !mySlots.includes(s.time);
//                   const isMine   = mySlots.includes(s.time);
//                   const isSel    = selected === s.time;
//                   return (
//                     <div key={s.time} className={`slot tap-scale ${isBooked ? "booked" : ""} ${isSel || isMine ? "selected" : ""}`}
//                       onClick={() => !isBooked && !isMine && setSelected(isSel ? null : s.time)}>
//                       <div className="slot-time">{s.time}</div>
//                       <div className="slot-label">
//                         {isMine ? "✓ Mine" : isBooked ? "Taken" : isSel ? "Selected" : "Available"}
//                       </div>
//                       {isMine && (
//                         <button style={{ marginTop: 4, fontSize: 9, background: "rgba(230,51,41,0.15)", border: "none", color: "var(--red)", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}
//                           onClick={e => { e.stopPropagation(); const b = myBookings.find(b => b.slot === s.time); if (b) cancel(b.id, s.time); }}>
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}

//           {selected && myBookings.length === 0 && (
//             <div className="card" style={{ background: "rgba(245,200,66,0.04)", borderColor: "rgba(245,200,66,0.2)", animation: "fadeUp 0.3s ease" }}>
//               <div style={{ fontSize: 13, marginBottom: 12 }}>
//                 Confirm steam bath at <strong style={{ color: "var(--gold)" }}>{selected}</strong> on {selectedDate}?
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button className="btn btn-primary tap-scale btn-ripple" onClick={book} disabled={saving} style={{ flex: 1 }}>
//                   {saving ? "Booking…" : "Confirm Booking 🌫️"}
//                 </button>
//                 <button className="btn btn-outline tap-scale" onClick={() => setSelected(null)}>Cancel</button>
//               </div>
//               {saving && <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 8, textAlign: "center" }}>Checking availability…</div>}
//             </div>
//           )}

//           {myBookings.length > 0 && (
//             <div className="info-box success mt-12">
//               ✓ Your booking: <strong>{myBookings[0].slot}</strong> on {selectedDate}. See you there!
//             </div>
//           )}

//           <div className="info-box warning mt-12">🌡 80–90°C · 💧 Detox · Muscle Recovery · Stress Relief · Max 1 booking/day</div>
//         </div>
//       </div>
//     </LockGate>
//   );
// }

// // ── PROGRESS ──────────────────────────────────────────────
// export function MemberProgress() {
//   const { membership, loading } = useMembership();
//   const { profile } = useAuth();
//   const [attendance, setAttendance]   = useState([]);
//   const [bcaReadings, setBcaReadings] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [lbRank, setLbRank]           = useState(null);
//   const [fetching, setFetching]       = useState(true);
//   const [visible, setVisible]         = useState(false);

//   useEffect(() => {
//     if (!membership?.memberId) { setFetching(false); setTimeout(() => setVisible(true), 60); return; }
//     Promise.all([
//       getDocs(query(collection(db, "attendance"), where("memberId", "==", membership.memberId))),
//       getBCAReadings(membership.memberId),
//       getAchievements(membership.memberId),
//     ]).then(([aSnap, bca, ach]) => {
//       const att = aSnap.docs.map(d => d.data());
//       setAttendance(att);
//       setBcaReadings(bca);
//       setAchievements(ach);

//       // Check and award new achievements
//       checkAndAwardAchievements(membership.memberId, profile?.name, { attendance: att, bcaReadings: bca })
//         .then(newOnes => {
//           if (newOnes.length > 0) {
//             newOnes.forEach(a => toast.success(`🏆 Achievement unlocked: ${a.name}!`));
//             getAchievements(membership.memberId).then(setAchievements);
//           }
//         }).catch(console.error);
//     }).catch(console.error)
//       .finally(() => { setFetching(false); setTimeout(() => setVisible(true), 60); });

//     // Get leaderboard rank
//     subscribeLeaderboard(leaders => {
//       const idx = leaders.findIndex(l => l.memberId === membership.memberId);
//       if (idx !== -1) setLbRank({ rank: idx + 1, points: leaders[idx].points });
//     });
//   }, [membership]);

//   if (loading || fetching) return <PageLoading />;

//   const dates = new Set(attendance.map(a => a.date));
//   let streak = 0; let d = new Date();
//   while (dates.has(format(d, "yyyy-MM-dd"))) { streak++; d.setDate(d.getDate() - 1); }
//   const thisMonth    = format(new Date(), "yyyy-MM");
//   const monthSessions = attendance.filter(a => a.date?.startsWith(thisMonth)).length;
//   const earnedCount  = achievements.filter(a => a.earned).length;

//   const last7 = Array.from({ length: 7 }, (_, i) => {
//     const day = subDays(new Date(), 6 - i);
//     return { date: format(day, "yyyy-MM-dd"), label: format(day, "EEE"), present: dates.has(format(day, "yyyy-MM-dd")) };
//   });

//   const anim = delay => ({
//     opacity: visible ? 1 : 0,
//     transform: visible ? "scale(1)" : "scale(0.94)",
//     transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
//   });

//   return (
//     <LockGate feature="progress" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar"><div className="page-title">My Progress</div></div>
//         <div className="page-body">
//           <ExpiryBanner membership={membership} />

//           <div className="stats-grid mb-16">
//             {[
//               { label: "Day Streak",   value: streak,        cls: "s-gold",  val: "c-gold",  sub: streak > 0 ? "🔥 Keep going!" : "Start today!" },
//               { label: "This Month",   value: monthSessions, cls: "s-green", val: "c-green", sub: "Sessions"       },
//               { label: "Total",        value: attendance.length, cls: "s-red", val: "c-red", sub: "All time"       },
//               { label: "Rank",         value: lbRank ? `#${lbRank.rank}` : "—", cls: "s-gold", val: "c-gold", sub: lbRank ? `${lbRank.points} pts` : "No points yet" },
//             ].map((s, i) => (
//               <div key={i} className={`stat-card ${s.cls}`} style={anim(i * 0.07)}>
//                 <div className="stat-label">{s.label}</div>
//                 <div className={`stat-value ${s.val}`}>{s.value}</div>
//                 <div className="stat-sub">{s.sub}</div>
//               </div>
//             ))}
//           </div>

//           {/* 7-day heatmap */}
//           <div className="card mb-16" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.28s" }}>
//             <div className="card-title">Last 7 Days</div>
//             <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
//               {last7.map(d => (
//                 <div key={d.date} style={{ flex: 1, textAlign: "center" }}>
//                   <div style={{
//                     width: "100%", aspectRatio: "1", borderRadius: 8,
//                     background: d.present ? "var(--grad-gold)" : "var(--card2)",
//                     border: `1px solid ${d.present ? "var(--gold-dark)" : "var(--border)"}`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 14, color: d.present ? "var(--black)" : "transparent", marginBottom: 6,
//                     transition: "all 0.3s ease",
//                   }}>
//                     ✓
//                   </div>
//                   <div style={{ fontSize: 10, color: d.present ? "var(--gold)" : "var(--muted)" }}>{d.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Achievements */}
//           <div className="section-header mb-12">
//             <div className="section-title">Achievements</div>
//             <span style={{ fontSize: 12, color: "var(--muted2)" }}>{earnedCount}/{achievements.length} earned</span>
//           </div>
//           <div className="grid-3">
//             {achievements.map((a, i) => (
//               <div key={i} className={`achievement-card ${a.earned ? "earned" : "locked"}`} style={anim(0.3 + i * 0.05)}>
//                 <div className="achievement-icon">{a.icon}</div>
//                 <div className="achievement-name">{a.name}</div>
//                 <div className="achievement-desc">{a.desc}</div>
//                 {a.earned
//                   ? <div style={{ fontSize: 10, color: "var(--gold)", marginTop: 4, fontFamily: "var(--font-display)", letterSpacing: 1 }}>EARNED ✓</div>
//                   : <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>🔒 Locked</div>
//                 }
//               </div>
//             ))}
//           </div>

//           <div className="info-box warning mt-16">
//             🏆 Points: check-in (+10) · full workout (+50) · BCA reading (+30) · steam bath (+20)
//           </div>
//         </div>
//       </div>
//     </LockGate>
//   );
// }
