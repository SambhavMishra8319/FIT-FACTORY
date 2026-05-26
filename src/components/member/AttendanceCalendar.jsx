// // components/member/WorkoutHistory.jsx

// export default function WorkoutHistory({
//   workouts = [],
// }) {
//   return (
//     <div className="card mb-20">
//       <div className="card-title">
//         Workout History
//       </div>

//       {workouts.length === 0 ? (
//         <div className="form-label">
//           No workouts yet.
//         </div>
//       ) : (
//         workouts.map((w) => (
//           <div
//             key={w.id}
//             className="activity-item"
//           >
//             <div className="activity-dot green" />

//             <div>
//               <div className="activity-text">
//                 {w.plan || "Workout"}
//               </div>

//               <div className="activity-time">
//                 {w.exercisesDone}/
//                 {w.total} exercises
//               </div>

//               <div className="activity-time">
//                 {w.completedAt}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

export default function AttendanceCalendar({
  attendance = [],
}) {
  const attendanceDates = attendance.map(
    (a) => a.date
  );

  const tileClassName = ({ date }) => {
    const d = format(date, "yyyy-MM-dd");

    return attendanceDates.includes(d)
      ? "present-day"
      : "absent-day";
  };

  const currentMonthDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const thisMonthAttendance =
    attendance.filter((a) =>
      a.date?.startsWith(
        format(new Date(), "yyyy-MM")
      )
    ).length;

  const percent = Math.round(
    (thisMonthAttendance /
      currentMonthDays) *
      100
  );

  return (
    <div className="card mb-20">
      <div className="card-title">
        Attendance Calendar
      </div>

      <div className="attendance-stats">
        <div className="big-percent">
          {percent}%
        </div>

        <div className="small-text">
          {thisMonthAttendance}/
          {currentMonthDays} days
        </div>
      </div>

      <Calendar
        tileClassName={tileClassName}
      />
    </div>
  );
}