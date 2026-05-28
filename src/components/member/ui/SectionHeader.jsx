import React from "react";

export default function SectionHeader({
  title,
  right,
  mb = 12,
}) {
  return (
    <div
      className="section-header"
      style={{ marginBottom: mb }}
    >
      <div className="section-title">
        {title}
      </div>

      {right && (
        <span
          style={{
            fontSize: 12,
            color: "var(--muted2)",
          }}
        >
          {right}
        </span>
      )}
    </div>
  );
}