import { useEffect, useState, useMemo } from "react";
// import {
//   format,
//   addMonths,
//   differenceInDays,
//   isAfter,
//   subDays,
//   subMonths,
//   startOfMonth,
//   startOfYear,
// } from "date-fns";
import {
  // isAfter,
  format,
  addMonths,
  differenceInDays,
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

import { getAllTrainers } from "../../firebase/service";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { addTrainerPayment } from "../../firebase/trainerService";

import { subscribeTrainerPaymentsSnapshot } from "../../firebase/trainerService";
import "../../styles/payments.css";
import { useNavigate } from "react-router-dom";
import {
  subscribePaymentsSnapshot,
  addPayment,
  getAllMembers,
  deletePayment,
  updatePayment,
} from "../../firebase/service";
// import { addTrainerPayment } from "../../firebase/trainerService";
export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [visible, setVisible] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [paymentType, setPaymentType] = useState("member");
  const [trainerPayments, setTrainerPayments] = useState([]);
  // ================= FILTERS =================
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

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
  const normalizeMethod = (m) => {
    if (!m || m === "Admin") return "Cash";
    return m;
  };
  // ================= HELPERS =================
  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  useEffect(() => {
    const unsub = subscribePaymentsSnapshot((data) => {
      setPayments(data);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    });

    const unsubTrainer = subscribeTrainerPaymentsSnapshot((data) => {
      setTrainerPayments(data);
    });

    getAllTrainers().then(setTrainers).catch(console.error);
    getAllMembers().then(setMembers).catch(console.error);

    return () => {
      unsub();
      unsubTrainer();
    };
  }, []);
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
  const handleDeletePayment = async (payment) => {
    const name =
      payment.type === "trainer" ? payment.trainerName : payment.memberName;

    if (!window.confirm(`Delete payment record for ${name}?`)) return;

    try {
      await deletePayment(payment.id);
      toast.success("Payment deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  };
  const handleEditPayment = (p) => {
    setEditingPayment(p);
    setShowForm(true);

    setForm({
      memberId: p.memberId || p.entityId || "",
      amount: p.amount || "",
      method: p.method || "Cash",
      plan: p.plan || "Monthly",
      date: p.date || today,
      notes: p.notes || "",
      status: p.status || "paid",
    });

    setPaymentType(p.type || "member");
  };
  const getStatusColor = (daysLeft) => {
    if (daysLeft < 0) return "badge-red";

    if (daysLeft <= 3) return "badge-orange";

    return "badge-green";
  };
const safeDate = (value) => {
  if (!value) return null;

  if (value?.toDate) return value.toDate(); // Firestore Timestamp

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const safeFormat = (value, pattern = "dd MMM") => {
  const d = safeDate(value);
  return d ? format(d, pattern) : "-";
};
  const anim = (delay) => ({
    opacity: visible ? 1 : 0,

    transform: visible ? "translateY(0)" : "translateY(14px)",

    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  // ================= LOAD DATA =================
  // useEffect(() => {
  //   // const unsub = subscribePaymentsSnapshot((data) => {
  //   //   setPayments(data);

  //   //   setLoading(false);

  //   //   setTimeout(() => setVisible(true), 60);
  //   // });

  //   getAllTrainers().then(setTrainers).catch(console.error);
  //   getAllMembers().then(setMembers).catch(console.error);

  //   return () => unsub();
  // }, []);

  // ================= DATE FILTER =================
  const getDateFilteredPayments = (data) => {
    const now = new Date();

    return data.filter((p) => {
      const date = safeDate(p.date);
if (!date) return false;

      switch (dateRange) {
        case "7days":
          return date > subDays(now, 7);

        case "30days":
          return date > subDays(now, 30);

        case "month":
          return date > startOfMonth(now);

        case "year":
          return date > startOfYear(now);

        default:
          return true;
      }
      console.log(
  payments.filter(
    (p) => !p.date || isNaN(new Date(p.date).getTime())
  )
);
    });
  };
  // 1. FIRST: normalize all payments
  const allPayments = useMemo(() => {
  const member = payments.map((p) => ({
  ...p,
  type: "member",
  method: normalizeMethod(p.method),
  date: p.date || p.paymentDate || "2026-06-04",
}));

    const trainer = trainerPayments.map((p) => ({
      id: p.id,
      type: "trainer",
      trainerName: p.trainerName,
      memberName: null,
      phone: null,
      plan: "Trainer Salary",
      amount: p.amount,
      method: normalizeMethod(p.method),
      date:
        p.date || format(p.createdAt?.toDate?.() || new Date(), "yyyy-MM-dd"),
      expiryDate: null,
      notes: p.notes || "",
    }));

    return [...member, ...trainer];
  }, [payments, trainerPayments]);

  // 2. DATE FILTER FUNCTION (unchanged)
  // };

  // 3. FILTERED DATA
  const filtered = useMemo(() => {
    let data = getDateFilteredPayments(allPayments);

    return data.filter((p) => {
      const q = search.toLowerCase();

      const matchSearch =
        !search ||
        p.memberName?.toLowerCase().includes(q) ||
        p.trainerName?.toLowerCase().includes(q) ||
        String(p.phone || "").includes(q) ||
        p.plan?.toLowerCase().includes(q);

      const matchMethod = filterMethod === "all" || p.method === filterMethod;

      const matchPlan = filterPlan === "all" || p.plan === filterPlan;

      const matchStatus =
        filterStatus === "all" ||
        p.type === "trainer" ||
        p.status === filterStatus;
      return matchSearch && matchMethod && matchPlan && matchStatus;
    });
  }, [allPayments, search, filterMethod, filterPlan, filterStatus, dateRange]);
  // ================= STATS =================
  //  const stats = useMemo(() => {
  //   const revenue = payments;
  //   const expenses = trainerPayments;

  //   const totalRevenue = revenue.reduce(
  //     (s, p) => s + Number(p.amount || 0),
  //     0
  //   );

  //   const totalExpense = expenses.reduce(
  //     (s, p) => s + Number(p.amount || 0),
  //     0
  //   );

  //   const cash = revenue
  //     .filter((p) => p.method === "Cash")
  //     .reduce((s, p) => s + Number(p.amount || 0), 0);

  //   const upi = revenue
  //     .filter((p) => p.method === "UPI")
  //     .reduce((s, p) => s + Number(p.amount || 0), 0);

  //   const monthlyRevenue = revenue
  //     .filter((p) => p.date?.startsWith(thisMonth))
  //     .reduce((s, p) => s + Number(p.amount || 0), 0);

  //   return {
  //     totalRevenue,
  //     totalExpense,
  //     netProfit: totalRevenue - totalExpense,
  //     cash,
  //     upi,
  //     monthlyRevenue,
  //   };
  // }, [payments, trainerPayments, thisMonth]);
  // const stats = useMemo(() => {
  //   const all = allPayments;

  //   const totalRevenue = all.reduce(
  //     (s, p) => s + Number(p.amount || 0),
  //     0
  //   );

  //   const totalExpense = trainerPayments.reduce(
  //     (s, p) => s + Number(p.amount || 0),
  //     0
  //   );

  //   const cash = all
  //     .filter((p) => p.method === "Cash")
  //     .reduce((s, p) => s + Number(p.amount || 0), 0);

  //   const upi = all
  //     .filter((p) => p.method === "UPI")
  //     .reduce((s, p) => s + Number(p.amount || 0), 0);

  //   const monthlyRevenue = all
  //     .filter((p) => p.date?.startsWith(thisMonth))
  //     .reduce((s, p) => s + Number(p.amount || 0), 0);

  //   return {
  //     totalRevenue,
  //     totalExpense,
  //     netProfit: totalRevenue - totalExpense,
  //     cash,
  //     upi,
  //     monthlyRevenue,
  //   };
  // }, [allPayments, trainer
  // Payments, thisMonth]);
  const stats = useMemo(() => {
    const revenuePayments = allPayments.filter((p) => p.type === "member");

    const expensePayments = allPayments.filter((p) => p.type === "trainer");

    const totalRevenue = revenuePayments.reduce(
      (s, p) => s + Number(p.amount || 0),
      0,
    );

    const totalExpense = expensePayments.reduce(
      (s, p) => s + Number(p.amount || 0),
      0,
    );

    const cash = revenuePayments
      .filter((p) => p.method === "Cash")
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    const upi = revenuePayments
      .filter((p) => p.method === "UPI")
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    const monthlyRevenue = revenuePayments
      // .filter((p) => p.date?.startsWith(thisMonth))
      .filter((p) => String(p.date || p.paymentDate || "").startsWith(thisMonth))
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    return {
      totalRevenue,
      totalExpense,
      netProfit: totalRevenue - totalExpense,
      cash,
      upi,
      monthlyRevenue,
    };
  }, [allPayments, thisMonth]);
  // ================= REVENUE DATA =================
  // const revenueData = useMemo(() => {
  //   const map = {};

  //   filtered
  //     .filter((p) => p.type === "member")
  //     .forEach((p) => {
  //       const d = format(new Date(p.date), "dd MMM");

  //       if (!map[d]) map[d] = 0;

  //       map[d] += Number(p.amount || 0);
  //     });

  //   return Object.keys(map).map((k) => ({
  //     date: k,
  //     amount: map[k],
  //   }));
  // }, [filtered]);
const revenueData = useMemo(() => {
  const map = {};

  filtered
    .filter((p) => p.type === "member")
    .forEach((p) => {
      const dateObj = safeDate(p.date);

      if (!dateObj) return;

      const d = format(dateObj, "dd MMM");

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

      methods[p.method] += Number(p.amount || 0);
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
      toast.error("Select entity and amount");
      return;
    }

    setSaving(true);

    try {
      const isTrainer = paymentType === "trainer";

      const entity = isTrainer
        ? trainers.find((t) => t.id === form.memberId)
        : members.find((m) => m.id === form.memberId);

      const basePayload = {
        type: paymentType, // "member" | "trainer"
        entityId: form.memberId,
memberId: paymentType === "member" ? form.memberId : null,
trainerId: paymentType === "trainer" ? form.memberId : null,
        name: entity?.name || "Unknown",
        phone: entity?.phone || "",
        amount: Number(form.amount),
        method: form.method,
        date: form.date,
        notes: form.notes,
        status: form.status,
      };

      const payload =
        paymentType === "member"
          ? {
              ...basePayload,
              plan: form.plan,
              expiryDate: format(
                getExpiryDate(form.date, form.plan),
                "yyyy-MM-dd",
              ),
            }
          : basePayload;

      if (editingPayment) {
        await updatePayment(editingPayment.id, {
          ...payload,
          memberName: entity?.name || editingPayment.memberName || "Unknown",
          phone: entity?.phone || editingPayment.phone || "",
        });

        toast.success("Payment updated!");
        setEditingPayment(null);
      } else if (paymentType === "member") {
        await addPayment({
          ...payload,
          memberName: entity?.name || "Unknown",
          phone: entity?.phone || "",
        });

        toast.success("Member payment recorded!");
      }
      // OPTIONAL: separate trainer ledger (only if you want accounting separation)
      // if (isTrainer) {
      //   await payTrainer(
      //     form.memberId,
      //     form.amount,
      //     format(new Date(), "yyyy-MM")
      //   );
      // }
      if (isTrainer) {
        await addTrainerPayment({
          trainerId: form.memberId,
          trainerName: entity?.name || "Unknown",
          amount: Number(form.amount),
          type: "salary",
          method: form.method || "Cash", // ✅ ADD THIS
          // createdAt: new Date(),
          date: today,
        });
      }
      toast.success(`${isTrainer ? "Trainer" : "Member"} payment recorded!`);

      setShowForm(false);

      setForm({
        memberId: "",
        amount: "",
        method: "Cash",
        plan: "Monthly",
        date: today,
        notes: "",
        status: "paid",
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not save payment");
    } finally {
      setSaving(false);
    }
  };
  // ================= EXPORT =================
  // const handleExport = () => {
  //   if (!filtered.length) {
  //     toast.error("No data to export.");

  //     return;
  //   }

  //   const data = filtered.map((p) => ({
  //     "Member Name": p.memberName,
  //     Phone: p.phone || "",
  //     Plan: p.plan,
  //     "Payment Type": p.type,
  //     Method: p.method,
  //     Amount: p.amount,
  //     Date: format(new Date(p.date), "dd MMM yyyy"),
  //     Expiry: p.expiryDate,
  //     Status: p.status,
  //     Notes: p.notes || "",
  //   }));
  //   const data = filtered.map((p) => ({
  //     Name: p.type === "trainer" ? p.trainerName : p.memberName,
  //     Type: p.type,
  //     Phone: p.phone || "",
  //     Plan: p.plan || "Trainer Payment",
  //     Method: p.method,
  //     Amount: p.amount,
  //     Date: format(new Date(p.date), "dd MMM yyyy"),
  //     Expiry: p.expiryDate || "-",
  //     Notes: p.notes || "",
  //   }));
  //   data.push({
  //     "Member Name": "TOTAL",
  //     Amount: stats.total,
  //   });

  //   const ws = XLSX.utils.json_to_sheet(data);

  //   const wb = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(wb, ws, "Payments");

  //   const excelBuffer = XLSX.write(wb, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const file = new Blob([excelBuffer], {
  //     type: "application/octet-stream",
  //   });

  //   saveAs(file, `F2_Payments_${format(new Date(), "dd-MM-yyyy")}.xlsx`);

  //   toast.success("Excel exported!");
  // };
  const handleExport = () => {
    if (!filtered.length) {
      toast.error("No data to export.");
      return;
    }

    const data = filtered.map((p) => ({
      Name: p.type === "trainer" ? p.trainerName : p.memberName,
      Type: p.type,
      Phone: p.phone || "-",
      Plan: p.plan || (p.type === "trainer" ? "Trainer Payment" : "-"),
      Method: p.method,
      Amount: p.amount,
      // Date: format(new Date(p.date), "dd MMM yyyy"),
      Date: safeFormat(p.date, "dd MMM yyyy"),
      Expiry: p.expiryDate || "-",
      Notes: p.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `F2_Payments_${format(new Date(), "dd-MM-yyyy")}.xlsx`);

    toast.success("Excel exported!");
  };
  // const normalizeMethod = (m) => {
  //   if (!m || m === "Admin") return "Cash";
  //   return m;
  // };
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
          {/* Payments Dashboard */}
          PAYMENTS DASHBOARD
        </div>

        <div className="topbar-right">
          <button className="btn btn-outline btn-sm" onClick={handleExport}>
            ⬇ Export Excel
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm((p) => !p)}
          >
            {showForm ? "✕ Cancel" : "+ Record"}
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* ================= FORM ================= */}
        {showForm && (
          <div className="card">
            <div className="card-title">Record Payment</div>

            <form onSubmit={handleAdd}>
              <div className="form-row">
                <div className="form-group">
                  {/* <label className="form-label">Member</label> */}
                  <label className="form-label">
                    {paymentType === "trainer" ? "Trainer" : "Member"}
                  </label>
                  <select
                    className="form-input"
                    value={form.memberId}
                    onChange={(e) => set("memberId", e.target.value)}
                    required
                  >
                    <option value="">
                      {paymentType === "trainer"
                        ? "Select Trainer"
                        : "Select Member"}
                    </option>
                    {(paymentType === "trainer" ? trainers : members).map(
                      (m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.phone})
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount</label>

                  <input
                    className="form-input"
                    type="number"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                {/* <div className="form-group">
                  <label className="form-label">Plan</label>

                  <select
                    className="form-input"
                    value={form.plan}
                    onChange={(e) => set("plan", e.target.value)}
                  >
                    <option>Monthly</option>

                    <option>Quarterly</option>

                    <option>6 Month</option>

                    <option>Annual</option>
                  </select>
                </div> */}
                {paymentType === "member" && (
                  <div className="form-group">
                    <label className="form-label">Plan</label>

                    <select
                      className="form-input"
                      value={form.plan}
                      onChange={(e) => set("plan", e.target.value)}
                    >
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>6 Month</option>
                      <option>Annual</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Method</label>

                  <select
                    className="form-input"
                    value={form.method}
                    onChange={(e) => set("method", e.target.value)}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Type</label>

                  <select
                    className="form-input"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="member">Member Payment</option>
                    <option value="trainer">Trainer Payment</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-primary" disabled={saving}>
                {/* {saving ? "Saving..." : "💾 Save Payment"} */}
                {saving
                  ? "Saving..."
                  : editingPayment
                    ? "✏️ Update Payment"
                    : "💾 Save Payment"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div className="stat-card" style={anim(0.05)}>
            <div className="stat-label">Total Revenue</div>

            <div className="stat-value c-gold">
              {formatMoney(stats.totalRevenue)}
            </div>
          </div>

          <div className="stat-card" style={anim(0.1)}>
            <div className="stat-label">This Month</div>

            <div className="stat-value c-green">
              {formatMoney(stats.monthlyRevenue)}
            </div>
          </div>

          <div className="stat-card" style={anim(0.15)}>
            <div className="stat-label">Cash</div>

            <div className="stat-value">{formatMoney(stats.cash)}</div>
          </div>

          <div className="stat-card" style={anim(0.2)}>
            <div className="stat-label">UPI</div>

            <div className="stat-value">{formatMoney(stats.upi)}</div>
          </div>
        </div>
        {/* <div className="stat-card" style={anim(0.25)}>
          <div className="stat-label">Net Profit</div>

          <div className="stat-value c-green">
            {formatMoney(stats.netProfit)}
          </div>
        </div> */}
        <div className="stat-card" style={anim(0.25)}>
          <div className="stat-label">Trainer Expense</div>

          <div className="stat-value c-red">
            {formatMoney(stats.totalExpense)}
          </div>
        </div>

        <div className="stat-card" style={anim(0.3)}>
          <div className="stat-label">Net Profit</div>

          <div className="stat-value c-green">
            {formatMoney(stats.netProfit)}
          </div>
        </div>
        {/* ================= CHARTS ================= */}
        <div className="charts-grid">
          {/* REVENUE CHART */}
          <div className="card premium-chart-card">
            <div className="chart-header">
              <div className="chart-title-wrap">
                <div className="chart-accent" />

                <h3 className="chart-title">Revenue Trend</h3>
              </div>

              <div className="chart-chip">Revenue</div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={revenueData}>
                <defs>
                  <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffe45e" />

                    <stop offset="100%" stopColor="#ffb800" />
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
                    fill: "rgba(255,215,0,0.04)",
                  }}
                  contentStyle={{
                    background: "#0d0d0d",
                    border: "1px solid rgba(255,215,0,0.15)",
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

                <h3 className="chart-title">Payment Methods</h3>
              </div>

              <div className="chart-chip">Distribution</div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "#0d0d0d",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    color: "#fff",
                  }}
                />

                <Legend verticalAlign="bottom" iconType="circle" />

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
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {paymentMethodData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index % pieColors.length]}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        {/* <div className="premium-filter-bar">
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
        </div> */}
        <div className="premium-filter-bar">
          <div className="filter-left">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>

              <input
                className="premium-search"
                placeholder="Search member, phone, plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="premium-select"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            >
              <option value="all">All Methods</option>

              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>

            <select
              className="premium-select"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="all">All Plans</option>

              <option>Monthly</option>
              <option>Quarterly</option>
              <option>6 Month</option>
              <option>Annual</option>
            </select>

            <select
              className="premium-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>

              <option value="paid">Paid</option>

              <option value="pending">Pending</option>

              <option value="partial">Partial</option>
            </select>

            <select
              className="premium-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>

              <option value="30days">Last 30 Days</option>

              <option value="month">This Month</option>

              <option value="year">This Year</option>
            </select>
          </div>

          <div className="filter-right">
            <button
              className="btn btn-outline btn-sm premium-clear-btn"
              onClick={clearFilters}
            >
              ✕ Clear
            </button>

            <div className="results-chip">{filtered.length} Results</div>
          </div>
        </div>
        {/* ================= TABLE ================= */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {/* <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Notes</th> */}
                <th>Name</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Method</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>No payments found.</td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const expiry =
                    p.type === "member" && p.expiryDate
                      ? new Date(p.expiryDate)
                      : null;

                  const daysLeft =
                    expiry instanceof Date && !isNaN(expiry.getTime())
                      ? differenceInDays(expiry, new Date())
                      : null;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <strong
                            style={{
                              cursor: "pointer",
                              color: "var(--gold)",
                              transition: "0.2s",
                            }}
                            // onClick={() => navigate(`/members/${p.memberId}`)}
                            // onClick={() =>
                            //   p.type === "member"
                            //     ? navigate(`/members/${p.memberId}`)
                            //     : null
                            // }
                            onClick={() => {
  const id = p.memberId || p.entityId;

  if (p.type === "member" && id) {
    navigate(`/members/${id}`);
  } else {
    toast.error("Member profile link missing");
  }
}}
                            onMouseEnter={(e) =>
                              (e.target.style.opacity = "0.8")
                            }
                            onMouseLeave={(e) => (e.target.style.opacity = "1")}
                          >
                            {p.type === "trainer"
                              ? p.trainerName
                              : p.memberName}
                          </strong>

                          <small
                            style={{
                              color: "var(--muted2)",
                              fontSize: 11,
                            }}
                          >
                            {p.phone || "No phone"}
                          </small>
                        </div>
                      </td>

                      <td>{p.plan}</td>

                      <td
                        style={{
                          color: "var(--green)",
                          fontWeight: 700,
                        }}
                      >
                        {formatMoney(p.amount)}
                      </td>
                      <td>
                        {p.type === "trainer" ? (
                          <div>
                            <strong style={{ color: "#a855f7" }}>
                              👤 {p.trainerName}
                            </strong>
                            <small>Trainer Payment</small>
                          </div>
                        ) : (
                          <div>
                            <strong
                              style={{
                                cursor: "pointer",
                                color: "var(--gold)",
                              }}
                              // onClick={() => navigate(`/members/${p.memberId}`)}
                              // onClick={() =>
                              //   p.type === "member"
                              //     ? navigate(`/members/${p.memberId}`)
                              //     : null
                              // }
                              onClick={() => {
  const id = p.memberId || p.entityId;

  if (p.type === "member" && id) {
    navigate(`/members/${id}`);
  } else {
    toast.error("Member profile link missing");
  }
}}
                            >
                              {p.type === "trainer"
                                ? p.trainerName
                                : p.memberName}
                            </strong>
                            <small>{p.phone || "No phone"}</small>
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`method-badge ${
                            p.method === "Cash"
                              ? "cash"
                              : p.method === "UPI"
                                ? "upi"
                                : "card"
                          }`}
                        >
                          {p.method}
                        </span>
                      </td>

                      <td>
                        <div>
                          {p.type === "trainer" ? "-" : p.expiryDate || "-"}
                        </div>

                        <small
                          style={{
                            color:
                              daysLeft !== null && daysLeft < 0
                                ? "#ef4444"
                                : "#888",
                          }}
                        >
                          {p.type === "trainer"
                            ? "Salary Payment"
                            : daysLeft === null
                              ? "Expired"
                              : `${daysLeft} days left`}
                        </small>
                      </td>

                      <td>
                        {p.type === "trainer" ? (
                          <span className="badge badge-purple">
                            Salary Paid
                          </span>
                        ) : (
                          <span className={`badge ${getStatusColor(daysLeft)}`}>
                            {daysLeft < 0
                              ? "Expired"
                              : daysLeft <= 3
                                ? "Expiring"
                                : "Active"}
                          </span>
                        )}
                      </td>

                      <td>{p.notes || "—"}</td>
                      <td>
  <button
  className="btn btn-primary btn-sm"
  onClick={() => handleEditPayment(p)}
>
  Edit
</button>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => handleDeletePayment(p)}
  >
    Delete
  </button>
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
