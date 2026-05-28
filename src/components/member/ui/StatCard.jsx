import React from "react";

export default function StatCard({
  label,
  value,
  sub,
  cls = "",
  valueClass = "",
  style = {},
  unit = "",
}) {
  return (
    <div className={`stat-card ${cls}`} style={style}>
      <div className="stat-label">{label}</div>

      <div className={`stat-value ${valueClass}`}>
        {value}
        {unit && (
          <span style={{ fontSize: 12 }}>
            {unit}
          </span>
        )}
      </div>

      {sub && (
        <div className="stat-sub">
          {sub}
        </div>
      )}
    </div>
  );
}