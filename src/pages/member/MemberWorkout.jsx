// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import { useAuth } from "../../context/AuthContext";
// import { useMembership } from "../../hooks/useMembership";

// import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

// import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
// import SectionHeader from "../../components/member/ui/SectionHeader";
// import ProgressBar from "../../components/member/ui/ProgressBar";
// import ExerciseRow from "../../components/member/workout/ExerciseRow";

// import {
//   saveWorkoutLog,
//   getTodayWorkoutLog,
// } from "../../firebase/service";

// import {
//   collection,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";

// import { db } from "../../firebase/config";

// const WORKOUT_PLANS = {
//   "Weight Loss": [
//     {
//       name: "Treadmill Run",
//       sets: "1",
//       reps: "30 min",
//       muscle: "Cardio",
//     },
//     {
//       name: "Jump Rope",
//       sets: "3",
//       reps: "5 min",
//       muscle: "Full Body",
//     },
//   ],

//   "Muscle Gain": [
//     {
//       name: "Flat Bench Press",
//       sets: "4",
//       reps: "10 reps",
//       muscle: "Chest",
//     },
//     {
//       name: "Incline DB Press",
//       sets: "3",
//       reps: "12 reps",
//       muscle: "Upper Chest",
//     },
//   ],

//   "General Fitness": [
//     {
//       name: "Push-ups",
//       sets: "3",
//       reps: "12 reps",
//       muscle: "Chest",
//     },
//     {
//       name: "Bodyweight Squats",
//       sets: "3",
//       reps: "15 reps",
//       muscle: "Legs",
//     },
//   ],
// };

// export default function MemberWorkout() {
//   const { membership, loading } =
//     useMembership();

//   const { profile } = useAuth();

//   const [goal, setGoal] = useState(
//     "General Fitness"
//   );

//   const [done, setDone] = useState([]);

//   const [saving, setSaving] =
//     useState(false);

//   const [visible, setVisible] =
//     useState(false);

//   useEffect(() => {
//     if (!profile?.email) return;

//     const load = async () => {
//       try {
//         const snap = await getDocs(
//           query(
//             collection(db, "members"),
//             where(
//               "email",
//               "==",
//               profile.email.toLowerCase()
//             )
//           )
//         );

//         if (!snap.empty) {
//           const g =
//             snap.docs[0].data().goal;

//           if (WORKOUT_PLANS[g]) {
//             setGoal(g);
//           }
//         }

//         if (membership?.memberId) {
//           const log =
//             await getTodayWorkoutLog(
//               membership.memberId
//             );

//           if (log?.completedIndexes) {
//             setDone(
//               log.completedIndexes
//             );
//           }
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setTimeout(
//           () => setVisible(true),
//           100
//         );
//       }
//     };

//     load();
//   }, [profile, membership]);

//   const exercises =
//     WORKOUT_PLANS[goal] || [];

//   const toggleExercise = index => {
//     setDone(prev =>
//       prev.includes(index)
//         ? prev.filter(x => x !== index)
//         : [...prev, index]
//     );
//   };

//   const percent = Math.round(
//     (done.length / exercises.length) *
//       100
//   );
// const resetWorkout = async () => {
//   setDone([]);

//   if (!membership?.memberId) return;

//   try {
//     await saveWorkoutLog({
//       memberId: membership.memberId,
//       memberName: profile?.name,
//       plan: goal,
//       exercisesDone: 0,
//       total: exercises.length,
//       completedIndexes: [],
//     });

//     toast.success("Workout reset ✔");
//   } catch (err) {
//     toast.error("Reset failed");
//   }
// };
//   const saveProgress = async () => {
//     if (!membership?.memberId) {
//       toast.error(
//         "Member account not linked."
//       );
//       return;
//     }

//     setSaving(true);

//     try {
//       await saveWorkoutLog({
//         memberId:
//           membership.memberId,

//         memberName: profile?.name,

//         plan: goal,

//         exercisesDone: done.length,

//         total: exercises.length,

//         completedIndexes: done,
//       });

//       toast.success(
//         "Workout progress saved 💪"
//       );
//     } catch (err) {
//       toast.error(
//         "Could not save progress."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSkeleton />;
//   }

//   return (
//     <LockGate
//       feature="workout"
//       membership={membership}
//     >
//       <div className="page-enter">
//         <div className="topbar">
//           <div className="page-title">
//             My Workout
//           </div>

//           <div className="topbar-right">
//             <button
//   className="btn btn-outline btn-sm"
//   onClick={resetWorkout}
// >
//   Reset
// </button>

//             <button
//               className="btn btn-primary btn-sm"
//               onClick={saveProgress}
//               disabled={saving}
//             >
//               {saving
//                 ? "Saving..."
//                 : "💾 Save"}
//             </button>
//           </div>
//         </div>

//         <div className="page-body">
//           <ExpiryBanner
//             membership={membership}
//           />

//           <div className="mb-16">
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent:
//                   "space-between",
//                 marginBottom: 8,
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color:
//                       "var(--muted2)",
//                   }}
//                 >
//                   GOAL
//                 </div>

//                 <div
//                   style={{
//                     fontSize: 18,
//                     color:
//                       "var(--gold)",
//                   }}
//                 >
//                   {goal}
//                 </div>
//               </div>

//               <div
//                 style={{
//                   textAlign: "right",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color:
//                       "var(--muted2)",
//                   }}
//                 >
//                   TODAY
//                 </div>

//                 <div
//                   style={{
//                     fontSize: 24,
//                   }}
//                 >
//                   {percent}%
//                 </div>
//               </div>
//             </div>

//             <ProgressBar
//               value={percent}
//               success={percent === 100}
//             />
//           </div>

//           <SectionHeader
//             title="Today's Exercises"
//             right={`${done.length}/${exercises.length}`}
//           />

//           {exercises.map(
//             (exercise, index) => (
//               <ExerciseRow
//                 key={index}
//                 exercise={exercise}
//                 index={index}
//                 checked={done.includes(
//                   index
//                 )}
//                 visible={visible}
//                 onClick={() =>
//                   toggleExercise(index)
//                 }
//               />
//             )
//           )}

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

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../hooks/useMembership";
import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import SectionHeader from "../../components/member/ui/SectionHeader";
import ProgressBar from "../../components/member/ui/ProgressBar";
import ExerciseRow from "../../components/member/workout/ExerciseRow";

import { saveWorkoutLog, getTodayWorkoutLog } from "../../firebase/service";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/memberworkout.css"
// const DAY_WORKOUTS = {
//   Monday: {
//     title: "Chest + Triceps",
//     exercises: [
//       { name: "Flat Bench Press", sets: "4", reps: "10 reps", muscle: "Chest" },
//       { name: "Incline Dumbbell Press", sets: "3", reps: "12 reps", muscle: "Upper Chest" },
//       { name: "Chest Fly", sets: "3", reps: "12 reps", muscle: "Chest" },
//       { name: "Cable Pushdown", sets: "3", reps: "12 reps", muscle: "Triceps" },
//       { name: "Overhead Triceps Extension", sets: "3", reps: "12 reps", muscle: "Triceps" },
//       { name: "Push-ups", sets: "3", reps: "Max", muscle: "Chest" },
//     ],
//   },

//   Tuesday: {
//     title: "Back + Biceps",
//     exercises: [
//       { name: "Lat Pulldown", sets: "4", reps: "10 reps", muscle: "Back" },
//       { name: "Seated Row", sets: "3", reps: "12 reps", muscle: "Back" },
//       { name: "One Arm Dumbbell Row", sets: "3", reps: "12 reps", muscle: "Lats" },
//       { name: "Barbell Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//       { name: "Hammer Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//       { name: "Dead Hang", sets: "3", reps: "30 sec", muscle: "Grip/Back" },
//     ],
//   },

//   Wednesday: {
//     title: "Shoulder + Legs",
//     exercises: [
//       { name: "Shoulder Press", sets: "4", reps: "10 reps", muscle: "Shoulders" },
//       { name: "Lateral Raise", sets: "3", reps: "15 reps", muscle: "Side Delt" },
//       { name: "Front Raise", sets: "3", reps: "12 reps", muscle: "Front Delt" },
//       { name: "Squats", sets: "4", reps: "12 reps", muscle: "Legs" },
//       { name: "Leg Press", sets: "3", reps: "12 reps", muscle: "Quads" },
//       { name: "Calf Raise", sets: "4", reps: "15 reps", muscle: "Calves" },
//     ],
//   },

//   Thursday: {
//     title: "Chest + Triceps",
//     exercises: [
//       { name: "Incline Bench Press", sets: "4", reps: "10 reps", muscle: "Upper Chest" },
//       { name: "Dumbbell Press", sets: "3", reps: "12 reps", muscle: "Chest" },
//       { name: "Pec Deck Fly", sets: "3", reps: "12 reps", muscle: "Chest" },
//       { name: "Close Grip Bench Press", sets: "3", reps: "10 reps", muscle: "Triceps" },
//       { name: "Rope Pushdown", sets: "3", reps: "12 reps", muscle: "Triceps" },
//       { name: "Bench Dips", sets: "3", reps: "Max", muscle: "Triceps" },
//     ],
//   },

//   Friday: {
//     title: "Back + Biceps",
//     exercises: [
//       { name: "Pull-ups / Assisted Pull-ups", sets: "3", reps: "Max", muscle: "Back" },
//       { name: "T-Bar Row", sets: "4", reps: "10 reps", muscle: "Back" },
//       { name: "Cable Row", sets: "3", reps: "12 reps", muscle: "Back" },
//       { name: "Preacher Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//       { name: "Concentration Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
//       { name: "Reverse Curl", sets: "3", reps: "12 reps", muscle: "Forearms" },
//     ],
//   },

//   Saturday: {
//     title: "Legs + Shoulder + Core",
//     exercises: [
//       { name: "Leg Extension", sets: "3", reps: "15 reps", muscle: "Quads" },
//       { name: "Leg Curl", sets: "3", reps: "15 reps", muscle: "Hamstrings" },
//       { name: "Walking Lunges", sets: "3", reps: "20 steps", muscle: "Legs" },
//       { name: "Arnold Press", sets: "3", reps: "12 reps", muscle: "Shoulders" },
//       { name: "Shrugs", sets: "4", reps: "15 reps", muscle: "Traps" },
//       { name: "Plank", sets: "3", reps: "45 sec", muscle: "Core" },
//     ],
//   },

//   Sunday: {
//     title: "Rest / Light Cardio",
//     exercises: [
//       { name: "Treadmill Walk", sets: "1", reps: "20 min", muscle: "Cardio" },
//       { name: "Cycling", sets: "1", reps: "15 min", muscle: "Cardio" },
//       { name: "Stretching", sets: "1", reps: "10 min", muscle: "Mobility" },
//       { name: "Foam Rolling", sets: "1", reps: "10 min", muscle: "Recovery" },
//     ],
//   },
// };
const WORKOUT_CATEGORIES = {
  Chest: [
    { name: "Flat Bench Press", sets: "4", reps: "10 reps", muscle: "Chest" },
    { name: "Incline Dumbbell Press", sets: "3", reps: "12 reps", muscle: "Upper Chest" },
    { name: "Chest Fly", sets: "3", reps: "12 reps", muscle: "Chest" },
    { name: "Push-ups", sets: "3", reps: "Max", muscle: "Chest" },
  ],

  Back: [
    { name: "Lat Pulldown", sets: "4", reps: "10 reps", muscle: "Back" },
    { name: "Seated Row", sets: "3", reps: "12 reps", muscle: "Back" },
    { name: "One Arm Dumbbell Row", sets: "3", reps: "12 reps", muscle: "Lats" },
    { name: "Dead Hang", sets: "3", reps: "30 sec", muscle: "Grip/Back" },
  ],

  Shoulder: [
    { name: "Shoulder Press", sets: "4", reps: "10 reps", muscle: "Shoulders" },
    { name: "Lateral Raise", sets: "3", reps: "15 reps", muscle: "Side Delt" },
    { name: "Front Raise", sets: "3", reps: "12 reps", muscle: "Front Delt" },
    { name: "Shrugs", sets: "4", reps: "15 reps", muscle: "Traps" },
  ],

  Legs: [
    { name: "Squats", sets: "4", reps: "12 reps", muscle: "Legs" },
    { name: "Leg Press", sets: "3", reps: "12 reps", muscle: "Quads" },
    { name: "Leg Extension", sets: "3", reps: "15 reps", muscle: "Quads" },
    { name: "Calf Raise", sets: "4", reps: "15 reps", muscle: "Calves" },
  ],

  Biceps: [
    { name: "Barbell Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
    { name: "Hammer Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
    { name: "Preacher Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
    { name: "Concentration Curl", sets: "3", reps: "12 reps", muscle: "Biceps" },
  ],

  Triceps: [
    { name: "Cable Pushdown", sets: "3", reps: "12 reps", muscle: "Triceps" },
    { name: "Overhead Triceps Extension", sets: "3", reps: "12 reps", muscle: "Triceps" },
    { name: "Close Grip Bench Press", sets: "3", reps: "10 reps", muscle: "Triceps" },
    { name: "Bench Dips", sets: "3", reps: "Max", muscle: "Triceps" },
  ],

  Abs: [
    { name: "Crunches", sets: "3", reps: "20 reps", muscle: "Abs" },
    { name: "Leg Raises", sets: "3", reps: "15 reps", muscle: "Lower Abs" },
    { name: "Plank", sets: "3", reps: "45 sec", muscle: "Core" },
    { name: "Russian Twists", sets: "3", reps: "20 reps", muscle: "Obliques" },
  ],

  Forearms: [
    { name: "Wrist Curl", sets: "3", reps: "15 reps", muscle: "Forearms" },
    { name: "Reverse Wrist Curl", sets: "3", reps: "15 reps", muscle: "Forearms" },
    { name: "Farmer Walk", sets: "3", reps: "30 sec", muscle: "Grip" },
    { name: "Reverse Curl", sets: "3", reps: "12 reps", muscle: "Forearms" },
  ],
};
const getTodayName = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
};

export default function MemberWorkout() {
  const { membership, loading } = useMembership();
  const { profile } = useAuth();
const [selectedWorkout, setSelectedWorkout] = useState("Chest");
  const [goal, setGoal] = useState("General Fitness");
  const [done, setDone] = useState([]);
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const todayName = getTodayName();
 const exercises = WORKOUT_CATEGORIES[selectedWorkout] || [];
  useEffect(() => {
    if (!profile?.email) return;

    const load = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "members"),
            where("email", "==", profile.email.toLowerCase())
          )
        );

        if (!snap.empty) {
          const memberGoal = snap.docs[0].data().goal;
          if (memberGoal) setGoal(memberGoal);
        }

        if (membership?.memberId) {
          const log = await getTodayWorkoutLog(membership.memberId);

          if (log?.completedIndexes) {
            setDone(log.completedIndexes);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setVisible(true), 100);
      }
    };

    load();
  }, [profile, membership]);

  const toggleExercise = index => {
    setDone(prev =>
      prev.includes(index)
        ? prev.filter(x => x !== index)
        : [...prev, index]
    );
  };

  const percent =
    exercises.length > 0
      ? Math.round((done.length / exercises.length) * 100)
      : 0;

  const resetWorkout = async () => {
    setDone([]);

    if (!membership?.memberId) return;

    try {
      await saveWorkoutLog({
        memberId: membership.memberId,
        memberName: profile?.name,
        plan: selectedWorkout,
        goal,
        day: todayName,
        exercisesDone: 0,
        total: exercises.length,
        completedIndexes: [],
      });

      toast.success("Workout reset ✔");
    } catch (err) {
      toast.error("Reset failed");
    }
  };

  const saveProgress = async () => {
    if (!membership?.memberId) {
      toast.error("Member account not linked.");
      return;
    }

    setSaving(true);

    try {
      await saveWorkoutLog({
        memberId: membership.memberId,
        memberName: profile?.name,
       plan: selectedWorkout,
        goal,
        day: todayName,
        exercisesDone: done.length,
        total: exercises.length,
        completedIndexes: done,
      });

      toast.success("Workout progress saved 💪");
    } catch (err) {
      toast.error("Could not save progress.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate feature="workout" membership={membership}>
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">My Workout</div>

          <div className="topbar-right">
            <button
              className="btn btn-outline btn-sm"
              onClick={resetWorkout}
            >
              Reset
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={saveProgress}
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save"}
            </button>
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner membership={membership} />

          <div className="mb-16">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted2)",
                  }}
                >
                  {todayName.toUpperCase()}
                </div>

                <div
                  style={{
                    fontSize: 18,
                    color: "var(--gold)",
                  }}
                >
                 {selectedWorkout}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "var(--muted2)",
                    marginTop: 3,
                  }}
                >
                  Goal: {goal}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted2)",
                  }}
                >
                  TODAY
                </div>

                <div style={{ fontSize: 24 }}>{percent}%</div>
              </div>
            </div>

            <ProgressBar value={percent} success={percent === 100} />
          </div>
<div className="workout-tabs mb-16">
  {Object.keys(WORKOUT_CATEGORIES).map(type => (
    <button
      key={type}
      className={
        selectedWorkout === type
          ? "workout-tab active"
          : "workout-tab"
      }
      onClick={() => {
        setSelectedWorkout(type);
        setDone([]);
      }}
    >
      {type}
    </button>
  ))}
</div>
          <SectionHeader
            title="Today's Exercises"
            right={`${done.length}/${exercises.length}`}
          />

          {exercises.map((exercise, index) => (
            <ExerciseRow
              key={`${todayName}-${index}`}
              exercise={exercise}
              index={index}
              checked={done.includes(index)}
              visible={visible}
              onClick={() => toggleExercise(index)}
            />
          ))}

          {percent === 100 && (
            <div className="info-box success mt-12">
              🎉 Workout complete!
            </div>
          )}
        </div>
      </div>
    </LockGate>
  );
}