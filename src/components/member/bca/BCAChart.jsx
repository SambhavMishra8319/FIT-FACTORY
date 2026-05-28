// // components/member/BCAChart.jsx

// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// export default function BCAChart({
//   data = [],
// }) {
//   return (
//     <div className="card mb-20">
//       <div className="card-title">
//         BCA Progress
//       </div>

//       {data.length === 0 ? (
//         <div className="form-label">
//           No BCA data found.
//         </div>
//       ) : (
//         <ResponsiveContainer
//           width="100%"
//           height={260}
//         >
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis dataKey="date" />

//             <YAxis />

//             <Tooltip />

//             <Line
//               type="monotone"
//               dataKey="weight"
//               stroke="#f5c842"
//               strokeWidth={3}
//             />

//             <Line
//               type="monotone"
//               dataKey="bodyFat"
//               stroke="#22c55e"
//               strokeWidth={3}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }
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