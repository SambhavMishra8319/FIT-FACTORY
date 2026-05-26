// // components/member/QuickActions.jsx

// export default function QuickActions({
//   onRenew,
//   onAddBCA,
//   onAttendance,
//   onWorkout,
// }) {
//   return (
//     <div className="card mb-20">
//       <div className="card-title">
//         Quick Actions
//       </div>

//       <div
//         style={{
//           display: "flex",
//           gap: 10,
//           flexWrap: "wrap",
//         }}
//       >
//         <button
//           className="btn btn-primary"
//           onClick={onRenew}
//         >
//           Renew
//         </button>

//         <button
//           className="btn btn-outline"
//           onClick={onAddBCA}
//         >
//           Add BCA
//         </button>

//         <button
//           className="btn btn-outline"
//           onClick={onAttendance}
//         >
//           Mark Attendance
//         </button>

//         <button
//           className="btn btn-outline"
//           onClick={onWorkout}
//         >
//           Assign Workout
//         </button>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function QuickActions({
  memberId,
}) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-title">
        Quick Actions
      </div>

      <div className="quick-actions-grid">
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(
              `/members/${memberId}/renew`
            )
          }
        >
          Renew Membership
        </button>

        <button
          className="btn btn-outline"
          onClick={() =>
            navigate(
              `/members/${memberId}/bca`
            )
          }
        >
          Add BCA
        </button>

        <button
          className="btn btn-outline"
          onClick={() =>
            navigate(
              `/attendance`
            )
          }
        >
          Mark Attendance
        </button>

        <button
          className="btn btn-outline"
          onClick={() =>
            navigate(
              `/assign-workout/${memberId}`
            )
          }
        >
          Assign Workout
        </button>
      </div>
    </div>
  );
}