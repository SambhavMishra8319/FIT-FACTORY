import React from "react";

export default function EmptyState({
  icon = "📦",
  title = "No Data",
  desc = "",
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "var(--muted2)",
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          letterSpacing: 2,
          color: "var(--gold)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      {desc && (
        <div style={{ fontSize: 13 }}>
          {desc}
        </div>
      )}
    </div>
  );
}