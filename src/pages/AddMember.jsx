import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addMonths } from "date-fns";
import toast from "react-hot-toast";
import { addMember, addPayment, getAllMembers } from "../firebase/service";

const PLANS = [
  { label: "Monthly",   months: 1,  price: 1500 },
  { label: "Quarterly", months: 3,  price: 3500 },
  { label: "6 Month",   months: 6,  price: 7000 },
  { label: "Annual",    months: 12, price: 12000 },
];

export default function AddMember() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefill   = location.state?.prefill || {};   // ← from dashboard "Assign Plan"
  const [saving, setSaving]   = useState(false);
  const [visible, setVisible] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");

  const [form, setForm] = useState({
    name:          prefill.name  || "",
    phone:         prefill.phone || "",
    email:         prefill.email || "",
    age:           "",
    gender:        "Male",
    weight:        "",
    height:        "",
    goal:          prefill.goal  || "General Fitness",
    plan:          "Monthly",
    joinDate:      today,
    paymentMethod: "Cash",
    notes:         "",
  });

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const selectedPlan = PLANS.find(p => p.label === form.plan) || PLANS[0];
  const expiryDate   = format(addMonths(new Date(form.joinDate), selectedPlan.months), "yyyy-MM-dd");

  // Show a banner if pre-filled from app signup
  const isPrefilled = !!(prefill.name || prefill.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())      { toast.error("Name is required.");  return; }
    if (!form.email.trim())     { toast.error("Email is required."); return; }
    setSaving(true);
    try {
      // Auto-generate member ID
      const existing  = await getAllMembers();
      const memberId  = `F2-${String(existing.length + 1).padStart(4, "0")}`;

      const memberData = {
        memberId,
        name:          form.name.trim(),
        phone:         form.phone.trim(),
        email:         form.email.trim().toLowerCase(),
        age:           form.age,
        gender:        form.gender,
        weight:        form.weight,
        height:        form.height,
        goal:          form.goal,
        plan:          form.plan,
        joinDate:      form.joinDate,
        expiryDate,
        paymentMethod: form.paymentMethod,
        amountPaid:    selectedPlan.price,
        notes:         form.notes.trim(),
        status:        "active",
      };

      const memberRef = await addMember(memberData);

      await addPayment({
        memberId:   memberRef.id,
        memberName: form.name.trim(),
        plan:       form.plan,
        amount:     selectedPlan.price,
        method:     form.paymentMethod,
        date:       form.joinDate,
        type:       "new_membership",
        status:     "paid",
      });

      toast.success(`${form.name} registered as ${memberId} 💪`);
      navigate("/members");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const anim = delay => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">{isPrefilled ? "Assign Membership" : "Add New Member"}</div>
        <div className="topbar-right">
          <button className="btn btn-outline tap-scale" onClick={() => navigate(-1)}>← Back</button>
        </div>
      </div>

      <div className="page-body">
        {/* Pre-fill notice */}
        {isPrefilled && (
          <div className="info-box warning mb-16" style={anim(0.05)}>
            ℹ Details pre-filled from app signup by <strong>{prefill.name}</strong>. Review and assign a membership plan.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ alignItems: "start" }}>

            {/* ── Personal Details ── */}
            <div style={anim(0.08)}>
              <div className="card">
                <div className="card-title">Personal Details</div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Rahul Sharma"
                      value={form.name} onChange={e => set("name", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="9876543210" maxLength={10}
                      value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/, ""))} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email * (for member app login)</label>
                  <input className="form-input" type="email" placeholder="member@gmail.com"
                    value={form.email} onChange={e => set("email", e.target.value)} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input className="form-input" type="number" min="10" max="80" placeholder="25"
                      value={form.age} onChange={e => set("age", e.target.value)} />
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
                    <input className="form-input" type="number" step="0.1" placeholder="70"
                      value={form.weight} onChange={e => set("weight", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input className="form-input" type="number" placeholder="170"
                      value={form.height} onChange={e => set("height", e.target.value)} />
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
                  <textarea className="form-input" rows={2}
                    placeholder="Health conditions, trainer notes..."
                    value={form.notes} onChange={e => set("notes", e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── Membership Details ── */}
            <div style={anim(0.14)}>
              <div className="card mb-16">
                <div className="card-title">Membership Plan</div>

                {/* Plan selector cards */}
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
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: 13,
                        color: form.plan === p.label ? "var(--gold)" : "var(--text)",
                      }}>
                        {p.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 2 }}>
                        ₹{p.price.toLocaleString()} · {p.months}mo
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="date"
                      value={form.joinDate} onChange={e => set("joinDate", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry (auto)</label>
                    <input className="form-input" value={expiryDate} readOnly
                      style={{ opacity: 0.6, cursor: "not-allowed" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-input" value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                {/* Summary */}
                <div style={{
                  background: "rgba(34,197,94,0.07)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "var(--r-sm)", padding: "12px 14px",
                  fontSize: 13, lineHeight: 1.8,
                }}>
                  <div>📋 Plan: <strong>{selectedPlan.label}</strong></div>
                  <div>💰 Amount: <strong>₹{selectedPlan.price.toLocaleString()}</strong></div>
                  <div>📅 Valid till: <strong>{expiryDate}</strong></div>
                  <div>💳 Payment: <strong>{form.paymentMethod}</strong></div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary tap-scale btn-ripple"
                disabled={saving}
                style={{ width: "100%", padding: 13, fontSize: 14 }}
              >
                {saving
                  ? "Registering…"
                  : isPrefilled
                    ? `✓ Assign ${form.plan} to ${form.name}`
                    : "✓ Register Member"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
