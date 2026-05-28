import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function BcaScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned:", decodedText);

        onScan(decodedText);

        scanner.clear();
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader" />;
}