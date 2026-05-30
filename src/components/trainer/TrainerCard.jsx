import { useNavigate } from "react-router-dom";

export default function TrainerCard({ trainer }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!trainer?.id) return;
    navigate(`/trainers/${trainer.id}`);
  };

  return (
    <div className="trainer-card" onClick={handleCardClick}>
      {/* TOP */}
      <div className="trainer-top">
        <div className="trainer-avatar">
          {trainer?.name?.charAt(0) || "T"}
        </div>

        <div>
          <div className="trainer-name">
            {trainer?.name || "Unnamed Trainer"}
          </div>

          <div className="trainer-specialization">
            {trainer?.specialization || "Fitness Trainer"}
          </div>

          <div className={`trainer-status ${trainer?.status || "active"}`}>
            ● {trainer?.status || "active"}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="trainer-stats">
        <div className="stat-box">
          <div className="stat-label">Monthly Salary</div>

          <div className="stat-value">
            ₹{trainer?.salary || 0}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">PT Share</div>

          <div className="stat-value">
            {trainer?.ptShare ?? 50}%
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="trainer-footer">
        <button
          className="view-profile-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/trainers/${trainer.id}`);
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}