import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { auth, db, googleProvider } from "../firebase/config";
import { updateMember } from "../firebase/service";

const AuthContext = createContext(null);

const normalizePhone = (phone = "") => phone.replace(/\D/g, "").slice(-10);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(firebaseUser) {
    try {
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));

      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setRole(data.role || "member");
      } else {
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error("Profile load error:", err);
      setProfile(null);
      setRole(null);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          await loadProfile(firebaseUser);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const loginAdmin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signupAdmin = async (email, password, name) => {
    const cleanEmail = email.trim().toLowerCase();

    const cred = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );

    await updateProfile(cred.user, {
      displayName: name,
    });

    const data = {
      uid: cred.user.uid,
      name,
      email: cleanEmail,
      role: "admin",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", cred.user.uid), data);

    setUser(cred.user);
    setProfile(data);
    setRole("admin");

    return cred;
  };

  const loginMember = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleMemberLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userSnap.exists()) {
      await signOut(auth);
      throw new Error(
        "Account not activated. Please activate using your registered phone number.",
      );
    }

    const data = userSnap.data();

    if (data.role !== "member") {
      throw new Error("This Google account is not linked with a member account.");
    }

    setUser(firebaseUser);
    setProfile(data);
    setRole("member");

    return result;
  };
const activateMemberWithGoogle = async (phone) => {
  const cleanPhone = normalizePhone(phone);

  if (cleanPhone.length !== 10) {
    throw new Error("Please enter a valid 10 digit phone number.");
  }

  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  try {
    const memberSnap = await getDocs(
      query(collection(db, "members"), where("phone", "==", cleanPhone)),
    );

    if (memberSnap.empty) {
      await signOut(auth);
      throw new Error("This phone number is not registered. Contact gym admin.");
    }

    const memberDoc = memberSnap.docs[0];
    const memberId = memberDoc.id;
    const memberData = memberDoc.data();

    if (memberData.uid || memberData.authUid || memberData.appActivated) {
      await signOut(auth);
      throw new Error("This member account is already activated. Please login.");
    }

    const cleanEmail = firebaseUser.email?.trim().toLowerCase() || "";

    const profileData = {
      uid: firebaseUser.uid,
      authUid: firebaseUser.uid,
      name: memberData.name || firebaseUser.displayName || "Member",
      email: cleanEmail,
      phone: cleanPhone,
      photo: firebaseUser.photoURL || "",
      role: "member",
      memberId,
      goal: memberData.goal || "General Fitness",
      status: memberData.status || "pending",
      membershipStatus: memberData.status || "pending",
      membershipAssigned: true,
      plan: memberData.plan || null,
      amountPaid: Number(memberData.amountPaid || 0),
      expiryDate: memberData.expiryDate || null,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), profileData);

    await updateMember(memberId, {
  uid: firebaseUser.uid,
  authUid: firebaseUser.uid,
  email: cleanEmail,
  phone: cleanPhone,
  appActivated: true,
  appActivatedAt: serverTimestamp(),
});
// await updateMember(memberId, {
//   uid: firebaseUser.uid,
//   authUid: firebaseUser.uid,
//   email: cleanEmail,
//   appActivated: true,
// });
    setUser(firebaseUser);
    setProfile(profileData);
    setRole("member");

    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
  const logout = async () => {
    setUser(null);
    setProfile(null);
    setRole(null);
    await signOut(auth);
  };
const signupNewMemberWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;

  const userRef = doc(db, "users", firebaseUser.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    const data = existing.data();
    setUser(firebaseUser);
    setProfile(data);
    setRole(data.role || "member");
    return result;
  }

  const cleanEmail = firebaseUser.email?.trim().toLowerCase() || "";

  const profileData = {
    uid: firebaseUser.uid,
    authUid: firebaseUser.uid,
    name: firebaseUser.displayName || "Member",
    email: cleanEmail,
    phone: "",
    photo: firebaseUser.photoURL || "",

    role: "member",
    memberId: null,

    membershipAssigned: false,
    membershipStatus: "pending",
    plan: null,
    amountPaid: 0,
    expiryDate: null,

    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, profileData);

  setUser(firebaseUser);
  setProfile(profileData);
  setRole("member");

  return result;
};
  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      loading,

      loginAdmin,
      signupAdmin,

      loginMember,
      googleMemberLogin,
      activateMemberWithGoogle,
signupNewMemberWithGoogle,
      logout,

      isAdmin: role === "admin",
      isMember: role === "member",
    }),
    [user, profile, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);