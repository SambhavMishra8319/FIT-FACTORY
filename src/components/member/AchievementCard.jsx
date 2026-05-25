import React from "react";

export default function AchievementCard({
  achievement,
  style = {},
}) {
  return (
    <div
      className={`achievement-card ${
        achievement.earned
          ? "earned"
          : "locked"
      }`}
      style={style}
    >
      <div className="achievement-icon">
        {achievement.icon}
      </div>

      <div className="achievement-name">
        {achievement.name}
      </div>

      <div className="achievement-desc">
        {achievement.desc}
      </div>

      {achievement.earned ? (
        <div
          style={{
            fontSize: 10,
            color: "var(--gold)",
            marginTop: 4,
            fontFamily: "var(--font-display)",
            letterSpacing: 1,
          }}
        >
          EARNED ✓
        </div>
      ) : (
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            marginTop: 4,
          }}
        >
          🔒 Locked
        </div>
      )}
    </div>
  );
}