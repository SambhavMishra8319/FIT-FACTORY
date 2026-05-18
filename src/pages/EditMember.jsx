import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, addMonths } from "date-fns";
import toast from "react-hot-toast";
import { getMember, updateMember, recordPaymentAndActivate } from "../firebase/service";

const PLANS = [
  { label: "Monthly",   months: 1,  price: 1500 },
  { label: "Quarterly", months: 3,  price: 3500 },
  { label: "6 Month",   months: 6,  price: 7000 },
  { label: "Annual",    months: 12, price: 12000 },
];

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("details"); // "details" | "membership"
  const [visible, setVisible] = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", age: "",
    gender: "Male", weight: "", height: "",
    goal: "General Fitness", notes: "",
    status: "active", expiryDate: "",
    plan: "Monthly", amountPaid: "",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    fetchMember();
    setTimeout(() => setVisible(true), 60);
  }, [id]);

  async function fetchMember() {
    try {
      const m = await getMember(id);
      if (!m) { toast.error("Member not found."); navigate("/members"); return; }
      setForm({
        name:          m.name || "",
        phone:         m.phone || "",
        email:         m.email || "",
        age:           m.age || "",
        gender:        m.gender || "Male",
        weight:        m.weight || "",
        height:        m.height || "",
        goal:          m.goal || "General Fitness",
        notes:         m.notes || "",
        status:        m.status || "active",
        expiryDate:    m.expiryDate || "",
        plan:          m.plan || "Monthly",
        amountPaid:    m.amountPaid || "",
        paymentMethod: m.paymentMethod || "Cash",
      });
    } catch { toast.error("Could not load member."); }
    finally  { setLoading(false); }
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMember(id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        age: form.age,
        gender: form.gender,
        weight: form.weight,
        height: form.height,
        goal: form.goal,
        notes: form.notes.trim(),
      });
      toast.success("Member details updated! ✅");
      navigate("/members");
    } catch { toast.error("Update failed."); }
    finally  { setSaving(false); }
  };

  const handleRenewMembership = async (e) => {
    e.preventDefault();
    if (!form.plan) { toast.error("Select a plan."); return; }
    setSaving(true);
    try {
      const selectedPlan = PLANS.find(p => p.label === form.plan) || PLANS[0];
      const result = await recordPaymentAndActivate(
        {
          memberId: id,
          memberName: form.name,
          plan: form.plan,
          amount: selectedPlan.price,
          method: form.paymentMethod,
          type: "renewal",
        },
        id,
        selectedPlan.months
      );
      toast.success(`Membership renewed until ${result.expiry} 🎉`);
      navigate("/members");
    } catch { toast.error("Renewal failed."); }
    finally  { setSaving(false); }
  };

  const handleUpdateExpiry = async () => {
    if (!form.expiryDate) { toast.error("Set an expiry date."); return; }
    setSaving(true);
    try {
      const isExpired = new Date(form.expiryDate) < new Date();
      await updateMember(id, {
        expiryDate: form.expiryDate,
        status: isExpired ? "inactive" : "active",
      });
      toast.success("Expiry date updated!");
      navigate("/members");
    } catch { toast.error("Update failed."); }
    finally  { setSaving(false); }
  };

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  if (loading) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div className="skeleton" style={{ height: 200, borderRadius: "var(--r-md)" }} />
    </div>
  );

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Edit Member</div>
        <div className="topbar-right">
          <button className="btn btn-outline tap-scale" onClick={() => navigate("/members")}>← Back</button>
        </div>
      </div>

      <div className="page-body">
        {/* Tabs */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 20,
          ...anim(0.05),
        }}>
          {[
            { key: "details",    label: "Personal Details" },
            { key: "membership", label: "Membership & Payment" },
          ].map(t => (
            <button
              key={t.key}
              className="tap-scale"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "10px 0",
                border: `1px solid ${tab === t.key ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "var(--r-sm)",
                background: tab === t.key ? "var(--gold-dim)" : "var(--card)",
                color: tab === t.key ? "var(--gold)" : "var(--muted2)",
                fontFamily: "var(--font-display)", fontSize: 11,
                fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.18s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Personal Details Tab ── */}
        {tab === "details" && (
          <form onSubmit={handleSaveDetails}>
            <div className="grid-2" style={{ alignItems: "start", ...anim(0.1) }}>
              <div className="card">
                <div className="card-title">Personal Info</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={form.name} onChange={e => set("name", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" value={form.phone} onChange={e => set("phone", e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input className="form-input" type="number" value={form.age} onChange={e => set("age", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-input" value={form.gender} onChange={e => set("gender", e.target.value)}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input className="form-input" type="number" step="0.1" value={form.weight} onChange={e => set("weight", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input className="form-input" type="number" value={form.height} onChange={e => set("height", e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fitness Goal</label>
                  <select className="form-input" value={form.goal} onChange={e => set("goal", e.target.value)}>
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Body Toning</option>
                    <option>General Fitness</option>
                    <option>Rehabilitation</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Notes</label>
                  <textarea className="form-input" rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} />
                </div>
              </div>

              <div>
                {/* Status */}
                <div className="card mb-16">
                  <div className="card-title">Member Status</div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={form.status} onChange={e => set("status", e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expiring">Expiring</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Expiry Date</label>
                    <input className="form-input" type="date" value={form.expiryDate} onChange={e => set("expiryDate", e.target.value)} />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline tap-scale"
                    style={{ width: "100%", marginTop: 12 }}
                    onClick={handleUpdateExpiry}
                    disabled={saving}
                  >
                    Update Status & Expiry
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary tap-scale btn-ripple"
                  disabled={saving}
                  style={{ width: "100%", padding: 13, fontSize: 14 }}
                >
                  {saving ? "Saving…" : "✓ Save Personal Details"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── Membership Tab ── */}
        {tab === "membership" && (
          <form onSubmit={handleRenewMembership} style={anim(0.1)}>
            <div className="grid-2" style={{ alignItems: "start" }}>
              <div className="card">
                <div className="card-title">Renew Membership</div>

                {/* Plan cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {PLANS.map(p => (
                    <div
                      key={p.label}
                      className="tap-scale"
                      onClick={() => set("plan", p.label)}
                      style={{
                        padding: "12px 14px",
                        border: `1px solid ${form.plan === p.label ? "var(--gold)" : "var(--border)"}`,
                        borderRadius: "var(--r-sm)",
                        background: form.plan === p.label ? "var(--gold-dim)" : "var(--card2)",
                        cursor: "pointer", transition: "all 0.18s",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: form.plan === p.label ? "var(--gold)" : "var(--text)" }}>
                        {p.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 2 }}>
                        ₹{p.price.toLocaleString()} · {p.months}mo
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-input" value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
                    <option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option>
                  </select>
                </div>

                {form.plan && (() => {
                  const p = PLANS.find(pl => pl.label === form.plan);
                  const expiry = format(addMonths(new Date(), p?.months || 1), "yyyy-MM-dd");
                  return (
                    <div className="info-box success mb-12">
                      ✓ Plan: <strong>{form.plan}</strong> · Amount: <strong>₹{p?.price.toLocaleString()}</strong> · New expiry: <strong>{expiry}</strong>
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  className="btn btn-primary tap-scale btn-ripple"
                  disabled={saving}
                  style={{ width: "100%", padding: 12 }}
                >
                  {saving ? "Processing…" : "💳 Renew Membership & Record Payment"}
                </button>
              </div>

              <div className="card">
                <div className="card-title">Current Membership</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Plan",    value: form.plan,      color: "var(--gold)"  },
                    { label: "Status",  value: form.status,    color: form.status === "active" ? "var(--green)" : "var(--red)" },
                    { label: "Expiry",  value: form.expiryDate || "—", color: "var(--text)" },
                    { label: "Paid",    value: form.amountPaid ? `₹${Number(form.amountPaid).toLocaleString()}` : "—", color: "var(--text)" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--card2)", borderRadius: "var(--r-sm)" }}>
                      <span style={{ fontSize: 12, color: "var(--muted2)" }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="info-box warning mt-12">
                  ℹ Renewing will update membership dates and record a new payment automatically.
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
