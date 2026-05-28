import { useEffect, useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import toast from "react-hot-toast";
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
// import { exportToCSV } from "../../firebase/service";
import { getPayments } from "../../firebase/service";
// import { exportBalanceSheetExcel } from "../../utils/exportBalanceSheet";
// import { exportBalanceSheetExcel } from "../../utils/exportBalanceSheetPDF.js"
import { exportBalanceSheetPDF } from "../../utils/exportBalanceSheetPDF";
// ── Expense categories
const EXPENSE_CATEGORIES = [
  { label: "Equipment Purchase",   icon: "🏋️", color: "#e63329" },
  { label: "Maintenance & Repair", icon: "🔧", color: "#f47c20" },
  { label: "Electricity Bill",     icon: "⚡", color: "#f5c842" },
  { label: "Rent",                 icon: "🏠", color: "#c9a227" },
  { label: "Staff Salary",         icon: "👨‍💼", color: "#3b82f6" },
  { label: "Cleaning & Supplies",  icon: "🧹", color: "#06b6d4" },
  { label: "Marketing",            icon: "📢", color: "#8b5cf6" },
  { label: "Water Bill",           icon: "💧", color: "#22c55e" },
  { label: "Steam Bath Fuel/Gas",  icon: "🌫️", color: "#f97316" },
  { label: "Other",                icon: "📦", color: "#888" },
];

const INCOME_CATEGORIES = [
  { label: "Membership Fee",       icon: "💳", color: "#22c55e" },
  { label: "Personal Training",    icon: "💪", color: "#f5c842" },
  { label: "Day Pass",             icon: "🎫", color: "#3b82f6" },
  { label: "Supplement Sales",     icon: "🥤", color: "#c9a227" },
  { label: "Other Income",         icon: "💰", color: "#888" },
];

const tooltipStyle = {
  background: "#141414", border: "1px solid #2a2a2a",
  borderRadius: 8, fontSize: 12, fontFamily: "'Exo 2',sans-serif",
};

export default function BalanceSheet() {
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [visible, setVisible]     = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
const [payments, setPayments] = useState([]);
  // Filters
  const [filterMode, setFilterMode] = useState("month"); // "month" | "date" | "all"
  const [filterMonth, setFilterMonth] = useState(format(new Date(), "yyyy-MM"));
  const [filterDate, setFilterDate]   = useState(format(new Date(), "yyyy-MM-dd"));

  // Form state
  const [form, setForm] = useState({
    type:        "expense",   // "expense" | "income"
    category:    "Equipment Purchase",
    amount:      "",
    description: "",
    date:        format(new Date(), "yyyy-MM-dd"),
    paymentMode: "Cash",
    notes:       "",
  });
const memberIncome = payments
  .filter(p => p.type === "member")
  .reduce((s, p) => s + Number(p.amount || 0), 0);

const trainerExpense = payments
  .filter(p => p.type === "trainer")
  .reduce((s, p) => s + Number(p.amount || 0), 0);

const netProfit = memberIncome - trainerExpense;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    fetchEntries();
    setTimeout(() => setVisible(true), 60);
  }, []);

  // async function fetchEntries() {

  //   setLoading(true);
  //   try {
  //     const snap = await getDocs(
  //       query(collection(db, "balance_sheet"), orderBy("date", "desc"))
  //     );
  //     setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  //   } catch (e) {
  //     console.error(e);
  //     toast.error("Could not load balance sheet.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }
async function fetchEntries() {
  setLoading(true);
  try {
    const [snap, paySnap] = await Promise.all([
      getDocs(
        query(collection(db, "balance_sheet"), orderBy("date", "desc"))
      ),
      getPayments(),
    ]);

    const balanceData = snap.docs.map(d => ({
      id: d.id,
      source: "balance_sheet",
      ...d.data(),
    }));

    const paymentData = (paySnap || []).map((p, i) => ({
  id: p.id || `pay_${i}`,
  source: "payments",
  type: p.type === "trainer" ? "expense" : "income",

  category: p.type === "trainer" ? "Staff Salary" : "Membership Fee",

  description: p.name
    ? `Payment from ${p.name}`
    : "Payment",

  amount: Number(p.amount) || 0,
  date: p.date,
  paymentMode: p.method || "Cash",
  notes: p.notes || "",
}));

    const merged = [...balanceData, ...paymentData].sort(
      (a, b) => (b.date || "").localeCompare(a.date || "")
    );

    setEntries(merged);
  } catch (e) {
    console.error(e);
    toast.error("Could not load balance sheet.");
  } finally {
    setLoading(false);
  }
}

  // ── Filter logic
  const filtered = useMemo(() => {
    if (filterMode === "all") return entries;
    if (filterMode === "month") {
      return entries.filter(e => e.date?.startsWith(filterMonth));
    }
    if (filterMode === "date") {
      return entries.filter(e => e.date === filterDate);
    }
    return entries;
  }, [entries, filterMode, filterMonth, filterDate]);

  const income   = filtered.filter(e => e.type === "income");
  const expenses = filtered.filter(e => e.type === "expense");

  const totalIncome  = income.reduce((s, e)   => s + (Number(e.amount) || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const netBalance   = totalIncome - totalExpense;

  // Category breakdown for chart
  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    name:  cat.icon + " " + cat.label,
    value: expenses.filter(e => e.category === cat.label).reduce((s, e) => s + (Number(e.amount) || 0), 0),
    color: cat.color,
  })).filter(c => c.value > 0);

  const incomeByCategory = INCOME_CATEGORIES.map(cat => ({
    name:  cat.icon + " " + cat.label,
    value: income.filter(e => e.category === cat.label).reduce((s, e) => s + (Number(e.amount) || 0), 0),
    color: cat.color,
  })).filter(c => c.value > 0);

  // ── Add entry
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description.trim()) {
      toast.error("Amount and description are required.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        type:        form.type,
        category:    form.category,
        amount:      Number(form.amount),
        description: form.description.trim(),
        date:        form.date,
        paymentMode: form.paymentMode,
        notes:       form.notes.trim(),
        createdAt:   serverTimestamp(),
      };
      const ref = await addDoc(collection(db, "balance_sheet"), data);
      setEntries(prev => [{ id: ref.id, ...data, createdAt: new Date().toISOString() }, ...prev]);
      toast.success(`${form.type === "income" ? "Income" : "Expense"} of ₹${Number(form.amount).toLocaleString()} added!`);
      setShowForm(false);
      setForm({ type: "expense", category: "Equipment Purchase", amount: "", description: "", date: format(new Date(), "yyyy-MM-dd"), paymentMode: "Cash", notes: "" });
    } catch {
      toast.error("Could not save entry.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteDoc(doc(db, "balance_sheet", id));
      setEntries(prev => prev.filter(e => e.id !== id));
      toast.success("Entry deleted.");
    } catch {
      toast.error("Could not delete.");
    }
  };

  // ── Export
  // const handleExport = () => {
  //   if (!filtered.length) { toast.error("No data to export."); return; }
  //   exportToCSV(
  //     filtered.map(e => ({
  //       date: e.date, type: e.type, category: e.category,
  //       description: e.description, amount: e.amount,
  //       paymentMode: e.paymentMode, notes: e.notes || "",
  //     })),
  //     `f2_balance_sheet_${filterMode === "month" ? filterMonth : filterDate}`
  //   );
  //   toast.success("Exported! 📊");
  // };
// const handleExport = () => {
//   if (!filtered.length) {
//     toast.error("No data to export.");
//     return;
//   }

//   exportBalanceSheetExcel({
//     entries: filtered,
//     totalIncome,
//     totalExpense,
//     netBalance,
//     filterLabel:
//       filterMode === "month"
//         ? filterMonth
//         : filterMode === "date"
//         ? filterDate
//         : "all_time",
//   });

//   toast.success("Balance Sheet Exported 📊");
// };
// const handleExport = () => {

//   if (!filtered.length) {
//     toast.error("No data to export.");
//     return;
//   }

//   exportBalanceSheetPDF({
//     entries: filtered,
//     totalIncome,
//     totalExpense,
//     netBalance,
//     filterLabel:
//       filterMode === "month"
//         ? filterMonth
//         : filterMode === "date"
//         ? filterDate
//         : "all_time",
//   });

//   toast.success("Professional PDF Report Generated 📄");
// };
const handleExport = () => {
  if (!filtered.length) {
    toast.error("No data to export.");
    return;
  }

  exportBalanceSheetPDF({
    entries: filtered,
    totalIncome,
    totalExpense,
    netBalance,
    filterLabel:
      filterMode === "month"
        ? filterMonth
        : filterMode === "date"
        ? filterDate
        : "all_time",
  });

  toast.success("Professional PDF Generated 📄");
};
  const anim = delay => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  const currentCategories = form.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Balance Sheet</div>
        <div className="topbar-right">
          <button className="btn btn-outline btn-sm tap-scale" onClick={handleExport}>↓ CSV</button>
          <button
            className={`btn btn-sm tap-scale btn-ripple ${showForm ? "btn-outline" : "btn-primary"}`}
            onClick={() => setShowForm(p => !p)}
          >
            {showForm ? "✕ Cancel" : "+ Add Entry"}
          </button>
        </div>
      </div>

      <div className="page-body">

        {/* ── ADD ENTRY FORM ── */}
        {showForm && (
          <div className="card mb-20" style={{ animation: "scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1)", border: "1px solid rgba(245,200,66,0.2)" }}>
            <div className="card-title">Add New Entry</div>
            <form onSubmit={handleAdd}>
              {/* Type toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["expense", "income"].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => {
                      set("type", t);
                      set("category", t === "expense" ? "Equipment Purchase" : "Membership Fee");
                    }}
                    style={{
                      flex: 1, padding: "10px 0",
                      border: `1px solid ${form.type === t ? (t === "expense" ? "var(--red)" : "var(--green)") : "var(--border)"}`,
                      borderRadius: "var(--r-sm)",
                      background: form.type === t
                        ? t === "expense" ? "rgba(230,51,41,0.1)" : "rgba(34,197,94,0.1)"
                        : "var(--card2)",
                      color: form.type === t
                        ? t === "expense" ? "var(--red)" : "var(--green)"
                        : "var(--muted2)",
                      fontFamily: "var(--font-display)", fontSize: 11,
                      fontWeight: 700, letterSpacing: 1.5, cursor: "pointer",
                      textTransform: "uppercase", transition: "all 0.18s",
                    }}
                  >
                    {t === "expense" ? "💸 Expense / Purchase" : "💰 Income"}
                  </button>
                ))}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
                    {currentCategories.map(c => (
                      <option key={c.label}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input className="form-input" type="number" placeholder="0"
                    value={form.amount} onChange={e => set("amount", e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <input className="form-input"
                  placeholder={form.type === "expense" ? "e.g. New treadmill belt replacement" : "e.g. Monthly membership payments"}
                  value={form.description} onChange={e => set("description", e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date"
                    value={form.date} onChange={e => set("date", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select className="form-input" value={form.paymentMode} onChange={e => set("paymentMode", e.target.value)}>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input className="form-input" placeholder="Any additional details..."
                  value={form.notes} onChange={e => set("notes", e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary tap-scale btn-ripple" disabled={saving}
                style={{ width: "100%", padding: 12 }}>
                {saving ? "Saving…" : `Add ${form.type === "expense" ? "Expense" : "Income"} Entry`}
              </button>
            </form>
          </div>
        )}

        {/* ── FILTER ROW ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center", ...anim(0.05) }}>
          {[
            { key: "month", label: "By Month" },
            { key: "date",  label: "By Date"  },
            { key: "all",   label: "All Time" },
          ].map(f => (
            <button key={f.key} className="tap-scale"
              onClick={() => setFilterMode(f.key)}
              style={{
                padding: "7px 14px",
                border: `1px solid ${filterMode === f.key ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "var(--r-sm)",
                background: filterMode === f.key ? "var(--gold-dim)" : "var(--card2)",
                color: filterMode === f.key ? "var(--gold)" : "var(--muted2)",
                fontFamily: "var(--font-display)", fontSize: 10,
                fontWeight: 700, letterSpacing: 1, cursor: "pointer",
                transition: "all 0.18s", textTransform: "uppercase",
              }}>
              {f.label}
            </button>
          ))}

          {filterMode === "month" && (
            <input className="form-input" type="month" value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              style={{ width: "auto", fontSize: 13, padding: "7px 12px" }} />
          )}
          {filterMode === "date" && (
            <input className="form-input" type="date" value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              style={{ width: "auto", fontSize: 13, padding: "7px 12px" }} />
          )}

          <span style={{ fontSize: 11, color: "var(--muted2)", marginLeft: "auto" }}>
            {filtered.length} entries
          </span>
        </div>

        {/* ── SUMMARY STATS ── */}
        <div className="stats-grid mb-20" style={anim(0.1)}>
          <div className="stat-card s-green">
            <div className="stat-label">Total Income</div>
            <div className="stat-value c-green">
              ₹{totalIncome >= 100000 ? (totalIncome/100000).toFixed(1)+"L" : (totalIncome/1000).toFixed(1)+"k"}
            </div>
            <div className="stat-sub">{income.length} entries</div>
          </div>
          <div className="stat-card s-red">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value c-red">
              ₹{totalExpense >= 100000 ? (totalExpense/100000).toFixed(1)+"L" : (totalExpense/1000).toFixed(1)+"k"}
            </div>
            <div className="stat-sub">{expenses.length} entries</div>
          </div>
          <div className={`stat-card ${netBalance >= 0 ? "s-gold" : "s-red"}`}>
            <div className="stat-label">Net Balance</div>
            <div className={`stat-value ${netBalance >= 0 ? "c-gold" : "c-red"}`}>
              {netBalance >= 0 ? "+" : ""}₹{Math.abs(netBalance) >= 100000
                ? (Math.abs(netBalance)/100000).toFixed(1)+"L"
                : (Math.abs(netBalance)/1000).toFixed(1)+"k"}
            </div>
            <div className="stat-sub" style={{ color: netBalance >= 0 ? "var(--green)" : "var(--red)" }}>
              {netBalance >= 0 ? "✓ Profitable" : "⚠ Deficit"}
            </div>
          </div>
          <div className="stat-card s-gold">
            <div className="stat-label">Profit Margin</div>
            <div className="stat-value c-gold">
              {totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0}%
            </div>
            <div className="stat-sub">of income retained</div>
          </div>
        </div>

        {/* ── CHARTS ── */}
        {filtered.length > 0 && (
          <div className="grid-2 mb-20" style={anim(0.18)}>
            {/* Income vs Expense bar */}
            <div className="card">
              <div className="card-title">Income vs Expenses</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  { name: "Income",   amount: totalIncome,  fill: "#22c55e" },
                  { name: "Expenses", amount: totalExpense, fill: "#e63329" },
                  { name: "Net",      amount: Math.max(netBalance, 0), fill: netBalance >= 0 ? "#f5c842" : "#e63329" },
                ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 11, fontFamily: "'Exo 2',sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `₹${v/1000}k` : `₹${v}`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, ""]} />
                  <Bar dataKey="amount" radius={[4,4,0,0]}>
                    {[0,1,2].map(i => (
                      <Cell key={i} fill={["#22c55e","#e63329", netBalance >= 0 ? "#f5c842" : "#e63329"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense breakdown pie */}
            <div className="card">
              <div className="card-title">Expense Breakdown</div>
              {expenseByCategory.length === 0 ? (
                <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted2)", fontSize: 13 }}>
                  No expenses in this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={expenseByCategory} cx="40%" cy="50%" outerRadius={55}
                      dataKey="value" nameKey="name">
                      {expenseByCategory.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, ""]} />
                    <Legend layout="vertical" align="right" verticalAlign="middle"
                      formatter={(v) => <span style={{ fontSize: 10, color: "var(--muted2)" }}>{v.length > 18 ? v.slice(0,18)+"…" : v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* ── CATEGORY SUMMARY ── */}
        {filtered.length > 0 && (
          <div className="grid-2 mb-20" style={anim(0.24)}>
            {/* Income categories */}
            <div className="card">
              <div className="card-title">Income by Category</div>
              {incomeByCategory.length === 0 ? (
                <div style={{ color: "var(--muted2)", fontSize: 13, padding: "12px 0" }}>No income entries</div>
              ) : incomeByCategory.map((c, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text2)" }}>{c.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>
                      ₹{c.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="bca-track">
                    <div style={{
                      height: "100%", borderRadius: 3, background: c.color,
                      width: `${Math.min((c.value / totalIncome) * 100, 100)}%`,
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Expense categories */}
            <div className="card">
              <div className="card-title">Expenses by Category</div>
              {expenseByCategory.length === 0 ? (
                <div style={{ color: "var(--muted2)", fontSize: 13, padding: "12px 0" }}>No expense entries</div>
              ) : expenseByCategory.map((c, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text2)" }}>{c.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>
                      ₹{c.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="bca-track">
                    <div style={{
                      height: "100%", borderRadius: 3, background: c.color,
                      width: `${Math.min((c.value / totalExpense) * 100, 100)}%`,
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ENTRIES TABLE ── */}
        <div className="section-header mb-12" style={anim(0.28)}>
          <div className="section-title">All Entries</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span className="badge badge-green">Income: ₹{totalIncome.toLocaleString()}</span>
            <span className="badge badge-red">Expenses: ₹{totalExpense.toLocaleString()}</span>
          </div>
        </div>

        <div className="table-wrap" style={anim(0.32)}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i}><td colSpan={8} style={{ padding: 14 }}>
                    <div className="skeleton" style={{ height: 13, width: "70%" }} />
                  </td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted2)", padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📒</div>
                  No entries for this period. Click <strong>+ Add Entry</strong> to start tracking.
                </td></tr>
              ) : filtered.map((e, i) => (
                <tr key={e.id} style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.3s ease ${0.32 + i * 0.03}s`,
                }}>
                  <td style={{ fontSize: 12, color: "var(--muted2)", whiteSpace: "nowrap" }}>{e.date}</td>
                  <td>
                    <span className={`badge ${e.type === "income" ? "badge-green" : "badge-red"}`}>
                      {e.type === "income" ? "💰 Income" : "💸 Expense"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{e.category}</td>
                  <td style={{ fontSize: 13 }}><strong>{e.description}</strong></td>
                  <td style={{
                    fontWeight: 700, fontSize: 14,
                    color: e.type === "income" ? "var(--green)" : "var(--red)",
                    whiteSpace: "nowrap",
                  }}>
                    {e.type === "income" ? "+" : "−"}₹{Number(e.amount).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${e.paymentMode === "UPI" ? "badge-blue" : e.paymentMode === "Cash" ? "badge-gray" : "badge-gold"}`}>
                      {e.paymentMode}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: "var(--muted2)", maxWidth: 150 }}>{e.notes || "—"}</td>
                  <td>
                    <button className="btn btn-danger btn-sm tap-scale"
                      onClick={() => handleDelete(e.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── PERIOD SUMMARY FOOTER ── */}
        {filtered.length > 0 && (
          <div style={{
            ...anim(0.4),
            marginTop: 16,
            background: netBalance >= 0
              ? "linear-gradient(135deg, rgba(34,197,94,0.07), transparent)"
              : "linear-gradient(135deg, rgba(230,51,41,0.07), transparent)",
            border: `1px solid ${netBalance >= 0 ? "rgba(34,197,94,0.2)" : "rgba(230,51,41,0.2)"}`,
            borderRadius: "var(--r-md)", padding: "16px 18px",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 10, color: "var(--muted2)", letterSpacing: 2, marginBottom: 10 }}>
              PERIOD SUMMARY
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Total Income",   val: `₹${totalIncome.toLocaleString()}`,   color: "var(--green)" },
                { label: "Total Expenses", val: `₹${totalExpense.toLocaleString()}`,  color: "var(--red)"   },
                { label: "Net Balance",    val: `${netBalance >= 0 ? "+" : ""}₹${netBalance.toLocaleString()}`, color: netBalance >= 0 ? "var(--gold)" : "var(--red)" },
                { label: "Entries",        val: filtered.length,                       color: "var(--text)"  },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: s.color, fontWeight: 700 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}