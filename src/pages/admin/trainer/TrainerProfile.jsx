import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
import {
  getTrainerById,
  getTrainerPTs,
  getTrainerPayments,
  addPTEntry,
  addTrainerPayment,
} from "../../../firebase/trainerService";
import AddPTModal from "../../../components/trainer/AddPTModal";
import PaySalaryModal from "../../../components/trainer/PaySalaryModal";
// import { getAl2Members } from "../../../firebase/memberService";
import { getAllMembers, isMemberExists } from "../../../firebase/memberService";
import PTTable from "../../../components/trainer/PTTable";
import SalaryCard from "../../../components/trainer/SalaryCard";

export default function TrainerProfile() {
  const { id } = useParams();

  const [trainer, setTrainer] = useState(null);
  const [ptHistory, setPtHistory] = useState([]);
  const [payments, setPayments] = useState([]);
const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
const [showPTModal, setShowPTModal] = useState(false);
const [showSalaryModal, setShowSalaryModal] = useState(false);
  /* ======================================================
     LOAD DATA
  ====================================================== */

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);

    const trainerData = await getTrainerById(id);

    const pts = await getTrainerPTs(id);

    const paymentHistory = await getTrainerPayments(id);

    setTrainer(trainerData);
    setPtHistory(pts);
    setPayments(paymentHistory);

    setLoading(false);
  };
  useEffect(() => {
  const loadMembers = async () => {
    const data = await getAllMembers();
    setMembers(data);
  };

  loadMembers();
}, []);

  /* ======================================================
     CALCULATIONS
  ====================================================== */

  const totalPTRevenue = useMemo(() => {
  return ptHistory.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
}, [ptHistory]);

  const trainerEarnings = useMemo(() => {
  return ptHistory.reduce(
    (sum, item) => sum + Number(item.trainerShare || 0),
    0
  );
}, [ptHistory]);

  const gymRevenue = useMemo(() => {
  return ptHistory.reduce(
    (sum, item) => sum + Number(item.gymShare || 0),
    0
  );
}, [ptHistory]);

  const totalPaid = useMemo(() => {
    return payments.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [payments]);

 const totalSalary = useMemo(() => {
  return Number(trainer?.salary || 0) + trainerEarnings;
}, [trainer, trainerEarnings]);
const salaryPaid = useMemo(() => {
  return payments
    .filter((item) => item.type === "salary")
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
}, [payments]);
 const pendingAmount = useMemo(() => {
  return totalSalary - salaryPaid;
}, [totalSalary, salaryPaid]);

  /* ======================================================
     ADD PT
  ====================================================== */
  const handlePTSubmit = async (data) => {
  const res = await addPTEntry({
    trainerId: trainer.id,
    trainerName: trainer.name,
    memberName: data.member?.name || "Unknown Member",
    amount: data.amount,
    trainerShare: data.trainerShare,
    gymShare: data.gymShare,
  });

  if (res.success) {
    toast.success("PT Added");
    loadData();
  }
};
const handleSalarySubmit = async (amount) => {
  const res = await addTrainerPayment({
    trainerId: trainer.id,
    trainerName: trainer.name,
    amount,
    type: "salary",
  });

  if (res.success) {
    toast.success("Salary Paid");
    loadData();
  }
};
// const handleAddPT = async () => {
//   const memberName = prompt("Member Name");
//   const rawAmount = prompt("PT Amount");

//   const amount = Number(rawAmount);

//   if (!memberName || !amount) return;

//   // ✅ CHECK MEMBER EXISTS
//   // const exists = isMemberExists(members, memberName);
//   const exists = members.some(
//   (m) =>
//     (m?.name || "")
//       .trim()
//       .toLowerCase() === memberName.trim().toLowerCase()
// );

//   if (!exists) {
//     toast.error("Member not found");
//     return;
//   }

//   const trainerShare =
//     (amount * Number(trainer.ptShare || 50)) / 100;

//   const gymShare =
//     (amount * Number(trainer.gymShare || 50)) / 100;

//   await addPTEntry({
//     trainerId: trainer.id,
//     trainerName: trainer.name,
//     memberName,
//     amount,
//     trainerShare,
//     gymShare,
//   });

//   toast.success("PT Added");
//   loadData();
// };
//  const handleAddPT = async () => {
//   const memberName = prompt("Member Name");
//   const rawAmount = prompt("PT Amount");

//   const amount = Number(rawAmount);

//   if (!trainer) {
//     toast.error("Trainer not found");
//     return;
//   }

//   if (!memberName?.trim()) {
//     toast.error("Member name required");
//     return;
//   }

//   if (!amount || amount <= 0 || isNaN(amount)) {
//     toast.error("Invalid PT amount");
//     return;
//   }

//   const trainerShare =
//     (amount * Number(trainer.ptShare || 50)) / 100;

//   const gymShare =
//     (amount * Number(trainer.gymShare || 50)) / 100;

//   const res = await addPTEntry({
//     trainerId: trainer.id,
//     trainerName: trainer.name,

//     memberName: memberName.trim(),

//     amount,
//     trainerShare,
//     gymShare,
//   });

//   if (res.success) {
//     toast.success("PT Added");
//     loadData();
//   } else {
//     toast.error(res.error);
//   }
// };
  /* ======================================================
     PAY SALARY
  ====================================================== */

//   const handlePaySalary = async () => {
//   const rawAmount = prompt("Payment Amount");

//   const amount = Number(rawAmount);

//   if (!trainer) {
//     toast.error("Trainer not found");
//     return;
//   }

//   if (!amount || amount <= 0 || isNaN(amount)) {
//     toast.error("Invalid amount");
//     return;
//   }

//   const res = await addTrainerPayment({
//     trainerId: trainer.id,
//     trainerName: trainer.name,
//     amount,
//     type: "salary",
//   });

//   if (res.success) {
//     toast.success("Payment Added");
//     loadData();
//   } else {
//     toast.error(res.error);
//   }
// };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!trainer) {
    return <h2>Trainer Not Found</h2>;
  }

  
  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="trainer-profile-header">
        <div>
          <h1>{trainer.name}</h1>

          <p>{trainer.specialization}</p>

          <p>Status: {trainer.status}</p>
        </div>

        <div className="trainer-actions">
          <button onClick={() => setShowPTModal(true)}>
  + Add PT
</button>

<button onClick={() => setShowSalaryModal(true)}>
  Pay Salary
</button>
        </div>
      </div>

      {/* SALARY CARDS */}

      <div className="salary-grid">
        <SalaryCard
          title="Monthly Salary"
          amount={trainer.salary}
        />

        <SalaryCard
          title="PT Revenue"
          amount={totalPTRevenue}
        />

        <SalaryCard
          title="Trainer Earnings"
          amount={trainerEarnings}
        />

        <SalaryCard
          title="Gym Revenue"
          amount={gymRevenue}
        />

        <SalaryCard
          title="Total Salary"
          amount={totalSalary}
        />

        <SalaryCard
          title="Paid"
          amount={totalPaid}
        />

        <SalaryCard
          title="Pending"
          amount={pendingAmount}
        />
      </div>

      {/* PT TABLE */}

      <PTTable data={ptHistory} />

      {/* PAYMENTS */}

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
            {payments?.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.createdAt?.seconds
                    ? new Date(
                        item.createdAt.seconds * 1000
                      ).toLocaleDateString()
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