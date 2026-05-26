// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, onSnapshot,getMemberAttendance, } from "firebase/firestore";
// import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";

import { db } from "../firebase/config";

import { getMember, getMemberAttendance } from "../firebase/service";
export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState([]);


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
  const unsub = onSnapshot(doc(db, "members", id), (snap) => {
    if (snap.exists()) {
      setMember({
        id: snap.id,
        ...snap.data(),
      });
    }
  });

  const loadAttendance = async () => {
    const att = await getMemberAttendance(id);
    setAttendance(att);
  };

  loadAttendance();

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
        {/* PROFILE CARD */}
        <div className="card mb-20">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "var(--grad-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
                color: "#000",
              }}
            >
              {member.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h2 style={{ marginBottom: 6 }}>{member.name}</h2>

              <div style={{ color: "var(--muted2)" }}>📞 {member.phone}</div>

              <div style={{ color: "var(--muted2)" }}>
                🆔 {member.memberId || "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className="stats-grid mb-20">
          <div className="stat-card s-green">
            <div className="stat-label">Total Check-ins</div>
            <div className="stat-value c-green">{attendance.length}</div>
          </div>

          <div className="stat-card s-gold">
            <div className="stat-label">This Month</div>
            <div className="stat-value c-gold">
              {
                attendance.filter((a) =>
                  a.date?.startsWith(format(new Date(), "yyyy-MM")),
                ).length
              }
            </div>
          </div>

          <div className="stat-card s-red">
            <div className="stat-label">Last Visit</div>
            <div className="stat-value c-red" style={{ fontSize: 16 }}>
              {attendance[0]?.date || "—"}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Attendance History</div>

          {attendance.length === 0 ? (
            <div className="form-label">No attendance yet.</div>
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
                        <span className="badge badge-green">Present</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* INFO GRID */}
        <div className="stats-grid">
          <div className="stat-card s-green">
            <div className="stat-label">Plan</div>
            <div className="stat-value c-green">{member.plan || "—"}</div>
          </div>

          <div className="stat-card s-red">
            <div className="stat-label">Goal</div>
            <div className="stat-value c-red">{member.goal || "—"}</div>
          </div>

          <div className="stat-card s-gold">
            <div className="stat-label">Expiry</div>
            <div className="stat-value c-gold">{member.expiryDate || "—"}</div>
          </div>

          <div className="stat-card s-gold">
            <div className="stat-label">Paid</div>
            <div className="stat-value c-gold">
              ₹{Number(member.amountPaid || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* EXTRA DETAILS */}
        <div className="card mt-20">
          <div className="card-title">Member Details</div>

          <div className="form-group">
            <div className="form-label">Gender</div>
            <div>{member.gender || "—"}</div>
          </div>

          <div className="form-group">
            <div className="form-label">Age</div>
            <div>{member.age || "—"}</div>
          </div>

          <div className="form-group">
            <div className="form-label">Address</div>
            <div>{member.address || "—"}</div>
          </div>

          <div className="form-group">
            <div className="form-label">Joined</div>
            <div>{member.joinDate || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
