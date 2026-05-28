
// import { useState, useEffect } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addMonths } from "date-fns";
import toast from "react-hot-toast";
import { addMember, addPayment, getAllMembers } from "../../firebase/service";

const PLANS = [
  {
    label: "1 Month",
    months: 1,
    price: 1499,
    color: "#facc15",
    perDay: "₹50 / DAY",
    tagline: "Basic Membership",
    features: [
      "Full Gym Access",
      "Cardio Section Access",
      "Strength Training Access",
    ],
  },

  {
    label: "3 Months",
    months: 3,
    price: 3999,
    color: "#84cc16",
    perDay: "₹44 / DAY",
    tagline: "Transformation Starter",
    features: [
      "Full Gym Access",
      "Cardio Section Access",
      "Strength Training Access",
      "1 BCA Session",
      "3 Massage Chair Sessions",
    ],
  },

  {
    label: "6 Months",
    months: 6,
    price: 7999,
    color: "#3b82f6",
    perDay: "₹44 / DAY",
    tagline: "Premium Fitness Plan",
    features: [
      "Full Gym Access",
      "Cardio Section Access",
      "Strength Training Access",
      "3 BCA Sessions",
      "8 Massage Chair Sessions",
      "3 Steam Bath Sessions",
    ],
  },

  {
    label: "Annual",
    months: 12,
    price: 14999,
    color: "#a855f7",
    perDay: "₹41 / DAY",
    tagline: "Elite Fitness Plan",
    features: [
      "Full Gym Access",
      "Cardio Section Access",
      "Strength Training Access",
      "8 BCA Sessions",
      "20 Massage Chair Sessions",
      "8 Steam Bath Sessions",
    ],
  },

  {
    label: "Elite VIP",
    months: 12,
    price: 19999,
    color: "#f59e0b",
    perDay: "₹55 / DAY",
    tagline: "VIP Membership",
    features: [
      "Premium Membership",
      "Free Locker",
      "Unlimited BCA",
      "Unlimited Massage Chair",
      "Unlimited Steam Bath",
      "Exclusive Merchandise",
    ],
  },
];


export default function AddMember() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = location.state?.prefill || {};

  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const [allMembers, setAllMembers] = useState([]);

  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
const scrollRef = useRef(null);

const [showLeft, setShowLeft] = useState(false);
// const [showRight, setShowRight] = useState(true);
const [showRight, setShowRight] = useState(true);
const [hasScrolled, setHasScrolled] = useState(false);
  const [form, setForm] = useState({
    name: prefill.name || "",
    phone: prefill.phone || "",
    email: prefill.email || "",
    age: "",
    gender: "Male",
    weight: "",
    height: "",
    goal: prefill.goal || "General Fitness",
    plan: "3 Months",
    joinDate: today,
    paymentMethod: "Cash",
    notes: "",
  });
// useEffect(() => {

//   const el = scrollRef.current;

//   if (!el) return;

//   const updateArrows = () => {

//     const scrollLeft = el.scrollLeft;

//     const maxScroll =
//       el.scrollWidth - el.clientWidth;

//     setShowLeft(scrollLeft > 10);

//     setShowRight(scrollLeft < maxScroll - 10);
//   };

//   updateArrows();

//   el.addEventListener("scroll", updateArrows);

//   window.addEventListener("resize", updateArrows);
// if (scrollLeft > 20) {
//   setHasScrolled(true);
// }
//   return () => {
//     el.removeEventListener("scroll", updateArrows);
//     window.removeEventListener("resize", updateArrows);
//   };

// }, []);
  
useEffect(() => {
  const el = scrollRef.current;

  if (!el) return;

  const updateArrows = () => {
    const scrollLeft = el.scrollLeft;

    const maxScroll =
      el.scrollWidth - el.clientWidth;

    setShowLeft(scrollLeft > 10);

    setShowRight(scrollLeft < maxScroll - 10);

    // stop pulse after first scroll
    if (scrollLeft > 20) {
      setHasScrolled(true);
    }
  };

  updateArrows();

  el.addEventListener("scroll", updateArrows);

  window.addEventListener("resize", updateArrows);

  return () => {
    el.removeEventListener("scroll", updateArrows);

    window.removeEventListener(
      "resize",
      updateArrows
    );
  };
}, []);
  useEffect(() => {
    setTimeout(() => setVisible(true), 80);

    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const members = await getAllMembers();
      setAllMembers(members);
    } catch (err) {
      console.error(err);
    }
  };

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const selectedPlan = PLANS.find((p) => p.label === form.plan) || PLANS[0];

  const expiryDate = format(
    addMonths(new Date(form.joinDate), selectedPlan.months),
    "yyyy-MM-dd",
  );

  const isPrefilled = !!(prefill.name || prefill.email);

  // =========================
  // DUPLICATE CHECK
  // =========================
  const checkDuplicate = (type, value) => {
    if (!value.trim()) return;

    if (type === "email") {
      const exists = allMembers.some(
        (m) =>
          (m.email || "").trim().toLowerCase() === value.trim().toLowerCase(),
      );

      setEmailExists(exists);

      if (exists) {
        toast.error("Email already exists");
      }
    }

    if (type === "phone") {
      const exists = allMembers.some(
        (m) => (m.phone || "").trim() === value.trim(),
      );

      setPhoneExists(exists);

      if (exists) {
        toast.error("Phone number already exists");
      }
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (form.phone.length !== 10) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    setSaving(true);

    try {
      // =========================
      // GET ALL MEMBERS
      // =========================
      const existing = await getAllMembers();

      // =========================
      // NORMALIZED VALUES
      // =========================
      const email = form.email.trim().toLowerCase();

      const phone = form.phone.trim().replace(/\D/g, "").slice(-10);

      const name = form.name.trim().toLowerCase();

      // =========================
      // DUPLICATE CHECKS
      // =========================

      // EMAIL CHECK
      const emailAlreadyExists = existing.some(
        (m) => (m.email || "").trim().toLowerCase() === email,
      );

      if (emailAlreadyExists) {
        toast.error("Member with this email already exists.");

        setSaving(false);
        return;
      }

      // PHONE CHECK
      const phoneAlreadyExists = existing.some(
        (m) => (m.phone || "").replace(/\D/g, "").slice(-10) === phone,
      );

      if (phoneAlreadyExists) {
        toast.error("Member with this phone already exists.");

        setSaving(false);
        return;
      }

      // NAME + PHONE CHECK
      const samePersonExists = existing.some(
        (m) =>
          (m.name || "").trim().toLowerCase() === name &&
          (m.phone || "").replace(/\D/g, "").slice(-10) === phone,
      );

      if (samePersonExists) {
        toast.error("This member already exists.");

        setSaving(false);
        return;
      }

      // =========================
      // MEMBER ID
      // =========================
      const lastNumber =
        existing
          .map((m) => {
            const num = parseInt((m.memberId || "").replace("F2-", ""));

            return isNaN(num) ? 0 : num;
          })
          .sort((a, b) => b - a)[0] || 0;

      const memberId = `F2-${String(lastNumber + 1).padStart(4, "0")}`;

      // =========================
      // MEMBER DATA
      // =========================
      const memberData = {
        memberId,

        name: form.name.trim(),

        phone,

        email,

        age: form.age,

        gender: form.gender,

        weight: form.weight,

        height: form.height,

        goal: form.goal,

        plan: form.plan,

        joinDate: form.joinDate,

        expiryDate,

        paymentMethod: form.paymentMethod,

        amountPaid: selectedPlan.price,

        notes: form.notes.trim(),

        status: "active",

        createdAt: new Date(),

        updatedAt: new Date(),
      };

      // =========================
      // SAVE MEMBER
      // =========================
      const memberRef = await addMember(memberData);

      // =========================
      // SAVE PAYMENT
      // =========================
      await addPayment({
        memberId: memberRef.id,

        memberName: form.name.trim(),

        plan: form.plan,

        amount: selectedPlan.price,

        method: form.paymentMethod,

        date: form.joinDate,

        type: "new_membership",

        status: "paid",

        createdAt: new Date(),
      });

      toast.success(`${form.name} registered as ${memberId} 💪`);

      navigate("/members");
    } catch (err) {
      console.error(err);

      toast.error("Registration failed.");
    } finally {
      setSaving(false);
    }
  };
  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">
          {isPrefilled ? "Assign Membership" : "Add New Member"}
        </div>

        <div className="topbar-right">
          <button
            className="btn btn-outline tap-scale"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="page-body">
        {isPrefilled && (
          <div className="info-box warning mb-16" style={anim(0.05)}>
            ℹ Details pre-filled from app signup by{" "}
            <strong>{prefill.name}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="add-member-grid">
            {/* LEFT */}
            <div style={anim(0.08)}>
              <div className="card">
                <div className="card-title">Personal Details</div>

                <div className="form-row">
                  {/* NAME */}
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>

                    <input
                      className="form-input"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                    />
                  </div>

                  {/* PHONE */}
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      className={`form-input ${
                        phoneExists ? "input-error" : ""
                      }`}
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        set("phone", value);

                        checkDuplicate("phone", value);
                      }}
                    />

                    {phoneExists && (
                      <div className="error-text">Phone already exists</div>
                    )}
                    {/* <input
                      className={`form-input ${
                        phoneExists ? "input-error" : ""
                      }`}
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        set("phone", value);

                        setPhoneExists(false);
                      }}
                      onBlur={(e) =>
                        checkDuplicate("phone", e.target.value)
                      }
                    />

                    {phoneExists && (
                      <div
                        style={{
                          color: "#ef4444",
                          fontSize: 12,
                          marginTop: 6,
                        }}
                      >
                        ⚠ Phone number already exists
                      </div>
                    )} */}
                  </div>
                </div>

                {/* EMAIL */}
                <div className="form-group">
                  <label className="form-label">Email *</label>

                  <input
  className={`form-input ${
    emailExists ? "input-error" : ""
  }`}
  type="email"
  placeholder="member@gmail.com"
  value={form.email}
  onChange={(e) => {
    set("email", e.target.value);

    checkDuplicate("email", e.target.value);
  }}
  required
/>

{emailExists && (
  <div className="error-text">
    Email already exists
  </div>
)}
                </div>

                {/* AGE + GENDER */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Age</label>

                    <input
                      className="form-input"
                      type="number"
                      min="10"
                      max="80"
                      value={form.age}
                      onChange={(e) => set("age", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>

                    <select
                      className="form-input"
                      value={form.gender}
                      onChange={(e) => set("gender", e.target.value)}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* WEIGHT + HEIGHT */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>

                    <input
                      className="form-input"
                      type="number"
                      value={form.weight}
                      onChange={(e) => set("weight", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>

                    <input
                      className="form-input"
                      type="number"
                      value={form.height}
                      onChange={(e) => set("height", e.target.value)}
                    />
                  </div>
                </div>

                {/* GOAL */}
                <div className="form-group">
                  <label className="form-label">Fitness Goal</label>

                  <select
                    className="form-input"
                    value={form.goal}
                    onChange={(e) => set("goal", e.target.value)}
                  >
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Body Toning</option>
                    <option>General Fitness</option>
                    <option>Rehabilitation</option>
                  </select>
                </div>

                {/* NOTES */}
                <div className="form-group">
                  <label className="form-label">Notes</label>

                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Trainer notes..."
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            {/* RIGHT */}
            {/* <div style={anim(0.14)}>
              <div className="card mb-16">
                <div className="card-title">Membership Plans</div>

                <div className="membership-scroll">
                  {PLANS.map((p) => {
                    const active = form.plan === p.label;

                    return (
                      <div
                        key={p.label}
                        onClick={() => set("plan", p.label)}
                        className={`membership-card ${active ? "active" : ""}`}
                        style={{
                          borderColor: active
                            ? p.color
                            : "rgba(255,255,255,0.06)",

                          boxShadow: active
                            ? `0 0 35px ${p.color}25`
                            : "0 8px 25px rgba(0,0,0,0.35)",
                        }}
                      >
                        {active && (
                          <div
                            className="membership-badge"
                            style={{
                              background: p.color,
                            }}
                          >
                            ACTIVE
                          </div>
                        )}

                        {p.label === "6 Months" && (
                          <div className="membership-popular">MOST POPULAR</div>
                        )}

                        <div
                          className="membership-tagline"
                          style={{
                            color: p.color,
                          }}
                        >
                          {p.tagline}
                        </div>

                        <div className="membership-price-row">
                          <div className="membership-price">
                            ₹{p.price.toLocaleString()}
                          </div>

                          <div className="membership-duration">
                            / {p.months} mo
                          </div>
                        </div>

                        <div
                          className="membership-pill"
                          style={{
                            background: `${p.color}15`,
                            color: p.color,
                            border: `1px solid ${p.color}40`,
                          }}
                        >
                          {p.perDay}
                        </div>

                        <div className="membership-features">
                          {p.features.map((f, i) => (
                            <div key={i} className="membership-feature">
                              <div
                                className="membership-feature-icon"
                                style={{
                                  background: `${p.color}15`,
                                  color: p.color,
                                }}
                              >
                                ✓
                              </div>

                              <span>{f}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="membership-btn"
                          style={{
                            background: active ? p.color : "#202020",

                            color: active ? "#000" : "#fff",
                          }}
                        >
                          {active ? "✓ Selected" : "Choose Plan"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>

                    <input
                      className="form-input"
                      type="date"
                      value={form.joinDate}
                      onChange={(e) => set("joinDate", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiry</label>

                    <input className="form-input" value={expiryDate} readOnly />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>

                  <select
                    className="form-input"
                    value={form.paymentMethod}
                    onChange={(e) => set("paymentMethod", e.target.value)}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <div
                  style={{
                    background: `${selectedPlan.color}12`,
                    border: `1px solid ${selectedPlan.color}40`,
                    borderRadius: 18,
                    padding: 18,
                    fontSize: 14,
                    lineHeight: 2,
                  }}
                >
                  <div>
                    📋 Plan:
                    <strong> {selectedPlan.label}</strong>
                  </div>

                  <div>
                    💰 Amount:
                    <strong> ₹{selectedPlan.price.toLocaleString()}</strong>
                  </div>

                  <div>
                    📅 Valid Till:
                    <strong> {expiryDate}</strong>
                  </div>

                  <div>
                    💳 Payment:
                    <strong> {form.paymentMethod}</strong>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary tap-scale btn-ripple"
                disabled={saving || emailExists || phoneExists}
                style={{
                  width: "100%",
                  padding: 15,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {saving
                  ? "Registering..."
                  : isPrefilled
                    ? `✓ Assign ${form.plan}`
                    : "✓ Register Member"}
              </button>
            </div> */}
            <div className="card mb-16">

  <div className="card-title">
    Membership Plans
  </div>

  <div className="membership-scroll-wrapper">

    {/* LEFT ARROW */}
    {showLeft && (
  <button
    type="button"
    className="scroll-arrow left"
    onClick={() =>
      scrollRef.current?.scrollBy({
        left: -320,
        behavior: "smooth",
      })
    }
  >
    ←
  </button>
)}

    {/* SCROLL AREA */}
  <div
  ref={scrollRef}
  className="membership-scroll"
>
      {PLANS.map((p) => {

        const active = form.plan === p.label;

        return (
          <div
            key={p.label}
            onClick={() => set("plan", p.label)}
            className={`membership-card ${active ? "active" : ""}`}
            style={{
              borderColor: active
                ? p.color
                : "rgba(255,255,255,0.06)",

              boxShadow: active
                ? `0 0 35px ${p.color}25`
                : "0 8px 25px rgba(0,0,0,0.35)",
            }}
          >

            {active && (
              <div
                className="membership-badge"
                style={{
                  background: p.color,
                }}
              >
                ACTIVE
              </div>
            )}

            {p.label === "6 Months" && (
              <div className="membership-popular">
                MOST POPULAR
              </div>
            )}

            <div
              className="membership-tagline"
              style={{
                color: p.color,
              }}
            >
              {p.tagline}
            </div>

            <div className="membership-price-row">
              <div className="membership-price">
                ₹{p.price.toLocaleString()}
              </div>

              <div className="membership-duration">
                / {p.months} mo
              </div>
            </div>

            <div
              className="membership-pill"
              style={{
                background: `${p.color}15`,
                color: p.color,
                border: `1px solid ${p.color}40`,
              }}
            >
              {p.perDay}
            </div>

            <div className="membership-features">

              {p.features.map((f, i) => (
                <div
                  key={i}
                  className="membership-feature"
                >
                  <div
                    className="membership-feature-icon"
                    style={{
                      background: `${p.color}15`,
                      color: p.color,
                    }}
                  >
                    ✓
                  </div>

                  <span>{f}</span>
                </div>
              ))}

            </div>

            <button
              type="button"
              className="membership-btn"
              style={{
                background: active
                  ? p.color
                  : "#202020",

                color: active
                  ? "#000"
                  : "#fff",
              }}
            >
              {active
                ? "✓ Selected"
                : "Choose Plan"}
            </button>

          </div>
        );
      })}

    </div>

    {/* RIGHT ARROW */}
    {showRight && (
  <button
    type="button"
    className={`scroll-arrow right ${
  !hasScrolled ? "pulse-arrow" : ""
}`}
    onClick={() =>
      scrollRef.current?.scrollBy({
        left: 320,
        behavior: "smooth",
      })
    }
  >
    →
  </button>
)}

  </div>

</div>
            {/* <div style={anim(0.14)}>
              <button
                type="submit"
                className="btn btn-primary tap-scale btn-ripple"
                disabled={
                  saving ||
                  emailExists ||
                  phoneExists
                }
                style={{
                  width: "100%",
                  padding: 15,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {saving
                  ? "Registering..."
                  : isPrefilled
                  ? `✓ Assign ${form.plan}`
                  : "✓ Register Member"}
              </button>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
}
