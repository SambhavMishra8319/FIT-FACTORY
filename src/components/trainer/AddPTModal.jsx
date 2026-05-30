// import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
export default function AddPTModal({
  open,
  onClose,
  members,
  trainer,
  onSubmit,
}) {
    const [memberId, setMemberId] = useState("");
    const [amount, setAmount] = useState("");
    useEffect(() => {
  if (open) {
    setMemberId("");
    setAmount("");
  }
}, [open]);
useEffect(() => {
  if (open) {
    setMemberId("");
    setAmount("");
  }
}, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    const amt = Number(amount);

    if (!memberId) return toast.error("Select member");
    if (!amt || amt <= 0) return toast.error("Invalid amount");

    const member = members.find((m) => m.id === memberId);

    if (!member) return toast.error("Member not found");

    const trainerShare =
      (amt * Number(trainer.ptShare || 50)) / 100;

    const gymShare =
      (amt * Number(trainer.gymShare || 50)) / 100;

    onSubmit({
      member,
      amount: amt,
      trainerShare,
      gymShare,
    });

    setMemberId("");
    setAmount("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add PT Entry</h2>

        {/* MEMBER SELECT */}
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

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="PT Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
}