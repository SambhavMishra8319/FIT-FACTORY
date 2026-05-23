// import { useEffect, useState, useMemo } from "react";

// import { format, addMonths, addDays, differenceInDays } from "date-fns";
// import toast from "react-hot-toast";
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
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import "../styles/payments.css";
// import {
//   subscribePaymentsSnapshot,
//   addPayment,
//   getAllMembers,
// } from "../firebase/service";

// export default function Payments() {
//   const [payments, setPayments] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [visible, setVisible] = useState(false);

//   // Filters
//   const [search, setSearch] = useState("");
//   const [filterMethod, setFilterMethod] = useState("all");
//   const [filterPlan, setFilterPlan] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const today = format(new Date(), "yyyy-MM-dd");
//   const thisMonth = format(new Date(), "yyyy-MM");

//   const [form, setForm] = useState({
//     memberId: "",
//     amount: "",
//     method: "Cash",
//     plan: "Monthly",
//     date: today,
//     type: "renewal",
//     notes: "",
//     status: "paid",
//   });

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   // Currency formatter
//   const formatMoney = (amount) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount || 0);

//   // Expiry calculation
//   const getExpiryDate = (date, plan) => {
//     const d = new Date(date);

//     switch (plan) {
//       case "Monthly":
//         return addMonths(d, 1);

//       case "Quarterly":
//         return addMonths(d, 3);

//       case "6 Month":
//         return addMonths(d, 6);

//       case "Annual":
//         return addMonths(d, 12);

//       default:
//         return addMonths(d, 1);
//     }
//   };

//   const getStatusColor = (daysLeft) => {
//     if (daysLeft < 0) return "badge-red";
//     if (daysLeft <= 3) return "badge-orange";
//     return "badge-green";
//   };

//   useEffect(() => {
//     const unsub = subscribePaymentsSnapshot((data) => {
//       setPayments(data);
//       setLoading(false);
//       setTimeout(() => setVisible(true), 60);
//     });

//     getAllMembers().then(setMembers).catch(console.error);

//     return () => unsub();
//   }, []);

//   // Filtered payments
//   const filtered = useMemo(() => {
//     return payments.filter((p) => {
//       const q = search.toLowerCase();

//       const matchSearch =
//         !search ||
//         p.memberName?.toLowerCase().includes(q) ||
//         p.phone?.includes(q) ||
//         p.plan?.toLowerCase().includes(q);

//       const matchMethod = filterMethod === "all" || p.method === filterMethod;

//       const matchPlan = filterPlan === "all" || p.plan === filterPlan;

//       const matchStatus = filterStatus === "all" || p.status === filterStatus;

//       return matchSearch && matchMethod && matchPlan && matchStatus;
//     });
//   }, [payments, search, filterMethod, filterPlan, filterStatus]);

//   // Stats
//   const stats = useMemo(
//     () => ({
//       total: filtered.reduce((s, p) => s + (Number(p.amount) || 0), 0),

//       monthly: payments
//         .filter((p) => p.date?.startsWith(thisMonth))
//         .reduce((s, p) => s + (Number(p.amount) || 0), 0),

//       cash: filtered
//         .filter((p) => p.method === "Cash")
//         .reduce((s, p) => s + Number(p.amount || 0), 0),

//       upi: filtered
//         .filter((p) => p.method === "UPI")
//         .reduce((s, p) => s + Number(p.amount || 0), 0),
//     }),
//     [filtered, payments, thisMonth],
//   );

//   // Revenue chart
//   const revenueData = useMemo(() => {
//     const map = {};

//     filtered.forEach((p) => {
//       const d = format(new Date(p.date), "dd MMM");

//       if (!map[d]) map[d] = 0;

//       map[d] += Number(p.amount || 0);
//     });

//     return Object.keys(map).map((k) => ({
//       date: k,
//       amount: map[k],
//     }));
//   }, [filtered]);

//   // // Payment methods chart
//   // const paymentMethodData = [
//   //   { name: "Cash", value: stats.cash },
//   //   { name: "UPI", value: stats.upi },
//   // ];
//   const paymentMethodData = useMemo(() => {
//     const methods = {};

//     filtered.forEach((p) => {
//       if (!methods[p.method]) methods[p.method] = 0;
//       methods[p.method] += Number(p.amount || 0);
//     });

//     return Object.keys(methods).map((key) => ({
//       name: key,
//       value: methods[key],
//     }));
//   }, [filtered]);
//   // Add payment
//   const handleAdd = async (e) => {
//     e.preventDefault();

//     if (!form.memberId || !form.amount) {
//       toast.error("Member and amount required.");
//       return;
//     }

//     setSaving(true);

//     try {
//       const member = members.find((m) => m.id === form.memberId);

//       const expiryDate = getExpiryDate(form.date, form.plan);

//       await addPayment({
//         memberId: form.memberId,
//         memberName: member?.name || "Unknown",
//         phone: member?.phone || "",
//         plan: form.plan,
//         amount: Number(form.amount),
//         method: form.method,
//         date: form.date,
//         expiryDate: format(expiryDate, "yyyy-MM-dd"),
//         type: form.type,
//         notes: form.notes,
//         status: form.status,
//       });

//       toast.success("Payment recorded!");

//       setShowForm(false);

//       setForm({
//         memberId: "",
//         amount: "",
//         method: "Cash",
//         plan: "Monthly",
//         date: today,
//         type: "renewal",
//         notes: "",
//         status: "paid",
//       });
//     } catch {
//       toast.error("Could not save payment.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Excel Export
//   const handleExport = () => {
//     if (!filtered.length) {
//       toast.error("No data to export.");
//       return;
//     }

//     const data = filtered.map((p) => ({
//       "Member Name": p.memberName,
//       Phone: p.phone || "",
//       Plan: p.plan,
//       "Payment Type": p.type,
//       Method: p.method,
//       Amount: p.amount,
//       Date: format(new Date(p.date), "dd MMM yyyy"),
//       Expiry: p.expiryDate,
//       Status: p.status,
//       Notes: p.notes || "",
//     }));

//     data.push({
//       "Member Name": "TOTAL",
//       Amount: stats.total,
//     });

//     const ws = XLSX.utils.json_to_sheet(data);

//     const wb = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(wb, ws, "Payments");

//     const excelBuffer = XLSX.write(wb, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const file = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });

//     saveAs(file, `F2_Payments_${format(new Date(), "dd-MM-yyyy")}.xlsx`);

//     toast.success("Excel exported!");
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilterMethod("all");
//     setFilterPlan("all");
//     setFilterStatus("all");
//   };

//   const anim = (delay) => ({
//     opacity: visible ? 1 : 0,
//     transform: visible ? "translateY(0)" : "translateY(14px)",

//     transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
//   });

//   return (
//     <div className="page-enter">
//       {/* TOPBAR */}
//       <div className="topbar">
//         <div className="premium-page-title">Payments Dashboard</div>

//         <div className="topbar-right">
//           <button className="btn btn-outline btn-sm" onClick={handleExport}>
//             ⬇ Export Excel
//           </button>

//           <button
//             className="btn btn-primary btn-sm"
//             onClick={() => setShowForm((p) => !p)}
//           >
//             {showForm ? "✕ Cancel" : "+ Record"}
//           </button>
//         </div>
//       </div>

//       <div className="page-body">
//         {/* FORM */}
//         {showForm && (
//           <div className="card mb-20">
//             <div className="card-title">Record Payment</div>

//             <form onSubmit={handleAdd}>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Member</label>

//                   <select
//                     className="form-input"
//                     value={form.memberId}
//                     onChange={(e) => set("memberId", e.target.value)}
//                     required
//                   >
//                     <option value="">Select Member</option>

//                     {members.map((m) => (
//                       <option key={m.id} value={m.id}>
//                         {m.name} ({m.phone})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Amount</label>

//                   <input
//                     className="form-input"
//                     type="number"
//                     value={form.amount}
//                     onChange={(e) => set("amount", e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Plan</label>

//                   <select
//                     className="form-input"
//                     value={form.plan}
//                     onChange={(e) => set("plan", e.target.value)}
//                   >
//                     <option>Monthly</option>
//                     <option>Quarterly</option>
//                     <option>6 Month</option>
//                     <option>Annual</option>
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Method</label>

//                   <select
//                     className="form-input"
//                     value={form.method}
//                     onChange={(e) => set("method", e.target.value)}
//                   >
//                     <option>Cash</option>
//                     <option>UPI</option>
//                     <option>Card</option>
//                     <option>Bank Transfer</option>
//                   </select>
//                 </div>
//               </div>

//               <button className="btn btn-primary" disabled={saving}>
//                 {saving ? "Saving..." : "💾 Save Payment"}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* STATS */}
//         <div className="stats-grid mb-20">
//           <div className="stat-card s-gold" style={anim(0.05)}>
//             <div className="stat-label">Total Revenue</div>

//             <div className="stat-value c-gold">{formatMoney(stats.total)}</div>
//           </div>

//           <div className="stat-card s-green" style={anim(0.1)}>
//             <div className="stat-label">This Month</div>

//             <div className="stat-value c-green">
//               {formatMoney(stats.monthly)}
//             </div>
//           </div>

//           <div className="stat-card s-blue" style={anim(0.15)}>
//             <div className="stat-label">Cash</div>

//             <div className="stat-value">{formatMoney(stats.cash)}</div>
//           </div>

//           <div className="stat-card s-orange" style={anim(0.2)}>
//             <div className="stat-label">UPI</div>

//             <div className="stat-value">{formatMoney(stats.upi)}</div>
//           </div>
//         </div>

//         {/* CHARTS */}
//         {/* <div
//           className="charts-grid mb-20"
//           style={{
//             display: "grid",
//             gridTemplateColumns:
//               "repeat(auto-fit,minmax(300px,1fr))",
//             gap: 20,
//           }}
//         >

//           <div className="card">
//             <div className="card-title">
//               Revenue Trend
//             </div>

//             <ResponsiveContainer
//               width="100%"
//               height={260}
//             >
//               <BarChart data={revenueData}>
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="amount" radius={[8,8,0,0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="card">
//             <div className="card-title">
//               Payment Methods
//             </div>

//             <ResponsiveContainer
//               width="100%"
//               height={260}
//             >
//               <PieChart>
//                 <Pie
//                   data={paymentMethodData}
//                   dataKey="value"
//                   outerRadius={90}
//                   label
//                 >
//                   <Cell fill="#22c55e" />
//                   <Cell fill="#3b82f6" />
//                 </Pie>

//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//         </div> */}
//         {/* ================= CHARTS SECTION ================= */}

//         <div
//           className="charts-grid mb-20"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: 24,
//           }}
//         >
//           {/* ================= REVENUE TREND ================= */}

//           <div
//             className="card premium-chart-card"
//             style={{
//               padding: 24,
//               borderRadius: 28,
//               position: "relative",
//               overflow: "hidden",
//               background: "linear-gradient(145deg,#0a0a0a,#050505)",
//               border: "1px solid rgba(255,215,0,0.08)",
//               boxShadow: "0 0 40px rgba(255,215,0,0.03)",
//             }}
//           >
//             {/* glow */}
//             <div
//               style={{
//                 position: "absolute",
//                 width: 220,
//                 height: 220,
//                 background:
//                   "radial-gradient(circle,rgba(255,215,0,0.12),transparent 70%)",
//                 top: -80,
//                 right: -80,
//                 borderRadius: "50%",
//                 pointerEvents: "none",
//               }}
//             />

//             <div className="chart-header">
//               <div className="chart-title-wrap">
//                 <div className="chart-accent" />

//                 <h3 className="chart-title">Revenue Trend</h3>
//               </div>

//               <div
//                 style={{
//                   padding: "10px 16px",
//                   borderRadius: 14,
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   background: "rgba(255,255,255,0.03)",
//                   color: "#ddd",
//                   fontSize: 13,
//                 }}
//               >
//                 Last 7 Days
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={340}>
//               <BarChart
//                 data={revenueData}
//                 margin={{
//                   top: 10,
//                   right: 10,
//                   left: 0,
//                   bottom: 0,
//                 }}
//               >
//                 <defs>
//                   {/* GOLD BAR */}
//                   <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#ffe45e" />

//                     <stop offset="100%" stopColor="#ffb800" />
//                   </linearGradient>

//                   {/* BAR SHADOW */}
//                   <filter id="shadow">
//                     <feDropShadow
//                       dx="0"
//                       dy="0"
//                       stdDeviation="10"
//                       floodColor="#ffd700"
//                       floodOpacity="0.55"
//                     />
//                   </filter>
//                 </defs>

//                 <CartesianGrid
//                   strokeDasharray="4 4"
//                   opacity={0.06}
//                   vertical={false}
//                 />

//                 <XAxis
//                   dataKey="date"
//                   tick={{
//                     fill: "#888",
//                     fontSize: 13,
//                   }}
//                   axisLine={false}
//                   tickLine={false}
//                 />

//                 <YAxis
//                   tick={{
//                     fill: "#666",
//                     fontSize: 13,
//                   }}
//                   axisLine={false}
//                   tickLine={false}
//                 />

//                 <Tooltip
//                   cursor={{
//                     fill: "rgba(255,215,0,0.04)",
//                   }}
//                   contentStyle={{
//                     background: "#0d0d0d",
//                     border: "1px solid rgba(255,215,0,0.15)",
//                     borderRadius: 18,
//                     color: "#fff",
//                     boxShadow: "0 0 30px rgba(255,215,0,0.15)",
//                   }}
//                 />

//                 <Bar
//                   dataKey="amount"
//                   fill="url(#goldBar)"
//                   radius={[16, 16, 0, 0]}
//                   barSize={46}
//                   filter="url(#shadow)"
//                   animationDuration={1600}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* ================= PAYMENT METHODS ================= */}

//           <div
//             className="card premium-chart-card"
//             style={{
//               padding: 24,
//               borderRadius: 28,
//               position: "relative",
//               overflow: "hidden",
//               background: "linear-gradient(145deg,#0a0a0a,#050505)",
//               border: "1px solid rgba(255,255,255,0.05)",
//             }}
//           >
//             {/* glow */}
//             <div
//               style={{
//                 position: "absolute",
//                 width: 220,
//                 height: 220,
//                 background:
//                   "radial-gradient(circle,rgba(34,197,94,0.12),transparent 70%)",
//                 top: -90,
//                 right: -90,
//                 borderRadius: "50%",
//               }}
//             />

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: 26,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 6,
//                     height: 34,
//                     borderRadius: 999,
//                     background: "#ffd700",
//                     boxShadow: "0 0 18px rgba(255,215,0,0.7)",
//                   }}
//                 />

//                 <h3
//                   style={{
//                     margin: 0,
//                     fontSize: 30,
//                     color: "#ffd700",
//                     fontWeight: 800,
//                     letterSpacing: 1,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Payment Methods
//                 </h3>
//               </div>

//               <div
//                 style={{
//                   padding: "10px 16px",
//                   borderRadius: 14,
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   background: "rgba(255,255,255,0.03)",
//                   color: "#ddd",
//                   fontSize: 13,
//                 }}
//               >
//                 This Month
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={340}>
//               <PieChart>
//                 <Tooltip
//                   contentStyle={{
//                     background: "#0d0d0d",
//                     border: "1px solid rgba(255,255,255,0.08)",
//                     borderRadius: 16,
//                     color: "#fff",
//                   }}
//                 />

//                 <Legend verticalAlign="bottom" iconType="circle" />

//                 <Pie
//                   data={paymentMethodData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={120}
//                   innerRadius={68}
//                   paddingAngle={5}
//                   animationDuration={1800}
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name} ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {paymentMethodData.map((entry, index) => {
//                     const colors = [
//                       "#22c55e",
//                       "#3b82f6",
//                       "#a855f7",
//                       "#f97316",
//                       "#06b6d4",
//                       "#ec4899",
//                     ];

//                     return (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={colors[index % colors.length]}
//                         stroke="rgba(255,255,255,0.12)"
//                         strokeWidth={2}
//                       />
//                     );
//                   })}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           {/* ================= FILTER BAR ================= */}

//           <div
//             className="premium-filter-bar"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 14,
//               flexWrap: "wrap",
//               marginBottom: 22,
//             }}
//           >
//             {/* LEFT SIDE */}
//             {/* <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       gap: 12,
//       flexWrap: "wrap",
//       flex: 1,
//     }}
//   > */}
//             <div className="filter-left">
//               {/* SEARCH */}
//               <input
//                 className="premium-search"
//                 placeholder="🔍 Search member..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />

//               {/* METHOD */}
//               <select
//                 className="premium-select"
//                 value={filterMethod}
//                 onChange={(e) => setFilterMethod(e.target.value)}
//               >
//                 <option value="all">All Methods</option>

//                 <option>Cash</option>
//                 <option>UPI</option>
//                 <option>Card</option>
//                 <option>Bank Transfer</option>
//               </select>

//               {/* PLAN */}
//               <select
//                 className="premium-select"
//                 value={filterPlan}
//                 onChange={(e) => setFilterPlan(e.target.value)}
//               >
//                 <option value="all">All Plans</option>

//                 <option>Monthly</option>
//                 <option>Quarterly</option>
//                 <option>6 Month</option>
//                 <option>Annual</option>
//               </select>

//               {/* STATUS */}
//               <select
//                 className="premium-select"
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//               >
//                 <option value="all">All Status</option>

//                 <option value="paid">Paid</option>

//                 <option value="pending">Pending</option>

//                 <option value="partial">Partial</option>
//               </select>

//               {/* DATE RANGE */}
//               <select className="premium-select">
//                 <option>Last 7 Days</option>

//                 <option>Last 30 Days</option>

//                 <option>This Month</option>

//                 <option>This Year</option>
//               </select>
//             </div>

//             {/* RIGHT SIDE */}
//             {/* <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       gap: 10,
//     }}
//   > */}
//             <div className="filter-right">
//               <button className="btn btn-outline btn-sm" onClick={clearFilters}>
//                 Clear
//               </button>

//               <div
//                 style={{
//                   color: "#777",
//                   fontSize: 13,
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {filtered.length} results
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* FILTERS */}
//         {/* <div
//           style={{
//             display: "flex",
//             gap: 8,
//             flexWrap: "wrap",
//             marginBottom: 14,
//           }}
//         >

//           <input
//             className="search-input"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//           />

//           <select
//             className="form-input"
//             value={filterMethod}
//             onChange={(e) =>
//               setFilterMethod(e.target.value)
//             }
//           >
//             <option value="all">
//               All Methods
//             </option>

//             <option>Cash</option>
//             <option>UPI</option>
//             <option>Card</option>
//           </select>

//           <select
//             className="form-input"
//             value={filterPlan}
//             onChange={(e) =>
//               setFilterPlan(e.target.value)
//             }
//           >
//             <option value="all">
//               All Plans
//             </option>

//             <option>Monthly</option>
//             <option>Quarterly</option>
//             <option>6 Month</option>
//             <option>Annual</option>
//           </select>

//           <select
//             className="form-input"
//             value={filterStatus}
//             onChange={(e) =>
//               setFilterStatus(e.target.value)
//             }
//           >
//             <option value="all">
//               All Status
//             </option>

//             <option value="paid">Paid</option>
//             <option value="pending">
//               Pending
//             </option>
//             <option value="partial">
//               Partial
//             </option>
//           </select>

//           <button
//             className="btn btn-outline btn-sm"
//             onClick={clearFilters}
//           >
//             Clear
//           </button>

//         </div> */}

//         {/* TABLE */}
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Member</th>
//                 <th>Plan</th>
//                 <th>Amount</th>
//                 <th>Method</th>
//                 <th>Expiry</th>
//                 <th>Status</th>
//                 <th>Notes</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7}>Loading...</td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7}>No payments found.</td>
//                 </tr>
//               ) : (
//                 filtered.map((p) => {
//                   const daysLeft = differenceInDays(
//                     new Date(p.expiryDate),
//                     new Date(),
//                   );

//                   return (
//                     <tr key={p.id}>
//                       <td>
//                         <strong>{p.memberName}</strong>
//                       </td>

//                       <td>{p.plan}</td>

//                       <td
//                         style={{
//                           color: "var(--green)",
//                           fontWeight: 700,
//                         }}
//                       >
//                         {formatMoney(p.amount)}
//                       </td>

//                       <td>{p.method}</td>

//                       <td>
//                         <div>{p.expiryDate}</div>

//                         <small
//                           style={{
//                             color: daysLeft < 0 ? "#ef4444" : "#888",
//                           }}
//                         >
//                           {daysLeft < 0 ? "Expired" : `${daysLeft} days left`}
//                         </small>
//                       </td>

//                       <td>
//                         <span className={`badge ${getStatusColor(daysLeft)}`}>
//                           {daysLeft < 0
//                             ? "Expired"
//                             : daysLeft <= 3
//                               ? "Expiring"
//                               : "Active"}
//                         </span>
//                       </td>

//                       <td>{p.notes || "—"}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useMemo } from "react";
import {
  format,
  addMonths,
  differenceInDays,
  isAfter,
  subDays,
  subMonths,
  startOfMonth,
  startOfYear,
} from "date-fns";

import toast from "react-hot-toast";

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
  CartesianGrid,
  Legend,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "../styles/payments.css";

import {
  subscribePaymentsSnapshot,
  addPayment,
  getAllMembers,
} from "../firebase/service";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [visible, setVisible] = useState(false);

  // ================= FILTERS =================
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  const today = format(new Date(), "yyyy-MM-dd");
  const thisMonth = format(new Date(), "yyyy-MM");

  // ================= FORM =================
  const [form, setForm] = useState({
    memberId: "",
    amount: "",
    method: "Cash",
    plan: "Monthly",
    date: today,
    type: "renewal",
    notes: "",
    status: "paid",
  });

  const set = (k, v) =>
    setForm((p) => ({
      ...p,
      [k]: v,
    }));

  // ================= HELPERS =================
  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getExpiryDate = (date, plan) => {
    const d = new Date(date);

    switch (plan) {
      case "Monthly":
        return addMonths(d, 1);

      case "Quarterly":
        return addMonths(d, 3);

      case "6 Month":
        return addMonths(d, 6);

      case "Annual":
        return addMonths(d, 12);

      default:
        return addMonths(d, 1);
    }
  };

  const getStatusColor = (daysLeft) => {
    if (daysLeft < 0) return "badge-red";

    if (daysLeft <= 3) return "badge-orange";

    return "badge-green";
  };

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,

    transform: visible
      ? "translateY(0)"
      : "translateY(14px)",

    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    const unsub = subscribePaymentsSnapshot((data) => {
      setPayments(data);

      setLoading(false);

      setTimeout(() => setVisible(true), 60);
    });

    getAllMembers()
      .then(setMembers)
      .catch(console.error);

    return () => unsub();
  }, []);

  // ================= DATE FILTER =================
  const getDateFilteredPayments = (data) => {
    const now = new Date();

    switch (dateRange) {
      case "7days":
        return data.filter((p) =>
          isAfter(new Date(p.date), subDays(now, 7)),
        );

      case "30days":
        return data.filter((p) =>
          isAfter(new Date(p.date), subDays(now, 30)),
        );

      case "month":
        return data.filter((p) =>
          isAfter(new Date(p.date), startOfMonth(now)),
        );

      case "year":
        return data.filter((p) =>
          isAfter(new Date(p.date), startOfYear(now)),
        );

      default:
        return data;
    }
  };

  // ================= FILTERED PAYMENTS =================
  const filtered = useMemo(() => {
    let data = getDateFilteredPayments(payments);

    return data.filter((p) => {
      const q = search.toLowerCase();

      const matchSearch =
        !search ||
        p.memberName?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.plan?.toLowerCase().includes(q);

      const matchMethod =
        filterMethod === "all" ||
        p.method === filterMethod;

      const matchPlan =
        filterPlan === "all" ||
        p.plan === filterPlan;

      const matchStatus =
        filterStatus === "all" ||
        p.status === filterStatus;

      return (
        matchSearch &&
        matchMethod &&
        matchPlan &&
        matchStatus
      );
    });
  }, [
    payments,
    search,
    filterMethod,
    filterPlan,
    filterStatus,
    dateRange,
  ]);

  // ================= STATS =================
  const stats = useMemo(
    () => ({
      total: filtered.reduce(
        (s, p) => s + (Number(p.amount) || 0),
        0,
      ),

      monthly: payments
        .filter((p) =>
          p.date?.startsWith(thisMonth),
        )
        .reduce(
          (s, p) => s + (Number(p.amount) || 0),
          0,
        ),

      cash: filtered
        .filter((p) => p.method === "Cash")
        .reduce(
          (s, p) => s + Number(p.amount || 0),
          0,
        ),

      upi: filtered
        .filter((p) => p.method === "UPI")
        .reduce(
          (s, p) => s + Number(p.amount || 0),
          0,
        ),
    }),
    [filtered, payments, thisMonth],
  );

  // ================= REVENUE DATA =================
  const revenueData = useMemo(() => {
    const map = {};

    filtered.forEach((p) => {
      const d = format(
        new Date(p.date),
        "dd MMM",
      );

      if (!map[d]) map[d] = 0;

      map[d] += Number(p.amount || 0);
    });

    return Object.keys(map).map((k) => ({
      date: k,
      amount: map[k],
    }));
  }, [filtered]);

  // ================= PAYMENT METHOD DATA =================
  const paymentMethodData = useMemo(() => {
    const methods = {};

    filtered.forEach((p) => {
      if (!methods[p.method]) {
        methods[p.method] = 0;
      }

      methods[p.method] += Number(
        p.amount || 0,
      );
    });

    return Object.keys(methods).map((key) => ({
      name: key,
      value: methods[key],
    }));
  }, [filtered]);

  // ================= ADD PAYMENT =================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.memberId || !form.amount) {
      toast.error("Member and amount required.");

      return;
    }

    setSaving(true);

    try {
      const member = members.find(
        (m) => m.id === form.memberId,
      );

      const expiryDate = getExpiryDate(
        form.date,
        form.plan,
      );

      await addPayment({
        memberId: form.memberId,

        memberName:
          member?.name || "Unknown",

        phone: member?.phone || "",

        plan: form.plan,

        amount: Number(form.amount),

        method: form.method,

        date: form.date,

        expiryDate: format(
          expiryDate,
          "yyyy-MM-dd",
        ),

        type: form.type,

        notes: form.notes,

        status: form.status,
      });

      toast.success("Payment recorded!");

      setShowForm(false);

      setForm({
        memberId: "",
        amount: "",
        method: "Cash",
        plan: "Monthly",
        date: today,
        type: "renewal",
        notes: "",
        status: "paid",
      });
    } catch {
      toast.error(
        "Could not save payment.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= EXPORT =================
  const handleExport = () => {
    if (!filtered.length) {
      toast.error("No data to export.");

      return;
    }

    const data = filtered.map((p) => ({
      "Member Name": p.memberName,
      Phone: p.phone || "",
      Plan: p.plan,
      "Payment Type": p.type,
      Method: p.method,
      Amount: p.amount,
      Date: format(
        new Date(p.date),
        "dd MMM yyyy",
      ),
      Expiry: p.expiryDate,
      Status: p.status,
      Notes: p.notes || "",
    }));

    data.push({
      "Member Name": "TOTAL",
      Amount: stats.total,
    });

    const ws =
      XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Payments",
    );

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(
      file,
      `F2_Payments_${format(
        new Date(),
        "dd-MM-yyyy",
      )}.xlsx`,
    );

    toast.success("Excel exported!");
  };

  // ================= CLEAR FILTERS =================
  const clearFilters = () => {
    setSearch("");

    setFilterMethod("all");

    setFilterPlan("all");

    setFilterStatus("all");

    setDateRange("7days");
  };

  // ================= COLORS =================
  const pieColors = [
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#f97316",
    "#06b6d4",
    "#ec4899",
  ];

  return (
    <div className="page-enter">
      {/* ================= TOPBAR ================= */}
      <div className="topbar">
        <div className="premium-page-title">
          Payments Dashboard
        </div>

        <div className="topbar-right">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleExport}
          >
            ⬇ Export Excel
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              setShowForm((p) => !p)
            }
          >
            {showForm
              ? "✕ Cancel"
              : "+ Record"}
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* ================= FORM ================= */}
        {showForm && (
          <div className="card">
            <div className="card-title">
              Record Payment
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Member
                  </label>

                  <select
                    className="form-input"
                    value={form.memberId}
                    onChange={(e) =>
                      set(
                        "memberId",
                        e.target.value,
                      )
                    }
                    required
                  >
                    <option value="">
                      Select Member
                    </option>

                    {members.map((m) => (
                      <option
                        key={m.id}
                        value={m.id}
                      >
                        {m.name} ({m.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Amount
                  </label>

                  <input
                    className="form-input"
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      set(
                        "amount",
                        e.target.value,
                      )
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Plan
                  </label>

                  <select
                    className="form-input"
                    value={form.plan}
                    onChange={(e) =>
                      set(
                        "plan",
                        e.target.value,
                      )
                    }
                  >
                    <option>
                      Monthly
                    </option>

                    <option>
                      Quarterly
                    </option>

                    <option>
                      6 Month
                    </option>

                    <option>
                      Annual
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Method
                  </label>

                  <select
                    className="form-input"
                    value={form.method}
                    onChange={(e) =>
                      set(
                        "method",
                        e.target.value,
                      )
                    }
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>
                      Bank Transfer
                    </option>
                  </select>
                </div>
              </div>

              <button
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Payment"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div
            className="stat-card"
            style={anim(0.05)}
          >
            <div className="stat-label">
              Total Revenue
            </div>

            <div className="stat-value c-gold">
              {formatMoney(stats.total)}
            </div>
          </div>

          <div
            className="stat-card"
            style={anim(0.1)}
          >
            <div className="stat-label">
              This Month
            </div>

            <div className="stat-value c-green">
              {formatMoney(stats.monthly)}
            </div>
          </div>

          <div
            className="stat-card"
            style={anim(0.15)}
          >
            <div className="stat-label">
              Cash
            </div>

            <div className="stat-value">
              {formatMoney(stats.cash)}
            </div>
          </div>

          <div
            className="stat-card"
            style={anim(0.2)}
          >
            <div className="stat-label">
              UPI
            </div>

            <div className="stat-value">
              {formatMoney(stats.upi)}
            </div>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="charts-grid">
          {/* REVENUE CHART */}
          <div className="card premium-chart-card">
            <div className="chart-header">
              <div className="chart-title-wrap">
                <div className="chart-accent" />

                <h3 className="chart-title">
                  Revenue Trend
                </h3>
              </div>

              <div className="chart-chip">
                Revenue
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={340}
            >
              <BarChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="goldBar"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ffe45e"
                    />

                    <stop
                      offset="100%"
                      stopColor="#ffb800"
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  opacity={0.06}
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fill: "#888",
                    fontSize: 13,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#666",
                    fontSize: 13,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill:
                      "rgba(255,215,0,0.04)",
                  }}
                  contentStyle={{
                    background: "#0d0d0d",
                    border:
                      "1px solid rgba(255,215,0,0.15)",
                    borderRadius: 18,
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="url(#goldBar)"
                  radius={[16, 16, 0, 0]}
                  barSize={42}
                  animationDuration={1600}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="card premium-chart-card">
            <div className="chart-header">
              <div className="chart-title-wrap">
                <div className="chart-accent" />

                <h3 className="chart-title">
                  Payment Methods
                </h3>
              </div>

              <div className="chart-chip">
                Distribution
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={340}
            >
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "#0d0d0d",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    color: "#fff",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                />

                <Pie
                  data={paymentMethodData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={5}
                  animationDuration={1800}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(
                      percent * 100
                    ).toFixed(0)}%`
                  }
                >
                  {paymentMethodData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          pieColors[
                            index %
                              pieColors.length
                          ]
                        }
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth={2}
                      />
                    ),
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="premium-filter-bar">
          <div className="filter-left">
            <input
              className="premium-search"
              placeholder="🔍 Search member..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="premium-select"
              value={filterMethod}
              onChange={(e) =>
                setFilterMethod(
                  e.target.value,
                )
              }
            >
              <option value="all">
                All Methods
              </option>

              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>
                Bank Transfer
              </option>
            </select>

            <select
              className="premium-select"
              value={filterPlan}
              onChange={(e) =>
                setFilterPlan(
                  e.target.value,
                )
              }
            >
              <option value="all">
                All Plans
              </option>

              <option>Monthly</option>
              <option>
                Quarterly
              </option>
              <option>
                6 Month
              </option>
              <option>Annual</option>
            </select>

            <select
              className="premium-select"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value,
                )
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="partial">
                Partial
              </option>
            </select>

            <select
              className="premium-select"
              value={dateRange}
              onChange={(e) =>
                setDateRange(
                  e.target.value,
                )
              }
            >
              <option value="7days">
                Last 7 Days
              </option>

              <option value="30days">
                Last 30 Days
              </option>

              <option value="month">
                This Month
              </option>

              <option value="year">
                This Year
              </option>
            </select>
          </div>

          <div className="filter-right">
            <button
              className="btn btn-outline btn-sm"
              onClick={clearFilters}
            >
              Clear
            </button>

            <div
              style={{
                color: "#777",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              {filtered.length} results
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    No payments found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const daysLeft =
                    differenceInDays(
                      new Date(
                        p.expiryDate,
                      ),
                      new Date(),
                    );

                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>
                          {p.memberName}
                        </strong>
                      </td>

                      <td>{p.plan}</td>

                      <td
                        style={{
                          color:
                            "var(--green)",
                          fontWeight: 700,
                        }}
                      >
                        {formatMoney(
                          p.amount,
                        )}
                      </td>

                      <td>{p.method}</td>

                      <td>
                        <div>
                          {p.expiryDate}
                        </div>

                        <small
                          style={{
                            color:
                              daysLeft < 0
                                ? "#ef4444"
                                : "#888",
                          }}
                        >
                          {daysLeft < 0
                            ? "Expired"
                            : `${daysLeft} days left`}
                        </small>
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusColor(
                            daysLeft,
                          )}`}
                        >
                          {daysLeft < 0
                            ? "Expired"
                            : daysLeft <= 3
                              ? "Expiring"
                              : "Active"}
                        </span>
                      </td>

                      <td>
                        {p.notes || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
