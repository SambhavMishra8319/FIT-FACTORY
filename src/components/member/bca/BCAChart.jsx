
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function BCAChart({
  data = [],
}) {
  return (
    <div className="card">
      <div className="card-title">
        BCA Progress
      </div>

      <ResponsiveContainer
        width="100%"
        height={250}
      >
        <LineChart data={data}>
          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#f5c842"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="bodyFat"
            stroke="#ff5858"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}