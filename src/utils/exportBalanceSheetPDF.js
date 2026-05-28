// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";

// // export const exportBalanceSheetExcel = ({
// //   entries,
// //   totalIncome,
// //   totalExpense,
// //   netBalance,
// //   filterLabel,
// // }) => {
// //   const workbook = XLSX.utils.book_new();

// //   // Main data
// //   const rows = [
// //     ["F2 FIT FACTORY"],
// //     ["BALANCE SHEET REPORT"],
// //     [filterLabel],
// //     [],
// //     ["SUMMARY"],
// //     ["Total Income", totalIncome],
// //     ["Total Expenses", totalExpense],
// //     ["Net Balance", netBalance],
// //     [],
// //     ["TRANSACTIONS"],
// //     [
// //       "Date",
// //       "Type",
// //       "Category",
// //       "Description",
// //       "Amount",
// //       "Payment Mode",
// //       "Notes",
// //     ],
// //   ];

// //   entries.forEach((e) => {
// //     rows.push([
// //       e.date,
// //       e.type,
// //       e.category,
// //       e.description,
// //       e.amount,
// //       e.paymentMode,
// //       e.notes || "",
// //     ]);
// //   });

// //   const worksheet = XLSX.utils.aoa_to_sheet(rows);

// //   // Column widths
// //   worksheet["!cols"] = [
// //     { wch: 14 },
// //     { wch: 14 },
// //     { wch: 24 },
// //     { wch: 35 },
// //     { wch: 14 },
// //     { wch: 16 },
// //     { wch: 28 },
// //   ];

// //   XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");

// //   const excelBuffer = XLSX.write(workbook, {
// //     bookType: "xlsx",
// //     type: "array",
// //   });

// //   const fileData = new Blob([excelBuffer], {
// //     type:
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //   });

// //   saveAs(fileData, `F2_Balance_Sheet_${filterLabel}.xlsx`);
// // };
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const exportBalanceSheetPDF = ({
//   entries,
//   totalIncome,
//   totalExpense,
//   netBalance,
//   filterLabel,
// }) => {
//   const doc = new jsPDF();

//   const pageWidth = doc.internal.pageSize.getWidth();

//   // =========================
//   // HEADER
//   // =========================
//   doc.setFontSize(22);
//   doc.setTextColor(230, 51, 41);
//   doc.text("F2 FIT FACTORY", pageWidth / 2, 18, { align: "center" });

//   doc.setFontSize(15);
//   doc.setTextColor(40);
//   doc.text("FINANCIAL REPORT", pageWidth / 2, 28, {
//     align: "center",
//   });

//   doc.setFontSize(11);
//   doc.setTextColor(90);

//   doc.text(`Period: ${filterLabel}`, 14, 40);

//   doc.text(
//     `Generated: ${new Date().toLocaleString()}`,
//     14,
//     47
//   );

//   // =========================
//   // SUMMARY BOX
//   // =========================
//   doc.setDrawColor(220);
//   doc.roundedRect(14, 58, 182, 38, 3, 3);

//   doc.setFontSize(13);
//   doc.setTextColor(20);
//   doc.text("Financial Summary", 18, 68);

//   doc.setFontSize(11);

//   doc.setTextColor(34, 197, 94);
//   doc.text(
//     `Total Income: ₹${totalIncome.toLocaleString()}`,
//     18,
//     78
//   );

//   doc.setTextColor(230, 51, 41);
//   doc.text(
//     `Total Expenses: ₹${totalExpense.toLocaleString()}`,
//     18,
//     86
//   );

//   doc.setTextColor(netBalance >= 0 ? 200 : 230, netBalance >= 0 ? 160 : 51, 41);

//   doc.text(
//     `Net Balance: ${
//       netBalance >= 0 ? "+" : "-"
//     }₹${Math.abs(netBalance).toLocaleString()}`,
//     110,
//     78
//   );

//   doc.setTextColor(40);

//   doc.text(
//     `Status: ${netBalance >= 0 ? "PROFIT" : "LOSS"}`,
//     110,
//     86
//   );

//   // =========================
//   // TABLE
//   // =========================
//   autoTable(doc, {
//     startY: 108,

//     head: [[
//       "Date",
//       "Type",
//       "Category",
//       "Description",
//       "Mode",
//       "Amount",
//     ]],

//     body: entries.map((e) => [
//       e.date,
//       e.type === "income" ? "Income" : "Expense",
//       e.category,
//       e.description,
//       e.paymentMode,
//       `₹${Number(e.amount).toLocaleString()}`,
//     ]),

//     styles: {
//       fontSize: 9,
//       cellPadding: 3,
//     },

//     headStyles: {
//       fillColor: [20, 20, 20],
//       textColor: 255,
//       fontStyle: "bold",
//     },

//     alternateRowStyles: {
//       fillColor: [248, 248, 248],
//     },

//     columnStyles: {
//       5: {
//         halign: "right",
//       },
//     },
//   });

//   // =========================
//   // FOOTER
//   // =========================
//   const finalY = doc.lastAutoTable.finalY + 18;

//   doc.setFontSize(10);
//   doc.setTextColor(100);

//   doc.text(
//     "This is a system-generated financial report from F2 FIT FACTORY.",
//     14,
//     finalY
//   );

//   doc.text(
//     "Authorized Partner Signature:",
//     14,
//     finalY + 22
//   );

//   doc.line(75, finalY + 22, 150, finalY + 22);

//   doc.text(
//     "Prepared By: F2 FIT FACTORY Admin System",
//     14,
//     finalY + 38
//   );

//   // =========================
//   // SAVE
//   // =========================
//   doc.save(`F2_Financial_Report_${filterLabel}.pdf`);
// };
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportBalanceSheetPDF = ({
  entries,
  totalIncome,
  totalExpense,
  netBalance,
  filterLabel,
}) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  // HEADER
  doc.setFontSize(22);
  doc.setTextColor(230, 51, 41);
  doc.text("F2 FIT FACTORY", pageWidth / 2, 18, {
    align: "center",
  });

  doc.setFontSize(15);
  doc.setTextColor(40);
  doc.text("FINANCIAL REPORT", pageWidth / 2, 28, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setTextColor(90);

  doc.text(`Period: ${filterLabel}`, 14, 40);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    47
  );

  // SUMMARY BOX
  doc.setDrawColor(220);
  doc.roundedRect(14, 58, 182, 38, 3, 3);

  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text("Financial Summary", 18, 68);

  doc.setFontSize(11);

  doc.setTextColor(34, 197, 94);
  doc.text(
    `Total Income: ₹${totalIncome.toLocaleString()}`,
    18,
    78
  );

  doc.setTextColor(230, 51, 41);
  doc.text(
    `Total Expenses: ₹${totalExpense.toLocaleString()}`,
    18,
    86
  );

  doc.setTextColor(200, 160, 41);

  doc.text(
    `Net Balance: ₹${netBalance.toLocaleString()}`,
    110,
    78
  );

  doc.setTextColor(40);

  doc.text(
    `Status: ${netBalance >= 0 ? "PROFIT" : "LOSS"}`,
    110,
    86
  );

  // TABLE
  autoTable(doc, {
    startY: 108,

    head: [[
      "Date",
      "Type",
      "Category",
      "Description",
      "Mode",
      "Amount",
    ]],

    body: entries.map((e) => [
      e.date,
      e.type,
      e.category,
      e.description,
      e.paymentMode,
      `₹${Number(e.amount).toLocaleString()}`,
    ]),

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [20, 20, 20],
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // FOOTER
  const finalY = doc.lastAutoTable.finalY + 20;

  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    "This is a system-generated financial report from F2 FIT FACTORY.",
    14,
    finalY
  );

  doc.text(
    "Authorized Signature:",
    14,
    finalY + 24
  );

  doc.line(60, finalY + 24, 150, finalY + 24);

  // SAVE
  doc.save(`F2_Financial_Report_${filterLabel}.pdf`);
};