// // / export const useAuth = () => useContext(AuthContext);
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useMemo,
// } from "react";

// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signOut,
//   signInWithPopup,
// } from "firebase/auth";
// import { auth, googleProvider } from "../firebase/config";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   serverTimestamp,
// } from "firebase/firestore";

// import { db } from "../firebase/config";

// const AuthContext = createContext();

// /* ─────────────────────────────────────────────
//    PROVIDER
// ───────────────────────────────────────────── */
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ─────────────────────────────────────────────
//      LOAD PROFILE
//   ───────────────────────────────────────────── */
//   async function loadProfile(u) {
//     try {
//       const snap = await getDoc(doc(db, "users", u.uid));

//       if (snap.exists()) {
//         const data = snap.data();
//         setProfile(data);
//         setRole(data.role || "member");
//       } else {
//         setProfile(null);
//         setRole("member");
//       }
//     } catch (err) {
//       console.error("Profile load error:", err);
//       setProfile(null);
//       setRole("member");
//     }
//   }

//   /* ─────────────────────────────────────────────
//      AUTH LISTENER
//   ───────────────────────────────────────────── */
//   useEffect(() => {
//     let mounted = true;

//     const unsub = onAuthStateChanged(auth, async (u) => {
//       if (!mounted) return;

//       try {
//         if (u) {
//           setUser(u);
//           await loadProfile(u);
//         } else {
//           setUser(null);
//           setProfile(null);
//           setRole(null);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     });

//     return () => {
//       mounted = false;
//       unsub();
//     };
//   }, []);

//   /* ─────────────────────────────────────────────
//      ADMIN LOGIN
//   ───────────────────────────────────────────── */
//   const loginAdmin = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);

//   /* ─────────────────────────────────────────────
//      ADMIN SIGNUP
//   ───────────────────────────────────────────── */
//   const signupAdmin = async (email, password, name) => {
//     const cred = await createUserWithEmailAndPassword(auth, email, password);

//     await updateProfile(cred.user, { displayName: name });

//     const data = {
//       uid: cred.user.uid,
//       name,
//       email: email.toLowerCase(),
//       role: "admin",
//       createdAt: serverTimestamp(),
//     };

//     await setDoc(doc(db, "users", cred.user.uid), data);

//     setProfile(data);
//     setRole("admin");

//     return cred;
//   };

//   /* ─────────────────────────────────────────────
//      MEMBER LOGIN
//   ───────────────────────────────────────────── */
//   const loginMember = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);

//   /* ─────────────────────────────────────────────
//      MEMBER SIGNUP
//   ───────────────────────────────────────────── */
//   const signupMember = async (
//     email,
//     password,
//     name,
//     goal = "General Fitness",
//   ) => {
//     const normalizedEmail = email.toLowerCase();

//     const cred = await createUserWithEmailAndPassword(
//       auth,
//       normalizedEmail,
//       password,
//     );

//     await updateProfile(cred.user, { displayName: name });

//     let memberId = null;

//     try {
//       const mSnap = await getDocs(
//         query(collection(db, "members"), where("email", "==", normalizedEmail)),
//       );

//       if (!mSnap.empty) memberId = mSnap.docs[0].id;
//     } catch (err) {
//       console.warn("Member lookup failed:", err);
//     }

//     const data = {
//       uid: cred.user.uid,
//       name,
//       email: normalizedEmail,
//       role: "member",
//       goal,
//       memberId,
//       createdAt: serverTimestamp(),
//     };

//     await setDoc(doc(db, "users", cred.user.uid), data);

//     if (memberId) {
//       try {
//         const { updateMember } = await import("../firebase/service");
//         await updateMember(memberId, { uid: cred.user.uid });
//       } catch (err) {
//         console.error("Member link error:", err);
//       }
//     }

//     setProfile(data);
//     setRole("member");

//     return cred;
//   };
//   /* ─────────────────────────────────────────────
//    GOOGLE MEMBER LOGIN / SIGNUP
// ───────────────────────────────────────────── */
//   const googleMemberLogin = async () => {
//     const result = await signInWithPopup(auth, googleProvider);

//     const user = result.user;

//     const normalizedEmail = user.email.toLowerCase();

//     // Check existing profile
//     const userRef = doc(db, "users", user.uid);
//     const existing = await getDoc(userRef);

//     // Link existing gym member record
//     let memberId = null;

//     try {
//       const mSnap = await getDocs(
//         query(collection(db, "members"), where("email", "==", normalizedEmail)),
//       );

//       if (!mSnap.empty) {
//         memberId = mSnap.docs[0].id;
//       }
//     } catch (err) {
//       console.warn("Member lookup failed:", err);
//     }

//     // Create user only if not exists
//     if (!existing.exists()) {
//       const data = {
//         uid: user.uid,
//         name: user.displayName || "Member",
//         email: normalizedEmail,
//         photo: user.photoURL || "",
//         role: "member",
//         goal: "General Fitness",
//         memberId,
//         createdAt: serverTimestamp(),
//       };

//       await setDoc(userRef, data);

//       // Back-link uid into members collection
//       if (memberId) {
//         try {
//           const { updateMember } = await import("../firebase/service");

//           await updateMember(memberId, {
//             uid: user.uid,
//           });
//         } catch (err) {
//           console.error("Member link error:", err);
//         }
//       }

//       setProfile(data);
//       setRole("member");
//     } else {
//       const data = existing.data();
//       setProfile(data);
//       setRole(data.role || "member");
//     }

//     return result;
//   };
//   /* ─────────────────────────────────────────────
//      LOGOUT
//   ───────────────────────────────────────────── */
//   const logout = async () => {
//     setUser(null);
//     setProfile(null);
//     setRole(null);
//     await signOut(auth);
//   };

//   /* ─────────────────────────────────────────────
//      MEMOIZED CONTEXT VALUE (IMPORTANT FIX)
// ───────────────────────────────────────────── */
//   const value = useMemo(
//     () => ({
//       user,
//       profile,
//       role,
//       loading,

//       loginAdmin,
//       signupAdmin,
//       loginMember,
//       signupMember,
//       googleMemberLogin,
//       logout,

//       isAdmin: role === "admin",
//       isMember: role === "member",
//     }),
//     [user, profile, role, loading],
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// /* ─────────────────────────────────────────────
//    HOOK
// ───────────────────────────────────────────── */
// export const useAuth = () => useContext(AuthContext);
// // / export const useAuth = () => useContext(AuthContext);
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";

const AuthContext = createContext();

/* ─────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─────────────────────────────────────────────
     LOAD PROFILE
  ───────────────────────────────────────────── */
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
    } catch (err) {
      console.error("Profile load error:", err);
      setProfile(null);
      setRole("member");
    }
  }

  /* ─────────────────────────────────────────────
     AUTH LISTENER
  ───────────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!mounted) return;

      try {
        if (u) {
          setUser(u);
          await loadProfile(u);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  /* ─────────────────────────────────────────────
     ADMIN LOGIN
  ───────────────────────────────────────────── */
  const loginAdmin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  /* ─────────────────────────────────────────────
     ADMIN SIGNUP
  ───────────────────────────────────────────── */
  const signupAdmin = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, { displayName: name });

    const data = {
      uid: cred.user.uid,
      name,
      email: email.toLowerCase(),
      role: "admin",
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", cred.user.uid), data);

    setProfile(data);
    setRole("admin");

    return cred;
  };

  /* ─────────────────────────────────────────────
     MEMBER LOGIN
  ───────────────────────────────────────────── */
  const loginMember = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  /* ─────────────────────────────────────────────
     MEMBER SIGNUP
  ───────────────────────────────────────────── */
  const signupMember = async (
    email,
    password,
    name,
    goal = "General Fitness",
  ) => {
    const normalizedEmail = email.toLowerCase();

    const cred = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );

    await updateProfile(cred.user, { displayName: name });

    let memberId = null;

    try {
      const mSnap = await getDocs(
        query(collection(db, "members"), where("email", "==", normalizedEmail)),
      );

      if (!mSnap.empty) memberId = mSnap.docs[0].id;
    } catch (err) {
      console.warn("Member lookup failed:", err);
    }

    // const data = {
    //   uid: cred.user.uid,
    //   name,
    //   email: normalizedEmail,
    //   role: "member",
    //   goal,
    //   memberId,
    //   createdAt: serverTimestamp(),
    // };
    const data = {
      uid: cred.user.uid,
      name,
      email: normalizedEmail,

      role: "member",

      goal,

      memberId,

      membershipAssigned: false,

      membershipStatus: "pending",

      plan: null,

      amountPaid: 0,

      expiryDate: null,

      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), data);

    if (memberId) {
      try {
        const { updateMember } = await import("../firebase/service");
        await updateMember(memberId, { uid: cred.user.uid });
      } catch (err) {
        console.error("Member link error:", err);
      }
    }

    setProfile(data);
    setRole("member");

    return cred;
  };
  /* ─────────────────────────────────────────────
   GOOGLE MEMBER LOGIN / SIGNUP
───────────────────────────────────────────── */
  const googleMemberLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    const normalizedEmail = user.email.toLowerCase();

    // Check existing profile
    const userRef = doc(db, "users", user.uid);
    const existing = await getDoc(userRef);

    // Link existing gym member record
    let memberId = null;

    try {
      const mSnap = await getDocs(
        query(collection(db, "members"), where("email", "==", normalizedEmail)),
      );

      if (!mSnap.empty) {
        memberId = mSnap.docs[0].id;
      }
    } catch (err) {
      console.warn("Member lookup failed:", err);
    }

    // Create user only if not exists
    if (!existing.exists()) {
      const data = {
  uid: user.uid,
  name: user.displayName || "Member",

  email: normalizedEmail,

  photo: user.photoURL || "",

  role: "member",

  goal: "General Fitness",

  memberId,

  membershipAssigned: false,

  membershipStatus: "pending",

  plan: null,

  amountPaid: 0,

  expiryDate: null,

  createdAt: serverTimestamp(),
};

      await setDoc(userRef, data);

      // Back-link uid into members collection
      if (memberId) {
        try {
          const { updateMember } = await import("../firebase/service");

          await updateMember(memberId, {
            uid: user.uid,
          });
        } catch (err) {
          console.error("Member link error:", err);
        }
      }

      setProfile(data);
      setRole("member");
    } else {
      const data = existing.data();
      setProfile(data);
      setRole(data.role || "member");
    }

    return result;
  };
  /* ─────────────────────────────────────────────
     LOGOUT
  ───────────────────────────────────────────── */
  const logout = async () => {
    setUser(null);
    setProfile(null);
    setRole(null);
    await signOut(auth);
  };

  /* ─────────────────────────────────────────────
     MEMOIZED CONTEXT VALUE (IMPORTANT FIX)
───────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      loading,

      loginAdmin,
      signupAdmin,
      loginMember,
      signupMember,
      googleMemberLogin,
      logout,

      isAdmin: role === "admin",
      isMember: role === "member",
    }),
    [user, profile, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─────────────────────────────────────────────
   HOOK
───────────────────────────────────────────── */
export const useAuth = () => useContext(AuthContext);
