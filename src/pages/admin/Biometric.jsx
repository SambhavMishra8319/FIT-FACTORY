// import { useState } from "react";
// import toast from "react-hot-toast";
// import {
//   mockFingerprintScan,
// } from "../../services/biometricService";

// export default function Biometric() {
//   const [fingerId, setFingerId] =
//     useState("");

//   const handleScan = async () => {
//     const res =
//       await mockFingerprintScan(
//         fingerId
//       );

//     if (!res.success) {
//       toast.error(res.message);
//       return;
//     }

//     toast.success(
//       `${res.member.name} checked in`
//     );

//     setFingerId("");
//   };

//   return (
//     <div className="page">
//       <h2>Biometric Scanner</h2>

//       <input
//         value={fingerId}
//         onChange={(e) =>
//           setFingerId(
//             e.target.value
//           )
//         }
//         placeholder="Fingerprint ID"
//       />

//       <button
//         onClick={handleScan}
//       >
//         Simulate Scan
//       </button>
//     </div>
//   );
// }