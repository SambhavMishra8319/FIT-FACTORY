import {
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export async function resetPaymentsFromMembers() {
  const batch = writeBatch(db);

  // 1. Delete old payments
  const paymentsSnap = await getDocs(collection(db, "payments"));
  paymentsSnap.forEach((paymentDoc) => {
    batch.delete(doc(db, "payments", paymentDoc.id));
  });

  // 2. Create payments from members
  const membersSnap = await getDocs(collection(db, "members"));

  membersSnap.forEach((memberDoc) => {
    const m = memberDoc.data();

    const amountPaid = Number(m.paid || m.amountPaid || 0);
    if (amountPaid <= 0) return;

    const paymentRef = doc(collection(db, "payments"));

    batch.set(paymentRef, {
      memberId: memberDoc.id,
      memberName: m.name || "",
      name: m.name || "",
      phone: m.phone || "",
      plan: m.plan || "",
      amount: amountPaid,
      totalAmount: Number(m.totalAmount || m.fee || amountPaid),
      balance: Number(m.due || m.balance || 0),
      method: m.paymentMethod || "Cash",
      status: m.status || "active",
      expiryDate: m.expiryDate || m.expiry || "",
      paymentDate: m.joiningDate || m.createdAt || new Date().toISOString().slice(0, 10),
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