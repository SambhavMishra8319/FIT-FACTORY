import React from "react";

export default function MealCard({
  meal,
  visible = true,
}) {
  return (
    <div
      className="meal-card tap-scale"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : "translateX(-12px)",
        transition:
          "all .4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{ flex: 1 }}>
        <div className="meal-name">
          {meal.time}
        </div>

        <div className="meal-desc">
          {meal.desc}
        </div>
      </div>

      <div className="meal-kcal">
        {meal.kcal}
        <span
          style={{
            fontSize: 11,
            color: "var(--muted2)",
          }}
        >
          {" "}
          kcal
        </span>
      </div>
    </div>
  );
}