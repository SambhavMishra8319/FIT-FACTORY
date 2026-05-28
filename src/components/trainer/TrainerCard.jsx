// import { useNavigate } from "react-router-dom";

// export default function TrainerCard({ trainer }) {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="trainer-card"
//       onClick={() => navigate(`/admin/trainers/${trainer.id}`)}
//     >
//       <h3>{trainer.name}</h3>

//       <p>{trainer.specialization}</p>

//       <p>Salary: ₹{trainer.salary}</p>

//       <p>
//         PT Share: {trainer.ptShare}% / Gym: {trainer.gymShare}%
//       </p>

//       <span className={trainer.status}>
//         {trainer.status}
//       </span>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function TrainerCard({ trainer }) {
  const navigate = useNavigate();

  return (
    <div
      className="trainer-card"
      onClick={() =>
        navigate(`/trainers/${trainer.id}`)
      }
    >
      {/* TOP */}

      <div className="trainer-top">
        <div className="trainer-avatar">
          {trainer.name?.charAt(0)}
        </div>

        <div>
          <div className="trainer-name">
            {trainer.name}
          </div>

          <div className="trainer-specialization">
            {trainer.specialization ||
              "Fitness Trainer"}
          </div>

          <div
            className={`trainer-status ${trainer.status}`}
          >
            ● {trainer.status}
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="trainer-stats">
        <div className="stat-box">
          <div className="stat-label">
            Monthly Salary
          </div>

          <div className="stat-value">
            ₹{trainer.salary || 0}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">
            PT Share
          </div>

          <div className="stat-value">
            {trainer.ptShare || 50}%
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="trainer-footer">
        <button className="view-profile-btn">
          View Profile
        </button>
      </div>
    </div>
  );
}