import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PaySalaryModal({
  open,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");

  // ✅ RESET WHEN OPEN
  useEffect(() => {
    if (open) {
      setAmount("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    const amt = Number(amount);

    if (!amt || amt <= 0) {
      return toast.error("Invalid amount");
    }

    onSubmit(amt);
    setAmount("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Pay Salary</h2>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Pay</button>
        </div>
      </div>
    </div>
  );
}