import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export const getAllMembers = async () => {
  const snap = await getDocs(collection(db, "members"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const isMemberExists = (members, name) => {
  if (!name || !members) return false;

  return members.some((m) =>
    (m?.name || "")
      .trim()
      .toLowerCase() === name.trim().toLowerCase()
  );
};