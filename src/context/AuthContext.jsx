// // // // / export const useAuth = () => useContext(AuthContext);
// // // import React, {
// // //   createContext,
// // //   useContext,
// // //   useEffect,
// // //   useState,
// // //   useMemo,
// // // } from "react";

// // // import {
// // //   onAuthStateChanged,
// // //   signInWithEmailAndPassword,
// // //   createUserWithEmailAndPassword,
// // //   updateProfile,
// // //   signOut,
// // //   signInWithPopup,
// // // } from "firebase/auth";
// // // import { auth, googleProvider } from "../firebase/config";
// // // import {
// // //   doc,
// // //   getDoc,
// // //   setDoc,
// // //   collection,
// // //   query,
// // //   where,
// // //   getDocs,
// // //   serverTimestamp,
// // // } from "firebase/firestore";

// // // import { db } from "../firebase/config";

// // // const AuthContext = createContext();

// // // /* ─────────────────────────────────────────────
// // //    PROVIDER
// // // ───────────────────────────────────────────── */
// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null);
// // //   const [profile, setProfile] = useState(null);
// // //   const [role, setRole] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   /* ─────────────────────────────────────────────
// // //      LOAD PROFILE
// // //   ───────────────────────────────────────────── */
// // //   async function loadProfile(u) {
// // //     try {
// // //       const snap = await getDoc(doc(db, "users", u.uid));

// // //       if (snap.exists()) {
// // //         const data = snap.data();
// // //         setProfile(data);
// // //         setRole(data.role || "member");
// // //       } else {
// // //         setProfile(null);
// // //         setRole("member");
// // //       }
// // //     } catch (err) {
// // //       console.error("Profile load error:", err);
// // //       setProfile(null);
// // //       setRole("member");
// // //     }
// // //   }

// // //   /* ─────────────────────────────────────────────
// // //      AUTH LISTENER
// // //   ───────────────────────────────────────────── */
// // //   useEffect(() => {
// // //     let mounted = true;

// // //     const unsub = onAuthStateChanged(auth, async (u) => {
// // //       if (!mounted) return;

// // //       try {
// // //         if (u) {
// // //           setUser(u);
// // //           await loadProfile(u);
// // //         } else {
// // //           setUser(null);
// // //           setProfile(null);
// // //           setRole(null);
// // //         }
// // //       } finally {
// // //         if (mounted) setLoading(false);
// // //       }
// // //     });

// // //     return () => {
// // //       mounted = false;
// // //       unsub();
// // //     };
// // //   }, []);

// // //   /* ─────────────────────────────────────────────
// // //      ADMIN LOGIN
// // //   ───────────────────────────────────────────── */
// // //   const loginAdmin = (email, password) =>
// // //     signInWithEmailAndPassword(auth, email, password);

// // //   /* ─────────────────────────────────────────────
// // //      ADMIN SIGNUP
// // //   ───────────────────────────────────────────── */
// // //   const signupAdmin = async (email, password, name) => {
// // //     const cred = await createUserWithEmailAndPassword(auth, email, password);

// // //     await updateProfile(cred.user, { displayName: name });

// // //     const data = {
// // //       uid: cred.user.uid,
// // //       name,
// // //       email: email.toLowerCase(),
// // //       role: "admin",
// // //       createdAt: serverTimestamp(),
// // //     };

// // //     await setDoc(doc(db, "users", cred.user.uid), data);

// // //     setProfile(data);
// // //     setRole("admin");

// // //     return cred;
// // //   };

// // //   /* ─────────────────────────────────────────────
// // //      MEMBER LOGIN
// // //   ───────────────────────────────────────────── */
// // //   const loginMember = (email, password) =>
// // //     signInWithEmailAndPassword(auth, email, password);

// // //   /* ─────────────────────────────────────────────
// // //      MEMBER SIGNUP
// // //   ───────────────────────────────────────────── */
// // //   const signupMember = async (
// // //     email,
// // //     password,
// // //     name,
// // //     goal = "General Fitness",
// // //   ) => {
// // //     const normalizedEmail = email.toLowerCase();

// // //     const cred = await createUserWithEmailAndPassword(
// // //       auth,
// // //       normalizedEmail,
// // //       password,
// // //     );

// // //     await updateProfile(cred.user, { displayName: name });

// // //     let memberId = null;

// // //     try {
// // //       const mSnap = await getDocs(
// // //         query(collection(db, "members"), where("email", "==", normalizedEmail)),
// // //       );

// // //       if (!mSnap.empty) memberId = mSnap.docs[0].id;
// // //     } catch (err) {
// // //       console.warn("Member lookup failed:", err);
// // //     }

// // //     const data = {
// // //       uid: cred.user.uid,
// // //       name,
// // //       email: normalizedEmail,
// // //       role: "member",
// // //       goal,
// // //       memberId,
// // //       createdAt: serverTimestamp(),
// // //     };

// // //     await setDoc(doc(db, "users", cred.user.uid), data);

// // //     if (memberId) {
// // //       try {
// // //         const { updateMember } = await import("../firebase/service");
// // //         await updateMember(memberId, { uid: cred.user.uid });
// // //       } catch (err) {
// // //         console.error("Member link error:", err);
// // //       }
// // //     }

// // //     setProfile(data);
// // //     setRole("member");

// // //     return cred;
// // //   };
// // //   /* ─────────────────────────────────────────────
// // //    GOOGLE MEMBER LOGIN / SIGNUP
// // // ───────────────────────────────────────────── */
// // //   const googleMemberLogin = async () => {
// // //     const result = await signInWithPopup(auth, googleProvider);

// // //     const user = result.user;

// // //     const normalizedEmail = user.email.toLowerCase();

// // //     // Check existing profile
// // //     const userRef = doc(db, "users", user.uid);
// // //     const existing = await getDoc(userRef);

// // //     // Link existing gym member record
// // //     let memberId = null;

// // //     try {
// // //       const mSnap = await getDocs(
// // //         query(collection(db, "members"), where("email", "==", normalizedEmail)),
// // //       );

// // //       if (!mSnap.empty) {
// // //         memberId = mSnap.docs[0].id;
// // //       }
// // //     } catch (err) {
// // //       console.warn("Member lookup failed:", err);
// // //     }

// // //     // Create user only if not exists
// // //     if (!existing.exists()) {
// // //       const data = {
// // //         uid: user.uid,
// // //         name: user.displayName || "Member",
// // //         email: normalizedEmail,
// // //         photo: user.photoURL || "",
// // //         role: "member",
// // //         goal: "General Fitness",
// // //         memberId,
// // //         createdAt: serverTimestamp(),
// // //       };

// // //       await setDoc(userRef, data);

// // //       // Back-link uid into members collection
// // //       if (memberId) {
// // //         try {
// // //           const { updateMember } = await import("../firebase/service");

// // //           await updateMember(memberId, {
// // //             uid: user.uid,
// // //           });
// // //         } catch (err) {
// // //           console.error("Member link error:", err);
// // //         }
// // //       }

// // //       setProfile(data);
// // //       setRole("member");
// // //     } else {
// // //       const data = existing.data();
// // //       setProfile(data);
// // //       setRole(data.role || "member");
// // //     }

// // //     return result;
// // //   };
// // //   /* ─────────────────────────────────────────────
// // //      LOGOUT
// // //   ───────────────────────────────────────────── */
// // //   const logout = async () => {
// // //     setUser(null);
// // //     setProfile(null);
// // //     setRole(null);
// // //     await signOut(auth);
// // //   };

// // //   /* ─────────────────────────────────────────────
// // //      MEMOIZED CONTEXT VALUE (IMPORTANT FIX)
// // // ───────────────────────────────────────────── */
// // //   const value = useMemo(
// // //     () => ({
// // //       user,
// // //       profile,
// // //       role,
// // //       loading,

// // //       loginAdmin,
// // //       signupAdmin,
// // //       loginMember,
// // //       signupMember,
// // //       googleMemberLogin,
// // //       logout,

// // //       isAdmin: role === "admin",
// // //       isMember: role === "member",
// // //     }),
// // //     [user, profile, role, loading],
// // //   );

// // //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // // }

// // // /* ─────────────────────────────────────────────
// // //    HOOK
// // // ───────────────────────────────────────────── */
// // // export const useAuth = () => useContext(AuthContext);
// // // // / export const useAuth = () => useContext(AuthContext);
// // import React, {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useState,
// //   useMemo,
// // } from "react";

// // import {
// //   onAuthStateChanged,
// //   signInWithEmailAndPassword,
// //   createUserWithEmailAndPassword,
// //   updateProfile,
// //   signOut,
// //   signInWithPopup,
// // } from "firebase/auth";
// // import { auth, googleProvider } from "../firebase/config";
// // import {
// //   doc,
// //   getDoc,
// //   setDoc,
// //   collection,
// //   query,
// //   where,
// //   getDocs,
// //   serverTimestamp,
// // } from "firebase/firestore";

// // import { db } from "../firebase/config";

// // const AuthContext = createContext();

// // /* ─────────────────────────────────────────────
// //    PROVIDER
// // ───────────────────────────────────────────── */
// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [profile, setProfile] = useState(null);
// //   const [role, setRole] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   /* ─────────────────────────────────────────────
// //      LOAD PROFILE
// //   ───────────────────────────────────────────── */
// //   async function loadProfile(u) {
// //     try {
// //       const snap = await getDoc(doc(db, "users", u.uid));

// //       if (snap.exists()) {
// //         const data = snap.data();
// //         setProfile(data);
// //         setRole(data.role || "member");
// //       } else {
// //         setProfile(null);
// //         setRole("member");
// //       }
// //     } catch (err) {
// //       console.error("Profile load error:", err);
// //       setProfile(null);
// //       setRole("member");
// //     }
// //   }

// //   /* ─────────────────────────────────────────────
// //      AUTH LISTENER
// //   ───────────────────────────────────────────── */
// //   useEffect(() => {
// //     let mounted = true;

// //     const unsub = onAuthStateChanged(auth, async (u) => {
// //       if (!mounted) return;

// //       try {
// //         if (u) {
// //           setUser(u);
// //           await loadProfile(u);
// //         } else {
// //           setUser(null);
// //           setProfile(null);
// //           setRole(null);
// //         }
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     });

// //     return () => {
// //       mounted = false;
// //       unsub();
// //     };
// //   }, []);

// //   /* ─────────────────────────────────────────────
// //      ADMIN LOGIN
// //   ───────────────────────────────────────────── */
// //   const loginAdmin = (email, password) =>
// //     signInWithEmailAndPassword(auth, email, password);

// //   /* ─────────────────────────────────────────────
// //      ADMIN SIGNUP
// //   ───────────────────────────────────────────── */
// //   const signupAdmin = async (email, password, name) => {
// //     const cred = await createUserWithEmailAndPassword(auth, email, password);

// //     await updateProfile(cred.user, { displayName: name });

// //     const data = {
// //       uid: cred.user.uid,
// //       name,
// //       email: email.toLowerCase(),
// //       role: "admin",
// //       createdAt: serverTimestamp(),
// //     };

// //     await setDoc(doc(db, "users", cred.user.uid), data);

// //     setProfile(data);
// //     setRole("admin");

// //     return cred;
// //   };

// //   /* ─────────────────────────────────────────────
// //      MEMBER LOGIN
// //   ───────────────────────────────────────────── */
// //   const loginMember = (email, password) =>
// //     signInWithEmailAndPassword(auth, email, password);

// //   /* ─────────────────────────────────────────────
// //      MEMBER SIGNUP
// //   ───────────────────────────────────────────── */
// //   const signupMember = async (
// //     email,
// //     password,
// //     name,
// //     goal = "General Fitness",
// //   ) => {
// //     const normalizedEmail = email.toLowerCase();

// //     const cred = await createUserWithEmailAndPassword(
// //       auth,
// //       normalizedEmail,
// //       password,
// //     );

// //     await updateProfile(cred.user, { displayName: name });

// //     let memberId = null;

// //     try {
// //       const mSnap = await getDocs(
// //         query(collection(db, "members"), where("email", "==", normalizedEmail)),
// //       );

// //       if (!mSnap.empty) memberId = mSnap.docs[0].id;
// //     } catch (err) {
// //       console.warn("Member lookup failed:", err);
// //     }

// //     // const data = {
// //     //   uid: cred.user.uid,
// //     //   name,
// //     //   email: normalizedEmail,
// //     //   role: "member",
// //     //   goal,
// //     //   memberId,
// //     //   createdAt: serverTimestamp(),
// //     // };
// //     const data = {
// //       uid: cred.user.uid,
// //       name,
// //       email: normalizedEmail,

// //       role: "member",

// //       goal,

// //       memberId,

// //       membershipAssigned: false,

// //       membershipStatus: "pending",

// //       plan: null,

// //       amountPaid: 0,

// //       expiryDate: null,

// //       createdAt: serverTimestamp(),
// //     };
// //     await setDoc(doc(db, "users", cred.user.uid), data);

// //     if (memberId) {
// //       try {
// //         const { updateMember } = await import("../firebase/service");
// //         await updateMember(memberId, { uid: cred.user.uid });
// //       } catch (err) {
// //         console.error("Member link error:", err);
// //       }
// //     }

// //     setProfile(data);
// //     setRole("member");

// //     return cred;
// //   };
// //   /* ─────────────────────────────────────────────
// //    GOOGLE MEMBER LOGIN / SIGNUP
// // ───────────────────────────────────────────── */
// //   const googleMemberLogin = async () => {
// //     const result = await signInWithPopup(auth, googleProvider);

// //     const user = result.user;

// //     const normalizedEmail = user.email.toLowerCase();

// //     // Check existing profile
// //     const userRef = doc(db, "users", user.uid);
// //     const existing = await getDoc(userRef);

// //     // Link existing gym member record
// //     let memberId = null;

// //     try {
// //       const mSnap = await getDocs(
// //         query(collection(db, "members"), where("email", "==", normalizedEmail)),
// //       );

// //       if (!mSnap.empty) {
// //         memberId = mSnap.docs[0].id;
// //       }
// //     } catch (err) {
// //       console.warn("Member lookup failed:", err);
// //     }

// //     // Create user only if not exists
// //     if (!existing.exists()) {
// //       const data = {
// //   uid: user.uid,
// //   name: user.displayName || "Member",

// //   email: normalizedEmail,

// //   photo: user.photoURL || "",

// //   role: "member",

// //   goal: "General Fitness",

// //   memberId,

// //   membershipAssigned: false,

// //   membershipStatus: "pending",

// //   plan: null,

// //   amountPaid: 0,

// //   expiryDate: null,

// //   createdAt: serverTimestamp(),
// // };

// //       await setDoc(userRef, data);

// //       // Back-link uid into members collection
// //       if (memberId) {
// //         try {
// //           const { updateMember } = await import("../firebase/service");

// //           await updateMember(memberId, {
// //             uid: user.uid,
// //           });
// //         } catch (err) {
// //           console.error("Member link error:", err);
// //         }
// //       }

// //       setProfile(data);
// //       setRole("member");
// //     } else {
// //       const data = existing.data();
// //       setProfile(data);
// //       setRole(data.role || "member");
// //     }

// //     return result;
// //   };
// //   /* ─────────────────────────────────────────────
// //      LOGOUT
// //   ───────────────────────────────────────────── */
// //   const logout = async () => {
// //     setUser(null);
// //     setProfile(null);
// //     setRole(null);
// //     await signOut(auth);
// //   };

// //   /* ─────────────────────────────────────────────
// //      MEMOIZED CONTEXT VALUE (IMPORTANT FIX)
// // ───────────────────────────────────────────── */
// //   const value = useMemo(
// //     () => ({
// //       user,
// //       profile,
// //       role,
// //       loading,

// //       loginAdmin,
// //       signupAdmin,
// //       loginMember,
// //       signupMember,
// //       googleMemberLogin,
// //       logout,

// //       isAdmin: role === "admin",
// //       isMember: role === "member",
// //     }),
// //     [user, profile, role, loading],
// //   );

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // /* ─────────────────────────────────────────────
// //    HOOK
// // ───────────────────────────────────────────── */
// // export const useAuth = () => useContext(AuthContext);


// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { recordPaymentAndActivate } from "../../firebase/service";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// import {
//   format,
//   addDays,
//   subDays,
//   parseISO,
//   isWithinInterval,
//   startOfDay,
//   endOfDay,
//   addMonths,
// } from "date-fns";

// import toast from "react-hot-toast";

// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   addDoc,
//   limit,
//   serverTimestamp,
// } from "firebase/firestore";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../../firebase/config";

// import {
//   getAllMembers,
//   getPayments,
//   getAttendance,
//   addNotification,
// } from "../../firebase/service";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [members, setMembers] = useState([]);
//   const [signups, setSignups] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [attendance, setAttendance] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [visible, setVisible] = useState(false);
//   const [selectedPlans, setSelectedPlans] = useState({});
//   // FILTER
//   // const [expiryFilter, setExpiryFilter] = useState("week");
//   const [expiryFilter, setExpiryFilter] = useState("3months");
// const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
//   const now = new Date();

//   const today = format(now, "yyyy-MM-dd");
//   const thisMonth = format(now, "yyyy-MM");
//    // =========================
//   // FETCH DATA
//   // =========================
//   useEffect(() => {
//     let mounted = true;

//     async function fetchAll() {
//       try {
//         const [m, p, a] = await Promise.all([
//           getAllMembers(),
//           getPayments(),
//           getAttendance(),
//         ]);

//         if (!mounted) return;

//         setMembers(Array.isArray(m) ? m : []);
//         setPayments(Array.isArray(p) ? p : []);
//         setAttendance(Array.isArray(a) ? a : []);

//         const usersSnap = await getDocs(
//           query(
//             collection(db, "users"),
//             where("role", "==", "member"),
//             orderBy("createdAt", "desc"),
//             limit(20),
//           ),
//         );

//         const allUsers = usersSnap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//         }));

//         if (!mounted) return;

//         setSignups(allUsers);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load dashboard");
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchAll();

//     const timer = setTimeout(() => {
//       if (mounted) {
//         setVisible(true);
//       }
//     }, 60);

//     return () => {
//       mounted = false;
//       clearTimeout(timer);
//     };
//   }, []);

//   // =========================
//   // MEMBER MAP
//   // =========================
//   const memberMap = useMemo(() => {
//     return new Map(
//       members.map((m) => [(m.email || "").trim().toLowerCase(), m]),
//     );
//   }, [members]);

//   // =========================
//   // ACTIVE MEMBERS
//   // =========================
//   const activeMembers = useMemo(() => {
//     return members.filter((m) => m.status === "active");
//   }, [members]);

//   // =========================
//   // EXPIRED MEMBERS
//   // =========================
//   const expiredMembers = useMemo(() => {
//     return members.filter((m) => {
//       if (!m.expiryDate) return false;

//       try {
//         const exp = parseISO(m.expiryDate);

//         return exp < startOfDay(now);
//       } catch {
//         return false;
//       }
//     });
//   }, [members, now]);

//   // =========================
//   // EXPIRING FILTER
//   // =========================
//   // const expiringMembers = useMemo(() => {
//   //   const today = new Date();

//   //   const todayStr = format(today, "yyyy-MM-dd");

//   //   let futureDate = new Date();

//   //   switch (expiryFilter) {
//   //     case "today":
//   //       futureDate = today;
//   //       break;

//   //     case "week":
//   //       futureDate.setDate(futureDate.getDate() + 7);
//   //       break;

//   //     case "month":
//   //       futureDate.setMonth(futureDate.getMonth() + 1);
//   //       break;

//   //     case "3months":
//   //       futureDate.setMonth(futureDate.getMonth() + 3);
//   //       break;

//   //     default:
//   //       futureDate.setDate(futureDate.getDate() + 7);
//   //   }

//   //   const futureStr = format(futureDate, "yyyy-MM-dd");

//   //   return members.filter((m) => {
//   //     if (!m.expiryDate) return false;

//   //     if ((m.status || "").toLowerCase() !== "active") {
//   //       return false;
//   //     }

//   //     // STRING COMPARISON
//   //     return m.expiryDate >= todayStr && m.expiryDate <= futureStr;
//   //   });
//   // }, [members, expiryFilter]);
//   const expiringMembers = useMemo(() => {
//     const now = new Date();

//     let futureDate = new Date();

//     switch (expiryFilter) {
//       case "today":
//         futureDate = now;
//         break;

//       case "week":
//         futureDate = addDays(now, 7);
//         break;

//       case "month":
//         futureDate = addMonths(now, 1);
//         break;

//       case "3months":
//         futureDate = addMonths(now, 3);
//         break;

//       default:
//         futureDate = addDays(now, 7);
//     }

//     return members.filter((m) => {
//       if (!m.expiryDate) return false;
//       if ((m.status || "").toLowerCase() !== "active") return false;

//       const exp = parseISO(m.expiryDate);

//       return isWithinInterval(exp, {
//         start: startOfDay(now),
//         end: endOfDay(futureDate),
//       });
//     });
//   }, [members, expiryFilter]);
//   // =========================
//   // TODAY CHECKINS
//   // =========================
//   const todayCheckins = useMemo(() => {
//     return attendance.filter((a) => a.date === today).length;
//   }, [attendance, today]);

//   // =========================
//   // MONTH REVENUE
//   // =========================
//   const monthRevenue = useMemo(() => {
//     return payments
//       .filter((p) => p.date?.startsWith(thisMonth))
//       .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
//   }, [payments, thisMonth]);

//   // =========================
//   // REVENUE FORMAT
//   // =========================
//   const revenueDisplay =
//     monthRevenue >= 100000
//       ? `₹${(monthRevenue / 100000).toFixed(1)}L`
//       : monthRevenue >= 1000
//         ? `₹${(monthRevenue / 1000).toFixed(1)}k`
//         : `₹${monthRevenue}`;

//   // =========================
//   // ATTENDANCE MAP
//   // =========================
//   const attendanceMap = useMemo(() => {
//     const map = {};

//     attendance.forEach((a) => {
//       map[a.date] = (map[a.date] || 0) + 1;
//     });

//     return map;
//   }, [attendance]);

//   // =========================
//   // WEEK DATA
//   // =========================
//   const weekDays = useMemo(() => {
//     return Array.from({ length: 7 }, (_, i) => {
//       const d = subDays(now, 6 - i);

//       const dateKey = format(d, "yyyy-MM-dd");

//       return {
//         day: format(d, "EEE"),
//         checkins: attendanceMap[dateKey] || 0,
//       };
//     });
//   }, [attendanceMap, now]);

//   // =========================
//   // EMAIL SET
//   // =========================
//   const memberEmails = useMemo(() => {
//     return new Set(members.map((m) => (m.email || "").trim().toLowerCase()));
//   }, [members]);

//   // =========================
//   // NEW SIGNUPS
//   // =========================
//   const newAppSignups = useMemo(() => {
//     return signups.filter(
//       (u) => u.email && !memberEmails.has(u.email.trim().toLowerCase()),
//     );
//   }, [signups, memberEmails]);

//   const handleAssignPlan = (user) => {
//   const plan = selectedPlans[user.id];

//   if (!plan) return toast.error("Select a plan first");

//   navigate("/add-member", {
//     state: {
//       prefill: {
//         name: user.name,
//         email: user.email,
//         phone: user.phone || "",
//         plan,
//       },
//     },
//   });
// };
// // =====================
//   // STATS
//   // =========================
//   const dateFilteredPayments = useMemo(() => {
//   return payments.filter((p) => p.date === selectedDate);
// }, [payments, selectedDate]);

// const todaysNewMemberships = useMemo(() => {
//   return members.filter((m) => {
//     const createdDate =
//       m.createdAt?.toDate?.()
//         ? format(m.createdAt.toDate(), "yyyy-MM-dd")
//         : m.createdAt?.seconds
//         ? format(new Date(m.createdAt.seconds * 1000), "yyyy-MM-dd")
//         : m.joinDate || m.date || "";

//     return createdDate === selectedDate;
//   });
// }, [members, selectedDate]);

// const todaysRenewals = useMemo(() => {
//   return payments.filter((p) => {
//     const isSameDate = p.date === selectedDate;

//     const isRenewal =
//       p.type === "renewal" ||
//       p.paymentType === "renewal" ||
//       p.category === "Renewal" ||
//       p.description?.toLowerCase().includes("renew");

//     return isSameDate && isRenewal;
//   });
// }, [payments, selectedDate]);

// const selectedDateRevenue = useMemo(() => {
//   return dateFilteredPayments.reduce(
//     (sum, p) => sum + (Number(p.amount) || 0),
//     0,
//   );
// }, [dateFilteredPayments]);
//   const stats = [
//     {
//       label: "Total Members",
//       value: members.length,
//       sub: `${activeMembers.length} active`,
//       cls: "s-gold",
//       val: "c-gold",
//     },

//     {
//       label: "App Signups",
//       value: newAppSignups.length,
//       sub: "Pending conversions",
//       cls: "s-green",
//       val: "c-green",
//     },

//     {
//       label: "Today Check-ins",
//       value: todayCheckins,
//       sub: "Live attendance",
//       cls: "s-gold",
//       val: "c-gold",
//     },

//     {
//       label: "Monthly Revenue",
//       value: revenueDisplay,
//       sub: "This month",
//       cls: "s-red",
//       val: "c-red",
//     },
//     {
//   label: "Selected Date Revenue",
//   value: `₹${selectedDateRevenue.toLocaleString()}`,
//   sub: selectedDate,
//   cls: "s-green",
//   val: "c-green",
// },
//   ];

//   // =========================
//   // ANIMATION
//   // =========================
//   const anim = (delay) => ({
//     opacity: visible ? 1 : 0,

//     transform: visible
//       ? "translateY(0) scale(1)"
//       : "translateY(16px) scale(0.96)",

//     transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
//   });

//   const tooltipStyle = {
//     background: "#141414",
//     border: "1px solid #2a2a2a",
//     borderRadius: 8,
//     fontSize: 12,
//     fontFamily: "'Exo 2',sans-serif",
//   };

//   return (
//     <div className="page-enter">
//       {/* TOPBAR */}
//       <div className="topbar">
//         <div className="page-title">Dashboard</div>

//         <div className="topbar-right">
//           <input
//   type="date"
//   className="form-input"
//   style={{ width: 150, fontSize: 12, padding: "8px 10px" }}
//   value={selectedDate}
//   onChange={(e) => setSelectedDate(e.target.value)}
// />

//           <button
//             className="btn btn-primary btn-sm tap-scale btn-ripple"
//             onClick={() => navigate("/add-member")}
//           >
//             + Add Member
//           </button>
//         </div>
//       </div>

//       <div className="page-body">
//         {/* STATS */}
//         <div className="stats-grid mb-20">
//           {stats.map((s, i) => (
//             <div
//               key={i}
//               className={`stat-card ${s.cls}`}
//               style={anim(i * 0.07)}
//             >
//               <div className="stat-label">{s.label}</div>

//               <div className={`stat-value ${s.val}`}>
//                 {loading ? "—" : s.value}
//               </div>

//               <div className="stat-sub">{s.sub}</div>
//             </div>
//           ))}
//         </div>
//         <div className="grid-2 mb-20">
//   <div className="card" style={anim(0.18)}>
//     <div className="card-title">
//       🆕 New Memberships ({todaysNewMemberships.length})
//     </div>

//     {todaysNewMemberships.length === 0 ? (
//       <div style={{ color: "var(--muted2)", fontSize: 13 }}>
//         No new memberships on this date
//       </div>
//     ) : (
//       todaysNewMemberships.map((m) => (
//         <div key={m.id} className="activity-item">
//           <div className="activity-dot green" />
//           <div>
//             <div className="activity-text">
//               <strong>{m.name || "Unnamed"}</strong> joined
//             </div>
//             <div className="activity-time">
//               {m.plan || "No plan"} · ₹{Number(m.amountPaid || 0).toLocaleString()}
//             </div>
//           </div>
//         </div>
//       ))
//     )}
//   </div>

//   <div className="card" style={anim(0.22)}>
//     <div className="card-title">
//       🔁 Renewed Memberships ({todaysRenewals.length})
//     </div>

//     {todaysRenewals.length === 0 ? (
//       <div style={{ color: "var(--muted2)", fontSize: 13 }}>
//         No renewals on this date
//       </div>
//     ) : (
//       todaysRenewals.map((p) => (
//         <div key={p.id} className="activity-item">
//           <div className="activity-dot gold" />
//           <div>
//             <div className="activity-text">
//               <strong>{p.memberName || "Member"}</strong> renewed
//             </div>
//             <div className="activity-time">
//               ₹{Number(p.amount || 0).toLocaleString()} · {p.method || "Cash"}
//             </div>
//           </div>
//         </div>
//       ))
//     )}
//   </div>
// </div>

//         {/* CHARTS */}
//         <div className="grid-2 mb-20">
//           {/* ATTENDANCE */}
//           <div className="card" style={anim(0.28)}>
//             <div className="card-title">Weekly Attendance</div>

//             <ResponsiveContainer width="100%" height={140}>
//               <BarChart
//                 data={weekDays}
//                 margin={{
//                   top: 0,
//                   right: 0,
//                   left: -30,
//                   bottom: 0,
//                 }}
//               >
//                 <XAxis
//                   dataKey="day"
//                   tick={{
//                     fill: "#666",
//                     fontSize: 11,
//                   }}
//                   axisLine={false}
//                   tickLine={false}
//                 />

//                 <YAxis
//                   tick={{
//                     fill: "#666",
//                     fontSize: 11,
//                   }}
//                   axisLine={false}
//                   tickLine={false}
//                 />

//                 <Tooltip contentStyle={tooltipStyle} />

//                 <Bar dataKey="checkins" radius={[4, 4, 0, 0]}>
//                   {weekDays.map((_, i) => (
//                     <Cell key={i} fill={i === 6 ? "#f5c842" : "#c9a227"} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* PAYMENTS */}
//           <div className="card" style={anim(0.32)}>
//             <div className="card-title">Recent Payments</div>

//             {payments.length === 0 ? (
//               <div
//                 style={{
//                   color: "var(--muted2)",
//                   fontSize: 13,
//                   padding: "20px 0",
//                   textAlign: "center",
//                 }}
//               >
//                 No payments yet
//               </div>
//             ) : (
//               payments.slice(0, 5).map((p) => (
//                 <div key={p.id} className="activity-item">
//                   <div className="activity-dot green" />

//                   <div>
//                     <div className="activity-text">
//                       ₹{Number(p.amount).toLocaleString()} —{" "}
//                       <strong>{p.memberName}</strong>
//                     </div>

//                     <div className="activity-time">
//                       {p.date} · {p.method}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//         {/* PENDING CONVERSIONS */}
//         <div className="card mb-20" style={anim(0.22)}>
//           <div className="card-title">
//             📲 Pending Memberships ({newAppSignups.length})
//           </div>

//           {newAppSignups.length === 0 ? (
//             <div style={{ color: "var(--muted2)", fontSize: 13 }}>
//               No pending signups
//             </div>
//           ) : (
//             newAppSignups.slice(0, 6).map((u) => (
//               <div
//                 key={u.id}
//                 className="activity-item"
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   gap: 10,
//                 }}
//               >
//                 {/* LEFT */}
//                 <div>
//                   <div className="activity-text">{u.name || "No Name"}</div>
//                   <div className="activity-time">{u.email}</div>
//                 </div>

//                 {/* RIGHT CONTROLS */}
//                 <div style={{ display: "flex", gap: 8 }}>
//                   {/* PLAN SELECT */}
//                   {/* <select
//             className="btn btn-outline btn-sm"
//             value={selectedPlans[u.id] || ""}
//             onChange={(e) =>
//               setSelectedPlans((prev) => ({
//                 ...prev,
//                 [u.id]: e.target.value,
//               }))
//             }
//           > */}
//                   <select
//                     className="plan-select"
//                     value={selectedPlans[u.id] || ""}
//                     onChange={(e) =>
//                       setSelectedPlans((prev) => ({
//                         ...prev,
//                         [u.id]: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="">Plan</option>
//                     <option value="Monthly">Monthly</option>
//                     <option value="Quarterly">Quarterly</option>
//                     <option value="Yearly">Yearly</option>
//                   </select>

//                   {/* ASSIGN BUTTON */}
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() => handleAssignPlan(u)}
//                   >
//                     Assign
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         {/* EXPIRING MEMBERS */}
//         <div className="section-header mb-12" style={anim(0.4)}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//               flexWrap: "wrap",
//             }}
//           >
//             <div className="section-title">
//               ⚠ Membership Expiry ({expiringMembers.length})
//             </div>

//             {/* FILTERS */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: 8,
//                 flexWrap: "wrap",
//               }}
//             >
//               {[
//                 {
//                   key: "today",
//                   label: "Today",
//                 },

//                 {
//                   key: "week",
//                   label: "7 Days",
//                 },

//                 {
//                   key: "month",
//                   label: "1 Month",
//                 },

//                 {
//                   key: "3months",
//                   label: "3 Months",
//                 },
//               ].map((f) => (
//                 <button
//                   key={f.key}
//                   className={`btn btn-sm ${
//                     expiryFilter === f.key ? "btn-primary" : "btn-outline"
//                   }`}
//                   onClick={() => setExpiryFilter(f.key)}
//                 >
//                   {f.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               alignItems: "center",
//             }}
//           >
//             {/* EXPIRED COUNT */}
//             <div
//               style={{
//                 fontSize: 12,
//                 color: "var(--red)",
//                 fontWeight: 600,
//               }}
//             >
//               {expiredMembers.length} expired
//             </div>

//             {/* REMIND ALL */}
//             {expiringMembers.length > 0 && (
//               <button
//                 className="btn btn-outline btn-sm tap-scale"
//                 onClick={async () => {
//                   try {
//                     for (const m of expiringMembers) {
//                       await addNotification({
//                         memberId: m.id,
//                         memberEmail: m.email,
//                         title: "Membership Expiry",
//                         message: `Hi ${m.name}! Your membership expires on ${m.expiryDate}. Renew now 💪`,
//                         read: false,
//                         createdAt: serverTimestamp(),
//                       });
//                     }

//                     toast.success("Reminders sent!");
//                   } catch (err) {
//                     console.error(err);

//                     toast.error("Failed to send reminders");
//                   }
//                 }}
//               >
//                 📱 Remind All
//               </button>
//             )}
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="table-wrap" style={anim(0.45)}>
//           <table>
//             <thead>
//               <tr>
//                 <th>Member</th>
//                 <th>Plan</th>
//                 <th>Expiry</th>
//                 <th>Status</th>
//                 <th>Email</th>
//                 <th></th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     style={{
//                       textAlign: "center",
//                       padding: 24,
//                     }}
//                   >
//                     Loading...
//                   </td>
//                 </tr>
//               ) : expiringMembers.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     style={{
//                       textAlign: "center",

//                       padding: 24,

//                       color: "var(--muted2)",
//                     }}
//                   >
//                     No expiring memberships found
//                   </td>
//                 </tr>
//               ) : (
//                 expiringMembers.map((m) => (
//                   <tr key={m.id}>
//                     <td>
//                       <strong>{m.name}</strong>
//                     </td>

//                     <td>{m.plan}</td>

//                     <td
//                       style={{
//                         color: "var(--red)",
//                         fontWeight: 600,
//                       }}
//                     >
//                       {m.expiryDate}
//                     </td>

//                     <td>
//                       <span className="badge badge-green">{m.status}</span>
//                     </td>

//                     <td
//                       style={{
//                         fontSize: 12,
//                         color: "var(--muted2)",
//                       }}
//                     >
//                       {m.email || "—"}
//                     </td>

//                     <td>
//                       <button
//                         className="btn btn-primary btn-sm"
//                         onClick={() => navigate(`/members/${m.id}/edit`)}
//                       >
//                         Renew
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* FAB */}
//       <button
//         className="fab tap-scale btn-ripple"
//         onClick={() => navigate("/add-member")}
//       >
//         +
//       </button>
//     </div>
//   );
// }
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

    // await updateMember(memberId, {
    //   uid: firebaseUser.uid,
    //   authUid: firebaseUser.uid,
    //   email: cleanEmail || memberData.email || "",
    //   phone: cleanPhone,
    //   appActivated: true,
    // });
// await updateMember(memberId, {
//   uid: firebaseUser.uid,
//   authUid: firebaseUser.uid,
//   email: cleanEmail,
//   appActivated: true,
// });
await updateMember(memberId, {
  uid: firebaseUser.uid,
  authUid: firebaseUser.uid,
  email: cleanEmail,
  appActivated: true,
});
    setUser(firebaseUser);
    setProfile(profileData);
    setRole("member");

    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
  // const activateMemberWithGoogle = async (phone) => {
  //   const cleanPhone = normalizePhone(phone);

  //   if (cleanPhone.length !== 10) {
  //     throw new Error("Please enter a valid 10 digit phone number.");
  //   }

  //   const memberSnap = await getDocs(
  //     query(collection(db, "members"), where("phone", "==", cleanPhone)),
  //   );

  //   if (memberSnap.empty) {
  //     throw new Error("This phone number is not registered. Contact gym admin.");
  //   }

  //   const memberDoc = memberSnap.docs[0];
  //   const memberId = memberDoc.id;
  //   const memberData = memberDoc.data();

  //   if (memberData.uid || memberData.authUid || memberData.appActivated) {
  //     throw new Error("This member account is already activated. Please login.");
  //   }

  //   const result = await signInWithPopup(auth, googleProvider);
  //   const firebaseUser = result.user;

  //   const cleanEmail = firebaseUser.email?.trim().toLowerCase() || "";

  //   const profileData = {
  //     uid: firebaseUser.uid,
  //     authUid: firebaseUser.uid,

  //     name: memberData.name || firebaseUser.displayName || "Member",
  //     email: cleanEmail,
  //     phone: cleanPhone,
  //     photo: firebaseUser.photoURL || "",

  //     role: "member",
  //     memberId,

  //     goal: memberData.goal || "General Fitness",
  //     status: memberData.status || "pending",
  //     membershipStatus: memberData.status || "pending",
  //     membershipAssigned: true,

  //     plan: memberData.plan || null,
  //     amountPaid: Number(memberData.amountPaid || 0),
  //     expiryDate: memberData.expiryDate || null,

  //     createdAt: serverTimestamp(),
  //   };

  //   await setDoc(doc(db, "users", firebaseUser.uid), profileData);

  //   await updateMember(memberId, {
  //     uid: firebaseUser.uid,
  //     authUid: firebaseUser.uid,
  //     email: cleanEmail || memberData.email || "",
  //     phone: cleanPhone,
  //     appActivated: true,
  //   });

  //   setUser(firebaseUser);
  //   setProfile(profileData);
  //   setRole("member");

  //   return result;
  // };
// const activateMemberWithGoogle = async (phone) => {
//   const cleanPhone = normalizePhone(phone);

//   if (cleanPhone.length !== 10) {
//     throw new Error("Please enter a valid 10 digit phone number.");
//   }

//   const result = await signInWithPopup(auth, googleProvider);
//   const firebaseUser = result.user;

//   const memberSnap = await getDocs(
//     query(collection(db, "members"), where("phone", "==", cleanPhone)),
//   );

//   if (memberSnap.empty) {
//     await signOut(auth);
//     throw new Error("This phone number is not registered. Contact gym admin.");
//   }

//   const memberDoc = memberSnap.docs[0];
//   const memberId = memberDoc.id;
//   const memberData = memberDoc.data();

//   if (memberData.uid || memberData.authUid || memberData.appActivated) {
//     await signOut(auth);
//     throw new Error("This member account is already activated. Please login.");
//   }

//   const cleanEmail = firebaseUser.email?.trim().toLowerCase() || "";

//   const profileData = {
//     uid: firebaseUser.uid,
//     authUid: firebaseUser.uid,
//     name: memberData.name || firebaseUser.displayName || "Member",
//     email: cleanEmail,
//     phone: cleanPhone,
//     photo: firebaseUser.photoURL || "",
//     role: "member",
//     memberId,
//     goal: memberData.goal || "General Fitness",
//     status: memberData.status || "pending",
//     membershipStatus: memberData.status || "pending",
//     membershipAssigned: true,
//     plan: memberData.plan || null,
//     amountPaid: Number(memberData.amountPaid || 0),
//     expiryDate: memberData.expiryDate || null,
//     createdAt: serverTimestamp(),
//   };

//   await setDoc(doc(db, "users", firebaseUser.uid), profileData);

//   await updateMember(memberId, {
//     uid: firebaseUser.uid,
//     authUid: firebaseUser.uid,
//     email: cleanEmail || memberData.email || "",
//     phone: cleanPhone,
//     appActivated: true,
//   });

//   setUser(firebaseUser);
//   setProfile(profileData);
//   setRole("member");

//   return result;
// };
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