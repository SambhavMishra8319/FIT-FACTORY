// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, onSnapshot,getMemberAttendance, } from "firebase/firestore";
// import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { doc, onSnapshot } from "firebase/firestore";
import { getMembershipStatus } from "../../utils/membershipStatus";
import {
  doc,
  onSnapshot,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { format } from "date-fns";
import {
  getMemberAttendance,
  getSteamBookingsByMember,
} from "../../firebase/service";
import { db } from "../../firebase/config";
import { getBCAReadings } from "../../firebase/service";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
// import { getMember, getMemberAttendance } from "../firebase/service";
export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [bcaReadings, setBcaReadings] = useState([]);
  const [steamHistory, setSteamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState(null);
  useEffect(() => {
  if (!id) return;

  setLoading(true);

  const unsub = onSnapshot(
    doc(db, "members", id),
    async (snap) => {
      if (!snap.exists()) {
        setMember(null);
        setLoading(false);
        return;
      }

      const memberData = { id: snap.id, ...snap.data() };
      setMember(memberData);

      try {
        const [att, bca, steam] = await Promise.all([
          getMemberAttendance(id),
          getBCAReadings(id),
          getSteamBookingsByMember(id),
        ]);

        att.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAttendance(att);
        setBcaReadings(bca);
        setSteamHistory(steam);
      } catch (err) {
        console.error("Error loading extra data:", err);
      }

      setLoading(false);
    }
  );

  return () => unsub();
}, [id]);
  useEffect(() => {
  if (!id) return;

  const ref = doc(db, "members", id);

  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      console.log("No member found for ID:", id);
      setMember(null);
      return;
    }

    setMember({ id: snap.id, ...snap.data() });
  });

  return () => unsub();
}, [id]);
// useEffect(() => {
//   if (!id) return;

//   const unsub = onSnapshot(doc(db, "members", id), (snap) => {
//     if (!snap.exists()) return;
//     setMember({ id: snap.id, ...snap.data() });
//   });

//   return () => unsub();
// }, [id]);
// useEffect(() => {
//   if (!id) return;

//   const loadExtra = async () => {
//     const att = await getMemberAttendance(id);
//     att.sort((a, b) => new Date(b.date) - new Date(a.date));
//     setAttendance(att);

//     const bca = await getBCAReadings(id);
//     setBcaReadings(bca);

//     const steam = await getSteamBookingsByMember(id);
//     setSteamHistory(steam);
//   };

//   loadExtra();
// }, [id]);
//  useEffect(() => {
//   if (!id) return;
    
//     const unsub = onSnapshot(doc(db, "members", id), async (snap) => {
//       if (!snap.exists()) return;

//       const memberData = {
//         id: snap.id,
//         ...snap.data(),
//       };
//       console.log("Member Data:", memberData);
//       console.log("Trainer ID:", memberData.trainerId);

//       setMember(memberData);
//       const ptQuery = query(
//         collection(db, "personalTraining"),
//         where("memberId", "==", memberData.id),
//       );

//       const ptSnap = await getDocs(ptQuery);

//       console.log("Member Name:", memberData.name);
//       console.log("PT Records Found:", ptSnap.size);

//       let trainerData = null;

// if (memberData.trainerId) {
//   const trainerSnap = await getDoc(
//     doc(db, "trainers", memberData.trainerId)
//   );

//   if (trainerSnap.exists()) {
//     trainerData = {
//       id: trainerSnap.id,
//       ...trainerSnap.data(),
//     };
//   }
// } 
// else if (!ptSnap.empty) {
//   const pt = ptSnap.docs[0].data();

//   trainerData = {
//     id: pt.trainerId,
//     name: pt.trainerName,
//   };
// }

// if (trainerData) setTrainer(trainerData);
//       // Load assigned trainer
//       if (memberData.trainerId) {
//         try {
//           const trainerSnap = await getDoc(
//             doc(db, "trainers", memberData.trainerId),
//           );

//           if (trainerSnap.exists()) {
//             setTrainer({
//               id: trainerSnap.id,
//               ...trainerSnap.data(),
//             });
//           }
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     });

//    const loadAttendance = async () => {
//   const att = await getMemberAttendance(id);

//   att.sort((a, b) => new Date(b.date) - new Date(a.date));

//   setAttendance(att);
// };

//     const loadBCA = async () => {
//       const data = await getBCAReadings(id);
//       setBcaReadings(data);
//     };

//     const loadSteamHistory = async () => {
//       const data = await getSteamBookingsByMember(id);
//       setSteamHistory(data);
//     };

//     loadAttendance();
//     loadBCA();
//     loadSteamHistory();

//     return () => unsub();
//   }, [id]);
 if (loading) {
    return (
      <div className="page-enter">
        <div className="page-body">
          <div className="card">Loading member profile...</div>
        </div>
      </div>
    );
  }
  if (loading) {
  return <div className="card">Loading member profile...</div>;
}

if (!member) {
  return <div className="card">Member not found (invalid ID)</div>;
}
  // const latestBCA = bcaReadings[0];
  const latestBCA = bcaReadings?.[0] || null;
  const thisMonth = format(new Date(), "yyyy-MM");

  const chartData = (bcaReadings || [])
  .slice()
  .reverse()
  .map((r) => ({
    date: r.date?.slice(5),
    weight: Number(r.weight),
    fat: Number(r.fat),
    muscle: Number(r.muscle),
  }));
  // const membershipStatus = getMembershipStatus();
  const membershipStatus = getMembershipStatus(member?.expiryDate);
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
              <h2 style={{ marginBottom: 6 }}>{member.name}</h2>

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
              onClick={() => navigate(`/members/${member.id}/edit`)}
            >
              Edit Member
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
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
  a.date && a.date.slice(0, 7) === thisMonth
).length
              }
            </div>
          </div>

          <div className="stat-card s-red">
            <div className="stat-label">Last Visit</div>

            <div className="stat-value c-red" style={{ fontSize: 15 }}>
              {attendance[0]?.date || "—"}
            </div>
          </div>

          <div className="stat-card s-gold">
            <div className="stat-label">Amount Paid</div>

            <div className="stat-value c-gold">
              ₹{Number(member.amountPaid || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* MEMBER DETAILS */}
        <div className="card mb-20">
          <div className="card-title">Member Information</div>

          <div className="details-grid">
            <div className="form-group">
              <div className="form-label">Full Name</div>
              <div>{member.name || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Phone Number</div>
              <div>{member.phone || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Email</div>
              <div>{member.email || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Gender</div>
              <div>{member.gender || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Age</div>
              <div>{member.age || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Goal</div>
              <div>{member.goal || "—"}</div>
            </div>
            <div className="form-group">
              <div className="form-label">Assigned Trainer</div>
              <div>{trainer ? trainer.name : "No Trainer Assigned"}</div>
            </div>
            <div className="form-group">
              <div className="form-label">Membership Plan</div>
              <div>{member.plan || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Join Date</div>
              <div>{member.joinDate || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Membership Start</div>
              <div>{member.membershipStart || "—"}</div>
            </div>

            <div className="form-group">
              <div className="form-label">Expiry Date</div>
              <div>{member.expiryDate || "—"}</div>
            </div>
            <div className="form-group">
              <div className="form-label">Status</div>

              <div>
                <span
                  className={`badge ${
                    membershipStatus === "active"
                      ? "badge-green"
                      : membershipStatus === "expiring"
                        ? "badge-gold"
                        : membershipStatus === "expired"
                          ? "badge-red"
                          : "badge-gray"
                  }`}
                >
                  {membershipStatus === "active"
                    ? "Active"
                    : membershipStatus === "expiring"
                      ? "Expiring Soon"
                      : membershipStatus === "expired"
                        ? "Expired"
                        : "Pending"}
                </span>
              </div>
            </div>
            {/* <div className="form-group">
              <div className="form-label">Status</div>

              <div>
                <span
                  className={`badge ${
                    member.status === "active"
                      ? "badge-green"
                      : member.status === "expiring"
                        ? "badge-gold"
                        : "badge-red"
                  }`}
                >
                  {member.status || "inactive"}
                </span>
              </div>

            </div> */}

            <div className="form-group">
              <div className="form-label">Address</div>
              <div>{member.address || "—"}</div>
            </div>
          </div>
        </div>
        <div className="card mt-20">
          <div className="card-title">Steam Bath History</div>

          {steamHistory.length === 0 ? (
            <div className="form-label">No steam bookings yet.</div>
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
        <div className="card mt-20">
          <div className="card-title">Body Composition Analysis</div>

          {bcaReadings.length === 0 ? (
            <div className="form-label">No BCA reports yet.</div>
          ) : (
            <>
              {/* BCA STATS */}
              <div className="stats-grid mb-20">
                <div className="stat-card s-red">
                  <div className="stat-label">Weight</div>

                  <div className="stat-value c-red">
                    {latestBCA?.weight || 0} kg
                  </div>
                </div>

                <div className="stat-card s-gold">
                  <div className="stat-label">Body Fat</div>

                  <div className="stat-value c-gold">
                    {latestBCA?.fat || 0}%
                  </div>
                </div>

                <div className="stat-card s-green">
                  <div className="stat-label">Muscle Mass</div>

                  <div className="stat-value c-green">
                    {latestBCA?.muscle || 0} kg
                  </div>
                </div>

                <div className="stat-card s-blue">
                  <div className="stat-label">BMI</div>

                  <div className="stat-value c-blue">{latestBCA?.bmi || 0}</div>
                </div>
              </div>

              {/* CHART */}
              <div className="card mb-20">
                <div className="card-title">Progress Trend</div>

                {chartData.length < 2 ? (
                  <div
                    style={{
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted2)",
                    }}
                  >
                    Add 2+ BCA readings
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#f5c842"
                        strokeWidth={3}
                      />

                      <Line
                        type="monotone"
                        dataKey="fat"
                        stroke="#ef4444"
                        strokeWidth={3}
                      />

                      <Line
                        type="monotone"
                        dataKey="muscle"
                        stroke="#22c55e"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* BCA TABLE */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight</th>
                      <th>Fat%</th>
                      <th>Muscle</th>
                      <th>BMI</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bcaReadings.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td>

                        <td>{r.weight} kg</td>

                        <td>{r.fat}%</td>

                        <td>{r.muscle} kg</td>

                        <td>{r.bmi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        {/* ATTENDANCE */}
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
      </div>
    </div>
  );
}
