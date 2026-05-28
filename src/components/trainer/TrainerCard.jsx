import { useNavigate } from "react-router-dom";

export default function TrainerCard({ trainer }) {
  const navigate = useNavigate();

  return (
    <div
      className="trainer-card"
      onClick={() => navigate(`/admin/trainers/${trainer.id}`)}
    >
      <h3>{trainer.name}</h3>

      <p>{trainer.specialization}</p>

      <p>Salary: ₹{trainer.salary}</p>

      <p>
        PT Share: {trainer.ptShare}% / Gym: {trainer.gymShare}%
      </p>

      <span className={trainer.status}>
        {trainer.status}
      </span>
    </div>
  );
}