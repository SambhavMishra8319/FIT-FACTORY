import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import "../../../styles/TrainerPayments.css"
export default function TrainerPaymentsPreview() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const q = query(
        collection(db, "trainerPayments"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snap = await getDocs(q);

      setPayments(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error("Trainer payments error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="section-header">
        <div className="section-title">
          Trainer Payments
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/trainer-payments")}
        >
          View All
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <div className="info-box warning">
          No trainer payment history found.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <strong>
                      {payment.trainerName || "Unknown"}
                    </strong>
                  </td>

                  <td className="payment-amount">
                    ₹{Number(payment.amount || 0).toLocaleString()}
                  </td>

                  <td>
                    <span className="badge badge-gold">
                      {payment.type || "Salary"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}