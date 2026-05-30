import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";

import { addPTEntry } from "../../../firebase/trainerService";

export default function AddPTEntry() {
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);

  const [trainerId, setTrainerId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");

  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // LOAD TRAINERS + MEMBERS
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const trainerSnap = await getDocs(collection(db, "trainers"));
    const memberSnap = await getDocs(collection(db, "members"));

    setTrainers(
      trainerSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    );

    setMembers(
      memberSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    );
  };

  // SELECT TRAINER
  const handleTrainerChange = (id) => {
    setTrainerId(id);

    const t = trainers.find((tr) => tr.id === id);
    setSelectedTrainer(t || null);
  };

  // SUBMIT PT
  const handleSubmit = async () => {
    if (!trainerId || !memberId || !amount) {
      toast.error("All fields are required");
      return;
    }

    const trainer = selectedTrainer;

    if (!trainer) {
      toast.error("Invalid trainer selected");
      return;
    }

    const member = members.find((m) => m.id === memberId);

    if (!member) {
      toast.error("Member not found");
      return;
    }

    const amt = Number(amount);

    if (amt <= 0 || isNaN(amt)) {
      toast.error("Invalid amount");
      return;
    }

    // CALCULATIONS
    const trainerShare =
      (amt * Number(trainer.ptShare || 50)) / 100;

    const gymShare =
      (amt * Number(trainer.gymShare || 50)) / 100;

    const res = await addPTEntry({
      trainerId: trainer.id,
      trainerName: trainer.name,

      memberId: member.id,
      memberName: member.name,

      amount: amt,
      trainerShare,
      gymShare,
    });

    if (res.success) {
      toast.success("PT Entry Added");

      setTrainerId("");
      setMemberId("");
      setAmount("");
      setSelectedTrainer(null);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add PT Entry</h1>
        <p>Record personal training session</p>
      </div>

      <div className="glass-card">

        {/* TRAINER SELECT */}
        <div className="form-group">
          <label>Select Trainer</label>

          <select
            value={trainerId}
            onChange={(e) =>
              handleTrainerChange(e.target.value)
            }
          >
            <option value="">Select Trainer</option>

            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* MEMBER SELECT */}
        <div className="form-group">
          <label>Select Member</label>

          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">Select Member</option>

            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div className="form-group">
          <label>PT Amount</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        {/* PREVIEW */}
        {selectedTrainer && amount && (
          <div className="preview-box">
            <p>
              Trainer Share:{" "}
              <b>
                ₹
                {(
                  (Number(amount) *
                    selectedTrainer.ptShare) /
                  100
                ).toFixed(2)}
              </b>
            </p>

            <p>
              Gym Share:{" "}
              <b>
                ₹
                {(
                  (Number(amount) *
                    selectedTrainer.gymShare) /
                  100
                ).toFixed(2)}
              </b>
            </p>
          </div>
        )}

        {/* BUTTON */}
        <button className="primary-btn" onClick={handleSubmit}>
          Save PT Entry
        </button>
      </div>
    </div>
  );
}