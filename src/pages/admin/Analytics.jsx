
// // // ── Admin Analytics ───────────────────────────────────────
// // import { useEffect, useState } from "react";
// // import { getAllMembers, getPayments } from "../firebase/service";
// // import { format, subMonths } from "date-fns";
// // import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// // import toast from "react-hot-toast";

// // export function Analytics() {
// //   const [members, setMembers] = useState([]);
// //   const [payments, setPayments] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     Promise.all([getAllMembers(), getPayments()])
// //       .then(([m, p]) => { setMembers(m); setPayments(p); })
// //       .catch(() => toast.error("Could not load analytics."))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   // Revenue by month (last 6 months)
// //   const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
// //     const d = subMonths(new Date(), 5 - i);
// //     const key = format(d, "yyyy-MM");
// //     const label = format(d, "MMM");
// //     const rev = payments.filter(p => p.date?.startsWith(key)).reduce((s, p) => s + (Number(p.amount) || 0), 0);
// //     return { month: label, revenue: rev };
// //   });

// //   // Members by goal
// //   const goalCount = members.reduce((acc, m) => {
// //     acc[m.goal || "Other"] = (acc[m.goal || "Other"] || 0) + 1;
// //     return acc;
// //   }, {});
// //   const goalData = Object.entries(goalCount).map(([name, value]) => ({ name, value }));

// //   // Members by plan
// //   const planCount = members.reduce((acc, m) => {
// //     acc[m.plan || "Other"] = (acc[m.plan || "Other"] || 0) + 1;
// //     return acc;
// //   }, {});
// //   const planData = Object.entries(planCount).map(([name, value]) => ({ name, value }));

// //   // Payment methods
// //   const methodCount = payments.reduce((acc, p) => {
// //     acc[p.method || "Other"] = (acc[p.method || "Other"] || 0) + 1;
// //     return acc;
// //   }, {});
// //   const methodData = Object.entries(methodCount).map(([name, value]) => ({ name, value }));

// //   const COLORS = ["#f5c842", "#c9a227", "#e63329", "#22c55e", "#3b82f6", "#888"];

// //   const totalRevenue = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
// //   const thisMonth = format(new Date(), "yyyy-MM");
// //   const monthRevenue = payments.filter(p => p.date?.startsWith(thisMonth)).reduce((s, p) => s + (Number(p.amount) || 0), 0);
// //   const avgPerMember = members.length ? Math.round(totalRevenue / members.length) : 0;

// //   const tooltipStyle = { background: "#141414", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-body)" };

// //   return (
// //     <>
// //       <div className="topbar">
// //         <div className="page-title">Analytics</div>
// //         <div className="topbar-right">
// //           <span style={{ fontSize: 11, color: "var(--muted2)", fontFamily: "var(--font-body)" }}>
// //             Real-time from Firebase
// //           </span>
// //         </div>
// //       </div>
// //       <div className="page-body">
// //         {loading ? (
// //           <div style={{ textAlign: "center", padding: 60, color: "var(--muted2)" }}>Loading analytics…</div>
// //         ) : (
// //           <>
// //             {/* Key metrics */}
// //             <div className="stats-grid mb-20">
// //               <div className="stat-card s-gold">
// //                 <div className="stat-label">Total Revenue</div>
// //                 <div className="stat-value c-gold" style={{ fontSize: 22 }}>
// //                   ₹{totalRevenue >= 100000 ? (totalRevenue / 100000).toFixed(1) + "L" : (totalRevenue / 1000).toFixed(1) + "k"}
// //                 </div>
// //                 <div className="stat-sub">All time</div>
// //               </div>
// //               <div className="stat-card s-green">
// //                 <div className="stat-label">This Month</div>
// //                 <div className="stat-value c-green" style={{ fontSize: 22 }}>
// //                   ₹{monthRevenue >= 1000 ? (monthRevenue / 1000).toFixed(1) + "k" : monthRevenue}
// //                 </div>
// //                 <div className="stat-sub">{format(new Date(), "MMMM yyyy")}</div>
// //               </div>
// //               <div className="stat-card s-blue">
// //                 <div className="stat-label">Avg / Member</div>
// //                 <div className="stat-value c-blue" style={{ fontSize: 22 }}>₹{avgPerMember.toLocaleString()}</div>
// //                 <div className="stat-sub">Lifetime value</div>
// //               </div>
// //               <div className="stat-card s-gold">
// //                 <div className="stat-label">Total Members</div>
// //                 <div className="stat-value c-gold" style={{ fontSize: 22 }}>{members.length}</div>
// //                 <div className="stat-sub">{members.filter(m => m.status === "active").length} active</div>
// //               </div>
// //             </div>

// //             {/* Revenue chart */}
// //             <div className="card mb-16">
// //               <div className="card-title">Revenue — Last 6 Months</div>
// //               <ResponsiveContainer width="100%" height={200}>
// //                 <BarChart data={revenueByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
// //                   <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11, fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
// //                   <YAxis tick={{ fill: "#666", fontSize: 11, fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `₹${v/1000}k` : `₹${v}`} />
// //                   <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(245,200,66,0.06)" }} formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
// //                   <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
// //                     {revenueByMonth.map((_, i) => (
// //                       <Cell key={i} fill={i === revenueByMonth.length - 1 ? "#f5c842" : "#c9a227"} />
// //                     ))}
// //                   </Bar>
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>

// //             <div className="grid-2 mb-16">
// //               {/* Members by Goal */}
// //               <div className="card">
// //                 <div className="card-title">Members by Goal</div>
// //                 {goalData.length === 0 ? (
// //                   <div style={{ color: "var(--muted2)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No data yet.</div>
// //                 ) : (
// //                   <>
// //                     <ResponsiveContainer width="100%" height={140}>
// //                       <PieChart>
// //                         <Pie data={goalData} cx="50%" cy="50%" outerRadius={55} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
// //                           {goalData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
// //                         </Pie>
// //                         <Tooltip contentStyle={tooltipStyle} />
// //                       </PieChart>
// //                     </ResponsiveContainer>
// //                   </>
// //                 )}
// //               </div>

// //               {/* Payment methods */}
// //               <div className="card">
// //                 <div className="card-title">Payment Methods</div>
// //                 {methodData.length === 0 ? (
// //                   <div style={{ color: "var(--muted2)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No payments yet.</div>
// //                 ) : (
// //                   <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
// //                     {methodData.map((m, i) => (
// //                       <div key={i}>
// //                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
// //                           <span style={{ fontSize: 13, color: "var(--text2)" }}>{m.name}</span>
// //                           <span style={{ fontSize: 13, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{m.value}</span>
// //                         </div>
// //                         <div className="bca-track">
// //                           <div className="bca-fill gold" style={{ width: `${(m.value / payments.length) * 100}%`, background: COLORS[i % COLORS.length] }} />
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Plans */}
// //             <div className="card mb-16">
// //               <div className="card-title">Members by Plan</div>
// //               <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
// //                 {planData.map((p, i) => (
// //                   <div key={i} style={{
// //                     flex: 1, minWidth: 100, padding: "12px 14px",
// //                     background: "var(--card2)", borderRadius: "var(--r-sm)",
// //                     border: `1px solid ${COLORS[i % COLORS.length]}33`,
// //                   }}>
// //                     <div style={{ fontFamily: "var(--font-display)", fontSize: 9, color: COLORS[i % COLORS.length], letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
// //                       {p.name}
// //                     </div>
// //                     <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: COLORS[i % COLORS.length] }}>
// //                       {p.value}
// //                     </div>
// //                     <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 3 }}>
// //                       {((p.value / members.length) * 100).toFixed(0)}% of total
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </>
// //   );
// // }
// import { useEffect, useState, useMemo } from "react";
// import { getAllMembers, getPayments } from "../firebase/service";
// import { format, subMonths } from "date-fns";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";
// import toast from "react-hot-toast";

// export function Analytics() {
//   const [members, setMembers] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([getAllMembers(), getPayments()])
//       .then(([m, p]) => {
//         setMembers(m || []);
//         setPayments(p || []);
//       })
//       .catch(() => toast.error("Could not load analytics."))
//       .finally(() => setLoading(false));
//   }, []);

//   // ── Revenue by month (last 6 months)
//   const revenueByMonth = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => {
//       const d = subMonths(new Date(), 5 - i);
//       const key = format(d, "yyyy-MM");
//       const label = format(d, "MMM");

//       const rev = payments
//         .filter((p) => p.date?.startsWith(key))
//         .reduce((s, p) => s + (Number(p.amount) || 0), 0);

//       return { month: label, revenue: rev };
//     });
//   }, [payments]);

//   // ── Revenue metrics
//   const totalRevenue = useMemo(
//     () => payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
//     [payments]
//   );

//   const thisMonth = format(new Date(), "yyyy-MM");

//   const monthRevenue = useMemo(
//     () =>
//       payments
//         .filter((p) => p.date?.startsWith(thisMonth))
//         .reduce((s, p) => s + (Number(p.amount) || 0), 0),
//     [payments, thisMonth]
//   );

//   const lastMonthKey = format(subMonths(new Date(), 1), "yyyy-MM");

//   const lastMonthRevenue = useMemo(
//     () =>
//       payments
//         .filter((p) => p.date?.startsWith(lastMonthKey))
//         .reduce((s, p) => s + (Number(p.amount) || 0), 0),
//     [payments, lastMonthKey]
//   );

//   const revenueGrowth =
//     lastMonthRevenue > 0
//       ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
//       : 0;

//   const avgPerMember = members.length
//     ? Math.round(totalRevenue / members.length)
//     : 0;

//   // ── Expiring members (7 days)
//   const expiringSoon = useMemo(() => {
//     const today = new Date();
//     return members.filter((m) => {
//       if (!m.expiryDate) return false;
//       const diff =
//         (new Date(m.expiryDate) - today) / (1000 * 60 * 60 * 24);
//       return diff >= 0 && diff <= 7;
//     }).length;
//   }, [members]);

//   // ── Active / Inactive
//   const activeCount = members.filter((m) => m.status === "active").length;
//   const inactiveCount = members.length - activeCount;

//   const statusData = [
//     { name: "Active", value: activeCount },
//     { name: "Inactive", value: inactiveCount },
//   ];

//   // ── Members by goal
//   const goalData = useMemo(() => {
//     const acc = members.reduce((a, m) => {
//       a[m.goal || "Other"] = (a[m.goal || "Other"] || 0) + 1;
//       return a;
//     }, {});
//     return Object.entries(acc).map(([name, value]) => ({
//       name,
//       value,
//     }));
//   }, [members]);

//   // ── Payment methods
//   const methodData = useMemo(() => {
//     const acc = payments.reduce((a, p) => {
//       a[p.method || "Other"] = (a[p.method || "Other"] || 0) + 1;
//       return a;
//     }, {});
//     return Object.entries(acc).map(([name, value]) => ({
//       name,
//       value,
//     }));
//   }, [payments]);

//   // ── Top members
//   const topMembers = useMemo(() => {
//     return [...members]
//       .map((m) => ({
//         ...m,
//         spent: payments
//           .filter((p) => p.memberId === m.id)
//           .reduce((s, p) => s + Number(p.amount || 0), 0),
//       }))
//       .sort((a, b) => b.spent - a.spent)
//       .slice(0, 5);
//   }, [members, payments]);

//   const COLORS = ["#f5c842", "#c9a227", "#e63329", "#22c55e", "#3b82f6"];

//   const tooltipStyle = {
//     background: "#141414",
//     border: "1px solid #2a2a2a",
//     borderRadius: 8,
//     fontSize: 12,
//     fontFamily: "var(--font-body)",
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", padding: 60, color: "var(--muted2)" }}>
//         Loading analytics…
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="topbar">
//         <div className="page-title">Analytics</div>
//         <span style={{ fontSize: 11, color: "var(--muted2)" }}>
//           Live from Firebase
//         </span>
//       </div>

//       <div className="page-body">

//         {/* ── KPI CARDS ───────────────────────── */}
//         <div className="stats-grid mb-20">

//           <div className="stat-card s-gold">
//             <div className="stat-label">Total Revenue</div>
//             <div className="stat-value c-gold">
//               ₹{totalRevenue.toLocaleString()}
//             </div>
//             <div className="stat-sub">All time</div>
//           </div>

//           <div className="stat-card s-green">
//             <div className="stat-label">This Month</div>
//             <div className="stat-value c-green">
//               ₹{monthRevenue.toLocaleString()}
//             </div>
//             <div className="stat-sub">
//               {revenueGrowth >= 0 ? "▲" : "▼"}{" "}
//               {Math.abs(revenueGrowth).toFixed(1)}% vs last month
//             </div>
//           </div>

//           <div className="stat-card s-blue">
//             <div className="stat-label">Avg / Member</div>
//             <div className="stat-value c-blue">
//               ₹{avgPerMember.toLocaleString()}
//             </div>
//             <div className="stat-sub">Lifetime value</div>
//           </div>

//           <div className="stat-card s-red">
//             <div className="stat-label">Expiring Soon</div>
//             <div className="stat-value c-red">{expiringSoon}</div>
//             <div className="stat-sub">Next 7 days</div>
//           </div>

//         </div>

//         {/* ── REVENUE LINE CHART ───────────────── */}
//         <div className="card mb-16">
//           <div className="card-title">Revenue Trend</div>

//           <ResponsiveContainer width="100%" height={220}>
//             <LineChart data={revenueByMonth}>
//               <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} />
//               <YAxis tick={{ fill: "#666", fontSize: 11 }} />
//               <Tooltip contentStyle={tooltipStyle} />
//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#f5c842"
//                 strokeWidth={3}
//                 dot={{ r: 4 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* ── PIE + STATUS ─────────────────────── */}
//         <div className="grid-2 mb-16">

//           <div className="card">
//             <div className="card-title">Members Status</div>

//             <ResponsiveContainer width="100%" height={160}>
//               <PieChart>
//                 <Pie
//                   data={statusData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={60}
//                   dataKey="value"
//                 >
//                   {statusData.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="card">
//             <div className="card-title">Payment Methods</div>

//             {methodData.map((m, i) => (
//               <div key={i} style={{ marginBottom: 10 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <span style={{ fontSize: 13 }}>{m.name}</span>
//                   <span style={{ color: COLORS[i % COLORS.length] }}>
//                     {m.value}
//                   </span>
//                 </div>
//                 <div className="bca-track">
//                   <div
//                     className="bca-fill gold"
//                     style={{
//                       width: `${(m.value / payments.length) * 100}%`,
//                       background: COLORS[i % COLORS.length],
//                     }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//         </div>

//         {/* ── TOP MEMBERS ─────────────────────── */}
//         <div className="card">
//           <div className="card-title">Top Members</div>

//           {topMembers.map((m, i) => (
//             <div
//               key={m.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 padding: "8px 0",
//                 borderBottom: "1px solid #222",
//               }}
//             >
//               <span>{i + 1}. {m.name}</span>
//               <span style={{ color: "#f5c842" }}>
//                 ₹{m.spent.toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>

//       </div>
//     </>
//   );
// }
import { useEffect, useState, useMemo } from "react";
import { getAllMembers, getPayments } from "../../firebase/service";
import { format, subMonths, parseISO, differenceInDays } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import toast from "react-hot-toast";

export default function Analytics() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllMembers(), getPayments()])
      .then(([m, p]) => {
        setMembers(m || []);
        setPayments(p || []);
      })
      .catch(() => toast.error("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  // ── Revenue by month
  const revenueByMonth = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i);
      const key = format(d, "yyyy-MM");

      const revenue = payments
        .filter((p) => p.date?.startsWith(key))
        .reduce((s, p) => s + (Number(p.amount) || 0), 0);

      return {
        month: format(d, "MMM"),
        revenue,
      };
    });
  }, [payments]);

  // ── Revenue metrics
  const totalRevenue = useMemo(
    () => payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    [payments]
  );

  const thisMonthKey = format(new Date(), "yyyy-MM");
  const lastMonthKey = format(subMonths(new Date(), 1), "yyyy-MM");

  const monthRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.date?.startsWith(thisMonthKey))
        .reduce((s, p) => s + (Number(p.amount) || 0), 0),
    [payments, thisMonthKey]
  );

  const lastMonthRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.date?.startsWith(lastMonthKey))
        .reduce((s, p) => s + (Number(p.amount) || 0), 0),
    [payments, lastMonthKey]
  );

  const revenueGrowth =
    lastMonthRevenue > 0
      ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

  // ── Active / inactive
  const activeCount = useMemo(
    () => members.filter((m) => m.status === "active").length,
    [members]
  );

  const inactiveCount = members.length - activeCount;

  const statusData = useMemo(
    () => [
      { name: "Active", value: activeCount },
      { name: "Inactive", value: inactiveCount },
    ],
    [activeCount, inactiveCount]
  );

  // ── Expiring soon (7 days SAFE)
  const expiringSoon = useMemo(() => {
    return members.filter((m) => {
      if (!m.expiryDate) return false;

      try {
        const diff = differenceInDays(
          parseISO(m.expiryDate),
          new Date()
        );
        return diff >= 0 && diff <= 7;
      } catch {
        return false;
      }
    }).length;
  }, [members]);

  // ── Members by goal
  const goalData = useMemo(() => {
    const map = members.reduce((acc, m) => {
      const key = m.goal || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [members]);

  // ── Payment methods
  const methodData = useMemo(() => {
    const map = payments.reduce((acc, p) => {
      const key = p.method || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [payments]);

  // ── Top members
  const topMembers = useMemo(() => {
    return members
      .map((m) => ({
        ...m,
        spent: payments
          .filter((p) => p.memberId === m.id)
          .reduce((s, p) => s + (Number(p.amount) || 0), 0),
      }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);
  }, [members, payments]);

  const COLORS = ["#f5c842", "#c9a227", "#e63329", "#22c55e", "#3b82f6"];

  const tooltipStyle = {
    background: "#141414",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "var(--font-body)",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--muted2)" }}>
        Loading analytics…
      </div>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="page-title">Analytics</div>
        <span style={{ fontSize: 11, color: "var(--muted2)" }}>
          Live from Firebase
        </span>
      </div>

      <div className="page-body">

        {/* KPI CARDS */}
        <div className="stats-grid mb-20">

          <div className="stat-card s-gold">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value c-gold">
              ₹{totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="stat-card s-green">
            <div className="stat-label">This Month</div>
            <div className="stat-value c-green">
              ₹{monthRevenue.toLocaleString()}
            </div>
            <div className="stat-sub">
              {revenueGrowth >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(revenueGrowth).toFixed(1)}% vs last month
            </div>
          </div>

          <div className="stat-card s-blue">
            <div className="stat-label">Avg / Member</div>
            <div className="stat-value c-blue">
              ₹{Math.round(totalRevenue / (members.length || 1)).toLocaleString()}
            </div>
          </div>

          <div className="stat-card s-red">
            <div className="stat-label">Expiring Soon</div>
            <div className="stat-value c-red">{expiringSoon}</div>
          </div>

        </div>

        {/* LINE CHART */}
        <div className="card mb-16">
          <div className="card-title">Revenue Trend</div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueByMonth}>
              <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f5c842"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE + PAYMENT */}
        <div className="grid-2 mb-16">

          <div className="card">
            <div className="card-title">Members Status</div>

            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Payment Methods</div>

            {methodData.length === 0 ? (
              <div style={{ color: "var(--muted2)", fontSize: 13 }}>
                No payments yet
              </div>
            ) : (
              methodData.map((m, i) => {
                const percent =
                  payments.length > 0
                    ? (m.value / payments.length) * 100
                    : 0;

                return (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{m.name}</span>
                      <span style={{ color: COLORS[i % COLORS.length] }}>
                        {m.value}
                      </span>
                    </div>
                    <div className="bca-track">
                      <div
                        className="bca-fill gold"
                        style={{
                          width: `${percent}%`,
                          background: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* TOP MEMBERS */}
        <div className="card">
          <div className="card-title">Top Members</div>

          {topMembers.map((m, i) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #222",
              }}
            >
              <span>{i + 1}. {m.name}</span>
              <span style={{ color: "#f5c842" }}>
                ₹{m.spent.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}