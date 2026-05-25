import React from "react";

export default function ProgressBar({
  value = 0,
  height = 6,
  success = false,
}) {
  return (
    <div
      className="bca-track"
      style={{
        height,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 999,
          width: `${value}%`,
          transition:
            "width .6s cubic-bezier(0.22,1,0.36,1)",
          background: success
            ? "var(--green)"
            : "var(--grad-gold)",
        }}
      />
    </div>
  );
}