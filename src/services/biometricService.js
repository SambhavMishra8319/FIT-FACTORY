// import {
//   getAllMembers,
//   addBiometricAttendance,
// } from "../firebase/service";

// export async function mockFingerprintScan(
//   biometricId
// ) {
//   const members =
//     await getAllMembers();

//   const member = members.find(
//     (m) =>
//       String(m.biometricId) ===
//       String(biometricId)
//   );

//   if (!member) {
//     return {
//       success: false,
//       message: "Member not found",
//     };
//   }

//   await addBiometricAttendance({
//     memberId: member.id,
//     memberName: member.name,
//     biometricId,
//   });

//   return {
//     success: true,
//     member,
//   };
// }