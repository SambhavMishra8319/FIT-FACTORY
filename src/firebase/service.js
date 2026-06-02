import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  startAfter,
  serverTimestamp,
  runTransaction,
  onSnapshot,
  increment,
  writeBatch,
} from "firebase/firestore";
import { addMonths, format } from "date-fns";
import { db } from "./config";

// ── MEMBERS ────────────────────────────────────────────────

export async function getAllMembers() {
  const snap = await getDocs(
    query(collection(db, "members"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getMembers(pageSize = 50, lastDoc = null) {
  let constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
  if (lastDoc) constraints.push(startAfter(lastDoc));
  const snap = await getDocs(query(collection(db, "members"), ...constraints));
  return {
    members: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastVisible: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize,
  };
}

export async function getMember(id) {
  const snap = await getDoc(doc(db, "members", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addMember(data) {
  const cleanPhone = normalizePhone(data.phone || "");

  if (!cleanPhone || cleanPhone.length !== 10) {
    throw new Error("Valid 10 digit phone number is required.");
  }

  const exists = await isPhoneAlreadyUsed(cleanPhone);

  if (exists) {
    throw new Error("This phone number is already registered.");
  }

  return await addDoc(collection(db, "members"), {
    ...data,
    phone: cleanPhone,
    authUid: data.authUid || "",
    uid: data.uid || "",
    appActivated: false,
    createdAt: serverTimestamp(),
  });
}

// export async function updateMember(id, data) {
//   return await updateDoc(doc(db, "members", id), {
//     ...data,
//     updatedAt: serverTimestamp(),
//   });
// }
// export async function updateMember(id, data) {
//   const payload = { ...data };

//   if (
//   payload.phone &&
//   payload.phone !== currentMember.phone
// ) {
//     const cleanPhone = normalizePhone(payload.phone);

//     if (!cleanPhone || cleanPhone.length !== 10) {
//       throw new Error("Valid 10 digit phone number is required.");
//     }

//     const exists = await isPhoneAlreadyUsed(cleanPhone, id);

//     if (exists) {
//       throw new Error("This phone number is already used by another member.");
//     }

//     payload.phone = cleanPhone;
//   }

//   return await updateDoc(doc(db, "members", id), {
//     ...payload,
//     updatedAt: serverTimestamp(),
//   });
// }

export async function deleteMember(id) {
  return await deleteDoc(doc(db, "members", id));
}

// Realtime listener
export function subscribeMembersSnapshot(callback) {
  const q = query(
    collection(db, "members"),
    orderBy("createdAt", "desc"),
    limit(100),
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

// ── PAYMENTS ──────────────────────────────────────────────

export async function getPayments(filters = {}) {
  const snap = await getDocs(
    query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(200)),
  );
  let payments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (filters.search)
    payments = payments.filter((p) =>
      p.memberName?.toLowerCase().includes(filters.search.toLowerCase()),
    );
  if (filters.method)
    payments = payments.filter((p) => p.method === filters.method);
  if (filters.from) payments = payments.filter((p) => p.date >= filters.from);
  if (filters.to) payments = payments.filter((p) => p.date <= filters.to);
  return payments;
}

// export async function addPayment(data) {
//   return await addDoc(collection(db, "payments"), {
//     ...data,
//     createdAt: serverTimestamp(),
//   });
// }
export async function addPayment(data) {
  return await addDoc(collection(db, "payments"), {
    type: data.type || "member", // 👈 NEW

    memberId: data.memberId || null,
    trainerId: data.trainerId || null,

    memberName: data.memberName || "",
    trainerName: data.trainerName || "",

    amount: Number(data.amount || 0),
    method: data.method || "Cash",

    plan: data.plan || null,
    date: data.date,
    status: data.status || "paid",

    notes: data.notes || "",

    createdAt: serverTimestamp(),
  });
}
// ✅ FIX #3: Payment + membership activation in one atomic batch
// export async function recordPaymentAndActivate(
//   paymentData,
//   memberId,
//   planMonths,
// ) {
//   const batch = writeBatch(db);
//   const today = format(new Date(), "yyyy-MM-dd");
//   const expiry = format(addMonths(new Date(), planMonths), "yyyy-MM-dd");

//   const payRef = doc(collection(db, "payments"));
//   batch.set(payRef, {
//     ...paymentData,
//     status: "paid",
//     date: today,
//     createdAt: serverTimestamp(),
//   });

//   if (memberId) {
//     batch.update(doc(db, "members", memberId), {
//       status: "active",
//       membershipStart: today,
//       expiryDate: expiry,
//       amountPaid: paymentData.amount,
//       plan: paymentData.plan,
//       updatedAt: serverTimestamp(),
//     });
//   }

//   await batch.commit();
//   return { paymentId: payRef.id, expiry };
// }
export async function recordPaymentAndActivate(
  paymentData,
  memberId,
  planMonths,
) {
  const batch = writeBatch(db);
  const today = format(new Date(), "yyyy-MM-dd");
  const expiry = format(addMonths(new Date(), planMonths), "yyyy-MM-dd");

  const payRef = doc(collection(db, "payments"));

  batch.set(payRef, {
    ...paymentData,
    amount: Number(paymentData.amount || 0),
    membershipFee: Number(paymentData.membershipFee || 0),
    registrationFee: Number(paymentData.registrationFee || 0),
    discount: Number(paymentData.discount || 0),
    totalAmount: Number(paymentData.totalAmount || 0),
    balanceDue: Number(paymentData.balanceDue || 0),
    transactionId: paymentData.transactionId || "",
    status: "paid",
    date: today,
    createdAt: serverTimestamp(),
  });

  if (memberId) {
    batch.update(doc(db, "members", memberId), {
      status: "active",
      membershipStart: today,
      expiryDate: expiry,
      amountPaid: Number(paymentData.amount || 0),
      membershipFee: Number(paymentData.membershipFee || 0),
      registrationFee: Number(paymentData.registrationFee || 0),
      discount: Number(paymentData.discount || 0),
      totalAmount: Number(paymentData.totalAmount || 0),
      balanceDue: Number(paymentData.balanceDue || 0),
      transactionId: paymentData.transactionId || "",
      paymentMethod: paymentData.method || "Cash",
      plan: paymentData.plan,
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  return { paymentId: payRef.id, expiry };
}
export function subscribePaymentsSnapshot(callback) {
  const q = query(
    collection(db, "payments"),
    orderBy("createdAt", "desc"),
    limit(50),
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

// ── BCA READINGS ───────────────────────────────────────────

export async function getBCAReadings(memberId) {
  const snap = await getDocs(
    query(
      collection(db, "bca_readings"),
      where("memberId", "==", memberId),
      orderBy("date", "desc"),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addBCAReading(data) {
  const ref = await addDoc(collection(db, "bca_readings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  await _updateLeaderboardPoints(data.memberId, data.memberName, 30);
  return ref;
}

// ── STEAM BOOKINGS — ATOMIC TRANSACTION ────────────────────

// ✅ FIX #2: runTransaction prevents race condition
export async function bookSteamSlot({
  date,
  slot,
  period,
  memberId,
  memberName,
  memberPhone,
}) {
  return await runTransaction(db, async (transaction) => {
    // Check slot availability atomically
    const slotQuery = query(
      collection(db, "steam_bookings"),
      where("date", "==", date),
      where("slot", "==", slot),
      where("period", "==", period),
    );
    const slotSnap = await getDocs(slotQuery);
    if (!slotSnap.empty)
      throw new Error("Slot just taken! Please choose another time.");

    // Check member doesn't have duplicate booking
    const memberQuery = query(
      collection(db, "steam_bookings"),
      where("date", "==", date),
      where("memberId", "==", memberId),
    );
    const memberSnap = await getDocs(memberQuery);
    if (!memberSnap.empty)
      throw new Error("You already have a booking for this date.");

    const newRef = doc(collection(db, "steam_bookings"));
    // transaction.set(newRef, { date, slot, memberId, memberName, memberPhone, createdAt: serverTimestamp() });
    transaction.set(newRef, {
      date,
      slot,
      period,
      memberId,
      memberName,
      memberPhone: memberPhone || "",
      createdAt: serverTimestamp(),
    });
    return { id: newRef.id };
  });
}


export async function getSteamSlots() {
  const snap = await getDocs(
    // query(collection(db, "steam_slots"), orderBy("order", "asc"))
    query(collection(db, "steam_slots"), orderBy("createdAt", "asc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}


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

// export function subscribeSteamSlots(callback) {
//   return onSnapshot(
//     query(collection(db, "steam_slots"), orderBy("order", "asc")),
//     snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//   );
// }
export function subscribeSteamSlots(callback) {
  return onSnapshot(
    query(collection(db, "steam_slots"), orderBy("createdAt", "asc")),
    (snap) => {
      console.log(
        "Firestore slots:",
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );

      callback(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    },
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
  const q = query(collection(db, "steam_bookings"), where("date", "==", date));

  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
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
  const snap = await getDocs(
    query(collection(db, "attendance"), orderBy("date", "desc"), limit(500)),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addAttendance(memberId, memberName) {
  const today = format(new Date(), "yyyy-MM-dd");
  const existing = await getDocs(
    query(
      collection(db, "attendance"),
      where("memberId", "==", memberId),
      where("date", "==", today),
    ),
  );
  if (!existing.empty) return { alreadyCheckedIn: true };
  const ref = await addDoc(collection(db, "attendance"), {
    memberId,
    memberName,
    date: today,
    createdAt: serverTimestamp(),
  });
  await _updateLeaderboardPoints(memberId, memberName, 10);
  return { id: ref.id };
}

export function subscribeTodayAttendance(callback) {
  const today = format(new Date(), "yyyy-MM-dd");
  return onSnapshot(
    query(collection(db, "attendance"), where("date", "==", today)),
    (snap) => callback(snap.docs.map((d) => d.data())),
  );
}

// ── WORKOUT LOGS ────────────────────────────────────────────

// ✅ FIX #1: Save workout progress to Firebase
export async function saveWorkoutLog({
  memberId,
  memberName,
  plan,
  exercisesDone,
  total,
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const existing = await getDocs(
    query(
      collection(db, "workout_logs"),
      where("memberId", "==", memberId),
      where("completedAt", "==", today),
    ),
  );
  // Update existing or create new
  if (!existing.empty) {
    await updateDoc(doc(db, "workout_logs", existing.docs[0].id), {
      exercisesDone,
      updatedAt: serverTimestamp(),
    });
  } else {
    await addDoc(collection(db, "workout_logs"), {
      memberId,
      memberName,
      plan,
      exercisesDone,
      total,
      completedAt: today,
      createdAt: serverTimestamp(),
    });
  }
  if (exercisesDone === total) {
    await _updateLeaderboardPoints(memberId, memberName, 50);
  }
}

export async function getTodayWorkoutLog(memberId) {
  const today = format(new Date(), "yyyy-MM-dd");
  const snap = await getDocs(
    query(
      collection(db, "workout_logs"),
      where("memberId", "==", memberId),
      where("completedAt", "==", today),
    ),
  );
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function getWorkoutLogs(memberId) {
  const snap = await getDocs(
    query(
      collection(db, "workout_logs"),
      where("memberId", "==", memberId),
      orderBy("createdAt", "desc"),
      limit(30),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── LEADERBOARD ────────────────────────────────────────────

// Internal helper — upsert points
async function _updateLeaderboardPoints(memberId, memberName, points) {
  if (!memberId) return;
  try {
    const q = query(
      collection(db, "leaderboard"),
      where("memberId", "==", memberId),
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, "leaderboard", snap.docs[0].id), {
        points: increment(points),
        memberName,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "leaderboard"), {
        memberId,
        memberName,
        points,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.error("Leaderboard update error:", e);
  }
}

// ✅ FIX #1: Real leaderboard from Firebase
export async function getLeaderboard() {
  const snap = await getDocs(
    query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(10)),
  );
  return snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
}

export function subscribeLeaderboard(callback) {
  return onSnapshot(
    query(collection(db, "leaderboard"), orderBy("points", "desc"), limit(10)),
    (snap) =>
      callback(
        snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() })),
      ),
  );
}

// ── ACHIEVEMENTS ────────────────────────────────────────────

const ACHIEVEMENT_DEFS = [
  {
    id: "7day_warrior",
    name: "7-Day Warrior",
    desc: "7 day streak",
    icon: "🔥",
    points: 100,
  },
  {
    id: "month_crusher",
    name: "Month Crusher",
    desc: "20+ sessions/month",
    icon: "💪",
    points: 150,
  },
  {
    id: "bca_tracker",
    name: "BCA Tracker",
    desc: "2+ BCA readings",
    icon: "📊",
    points: 80,
  },
  {
    id: "iron_legend",
    name: "Iron Legend",
    desc: "30-day streak",
    icon: "🏆",
    points: 500,
  },
  {
    id: "f2_elite",
    name: "F2 Elite",
    desc: "50+ sessions",
    icon: "👑",
    points: 300,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    desc: "Check in before 8AM",
    icon: "⚡",
    points: 50,
  },
];

export async function getAchievements(memberId) {
  const snap = await getDocs(
    query(collection(db, "achievements"), where("memberId", "==", memberId)),
  );
  const earned = new Set(snap.docs.map((d) => d.data().achievementId));
  return ACHIEVEMENT_DEFS.map((a) => ({ ...a, earned: earned.has(a.id) }));
}

export async function checkAndAwardAchievements(
  memberId,
  memberName,
  { attendance, bcaReadings },
) {
  const existingSnap = await getDocs(
    query(collection(db, "achievements"), where("memberId", "==", memberId)),
  );
  const existingIds = new Set(
    existingSnap.docs.map((d) => d.data().achievementId),
  );

  const dates = new Set(attendance.map((a) => a.date));
  let streak = 0;
  let d = new Date();
  while (dates.has(format(d, "yyyy-MM-dd"))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  const thisMonth = format(new Date(), "yyyy-MM");
  const monthSessions = attendance.filter((a) =>
    a.date?.startsWith(thisMonth),
  ).length;

  const checks = {
    "7day_warrior": () => streak >= 7,
    month_crusher: () => monthSessions >= 20,
    bca_tracker: () => bcaReadings.length >= 2,
    iron_legend: () => streak >= 30,
    f2_elite: () => attendance.length >= 50,
    early_bird: () => false, // checked at checkin time
  };

  const batch = writeBatch(db);
  const newlyEarned = [];
  const today = format(new Date(), "yyyy-MM-dd");

  for (const a of ACHIEVEMENT_DEFS) {
    if (!existingIds.has(a.id) && checks[a.id]?.()) {
      const ref = doc(collection(db, "achievements"));
      batch.set(ref, {
        memberId,
        memberName,
        achievementId: a.id,
        name: a.name,
        icon: a.icon,
        points: a.points,
        earnedAt: today,
        createdAt: serverTimestamp(),
      });
      newlyEarned.push(a);
    }
  }

  if (newlyEarned.length > 0) {
    await batch.commit();
    for (const a of newlyEarned)
      await _updateLeaderboardPoints(memberId, memberName, a.points);
  }

  return newlyEarned;
}

// ── NOTIFICATIONS ───────────────────────────────────────────

export async function getNotifications() {
  const snap = await getDocs(
    query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}



export async function addNotification(data) {
  return await addDoc(
    collection(db, "notifications"),
    {
      ...data,
      read: false,
      createdAt: serverTimestamp(),
    }
  );
}

export function subscribeUnreadCount(callback) {
  return onSnapshot(
    query(collection(db, "notifications"), where("read", "==", false)),
    (snap) => callback(snap.size),
  );
}

// ── UTILS ──────────────────────────────────────────────────

export function exportToCSV(data, filename) {
  if (!data.length) return;
  const keys = Object.keys(data[0]).filter((k) => !["id"].includes(k));
  const csv = [
    keys.join(","),
    ...data.map((row) =>
      keys
        .map((k) => {
          const v = String(row[k] ?? "");
          return v.includes(",") ? `"${v}"` : v;
        })
        .join(","),
    ),
  ].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`,
  });
  a.click();
}
export async function requestSteamSlot({
  date,
  slot,
  period,
  memberId,
  memberName,
  memberPhone,
}) {
  // ONLY check active requests
  const snap = await getDocs(
    query(
      collection(db, "steam_bookings"),
      where("date", "==", date),
      where("memberId", "==", memberId),
      where("status", "in", ["pending", "confirmed"])
    )
  );

  if (!snap.empty) {
    throw new Error("You already requested a slot for this date.");
  }

  // allow new request (even after rejection)
  return await addDoc(collection(db, "steam_bookings"), {
    date,
    slot,
    period,
    memberId,
    memberName,
    memberPhone: memberPhone || "",
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function approveSteamBooking(bookingId, date, slot, period) {
  // check already confirmed
  const existing = await getDocs(
    query(
      collection(db, "steam_bookings"),
      where("date", "==", date),
      where("slot", "==", slot),
      where("period", "==", period),
      where("status", "==", "confirmed"),
    ),
  );

  if (!existing.empty) {
    throw new Error("Slot already confirmed");
  }

  await updateDoc(doc(db, "steam_bookings", bookingId), {
    status: "confirmed",
    approvedAt: serverTimestamp(),
  });
}
export async function rejectSteamBooking(id) {
  await updateDoc(doc(db, "steam_bookings", id), {
    status: "rejected",
    rejectedAt: serverTimestamp(),
  });
}


export async function getMemberAttendance(memberId) {
  const snap = await getDocs(
    query(
      collection(db, "attendance"),
      where("memberId", "==", memberId),
      orderBy("date", "desc")
    )
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
export async function getSteamBookingsByMember(memberId) {
  const snap = await getDocs(
    query(
      collection(db, "steam_bookings"),
      where("memberId", "==", memberId),
      orderBy("createdAt", "desc")
    )
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// MEMBER NOTIFICATIONS
export async function getMemberNotifications(memberId) {
  try {
    const q = query(
      collection(db, "notifications"),
      where("memberId", "==", memberId),
      orderBy("date", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}
export const getAllTrainers = async () => {
  const snap = await getDocs(collection(db, "trainers"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export async function getTrainerPayments() {
  const snap = await getDocs(
    query(
      collection(db, "payments"),
      where("type", "==", "trainer"),
      orderBy("createdAt", "desc"),
    )
  );

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function getBalanceSheet() {
  const snap = await getDocs(collection(db, "payments"));
  const payments = snap.docs.map(d => d.data());

  const income = payments
    .filter(p => p.type === "member")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const trainerExpense = payments
    .filter(p => p.type === "trainer")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const otherExpense = payments
    .filter(p => p.type === "expense")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return {
    income,
    trainerExpense,
    otherExpense,
    profit: income - (trainerExpense + otherExpense),
  };
}
// export async function assignTrainerToMembeexport async function assignTrainerToMembeexport async function assignTrainerToMembeexport async function assignTrainerToMembeexport async function assignTrainerToMembe
export async function assignTrainerToMember(memberId, trainer) {
  const batch = writeBatch(db);

  const memberRef = doc(db, "members", memberId);

  batch.update(memberRef, {
    trainerId: trainer.id,
    trainerName: trainer.name,
    trainerFee: trainer.fee || 0,
    updatedAt: serverTimestamp(),
  });

  const trainerRef = doc(db, "trainers", trainer.id);

  batch.update(trainerRef, {
    updatedAt: serverTimestamp(),
  });

  return await batch.commit();
}

export async function getTrainerEarnings(trainerId) {
  const snap = await getDocs(collection(db, "payments"));

  const payments = snap.docs.map(d => d.data());

  const trainerIncome = payments
    .filter(p => p.type === "member" && p.trainerId === trainerId)
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return trainerIncome;
}
// import { format } from "date-fns";

export const getTrainerIncomeAnalytics = async () => {
  const trainers = await getAllTrainers();

  const ptSnap = await getDocs(
    collection(db, "personalTraining")
  );

  const paymentSnap = await getDocs(
    collection(db, "trainerPayments")
  );

  const ptData = ptSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const paymentData = paymentSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const currentMonth = format(
    new Date(),
    "yyyy-MM"
  );

  return trainers.map((trainer) => {
    const trainerPTs = ptData.filter(
      (p) => p.trainerId === trainer.id
    );

    const trainerPayments = paymentData.filter(
      (p) => p.trainerId === trainer.id
    );

    const activeClients =
      new Set(
        trainerPTs.map((p) => p.memberId)
      ).size;

    const ptSessions =
      trainerPTs.length;

    const revenue =
      trainerPTs.reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      );

    const earnings =
      trainerPTs.reduce(
        (sum, p) =>
          sum +
          Number(p.trainerShare || 0),
        0
      );

    const paid =
      trainerPayments.reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      );

    const monthlyRevenue =
      trainerPTs
        .filter((p) => {
          const d =
            p.createdAt?.toDate?.();

          return (
            d &&
            format(d, "yyyy-MM") ===
              currentMonth
          );
        })
        .reduce(
          (sum, p) =>
            sum + Number(p.amount || 0),
          0
        );

    return {
      id: trainer.id,
      name: trainer.name,

      activeClients,
      ptSessions,

      revenue,
      monthlyRevenue,

      earnings,
      paid,

      pending: earnings - paid,
    };
  });
};
// export const getTrainerIncomeAnalytics = async () => {
//   const trainers = await getAllTrainers();

//   const ptSnap = await getDocs(
//     collection(db, "personalTraining")
//   );

//   const paymentSnap = await getDocs(
//     collection(db, "trainerPayments")
//   );

//   const ptData = ptSnap.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   const paymentData = paymentSnap.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return trainers.map((trainer) => {
//     const pts = ptData.filter(
//       p => p.trainerId === trainer.id
//     );

//     const payments = paymentData.filter(
//       p => p.trainerId === trainer.id
//     );

//     const revenue = pts.reduce(
//       (sum, p) => sum + Number(p.amount || 0),
//       0
//     );

//     const earnings = pts.reduce(
//       (sum, p) => sum + Number(p.trainerShare || 0),
//       0
//     );

//     const paid = payments.reduce(
//       (sum, p) => sum + Number(p.amount || 0),
//       0
//     );

//     return {
//       ...trainer,
//       clients: pts.length,
//       revenue,
//       earnings,
//       paid,
//       pending: earnings - paid,
//     };
//   });
// };
export const getAllTrainerPayments = async () => {
  try {
    const snapshot = await getDocs(
      collection(db, "trainerPayments")
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};
// export async function addBiometricAttendance({
//   memberId,
//   memberName,
//   biometricId,
// }) {
//   const today = format(
//     new Date(),
//     "yyyy-MM-dd"
//   );

//   const existing = await getDocs(
//     query(
//       collection(db, "attendance"),
//       where("memberId", "==", memberId),
//       where("date", "==", today)
//     )
//   );

//   if (!existing.empty) {
//     return { alreadyCheckedIn: true };
//   }

//   const ref = await addDoc(
//     collection(db, "attendance"),
//     {
//       memberId,
//       memberName,
//       biometricId,
//       source: "biometric",
//       date: today,
//       createdAt: serverTimestamp(),
//     }
//   );

//   return { id: ref.id };
// }
export function normalizePhone(phone = "") {
  return phone.replace(/\D/g, "").slice(-10);
}

export async function getMemberByPhone(phone) {
  const cleanPhone = normalizePhone(phone);

  const snap = await getDocs(
    query(collection(db, "members"), where("phone", "==", cleanPhone)),
  );

  if (snap.empty) return null;

  const d = snap.docs[0];

  return {
    id: d.id,
    ...d.data(),
  };
}

export async function isPhoneAlreadyUsed(phone, excludeMemberId = null) {
  const cleanPhone = normalizePhone(phone);

  const snap = await getDocs(
    query(collection(db, "members"), where("phone", "==", cleanPhone)),
  );

  if (snap.empty) return false;

  if (excludeMemberId) {
    return snap.docs.some((d) => d.id !== excludeMemberId);
  }

  return true;
}
export async function updateMember(id, data) {
  const payload = { ...data };

  if (payload.phone) {
    const cleanPhone = normalizePhone(payload.phone);

    if (!cleanPhone || cleanPhone.length !== 10) {
      throw new Error("Valid 10 digit phone number is required.");
    }

    const exists = await isPhoneAlreadyUsed(cleanPhone, id);

    if (exists) {
      throw new Error("This phone number is already used by another member.");
    }

    payload.phone = cleanPhone;
  }

  return await updateDoc(doc(db, "members", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}
{/* <Route path="/massage-chair" element={<MassageChair />} /> */}

export async function bookMassageSession(member, bookingData = {}) {
  if (!member?.id) {
    throw new Error("Member not found");
  }

  const memberRef = doc(db, "members", member.id);

  await runTransaction(db, async (transaction) => {
    const memberSnap = await transaction.get(memberRef);

    if (!memberSnap.exists()) {
      throw new Error("Member not found");
    }

    const data = memberSnap.data();
    const allowed = data.massageSessionsAllowed ?? 0;
    const used = Number(data.massageSessionsUsed || 0);

    if (allowed !== "unlimited" && used >= Number(allowed)) {
      throw new Error("No massage sessions remaining");
    }

    const bookingRef = doc(collection(db, "massageBookings"));

    transaction.set(bookingRef, {
      memberId: member.id,
      memberCode: data.memberId || "",
      memberName: data.name || data.fullName || member.name || "",
      phone: data.phone || "",
      date: bookingData.date || format(new Date(), "yyyy-MM-dd"),
      time: bookingData.time || "",
      notes: bookingData.notes || "",
      status: "booked",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    transaction.update(memberRef, {
      massageSessionsUsed: increment(1),
      massageSessionsRemaining:
        allowed === "unlimited" ? "unlimited" : Number(allowed) - used - 1,
      updatedAt: new Date(),
    });
  });
}

export async function getMassageBookings() {
  const q = query(
    collection(db, "massageBookings"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function addMassageSession(member, sessionData = {}) {
  if (!member?.id) {
    throw new Error("Member not found");
  }

  const memberRef = doc(db, "members", member.id);

  await runTransaction(db, async (transaction) => {
    const memberSnap = await transaction.get(memberRef);

    if (!memberSnap.exists()) {
      throw new Error("Member not found");
    }

    const data = memberSnap.data();

    const allowed = data.massageSessionsAllowed ?? 0;
    const used = Number(data.massageSessionsUsed || 0);

    if (allowed !== "unlimited" && used >= Number(allowed)) {
      throw new Error("No massage sessions remaining");
    }

    const sessionRef = doc(collection(db, "massage_sessions"));
    const sessionNumber = used + 1;

    transaction.set(sessionRef, {
      memberId: member.id,
      memberDocId: member.id,
      memberCode: data.memberId || "",
      memberName: data.name || data.fullName || member.name || "",
      phone: data.phone || "",
      plan: data.plan || "",
      date: sessionData.date || new Date().toISOString().split("T")[0],
      time: sessionData.time || "",
      duration: Number(sessionData.duration || 20),
      notes: sessionData.notes || "",
      sessionNumber,
      status: "completed",
      createdAt: serverTimestamp(),
    });

    transaction.update(memberRef, {
      massageSessionsUsed: increment(1),
      massageSessionsRemaining:
        allowed === "unlimited" ? "unlimited" : Number(allowed) - used - 1,
      updatedAt: new Date(),
    });
  });
}

export async function getMassageSessions(memberId = null) {
  const constraints = [];

  if (memberId) {
    constraints.push(where("memberId", "==", memberId));
  }

  constraints.push(orderBy("date", "desc"));

  const q = query(collection(db, "massage_sessions"), ...constraints);
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function getAllMassageSessions() {
  const q = query(collection(db, "massage_sessions"), orderBy("date", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
