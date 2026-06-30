// import { useEffect } from "react";
// import * as Html5Qrcode from "html5-qrcode";

// export default function BcaScanner({ onScan }) {
//   useEffect(() => {
//     const scanner = new Html5Qrcode.Html5QrcodeScanner(
//       "reader",
//       {
//         fps: 10,
//         qrbox: 250,
//       },
//       false
//     );

//     scanner.render(
//       (decodedText) => {
//         onScan(decodedText);

//         scanner.clear().catch(console.error);
//       },
//       () => {}
//     );

//     return () => {
//       scanner.clear().catch(console.error);
//     };
//   }, [onScan]);

//   return <div id="reader" />;
// }