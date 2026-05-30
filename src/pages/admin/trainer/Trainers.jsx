import { useEffect, useState } from "react";

import { getAllTrainers } from "../../../firebase/trainerService";

import TrainerCard from "../../../components/trainer/TrainerCard";

import "../../../styles/trainers.css";


export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);

      const data = await getAllTrainers();

      setTrainers(data || []);
    } catch (error) {
      console.error(error);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-title-wrap">
        <div>
          <h1 className="page-title">Trainers</h1>

          <p className="page-subtitle">
            Manage trainers, PT revenue, salaries & performance
          </p>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="empty-state">
          <h3>Loading Trainers...</h3>
        </div>
      ) : trainers.length === 0 ? (
        <div className="empty-state">
          <h3>No Trainers Found</h3>
          <p>Add your first trainer to begin</p>
        </div>
      ) : (
        <div className="trainer-grid">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      )}
    </div>
  );
}