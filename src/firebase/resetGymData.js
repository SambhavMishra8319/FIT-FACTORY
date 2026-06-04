import {
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";

export async function resetPaymentsFromMembers() {
  // 1. Delete old payments first
  const paymentsSnap = await getDocs(collection(db, "payments"));

  for (const paymentDoc of paymentsSnap.docs) {
    await deleteDoc(doc(db, "payments", paymentDoc.id));
  }

  // 2. Create fresh payments from members
  const batch = writeBatch(db);
  const membersSnap = await getDocs(collection(db, "members"));

  membersSnap.forEach((memberDoc) => {
    const m = memberDoc.data();

    const amountPaid = Number(m.paid || m.amountPaid || m.amount || 0);
    if (amountPaid <= 0) return;

    const payDate =
      m.paymentDate ||
      m.joiningDate ||
      m.joinDate ||
      m.admissionDate ||
      m.startDate ||
      m.date ||
      new Date().toISOString().slice(0, 10);

    const paymentRef = doc(collection(db, "payments"));

    batch.set(paymentRef, {
      memberId: memberDoc.id,
      entityId: memberDoc.id,

      memberName: m.name || "",
      name: m.name || "",
      phone: m.phone || "",

      plan: m.plan || "",
      amount: amountPaid,
      totalAmount: Number(m.totalAmount || m.fee || m.planPrice || amountPaid),
      balance: Number(m.due || m.balance || 0),

      method: m.paymentMethod || m.method || "Cash",
      status: "paid",

      expiryDate: m.expiryDate || m.expiry || "",

      date: payDate,
      paymentDate: payDate,

      notes: "Auto-created from member data",
      type: "membership",

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();

  return {
    success: true,
    message: "Old payments deleted and fresh payments created from members.",
  };
}