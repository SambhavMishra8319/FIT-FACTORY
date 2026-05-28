import { useEffect, useState } from "react";
import { getAllTrainers } from "../../../firebase/trainerService";

import TrainerCard from "../../../components/trainer/TrainerCard";

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
      <h2>All Trainers</h2>

      <div className="trainer-grid">
        {trainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </div>
  );
}