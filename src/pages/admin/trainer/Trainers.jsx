// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { getAllTrainers } from "../../../firebase/trainerService";

// import TrainerCard from "../../../components/trainer/TrainerCard";
// import TrainerPaymentsPreview from "./TrainerPaymentsPreview";

// import "../../../styles/trainers.css";

// export default function Trainers() {
//   const navigate = useNavigate();

//   const [trainers, setTrainers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadTrainers();
//   }, []);

//   const loadTrainers = async () => {
//     try {
//       setLoading(true);

//       const data = await getAllTrainers();

//       setTrainers(data || []);
//     } catch (err) {
//       console.error(err);
//       setTrainers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-container">

//       {/* ACTION CARDS */}
//       <div className="trainer-action-grid">

//         <div
//           className="trainer-action-card analytics"
//           onClick={() => navigate("/trainer-analytics")}
//         >
//           <div className="action-icon">📈</div>

//           <h3>Trainer Analytics</h3>

//           <p>
//             Revenue, PT sessions,
//             active clients and performance.
//           </p>
//         </div>

//         <div
//           className="trainer-action-card add"
//           onClick={() => navigate("/add-trainer")}
//         >
//           <div className="action-icon">➕</div>

//           <h3>Add Trainer</h3>

//           <p>
//             Register a trainer and
//             configure salary structure.
//           </p>
//         </div>

//       </div>

//       {/* TRAINERS */}
//       {loading ? (
//         <div className="empty-state">
//           <h3>Loading Trainers...</h3>
//         </div>
//       ) : trainers.length === 0 ? (
//         <div className="empty-state">
//           <h3>No Trainers Found</h3>

//           <p>Add your first trainer to begin</p>
//         </div>
//       ) : (
//         <>
//           <div className="trainer-grid">
//             {trainers.map((trainer) => (
//               <TrainerCard
//                 key={trainer.id}
//                 trainer={trainer}
//               />
//             ))}
//           </div>

//           {/* RECENT PAYMENTS */}
//           <TrainerPaymentsPreview />
//         </>
//       )}

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllTrainers } from "../../../firebase/trainerService";

import TrainerCard from "../../../components/trainer/TrainerCard";
import TrainerPaymentsPreview from "./TrainerPaymentsPreview";

import "../../../styles/trainers.css";

export default function Trainers() {
  const navigate = useNavigate();

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
    } catch (err) {
      console.error(err);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* ACTION CARDS */}
      <div className="trainer-action-grid">

        <div
          className="trainer-action-card analytics"
          onClick={() => navigate("/trainer-analytics")}
        >
          <div className="action-icon">📈</div>

          <h3>Trainer Analytics</h3>

          <p>
            Revenue, PT sessions,
            active clients and performance.
          </p>
        </div>

        <div
          className="trainer-action-card add"
          onClick={() => navigate("/add-trainer")}
        >
          <div className="action-icon">➕</div>

          <h3>Add Trainer</h3>

          <p>
            Register a trainer and
            configure salary structure.
          </p>
        </div>

      </div>

      {/* TRAINERS */}
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
        <>
          <div className="trainer-grid">
            {trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
              />
            ))}
          </div>

          {/* RECENT PAYMENTS */}
          <TrainerPaymentsPreview />
        </>
      )}

    </div>
  );
}