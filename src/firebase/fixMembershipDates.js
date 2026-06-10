// // src/firebase/fixMembershipDates.js

// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
// import { subMonths, format, parseISO } from "date-fns";
// import { db } from "./config";

// function getPlanMonths(plan = "") {
//   const p = plan.toLowerCase();

//   if (p.includes("elite")) return 12;
//   if (p.includes("annual") || p.includes("year")) return 12;
//   if (p.includes("6 month")) return 6;
//   if (p.includes("6 months")) return 6;
//   if (p.includes("3 month")) return 3;
//   if (p.includes("3 months")) return 3;
//   if (p.includes("quarter")) return 3;
//   if (p.includes("short")) return 1;

//   return 1;
// }
// export async function fixMembershipStartDates() {
//   console.log("🚀 Starting membership date repair...");

//   const snap = await getDocs(collection(db, "members"));

//   console.log(`📊 Total members found: ${snap.size}`);

//   let updated = 0;
//   let skipped = 0;

//   for (const memberDoc of snap.docs) {
//     const m = memberDoc.data();

//     console.log("--------------------------------");
//     console.log("👤 Member:", m.name);
//     console.log("📋 Plan:", m.plan);
//     console.log("📅 Expiry:", m.expiryDate);

//     if (!m.expiryDate) {
//       console.log("❌ No expiryDate found. Skipping.");
//       skipped++;
//       continue;
//     }

//     const plan = (m.plan || "").toLowerCase();
//     let months = 1;

//     if (plan.includes("3 month")) months = 3;
//     if (plan.includes("6 month")) months = 6;
//     if (
//       plan.includes("annual") ||
//       plan.includes("year") ||
//       plan.includes("elite")
//     ) {
//       months = 12;
//     }

//     const estimatedStart = format(
//       subMonths(parseISO(m.expiryDate), months),
//       "yyyy-MM-dd"
//     );

//     console.log("✅ Estimated Start:", estimatedStart);

//     await updateDoc(doc(db, "members", memberDoc.id), {
//       membershipStart: estimatedStart,
//       actualJoinDateUnknown: true,
//       dateSource: "estimated_from_expiry_and_plan",
//     });

//     console.log("💾 Updated only membershipStart:", m.name);
//     updated++;
//   }

//   console.log(`✅ Updated: ${updated}`);
//   console.log(`⏭️ Skipped: ${skipped}`);

//   return updated;
// }