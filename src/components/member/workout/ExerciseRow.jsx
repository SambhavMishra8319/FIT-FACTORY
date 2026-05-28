import React from "react";

export default function ExerciseRow({
  exercise,
  index,
  checked,
  onClick,
  visible = true,
}) {
  return (
    <div
      className="exercise-row tap-scale"
      onClick={onClick}
      style={{
        opacity: checked ? 0.38 : visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : "translateX(-16px)",
        transition:
          "all .35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        className="ex-num"
        style={{
          background: checked
            ? "var(--green)"
            : "var(--grad-gold)",
          color: "var(--black)",
        }}
      >
        {checked ? "✓" : index + 1}
      </div>

      <div className="ex-info">
        <div
          className="ex-name"
          style={{
            textDecoration: checked
              ? "line-through"
              : "none",
          }}
        >
          {exercise.name}
        </div>

        <div className="ex-detail">
          {exercise.sets} sets × {exercise.reps}
        </div>
      </div>

      <span className="ex-muscle">
        {exercise.muscle}
      </span>
    </div>
  );
}