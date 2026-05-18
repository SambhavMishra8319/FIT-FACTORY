import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { differenceInDays, parseISO } from "date-fns";

export const PLAN_LEVELS = {
  free:      0,
  monthly:   1,
  quarterly: 2,
  "6 month": 3,
  annual:    4,
};

export const FEATURE_LEVELS = {
  equipment:   0,  // free
  workout:     1,  // paid
  diet:        1,
  bca:         1,
  steam:       1,
  progress:    1,
  leaderboard: 1,
};

export function useMembership() {
  const { profile, user } = useAuth();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (profile) fetchMembership();
    else { setLoading(false); }
  }, [profile]);

  async function fetchMembership() {
    setLoading(true);
    try {
      // Look up member record — try by uid first, then email
      let memberData = null;
      let memberId   = null;

      // 1. Try profile.memberId directly
      if (profile.memberId) {
        const { getMember } = await import("../firebase/service");
        const m = await getMember(profile.memberId);
        if (m) { memberData = m; memberId = m.id; }
      }

      // 2. Fallback: search by email
      if (!memberData && (profile.email || user?.email)) {
        const email = (profile.email || user?.email || "").toLowerCase();
        const snap = await getDocs(
          query(collection(db, "members"), where("email", "==", email))
        );
        if (!snap.empty) {
          memberData = snap.docs[0].data();
          memberId   = snap.docs[0].id;
        }
      }

      // 3. No member record found — free user
      if (!memberData) {
        setMembership(buildFree());
        return;
      }

      // Check expiry
      const expiry   = memberData.expiryDate ? parseISO(memberData.expiryDate) : null;
      const now      = new Date();
      const daysLeft = expiry ? differenceInDays(expiry, now) : -1;
      const isActive = daysLeft >= 0 && memberData.status !== "inactive";

      const planKey  = (memberData.plan || "free").toLowerCase();
      const level    = isActive ? (PLAN_LEVELS[planKey] ?? 1) : 0;

      const mem = {
        isActive,
        isFree:     level === 0,
        isPaid:     level >= 1,
        level,
        plan:       memberData.plan || "Free",
        planKey,
        daysLeft:   isActive ? daysLeft : 0,
        expiryDate: memberData.expiryDate || null,
        memberId,
        memberData,
        canAccess: (feature) => level >= (FEATURE_LEVELS[feature] ?? 1),
      };
      setMembership(mem);
    } catch (e) {
      console.error("useMembership error:", e);
      setMembership(buildFree());
    } finally {
      setLoading(false);
    }
  }

  return { membership, loading, refetch: fetchMembership };
}

function buildFree() {
  return {
    isActive:   false,
    isFree:     true,
    isPaid:     false,
    level:      0,
    plan:       "Free",
    planKey:    "free",
    daysLeft:   0,
    expiryDate: null,
    memberId:   null,
    memberData: null,
    canAccess:  (feature) => (FEATURE_LEVELS[feature] ?? 1) === 0,
  };
}
