import { useEffect, useState } from "react";

import { getAllTrainers } from "../../../firebase/trainerService";

import TrainerCard from "../../../components/trainer/TrainerCard";

import "../../../styles/trainers.css";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    const data = await getAllTrainers();
    setTrainers(data);
  };

  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="page-title-wrap">
        <div>
          <h1 className="page-title">
            Trainers
          </h1>

          <p className="page-subtitle">
            Manage trainers, PT revenue,
            salaries & performance
          </p>
        </div>
      </div>

      {/* EMPTY */}

      {trainers.length === 0 ? (
        <div className="empty-state">
          <h3>No Trainers Found</h3>

          <p>
            Add your first trainer to begin
          </p>
        </div>
      ) : (
        <div className="trainer-grid">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
            />
          ))}
        </div>
      )}
    </div>
  );
}