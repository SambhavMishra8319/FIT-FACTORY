import React from "react";

export function Skeleton({
  h = 14,
  w = "100%",
  mb = 8,
  radius = "var(--r-sm)",
}) {
  return (
    <div
      className="skeleton"
      style={{
        height: h,
        width: w,
        marginBottom: mb,
        borderRadius: radius,
      }}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <div style={{ padding: 20 }}>
      {[80, 60, 80, 60].map((w, i) => (
        <Skeleton
          key={i}
          h={16}
          w={`${w}%`}
          mb={12}
        />
      ))}
    </div>
  );
}