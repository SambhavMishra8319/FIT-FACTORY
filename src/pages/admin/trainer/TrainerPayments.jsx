import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

import "../../../styles/trainer-pages.css";

export default function TrainerPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
     try {
      setLoading(true);
    const q = query(
      collection(db, "trainerPayments"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    setPayments(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
     data.sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      setPayments(data);
    } catch (error) {
      console.error(error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="page-header">
        <h1>Trainer Payments</h1>

        <p>
          Manage trainer salary payments and
          PT commissions
        </p>
      </div>

      {/* TABLE */}

      <div className="table-card">
        {payments.length === 0 ? (
          <div className="empty-state">
            <h3>No Payments Yet</h3>

            <p>
              Trainer payments will appear here
            </p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Trainer</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.trainerName}
                    </td>

                    <td>
                      ₹{item.amount}
                    </td>

                    <td>
                      <span
                        className={`payment-badge ${item.type}`}
                      >
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}