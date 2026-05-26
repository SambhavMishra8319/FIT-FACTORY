// // components/member/MembershipTimeline.jsx

// export default function MembershipTimeline({
//   history = [],
// }) {
//   return (
//     <div className="card mb-20">
//       <div className="card-title">
//         Membership Timeline
//       </div>

//       {history.length === 0 ? (
//         <div className="form-label">
//           No history available.
//         </div>
//       ) : (
//         history.map((item) => (
//           <div
//             key={item.id}
//             className="timeline-item"
//             style={{
//               display: "flex",
//               gap: 12,
//               marginBottom: 16,
//             }}
//           >
//             <div
//               style={{
//                 width: 12,
//                 height: 12,
//                 borderRadius: "50%",
//                 background:
//                   "var(--gold)",
//                 marginTop: 5,
//               }}
//             />

//             <div>
//               <div
//                 style={{
//                   fontWeight: 700,
//                 }}
//               >
//                 {item.type}
//               </div>

//               <div
//                 style={{
//                   fontSize: 13,
//                   color:
//                     "var(--muted2)",
//                 }}
//               >
//                 {item.date}
//               </div>

//               <div
//                 style={{
//                   fontSize: 13,
//                 }}
//               >
//                 {item.plan}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
export default function MembershipTimeline({
  history = [],
}) {
  return (
    <div className="card">
      <div className="card-title">
        Membership Timeline
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          No history found
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="timeline-item"
          >
            <div className="timeline-dot" />

            <div>
              <strong>
                {item.type}
              </strong>

              <div className="timeline-date">
                {item.date}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}