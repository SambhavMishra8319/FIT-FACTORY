import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await loadProfile(u);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function loadProfile(u) {
    try {
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setRole(data.role || "member");
      } else {
        setProfile(null);
        setRole("member");
      }
    } catch {
      setRole("member");
    }
  }

  // ── Admin login ─────────────────────────────────────────
  const loginAdmin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ── Admin signup with secret code ───────────────────────
  const signupAdmin = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const data = { uid: cred.user.uid, name, email, role: "admin", createdAt: serverTimestamp() };
    await setDoc(doc(db, "users", cred.user.uid), data);
    setProfile(data);
    setRole("admin");
    return cred;
  };

  // ── Member login ─────────────────────────────────────────
  const loginMember = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ── Member signup ────────────────────────────────────────
  const signupMember = async (email, password, name, goal = "General Fitness") => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    // Try to link with existing member record by email
    let memberId = null;
    try {
      const mSnap = await getDocs(
        query(collection(db, "members"), where("email", "==", email.toLowerCase()))
      );
      if (!mSnap.empty) memberId = mSnap.docs[0].id;
    } catch { /* no match */ }

    const data = {
      uid: cred.user.uid,
      name, email,
      role: "member",
      goal, memberId,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), data);

    // Back-link uid to member record
    if (memberId) {
      const { updateMember } = await import("../firebase/service");
      await updateMember(memberId, { uid: cred.user.uid }).catch(console.error);
    }

    setProfile(data);
    setRole("member");
    return cred;
  };

  const logout = () => {
    setUser(null); setProfile(null); setRole(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, role, loading,
      loginAdmin, signupAdmin,
      loginMember, signupMember,
      logout,
      isAdmin:  role === "admin",
      isMember: role === "member",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
