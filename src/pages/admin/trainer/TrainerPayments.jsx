import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

export default function TrainerPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
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
  };

  return (
    <div className="page-container">
      <h1>Trainer Payments</h1>

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
              <td>{item.trainerName}</td>

              <td>₹{item.amount}</td>

              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}