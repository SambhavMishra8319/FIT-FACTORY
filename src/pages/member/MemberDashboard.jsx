// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   limit,
// } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { format } from "date-fns";
// import { useMembership } from "../../hooks/useMembership";
// import {
//   MembershipBanner,
//   ExpiryBanner,
//   SectionLock,
// } from "../../components/auth/LockGate";
// import "../../styles/MemberDashboard.css";

// const SAMPLE_BCA = {
//   weight: "72.4",
//   fat: "22.5%",
//   muscle: "35.8 kg",
//   bmi: "22.4",
// };

// const SAMPLE_EXERCISES = [
//   "Flat Bench Press",
//   "Incline DB Press",
//   "Cable Crossover",
//   "Tricep Pushdown",
// ];

// const SAMPLE_MEALS = [
//   {
//     time: "🌅 Early Morning",
//     desc: "10 almonds + 2 eggs + lemon water",
//     kcal: 180,
//   },
//   {
//     time: "🍳 Breakfast",
//     desc: "4 egg whites + 2 roti + dahi",
//     kcal: 520,
//   },
//   {
//     time: "🍱 Lunch",
//     desc: "2 roti + rajma + chawal + salad",
//     kcal: 680,
//   },
// ];

// const SAMPLE_STEAM_SLOTS = [
//   { time: "6:00 AM" },
//   { time: "7:00 AM" },
//   { time: "8:00 AM" },
//   { time: "9:00 AM" },
// ];

// const taglines = [
//   "Ready to dominate today's workout? 🔥",
//   "No excuses. Just results. 💪",
//   "Your future physique starts today. ⚡",
//   "Train hard. Stay relentless. 🏆",
//   "Champions are built, not born. 👑",
// ];

// const dailyTagline = taglines[new Date().getDate() % taglines.length];

// export default function MemberDashboard() {
//   const { profile } = useAuth();
//   const { membership, loading: mLoading } = useMembership();
//   const navigate = useNavigate();

//   const [member, setMember] = useState(null);
//   const [bcaLatest, setBcaLatest] = useState(null);
//   const [steamBookings, setSteamBookings] = useState([]);
//   const [steamSlots, setSteamSlots] = useState([]);
//   const [workout, setWorkout] = useState([]);
//   const [diet, setDiet] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [visible, setVisible] = useState(false);
//   const [goal, setGoal] = useState("General Fitness");

//   const today = format(new Date(), "yyyy-MM-dd");
//   const hour = new Date().getHours();

//   const greeting =
//     hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

//   const isPaid = membership?.isPaid;

//   useEffect(() => {
//     if (!mLoading) {
//       fetchData();
//       setTimeout(() => setVisible(true), 80);
//     }
  
//   }, [mLoading, membership, profile]);

//   async function fetchData() {
//     if (!profile?.phone) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       let userGoal = "General Fitness";

//       const mSnap = await getDocs(
//         query(collection(db, "members"), where("phone", "==", profile.phone))
//       );

//       if (!mSnap.empty) {
//         const memberDoc = mSnap.docs[0];
//         const data = memberDoc.data();

//         setMember({
//           id: memberDoc.id,
//           ...data,
//         });

//         userGoal = data.goal || "General Fitness";
//         setGoal(userGoal);
//       }

//       const workoutSnap = await getDocs(
//         query(collection(db, "workout_plans"), where("goal", "==", userGoal))
//       );

//       setWorkout(
//         !workoutSnap.empty ? workoutSnap.docs[0].data().exercises || [] : []
//       );

//       const dietSnap = await getDocs(
//         query(collection(db, "diet_plans"), where("goal", "==", userGoal))
//       );

//       setDiet(!dietSnap.empty ? dietSnap.docs[0].data().meals || [] : []);

//       const steamSlotsSnap = await getDocs(
//         query(collection(db, "steam_slots"), where("active", "==", true))
//       );

//       setSteamSlots(
//         steamSlotsSnap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//         }))
//       );

//       if (membership?.memberId) {
//         const [bcaSnap, steamBookingSnap] = await Promise.all([
//           getDocs(
//             query(
//               collection(db, "bca_readings"),
//               where("memberId", "==", membership.memberId),
//               orderBy("date", "desc"),
//               limit(1)
//             )
//           ),
//           getDocs(
//             query(
//               collection(db, "steam_bookings"),
//               where("memberId", "==", membership.memberId),
//               where("date", ">=", today)
//             )
//           ),
//         ]);

//         if (!bcaSnap.empty) {
//           setBcaLatest(bcaSnap.docs[0].data());
//         } else {
//           setBcaLatest(null);
//         }

//         setSteamBookings(
//           steamBookingSnap.docs.map((d) => ({
//             id: d.id,
//             ...d.data(),
//           }))
//         );
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const initials =
//     profile?.name
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase() || "M";

//   const anim = (delay, style = {}) => ({
//     opacity: visible ? 1 : 0,
//     transform: visible ? "translateY(0)" : "translateY(16px)",
//     transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
//     ...style,
//   });

//   const displayWorkout = isPaid && workout.length ? workout : SAMPLE_EXERCISES;
//   const displayDiet = isPaid && diet.length ? diet : SAMPLE_MEALS;
//   const displaySteamSlots =
//     isPaid && steamSlots.length ? steamSlots : SAMPLE_STEAM_SLOTS;

//   if (mLoading || loading) {
//     return (
//       <div style={{ padding: 20 }}>
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="skeleton mb-12"
//             style={{
//               height: 60,
//               borderRadius: "var(--r-md)",
//             }}
//           />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="page-enter">
//       <div className="topbar">
//         <div>
//           <div className="greeting-block">
//             <div className="greeting-label">MEMBER DASHBOARD</div>

//             <div className="dashboard-greeting">
//               {greeting}, {profile?.name?.split(" ")[0] || "Champion"} 👋
//             </div>

//             <div className="dashboard-tagline">{dailyTagline}</div>
//           </div>

//           <div className="dashboard-date">{format(new Date(), "EEE, d MMM")}</div>
//         </div>
//       </div>

//       <div className="page-body">
//         <MembershipBanner membership={membership} />
//         <ExpiryBanner membership={membership} />

//         <div className="hero-banner mb-20" style={anim(0)}>
//           <div className="hero-overlay" />

//           <div className="hero-content">
//             <div className="hero-badge">⚡ PREMIUM FITNESS EXPERIENCE</div>
//             <div className="hero-title">F2 FIT-FACTORY</div>
//             <div className="hero-owner">by Nimesh Mishra</div>

//             <div className="hero-subtitle">
//               Train harder. Recover smarter. Become unstoppable.
//             </div>

//             <div className="hero-actions">
//               <button
//                 className="btn btn-primary tap-scale"
//                 onClick={() => navigate("/member/workout")}
//               >
//                 Start Workout
//               </button>

//               <button
//                 className="btn btn-outline tap-scale"
//                 onClick={() => navigate("/member/progress")}
//               >
//                 Track Progress
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="profile-header mb-16" style={anim(0.05)}>
//           <div className="avatar">{initials}</div>

//           <div style={{ flex: 1 }}>
//             <div className="profile-name">{profile?.name || "Member"}</div>
//             <div className="profile-meta">
//               📱 {profile?.email || member?.phone || "Member"}
//             </div>

//             <div className="profile-tags" style={{ marginTop: 8 }}>
//               {isPaid ? (
//                 <>
//                   <span className="badge badge-gold">{membership.plan}</span>
//                   <span className="badge badge-green">Active</span>

//                   {membership.daysLeft > 0 && (
//                     <span className="badge badge-blue">
//                       {membership.daysLeft}d left
//                     </span>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <span className="badge badge-gray">🆓 Free Account</span>
//                   <span
//                     className="badge badge-gold"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => navigate("/member/upgrade")}
//                   >
//                     Upgrade →
//                   </span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="stats-grid mb-20" style={anim(0.1)}>
//           <div className="stat-card s-gold">
//             <div className="stat-label">Plan</div>
//             <div
//               className="stat-value c-gold"
//               style={{ fontSize: isPaid ? 18 : 14 }}
//             >
//               {isPaid ? membership.plan : "Free"}
//             </div>
//             <div className="stat-sub">
//               {isPaid ? "Active member" : "Upgrade to unlock"}
//             </div>
//           </div>

//           <div className="stat-card s-green">
//             <div className="stat-label">Days Left</div>
//             <div className="stat-value c-green">
//               {isPaid ? membership.daysLeft : "—"}
//             </div>
//             <div className="stat-sub">
//               {isPaid ? `Till ${membership.expiryDate}` : "No active plan"}
//             </div>
//           </div>

//           <div
//             className="stat-card s-gold"
//             style={{ position: "relative", overflow: "hidden" }}
//           >
//             {!isPaid && (
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background: "rgba(8,8,8,0.7)",
//                   backdropFilter: "blur(3px)",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 4,
//                   cursor: "pointer",
//                   zIndex: 2,
//                 }}
//                 onClick={() => navigate("/member/upgrade")}
//               >
//                 <span style={{ fontSize: 18 }}>🔒</span>
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontSize: 9,
//                     color: "var(--gold)",
//                     letterSpacing: 1,
//                   }}
//                 >
//                   MEMBERS ONLY
//                 </span>
//               </div>
//             )}

//             <div className="stat-label">Weight</div>
//             <div className="stat-value c-gold" style={{ fontSize: 22 }}>
//               {isPaid && bcaLatest ? bcaLatest.weight : SAMPLE_BCA.weight}
//             </div>
//             <div className="stat-sub">
//               {isPaid
//                 ? bcaLatest
//                   ? `kg · ${bcaLatest.date}`
//                   : "No BCA yet"
//                 : "kg (sample)"}
//             </div>
//           </div>

//           <div
//             className="stat-card s-red"
//             style={{ position: "relative", overflow: "hidden" }}
//           >
//             {!isPaid && (
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background: "rgba(8,8,8,0.7)",
//                   backdropFilter: "blur(3px)",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 4,
//                   cursor: "pointer",
//                   zIndex: 2,
//                 }}
//                 onClick={() => navigate("/member/upgrade")}
//               >
//                 <span style={{ fontSize: 18 }}>🔒</span>
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontSize: 9,
//                     color: "var(--gold)",
//                     letterSpacing: 1,
//                   }}
//                 >
//                   MEMBERS ONLY
//                 </span>
//               </div>
//             )}

//             <div className="stat-label">Body Fat</div>
//             <div className="stat-value c-red" style={{ fontSize: 22 }}>
//               {isPaid && bcaLatest ? `${bcaLatest.fat}%` : SAMPLE_BCA.fat}
//             </div>
//             <div className="stat-sub">
//               {isPaid ? (bcaLatest ? "Last reading" : "No BCA yet") : "(sample)"}
//             </div>
//           </div>
//         </div>

//         <div style={anim(0.15)}>
//           <div className="section-header mb-12">
//             <div className="section-title">🏋️ Today's Workout</div>

//             {!isPaid && (
//               <span
//                 className="badge badge-gold"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/member/upgrade")}
//               >
//                 🔒 Unlock
//               </span>
//             )}
//           </div>

//           <SectionLock
//             feature="workout"
//             membership={membership}
//             label="WORKOUT PLANS — MEMBERS ONLY"
//           >
//             <div style={{ padding: "4px 0" }}>
//               {displayWorkout.map((ex, i) => (
//                 <div
//                   key={i}
//                   className="exercise-row"
//                   style={{ pointerEvents: "none" }}
//                 >
//                   <div
//                     className="ex-num"
//                     style={{
//                       background: "var(--grad-gold)",
//                       color: "var(--black)",
//                     }}
//                   >
//                     {i + 1}
//                   </div>

//                   <div className="ex-info">
//                     <div className="ex-name">
//                       {typeof ex === "string" ? ex : ex.name || "Exercise"}
//                     </div>

//                     <div className="ex-detail">
//                       {typeof ex === "string" ? (
//                         <>3 sets × 12 reps · Rest 60s</>
//                       ) : (
//                         <>
//                           {ex.sets || 3} sets × {ex.reps || 12} reps · Rest{" "}
//                           {ex.rest || 60}s
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   <span className="ex-muscle">
//                     {typeof ex === "string" ? "Chest" : ex.muscle || "Workout"}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </SectionLock>

//           {isPaid && (
//             <button
//               className="btn btn-primary tap-scale btn-ripple"
//               style={{ width: "100%", marginTop: 10 }}
//               onClick={() => navigate("/member/workout")}
//             >
//               Open Full Workout Plan →
//             </button>
//           )}
//         </div>

//         <div style={{ ...anim(0.22), marginTop: 24 }}>
//           <div className="section-header mb-12">
//             <div className="section-title">🥗 Today's Diet</div>

//             {!isPaid && (
//               <span
//                 className="badge badge-gold"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/member/upgrade")}
//               >
//                 🔒 Unlock
//               </span>
//             )}
//           </div>

//           <SectionLock
//             feature="diet"
//             membership={membership}
//             label="DIET PLANS — MEMBERS ONLY"
//           >
//             <div>
//               {displayDiet.map((m, i) => (
//                 <div
//                   key={i}
//                   className="meal-card"
//                   style={{ pointerEvents: "none" }}
//                 >
//                   <div style={{ flex: 1 }}>
//                     <div className="meal-name">
//                       {m.time || m.mealTime || m.title || `Meal ${i + 1}`}
//                     </div>

//                     <div className="meal-desc">
//                       {m.desc || m.description || m.food || "Diet details"}
//                     </div>
//                   </div>

//                   <div className="meal-kcal">
//                     {m.kcal || m.calories || "—"}
//                     <span style={{ fontSize: 11, color: "var(--muted2)" }}>
//                       {" "}
//                       kcal
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </SectionLock>

//           {isPaid && (
//             <button
//               className="btn btn-outline tap-scale"
//               style={{ width: "100%", marginTop: 10 }}
//               onClick={() => navigate("/member/diet")}
//             >
//               View Full Meal Plan →
//             </button>
//           )}
//         </div>

//         <div style={{ ...anim(0.28), marginTop: 24 }}>
//           <div className="section-header mb-12">
//             <div className="section-title">📊 Body Analysis (BCA)</div>

//             {!isPaid && (
//               <span
//                 className="badge badge-gold"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/member/upgrade")}
//               >
//                 🔒 Unlock
//               </span>
//             )}
//           </div>

//           <SectionLock
//             feature="bca"
//             membership={membership}
//             label="BCA TRACKING — MEMBERS ONLY"
//           >
//             <div className="card" style={{ pointerEvents: "none" }}>
//               {Object.entries(
//                 isPaid && bcaLatest
//                   ? {
//                       weight: `${bcaLatest.weight || "—"} kg`,
//                       fat: `${bcaLatest.fat || "—"}%`,
//                       muscle: `${bcaLatest.muscle || "—"} kg`,
//                       bmi: bcaLatest.bmi || "—",
//                     }
//                   : SAMPLE_BCA
//               ).map(([k, v]) => (
//                 <div
//                   key={k}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     padding: "9px 0",
//                     borderBottom: "1px solid var(--border)",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 13,
//                       color: "var(--muted2)",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {k}
//                   </span>

//                   <span
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 700,
//                       color: "var(--gold)",
//                     }}
//                   >
//                     {v}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </SectionLock>

//           {isPaid && (
//             <button
//               className="btn btn-outline tap-scale"
//               style={{ width: "100%", marginTop: 10 }}
//               onClick={() => navigate("/member/bca")}
//             >
//               View BCA Progress →
//             </button>
//           )}
//         </div>

//         <div style={{ ...anim(0.34), marginTop: 24 }}>
//           <div className="section-header mb-12">
//             <div className="section-title">🌫️ Steam Bath</div>

//             {!isPaid && (
//               <span
//                 className="badge badge-gold"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/member/upgrade")}
//               >
//                 🔒 Unlock
//               </span>
//             )}
//           </div>

//           <SectionLock
//             feature="steam"
//             membership={membership}
//             label="STEAM BOOKING — MEMBERS ONLY"
//           >
//             <div className="slot-grid" style={{ pointerEvents: "none" }}>
//               {displaySteamSlots.slice(0, 4).map((slot, i) => {
//                 const slotTime = slot.time || slot.slot || slot.label;

//                 const booked = steamBookings.some(
//                   (b) =>
//                     b.slot === slotTime ||
//                     b.time === slotTime ||
//                     b.slotTime === slotTime
//                 );

//                 return (
//                   <div
//                     key={slot.id || i}
//                     className={`slot ${booked ? "booked" : ""} ${
//                       !booked && i === 0 ? "selected" : ""
//                     }`}
//                   >
//                     <div className="slot-time">{slotTime}</div>

//                     <div className="slot-label">
//                       {booked ? "Booked" : "Available"}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </SectionLock>

//           {isPaid && steamBookings.length > 0 && (
//             <div className="info-box success mt-10">
//               ✓ You have a booking at{" "}
//               <strong>
//                 {steamBookings[0].slot ||
//                   steamBookings[0].time ||
//                   steamBookings[0].slotTime}
//               </strong>
//               !
//             </div>
//           )}

//           {isPaid && (
//             <button
//               className="btn btn-outline tap-scale"
//               style={{ width: "100%", marginTop: 10 }}
//               onClick={() => navigate("/member/steam")}
//             >
//               Book Steam Bath →
//             </button>
//           )}
//         </div>

//         {!isPaid && (
//           <div
//             style={{
//               ...anim(0.4),
//               marginTop: 28,
//               background:
//                 "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(201,162,39,0.06))",
//               border: "1px solid rgba(245,200,66,0.3)",
//               borderRadius: "var(--r-lg)",
//               padding: "24px 20px",
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: 44, marginBottom: 12 }}>⭐</div>

//             <div
//               style={{
//                 fontFamily: "var(--font-display)",
//                 fontSize: 16,
//                 fontWeight: 900,
//                 color: "var(--gold)",
//                 letterSpacing: 2,
//                 marginBottom: 10,
//               }}
//             >
//               UNLOCK EVERYTHING
//             </div>

//             <div
//               style={{
//                 fontSize: 13,
//                 color: "var(--text2)",
//                 lineHeight: 1.7,
//                 marginBottom: 18,
//               }}
//             >
//               You can see what's waiting for you above — workout plans, Indian
//               diet, BCA body tracking, steam bath booking and more. All locked
//               until you get a membership.
//             </div>

//             <button
//               className="btn btn-primary tap-scale btn-ripple"
//               style={{ width: "100%", padding: "13px", fontSize: 14 }}
//               onClick={() => navigate("/member/upgrade")}
//             >
//               View Membership Plans →
//             </button>

//             <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 10 }}>
//               Starting at just{" "}
//               <strong style={{ color: "var(--gold)" }}>₹1,500/month</strong> ·
//               Visit F2 Fit Factory, Mandla
//             </div>
//           </div>
//         )}

//         {isPaid && (
//           <div style={{ ...anim(0.4), marginTop: 24 }}>
//             <div
//               className="card tap-scale"
//               style={{
//                 cursor: "pointer",
//                 border: "1px solid rgba(245,200,66,0.15)",
//               }}
//               onClick={() => navigate("/member/equipment")}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ fontSize: 28 }}>🔧</span>

//                 <div>
//                   <div
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontSize: 13,
//                       color: "var(--gold)",
//                       letterSpacing: 1,
//                     }}
//                   >
//                     EQUIPMENT GUIDE
//                   </div>

//                   <div
//                     style={{
//                       fontSize: 12,
//                       color: "var(--muted2)",
//                       marginTop: 2,
//                     }}
//                   >
//                     Learn how to use every machine at F2 Fit Factory
//                   </div>
//                 </div>

//                 <span style={{ marginLeft: "auto", color: "var(--muted2)" }}>
//                   →
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div
//           style={{
//             ...anim(0.45),
//             marginTop: 24,
//             background:
//               "linear-gradient(135deg, rgba(245,200,66,0.06), transparent)",
//             border: "1px solid rgba(245,200,66,0.12)",
//             borderRadius: "var(--r-md)",
//             padding: "16px 18px",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: 15,
//               fontWeight: 900,
//               letterSpacing: 3,
//               color: "var(--gold)",
//               lineHeight: 1.3,
//               marginBottom: 5,
//             }}
//           >
//             PUSH YOUR LIMITS EVERY DAY
//           </div>

//           <div style={{ fontSize: 11, color: "var(--muted2)" }}>
//             F2 Fit-Factory BY Nimesh Mishra 🏆
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { format } from "date-fns";
import { useMembership } from "../../hooks/useMembership";
import {
  MembershipBanner,
  ExpiryBanner,
  SectionLock,
} from "../../components/auth/LockGate";
import "../../styles/MemberDashboard.css";

const SAMPLE_BCA = {
  weight: "72.4",
  fat: "22.5%",
  muscle: "35.8 kg",
  bmi: "22.4",
};

const SAMPLE_EXERCISES = [
  "Flat Bench Press",
  "Incline DB Press",
  "Cable Crossover",
  "Tricep Pushdown",
];

const SAMPLE_MEALS = [
  {
    time: "🌅 Early Morning",
    desc: "10 almonds + 2 eggs + lemon water",
    kcal: 180,
  },
  {
    time: "🍳 Breakfast",
    desc: "4 egg whites + 2 roti + dahi",
    kcal: 520,
  },
  {
    time: "🍱 Lunch",
    desc: "2 roti + rajma + chawal + salad",
    kcal: 680,
  },
];

const SAMPLE_STEAM_SLOTS = [
  { time: "6:00 AM" },
  { time: "7:00 AM" },
  { time: "8:00 AM" },
  { time: "9:00 AM" },
];

const taglines = [
  "Ready to dominate today's workout? 🔥",
  "No excuses. Just results. 💪",
  "Your future physique starts today. ⚡",
  "Train hard. Stay relentless. 🏆",
  "Champions are built, not born. 👑",
];

const dailyTagline = taglines[new Date().getDate() % taglines.length];

export default function MemberDashboard() {
  const { profile } = useAuth();
  const { membership, loading: mLoading } = useMembership();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [bcaLatest, setBcaLatest] = useState(null);
  const [steamBookings, setSteamBookings] = useState([]);
  const [massageBookings, setMassageBookings] = useState([]);
  const [steamSlots, setSteamSlots] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [diet, setDiet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [goal, setGoal] = useState("General Fitness");

  const today = format(new Date(), "yyyy-MM-dd");
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const isPaid = membership?.isPaid;

  useEffect(() => {
    if (!mLoading) {
      fetchData();
      setTimeout(() => setVisible(true), 80);
    }
  }, [mLoading, membership, profile]);

  async function fetchData() {
    if (!profile?.phone) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let userGoal = "General Fitness";

      const mSnap = await getDocs(
        query(collection(db, "members"), where("phone", "==", profile.phone))
      );

      if (!mSnap.empty) {
        const memberDoc = mSnap.docs[0];
        const data = memberDoc.data();

        setMember({
          id: memberDoc.id,
          ...data,
        });

        userGoal = data.goal || "General Fitness";
        setGoal(userGoal);
      }

      const workoutSnap = await getDocs(
        query(collection(db, "workout_plans"), where("goal", "==", userGoal))
      );

      setWorkout(
        !workoutSnap.empty ? workoutSnap.docs[0].data().exercises || [] : []
      );

      const dietSnap = await getDocs(
        query(collection(db, "diet_plans"), where("goal", "==", userGoal))
      );

      setDiet(!dietSnap.empty ? dietSnap.docs[0].data().meals || [] : []);

      const steamSlotsSnap = await getDocs(
        query(collection(db, "steam_slots"), where("active", "==", true))
      );

      setSteamSlots(
        steamSlotsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      if (membership?.memberId) {
        const [bcaSnap, steamBookingSnap, massageBookingSnap] =
          await Promise.all([
            getDocs(
              query(
                collection(db, "bca_readings"),
                where("memberId", "==", membership.memberId),
                orderBy("date", "desc"),
                limit(1)
              )
            ),
            getDocs(
              query(
                collection(db, "steam_bookings"),
                where("memberId", "==", membership.memberId),
                where("date", ">=", today)
              )
            ),
            getDocs(
              query(
                // collection(db, "massage_bookings"),
                collection(db, "massage_sessions"),
                where("memberId", "==", membership.memberId),
                where("date", ">=", today)
              )
            ),
          ]);

        if (!bcaSnap.empty) {
          setBcaLatest(bcaSnap.docs[0].data());
        } else {
          setBcaLatest(null);
        }

        setSteamBookings(
          steamBookingSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );

        setMassageBookings(
          massageBookingSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getBookingBoxClass = (status) => {
    if (status === "approved") return "info-box success mt-10";
    if (status === "rejected") return "info-box error mt-10";
    if (status === "completed") return "info-box success mt-10";
    return "info-box warning mt-10";
  };

  const getBookingMessage = (type, booking) => {
    const status = booking?.status || "pending";
    const slot = booking?.slot || booking?.time || booking?.slotTime || "-";

    if (status === "approved") {
      return `✅ ${type} booking approved at ${slot}`;
    }

    if (status === "rejected") {
      return `❌ ${type} booking rejected for ${slot}`;
    }

    if (status === "completed") {
      return `✅ ${type} session completed at ${slot}`;
    }

    return `⏳ ${type} booking pending approval at ${slot}`;
  };

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "M";

  const anim = (delay, style = {}) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    ...style,
  });

  const displayWorkout = isPaid && workout.length ? workout : SAMPLE_EXERCISES;
  const displayDiet = isPaid && diet.length ? diet : SAMPLE_MEALS;
  const displaySteamSlots =
    isPaid && steamSlots.length ? steamSlots : SAMPLE_STEAM_SLOTS;

  if (mLoading || loading) {
    return (
      <div style={{ padding: 20 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton mb-12"
            style={{
              height: 60,
              borderRadius: "var(--r-md)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="topbar">
        <div>
          <div className="greeting-block">
            <div className="greeting-label">MEMBER DASHBOARD</div>

            <div className="dashboard-greeting">
              {greeting}, {profile?.name?.split(" ")[0] || "Champion"} 👋
            </div>

            <div className="dashboard-tagline">{dailyTagline}</div>
          </div>

          <div className="dashboard-date">{format(new Date(), "EEE, d MMM")}</div>
        </div>
      </div>

      <div className="page-body">
        <MembershipBanner membership={membership} />
        <ExpiryBanner membership={membership} />

        <div className="hero-banner mb-20" style={anim(0)}>
          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="hero-badge">⚡ PREMIUM FITNESS EXPERIENCE</div>
            <div className="hero-title">F2 FIT-FACTORY</div>
            <div className="hero-owner">by Nimesh Mishra</div>

            <div className="hero-subtitle">
              Train harder. Recover smarter. Become unstoppable.
            </div>

            <div className="hero-actions">
              <button
                className="btn btn-primary tap-scale"
                onClick={() => navigate("/member/workout")}
              >
                Start Workout
              </button>

              <button
                className="btn btn-outline tap-scale"
                onClick={() => navigate("/member/progress")}
              >
                Track Progress
              </button>
            </div>
          </div>
        </div>

        <div className="profile-header mb-16" style={anim(0.05)}>
          <div className="avatar">{initials}</div>

          <div style={{ flex: 1 }}>
            <div className="profile-name">{profile?.name || "Member"}</div>
            <div className="profile-meta">
              📱 {profile?.email || member?.phone || "Member"}
            </div>

            <div className="profile-tags" style={{ marginTop: 8 }}>
              {isPaid ? (
                <>
                  <span className="badge badge-gold">{membership.plan}</span>
                  <span className="badge badge-green">Active</span>

                  {membership.daysLeft > 0 && (
                    <span className="badge badge-blue">
                      {membership.daysLeft}d left
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="badge badge-gray">🆓 Free Account</span>
                  <span
                    className="badge badge-gold"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/member/upgrade")}
                  >
                    Upgrade →
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="stats-grid mb-20" style={anim(0.1)}>
          <div className="stat-card s-gold">
            <div className="stat-label">Plan</div>
            <div
              className="stat-value c-gold"
              style={{ fontSize: isPaid ? 18 : 14 }}
            >
              {isPaid ? membership.plan : "Free"}
            </div>
            <div className="stat-sub">
              {isPaid ? "Active member" : "Upgrade to unlock"}
            </div>
          </div>

          <div className="stat-card s-green">
            <div className="stat-label">Days Left</div>
            <div className="stat-value c-green">
              {isPaid ? membership.daysLeft : "—"}
            </div>
            <div className="stat-sub">
              {isPaid ? `Till ${membership.expiryDate}` : "No active plan"}
            </div>
          </div>

          <div
            className="stat-card s-gold"
            style={{ position: "relative", overflow: "hidden" }}
          >
            {!isPaid && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(8,8,8,0.7)",
                  backdropFilter: "blur(3px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onClick={() => navigate("/member/upgrade")}
              >
                <span style={{ fontSize: 18 }}>🔒</span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    color: "var(--gold)",
                    letterSpacing: 1,
                  }}
                >
                  MEMBERS ONLY
                </span>
              </div>
            )}

            <div className="stat-label">Weight</div>
            <div className="stat-value c-gold" style={{ fontSize: 22 }}>
              {isPaid && bcaLatest ? bcaLatest.weight : SAMPLE_BCA.weight}
            </div>
            <div className="stat-sub">
              {isPaid
                ? bcaLatest
                  ? `kg · ${bcaLatest.date}`
                  : "No BCA yet"
                : "kg (sample)"}
            </div>
          </div>

          <div
            className="stat-card s-red"
            style={{ position: "relative", overflow: "hidden" }}
          >
            {!isPaid && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(8,8,8,0.7)",
                  backdropFilter: "blur(3px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onClick={() => navigate("/member/upgrade")}
              >
                <span style={{ fontSize: 18 }}>🔒</span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 9,
                    color: "var(--gold)",
                    letterSpacing: 1,
                  }}
                >
                  MEMBERS ONLY
                </span>
              </div>
            )}

            <div className="stat-label">Body Fat</div>
            <div className="stat-value c-red" style={{ fontSize: 22 }}>
              {isPaid && bcaLatest ? `${bcaLatest.fat}%` : SAMPLE_BCA.fat}
            </div>
            <div className="stat-sub">
              {isPaid ? (bcaLatest ? "Last reading" : "No BCA yet") : "(sample)"}
            </div>
          </div>
        </div>

        <div style={anim(0.15)}>
          <div className="section-header mb-12">
            <div className="section-title">🏋️ Today's Workout</div>

            {!isPaid && (
              <span
                className="badge badge-gold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/member/upgrade")}
              >
                🔒 Unlock
              </span>
            )}
          </div>

          <SectionLock
            feature="workout"
            membership={membership}
            label="WORKOUT PLANS — MEMBERS ONLY"
          >
            <div style={{ padding: "4px 0" }}>
              {displayWorkout.map((ex, i) => (
                <div
                  key={i}
                  className="exercise-row"
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    className="ex-num"
                    style={{
                      background: "var(--grad-gold)",
                      color: "var(--black)",
                    }}
                  >
                    {i + 1}
                  </div>

                  <div className="ex-info">
                    <div className="ex-name">
                      {typeof ex === "string" ? ex : ex.name || "Exercise"}
                    </div>

                    <div className="ex-detail">
                      {typeof ex === "string" ? (
                        <>3 sets × 12 reps · Rest 60s</>
                      ) : (
                        <>
                          {ex.sets || 3} sets × {ex.reps || 12} reps · Rest{" "}
                          {ex.rest || 60}s
                        </>
                      )}
                    </div>
                  </div>

                  <span className="ex-muscle">
                    {typeof ex === "string" ? "Chest" : ex.muscle || "Workout"}
                  </span>
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

        <div style={{ ...anim(0.22), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">🥗 Today's Diet</div>

            {!isPaid && (
              <span
                className="badge badge-gold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/member/upgrade")}
              >
                🔒 Unlock
              </span>
            )}
          </div>

          <SectionLock
            feature="diet"
            membership={membership}
            label="DIET PLANS — MEMBERS ONLY"
          >
            <div>
              {displayDiet.map((m, i) => (
                <div
                  key={i}
                  className="meal-card"
                  style={{ pointerEvents: "none" }}
                >
                  <div style={{ flex: 1 }}>
                    <div className="meal-name">
                      {m.time || m.mealTime || m.title || `Meal ${i + 1}`}
                    </div>

                    <div className="meal-desc">
                      {m.desc || m.description || m.food || "Diet details"}
                    </div>
                  </div>

                  <div className="meal-kcal">
                    {m.kcal || m.calories || "—"}
                    <span style={{ fontSize: 11, color: "var(--muted2)" }}>
                      {" "}
                      kcal
                    </span>
                  </div>
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

        <div style={{ ...anim(0.28), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">📊 Body Analysis (BCA)</div>

            {!isPaid && (
              <span
                className="badge badge-gold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/member/upgrade")}
              >
                🔒 Unlock
              </span>
            )}
          </div>

          <SectionLock
            feature="bca"
            membership={membership}
            label="BCA TRACKING — MEMBERS ONLY"
          >
            <div className="card" style={{ pointerEvents: "none" }}>
              {Object.entries(
                isPaid && bcaLatest
                  ? {
                      weight: `${bcaLatest.weight || "—"} kg`,
                      fat: `${bcaLatest.fat || "—"}%`,
                      muscle: `${bcaLatest.muscle || "—"} kg`,
                      bmi: bcaLatest.bmi || "—",
                    }
                  : SAMPLE_BCA
              ).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--muted2)",
                      textTransform: "capitalize",
                    }}
                  >
                    {k}
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--gold)",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </SectionLock>

          {isPaid && (
            <button
              className="btn btn-outline tap-scale"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/member/bca")}
            >
              View BCA Progress →
            </button>
          )}
        </div>

        <div style={{ ...anim(0.34), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">🌫️ Steam Bath</div>

            {!isPaid && (
              <span
                className="badge badge-gold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/member/upgrade")}
              >
                🔒 Unlock
              </span>
            )}
          </div>

          <SectionLock
            feature="steam"
            membership={membership}
            label="STEAM BOOKING — MEMBERS ONLY"
          >
            <div className="slot-grid" style={{ pointerEvents: "none" }}>
              {displaySteamSlots.slice(0, 4).map((slot, i) => {
                const slotTime = slot.time || slot.slot || slot.label;

                const booked = steamBookings.some(
                  (b) =>
                    b.slot === slotTime ||
                    b.time === slotTime ||
                    b.slotTime === slotTime
                );

                return (
                  <div
                    key={slot.id || i}
                    className={`slot ${booked ? "booked" : ""} ${
                      !booked && i === 0 ? "selected" : ""
                    }`}
                  >
                    <div className="slot-time">{slotTime}</div>

                    <div className="slot-label">
                      {booked ? "Booked" : "Available"}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionLock>

          {isPaid && steamBookings.length > 0 && (
            <div className={getBookingBoxClass(steamBookings[0].status)}>
              {getBookingMessage("Steam Bath", steamBookings[0])}
            </div>
          )}

          {isPaid && (
            <button
              className="btn btn-outline tap-scale"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/member/steam")}
            >
              Book Steam Bath →
            </button>
          )}
        </div>

        <div style={{ ...anim(0.37), marginTop: 24 }}>
          <div className="section-header mb-12">
            <div className="section-title">💺 Massage Chair</div>

            {!isPaid && (
              <span
                className="badge badge-gold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/member/upgrade")}
              >
                🔒 Unlock
              </span>
            )}
          </div>

          <SectionLock
            feature="massage"
            membership={membership}
            label="MASSAGE CHAIR BOOKING — MEMBERS ONLY"
          >
            {massageBookings.length > 0 ? (
              <div className={getBookingBoxClass(massageBookings[0].status)}>
                {getBookingMessage("Massage Chair", massageBookings[0])}
              </div>
            ) : (
              <div className="info-box warning mt-10">
                No massage chair booking for today.
              </div>
            )}
          </SectionLock>

          {isPaid && (
            <button
              className="btn btn-outline tap-scale"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/member/massage")}
            >
              Book Massage Chair →
            </button>
          )}
        </div>

        {!isPaid && (
          <div
            style={{
              ...anim(0.4),
              marginTop: 28,
              background:
                "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(201,162,39,0.06))",
              border: "1px solid rgba(245,200,66,0.3)",
              borderRadius: "var(--r-lg)",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>⭐</div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 900,
                color: "var(--gold)",
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              UNLOCK EVERYTHING
            </div>

            <div
              style={{
                fontSize: 13,
                color: "var(--text2)",
                lineHeight: 1.7,
                marginBottom: 18,
              }}
            >
              You can see what's waiting for you above — workout plans, Indian
              diet, BCA body tracking, steam bath booking, massage chair booking
              and more. All locked until you get a membership.
            </div>

            <button
              className="btn btn-primary tap-scale btn-ripple"
              style={{ width: "100%", padding: "13px", fontSize: 14 }}
              onClick={() => navigate("/member/upgrade")}
            >
              View Membership Plans →
            </button>

            <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 10 }}>
              Starting at just{" "}
              <strong style={{ color: "var(--gold)" }}>₹1,500/month</strong> ·
              Visit F2 Fit Factory, Mandla
            </div>
          </div>
        )}

        {isPaid && (
          <div style={{ ...anim(0.4), marginTop: 24 }}>
            <div
              className="card tap-scale"
              style={{
                cursor: "pointer",
                border: "1px solid rgba(245,200,66,0.15)",
              }}
              onClick={() => navigate("/member/equipment")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>🔧</span>

                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      color: "var(--gold)",
                      letterSpacing: 1,
                    }}
                  >
                    EQUIPMENT GUIDE
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted2)",
                      marginTop: 2,
                    }}
                  >
                    Learn how to use every machine at F2 Fit Factory
                  </div>
                </div>

                <span style={{ marginLeft: "auto", color: "var(--muted2)" }}>
                  →
                </span>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            ...anim(0.45),
            marginTop: 24,
            background:
              "linear-gradient(135deg, rgba(245,200,66,0.06), transparent)",
            border: "1px solid rgba(245,200,66,0.12)",
            borderRadius: "var(--r-md)",
            padding: "16px 18px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 3,
              color: "var(--gold)",
              lineHeight: 1.3,
              marginBottom: 5,
            }}
          >
            PUSH YOUR LIMITS EVERY DAY
          </div>

          <div style={{ fontSize: 11, color: "var(--muted2)" }}>
            F2 Fit-Factory BY Nimesh Mishra 🏆
          </div>
        </div>
      </div>
    </div>
  );
}
