
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import { useAuth } from "../../context/AuthContext";
// import { useMembership } from "../../hooks/useMembership";
// import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

// import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
// import SectionHeader from "../../components/member/ui/SectionHeader";
// import ProgressBar from "../../components/member/ui/ProgressBar";
// import ExerciseRow from "../../components/member/workout/ExerciseRow";

// import { saveWorkoutLog, getTodayWorkoutLog } from "../../firebase/service";

// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import "../../styles/memberworkout.css"
// // const DAY_WORKOUTS = {
// //   Monday: {
// //     title: "Chest + Triceps",
// //     exercises: [
// //       { name: "Flat Bench Press", sets: "4", reps: "10 reps", muscle: "Chest" },
// //       { name: "Incline Dumbbell Press", sets: "3", reps: "12 reps", muscle: "Upper Chest" },
// //       { name: "Chest Fly", sets: "3", reps: "12 reps", muscle: "Chest" },
// //       { name: "Cable Pushdown", sets: "3", reps: "12 reps", muscle: "Triceps" },
// //       { name: "Overhead Triceps Extension", sets: "3", reps: "12 reps", muscle: "Triceps" },
// //       { name: "Push-ups", sets: "3", reps: "Max", muscle: "Chest" },
// //     ],
// //   },

// //   Tuesday: {
// //     title: "Back + Biceps",
// //     exercises: [
// //       { name: "Lat Pulldown", sets: "4", reps: "10 reps", muscle: "Back" },
// //       { name: "Seated Row", sets: "3", reps: "12 reps", muscle: "Back" },
// //       { name: "One Arm Dumbbell Row", sets: "3", reps: "12 reps", muscle: "Lats" },
// //       { name: "Barbell Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
// //       { name: "Hammer Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
// //       { name: "Dead Hang", sets: "3", reps: "30 sec", muscle: "Grip/Back" },
// //     ],
// //   },

// //   Wednesday: {
// //     title: "Shoulder + Legs",
// //     exercises: [
// //       { name: "Shoulder Press", sets: "4", reps: "10 reps", muscle: "Shoulders" },
// //       { name: "Lateral Raise", sets: "3", reps: "15 reps", muscle: "Side Delt" },
// //       { name: "Front Raise", sets: "3", reps: "12 reps", muscle: "Front Delt" },
// //       { name: "Squats", sets: "4", reps: "12 reps", muscle: "Legs" },
// //       { name: "Leg Press", sets: "3", reps: "12 reps", muscle: "Quads" },
// //       { name: "Calf Raise", sets: "4", reps: "15 reps", muscle: "Calves" },
// //     ],
// //   },

// //   Thursday: {
// //     title: "Chest + Triceps",
// //     exercises: [
// //       { name: "Incline Bench Press", sets: "4", reps: "10 reps", muscle: "Upper Chest" },
// //       { name: "Dumbbell Press", sets: "3", reps: "12 reps", muscle: "Chest" },
// //       { name: "Pec Deck Fly", sets: "3", reps: "12 reps", muscle: "Chest" },
// //       { name: "Close Grip Bench Press", sets: "3", reps: "10 reps", muscle: "Triceps" },
// //       { name: "Rope Pushdown", sets: "3", reps: "12 reps", muscle: "Triceps" },
// //       { name: "Bench Dips", sets: "3", reps: "Max", muscle: "Triceps" },
// //     ],
// //   },

// //   Friday: {
// //     title: "Back + Biceps",
// //     exercises: [
// //       { name: "Pull-ups / Assisted Pull-ups", sets: "3", reps: "Max", muscle: "Back" },
// //       { name: "T-Bar Row", sets: "4", reps: "10 reps", muscle: "Back" },
// //       { name: "Cable Row", sets: "3", reps: "12 reps", muscle: "Back" },
// //       { name: "Preacher Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
// //       { name: "Concentration Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
// //       { name: "Reverse Curl", sets: "3", reps: "12 reps", muscle: "Forearms" },
// //     ],
// //   },

// //   Saturday: {
// //     title: "Legs + Shoulder + Core",
// //     exercises: [
// //       { name: "Leg Extension", sets: "3", reps: "15 reps", muscle: "Quads" },
// //       { name: "Leg Curl", sets: "3", reps: "15 reps", muscle: "Hamstrings" },
// //       { name: "Walking Lunges", sets: "3", reps: "20 steps", muscle: "Legs" },
// //       { name: "Arnold Press", sets: "3", reps: "12 reps", muscle: "Shoulders" },
// //       { name: "Shrugs", sets: "4", reps: "15 reps", muscle: "Traps" },
// //       { name: "Plank", sets: "3", reps: "45 sec", muscle: "Core" },
// //     ],
// //   },

// //   Sunday: {
// //     title: "Rest / Light Cardio",
// //     exercises: [
// //       { name: "Treadmill Walk", sets: "1", reps: "20 min", muscle: "Cardio" },
// //       { name: "Cycling", sets: "1", reps: "15 min", muscle: "Cardio" },
// //       { name: "Stretching", sets: "1", reps: "10 min", muscle: "Mobility" },
// //       { name: "Foam Rolling", sets: "1", reps: "10 min", muscle: "Recovery" },
// //     ],
// //   },
// // };
// const WORKOUT_CATEGORIES = {
//   Chest: [
//     { name: "Flat Bench Press", sets: "4", reps: "10 reps", muscle: "Chest" },
//     { name: "Incline Dumbbell Press", sets: "3", reps: "12 reps", muscle: "Upper Chest" },
//     { name: "Chest Fly", sets: "3", reps: "12 reps", muscle: "Chest" },
//     { name: "Push-ups", sets: "3", reps: "Max", muscle: "Chest" },
//   ],

//   Back: [
//     { name: "Lat Pulldown", sets: "4", reps: "10 reps", muscle: "Back" },
//     { name: "Seated Row", sets: "3", reps: "12 reps", muscle: "Back" },
//     { name: "One Arm Dumbbell Row", sets: "3", reps: "12 reps", muscle: "Lats" },
//     { name: "Dead Hang", sets: "3", reps: "30 sec", muscle: "Grip/Back" },
//   ],

//   Shoulder: [
//     { name: "Shoulder Press", sets: "4", reps: "10 reps", muscle: "Shoulders" },
//     { name: "Lateral Raise", sets: "3", reps: "15 reps", muscle: "Side Delt" },
//     { name: "Front Raise", sets: "3", reps: "12 reps", muscle: "Front Delt" },
//     { name: "Shrugs", sets: "4", reps: "15 reps", muscle: "Traps" },
//   ],

//   Legs: [
//     { name: "Squats", sets: "4", reps: "12 reps", muscle: "Legs" },
//     { name: "Leg Press", sets: "3", reps: "12 reps", muscle: "Quads" },
//     { name: "Leg Extension", sets: "3", reps: "15 reps", muscle: "Quads" },
//     { name: "Calf Raise", sets: "4", reps: "15 reps", muscle: "Calves" },
//   ],

//   Biceps: [
//     { name: "Barbell Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//     { name: "Hammer Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//     { name: "Preacher Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//     { name: "Concentration Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//   ],

//   Triceps: [
//     { name: "Cable Pushdown", sets: "3", reps: "12 reps", muscle: "Triceps" },
//     { name: "Overhead Triceps Extension", sets: "3", reps: "12 reps", muscle: "Triceps" },
//     { name: "Close Grip Bench Press", sets: "3", reps: "10 reps", muscle: "Triceps" },
//     { name: "Bench Dips", sets: "3", reps: "Max", muscle: "Triceps" },
//   ],

//   Abs: [
//     { name: "Crunches", sets: "3", reps: "20 reps", muscle: "Abs" },
//     { name: "Leg Raises", sets: "3", reps: "15 reps", muscle: "Lower Abs" },
//     { name: "Plank", sets: "3", reps: "45 sec", muscle: "Core" },
//     { name: "Russian Twists", sets: "3", reps: "20 reps", muscle: "Obliques" },
//   ],

//   Forearms: [
//     { name: "Wrist Curl", sets: "3", reps: "15 reps", muscle: "Forearms" },
//     { name: "Reverse Wrist Curl", sets: "3", reps: "15 reps", muscle: "Forearms" },
//     { name: "Farmer Walk", sets: "3", reps: "30 sec", muscle: "Grip" },
//     { name: "Reverse Curl", sets: "3", reps: "12 reps", muscle: "Forearms" },
//   ],
// };
// const getTodayName = () => {
//   return new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//   });
// };

// export default function MemberWorkout() {
//   const { membership, loading } = useMembership();
//   const { profile } = useAuth();
// const [selectedWorkout, setSelectedWorkout] = useState("Chest");
//   const [goal, setGoal] = useState("General Fitness");
//   const [done, setDone] = useState([]);
//   const [saving, setSaving] = useState(false);
//   const [visible, setVisible] = useState(false);

//   const todayName = getTodayName();
//  const exercises = WORKOUT_CATEGORIES[selectedWorkout] || [];
//   useEffect(() => {
//     if (!profile?.email) return;

//     const load = async () => {
//       try {
//         const snap = await getDocs(
//           query(
//             collection(db, "members"),
//             where("email", "==", profile.email.toLowerCase())
//           )
//         );

//         if (!snap.empty) {
//           const memberGoal = snap.docs[0].data().goal;
//           if (memberGoal) setGoal(memberGoal);
//         }

//         if (membership?.memberId) {
//           const log = await getTodayWorkoutLog(membership.memberId);

//           if (log?.completedIndexes) {
//             setDone(log.completedIndexes);
//           }
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setTimeout(() => setVisible(true), 100);
//       }
//     };

//     load();
//   }, [profile, membership]);

//   const toggleExercise = index => {
//     setDone(prev =>
//       prev.includes(index)
//         ? prev.filter(x => x !== index)
//         : [...prev, index]
//     );
//   };

//   const percent =
//     exercises.length > 0
//       ? Math.round((done.length / exercises.length) * 100)
//       : 0;

//   const resetWorkout = async () => {
//     setDone([]);

//     if (!membership?.memberId) return;

//     try {
//       await saveWorkoutLog({
//         memberId: membership.memberId,
//         memberName: profile?.name,
//         plan: selectedWorkout,
//         goal,
//         day: todayName,
//         exercisesDone: 0,
//         total: exercises.length,
//         completedIndexes: [],
//       });

//       toast.success("Workout reset ✔");
//     } catch (err) {
//       toast.error("Reset failed");
//     }
//   };

//   const saveProgress = async () => {
//     if (!membership?.memberId) {
//       toast.error("Member account not linked.");
//       return;
//     }

//     setSaving(true);

//     try {
//       await saveWorkoutLog({
//         memberId: membership.memberId,
//         memberName: profile?.name,
//        plan: selectedWorkout,
//         goal,
//         day: todayName,
//         exercisesDone: done.length,
//         total: exercises.length,
//         completedIndexes: done,
//       });

//       toast.success("Workout progress saved 💪");
//     } catch (err) {
//       toast.error("Could not save progress.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSkeleton />;
//   }

//   return (
//     <LockGate feature="workout" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar">
//           <div className="page-title">My Workout</div>

//           <div className="topbar-right">
//             <button
//               className="btn btn-outline btn-sm"
//               onClick={resetWorkout}
//             >
//               Reset
//             </button>

//             <button
//               className="btn btn-primary btn-sm"
//               onClick={saveProgress}
//               disabled={saving}
//             >
//               {saving ? "Saving..." : "💾 Save"}
//             </button>
//           </div>
//         </div>

//         <div className="page-body">
//           <ExpiryBanner membership={membership} />

//           <div className="mb-16">
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: 8,
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: "var(--muted2)",
//                   }}
//                 >
//                   {todayName.toUpperCase()}
//                 </div>

//                 <div
//                   style={{
//                     fontSize: 18,
//                     color: "var(--gold)",
//                   }}
//                 >
//                  {selectedWorkout}
//                 </div>

//                 <div
//                   style={{
//                     fontSize: 12,
//                     color: "var(--muted2)",
//                     marginTop: 3,
//                   }}
//                 >
//                   Goal: {goal}
//                 </div>
//               </div>

//               <div style={{ textAlign: "right" }}>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: "var(--muted2)",
//                   }}
//                 >
//                   TODAY
//                 </div>

//                 <div style={{ fontSize: 24 }}>{percent}%</div>
//               </div>
//             </div>

//             <ProgressBar value={percent} success={percent === 100} />
//           </div>
// <div className="workout-tabs mb-16">
//   {Object.keys(WORKOUT_CATEGORIES).map(type => (
//     <button
//       key={type}
//       className={
//         selectedWorkout === type
//           ? "workout-tab active"
//           : "workout-tab"
//       }
//       onClick={() => {
//         setSelectedWorkout(type);
//         setDone([]);
//       }}
//     >
//       {type}
//     </button>
//   ))}
// </div>
//           <SectionHeader
//             title="Today's Exercises"
//             right={`${done.length}/${exercises.length}`}
//           />

//           {exercises.map((exercise, index) => (
//             <ExerciseRow
//               key={`${todayName}-${index}`}
//               exercise={exercise}
//               index={index}
//               checked={done.includes(index)}
//               visible={visible}
//               onClick={() => toggleExercise(index)}
//             />
//           ))}

//           {percent === 100 && (
//             <div className="info-box success mt-12">
//               🎉 Workout complete!
//             </div>
//           )}
//         </div>
//       </div>
//     </LockGate>
//   );
// }
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../hooks/useMembership";
import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import SectionHeader from "../../components/member/ui/SectionHeader";
import ProgressBar from "../../components/member/ui/ProgressBar";
import StatCard from "../../components/member/ui/StatCard";

import { saveWorkoutLog, getTodayWorkoutLog } from "../../firebase/service";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/memberworkout.css";

const WORKOUT_CATEGORIES = {
  Chest: {
    icon: "💪",
    title: "Chest Day",
    caloriesPerExercise: 55,
    exercises: [
      {
        name: "Flat Bench Press",
        sets: "4",
        reps: "10 reps",
        muscle: "Chest",
        rest: 90,
        demo: "Keep shoulder blades tight and lower bar under control.",
      },
      {
        name: "Incline Dumbbell Press",
        sets: "3",
        reps: "12 reps",
        muscle: "Upper Chest",
        rest: 75,
        demo: "Set bench around 30–45° and press dumbbells upward.",
      },
      {
        name: "Chest Fly",
        sets: "3",
        reps: "12 reps",
        muscle: "Chest",
        rest: 60,
        demo: "Keep elbows slightly bent and squeeze chest at top.",
      },
      {
        name: "Push-ups",
        sets: "3",
        reps: "Max",
        muscle: "Chest",
        rest: 60,
        demo: "Keep body straight and chest close to floor.",
      },
    ],
  },

  Back: {
    icon: "🔙",
    title: "Back Day",
    caloriesPerExercise: 60,
    exercises: [
      {
        name: "Lat Pulldown",
        sets: "4",
        reps: "10 reps",
        muscle: "Back",
        rest: 75,
        demo: "Pull bar to upper chest and squeeze lats.",
      },
      {
        name: "Seated Row",
        sets: "3",
        reps: "12 reps",
        muscle: "Mid Back",
        rest: 75,
        demo: "Pull handle to abdomen while keeping chest up.",
      },
      {
        name: "One Arm Dumbbell Row",
        sets: "3",
        reps: "12 reps",
        muscle: "Lats",
        rest: 60,
        demo: "Drive elbow backward, not upward.",
      },
      {
        name: "Dead Hang",
        sets: "3",
        reps: "30 sec",
        muscle: "Grip/Back",
        rest: 60,
        demo: "Relax shoulders and hold with full grip.",
      },
    ],
  },

  Shoulder: {
    icon: "🏋️",
    title: "Shoulder Day",
    caloriesPerExercise: 50,
    exercises: [
      {
        name: "Shoulder Press",
        sets: "4",
        reps: "10 reps",
        muscle: "Shoulders",
        rest: 75,
        demo: "Press overhead without arching lower back.",
      },
      {
        name: "Lateral Raise",
        sets: "3",
        reps: "15 reps",
        muscle: "Side Delt",
        rest: 45,
        demo: "Raise elbows to shoulder height with control.",
      },
      {
        name: "Front Raise",
        sets: "3",
        reps: "12 reps",
        muscle: "Front Delt",
        rest: 45,
        demo: "Lift weight to eye level, avoid swinging.",
      },
      {
        name: "Shrugs",
        sets: "4",
        reps: "15 reps",
        muscle: "Traps",
        rest: 60,
        demo: "Lift shoulders straight up and squeeze traps.",
      },
    ],
  },

  Legs: {
    icon: "🦵",
    title: "Leg Day",
    caloriesPerExercise: 70,
    exercises: [
      {
        name: "Squats",
        sets: "4",
        reps: "12 reps",
        muscle: "Legs",
        rest: 90,
        demo: "Keep chest up, knees out, and go controlled.",
      },
      {
        name: "Leg Press",
        sets: "3",
        reps: "12 reps",
        muscle: "Quads",
        rest: 90,
        demo: "Do not lock knees at the top.",
      },
      {
        name: "Leg Extension",
        sets: "3",
        reps: "15 reps",
        muscle: "Quads",
        rest: 60,
        demo: "Pause at top and lower slowly.",
      },
      {
        name: "Calf Raise",
        sets: "4",
        reps: "15 reps",
        muscle: "Calves",
        rest: 45,
        demo: "Full stretch down, full squeeze up.",
      },
    ],
  },

  Biceps: {
    icon: "💥",
    title: "Biceps Day",
    caloriesPerExercise: 40,
    exercises: [
      {
        name: "Barbell Curl",
        sets: "3",
        reps: "12 reps",
        muscle: "Biceps",
        rest: 60,
        demo: "Keep elbows fixed and avoid swinging.",
      },
      {
        name: "Hammer Curl",
        sets: "3",
        reps: "12 reps",
        muscle: "Biceps/Forearm",
        rest: 60,
        demo: "Use neutral grip and controlled movement.",
      },
      {
        name: "Preacher Curl",
        sets: "3",
        reps: "12 reps",
        muscle: "Biceps",
        rest: 60,
        demo: "Keep arm on pad and squeeze at top.",
      },
      {
        name: "Concentration Curl",
        sets: "3",
        reps: "12 reps",
        muscle: "Biceps",
        rest: 45,
        demo: "Slow curl, strong mind-muscle connection.",
      },
    ],
  },

  Triceps: {
    icon: "🔥",
    title: "Triceps Day",
    caloriesPerExercise: 45,
    exercises: [
      {
        name: "Cable Pushdown",
        sets: "3",
        reps: "12 reps",
        muscle: "Triceps",
        rest: 60,
        demo: "Lock elbows near body and push down fully.",
      },
      {
        name: "Overhead Triceps Extension",
        sets: "3",
        reps: "12 reps",
        muscle: "Long Head",
        rest: 60,
        demo: "Stretch behind head and extend fully.",
      },
      {
        name: "Close Grip Bench Press",
        sets: "3",
        reps: "10 reps",
        muscle: "Triceps",
        rest: 75,
        demo: "Keep grip narrow and elbows controlled.",
      },
      {
        name: "Bench Dips",
        sets: "3",
        reps: "Max",
        muscle: "Triceps",
        rest: 60,
        demo: "Lower slowly and push through palms.",
      },
    ],
  },

  Abs: {
    icon: "⚡",
    title: "Core Day",
    caloriesPerExercise: 35,
    exercises: [
      {
        name: "Crunches",
        sets: "3",
        reps: "20 reps",
        muscle: "Abs",
        rest: 30,
        demo: "Curl upper body and squeeze abs.",
      },
      {
        name: "Leg Raises",
        sets: "3",
        reps: "15 reps",
        muscle: "Lower Abs",
        rest: 45,
        demo: "Keep legs controlled and avoid swinging.",
      },
      {
        name: "Plank",
        sets: "3",
        reps: "45 sec",
        muscle: "Core",
        rest: 45,
        demo: "Keep body straight and core tight.",
      },
      {
        name: "Russian Twists",
        sets: "3",
        reps: "20 reps",
        muscle: "Obliques",
        rest: 45,
        demo: "Rotate torso, not just hands.",
      },
    ],
  },

  Forearms: {
    icon: "✊",
    title: "Forearm Day",
    caloriesPerExercise: 35,
    exercises: [
      {
        name: "Wrist Curl",
        sets: "3",
        reps: "15 reps",
        muscle: "Forearms",
        rest: 45,
        demo: "Curl wrist fully and control down.",
      },
      {
        name: "Reverse Wrist Curl",
        sets: "3",
        reps: "15 reps",
        muscle: "Forearms",
        rest: 45,
        demo: "Lift back of hand upward slowly.",
      },
      {
        name: "Farmer Walk",
        sets: "3",
        reps: "30 sec",
        muscle: "Grip",
        rest: 60,
        demo: "Walk tall with heavy dumbbells.",
      },
      {
        name: "Reverse Curl",
        sets: "3",
        reps: "12 reps",
        muscle: "Forearms",
        rest: 60,
        demo: "Use overhand grip and keep elbows fixed.",
      },
    ],
  },
};

const getTodayName = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function MemberWorkout() {
  const { membership, loading } = useMembership();
  const { profile } = useAuth();

  const [selectedWorkout, setSelectedWorkout] = useState("Chest");
  const [goal, setGoal] = useState("General Fitness");
  const [doneMap, setDoneMap] = useState({});
  const [weightsMap, setWeightsMap] = useState({});
  const [notesMap, setNotesMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restExercise, setRestExercise] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [expandedDemo, setExpandedDemo] = useState(null);

  const autoSaveRef = useRef(null);

  const todayName = getTodayName();
  const todayDate = format(new Date(), "yyyy-MM-dd");

  const workout = WORKOUT_CATEGORIES[selectedWorkout];
  const exercises = workout?.exercises || [];
  const done = doneMap[selectedWorkout] || [];
  const percent =
    exercises.length > 0 ? Math.round((done.length / exercises.length) * 100) : 0;

  const estimatedCalories = useMemo(() => {
    return done.length * (workout?.caloriesPerExercise || 45);
  }, [done.length, workout]);

  const remaining = Math.max(exercises.length - done.length, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (restSeconds <= 0) return;

    const timer = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.success("Rest complete. Next set! 🔥");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [restSeconds]);

  useEffect(() => {
    if (!profile?.email && !membership?.memberId) return;

    const load = async () => {
      try {
        if (profile?.email) {
          const snap = await getDocs(
            query(
              collection(db, "members"),
              where("email", "==", profile.email.toLowerCase()),
            ),
          );

          if (!snap.empty) {
            const memberGoal = snap.docs[0].data().goal;
            if (memberGoal) setGoal(memberGoal);
          }
        }

        if (membership?.memberId) {
          const log = await getTodayWorkoutLog(membership.memberId);

          if (log?.completedByWorkout) {
            setDoneMap(log.completedByWorkout);
          } else if (log?.completedIndexes) {
            setDoneMap({
              [log.plan || "Chest"]: log.completedIndexes,
            });
          }

          if (log?.weightsByWorkout) {
            setWeightsMap(log.weightsByWorkout);
          }

          if (log?.notesByWorkout) {
            setNotesMap(log.notesByWorkout);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setVisible(true), 100);
      }
    };

    load();
  }, [profile, membership?.memberId]);

  useEffect(() => {
    if (percent === 100 && exercises.length > 0) {
      setShowSummary(true);
    }
  }, [percent, exercises.length]);

  const buildPayload = (nextDoneMap = doneMap) => {
    const totalDone = Object.values(nextDoneMap).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
      0,
    );

    const totalExercises = Object.values(WORKOUT_CATEGORIES).reduce(
      (sum, item) => sum + item.exercises.length,
      0,
    );

    return {
      memberId: membership.memberId,
      memberName: profile?.name,
      plan: selectedWorkout,
      goal,
      day: todayName,
      date: todayDate,
      durationSeconds: elapsed,
      duration: formatTimer(elapsed),
      calories: estimatedCalories,
      exercisesDone: done.length,
      total: exercises.length,
      completedIndexes: done,
      completedByWorkout: nextDoneMap,
      weightsByWorkout: weightsMap,
      notesByWorkout: notesMap,
      totalExercisesDone: totalDone,
      totalExercises,
    };
  };

  const saveProgress = async (nextDoneMap = doneMap, silent = false) => {
    if (!membership?.memberId) {
      if (!silent) toast.error("Member account not linked.");
      return;
    }

    setSaving(true);

    try {
      await saveWorkoutLog(buildPayload(nextDoneMap));

      if (!silent) toast.success("Workout progress saved 💪");
    } catch (err) {
      console.error(err);
      if (!silent) toast.error("Could not save progress.");
    } finally {
      setSaving(false);
    }
  };

  const scheduleAutoSave = (nextDoneMap) => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);

    autoSaveRef.current = setTimeout(() => {
      saveProgress(nextDoneMap, true);
    }, 500);
  };

  const toggleExercise = (index) => {
    const isDone = done.includes(index);

    const nextDone = isDone ? done.filter((x) => x !== index) : [...done, index];

    const nextDoneMap = {
      ...doneMap,
      [selectedWorkout]: nextDone,
    };

    setDoneMap(nextDoneMap);

    if (!isDone) {
      const rest = Number(exercises[index]?.rest || 60);
      setRestSeconds(rest);
      setRestExercise(exercises[index]?.name || "Exercise");
      toast.success(`${exercises[index]?.name} completed ✅`);
    }

    scheduleAutoSave(nextDoneMap);
  };

  const updateWeight = (index, value) => {
    setWeightsMap((prev) => ({
      ...prev,
      [selectedWorkout]: {
        ...(prev[selectedWorkout] || {}),
        [index]: value,
      },
    }));
  };

  const updateNote = (index, value) => {
    setNotesMap((prev) => ({
      ...prev,
      [selectedWorkout]: {
        ...(prev[selectedWorkout] || {}),
        [index]: value,
      },
    }));
  };

  const resetWorkout = async () => {
    const ok = window.confirm(`Reset today's ${selectedWorkout} workout?`);
    if (!ok) return;

    const nextDoneMap = {
      ...doneMap,
      [selectedWorkout]: [],
    };

    setDoneMap(nextDoneMap);
    setShowSummary(false);

    await saveProgress(nextDoneMap, true);

    toast.success("Workout reset ✔");
  };

  const finishWorkout = async () => {
    await saveProgress(doneMap, true);
    setShowSummary(true);
    toast.success("Workout saved successfully 🏆");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate feature="workout" membership={membership}>
      <div className="page-enter">
        <div className="topbar">
          <div>
            <div className="page-title">My Workout</div>
            <div className="page-subtitle">
              {todayName} · {formatTimer(elapsed)}
            </div>
          </div>

          <div className="topbar-right">
            <button className="btn btn-outline btn-sm" onClick={resetWorkout}>
              Reset
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => saveProgress(doneMap)}
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save"}
            </button>
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner membership={membership} />

          {restSeconds > 0 && (
            <div className="card mb-16" style={{ border: "1px solid rgba(245,200,66,0.3)" }}>
              <div className="card-title">Rest Timer</div>

              <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 5 }}>
                  After {restExercise}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 42,
                    color: "var(--gold)",
                    letterSpacing: 3,
                    marginBottom: 10,
                  }}
                >
                  {formatTimer(restSeconds)}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setRestSeconds(0)}
                >
                  Skip Rest
                </button>
              </div>
            </div>
          )}

          <div className="card mb-16">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted2)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {todayName}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    color: "var(--gold)",
                    letterSpacing: 1,
                    marginTop: 3,
                  }}
                >
                  {workout.icon} {workout.title}
                </div>

                <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 4 }}>
                  Goal: {goal}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted2)" }}>TODAY</div>
                <div style={{ fontSize: 30, fontWeight: 900 }}>{percent}%</div>
              </div>
            </div>

            <ProgressBar value={percent} success={percent === 100} />

            <div className="stats-grid mt-16">
              <StatCard
                label="Exercises"
                value={exercises.length}
                cls="s-gold"
                valueClass="c-gold"
              />

              <StatCard
                label="Completed"
                value={done.length}
                cls="s-green"
                valueClass="c-green"
              />

              <StatCard
                label="Remaining"
                value={remaining}
                cls="s-red"
                valueClass="c-red"
              />

              <StatCard
                label="Calories"
                value={estimatedCalories}
                unit=" kcal"
                cls="s-blue"
                valueClass="c-blue"
              />
            </div>
          </div>

          <div className="workout-tabs mb-16">
            {Object.entries(WORKOUT_CATEGORIES).map(([type, item]) => {
              const count = doneMap[type]?.length || 0;

              return (
                <button
                  key={type}
                  className={selectedWorkout === type ? "workout-tab active" : "workout-tab"}
                  onClick={() => setSelectedWorkout(type)}
                >
                  <span>{item.icon}</span>
                  <span>{type}</span>
                  {count > 0 && <small>{count}</small>}
                </button>
              );
            })}
          </div>

          <SectionHeader
            title="Today's Exercises"
            right={`${done.length}/${exercises.length}`}
          />

          <div style={{ display: "grid", gap: 12 }}>
            {exercises.map((exercise, index) => {
              const checked = done.includes(index);
              const weight = weightsMap[selectedWorkout]?.[index] || "";
              const note = notesMap[selectedWorkout]?.[index] || "";
              const demoOpen = expandedDemo === `${selectedWorkout}-${index}`;

              return (
                <div
                  key={`${selectedWorkout}-${index}`}
                  className="card tap-scale"
                  style={{
                    opacity: checked ? 0.62 : visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `all .35s cubic-bezier(0.22,1,0.36,1) ${index * 0.04}s`,
                    border: checked
                      ? "1px solid rgba(34,197,94,0.35)"
                      : "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div
                      className="ex-num"
                      style={{
                        background: checked ? "var(--green)" : "var(--grad-gold)",
                        color: "var(--black)",
                        flexShrink: 0,
                      }}
                    >
                      {checked ? "✓" : index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <div
                            className="ex-name"
                            style={{
                              textDecoration: checked ? "line-through" : "none",
                              fontSize: 15,
                            }}
                          >
                            {exercise.name}
                          </div>

                          <div className="ex-detail">
                            🎯 {exercise.muscle} · Rest {exercise.rest || 60}s
                          </div>
                        </div>

                        <span className="ex-muscle">{exercise.muscle}</span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        <div className="mini-stat">
                          <span>Sets</span>
                          <strong>{exercise.sets}</strong>
                        </div>

                        <div className="mini-stat">
                          <span>Reps</span>
                          <strong>{exercise.reps}</strong>
                        </div>

                        <div className="mini-stat">
                          <span>Last PR</span>
                          <strong>{weight ? `${weight}kg` : "—"}</strong>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        <input
                          className="form-input"
                          type="number"
                          placeholder="Weight kg"
                          value={weight}
                          onChange={(e) => updateWeight(index, e.target.value)}
                          onBlur={() => saveProgress(doneMap, true)}
                        />

                        <input
                          className="form-input"
                          placeholder="Note"
                          value={note}
                          onChange={(e) => updateNote(index, e.target.value)}
                          onBlur={() => saveProgress(doneMap, true)}
                        />
                      </div>

                      {demoOpen && (
                        <div className="info-box warning mt-12">
                          <strong>How to perform:</strong>
                          <br />
                          {exercise.demo}
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className={checked ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                          onClick={() => toggleExercise(index)}
                        >
                          {checked ? "Undo" : "✓ Complete"}
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            setExpandedDemo(
                              demoOpen ? null : `${selectedWorkout}-${index}`,
                            )
                          }
                        >
                          ▶ Demo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {percent === 100 && (
            <div className="info-box success mt-16">
              🎉 Workout complete! Review your summary below.
            </div>
          )}

          <div className="card mt-16">
            <div className="card-title">Workout Summary</div>

            <div className="stats-grid">
              <StatCard
                label="Duration"
                value={formatTimer(elapsed)}
                cls="s-gold"
                valueClass="c-gold"
              />

              <StatCard
                label="Done"
                value={`${done.length}/${exercises.length}`}
                cls="s-green"
                valueClass="c-green"
              />

              <StatCard
                label="Calories"
                value={estimatedCalories}
                unit=" kcal"
                cls="s-red"
                valueClass="c-red"
              />

              <StatCard
                label="XP"
                value={percent === 100 ? "+50" : "+0"}
                cls="s-blue"
                valueClass="c-blue"
              />
            </div>

            <button
              className="btn btn-primary tap-scale btn-ripple mt-16"
              style={{ width: "100%", justifyContent: "center", padding: 13 }}
              onClick={finishWorkout}
            >
              🏆 Finish & Save Workout
            </button>
          </div>

          {showSummary && (
            <div className="card mt-16" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🏆</div>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  color: "var(--gold)",
                  letterSpacing: 2,
                  marginBottom: 8,
                }}
              >
                WORKOUT FINISHED
              </div>

              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8 }}>
                {selectedWorkout} completed with {done.length} exercises in{" "}
                <strong>{formatTimer(elapsed)}</strong>.
                <br />
                Estimated burn: <strong>{estimatedCalories} kcal</strong>
              </div>

              <div className="info-box success mt-12">
                +50 leaderboard points after saved workout 💪
              </div>
            </div>
          )}
        </div>
      </div>
    </LockGate>
  );
}