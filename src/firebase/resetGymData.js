import {
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

export async function resetGymData() {
  const collectionsToDelete = [
  "members",
  "payments"
];

  try {
    for (const collectionName of collectionsToDelete) {
      const snap = await getDocs(collection(db, collectionName));

      if (snap.empty) {
        console.log(`${collectionName}: already empty`);
        continue;
      }

      const batch = writeBatch(db);

      snap.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      await batch.commit();

      console.log(`Deleted ${snap.size} docs from ${collectionName}`);
    }

    alert("Gym data reset completed.");
  } catch (error) {
    console.error(error);
    alert("Reset failed.");
  }
}