// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, onSnapshot,getMemberAttendance, } from "firebase/firestore";
// import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import {
  getMember,
  getMemberAttendance,
  getSteamBookingsByMember,
} from "../firebase/service";
import { db } from "../firebase/config";

// import { getMember, getMemberAttendance } from "../firebase/service";
export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState([]);

const [steamHistory, setSteamHistory] = useState([]);
//   useEffect(() => {
//     const unsub = onSnapshot(doc(db, "members", id), (snap) => {
//       if (snap.exists()) {
//         setMember({
//           id: snap.id,
//           ...snap.data(),
//         });
//       }
//     });

//     return () => unsub();
//   }, [id]);
useEffect(() => {
  const unsub = onSnapshot(
    doc(db, "members", id),
    (snap) => {
      if (snap.exists()) {
        setMember({
          id: snap.id,
          ...snap.data(),
        });
      }
    }
  );

  const loadAttendance = async () => {
    const att = await getMemberAttendance(id);
    setAttendance(att);
  };

  const loadSteamHistory = async () => {
    const data =
      await getSteamBookingsByMember(id);

    setSteamHistory(data);
  };

  loadAttendance();
  loadSteamHistory();

  return () => unsub();
}, [id]);
  if (!member) {
    return (
      <div className="page-enter">
        <div className="page-body">
          <div className="card">Loading member profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Member Profile</div>

        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

<div className="page-body">

  {/* PROFILE HEADER */}
  <div className="card mb-20">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 82,
          height: 82,
          borderRadius: "50%",
          background: "var(--grad-gold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          fontWeight: 800,
          color: "#000",
          flexShrink: 0,
        }}
      >
        {member.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>

      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: 6 }}>
          {member.name}
        </h2>

        <div
          style={{
            color: "var(--muted2)",
            fontSize: 13,
            marginBottom: 4,
          }}
        >
          📞 {member.phone || "N/A"}
        </div>

        <div
          style={{
            color: "var(--muted2)",
            fontSize: 13,
            marginBottom: 4,
          }}
        >
          🆔 {member.memberId || "N/A"}
        </div>

        <div
          style={{
            color: "var(--muted2)",
            fontSize: 13,
          }}
        >
          📧 {member.email || "N/A"}
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() =>
          navigate(`/members/${member.id}/edit`)
        }
      >
        Edit Member
      </button>
    </div>
  </div>

  {/* QUICK STATS */}
  <div className="stats-grid mb-20">
    <div className="stat-card s-green">
      <div className="stat-label">
        Total Check-ins
      </div>

      <div className="stat-value c-green">
        {attendance.length}
      </div>
    </div>

    <div className="stat-card s-gold">
      <div className="stat-label">
        This Month
      </div>

      <div className="stat-value c-gold">
        {
          attendance.filter((a) =>
            a.date?.startsWith(
              format(new Date(), "yyyy-MM")
            )
          ).length
        }
      </div>
    </div>

    <div className="stat-card s-red">
      <div className="stat-label">
        Last Visit
      </div>

      <div
        className="stat-value c-red"
        style={{ fontSize: 15 }}
      >
        {attendance[0]?.date || "—"}
      </div>
    </div>

    <div className="stat-card s-gold">
      <div className="stat-label">
        Amount Paid
      </div>

      <div className="stat-value c-gold">
        ₹
        {Number(
          member.amountPaid || 0
        ).toLocaleString()}
      </div>
    </div>
  </div>

  {/* MEMBER DETAILS */}
  <div className="card mb-20">
    <div className="card-title">
      Member Information
    </div>

    <div className="details-grid">

      <div className="form-group">
        <div className="form-label">
          Full Name
        </div>
        <div>{member.name || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Phone Number
        </div>
        <div>{member.phone || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Email
        </div>
        <div>{member.email || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Gender
        </div>
        <div>{member.gender || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Age
        </div>
        <div>{member.age || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Goal
        </div>
        <div>{member.goal || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Membership Plan
        </div>
        <div>{member.plan || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Join Date
        </div>
        <div>{member.joinDate || "—"}</div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Membership Start
        </div>
        <div>
          {member.membershipStart || "—"}
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Expiry Date
        </div>
        <div>
          {member.expiryDate || "—"}
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Status
        </div>

        <div>
          <span className="badge badge-green">
            {member.status || "active"}
          </span>
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          Address
        </div>
        <div>{member.address || "—"}</div>
      </div>
    </div>
  </div>
<div className="card mt-20">
  <div className="card-title">
    Steam Bath History
  </div>

  {steamHistory.length === 0 ? (
    <div className="form-label">
      No steam bookings yet.
    </div>
  ) : (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Period</th>
            <th>Slot</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {steamHistory.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>

              <td>{s.date}</td>

              <td>{s.period}</td>

              <td>{s.slot}</td>

              <td>
                <span
                  className={`badge ${
                    s.status === "confirmed"
                      ? "badge-green"
                      : s.status === "pending"
                      ? "badge-gold"
                      : "badge-red"
                  }`}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  {/* ATTENDANCE */}
  <div className="card">
    <div className="card-title">
      Attendance History
    </div>

    {attendance.length === 0 ? (
      <div className="form-label">
        No attendance yet.
      </div>
    ) : (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>

                <td>{a.date}</td>

                <td>
                  <span className="badge badge-green">
                    Present
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
    </div>
  );
}
