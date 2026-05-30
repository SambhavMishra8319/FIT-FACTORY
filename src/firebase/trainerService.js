import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";

  // import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
  // import { db } from "./config";
import { db } from "./config";

/* =========================================================
   TRAINERS
========================================================= */

// ADD TRAINER
export const addTrainer = async (trainerData) => {
  try {
    const docRef = await addDoc(collection(db, "trainers"), {
      ...trainerData,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Add Trainer Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// GET ALL TRAINERS
export const getAllTrainers = async () => {
  try {
    const q = query(
      collection(db, "trainers"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const trainers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return trainers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET SINGLE TRAINER
export const getTrainerById = async (id) => {
  try {
    const ref = doc(db, "trainers", id);

    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    return {
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// UPDATE TRAINER
export const updateTrainer = async (id, data) => {
  try {
    const ref = doc(db, "trainers", id);

    await updateDoc(ref, data);

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// DELETE TRAINER
export const deleteTrainer = async (id) => {
  try {
    await deleteDoc(doc(db, "trainers", id));

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   PERSONAL TRAINING
========================================================= */

// ADD PT ENTRY
export const addPTEntry = async (data) => {
  try {
    if (!data.trainerId || !data.amount) {
      throw new Error("Invalid PT entry data");
    }

    await addDoc(collection(db, "personalTraining"), {
      ...data,
      amount: Number(data.amount),
      trainerShare: Number(data.trainerShare || 0),
      gymShare: Number(data.gymShare || 0),
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// GET TRAINER PT HISTORY
export const getTrainerPTs = async (trainerId) => {
  try {
    const q = query(
      collection(db, "personalTraining"),
      where("trainerId", "==", trainerId)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data.sort(
      (a, b) =>
        (b.createdAt?.seconds || 0) -
        (a.createdAt?.seconds || 0)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};
/* =========================================================
   TRAINER PAYMENTS
========================================================= */

// ADD SALARY PAYMENT
export const addTrainerPayment = async (data) => {
  try {
    if (!data.trainerId || !data.amount) {
      throw new Error("Invalid payment data");
    }

    await addDoc(collection(db, "trainerPayments"), {
      ...data,
      amount: Number(data.amount),
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// GET TRAINER PAYMENTS
export const getTrainerPayments = async (trainerId) => {
  try {
    const q = query(
      collection(db, "trainerPayments"),
      where("trainerId", "==", trainerId)
      // removed orderBy to avoid index crash
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // sort safely in JS
    return data.sort(
      (a, b) =>
        (b.createdAt?.seconds || 0) -
        (a.createdAt?.seconds || 0)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ================================
   TRAINER PAYMENTS SNAPSHOT
================================ */
export const subscribeTrainerPaymentsSnapshot = (callback) => {
  const q = query(
    collection(db, "trainerPayments"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(data);
  });
};