// import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
// import toast from "react-hot-toast";
// import { db } from "../../firebase/config";

// const OLD_MEMBERS = [
//   { name: "Pratik Aniket Yadav", phone: "9300418259", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-14" },
//   { name: "Krishant Chouksey", phone: "9752143437", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-14" },
//   { name: "Md. Rashid", phone: "7224070186", plan: "3 Months", membershipFee: 3999, amountPaid: 1000, joinDate: "2026-05-16" },
//   { name: "Md. Shoeb", phone: "7879798416", plan: "3 Months", membershipFee: 3999, amountPaid: 1000, joinDate: "2026-05-16" },
//   { name: "Manav Pamnani", phone: "9179422234", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-16" },
//   { name: "Harsh Pradhan", phone: "7879159758", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },

//   { name: "Anshul Sharma", phone: "9368627372", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },
//   { name: "Dr. Rahul Patel", phone: "7089062868", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },
//   { name: "Parush Soni", phone: "8319665659", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },
//   { name: "Tushar Virani", phone: "9329661300", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },
//   { name: "Rohan Virani", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },
//   { name: "Riyer Vikey", phone: "9171613509", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-19" },
//   { name: "Somendra Suryavanshi", phone: "9131112824", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },

//   { name: "Anuj Namdev", phone: "9691156822", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Prince Sahu", phone: "6264107514", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Rudra Chhare", phone: "6267559493", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Sohit Nahar", phone: "9285422924", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Preetam Thakur", phone: "6266437144", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Shantanu Parte", phone: "6263092820", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Mayank Vikey", phone: "9770681627", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Shreyus Raj Dhurvey", phone: "8305805425", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Shubham Barmoiya", phone: "9754934111", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Raghav Sihare", phone: "7860064493", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },
//   { name: "Akshay Yadav", phone: "7477256531", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },

//   { name: "Rudransh Choudhary", phone: "8889825494", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Muskan Namdev", phone: "9098505500", plan: "3 Months Student", membershipFee: 3200, amountPaid: 3200, joinDate: "2026-05-20" },
//   { name: "Dr. Romye Pamnani", phone: "9155502652", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Aditya Saraf", phone: "8085536177", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Akshay Mongre", phone: "6266519326", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Aaryan Bairagi", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Veer Chaurasiya", phone: "8815285567", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },

//   { name: "Palash Jain", phone: "9594186028", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-21" },
//   { name: "Cheeku Ninoriya", phone: "8236035205", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-21" },
//   { name: "Prince Vikey", phone: "8815974704", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-21" },
//   { name: "Vineet Tekam", phone: "", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-21" },
//   { name: "Prabhnoor Singh", phone: "7974790801", plan: "Student Basic", membershipFee: 1199, amountPaid: 1199, joinDate: "2026-05-22" },
//   { name: "Rajeev Chouhan", phone: "8147356285", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-22" },
//   { name: "Aadarsh Koshtha", phone: "7489014370", plan: "1 Month", membershipFee: 1000, amountPaid: 500, joinDate: "2026-05-22" },
//   { name: "Anu Mishra", phone: "9826350906", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-22" },
//   { name: "Deeksha Yadav", phone: "9301783570", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-23" },

//   { name: "Naina Bhatiya", phone: "8770150375", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-23" },
//   { name: "Atul Patel", phone: "8871911669", plan: "Student Basic", membershipFee: 1000, amountPaid: 1000, joinDate: "2026-05-25" },
//   { name: "Piddi Sharma", phone: "9860020276", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-25" },
//   { name: "Laksham Saraf", phone: "9174482029", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-25" },
//   { name: "Anshu Yantam", phone: "9695505607", plan: "Student Basic", membershipFee: 1199, amountPaid: 1199, joinDate: "2026-05-25" },
//   { name: "Parush Singh Karojiya", phone: "9343500498", plan: "6 Months Student", membershipFee: 7999, amountPaid: 2550, joinDate: "2026-05-25" },
//   { name: "Vikas Kshatriya", phone: "7987495120", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-25" },
//   { name: "Jatin Bacani", phone: "9131110961", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-25" },

//   { name: "Palesh Rawat", phone: "7746941411", plan: "1 Month", membershipFee: 1000, amountPaid: 1000, joinDate: "2026-05-26" },
//   { name: "Dr. Vivek Tiwari", phone: "8770860559", plan: "3 Months", membershipFee: 3999, amountPaid: 3999, joinDate: "2026-05-26" },
//   { name: "Rishi Markam", phone: "9303174811", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-26" },
//   { name: "Vishal Paelwan", phone: "7400886597", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-26" },
//   { name: "Tanay Kachwaha", phone: "9340866343", plan: "1 Month", membershipFee: 1500, amountPaid: 0, joinDate: "2026-05-26" },
//   { name: "Gaurav Vandelu", phone: "9901925297", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-27" },
//   { name: "Akhil Patel", phone: "9981792254", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-27" },

//   { name: "Pratap Kachwaha", phone: "9028660531", plan: "1 Month", membershipFee: 2500, amountPaid: 2500, joinDate: "2026-05-27" },
//   { name: "Kamal Jihani", phone: "9926913201", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-27" },
//   { name: "Dr. Rahul Amnani", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-28" },
//   { name: "Mrs. Rahul Amnani", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-28" },
//   { name: "Anshul Datla", phone: "7067286706", plan: "1 Month", membershipFee: 5000, amountPaid: 5000, joinDate: "2026-06-01" },
//   { name: "Vanshika Jaiswani", phone: "8770507722", plan: "1 Month", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-29" },
//   { name: "Poon Jaiswani", phone: "", plan: "1 Month", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-29" },
//   { name: "Raghav Dubey", phone: "7440909086", plan: "3 Months Student", membershipFee: 3999, amountPaid: 1200, joinDate: "2026-05-29" },
//   { name: "Shivang Tiwari", phone: "9343384566", plan: "3 Months Student", membershipFee: 3999, amountPaid: 1500, joinDate: "2026-05-29" },

//   { name: "Shashank Sahu", phone: "996527105", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-30" },
//   { name: "Suresh Lalwani", phone: "", plan: "3 Months", membershipFee: 3999, amountPaid: 3999, joinDate: "2026-05-30" },
//   { name: "Shreya Jain", phone: "7999839604", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-06-01" },
//   { name: "Mohd. Sahil", phone: "9899216043", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-01" },
//   { name: "Deepansh Choudhary", phone: "7470715050", plan: "6 Months Family", membershipFee: 7200, amountPaid: 7200, joinDate: "2026-06-01" },
//   { name: "Pavan Vikey", phone: "6267023396", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
//   { name: "Mayank Jhariya", phone: "9131915545", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },

//   { name: "Arishant Upadhyay", phone: "8253000233", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
//   { name: "Raghu Jhariya", phone: "8770784729", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-01" },
//   { name: "Kuldeep Sukhwani", phone: "", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
//   { name: "Sumit Chourasiya", phone: "", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
//   { name: "Sanskar Sahu", phone: "8987553102", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
//   { name: "Anas Khan", phone: "6266955056", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },

//   { name: "Saurabh Jhariya", phone: "7723011839", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
//   { name: "Harshdeep Jhariya", phone: "9407389468", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-02" },
//   { name: "Nikhil Patel", phone: "6252706632", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-02" },
//   { name: "Kaustubh Patel", phone: "9109376909", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
//   { name: "Bhavi Virani", phone: "9109875311", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
//   { name: "Samet Vishwakarma", phone: "7899993060", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-02" },
//   { name: "Hardik Chhatriya", phone: "9305333052", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
// ];
  
// //   {
// //     name: "Samarth Sharma",
// //     phone: "8305658034",
// //     plan: "short term",
// //     membershipFee: 1000,
// //     amountPaid: 1000,
// //     joinDate: "2026-05-18",
// //     expiryDate: "2026-05-28",
// //   },
// //   {
// //     name: "Vaibhav Kurzeja",
// //     phone: "7999341284",
// //     plan: "1 Month",
// //     membershipFee: 1500,
// //     amountPaid: 1500,
// //     joinDate: "2026-05-18",
// //     expiryDate: "2026-06-18",
// //   },
// //   {
// //     name: "Harshit Bhanyre",
// //     phone: "8962137781",
// //     plan: "Student Basic",
// //     membershipFee: 1200,
// //     amountPaid: 1200,
// //     joinDate: "2026-05-18",
// //     expiryDate: "2026-06-18",
// //   },
// //   {
// //     name: "Parth Soni",
// //     phone: "9589533200",
// //     plan: "1 Month",
// //     membershipFee: 1500,
// //     amountPaid: 1500,
// //     joinDate: "2026-05-18",
// //     expiryDate: "2026-06-18",
// //   },
// //   {
// //     name: "Aastik Chourasiya",
// //     phone: "8615871954",
// //     plan: "1 Month",
// //     membershipFee: 1500,
// //     amountPaid: 1500,
// //     joinDate: "2026-05-18",
// //     expiryDate: "2026-06-18",
// //   },
// //   {
// //     name: "Shamit Agnihotri",
// //     phone: "7000772140",
// //     plan: "1 Month",
// //     membershipFee: 1500,
// //     amountPaid: 1500,
// //     joinDate: "2026-05-18",
// //     expiryDate: "2026-06-18",
// //   },



// export default function ImportOldMembers() {
//   const handleImport = async () => {
//     const confirmImport = window.confirm(
//       `Import ${OLD_MEMBERS.length} old members to Firestore?`
//     );

//     if (!confirmImport) return;

//     try {
//       let imported = 0;
//       let skipped = 0;

//       for (const m of OLD_MEMBERS) {
//         const phone = String(m.phone || "").replace(/\D/g, "").slice(-10);

//         if (!phone || phone.length !== 10) {
//           skipped++;
//           continue;
//         }

//         const existingQuery = await getDocs(
//           query(collection(db, "members"), where("phone", "==", phone))
//         );

//         if (!existingQuery.empty) {
//           skipped++;
//           continue;
//         }

//         const totalAmount = Number(m.membershipFee || 0);
//         const amountPaid = Number(m.amountPaid || 0);
//         const balanceDue = Math.max(totalAmount - amountPaid, 0);
//         const memberId = `F2-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

//         const memberData = {
//           address: "",
//           age: "",
//           alternatePhone: "",
//           amountPaid,
//           appActivated: false,
//           authUid: "",
//           balanceDue,
//           batchTiming: "",
//           bcaSessionsAllowed: 0,
//           bcaSessionsRemaining: 0,
//           bcaSessionsUsed: 0,
//           biometricId: "",
//           bloodGroup: "",
//           bmi: "",
//           city: "Mandla",
//           createdAt: serverTimestamp(),
//           discount: 0,
//           dob: "",
//           doctorAdvice: "",
//           email: "",
//           emergencyName: "",
//           emergencyPhone: "",
//           emergencyRelation: "",
//           expiryDate: m.expiryDate,
//           fatherName: "",
//           gender: "Male",
//           goal: "General Fitness",
//           height: "",
//           joinDate: m.joinDate,
//           massageSessionsAllowed: 0,
//           massageSessionsRemaining: 0,
//           massageSessionsUsed: 0,
//           medicalCondition: "",
//           medication: "",
//           memberId,
//           membershipFee: totalAmount,
//           name: m.name,
//           notes: "Imported from old register",
//           occupation: "",
//           paymentMethod: "Cash",
//           phone,
//           pinCode: "",
//           plan: m.plan,
//           preferredTime: "",
//           previousInjury: "",
//           referredBy: "",
//           registrationFee: 0,
//           status: "active",
//           steamSessionsAllowed: 0,
//           steamSessionsRemaining: 0,
//           steamSessionsUsed: 0,
//           totalAmount,
//           trainerAssigned: "",
//           transactionId: "",
//           uid: "",
//           updatedAt: serverTimestamp(),
//           weight: "",
//         };

//         await addDoc(collection(db, "members"), memberData);

//         await addDoc(collection(db, "payments"), {
//           memberId,
//           memberName: m.name,
//           phone,
//           plan: m.plan,
//           amount: amountPaid,
//           method: "Cash",
//           date: m.joinDate,
//           expiryDate: m.expiryDate,
//           type: "member",
//           status: "paid",
//           notes: `Imported old membership | Total: ₹${totalAmount} | Balance: ₹${balanceDue}`,
//           createdAt: serverTimestamp(),
//         });

//         imported++;
//       }

//       toast.success(`Imported: ${imported}, Skipped: ${skipped}`);
//     } catch (error) {
//       console.error(error);
//       toast.error("Import failed");
//     }
//   };

//   return (
//     <div className="page-enter">
//       <div className="topbar">
//         <div className="page-title">Import Old Members</div>
//       </div>

//       <div className="page-body">
//         <div className="card">
//           <div className="card-title">Old Register Import</div>
//           <p>{OLD_MEMBERS.length} members ready to import.</p>

//           <button className="btn btn-primary" onClick={handleImport}>
//             Import Members
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../firebase/config";

const OLD_MEMBERS = [
//   {
//     name: "Vedant Patel",
//     phone: "7879688589",
//     plan: "3 Months",
//     membershipFee: 3999,
//     amountPaid: 1999,
//     joinDate: "2026-06-03",
//     notes: "Balance Due: 2000"
//   },

//   {
//     name: "Sajid Khan",
//     phone: "9203398605",
//     plan: "Basic",
//     membershipFee: 1500,
//     amountPaid: 1500,
//     joinDate: "2026-06-03",
//     paymentMethod: "UPI",
//     transactionId: "UTR-580047"
//   },{

//     name: "Vaibhav Kurzeja",
//     phone: "7999341284",
//     plan: "1 Month",
//     membershipFee: 1500,
//     amountPaid: 1500,
//     joinDate: "2026-05-18",
//   },
//   { name: "Pratik Aniket Yadav", phone: "9300418259", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-14" },
//   { name: "Krishant Chouksey", phone: "9752143437", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-14" },
//   { name: "Md. Rashid", phone: "7224070186", plan: "3 Months", membershipFee: 3999, amountPaid: 1000, joinDate: "2026-05-16" },
//   { name: "Md. Shoeb", phone: "7879798416", plan: "3 Months", membershipFee: 3999, amountPaid: 1000, joinDate: "2026-05-16" },
//   { name: "Manav Pamnani", phone: "9179422234", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-16" },
//   { name: "Harsh Pradhan", phone: "7879159758", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },

//   { name: "Anshul Sharma", phone: "9368627372", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },
//   { name: "Dr. Rahul Patel", phone: "7089062868", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },
//   { name: "Parush Soni", phone: "8319665659", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-18" },
//   { name: "Tushar Virani", phone: "9329661300", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },
//   { name: "Rohan Virani", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },
//   { name: "Riyer Vikey", phone: "9171613509", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-19" },
//   { name: "Somendra Suryavanshi", phone: "9131112824", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },

//   { name: "Anuj Namdev", phone: "9691156822", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Prince Sahu", phone: "6264107514", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Rudra Chhare", phone: "6267559493", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Sohit Nahar", phone: "9285422924", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Preetam Thakur", phone: "6266437144", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Shantanu Parte", phone: "6263092820", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Mayank Vikey", phone: "9770681627", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Shreyus Raj Dhurvey", phone: "8305805425", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Shubham Barmoiya", phone: "9754934111", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Raghav Sihare", phone: "7860064493", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },
//   { name: "Akshay Yadav", phone: "7477256531", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-19" },

//   { name: "Rudransh Choudhary", phone: "8889825494", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-19" },
//   { name: "Muskan Namdev", phone: "9098505500", plan: "3 Months Student", membershipFee: 3200, amountPaid: 3200, joinDate: "2026-05-20" },
//   { name: "Dr. Romye Pamnani", phone: "9155502652", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Aditya Saraf", phone: "8085536177", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Akshay Mongre", phone: "6266519326", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Aaryan Bairagi", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },
//   { name: "Veer Chaurasiya", phone: "8815285567", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-20" },

//   { name: "Palash Jain", phone: "9594186028", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-21" },
//   { name: "Cheeku Ninoriya", phone: "8236035205", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-21" },
//   { name: "Prince Vikey", phone: "8815974704", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-21" },
//   { name: "Vineet Tekam", phone: "", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-21" },
//   { name: "Prabhnoor Singh", phone: "7974790801", plan: "Student Basic", membershipFee: 1199, amountPaid: 1199, joinDate: "2026-05-22" },
//   { name: "Rajeev Chouhan", phone: "8147356285", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-22" },
//   { name: "Aadarsh Koshtha", phone: "7489014370", plan: "1 Month", membershipFee: 1000, amountPaid: 500, joinDate: "2026-05-22" },
//   { name: "Anu Mishra", phone: "9826350906", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-22" },
//   { name: "Deeksha Yadav", phone: "9301783570", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-23" },

//   { name: "Naina Bhatiya", phone: "8770150375", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-23" },
//   { name: "Atul Patel", phone: "8871911669", plan: "Student Basic", membershipFee: 1000, amountPaid: 1000, joinDate: "2026-05-25" },
//   { name: "Piddi Sharma", phone: "9860020276", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-25" },
//   { name: "Laksham Saraf", phone: "9174482029", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-25" },
//   { name: "Anshu Yantam", phone: "9695505607", plan: "Student Basic", membershipFee: 1199, amountPaid: 1199, joinDate: "2026-05-25" },
//   { name: "Parush Singh Karojiya", phone: "9343500498", plan: "6 Months Student", membershipFee: 7999, amountPaid: 2550, joinDate: "2026-05-25" },
//   { name: "Vikas Kshatriya", phone: "7987495120", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-25" },
//   { name: "Jatin Bacani", phone: "9131110961", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-25" },

//   { name: "Palesh Rawat", phone: "7746941411", plan: "1 Month", membershipFee: 1000, amountPaid: 1000, joinDate: "2026-05-26" },
//   { name: "Dr. Vivek Tiwari", phone: "8770860559", plan: "3 Months", membershipFee: 3999, amountPaid: 3999, joinDate: "2026-05-26" },
//   { name: "Rishi Markam", phone: "9303174811", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-26" },
//   { name: "Vishal Paelwan", phone: "7400886597", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-26" },
//   { name: "Tanay Kachwaha", phone: "9340866343", plan: "1 Month", membershipFee: 1500, amountPaid: 0, joinDate: "2026-05-26" },
//   { name: "Gaurav Vandelu", phone: "9901925297", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-27" },
//   { name: "Akhil Patel", phone: "9981792254", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-27" },

//   { name: "Pratap Kachwaha", phone: "9028660531", plan: "1 Month", membershipFee: 2500, amountPaid: 2500, joinDate: "2026-05-27" },
//   { name: "Kamal Jihani", phone: "9926913201", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-27" },
//   { name: "Dr. Rahul Amnani", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-28" },
//   { name: "Mrs. Rahul Amnani", phone: "", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-05-28" },
//   { name: "Anshul Datla", phone: "7067286706", plan: "1 Month", membershipFee: 5000, amountPaid: 5000, joinDate: "2026-06-01" },
//   { name: "Vanshika Jaiswani", phone: "8770507722", plan: "1 Month", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-29" },
//   { name: "Poon Jaiswani", phone: "", plan: "1 Month", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-05-29" },
//   { name: "Raghav Dubey", phone: "7440909086", plan: "3 Months Student", membershipFee: 3999, amountPaid: 1200, joinDate: "2026-05-29" },
//   { name: "Shivang Tiwari", phone: "9343384566", plan: "3 Months Student", membershipFee: 3999, amountPaid: 1500, joinDate: "2026-05-29" },

//   { name: "Shashank Sahu", phone: "996527105", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-05-30" },
//   { name: "Suresh Lalwani", phone: "", plan: "3 Months", membershipFee: 3999, amountPaid: 3999, joinDate: "2026-05-30" },
//   { name: "Shreya Jain", phone: "7999839604", plan: "1 Month", membershipFee: 1499, amountPaid: 1499, joinDate: "2026-06-01" },
//   { name: "Mohd. Sahil", phone: "9899216043", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-01" },
//   { name: "Deepansh Choudhary", phone: "7470715050", plan: "6 Months Family", membershipFee: 7200, amountPaid: 7200, joinDate: "2026-06-01" },
//   { name: "Pavan Vikey", phone: "6267023396", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
//   { name: "Mayank Jhariya", phone: "9131915545", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },

  { name: "Arishant Upadhyay", phone: "8253000233", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
  { name: "Raghu Jhariya", phone: "8770784729", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-01" },
  { name: "Kuldeep Sukhwani", phone: "", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
  { name: "Sumit Chourasiya", phone: "", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-01" },
  { name: "Sanskar Sahu", phone: "8987553102", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
  { name: "Anas Khan", phone: "6266955056", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },

  { name: "Saurabh Jhariya", phone: "7723011839", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
  { name: "Harshdeep Jhariya", phone: "9407389468", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-02" },
  { name: "Nikhil Patel", phone: "6252706632", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-02" },
  { name: "Kaustubh Patel", phone: "9109376909", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
  { name: "Bhavi Virani", phone: "9109875311", plan: "Student Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },
  { name: "Samet Vishwakarma", phone: "7899993060", plan: "1 Month", membershipFee: 1500, amountPaid: 1500, joinDate: "2026-06-02" },
  { name: "Hardik Chhatriya", phone: "9305333052", plan: "Group Basic", membershipFee: 1200, amountPaid: 1200, joinDate: "2026-06-02" },


];

  // paste your remaining members here

function cleanPhone(phone = "") {
  return String(phone).replace(/\D/g, "").slice(-10);
}

function getMonthsFromPlan(plan = "") {
  const p = String(plan).toLowerCase();

  if (p.includes("6")) return 6;
  if (p.includes("4")) return 4;
  if (p.includes("3")) return 3;
  if (p.includes("annual") || p.includes("vip")) return 12;

  return 1;
}

function getExpiryDate(joinDate, plan) {
  if (!joinDate) return "";

  const d = new Date(joinDate);
  if (Number.isNaN(d.getTime())) return "";

  d.setMonth(d.getMonth() + getMonthsFromPlan(plan));
  return d.toISOString().slice(0, 10);
}

function safe(value, fallback = "") {
  return value === undefined || value === null ? fallback : value;
}

export default function ImportOldMembers() {
  const handleImport = async () => {
    const confirmImport = window.confirm(
      `Import ${OLD_MEMBERS.length} old members to Firestore?`
    );

    if (!confirmImport) return;

    try {
      let imported = 0;
      let skipped = 0;
      let failed = 0;

      for (const m of OLD_MEMBERS) {
        try {
          const phone = cleanPhone(m.phone);

          if (!m.name || !phone || phone.length !== 10) {
            skipped++;
            continue;
          }

          const existingQuery = await getDocs(
            query(collection(db, "members"), where("phone", "==", phone))
          );

          if (!existingQuery.empty) {
            skipped++;
            continue;
          }

          const totalAmount = Number(m.membershipFee || 0);
          const amountPaid = Number(m.amountPaid || 0);
          const balanceDue = Math.max(totalAmount - amountPaid, 0);
          const memberId = `F2-${Date.now()}-${Math.floor(
            Math.random() * 9999
          )}`;

          const expiryDate =
            safe(m.expiryDate) || getExpiryDate(m.joinDate, m.plan);

          const memberData = {
            address: "",
            age: "",
            alternatePhone: "",
            amountPaid,
            appActivated: false,
            authUid: "",
            balanceDue,
            batchTiming: safe(m.batchTiming),
            bcaSessionsAllowed: 0,
            bcaSessionsRemaining: 0,
            bcaSessionsUsed: 0,
            biometricId: "",
            bloodGroup: "",
            bmi: "",
            city: "Mandla",
            createdAt: serverTimestamp(),
            discount: Number(m.discount || 0),
            dob: "",
            doctorAdvice: "",
            email: "",
            emergencyName: "",
            emergencyPhone: "",
            emergencyRelation: "",
            expiryDate,
            fatherName: "",
            gender: safe(m.gender, "Male"),
            goal: "General Fitness",
            height: "",
            joinDate: safe(m.joinDate),
            massageSessionsAllowed: 0,
            massageSessionsRemaining: 0,
            massageSessionsUsed: 0,
            medicalCondition: "",
            medication: "",
            memberId,
            membershipFee: totalAmount,
            name: safe(m.name),
            notes: safe(m.notes, "Imported from old register"),
            occupation: "",
            paymentMethod: safe(m.paymentMethod, "Cash"),
            phone,
            pinCode: "",
            plan: safe(m.plan, "1 Month"),
            preferredTime: "",
            previousInjury: "",
            referredBy: "",
            registrationFee: 0,
            status: "active",
            steamSessionsAllowed: 0,
            steamSessionsRemaining: 0,
            steamSessionsUsed: 0,
            totalAmount,
            trainerAssigned: "",
            transactionId: "",
            uid: "",
            updatedAt: serverTimestamp(),
            weight: "",
          };

          await addDoc(collection(db, "members"), memberData);

          await addDoc(collection(db, "payments"), {
            memberId,
            memberName: memberData.name,
            phone,
            plan: memberData.plan,
            amount: amountPaid,
            method: memberData.paymentMethod,
            date: memberData.joinDate,
            expiryDate,
            type: "member",
            status: "paid",
            notes: `Imported old membership | Total: ₹${totalAmount} | Balance: ₹${balanceDue}`,
            createdAt: serverTimestamp(),
          });

          imported++;
        } catch (innerError) {
          console.error("Failed member:", m, innerError);
          failed++;
        }
      }

      toast.success(
        `Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Import failed");
    }
  };

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Import Old Members</div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-title">Old Register Import</div>
          <p>{OLD_MEMBERS.length} members ready to import.</p>

          <button className="btn btn-primary" onClick={handleImport}>
            Import Members
          </button>
        </div>
      </div>
    </div>
  );
}