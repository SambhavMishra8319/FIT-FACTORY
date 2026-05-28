import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/config";

import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../hooks/useMembership";

import {
  LockGate,
  ExpiryBanner,
} from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import SectionHeader from "../../components/member/ui/SectionHeader";
import StatCard from "../../components/member/ui/StatCard";
import MealCard from "../../components/member/diet/MealCard";

const DIET_PLANS = {
  "Muscle Gain": {
    calories: 2800,
    protein: 160,
    carbs: 300,
    fat: 80,

    meals: [
      {
        time: "🍳 Breakfast",
        desc: "Eggs + oats + banana",
        kcal: 520,
      },

      {
        time: "🍱 Lunch",
        desc: "Rice + chicken + salad",
        kcal: 680,
      },
    ],
  },

  "Weight Loss": {
    calories: 1800,
    protein: 130,
    carbs: 180,
    fat: 50,

    meals: [
      {
        time: "🍳 Breakfast",
        desc: "Egg whites + tea",
        kcal: 280,
      },

      {
        time: "🍱 Lunch",
        desc: "Dal + salad",
        kcal: 380,
      },
    ],
  },
};

export default function MemberDiet() {
  const { membership, loading } =
    useMembership();

  const { profile } = useAuth();

  const [goal, setGoal] = useState(
    "Muscle Gain"
  );

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

          if (DIET_PLANS[g]) {
            setGoal(g);
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
  }, [profile]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const plan = DIET_PLANS[goal];

  return (
    <LockGate
      feature="diet"
      membership={membership}
    >
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">
            My Diet Plan
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner
            membership={membership}
          />

          <div className="stats-grid mb-16">
            <StatCard
              label="Calories"
              value={plan.calories}
              cls="s-red"
              valueClass="c-red"
            />

            <StatCard
              label="Protein"
              value={`${plan.protein}g`}
              cls="s-gold"
              valueClass="c-gold"
            />

            <StatCard
              label="Carbs"
              value={`${plan.carbs}g`}
              cls="s-green"
              valueClass="c-green"
            />

            <StatCard
              label="Fat"
              value={`${plan.fat}g`}
              cls="s-blue"
              valueClass="c-blue"
            />
          </div>

          <SectionHeader
            title={`Meal Schedule — ${goal}`}
          />

          {plan.meals.map(
            (meal, index) => (
              <MealCard
                key={index}
                meal={meal}
                visible={visible}
              />
            )
          )}

          <div className="info-box warning mt-12">
            💧 Drink 3–4 litres water
            daily
          </div>
        </div>
      </div>
    </LockGate>
  );
}