
// import { useNavigate } from "react-router-dom";

// export default function QuickActions({
//   memberId,
// }) {
//   const navigate = useNavigate();

//   return (
//     <div className="card">
//       <div className="card-title">
//         Quick Actions
//       </div>

//       <div className="quick-actions-grid">
//         <button
//           className="btn btn-primary"
//           onClick={() =>
//             navigate(
//               `/members/${memberId}/renew`
//             )
//           }
//         >
//           Renew Membership
//         </button>

//         <button
//           className="btn btn-outline"
//           onClick={() =>
//             navigate(
//               `/members/${memberId}/bca`
//             )
//           }
//         >
//           Add BCA
//         </button>

//         <button
//           className="btn btn-outline"
//           onClick={() =>
//             navigate(
//               `/attendance`
//             )
//           }
//         >
//           Mark Attendance
//         </button>

//         <button
//           className="btn btn-outline"
//           onClick={() =>
//             navigate(
//               `/assign-workout/${memberId}`
//             )
//           }
//         >
//           Assign Workout
//         </button>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-title">Quick Actions</div>

      <div className="quick-actions-grid">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/member/card")}
        >
          My Membership Card
        </button>

        <button
          className="btn btn-outline"
          onClick={() => navigate("/member/bca")}
        >
          View BCA
        </button>

        <button
          className="btn btn-outline"
          onClick={() => navigate("/member/workout")}
        >
          Start Workout
        </button>

        <button
          className="btn btn-outline"
          onClick={() => navigate("/member/steam")}
        >
          Book Steam
        </button>
      </div>
    </div>
  );
}