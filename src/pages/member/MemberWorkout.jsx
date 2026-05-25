import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../hooks/useMembership";

import { LockGate, ExpiryBanner } from "../../components/LockGate";

import LoadingSkeleton from "../../components/member/LoadingSkeleton";
import SectionHeader from "../../components/member/SectionHeader";
import ProgressBar from "../../components/member/ProgressBar";
import ExerciseRow from "../../components/member/ExerciseRow";

import {
  saveWorkoutLog,
  getTodayWorkoutLog,
} from "../../firebase/service";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/config";

const WORKOUT_PLANS = {
  "Weight Loss": [
    {
      name: "Treadmill Run",
      sets: "1",
      reps: "30 min",
      muscle: "Cardio",
    },
    {
      name: "Jump Rope",
      sets: "3",
      reps: "5 min",
      muscle: "Full Body",
    },
  ],

  "Muscle Gain": [
    {
      name: "Flat Bench Press",
      sets: "4",
      reps: "10 reps",
      muscle: "Chest",
    },
    {
      name: "Incline DB Press",
      sets: "3",
      reps: "12 reps",
      muscle: "Upper Chest",
    },
  ],

  "General Fitness": [
    {
      name: "Push-ups",
      sets: "3",
      reps: "12 reps",
      muscle: "Chest",
    },
    {
      name: "Bodyweight Squats",
      sets: "3",
      reps: "15 reps",
      muscle: "Legs",
    },
  ],
};

export default function MemberWorkout() {
  const { membership, loading } =
    useMembership();

  const { profile } = useAuth();

  const [goal, setGoal] = useState(
    "General Fitness"
  );

  const [done, setDone] = useState([]);

  const [saving, setSaving] =
    useState(false);

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    if (!profile?.email) return;

    const load = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "members"),
            where(
              "email",
              "==",
              profile.email.toLowerCase()
            )
          )
        );

        if (!snap.empty) {
          const g =
            snap.docs[0].data().goal;

          if (WORKOUT_PLANS[g]) {
            setGoal(g);
          }
        }

        if (membership?.memberId) {
          const log =
            await getTodayWorkoutLog(
              membership.memberId
            );

          if (log?.completedIndexes) {
            setDone(
              log.completedIndexes
            );
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(
          () => setVisible(true),
          100
        );
      }
    };

    load();
  }, [profile, membership]);

  const exercises =
    WORKOUT_PLANS[goal] || [];

  const toggleExercise = index => {
    setDone(prev =>
      prev.includes(index)
        ? prev.filter(x => x !== index)
        : [...prev, index]
    );
  };

  const percent = Math.round(
    (done.length / exercises.length) *
      100
  );

  const saveProgress = async () => {
    if (!membership?.memberId) {
      toast.error(
        "Member account not linked."
      );
      return;
    }

    setSaving(true);

    try {
      await saveWorkoutLog({
        memberId:
          membership.memberId,

        memberName: profile?.name,

        plan: goal,

        exercisesDone: done.length,

        total: exercises.length,

        completedIndexes: done,
      });

      toast.success(
        "Workout progress saved 💪"
      );
    } catch (err) {
      toast.error(
        "Could not save progress."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate
      feature="workout"
      membership={membership}
    >
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">
            My Workout
          </div>

          <div className="topbar-right">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setDone([])}
            >
              Reset
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={saveProgress}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "💾 Save"}
            </button>
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner
            membership={membership}
          />

          <div className="mb-16">
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color:
                      "var(--muted2)",
                  }}
                >
                  GOAL
                </div>

                <div
                  style={{
                    fontSize: 18,
                    color:
                      "var(--gold)",
                  }}
                >
                  {goal}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color:
                      "var(--muted2)",
                  }}
                >
                  TODAY
                </div>

                <div
                  style={{
                    fontSize: 24,
                  }}
                >
                  {percent}%
                </div>
              </div>
            </div>

            <ProgressBar
              value={percent}
              success={percent === 100}
            />
          </div>

          <SectionHeader
            title="Today's Exercises"
            right={`${done.length}/${exercises.length}`}
          />

          {exercises.map(
            (exercise, index) => (
              <ExerciseRow
                key={index}
                exercise={exercise}
                index={index}
                checked={done.includes(
                  index
                )}
                visible={visible}
                onClick={() =>
                  toggleExercise(index)
                }
              />
            )
          )}

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