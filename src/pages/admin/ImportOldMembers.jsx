// ImportCleanMembers.jsx
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

const CLEAN_MEMBERS = [
  // paste final 89 members here
  // {
  //   name: "Sajid Khan",
  //   phone: "9203398605",
  //   plan: "Basic",
  //   membershipFee: 1500,
  //   amountPaid: 1500,
  //   joinDate: "2026-06-03",
  //   expiryDate: "2026-07-03",
  //   paymentMethod: "UPI",
  //   transactionId: "UTR-580047",
  // },
  // {
  //   name: "Vedant Patel",
  //   phone: "7879688589",
  //   plan: "3 Months",
  //   membershipFee: 3999,
  //   amountPaid: 1999,
  //   joinDate: "2026-06-03",
  //   expiryDate: "2026-09-03",
  // },
  {"name":"Sajid Khan","phone":"9203398605","plan":"Basic","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-06-03","expiryDate":"2026-07-03","paymentMethod":"UPI","transactionId":"UTR-580047"},
{"name":"Vedant Patel","phone":"7879688589","plan":"3 Months","membershipFee":3999,"amountPaid":1999,"joinDate":"2026-06-03","expiryDate":"2026-09-03","notes":"Balance Due: 2000"},
{"name":"FAIZAN AHMAD","phone":"9302662280","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-18","expiryDate":"2026-06-18","paymentMethod":"UPI","batchTiming":"EVENING"},
{"name":"PRATIBHA SHRIVAS","phone":"9329748805","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-06-04","expiryDate":"2026-07-04","batchTiming":"EVENING"},
{"name":"Neelesh Janghela","phone":"6261892626","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-06-04","expiryDate":"2026-07-04","paymentMethod":"UPI","batchTiming":"evening"},
{"name":"Mr. Pankaj Israni","phone":"9630805996","plan":"Elite VIP","membershipFee":19999,"amountPaid":5000,"joinDate":"2026-05-18","expiryDate":"2027-05-18"},
{"name":"JATIN BAANI","phone":"9131110961","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-25","expiryDate":"2026-06-25"},
{"name":"Vikas Kshatriya","phone":"7987495120","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-25","expiryDate":"2026-06-25"},
{"name":"AARUSH SINGH KAROSIYA","phone":"9343500498","plan":"6 Months Student","membershipFee":7999,"amountPaid":2550,"joinDate":"2026-05-25","expiryDate":"2026-11-25"},
{"name":"Veer Chaurasiya","phone":"8815285567","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-20","expiryDate":"2026-06-20"},
{"name":"Akshay Mongre","phone":"6266519326","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-20","expiryDate":"2026-06-20"},
{"name":"Aditya Saraf","phone":"8085536177","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-20","expiryDate":"2026-06-20"},
{"name":"Dr. Somya Pamnani","phone":"9155502652","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-20","expiryDate":"2026-06-20"},
{"name":"Muskan Namdev","phone":"9098505500","plan":"3 Months Student","membershipFee":3200,"amountPaid":3200,"joinDate":"2026-05-20","expiryDate":"2026-08-20"},
{"name":"Rudransh Choudhary","phone":"8889825494","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Akshay Yadav","phone":"7477256531","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Hardik Chhatriya","phone":"9305333052","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Samet Vishwakarma","phone":"7899993060","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Bhavi Virani","phone":"9109875311","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Kaustubh Patel","phone":"9109376909","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Nikhil Patel","phone":"6252706632","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Harshdeep Jhariya","phone":"9407389468","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Saurabh Jhariya","phone":"7723011839","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Anas Khan","phone":"6266955056","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Sanskar Sahu","phone":"8987553102","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-02","expiryDate":"2026-07-02"},
{"name":"Raghu Jhariya","phone":"8770784729","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"Arishant Upadhyay","phone":"8253000233","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"Mayank Jhariya","phone":"9131915545","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"PAVAN UIKEY","phone":"6267023396","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"Deepansh Choudhary","phone":"7470715050","plan":"6 Months Family","membershipFee":7200,"amountPaid":7200,"joinDate":"2026-06-01","expiryDate":"2026-12-01"},
{"name":"Mohd. Sahil","phone":"9899216043","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"Shreya Jain","phone":"7999839604","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"Shivang Tiwari","phone":"9343384566","plan":"3 Months Student","membershipFee":3999,"amountPaid":1500,"joinDate":"2026-05-29","expiryDate":"2026-08-29"},
{"name":"Raghav Dubey","phone":"7440909086","plan":"3 Months Student","membershipFee":3999,"amountPaid":1200,"joinDate":"2026-05-29","expiryDate":"2026-08-29"},
{"name":"Vanshika Jaiswani","phone":"8770507722","plan":"1 Month","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-29","expiryDate":"2026-06-29"},
{"name":"Anshul Datla","phone":"7067286706","plan":"1 Month","membershipFee":5000,"amountPaid":5000,"joinDate":"2026-06-01","expiryDate":"2026-07-01"},
{"name":"Kamal Jihani","phone":"9926913201","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-27","expiryDate":"2026-06-27"},
{"name":"Pratap Kachwaha","phone":"9028660531","plan":"1 Month","membershipFee":2500,"amountPaid":2500,"joinDate":"2026-05-27","expiryDate":"2026-06-27"},
{"name":"Akhil Patel","phone":"9981792254","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-27","expiryDate":"2026-06-27"},
{"name":"Gaurav Vandelu","phone":"9901925297","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-27","expiryDate":"2026-06-27"},
{"name":"Tanay Kachwaha","phone":"9340866343","plan":"1 Month","membershipFee":1500,"amountPaid":0,"joinDate":"2026-05-26","expiryDate":"2026-06-26"},
{"name":"Vishal Paelwan","phone":"7400886597","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-26","expiryDate":"2026-06-26"},
{"name":"Rishi Markam","phone":"9303174811","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-26","expiryDate":"2026-06-26"},
{"name":"Dr. Vivek Tiwari","phone":"8770860559","plan":"3 Months","membershipFee":3999,"amountPaid":3999,"joinDate":"2026-05-26","expiryDate":"2026-08-26"},
{"name":"Palesh Rawat","phone":"7746941411","plan":"1 Month","membershipFee":1000,"amountPaid":1000,"joinDate":"2026-05-26","expiryDate":"2026-06-26"},
{"name":"Anshu Yantam","phone":"9695505607","plan":"Student Basic","membershipFee":1199,"amountPaid":1199,"joinDate":"2026-05-25","expiryDate":"2026-06-25"},
{"name":"Laksham Saraf","phone":"9174482029","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-25","expiryDate":"2026-06-25"},
{"name":"Piddi Sharma","phone":"9860020276","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-25","expiryDate":"2026-06-25"},
{"name":"Atul Patel","phone":"8871911669","plan":"Student Basic","membershipFee":1000,"amountPaid":1000,"joinDate":"2026-05-25","expiryDate":"2026-06-25"},
{"name":"Naina Bhatiya","phone":"8770150375","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-23","expiryDate":"2026-06-23"},
{"name":"Deeksha Yadav","phone":"9301783570","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-23","expiryDate":"2026-06-23"},
{"name":"AMI MISHRA","phone":"9826350906","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-22","expiryDate":"2026-06-22"},
{"name":"Aadarsh Koshtha","phone":"7489014370","plan":"1 Month","membershipFee":1000,"amountPaid":500,"joinDate":"2026-05-22","expiryDate":"2026-06-22"},
{"name":"Rajeev Chouhan","phone":"8147356285","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-22","expiryDate":"2026-06-22"},
{"name":"Prabhnoor Singh","phone":"7974790801","plan":"Student Basic","membershipFee":1199,"amountPaid":1199,"joinDate":"2026-05-22","expiryDate":"2026-06-22"},
{"name":"PRINCE UIKEY","phone":"8815974704","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-21","expiryDate":"2026-06-21"},
{"name":"Cheeku Ninoriya","phone":"8236035205","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-21","expiryDate":"2026-06-21"},
{"name":"Palash Jain","phone":"9594186028","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-21","expiryDate":"2026-06-21"},
{"name":"Raghav Sihare","phone":"7860064493","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Shubham Barmoiya","phone":"9754934111","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Shreyus Raj Dhurvey","phone":"8305805425","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Mayank Vikey","phone":"9770681627","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Shantanu Parte","phone":"6263092820","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Preetam Thakur","phone":"6266437144","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Sohit Nahar","phone":"9285422924","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Rudra Chhare","phone":"6267559493","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Prince Sahu","phone":"6264107514","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Anuj Namdev","phone":"9691156822","plan":"Group Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Somendra Suryavanshi","phone":"9131112824","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Riyer Vikey","phone":"9171613509","plan":"1 Month","membershipFee":1499,"amountPaid":1499,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Tushar Virani","phone":"9329661300","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-19","expiryDate":"2026-06-19"},
{"name":"Parush Soni","phone":"8319665659","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Dr. Rahul Patel","phone":"7089062868","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Anshul Sharma","phone":"9368627372","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Harsh Pradhan","phone":"7879159758","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Manav Pamnani","phone":"9179422234","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-16","expiryDate":"2026-06-16"},
{"name":"Md. Shoeb","phone":"7879798416","plan":"3 Months","membershipFee":3999,"amountPaid":1000,"joinDate":"2026-05-16","expiryDate":"2026-08-16"},
{"name":"Md. Rashid","phone":"7224070186","plan":"3 Months","membershipFee":3999,"amountPaid":1000,"joinDate":"2026-05-16","expiryDate":"2026-08-16"},
{"name":"Krishant Chouksey","phone":"9752143437","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-14","expiryDate":"2026-06-14"},
{"name":"Pratik Aniket Yadav","phone":"9300418259","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-14","expiryDate":"2026-06-14"},
{"name":"Shamit Agnihotri","phone":"7000772140","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Aastik Chourasiya","phone":"8615871954","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Parth Soni","phone":"9589533200","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Harshit Bhanyre","phone":"8962137781","plan":"Student Basic","membershipFee":1200,"amountPaid":1200,"joinDate":"2026-05-18","expiryDate":"2026-06-18"},
{"name":"Vaibhav Kurzeja","phone":"7999341284","plan":"1 Month","membershipFee":1500,"amountPaid":1500,"joinDate":"2026-05-14","expiryDate":"2026-06-14"},
{"name":"Mahir Patel","phone":"8982713298","plan":"1 Month","membershipFee":1499,"amountPaid":1000,"joinDate":"2026-05-18","expiryDate":"2026-06-18","batchTiming":"Morning"},
{"name":"Sachin Banshkar","phone":"7470721005","plan":"1 Month","membershipFee":1499,"amountPaid":1000,"joinDate":"2026-06-03","expiryDate":"2026-07-03","batchTiming":"Morning"},
{"name":"Sam Mishra","phone":"8319802425","plan":"Elite VIP","membershipFee":0,"amountPaid":0,"joinDate":"2026-06-02","expiryDate":"2027-06-02","goal":"Body Toning","batchTiming":"5:00 AM","paymentMethod":"Card"},
{"name":"Samarth Sharma","phone":"8305658034","plan":"short term","membershipFee":1000,"amountPaid":1000,"joinDate":"2026-05-18","expiryDate":"2026-05-28"},

];

const cleanPhone = (phone = "") =>
  String(phone).replace(/\D/g, "").slice(-10);

export default function ImportCleanMembers() {
  const handleImport = async () => {
    if (!window.confirm(`Import ${CLEAN_MEMBERS.length} clean members?`)) return;

    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < CLEAN_MEMBERS.length; i++) {
      const m = CLEAN_MEMBERS[i];
      const phone = cleanPhone(m.phone);

      if (!m.name || phone.length !== 10) {
        skipped++;
        continue;
      }

      const existing = await getDocs(
        query(collection(db, "members"), where("phone", "==", phone))
      );

      if (!existing.empty) {
        skipped++;
        continue;
      }

      const membershipFee = Number(m.membershipFee || 0);
      const amountPaid = Number(m.amountPaid || 0);
      const balanceDue = Math.max(membershipFee - amountPaid, 0);

      const memberData = {
        name: m.name,
        phone,
        plan: m.plan,
        membershipFee,
        amountPaid,
        totalAmount: membershipFee,
        balanceDue,
        joinDate: m.joinDate,
        expiryDate: m.expiryDate,
        paymentMethod: m.paymentMethod || "Cash",
        transactionId: m.transactionId || "",
        memberId: `F2-${String(i + 1).padStart(4, "0")}`,
        goal: m.goal || "General Fitness",
        batchTiming: m.batchTiming || "",
        city: "Mandla",
        status: "active",
        appActivated: false,
        notes: "Clean import",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const memberRef = await addDoc(collection(db, "members"), memberData);

      await addDoc(collection(db, "payments"), {
        memberId: memberRef.id,
        memberCode: memberData.memberId,
        memberName: m.name,
        phone,
        plan: m.plan,
        amount: amountPaid,
        membershipFee,
        totalAmount: membershipFee,
        balanceDue,
        method: m.paymentMethod || "Cash",
        transactionId: m.transactionId || "",
        date: m.joinDate,
        expiryDate: m.expiryDate,
        type: "member",
        paymentType: "new",
        status: "paid",
        notes: `Clean import | Total: ₹${membershipFee} | Balance: ₹${balanceDue}`,
        createdAt: serverTimestamp(),
      });

      imported++;
    }

    toast.success(`Imported: ${imported}, Skipped: ${skipped}`);
  };

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Clean Members Import</div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-title">Import 89 Clean Members</div>
          <p>{CLEAN_MEMBERS.length} members ready.</p>

          <button className="btn btn-primary" onClick={handleImport}>
            Import Clean Data
          </button>
        </div>
      </div>
    </div>
  );
}