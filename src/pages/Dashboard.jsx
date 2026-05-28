
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordPaymentAndActivate } from "../firebase/service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  format,
  addDays,
  subDays,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
  addMonths,
} from "date-fns";

import toast from "react-hot-toast";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy, addDoc, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

import {
  getAllMembers,
  getPayments,
  getAttendance,
  addNotification,
} from "../firebase/service";

export default function Dashboard() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [signups, setSignups] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
const [selectedPlans, setSelectedPlans] = useState({});
  // FILTER
  const [expiryFilter, setExpiryFilter] = useState("week");

  const now = new Date();

  const today = format(now, "yyyy-MM-dd");
  const thisMonth = format(now, "yyyy-MM");


// const handleAssignPlan = async (user) => {
//   const plan = selectedPlans[user.id];

//   if (!plan) {
//     toast.error("Select a plan first");
//     return;
//   }

//   try {
//     console.log("ASSIGN STARTED");

//     // STEP 1: Activate member + payment (BEST METHOD)
//     await recordPaymentAndActivate(
//       {
//         memberId: user.id,
//         memberName: user.name,
//         email: user.email,
//         plan,
//         amount:
//           plan === "Monthly"
//             ? 1499
//             : plan === "Quarterly"
//             ? 3999
//             : 9999,
//         method: "Admin",
//       },
//       user.id,
//       plan === "Monthly"
//         ? 1
//         : plan === "Quarterly"
//         ? 3
//         : 12
//     );

//     toast.success(`${user.name} assigned ${plan}`);

//     // STEP 2: REMOVE from UI instantly
//     setSignups((prev) =>
//       prev.filter((u) => u.id !== user.id)
//     );

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to assign plan");
//   }
// };
//   // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        const [m, p, a] = await Promise.all([
          getAllMembers(),
          getPayments(),
          getAttendance(),
        ]);

        if (!mounted) return;

        setMembers(Array.isArray(m) ? m : []);
        setPayments(Array.isArray(p) ? p : []);
        setAttendance(Array.isArray(a) ? a : []);

        const usersSnap = await getDocs(
          query(
            collection(db, "users"),
            where("role", "==", "member"),
            orderBy("createdAt", "desc"),
            limit(20)
          )
        );

        const allUsers = usersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        if (!mounted) return;

        setSignups(allUsers);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAll();

    const timer = setTimeout(() => {
      if (mounted) {
        setVisible(true);
      }
    }, 60);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  // =========================
  // MEMBER MAP
  // =========================
  const memberMap = useMemo(() => {
    return new Map(
      members.map((m) => [
        (m.email || "").trim().toLowerCase(),
        m,
      ])
    );
  }, [members]);

  // =========================
  // ACTIVE MEMBERS
  // =========================
  const activeMembers = useMemo(() => {
    return members.filter((m) => m.status === "active");
  }, [members]);

  // =========================
  // EXPIRED MEMBERS
  // =========================
  const expiredMembers = useMemo(() => {
    return members.filter((m) => {
      
      if (!m.expiryDate) return false;

      try {
        const exp = parseISO(m.expiryDate);

        return exp < startOfDay(now);
      } catch {
        return false;
      }
    });
  }, [members, now]);

  // =========================
  // EXPIRING FILTER
  // =========================
  const expiringMembers = useMemo(() => {
  const today = new Date();

  const todayStr = format(today, "yyyy-MM-dd");

  let futureDate = new Date();

  switch (expiryFilter) {
    case "today":
      futureDate = today;
      break;

    case "week":
      futureDate.setDate(futureDate.getDate() + 7);
      break;

    case "month":
      futureDate.setMonth(futureDate.getMonth() + 1);
      break;

    case "3months":
      futureDate.setMonth(futureDate.getMonth() + 3);
      break;

    default:
      futureDate.setDate(futureDate.getDate() + 7);
  }

  const futureStr = format(futureDate, "yyyy-MM-dd");

  return members.filter((m) => {
    if (!m.expiryDate) return false;

    if ((m.status || "").toLowerCase() !== "active") {
      return false;
    }

    // STRING COMPARISON
    return (
      m.expiryDate >= todayStr &&
      m.expiryDate <= futureStr
    );
  });
}, [members, expiryFilter]);

  // =========================
  // TODAY CHECKINS
  // =========================
  const todayCheckins = useMemo(() => {
    return attendance.filter(
      (a) => a.date === today
    ).length;
  }, [attendance, today]);

  // =========================
  // MONTH REVENUE
  // =========================
  const monthRevenue = useMemo(() => {
    return payments
      .filter((p) =>
        p.date?.startsWith(thisMonth)
      )
      .reduce(
        (sum, p) =>
          sum + (Number(p.amount) || 0),
        0
      );
  }, [payments, thisMonth]);

  // =========================
  // REVENUE FORMAT
  // =========================
  const revenueDisplay =
    monthRevenue >= 100000
      ? `₹${(monthRevenue / 100000).toFixed(
          1
        )}L`
      : monthRevenue >= 1000
      ? `₹${(monthRevenue / 1000).toFixed(
          1
        )}k`
      : `₹${monthRevenue}`;

  // =========================
  // ATTENDANCE MAP
  // =========================
  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach((a) => {
      map[a.date] =
        (map[a.date] || 0) + 1;
    });

    return map;
  }, [attendance]);

  // =========================
  // WEEK DATA
  // =========================
  const weekDays = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, i) => {
        const d = subDays(now, 6 - i);

        const dateKey = format(
          d,
          "yyyy-MM-dd"
        );

        return {
          day: format(d, "EEE"),
          checkins:
            attendanceMap[dateKey] || 0,
        };
      }
    );
  }, [attendanceMap, now]);

  // =========================
  // EMAIL SET
  // =========================
  const memberEmails = useMemo(() => {
    return new Set(
      members.map((m) =>
        (m.email || "")
          .trim()
          .toLowerCase()
      )
    );
  }, [members]);

  // =========================
  // NEW SIGNUPS
  // =========================
  const newAppSignups = useMemo(() => {
    return signups.filter(
      (u) =>
        u.email &&
        !memberEmails.has(
          u.email
            .trim()
            .toLowerCase()
        )
    );
  }, [signups, memberEmails]);


const handleAssignPlan = async (user) => {
  const plan = selectedPlans[user.id];

  if (!plan) return toast.error("Select a plan first");

  try {
    console.log("ASSIGN STARTED");

    const amount =
      plan === "Monthly"
        ? 1499
        : plan === "Quarterly"
        ? 3999
        : 9999;

    const planMonths =
      plan === "Monthly"
        ? 1
        : plan === "Quarterly"
        ? 3
        : 12;

    // 1. CREATE MEMBER FIRST
    const memberRef = await addDoc(collection(db, "members"), {
      name: user.name,
      email: user.email,
      status: "active",
      plan,
      createdAt: serverTimestamp(),
    });

    // 2. RECORD PAYMENT + ACTIVATE
    await recordPaymentAndActivate(
      {
        memberId: memberRef.id,
        memberName: user.name,
        email: user.email,
        plan,
        amount,
        method: "Admin",
      },
      memberRef.id,
      planMonths
    );

    toast.success(`${user.name} assigned ${plan}`);

    setSignups((prev) =>
      prev.filter((u) => u.id !== user.id)
    );
  } catch (err) {
    console.error(err);
    toast.error("Failed to assign plan");
  }
};
  // =========================
  // STATS
  // =========================
  const stats = [
    {
      label: "Total Members",
      value: members.length,
      sub: `${activeMembers.length} active`,
      cls: "s-gold",
      val: "c-gold",
    },

    {
      label: "App Signups",
      value: newAppSignups.length,
      sub: "Pending conversions",
      cls: "s-green",
      val: "c-green",
    },

    {
      label: "Today Check-ins",
      value: todayCheckins,
      sub: "Live attendance",
      cls: "s-gold",
      val: "c-gold",
    },

    {
      label: "Monthly Revenue",
      value: revenueDisplay,
      sub: "This month",
      cls: "s-red",
      val: "c-red",
    },
  ];

  // =========================
  // ANIMATION
  // =========================
  const anim = (delay) => ({
    opacity: visible ? 1 : 0,

    transform: visible
      ? "translateY(0) scale(1)"
      : "translateY(16px) scale(0.96)",

    transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
  });

  const tooltipStyle = {
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "'Exo 2',sans-serif",
  };

  return (
    <div className="page-enter">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="page-title">
          Dashboard
        </div>

        <div className="topbar-right">
          <span
            style={{
              fontSize: 11,
              color: "var(--muted2)",
            }}
          >
            {format(
              now,
              "EEE, d MMM yyyy"
            )}
          </span>

          <button
            className="btn btn-primary btn-sm tap-scale btn-ripple"
            onClick={() =>
              navigate("/add-member")
            }
          >
            + Add Member
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* STATS */}
        <div className="stats-grid mb-20">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`stat-card ${s.cls}`}
              style={anim(i * 0.07)}
            >
              <div className="stat-label">
                {s.label}
              </div>

              <div
                className={`stat-value ${s.val}`}
              >
                {loading ? "—" : s.value}
              </div>

              <div className="stat-sub">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid-2 mb-20">
          {/* ATTENDANCE */}
          <div
            className="card"
            style={anim(0.28)}
          >
            <div className="card-title">
              Weekly Attendance
            </div>

            <ResponsiveContainer
              width="100%"
              height={140}
            >
              <BarChart
                data={weekDays}
                margin={{
                  top: 0,
                  right: 0,
                  left: -30,
                  bottom: 0,
                }}
              >
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#666",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#666",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Bar
                  dataKey="checkins"
                  radius={[4, 4, 0, 0]}
                >
                  {weekDays.map(
                    (_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === 6
                            ? "#f5c842"
                            : "#c9a227"
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PAYMENTS */}
          <div
            className="card"
            style={anim(0.32)}
          >
            <div className="card-title">
              Recent Payments
            </div>

            {payments.length === 0 ? (
              <div
                style={{
                  color:
                    "var(--muted2)",
                  fontSize: 13,
                  padding: "20px 0",
                  textAlign: "center",
                }}
              >
                No payments yet
              </div>
            ) : (
              payments
                .slice(0, 5)
                .map((p) => (
                  <div
                    key={p.id}
                    className="activity-item"
                  >
                    <div className="activity-dot green" />

                    <div>
                      <div className="activity-text">
                        ₹
                        {Number(
                          p.amount
                        ).toLocaleString()}{" "}
                        —{" "}
                        <strong>
                          {
                            p.memberName
                          }
                        </strong>
                      </div>

                      <div className="activity-time">
                        {p.date} ·{" "}
                        {p.method}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
{/* PENDING CONVERSIONS */}
<div className="card mb-20" style={anim(0.22)}>
  <div className="card-title">
    📲 Pending Conversions ({newAppSignups.length})
  </div>

  {newAppSignups.length === 0 ? (
    <div style={{ color: "var(--muted2)", fontSize: 13 }}>
      No pending signups
    </div>
  ) : (
    newAppSignups.slice(0, 6).map((u) => (
      <div
        key={u.id}
        className="activity-item"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* LEFT */}
        <div>
          <div className="activity-text">
            {u.name || "No Name"}
          </div>
          <div className="activity-time">{u.email}</div>
        </div>

        {/* RIGHT CONTROLS */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* PLAN SELECT */}
          <select
            className="btn btn-outline btn-sm"
            value={selectedPlans[u.id] || ""}
            onChange={(e) =>
              setSelectedPlans((prev) => ({
                ...prev,
                [u.id]: e.target.value,
              }))
            }
          >
            <option value="">Plan</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>

          {/* ASSIGN BUTTON */}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleAssignPlan(u)}
          >
            Assign
          </button>
        </div>
      </div>
    ))
  )}
</div>
        {/* EXPIRING MEMBERS */}
        <div
          className="section-header mb-12"
          style={anim(0.4)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div className="section-title">
              ⚠ Membership Expiry (
              {expiringMembers.length})
            </div>

            {/* FILTERS */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  key: "today",
                  label: "Today",
                },

                {
                  key: "week",
                  label: "7 Days",
                },

                {
                  key: "month",
                  label: "1 Month",
                },

                {
                  key: "3months",
                  label: "3 Months",
                },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`btn btn-sm ${
                    expiryFilter === f.key
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() =>
                    setExpiryFilter(
                      f.key
                    )
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            {/* EXPIRED COUNT */}
            <div
              style={{
                fontSize: 12,
                color: "var(--red)",
                fontWeight: 600,
              }}
            >
              {expiredMembers.length} expired
            </div>

            {/* REMIND ALL */}
            {expiringMembers.length >
              0 && (
              <button
                className="btn btn-outline btn-sm tap-scale"
                onClick={async () => {
                  try {
                    for (const m of expiringMembers) {
                      await addNotification({
  memberId: m.id,
  memberEmail: m.email,
  title: "Membership Expiry",
  message: `Hi ${m.name}! Your membership expires on ${m.expiryDate}. Renew now 💪`,
  read: false,
  createdAt: serverTimestamp(),
});
                    }

                    toast.success(
                      "Reminders sent!"
                    );
                  } catch (err) {
                    console.error(
                      err
                    );

                    toast.error(
                      "Failed to send reminders"
                    );
                  }
                }}
              >
                📱 Remind All
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div
          className="table-wrap"
          style={anim(0.45)}
        >
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign:
                        "center",
                      padding: 24,
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : expiringMembers.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign:
                        "center",

                      padding: 24,

                      color:
                        "var(--muted2)",
                    }}
                  >
                    No expiring
                    memberships found
                  </td>
                </tr>
              ) : (
                expiringMembers.map(
                  (m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>
                          {m.name}
                        </strong>
                      </td>

                      <td>{m.plan}</td>

                      <td
                        style={{
                          color:
                            "var(--red)",
                          fontWeight: 600,
                        }}
                      >
                        {
                          m.expiryDate
                        }
                      </td>

                      <td>
                        <span className="badge badge-green">
                          {
                            m.status
                          }
                        </span>
                      </td>

                      <td
                        style={{
                          fontSize: 12,
                          color:
                            "var(--muted2)",
                        }}
                      >
                        {m.email ||
                          "—"}
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            navigate(
                              `/members/${m.id}/edit`
                            )
                          }
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAB */}
      <button
        className="fab tap-scale btn-ripple"
        onClick={() =>
          navigate("/add-member")
        }
      >
        +
      </button>
    </div>
  );
}

