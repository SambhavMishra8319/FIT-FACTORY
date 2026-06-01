import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, addMonths } from "date-fns";
import toast from "react-hot-toast";
import { getMembershipStatus } from "../../utils/membershipStatus";
import {
  getMember,
  updateMember,
  recordPaymentAndActivate,
} from "../../firebase/service";

const PLANS = [
  { label: "1 Month", months: 1, price: 1499 },
  { label: "3 Months", months: 3, price: 3999 },
  { label: "6 Months", months: 6, price: 7999 },
  { label: "Annual", months: 12, price: 14999 },
  { label: "Elite VIP", months: 12, price: 19999 },
];

const TIME_SLOTS = [
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("details");
  const [visible, setVisible] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    dob: "",
    age: "",
    gender: "Male",
    occupation: "",
    address: "",
    city: "",
    pinCode: "",

    weight: "",
    height: "",
    bloodGroup: "",
    medicalCondition: "",
    previousInjury: "",
    medication: "",
    doctorAdvice: "",

    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    goal: "General Fitness",
    preferredTime: "",
    trainerAssigned: "",
    batchTiming: "",
    referredBy: "",
    biometricId: "",
    notes: "",

    status: "active",
    expiryDate: "",
    plan: "Monthly",
    amountPaid: "",
    paymentMethod: "Cash",
    registrationFee: 0,
    discount: 0,
    transactionId: "",
  });

  useEffect(() => {
    fetchMember();
    setTimeout(() => setVisible(true), 60);
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : "";
  };

  async function fetchMember() {
    try {
      const m = await getMember(id);

      if (!m) {
        toast.error("Member not found.");
        navigate("/members");
        return;
      }

      setForm({
        name: m.name || "",
        fatherName: m.fatherName || "",
        phone: m.phone || "",
        alternatePhone: m.alternatePhone || "",
        email: m.email || "",
        dob: m.dob || "",
        age: m.dob ? calculateAge(m.dob) : m.age || "",
        gender: m.gender || "Male",
        occupation: m.occupation || "",
        address: m.address || "",
        city: m.city || "",
        pinCode: m.pinCode || "",

        weight: m.weight || "",
        height: m.height || "",
        bloodGroup: m.bloodGroup || "",
        medicalCondition: m.medicalCondition || "",
        previousInjury: m.previousInjury || "",
        medication: m.medication || "",
        doctorAdvice: m.doctorAdvice || "",

        emergencyName: m.emergencyName || "",
        emergencyRelation: m.emergencyRelation || "",
        emergencyPhone: m.emergencyPhone || "",

        goal: m.goal || "General Fitness",
        preferredTime: m.preferredTime || "",
        trainerAssigned: m.trainerAssigned || "",
        batchTiming: m.batchTiming || "",
        referredBy: m.referredBy || "",
        biometricId: m.biometricId || "",
        notes: m.notes || "",

        status: getMembershipStatus(m.expiryDate || ""),
        expiryDate: m.expiryDate || "",
        plan: m.plan || "Monthly",
        amountPaid: m.amountPaid || "",
        paymentMethod: m.paymentMethod || "Cash",
        registrationFee: m.registrationFee || 0,
        discount: m.discount || 0,
        transactionId: m.transactionId || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not load member.");
    } finally {
      setLoading(false);
    }
  }

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // const selectedPlan = PLANS.find((p) => p.label === form.plan) || PLANS[0];
  const selectedPlan = PLANS.find((p) => p.label === form.plan) || {
    label: form.plan || "Custom",
    months: 1,
    price: Number(form.membershipFee || form.amountPaid || 0),
  };

  const totalAmount =
    Number(selectedPlan.price || 0) +
    Number(form.registrationFee || 0) -
    Number(form.discount || 0);

  const balanceDue = Math.max(totalAmount - Number(form.amountPaid || 0), 0);
  const bmi =
    form.weight && form.height
      ? (Number(form.weight) / (Number(form.height) / 100) ** 2).toFixed(1)
      : "";

  const handleSaveDetails = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone is required.");
      return;
    }

    setSaving(true);

    try {
      await updateMember(id, {
        name: form.name.trim(),
        fatherName: form.fatherName,
        phone: form.phone.trim(),
        alternatePhone: form.alternatePhone,
        email: form.email.trim(),
        dob: form.dob,
        age: calculateAge(form.dob),
        gender: form.gender,
        occupation: form.occupation,
        address: form.address,
        city: form.city,
        pinCode: form.pinCode,

        weight: form.weight,
        height: form.height,
        bmi,
        bloodGroup: form.bloodGroup,
        medicalCondition: form.medicalCondition,
        previousInjury: form.previousInjury,
        medication: form.medication,
        doctorAdvice: form.doctorAdvice,

        emergencyName: form.emergencyName,
        emergencyRelation: form.emergencyRelation,
        emergencyPhone: form.emergencyPhone,

        goal: form.goal,
        preferredTime: form.preferredTime,
        trainerAssigned: form.trainerAssigned,
        batchTiming: form.batchTiming,
        referredBy: form.referredBy,
        biometricId: form.biometricId,
        notes: form.notes.trim(),

        plan: form.plan,
        paymentMethod: form.paymentMethod,
        registrationFee: Number(form.registrationFee || 0),
        discount: Number(form.discount || 0),
        amountPaid: Number(form.amountPaid || 0),
        totalAmount: Number(totalAmount || 0),
        balanceDue: Number(balanceDue || 0),
        transactionId: form.transactionId,
      });

      toast.success("Member details updated! ✅");
      navigate("/members");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  };
  const handleRenewMembership = async (e) => {
    e.preventDefault();

    if (!window.confirm("This will create a NEW payment entry. Continue?")) {
      return;
    }

    if (!form.plan) {
      toast.error("Select a plan.");
      return;
    }

    setSaving(true);

    try {
      const result = await recordPaymentAndActivate(
        {
          memberId: id,
          memberName: form.name,
          plan: form.plan,
          amount: Number(form.amountPaid || selectedPlan.price || 0),
          membershipFee: Number(selectedPlan.price || 0),
          registrationFee: Number(form.registrationFee || 0),
          discount: Number(form.discount || 0),
          totalAmount: Number(totalAmount || 0),
          balanceDue: Number(balanceDue || 0),
          method: form.paymentMethod,
          transactionId: form.transactionId,
          type: "renewal",
        },
        id,
        selectedPlan.months,
      );

      toast.success(`New payment recorded. Renewed until ${result.expiry}`);
      navigate("/members");
    } catch (err) {
      console.error(err);
      toast.error("Renewal failed.");
    } finally {
      setSaving(false);
    }
  };
  const handleUpdatePaymentInfo = async () => {
    setSaving(true);

    try {
      await updateMember(id, {
        plan: form.plan,
        membershipFee: Number(selectedPlan.price || 0),
        registrationFee: Number(form.registrationFee || 0),
        discount: Number(form.discount || 0),
        totalAmount: Number(totalAmount || 0),
        amountPaid: Number(form.amountPaid || 0),
        balanceDue: Number(balanceDue || 0),
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId,
      });

      toast.success("Payment info updated without creating new payment.");
    } catch (err) {
      console.error(err);
      toast.error("Payment info update failed.");
    } finally {
      setSaving(false);
    }
  };
  // const handleRenewMembership = async (e) => {
  //   e.preventDefault();

  //   if (!form.plan) {
  //     toast.error("Select a plan.");
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     const result = await recordPaymentAndActivate(
  //       {
  //         memberId: id,
  //         memberName: form.name,
  //         plan: form.plan,
  //         amount: selectedPlan.price,
  //         method: form.paymentMethod,
  //         type: "renewal",
  //       },
  //       id,
  //       selectedPlan.months,
  //     );

  //     toast.success(`Membership renewed until ${result.expiry} 🎉`);
  //     navigate("/members");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Renewal failed.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  // const handleRenewMembership = async (e) => {
  //   e.preventDefault();

  //   if (!form.plan) {
  //     toast.error("Select a plan.");
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     const result = await recordPaymentAndActivate(
  //       {
  //         memberId: id,
  //         memberName: form.name,
  //         plan: form.plan,

  //         amount: Number(form.amountPaid || selectedPlan.price || 0),
  //         membershipFee: Number(selectedPlan.price || 0),
  //         registrationFee: Number(form.registrationFee || 0),
  //         discount: Number(form.discount || 0),
  //         totalAmount: Number(totalAmount || 0),
  //         balanceDue: Number(balanceDue || 0),

  //         method: form.paymentMethod,
  //         transactionId: form.transactionId,
  //         type: "renewal",
  //       },
  //       id,
  //       selectedPlan.months,
  //     );

  //     toast.success(`Membership renewed until ${result.expiry} 🎉`);
  //     navigate("/members");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Renewal failed.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const handleUpdateExpiry = async () => {
    if (!form.expiryDate) {
      toast.error("Set an expiry date.");
      return;
    }

    setSaving(true);

    try {
      const status = getMembershipStatus(form.expiryDate);

      await updateMember(id, {
        expiryDate: form.expiryDate,
        status,
      });

      setForm((prev) => ({ ...prev, status }));

      toast.success("Expiry & status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div
          className="skeleton"
          style={{ height: 200, borderRadius: "var(--r-md)" }}
        />
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Edit Member</div>

        <div className="topbar-right">
          <button
            className="btn btn-outline tap-scale"
            onClick={() => navigate("/members")}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="page-body">
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            ...anim(0.05),
          }}
        >
          {[
            { key: "details", label: "Personal Details" },
            { key: "membership", label: "Membership & Payment" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              className="tap-scale"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: `1px solid ${
                  tab === t.key ? "var(--gold)" : "var(--border)"
                }`,
                borderRadius: "var(--r-sm)",
                background: tab === t.key ? "var(--gold-dim)" : "var(--card)",
                color: tab === t.key ? "var(--gold)" : "var(--muted2)",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "details" && (
          <form onSubmit={handleSaveDetails}>
            <div
              className="grid-2"
              style={{ alignItems: "start", ...anim(0.1) }}
            >
              <div className="card">
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
                    <label className="form-label">
                      Father's / Husband's Name
                    </label>
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
                      className="form-input"
                      value={form.phone}
                      maxLength={10}
                      onChange={(e) =>
                        set("phone", e.target.value.replace(/\D/g, ""))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alternate Phone</label>
                    <input
                      className="form-input"
                      value={form.alternatePhone}
                      maxLength={10}
                      onChange={(e) =>
                        set("alternatePhone", e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      className="form-input"
                      type="date"
                      value={form.dob}
                      onChange={(e) => {
                        const dob = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          dob,
                          age: calculateAge(dob),
                        }));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.age}
                      readOnly
                      placeholder="Auto"
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

                <hr className="divider" />

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
                      step="0.1"
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
                  <label className="form-label">
                    Previous Injury / Surgery
                  </label>
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
                  <label className="form-label">
                    Doctor's Advice / Restrictions
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={form.doctorAdvice}
                    onChange={(e) => set("doctorAdvice", e.target.value)}
                  />
                </div>

                <hr className="divider" />

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

                <hr className="divider" />

                <div className="card-title">Gym Details</div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fitness Goal</label>
                    <select
                      className="form-input"
                      value={form.goal}
                      onChange={(e) => set("goal", e.target.value)}
                    >
                      <option>Weight Loss</option>
                      <option>Fat Loss</option>
                      <option>Muscle Gain</option>
                      <option>Strength Training</option>
                      <option>Body Toning</option>
                      <option>General Fitness</option>
                      <option>Rehabilitation</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <select
                      className="form-input"
                      value={form.preferredTime}
                      onChange={(e) => set("preferredTime", e.target.value)}
                    >
                      <option value="">Select Time</option>
                      {TIME_SLOTS.map((time) => (
                        <option key={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

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
                    <label className="form-label">Referred By</label>
                    <input
                      className="form-input"
                      value={form.referredBy}
                      onChange={(e) => set("referredBy", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Biometric ID</label>
                  <input
                    className="form-input"
                    value={form.biometricId}
                    onChange={(e) => set("biometricId", e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="card mb-16">
                  <div className="card-title">Member Status</div>

                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      className="form-input"
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) => set("expiryDate", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <input
                      className="form-input"
                      value={form.status}
                      readOnly
                    />
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
                  {saving ? "Saving…" : "✓ Save Member Details"}
                </button>
              </div>
            </div>
          </form>
        )}

        {tab === "membership" && (
          <form onSubmit={handleRenewMembership} style={anim(0.1)}>
            <div className="grid-2" style={{ alignItems: "start" }}>
              <div className="card">
                <div className="card-title">Renew Membership</div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {PLANS.map((p) => (
                    <div
                      key={p.label}
                      className="tap-scale"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          plan: p.label,
                          amountPaid: p.price,
                        }));
                      }}
                      style={{
                        padding: "12px 14px",
                        border: `1px solid ${
                          form.plan === p.label
                            ? "var(--gold)"
                            : "var(--border)"
                        }`,
                        borderRadius: "var(--r-sm)",
                        background:
                          form.plan === p.label
                            ? "var(--gold-dim)"
                            : "var(--card2)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 13,
                          color:
                            form.plan === p.label
                              ? "var(--gold)"
                              : "var(--text)",
                        }}
                      >
                        {p.label}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--muted2)",
                          marginTop: 2,
                        }}
                      >
                        ₹{p.price.toLocaleString()} · {p.months}mo
                      </div>
                    </div>
                  ))}
                </div>

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
                    <label className="form-label">Total Amount</label>
                    <input
                      className="form-input"
                      type="number"
                      value={totalAmount}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount Paid</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.amountPaid}
                      onChange={(e) => set("amountPaid", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Balance Due</label>
                    <input
                      className="form-input"
                      type="number"
                      value={balanceDue}
                      readOnly
                    />
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

                <div className="form-group">
                  <label className="form-label">Transaction ID</label>
                  <input
                    className="form-input"
                    value={form.transactionId}
                    onChange={(e) => set("transactionId", e.target.value)}
                  />
                </div>

                {form.plan &&
                  (() => {
                    const expiry = format(
                      addMonths(new Date(), selectedPlan.months || 1),
                      "yyyy-MM-dd",
                    );

                    return (
                      <div className="info-box success mb-12">
                        ✓ Plan: <strong>{form.plan}</strong> · Total:{" "}
                        <strong>₹{totalAmount.toLocaleString()}</strong> ·
                        Balance: <strong>₹{balanceDue.toLocaleString()}</strong>{" "}
                        · New expiry: <strong>{expiry}</strong>
                      </div>
                    );
                  })()}
                <button
                  type="button"
                  className="btn btn-outline tap-scale"
                  disabled={saving}
                  style={{ width: "100%", padding: 12, marginBottom: 10 }}
                  onClick={handleUpdatePaymentInfo}
                >
                  ✓ Update Payment Info Only
                </button>
                <button
                  type="submit"
                  className="btn btn-primary tap-scale btn-ripple"
                  disabled={saving}
                  style={{ width: "100%", padding: 12 }}
                >
                  {saving
                    ? "Processing…"
                    : "💳 Renew Membership & Record Payment"}
                </button>
              </div>

              <div className="card">
                <div className="card-title">Current Membership</div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {[
                    { label: "Plan", value: form.plan, color: "var(--gold)" },
                    {
                      label: "Status",
                      value: form.status,
                      color:
                        form.status === "active"
                          ? "var(--green)"
                          : form.status === "expiring"
                            ? "var(--gold)"
                            : form.status === "expired"
                              ? "var(--red)"
                              : "var(--muted2)",
                    },
                    {
                      label: "Expiry",
                      value: form.expiryDate || "—",
                      color: "var(--text)",
                    },
                    {
                      label: "Paid",
                      value: form.amountPaid
                        ? `₹${Number(form.amountPaid).toLocaleString()}`
                        : "—",
                      color: "var(--text)",
                    },
                    {
                      label: "Registration Fee",
                      value: `₹${Number(
                        form.registrationFee || 0,
                      ).toLocaleString()}`,
                      color: "var(--text)",
                    },
                    {
                      label: "Discount",
                      value: `₹${Number(form.discount || 0).toLocaleString()}`,
                      color: "var(--text)",
                    },
                    {
                      label: "Balance Due",
                      value: `₹${balanceDue.toLocaleString()}`,
                      color: balanceDue > 0 ? "var(--red)" : "var(--green)",
                    },
                    {
                      label: "Transaction ID",
                      value: form.transactionId || "—",
                      color: "var(--text)",
                    },
                  ].map((r) => (
                    <div
                      key={r.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "10px 12px",
                        background: "var(--card2)",
                        borderRadius: "var(--r-sm)",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "var(--muted2)" }}>
                        {r.label}
                      </span>

                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: r.color,
                          textAlign: "right",
                        }}
                      >
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="info-box warning mt-12">
                  ℹ Renewing will update membership dates and record a new
                  payment automatically.
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
