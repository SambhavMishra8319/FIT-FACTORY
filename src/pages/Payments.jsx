import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  subscribePaymentsSnapshot, addPayment,
  getAllMembers, exportToCSV,
} from "../firebase/service";

export default function Payments() {
  const [payments, setPayments]   = useState([]);
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [visible, setVisible]     = useState(false);

  // Filters
  const [search, setSearch]       = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterFrom, setFilterFrom]     = useState("");
  const [filterTo, setFilterTo]         = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const thisMonth = format(new Date(), "yyyy-MM");

  const [form, setForm] = useState({
    memberId: "", amount: "", method: "Cash",
    plan: "Monthly", date: today, type: "renewal", notes: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    // ✅ Realtime listener
    const unsub = subscribePaymentsSnapshot(data => {
      setPayments(data);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    });
    getAllMembers().then(setMembers).catch(console.error);
    return () => unsub();
  }, []);

  // Filtered payments using useMemo for performance
  const filtered = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = !search ||
        p.memberName?.toLowerCase().includes(search.toLowerCase());
      const matchMethod = filterMethod === "all" || p.method === filterMethod;
      const matchFrom   = !filterFrom || p.date >= filterFrom;
      const matchTo     = !filterTo   || p.date <= filterTo;
      return matchSearch && matchMethod && matchFrom && matchTo;
    });
  }, [payments, search, filterMethod, filterFrom, filterTo]);

  // Stats from filtered payments
  const stats = useMemo(() => ({
    total:   filtered.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    cash:    filtered.filter(p => p.method === "Cash").reduce((s, p) => s + (Number(p.amount) || 0), 0),
    upi:     filtered.filter(p => p.method === "UPI").reduce((s, p) => s + (Number(p.amount) || 0), 0),
    monthly: payments.filter(p => p.date?.startsWith(thisMonth)).reduce((s, p) => s + (Number(p.amount) || 0), 0),
  }), [filtered, payments, thisMonth]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.memberId || !form.amount) { toast.error("Member and amount required."); return; }
    setSaving(true);
    try {
      const member = members.find(m => m.id === form.memberId);
      await addPayment({
        memberId:   form.memberId,
        memberName: member?.name || "Unknown",
        plan:       form.plan,
        amount:     Number(form.amount),
        method:     form.method,
        date:       form.date,
        type:       form.type,
        notes:      form.notes,
        status:     "paid",
      });
      toast.success(`₹${Number(form.amount).toLocaleString()} recorded! 💰`);
      setShowForm(false);
      setForm({ memberId: "", amount: "", method: "Cash", plan: "Monthly", date: today, type: "renewal", notes: "" });
    } catch { toast.error("Could not save payment."); }
    finally { setSaving(false); }
  };

  const handleExport = () => {
    if (!filtered.length) { toast.error("No data to export."); return; }
    exportToCSV(
      filtered.map(p => ({
        memberName: p.memberName,
        plan:       p.plan,
        amount:     p.amount,
        method:     p.method,
        date:       p.date,
        type:       p.type,
        status:     p.status,
        notes:      p.notes || "",
      })),
      "f2_payments"
    );
    toast.success("CSV exported! 📊");
  };

  const clearFilters = () => {
    setSearch(""); setFilterMethod("all"); setFilterFrom(""); setFilterTo("");
  };

  const hasFilters = search || filterMethod !== "all" || filterFrom || filterTo;

  const anim = delay => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Payments</div>
        <div className="topbar-right">
          <button className="btn btn-outline btn-sm tap-scale" onClick={handleExport}>
            ↓ CSV
          </button>
          <button
            className="btn btn-primary btn-sm tap-scale btn-ripple"
            onClick={() => setShowForm(p => !p)}
          >
            {showForm ? "✕ Cancel" : "+ Record"}
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Add payment form */}
        {showForm && (
          <div className="card mb-20" style={{ animation: "scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div className="card-title">Record Payment</div>
            <form onSubmit={handleAdd}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Member *</label>
                  <select className="form-input" value={form.memberId} onChange={e => set("memberId", e.target.value)} required>
                    <option value="">— Select —</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input className="form-input" type="number" placeholder="1500" value={form.amount} onChange={e => set("amount", e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Plan</label>
                  <select className="form-input" value={form.plan} onChange={e => set("plan", e.target.value)}>
                    <option>Monthly</option><option>Quarterly</option><option>6 Month</option><option>Annual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Method</label>
                  <select className="form-input" value={form.method} onChange={e => set("method", e.target.value)}>
                    <option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-input" value={form.type} onChange={e => set("type", e.target.value)}>
                    <option value="renewal">Renewal</option>
                    <option value="new_membership">New Membership</option>
                    <option value="personal_training">Personal Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <input className="form-input" placeholder="Optional..." value={form.notes} onChange={e => set("notes", e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary tap-scale" disabled={saving}>
                {saving ? "Saving…" : "💾 Save Payment"}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid mb-20">
          {[
            { label: "This Month",  value: `₹${(stats.monthly/1000).toFixed(1)}k`, cls: "s-gold",  val: "c-gold"  },
            { label: "Filtered Total", value: `₹${(stats.total/1000).toFixed(1)}k`, cls: "s-green", val: "c-green" },
            { label: "Cash",        value: `₹${(stats.cash/1000).toFixed(1)}k`,   cls: "s-gold",  val: "c-gold"  },
            { label: "UPI",         value: `₹${(stats.upi/1000).toFixed(1)}k`,    cls: "s-green", val: "c-green" },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.cls}`} style={anim(i * 0.07)}>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`} style={{ fontSize: 22 }}>{loading ? "—" : s.value}</div>
            </div>
          ))}
        </div>

        {/* ✅ Filters row */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap",
          marginBottom: 14, alignItems: "center",
          ...anim(0.28),
        }}>
          <input
            className="search-input"
            placeholder="🔍 Member name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: "1 1 160px" }}
          />
          <select
            className="form-input"
            style={{ width: "auto", fontSize: 12, padding: "8px 10px" }}
            value={filterMethod}
            onChange={e => setFilterMethod(e.target.value)}
          >
            <option value="all">All methods</option>
            <option>Cash</option><option>UPI</option>
            <option>Card</option><option>Bank Transfer</option>
          </select>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--muted2)" }}>From</span>
            <input className="form-input" type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ width: 130, fontSize: 12, padding: "7px 10px" }} />
            <span style={{ fontSize: 11, color: "var(--muted2)" }}>To</span>
            <input className="form-input" type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ width: 130, fontSize: 12, padding: "7px 10px" }} />
          </div>
          {hasFilters && (
            <button className="btn btn-outline btn-sm tap-scale" onClick={clearFilters}>✕ Clear</button>
          )}
          <span style={{ fontSize: 12, color: "var(--muted2)", marginLeft: "auto" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Payments table */}
        <div className="table-wrap" style={anim(0.32)}>
          <table>
            <thead>
              <tr>
                <th>Member</th><th>Plan</th><th>Amount</th>
                <th>Date</th><th>Method</th><th>Type</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}><td colSpan={7} style={{ padding: 16 }}>
                    <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "40%" }} />
                  </td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted2)", padding: 40 }}>
                  {hasFilters ? "No payments match filters." : "No payments yet. Record your first payment!"}
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.35s ease ${0.32 + i * 0.03}s`,
                }}>
                  <td><strong>{p.memberName}</strong></td>
                  <td>{p.plan}</td>
                  <td style={{ color: "var(--green)", fontWeight: 700 }}>
                    ₹{Number(p.amount).toLocaleString()}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted2)" }}>{p.date}</td>
                  <td>
                    <span className={`badge ${p.method === "UPI" ? "badge-blue" : p.method === "Cash" ? "badge-green" : "badge-orange"}`}>
                      {p.method}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: "var(--muted2)" }}>
                    {p.type?.replace(/_/g, " ")}
                  </td>
                  <td style={{ fontSize: 11, color: "var(--muted2)" }}>{p.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export hint */}
        {filtered.length > 0 && !loading && (
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--muted2)", opacity: visible ? 1 : 0, transition: "opacity 0.4s ease 0.5s" }}>
            {filtered.length} payment{filtered.length !== 1 ? "s" : ""} · Total ₹{stats.total.toLocaleString()} ·{" "}
            <span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={handleExport}>Export to CSV →</span>
          </div>
        )}
      </div>
    </div>
  );
}
