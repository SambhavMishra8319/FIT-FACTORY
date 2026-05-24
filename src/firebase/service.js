import {
  collection, doc,
  getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, where, startAfter,
  serverTimestamp, runTransaction, onSnapshot,
  increment, writeBatch,
} from "firebase/firestore";
import { addMonths, format } from "date-fns";
import { db } from "./config";

// ── MEMBERS ────────────────────────────────────────────────

export async function getAllMembers() {
  const snap = await getDocs(query(collection(db, "members"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getMembers(pageSize = 50, lastDoc = null) {
  let constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
  if (lastDoc) constraints.push(startAfter(lastDoc));
  const snap = await getDocs(query(collection(db, "members"), ...constraints));
  return {
    members: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    lastVisible: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize,
  };
}

export async function getMember(id) {
  const snap = await getDoc(doc(db, "members", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addMember(data) {
  return await addDoc(collection(db, "members"), { ...data, createdAt: serverTimestamp() });
}

export async function updateMember(id, data) {
  return await updateDoc(doc(db, "members", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteMember(id) {
  return await deleteDoc(doc(db, "members", id));
}

// Realtime listener
export function subscribeMembersSnapshot(callback) {
  const q = query(collection(db, "members"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ── PAYMENTS ──────────────────────────────────────────────

export async function getPayments(filters = {}) {
  const snap = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(200)));
  let payments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (filters.search)  payments = payments.filter(p => p.memberName?.toLowerCase().includes(filters.search.toLowerCase()));
  if (filters.method)  payments = payments.filter(p => p.method === filters.method);
  if (filters.from)    payments = payments.filter(p => p.date >= filters.from);
  if (filters.to)      payments = payments.filter(p => p.date <= filters.to);
  return payments;
}

export async function addPayment(data) {
  return await addDoc(collection(db, "payments"), { ...data, createdAt: serverTimestamp() });
}

// ✅ FIX #3: Payment + membership activation in one atomic batch
export async function recordPaymentAndActivate(paymentData, memberId, planMonths) {
  const batch = writeBatch(db);
  const today = format(new Date(), "yyyy-MM-dd");
  const expiry = format(addMonths(new Date(), planMonths), "yyyy-MM-dd");

  const payRef = doc(collection(db, "payments"));
  batch.set(payRef, { ...paymentData, status: "paid", date: today, createdAt: serverTimestamp() });

  if (memberId) {
    batch.update(doc(db, "members", memberId), {
      status: "active",
      membershipStart: today,
      expiryDate: expiry,
      amountPaid: paymentData.amount,
      plan: paymentData.plan,
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  return { paymentId: payRef.id, expiry };
}

export function subscribePaymentsSnapshot(callback) {
  const q = query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(50));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ── BCA READINGS ───────────────────────────────────────────

export async function getBCAReadings(memberId) {
  const snap = await getDocs(
    query(collection(db, "bca_readings"), where("memberId", "==", memberId), orderBy("date", "desc"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addBCAReading(data) {
  const ref = await addDoc(collection(db, "bca_readings"), { ...data, createdAt: serverTimestamp() });
  await _updateLeaderboardPoints(data.memberId, data.memberName, 30);
  return ref;
}

// ── STEAM BOOKINGS — ATOMIC TRANSACTION ────────────────────

// ✅ FIX #2: runTransaction prevents race condition
export async function bookSteamSlot({ date, slot, memberId, memberName, memberPhone }) {
  return await runTransaction(db, async (transaction) => {
    // Check slot availability atomically
    const slotQuery = query(collection(db, "steam_bookings"), where("date", "==", date), where("slot", "==", slot));
    const slotSnap = await getDocs(slotQuery);
    if (!slotSnap.empty) throw new Error("Slot just taken! Please choose another time.");

    // Check member doesn't have duplicate booking
    const memberQuery = query(collection(db, "steam_bookings"), where("date", "==", date), where("memberId", "==", memberId));
    const memberSnap = await getDocs(memberQuery);
    if (!memberSnap.empty) throw new Error("You already have a booking for this date.");

    const newRef = doc(collection(db, "steam_bookings"));
    transaction.set(newRef, { date, slot, memberId, memberName, memberPhone, createdAt: serverTimestamp() });
    return { id: newRef.id };
  });
}

// export async function getSteamBookings(date) {
//   const snap = await getDocs(query(collection(db, "steam_bookings"), where("date", "==", date)));
//   return snap.docs.map(d => ({ id: d.id, ...d.data() }));
// }

// export async function deleteSteamBooking(id) {
//   return await deleteDoc(doc(db, "steam_bookings", id));
// }

// export function subscribeSteamBookings(date, callback) {
//   const q = query(collection(db, "steam_bookings"), where("date", "==", date));
//   return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
// }
// ── STEAM SLOT ADMIN ─────────────────────────────

export async function getSteamSlots() {
  const snap = await getDocs(
    query(collection(db, "steam_slots"), orderBy("order", "asc"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
// import {   updateDoc } from "firebase/firestore";
// import { db } from "./config";

// CREATE SLOT
// export const createSteamSlot = async (slot) => {
//   return await addDoc(collection(db, "steamSlots"), {
//     ...slot,
//     createdAt: new Date(),
//   });
// };

// // DELETE SLOT
// export const removeSteamSlot = async (id) => {
//   return await deleteDoc(doc(db, "steamSlots", id));
// };

// // TOGGLE SLOT (enable/disable)
// export const toggleSteamSlot = async (id, disabled) => {
//   return await updateDoc(doc(db, "steamSlots", id), {
//     disabled,
//   });
// };

export const createSteamSlot = async (slot) => {
  try {
    const ref = await addDoc(collection(db, "steam_slots"), {
      ...slot,
      createdAt: serverTimestamp(),
    });

    console.log("Slot created with ID:", ref.id);
    return ref;
  } catch (err) {
    console.error("createSteamSlot error:", err);
    throw err;
  }
};

export const removeSteamSlot = async (id) => {
  return await deleteDoc(doc(db, "steam_slots", id));
};

export const toggleSteamSlot = async (id, disabled) => {
  return await updateDoc(doc(db, "steam_slots", id), {
    disabled,
  });
};


export function subscribeSteamSlots(callback) {
  return onSnapshot(
    query(collection(db, "steam_slots"), orderBy("order", "asc")),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

export async function addSteamSlot(data) {
  return await addDoc(collection(db, "steam_slots"), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  });
}

export async function updateSteamSlot(id, data) {
  return await updateDoc(doc(db, "steam_slots", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
export function subscribeSteamBookings(date, callback) {
  const q = query(
    collection(db, "steam_bookings"),
    where("date", "==", date)
  );

  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

export async function deleteSteamBooking(id) {
  return await deleteDoc(doc(db, "steam_bookings", id));
}
export async function deleteSteamSlot(id) {
  return await deleteDoc(doc(db, "steam_slots", id));
}

// export async function toggleSteamSlot(id, active) {
//   return await updateDoc(doc(db, "steam_slots", id), {
//     active,
//     updatedAt: serverTimestamp(),
//   });
// }
// ── ATTENDANCE ─────────────────────────────────────────────

export async function getAttendance() {
  const snap = await getDocs(query(collection(db, "attendance"), orderBy("date", "desc"), limit(500)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAttendance(memberId, memberName) {
  const today = format(new Date(), "yyyy-MM-dd");
  const existing = await getDocs(
    query(collection(db, "attendance"), where("memberId", "==", memberId), where("date", "==", today))
  );
  if (!existing.empty) return { alreadyCheckedIn: true };
  const ref = await addDoc(collection(db, "attendance"), { memberId, memberName, date: today, createdAt: serverTimestamp() });
  await _updateLeaderboardPoints(memberId, memberName, 10);
  return { id: ref.id };
}

export function subscribeTodayAttendance(callback) {
  const today = format(new Date(), "yyyy-MM-dd");
  return onSnapshot(query(collection(db, "attendance"), where("date", "==", today)), snap => callback(snap.docs.map(d => d.data())));
}

// ── WORKOUT LOGS ────────────────────────────────────────────

// ✅ FIX #1: Save workout progress to Firebase
export async function saveWorkoutLog({ memberId, memberName, plan, exercisesDone, total }) {
  const today = format(new Date(), "yyyy-MM-dd");
  const existing = await getDocs(
    query(collection(db, "workout_logs"), where("memberId", "==", memberId), where("completedAt", "==", today))
  );
  // Update existing or create new
  if (!existing.empty) {
    await updateDoc(doc(db, "workout_logs", existing.docs[0].id), { exercisesDone, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, "workout_logs"), { memberId, memberName, plan, exercisesDone, total, completedAt: today, createdAt: serverTimestamp() });
  }
  if (exercisesDone === total) {
    await _updateLeaderboardPoints(memberId, memberName, 50);
  }
}

export async function getTodayWorkoutLog(memberId) {
  const today = format(new Date(), "yyyy-MM-dd");
  const snap = await getDocs(query(collection(db, "workout_logs"), where("memberId", "==", memberId), where("completedAt", "==", today)));
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function getWorkoutLogs(memberId) {
  const snap = await getDocs(query(collection(db, "workout_logs"), where("memberId", "==", memberId), orderBy("createdAt", "desc"), limit(30)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── LEADERBOARD ────────────────────────────────────────────

// Internal helper — upsert points
async function _updateLeaderboardPoints(memberId, memberName, points) {
  if (!memberId) return;
  try {
    const q = query(collection(db, "leaderboard"), where("memberId", "==", memberId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, "leaderboard", snap.docs[0].id), {
        points: increment(points), memberName, updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "leaderboard"), {
        memberId, memberName, points, createdAt: serverTimestamp(),
      });
    }
  } catch (e) { console.error("Leaderboard update error:", e); }
}

// ✅ FIX #1: Real leaderboard from Firebase
export async function getLeaderboard() {
  const snap = await getDocs(query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(10)));
  return snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
}

export function subscribeLeaderboard(callback) {
  return onSnapshot(
    query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(10)),
    snap => callback(snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() })))
  );
}

// ── ACHIEVEMENTS ────────────────────────────────────────────

const ACHIEVEMENT_DEFS = [
  { id: "7day_warrior",  name: "7-Day Warrior",  desc: "7 day streak",       icon: "🔥", points: 100 },
  { id: "month_crusher", name: "Month Crusher",  desc: "20+ sessions/month", icon: "💪", points: 150 },
  { id: "bca_tracker",   name: "BCA Tracker",    desc: "2+ BCA readings",    icon: "📊", points: 80  },
  { id: "iron_legend",   name: "Iron Legend",    desc: "30-day streak",      icon: "🏆", points: 500 },
  { id: "f2_elite",      name: "F2 Elite",       desc: "50+ sessions",       icon: "👑", points: 300 },
  { id: "early_bird",    name: "Early Bird",     desc: "Check in before 8AM",icon: "⚡", points: 50  },
];

export async function getAchievements(memberId) {
  const snap = await getDocs(query(collection(db, "achievements"), where("memberId", "==", memberId)));
  const earned = new Set(snap.docs.map(d => d.data().achievementId));
  return ACHIEVEMENT_DEFS.map(a => ({ ...a, earned: earned.has(a.id) }));
}

export async function checkAndAwardAchievements(memberId, memberName, { attendance, bcaReadings }) {
  const existingSnap = await getDocs(query(collection(db, "achievements"), where("memberId", "==", memberId)));
  const existingIds = new Set(existingSnap.docs.map(d => d.data().achievementId));

  const dates = new Set(attendance.map(a => a.date));
  let streak = 0;
  let d = new Date();
  while (dates.has(format(d, "yyyy-MM-dd"))) { streak++; d.setDate(d.getDate() - 1); }
  const thisMonth = format(new Date(), "yyyy-MM");
  const monthSessions = attendance.filter(a => a.date?.startsWith(thisMonth)).length;

  const checks = {
    "7day_warrior":  () => streak >= 7,
    "month_crusher": () => monthSessions >= 20,
    "bca_tracker":   () => bcaReadings.length >= 2,
    "iron_legend":   () => streak >= 30,
    "f2_elite":      () => attendance.length >= 50,
    "early_bird":    () => false, // checked at checkin time
  };

  const batch = writeBatch(db);
  const newlyEarned = [];
  const today = format(new Date(), "yyyy-MM-dd");

  for (const a of ACHIEVEMENT_DEFS) {
    if (!existingIds.has(a.id) && checks[a.id]?.()) {
      const ref = doc(collection(db, "achievements"));
      batch.set(ref, { memberId, memberName, achievementId: a.id, name: a.name, icon: a.icon, points: a.points, earnedAt: today, createdAt: serverTimestamp() });
      newlyEarned.push(a);
    }
  }

  if (newlyEarned.length > 0) {
    await batch.commit();
    for (const a of newlyEarned) await _updateLeaderboardPoints(memberId, memberName, a.points);
  }

  return newlyEarned;
}

// ── NOTIFICATIONS ───────────────────────────────────────────

export async function getNotifications() {
  const snap = await getDocs(query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(20)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addNotification(data) {
  return await addDoc(collection(db, "notifications"), { ...data, read: false, createdAt: serverTimestamp() });
}

export function subscribeUnreadCount(callback) {
  return onSnapshot(query(collection(db, "notifications"), where("read", "==", false)), snap => callback(snap.size));
}

// ── UTILS ──────────────────────────────────────────────────

export function exportToCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]).filter(k => !["id"].includes(k));
  const csv = [keys.join(","), ...data.map(row => keys.map(k => {
    const v = String(row[k] ?? "");
    return v.includes(",") ? `"${v}"` : v;
  }).join(","))].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`,
  });
  a.click();
}
