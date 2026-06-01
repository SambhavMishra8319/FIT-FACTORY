// import { useState, useEffect } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addMonths } from "date-fns";
import toast from "react-hot-toast";
import { addMember, addPayment, getAllMembers } from "../../firebase/service";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
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
    plan: prefill.plan || "3 Months",
    joinDate: today,
    paymentMethod: "Cash",
    notes: "",
    fatherName: "",
dob: "",
occupation: "",
address: "",
city: "",
pinCode: "",
alternatePhone: "",
bloodGroup: "",
medicalCondition: "",
previousInjury: "",
medication: "",
doctorAdvice: "",
emergencyName: "",
emergencyRelation: "",
emergencyPhone: "",
preferredTime: "",
referredBy: "",
discount: 0,
registrationFee: 0,
amountPaid: "",
balanceDue: "",
transactionId: "",
trainerAssigned: "",
batchTiming: "",
  });

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const updateArrows = () => {
      const scrollLeft = el.scrollLeft;

      const maxScroll = el.scrollWidth - el.clientWidth;

      setShowLeft(scrollLeft > 10);
      // setShowRight(scrollLeft < maxScroll - 5);
      setShowRight(Math.ceil(scrollLeft) < maxScroll - 5);
      // setShowRight(scrollLeft < maxScroll - 10);

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

      window.removeEventListener("resize", updateArrows);
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

  const expiryDate = form.joinDate
    ? format(
        addMonths(new Date(form.joinDate), selectedPlan.months),
        "yyyy-MM-dd",
      )
    : "";
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
  const bmi =
    form.weight && form.height
      ? (Number(form.weight) / (Number(form.height) / 100) ** 2).toFixed(1)
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const memberId = `F2-${Date.now()}`;
    if (saving) return;

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

    //   if (!/^\d{10}$/.test(form.phone)) {
    // toast.error("Phone number must be exactly 10 digits.");
    // return;
    // }
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

      // const phone = form.phone.trim().replace(/\D/g, "").slice(-10);
      const phone = form.phone.trim().replace(/\D/g, "").slice(-10);

      if (!/^\d{10}$/.test(phone)) {
        toast.error("Phone number must be exactly 10 digits.");
        setSaving(false);
        return;
      }

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
      const normalizePhone = (p = "") => {
        const digits = p.replace(/\D/g, "");
        return digits.length >= 10 ? digits.slice(-10) : digits;
      };

      // NAME + PHONE CHECK
      const samePersonExists = existing.some((m) => {
        const existingPhone = normalizePhone(m.phone);
        const inputPhone = normalizePhone(phone);

        return (
          (m.name || "").trim().toLowerCase() === name.trim().toLowerCase() &&
          existingPhone === inputPhone &&
          inputPhone.length === 10
        );
      });

      if (samePersonExists) {
        toast.error("This member already exists.");

        setSaving(false);
        return;
      }

      // =========================
      // MEMBER ID
      // =========================
      // const lastNumber =
      //   existing
      //     .map((m) => {
      //       const num = parseInt((m.memberId || "").replace("F2-", ""));

      //       return isNaN(num) ? 0 : num;
      //     })
      //     .sort((a, b) => b - a)[0] || 0;

      // const memberId = `F2-${String(lastNumber + 1).padStart(4, "0")}`;

      // =========================
      // MEMBER DATA
      // =========================
      const memberData = {
        memberId,

        name: form.name
          .trim()
          .replace(/\s+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),

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

        // status: "active",

        createdAt: new Date(),

        updatedAt: new Date(),
        fatherName: form.fatherName,
dob: form.dob,
occupation: form.occupation,
address: form.address,
city: form.city,
pinCode: form.pinCode,
alternatePhone: form.alternatePhone,
bloodGroup: form.bloodGroup,
medicalCondition: form.medicalCondition,
previousInjury: form.previousInjury,
medication: form.medication,
doctorAdvice: form.doctorAdvice,
emergencyName: form.emergencyName,
emergencyRelation: form.emergencyRelation,
emergencyPhone: form.emergencyPhone,
preferredTime: form.preferredTime,
referredBy: form.referredBy,
discount: Number(form.discount || 0),
registrationFee: Number(form.registrationFee || 0),
amountPaid: Number(form.amountPaid || selectedPlan.price),
balanceDue: Number(form.balanceDue || 0),
transactionId: form.transactionId,
trainerAssigned: form.trainerAssigned,
batchTiming: form.batchTiming,
      };
      // const today = new Date();
      const updated = allMembers
        .map((m) => {
          let status = "pending";

          if (!m.expiryDate) status = "pending";
          else {
            const expiry = new Date(m.expiryDate);
            const today = new Date();

            if (expiry < today) status = "expired";
            else if ((expiry - today) / (1000 * 60 * 60 * 24) <= 7)
              status = "expiring";
            else status = "active";
          }

          return { ...m, status };
        })
        .sort((a, b) => {
          const order = {
            active: 1,
            expiring: 2,
            expired: 3,
            pending: 4,
          };
          return order[a.status] - order[b.status];
        });
      // const updated = data
      //   .map((m) => {
      //     let status = "pending";

      //     if (!m.expiryDate) {
      //       status = "pending";
      //     } else {
      //       const expiry = new Date(m.expiryDate);

      //       if (expiry < today) {
      //         status = "expired";
      //       } else {
      //         const diffDays =
      //           (expiry - today) / (1000 * 60 * 60 * 24);

      //         if (diffDays <= 7) {
      //           status = "expiring";
      //         } else {
      //           status = "active";
      //         }
      //       }
      //     }

      //     return {
      //       ...m,
      //       status,
      //     };
      //   })
      //   .sort((a, b) => {
      //     const order = {
      //       active: 1,
      //       expiring: 2,
      //       expired: 3,
      //       pending: 4,
      //     };

      //     return order[a.status] - order[b.status];
      //   });
      // =========================
      // SAVE MEMBER
      // =========================
      const memberRef = await addMember({
        ...memberData,
        memberId,
      });
      const userQuery = await getDocs(
        query(collection(db, "users"), where("email", "==", email)),
      );

      if (!userQuery.empty) {
        await updateDoc(userQuery.docs[0].ref, {
          memberId: memberId,

          membershipAssigned: true,

          membershipStatus: "active",

          plan: form.plan,

          amountPaid: selectedPlan.price,

          expiryDate,
        });
      }
      // =========================
      // SAVE PAYMENT
      // =========================
      await addPayment({
        memberId,

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
          {/* PERSONAL DETAILS */}
          <div className="card" style={anim(0.08)}>
            <div className="card-title">Personal Details</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Father's / Husband's Name</label>
                <input
                  className="form-input"
                  value={form.fatherName}
                  onChange={(e) => set("fatherName", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  className={`form-input ${phoneExists ? "input-error" : ""}`}
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    set("phone", value);
                    setPhoneExists(
                      allMembers.some(
                        (m) =>
                          (m.phone || "").replace(/\D/g, "").slice(-10) ===
                          value,
                      ),
                    );
                  }}
                  required
                />
                {phoneExists && (
                  <div className="error-text">Phone already exists</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Alternate Phone</label>
                <input
                  className="form-input"
                  maxLength={10}
                  value={form.alternatePhone}
                  onChange={(e) =>
                    set("alternatePhone", e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className={`form-input ${emailExists ? "input-error" : ""}`}
                type="email"
                value={form.email}
                onChange={(e) => {
                  set("email", e.target.value);
                  setEmailExists(
                    allMembers.some(
                      (m) =>
                        (m.email || "").trim().toLowerCase() ===
                        e.target.value.trim().toLowerCase(),
                    ),
                  );
                }}
                required
              />
              {emailExists && (
                <div className="error-text">Email already exists</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.dob}
                  onChange={(e) => set("dob", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  className="form-input"
                  type="number"
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

            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input
                className="form-input"
                value={form.occupation}
                onChange={(e) => set("occupation", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-input"
                rows={2}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  className="form-input"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input
                  className="form-input"
                  value={form.pinCode}
                  onChange={(e) => set("pinCode", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* HEALTH DETAILS */}
          <div className="card" style={anim(0.1)}>
            <div className="card-title">Health Details</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                />
              </div>

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
                <label className="form-label">BMI</label>
                <input
                  className="form-input"
                  value={bmi}
                  readOnly
                  placeholder="Auto"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input
                  className="form-input"
                  value={form.bloodGroup}
                  onChange={(e) => set("bloodGroup", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Condition</label>
              <input
                className="form-input"
                value={form.medicalCondition}
                onChange={(e) => set("medicalCondition", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Previous Injury / Surgery</label>
              <input
                className="form-input"
                value={form.previousInjury}
                onChange={(e) => set("previousInjury", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Any Medication</label>
              <input
                className="form-input"
                value={form.medication}
                onChange={(e) => set("medication", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Doctor's Advice / Restrictions</label>
              <textarea
                className="form-input"
                rows={2}
                value={form.doctorAdvice}
                onChange={(e) => set("doctorAdvice", e.target.value)}
              />
            </div>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="card" style={anim(0.12)}>
            <div className="card-title">Emergency Contact Details</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact Person Name</label>
                <input
                  className="form-input"
                  value={form.emergencyName}
                  onChange={(e) => set("emergencyName", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship</label>
                <input
                  className="form-input"
                  value={form.emergencyRelation}
                  onChange={(e) => set("emergencyRelation", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  className="form-input"
                  maxLength={10}
                  value={form.emergencyPhone}
                  onChange={(e) =>
                    set("emergencyPhone", e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>
          </div>

          {/* FITNESS GOAL */}
          <div className="card" style={anim(0.14)}>
            <div className="card-title">Fitness Goal</div>

            <div className="form-group">
              <label className="form-label">Goal</label>
              <select
                className="form-input"
                value={form.goal}
                onChange={(e) => set("goal", e.target.value)}
              >
                <option>Weight Loss</option>
                <option>Fat Loss</option>
                <option>Muscle Gain</option>
                <option>Strength Training</option>
                <option>General Fitness</option>
                <option>Rehabilitation</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>

          {/* MEMBERSHIP PLANS */}
          <div className="card mb-16" style={anim(0.16)}>
            <div className="card-title">Membership Plans</div>

            <div className="membership-scroll-wrapper">
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

              <div ref={scrollRef} className="membership-scroll">
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
                          style={{ background: p.color }}
                        >
                          ACTIVE
                        </div>
                      )}

                      {p.label === "6 Months" && (
                        <div className="membership-popular">MOST POPULAR</div>
                      )}

                      <div
                        className="membership-tagline"
                        style={{ color: p.color }}
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

          {/* MEMBERSHIP DETAILS */}
          <div className="card" style={anim(0.18)}>
            <div className="card-title">Membership Details</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => set("joinDate", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input className="form-input" value={expiryDate} readOnly />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <input
                  className="form-input"
                  value={form.preferredTime}
                  onChange={(e) => set("preferredTime", e.target.value)}
                  placeholder="Morning / Evening"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Referred By</label>
                <input
                  className="form-input"
                  value={form.referredBy}
                  onChange={(e) => set("referredBy", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="card" style={anim(0.2)}>
            <div className="card-title">Payment Details</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Registration Fee</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.registrationFee}
                  onChange={(e) => set("registrationFee", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Membership Fee</label>
                <input
                  className="form-input"
                  type="number"
                  value={selectedPlan.price}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount Paid</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.amountPaid}
                  onChange={(e) => set("amountPaid", e.target.value)}
                  placeholder={selectedPlan.price}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Balance Due</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.balanceDue}
                  onChange={(e) => set("balanceDue", e.target.value)}
                />
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
            </div>

            <div className="form-group">
              <label className="form-label">Transaction ID</label>
              <input
                className="form-input"
                value={form.transactionId}
                onChange={(e) => set("transactionId", e.target.value)}
              />
            </div>
          </div>

          {/* OFFICE USE */}
          <div className="card" style={anim(0.22)}>
            <div className="card-title">For Office Use Only</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Trainer Assigned</label>
                <input
                  className="form-input"
                  value={form.trainerAssigned}
                  onChange={(e) => set("trainerAssigned", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Batch Timing</label>
                <input
                  className="form-input"
                  value={form.batchTiming}
                  onChange={(e) => set("batchTiming", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biometric ID</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.biometricId || ""}
                  onChange={(e) => set("biometricId", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* PLAN SUMMARY */}
          <div
            style={{
              background: `${selectedPlan.color}12`,
              border: `1px solid ${selectedPlan.color}40`,
              borderRadius: 18,
              padding: 18,
              fontSize: 14,
              lineHeight: 2,
              marginTop: 16,
            }}
          >
            <div>
              📋 Plan: <strong>{selectedPlan.label}</strong>
            </div>
            <div>
              💰 Amount:{" "}
              <strong>₹{selectedPlan.price.toLocaleString()}</strong>
            </div>
            <div>
              📅 Valid Till: <strong>{expiryDate}</strong>
            </div>
            <div>
              💳 Payment: <strong>{form.paymentMethod}</strong>
            </div>
          </div>

          {/* SUBMIT */}
          <div style={anim(0.24)}>
            <button
              type="submit"
              className="btn btn-primary tap-scale btn-ripple"
              disabled={saving}
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
          </div>
        </div>
      </form>
    </div>
  </div>
);
//   return (
//     <div className="page-enter">
//       <div className="topbar">
//         <div className="page-title">
//           {isPrefilled ? "Assign Membership" : "Add New Member"}
//         </div>

//         <div className="topbar-right">
//           <button
//             className="btn btn-outline tap-scale"
//             onClick={() => navigate(-1)}
//           >
//             ← Back
//           </button>
//         </div>
//       </div>

//       <div className="page-body">
//         {isPrefilled && (
//           <div className="info-box warning mb-16" style={anim(0.05)}>
//             ℹ Details pre-filled from app signup by{" "}
//             <strong>{prefill.name}</strong>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="add-member-grid">
//             {/* LEFT */}
//             <div style={anim(0.08)}>
//               <div className="card">
//                 <div className="card-title">Personal Details</div>

//                 <div className="form-row">
//                   {/* NAME */}
//                   <div className="form-group">
//                     <label className="form-label">Full Name *</label>

//                     <input
//                       className="form-input"
//                       placeholder="Rahul Sharma"
//                       value={form.name}
//                       onChange={(e) => set("name", e.target.value)}
//                       required
//                     />
//                   </div>

//                   {/* PHONE */}
//                   <div className="form-group">
//                     <label className="form-label">Phone *</label>
//                     <input
//                       className={`form-input ${
//                         phoneExists ? "input-error" : ""
//                       }`}
//                       placeholder="9876543210"
//                       maxLength={10}
//                       value={form.phone}
//                       onChange={(e) => {
//                         const value = e.target.value.replace(/\D/g, "");

//                         set("phone", value);

//                         // checkDuplicate("phone", value);
//                         setPhoneExists(
//                           allMembers.some(
//                             (m) =>
//                               (m.phone || "").replace(/\D/g, "").slice(-10) ===
//                               value,
//                           ),
//                         );
//                       }}
//                     />

//                     {phoneExists && (
//                       <div className="error-text">Phone already exists</div>
//                     )}
//                   </div>
//                 </div>

//                 {/* EMAIL */}
//                 <div className="form-group">
//                   <label className="form-label">Email *</label>

//                   <input
//                     className={`form-input ${emailExists ? "input-error" : ""}`}
//                     type="email"
//                     placeholder="member@gmail.com"
//                     value={form.email}
//                     onChange={(e) => {
//                       set("email", e.target.value);

//                       // checkDuplicate("email", e.target.value);
//                       setEmailExists(
//                         allMembers.some(
//                           (m) =>
//                             (m.email || "").trim().toLowerCase() ===
//                             e.target.value.trim().toLowerCase(),
//                         ),
//                       );
//                     }}
//                     required
//                   />

//                   {emailExists && (
//                     <div className="error-text">Email already exists</div>
//                   )}
//                 </div>

//                 {/* AGE + GENDER */}
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label className="form-label">Age</label>

//                     <input
//                       className="form-input"
//                       type="number"
//                       min="10"
//                       max="80"
//                       value={form.age}
//                       onChange={(e) => set("age", e.target.value)}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Gender</label>

//                     <select
//                       className="form-input"
//                       value={form.gender}
//                       onChange={(e) => set("gender", e.target.value)}
//                     >
//                       <option>Male</option>
//                       <option>Female</option>
//                       <option>Other</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label className="form-label">Weight (kg)</label>

//                     <input
//                       className="form-input"
//                       type="number"
//                       value={form.weight}
//                       onChange={(e) => set("weight", e.target.value)}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Height (cm)</label>

//                     <input
//                       className="form-input"
//                       type="number"
//                       value={form.height}
//                       onChange={(e) => set("height", e.target.value)}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">BMI</label>

//                     <input
//                       className="form-input"
//                       value={bmi}
//                       readOnly
//                       placeholder="BMI Auto"
//                     />
//                   </div>
//                 </div>
// <div className="form-row">
//   <div className="form-group">
//     <label className="form-label">Father's / Husband's Name</label>
//     <input className="form-input" value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Date of Birth</label>
//     <input className="form-input" type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
//   </div>
// </div>

// <div className="form-group">
//   <label className="form-label">Occupation</label>
//   <input className="form-input" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} />
// </div>

// <div className="form-group">
//   <label className="form-label">Address</label>
//   <textarea className="form-input" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} />
// </div>

// <div className="form-row">
//   <div className="form-group">
//     <label className="form-label">City</label>
//     <input className="form-input" value={form.city} onChange={(e) => set("city", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Pin Code</label>
//     <input className="form-input" value={form.pinCode} onChange={(e) => set("pinCode", e.target.value)} />
//   </div>
// </div>

// <div className="form-group">
//   <label className="form-label">Alternate Phone</label>
//   <input className="form-input" value={form.alternatePhone} onChange={(e) => set("alternatePhone", e.target.value.replace(/\D/g, ""))} />
// </div>
// <div className="card">
//   <div className="card-title">Health Details</div>

//   <div className="form-row">
//     <div className="form-group">
//       <label className="form-label">Blood Group</label>
//       <input className="form-input" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} />
//     </div>
//   </div>

//   <div className="form-group">
//     <label className="form-label">Medical Condition</label>
//     <input className="form-input" value={form.medicalCondition} onChange={(e) => set("medicalCondition", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Previous Injury / Surgery</label>
//     <input className="form-input" value={form.previousInjury} onChange={(e) => set("previousInjury", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Any Medication</label>
//     <input className="form-input" value={form.medication} onChange={(e) => set("medication", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Doctor's Advice / Restrictions</label>
//     <textarea className="form-input" rows={2} value={form.doctorAdvice} onChange={(e) => set("doctorAdvice", e.target.value)} />
//   </div>
// </div>
// <div className="card">
//   <div className="card-title">Emergency Contact</div>

//   <div className="form-group">
//     <label className="form-label">Contact Person Name</label>
//     <input className="form-input" value={form.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Relationship</label>
//     <input className="form-input" value={form.emergencyRelation} onChange={(e) => set("emergencyRelation", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Contact Number</label>
//     <input className="form-input" value={form.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value.replace(/\D/g, ""))} />
//   </div>
// </div>

// <div className="card">
//   <div className="card-title">Office Use</div>

//   <div className="form-group">
//     <label className="form-label">Trainer Assigned</label>
//     <input className="form-input" value={form.trainerAssigned} onChange={(e) => set("trainerAssigned", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Batch Timing</label>
//     <input className="form-input" value={form.batchTiming} onChange={(e) => set("batchTiming", e.target.value)} />
//   </div>

//   <div className="form-group">
//     <label className="form-label">Referred By</label>
//     <input className="form-input" value={form.referredBy} onChange={(e) => set("referredBy", e.target.value)} />
//   </div>
// </div>
//                 {/* WEIGHT + HEIGHT */}
                
//                 {/* BMI */}

//                 {/* GOAL */}
//                 <div className="form-group">
//                   <label className="form-label">Fitness Goal</label>

//                   <select
//                     className="form-input"
//                     value={form.goal}
//                     onChange={(e) => set("goal", e.target.value)}
//                   >
//                     <option>Weight Loss</option>
//                     <option>Muscle Gain</option>
//                     <option>Body Toning</option>
//                     <option>General Fitness</option>
//                     <option>Rehabilitation</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Biometric ID</label>
//                   <input
//                     type="number"
//                     value={form.biometricId || ""}
//                     onChange={(e) =>
//                       setForm({
//                         ...form,
//                         biometricId: e.target.value,
//                       })
//                     }
//                     placeholder="Fingerprint User ID"
//                   />
//                 </div>
//                 {/* NOTES */}
//                 <div className="form-group">
//                   <label className="form-label">Notes</label>

//                   <textarea
//                     className="form-input"
//                     rows={3}
//                     placeholder="Trainer notes..."
//                     value={form.notes}
//                     onChange={(e) => set("notes", e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* MEMBERSHIP DETAILS */}
//             <div
//               style={{
//                 background: `${selectedPlan.color}12`,
//                 border: `1px solid ${selectedPlan.color}40`,
//                 borderRadius: 18,
//                 padding: 18,
//                 fontSize: 14,
//                 lineHeight: 2,
//                 marginTop: 16,
//               }}
//             >
//               <div>
//                 📋 Plan:
//                 <strong> {selectedPlan.label}</strong>
//               </div>

//               <div>
//                 💰 Amount:
//                 <strong> ₹{selectedPlan.price.toLocaleString()}</strong>
//               </div>

//               <div>
//                 📅 Valid Till:
//                 <strong> {expiryDate}</strong>
//               </div>

//               <div>
//                 💳 Payment:
//                 <strong> {form.paymentMethod}</strong>
//               </div>
//             </div>

//             {/* DATE + PAYMENT */}
//             <div className="form-row mt-16">
//               <div className="form-group">
//                 <label className="form-label">Start Date</label>

//                 <input
//                   className="form-input"
//                   type="date"
//                   value={form.joinDate}
//                   onChange={(e) => set("joinDate", e.target.value)}
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Payment Method</label>

//                 <select
//                   className="form-input"
//                   value={form.paymentMethod}
//                   onChange={(e) => set("paymentMethod", e.target.value)}
//                 >
//                   <option>Cash</option>
//                   <option>UPI</option>
//                   <option>Card</option>
//                   <option>Bank Transfer</option>
//                 </select>
//               </div>
//             </div>

//             <div className="card mb-16">
//               <div className="card-title">Membership Plans</div>

//               <div className="membership-scroll-wrapper">
//                 {/* LEFT ARROW */}
//                 {showLeft && (
//                   <button
//                     type="button"
//                     className="scroll-arrow left"
//                     onClick={() =>
//                       scrollRef.current?.scrollBy({
//                         left: -320,
//                         behavior: "smooth",
//                       })
//                     }
//                   >
//                     ←
//                   </button>
//                 )}

//                 {/* SCROLL AREA */}
//                 <div ref={scrollRef} className="membership-scroll">
//                   {PLANS.map((p) => {
//                     const active = form.plan === p.label;

//                     return (
//                       <div
//                         key={p.label}
//                         onClick={() => set("plan", p.label)}
//                         className={`membership-card ${active ? "active" : ""}`}
//                         style={{
//                           borderColor: active
//                             ? p.color
//                             : "rgba(255,255,255,0.06)",

//                           boxShadow: active
//                             ? `0 0 35px ${p.color}25`
//                             : "0 8px 25px rgba(0,0,0,0.35)",
//                         }}
//                       >
//                         {active && (
//                           <div
//                             className="membership-badge"
//                             style={{
//                               background: p.color,
//                             }}
//                           >
//                             ACTIVE
//                           </div>
//                         )}

//                         {p.label === "6 Months" && (
//                           <div className="membership-popular">MOST POPULAR</div>
//                         )}

//                         <div
//                           className="membership-tagline"
//                           style={{
//                             color: p.color,
//                           }}
//                         >
//                           {p.tagline}
//                         </div>

//                         <div className="membership-price-row">
//                           <div className="membership-price">
//                             ₹{p.price.toLocaleString()}
//                           </div>

//                           <div className="membership-duration">
//                             / {p.months} mo
//                           </div>
//                         </div>

//                         <div
//                           className="membership-pill"
//                           style={{
//                             background: `${p.color}15`,
//                             color: p.color,
//                             border: `1px solid ${p.color}40`,
//                           }}
//                         >
//                           {p.perDay}
//                         </div>

//                         <div className="membership-features">
//                           {p.features.map((f, i) => (
//                             <div key={i} className="membership-feature">
//                               <div
//                                 className="membership-feature-icon"
//                                 style={{
//                                   background: `${p.color}15`,
//                                   color: p.color,
//                                 }}
//                               >
//                                 ✓
//                               </div>

//                               <span>{f}</span>
//                             </div>
//                           ))}
//                         </div>

//                         <button
//                           type="button"
//                           className="membership-btn"
//                           style={{
//                             background: active ? p.color : "#202020",

//                             color: active ? "#000" : "#fff",
//                           }}
//                         >
//                           {active ? "✓ Selected" : "Choose Plan"}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* RIGHT ARROW */}
//                 {showRight && (
//                   <button
//                     type="button"
//                     className={`scroll-arrow right ${
//                       !hasScrolled ? "pulse-arrow" : ""
//                     }`}
//                     onClick={() =>
//                       scrollRef.current?.scrollBy({
//                         left: 320,
//                         behavior: "smooth",
//                       })
//                     }
//                   >
//                     →
//                   </button>
//                 )}
//               </div>
//             </div>
//             {
//               <div style={anim(0.14)}>
//                 <button
//                   type="submit"
//                   className="btn btn-primary tap-scale btn-ripple"
//                   // disabled={saving || emailExists || phoneExists}
//                   disabled={saving}
//                   style={{
//                     width: "100%",
//                     padding: 15,
//                     fontSize: 15,
//                     fontWeight: 700,
//                   }}
//                 >
//                   {saving
//                     ? "Registering..."
//                     : isPrefilled
//                       ? `✓ Assign ${form.plan}`
//                       : "✓ Register Member"}
//                 </button>
//               </div>
//             }
//           </div>
//         </form>
//       </div>
//     </div>
//   );
}
