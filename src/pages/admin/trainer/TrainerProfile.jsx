import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getTrainerById,
  getTrainerPTs,
  getTrainerPayments,
  addPTEntry,
  addTrainerPayment,
} from "../../../firebase/trainerService";

import { getAllMembers } from "../../../firebase/memberService";

import AddPTModal from "../../../components/trainer/AddPTModal";
import PaySalaryModal from "../../../components/trainer/PaySalaryModal";

import PTTable from "../../../components/trainer/PTTable";
import SalaryCard from "../../../components/trainer/SalaryCard";
import "../../../styles/TrainerProfile.css"
export default function TrainerProfile() {
  const { id } = useParams();

  const [trainer, setTrainer] = useState(null);

  const [members, setMembers] = useState([]);

  const [ptHistory, setPtHistory] = useState([]);

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showPTModal, setShowPTModal] = useState(false);

  const [showSalaryModal, setShowSalaryModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const trainerData = await getTrainerById(id);

      const pts = await getTrainerPTs(id);

      const paymentHistory = await getTrainerPayments(id);

      const membersData = await getAllMembers();

      setTrainer(trainerData);

      setPtHistory(pts || []);

      setPayments(paymentHistory || []);

      setMembers(membersData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPTRevenue = useMemo(() => {
    return ptHistory.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [ptHistory]);

  const trainerEarnings = useMemo(() => {
    return ptHistory.reduce(
      (sum, item) => sum + Number(item.trainerShare || 0),
      0,
    );
  }, [ptHistory]);

  const gymRevenue = useMemo(() => {
    return ptHistory.reduce((sum, item) => sum + Number(item.gymShare || 0), 0);
  }, [ptHistory]);

  const totalPaid = useMemo(() => {
    return payments
      .filter((item) => item.type === "salary")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [payments]);
  const totalSalary = useMemo(() => {
    return Number(trainer?.salary || 0) + trainerEarnings;
  }, [trainer, trainerEarnings]);

  const pendingAmount = useMemo(() => {
    return Math.max(totalSalary - totalPaid, 0);
  }, [totalSalary, totalPaid]);
  const handlePTSubmit = async (data) => {
    const res = await addPTEntry({
      trainerId: trainer.id,
      trainerName: trainer.name,

      memberId: data.member.id,
      memberName: data.member.name,

      amount: data.amount,

      trainerShare: data.trainerShare,

      gymShare: data.gymShare,
    });

    if (res.success) {
      toast.success("PT Entry Added");

      setShowPTModal(false);

      loadData();
    } else {
      toast.error(res.error);
    }
  };

  const handleSalarySubmit = async (amount) => {
    try {
      const res = await addTrainerPayment({
        trainerId: trainer.id,
        trainerName: trainer.name,
        amount,
        type: "salary",
      });

      if (res.success) {
        toast.success("Salary Paid");
        setShowSalaryModal(false);
        loadData();
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!trainer) {
    return <h2>Trainer Not Found</h2>;
  }

  return (
    <div className="page-container">
      <div className="trainer-profile-header">
        <div>
          <h1>{trainer.name}</h1>

          <p>{trainer.specialization}</p>

          <p>Status: {trainer.status}</p>

          <p>
            PT Share: {trainer.ptShare}% | Gym Share: {trainer.gymShare}%
          </p>
        </div>

        <div className="trainer-actions">
          <button onClick={() => setShowPTModal(true)}>+ Add PT</button>

          <button onClick={() => setShowSalaryModal(true)}>Pay Salary</button>
        </div>
      </div>

      <div className="salary-grid">
        <SalaryCard title="Monthly Salary" amount={trainer.salary} />

        <SalaryCard title="PT Revenue" amount={totalPTRevenue} />

        <SalaryCard title="Trainer Earnings" amount={trainerEarnings} />

        <SalaryCard title="Gym Revenue" amount={gymRevenue} />

        <SalaryCard title="Total Salary" amount={totalSalary} />

        <SalaryCard title="Paid" amount={totalPaid} />

        <SalaryCard title="Pending" amount={pendingAmount} />
      </div>

      <PTTable data={ptHistory} />

      <div className="payment-section">
        <h2>Payment History</h2>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.createdAt?.seconds
                    ? new Date(
                        item.createdAt.seconds * 1000,
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </td>

                <td>₹{Number(item.amount || 0).toLocaleString("en-IN")}</td>

                <td>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddPTModal
        open={showPTModal}
        onClose={() => setShowPTModal(false)}
        members={members}
        trainer={trainer}
        onSubmit={handlePTSubmit}
      />

      <PaySalaryModal
        open={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        onSubmit={handleSalarySubmit}
      />
    </div>
  );
}
