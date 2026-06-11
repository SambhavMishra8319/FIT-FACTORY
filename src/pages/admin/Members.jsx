
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMembershipStatus } from "../../utils/membershipStatus";
import {
  subscribeMembersSnapshot,
  deleteMember,
  addAttendance,
} from "../../firebase/service";

const normalizeAmount = (val) => {
  if (!val) return 0;
  if (typeof val === "number") return val;
  return Number(String(val).replace(/[^0-9]/g, "")) || 0;
};

const getPlanPrice = (plan) => {
  const prices = {
    "1 Month": 1499,
    "3 Months": 3999,
    "6 Months": 7999,
    Annual: 14999,
    "Elite VIP": 19999,
    Monthly: 1499,
    Quarterly: 3999,
    "6 Month": 7999,
    Yearly: 14999,
  };

  return prices[plan] || 0;
};

const getBalanceDue = (m) => {
  const membershipFee =
    normalizeAmount(m.membershipFee) || getPlanPrice(m.plan);

  const total =
    membershipFee +
    normalizeAmount(m.registrationFee) -
    normalizeAmount(m.discount);

  return Math.max(total - normalizeAmount(m.amountPaid), 0);
};

const getDaysExpired = (expiryDate) => {
  if (!expiryDate) return "-";

  const today = new Date();
  const expiry = new Date(expiryDate);

  if (isNaN(expiry.getTime())) return "-";

  const diff = Math.floor((today - expiry) / (1000 * 60 * 60 * 24));

  return diff > 0 ? `${diff} days` : "-";
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeMembersSnapshot((data) => {
      const updated = data
        .map((m) => ({
          ...m,
          status: m.expiryDate ? getMembershipStatus(m.expiryDate) : "pending",
        }))
        .sort((a, b) => {
          const order = {
            active: 1,
            expiring: 2,
            expired: 3,
            pending: 4,
          };

          return order[a.status] - order[b.status];
        });

      setMembers(updated);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    });

    return () => unsub();
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();

    const matchSearch =
      m.name?.toLowerCase().includes(q) ||
      m.phone?.includes(search) ||
      m.alternatePhone?.includes(search) ||
      m.memberId?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.biometricId?.toString().includes(search) ||
      m.preferredTime?.toLowerCase().includes(q);

    const matchFilter = filter === "all" || m.status === filter;

    return matchSearch && matchFilter;
  });

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from members list? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteMember(id);
      toast.success(`${name} removed.`);
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleCheckin = async (m) => {
    try {
      const result = await addAttendance(m.id, m.name);

      if (result.alreadyCheckedIn) {
        toast(`${m.name} already checked in today!`, { icon: "ℹ️" });
      } else {
        toast.success(`✅ ${m.name} checked in! +10 pts`);
      }
    } catch {
      toast.error("Check-in failed.");
    }
  };

  const stats = {
    total: members.length,
    active: members.filter(
      (m) => m.status === "active" || m.status === "expiring",
    ).length,
    expiring: members.filter((m) => m.status === "expiring").length,
    expired: members.filter((m) => m.status === "expired").length,
    pending: members.filter((m) => m.status === "pending").length,
    // revenue: members.reduce((s, m) => s + normalizeAmount(m.amountPaid), 0),
    revenue: members.reduce(
  (s, m) => s + normalizeAmount(m.amountPaid),
  0
),
    balanceDue: members.reduce((s, m) => s + getBalanceDue(m), 0),
  };

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  const statusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="badge badge-green">Active</span>;
      case "expiring":
        return <span className="badge badge-gold">Expiring Soon</span>;
      case "expired":
        return <span className="badge badge-red">Expired</span>;
      default:
        return <span className="badge badge-gray">Pending</span>;
    }
  };

  const filterButtons = [
    { key: "all", label: "All", count: stats.total },
    { key: "active", label: "Active", count: stats.active },
    { key: "expiring", label: "Expiring", count: stats.expiring },
    { key: "expired", label: "Expired", count: stats.expired },
    { key: "pending", label: "Pending", count: stats.pending },
  ];

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Members ({filtered.length})</div>

        <div className="topbar-right">
          <input
            className="search-input"
            placeholder="🔍 Name, phone, ID, biometric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn btn-primary btn-sm tap-scale btn-ripple"
            onClick={() => navigate("/add-member")}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="stats-grid mb-20">
          {[
            { label: "Active", value: stats.active, cls: "s-green", val: "c-green" },
            { label: "Expiring", value: stats.expiring, cls: "s-gold", val: "c-gold" },
            { label: "Expired", value: stats.expired, cls: "s-red", val: "c-red" },
            { label: "Pending", value: stats.pending, cls: "s-gold", val: "c-gold" },
            {
              label: "Revenue",
              value: `₹${(stats.revenue / 1000).toFixed(1)}k`,
              cls: "s-green",
              val: "c-green",
            },
            {
              label: "Balance Due",
              value: `₹${(stats.balanceDue / 1000).toFixed(1)}k`,
              cls: "s-red",
              val: "c-red",
            },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.cls}`} style={anim(i * 0.07)}>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`}>
                {loading ? "—" : s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="member-filters mb-16">
          {filterButtons.map((item) => (
            <button
              key={item.key}
              className={`filter-btn ${filter === item.key ? "active" : ""}`}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
              <span>{item.count}</span>
            </button>
          ))}
        </div>

        <div className="table-wrap" style={anim(0.28)}>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Goal</th>
                <th>Time</th>
                <th>Expiry</th>
                <th>Days Expired</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td colSpan={10} style={{ padding: 16 }}>
                      <div
                        className="skeleton"
                        style={{ height: 14, width: "70%", marginBottom: 6 }}
                      />
                      <div
                        className="skeleton"
                        style={{ height: 10, width: "40%" }}
                      />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      textAlign: "center",
                      color: "var(--muted2)",
                      padding: 40,
                    }}
                  >
                    {members.length === 0
                      ? "No members yet. Add your first member! 💪"
                      : "No members match your search or filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: `opacity 0.35s ease ${0.3 + i * 0.04}s`,
                    }}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--grad-gold)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--black)",
                            flexShrink: 0,
                          }}
                        >
                          {m.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "M"}
                        </div>

                        <div>
                          <strong
                            style={{ cursor: "pointer", color: "var(--gold)" }}
                            onClick={() => navigate(`/members/${m.id}`)}
                          >
                            {m.name || "Unnamed"}
                          </strong>

                          <div style={{ fontSize: 11, color: "var(--muted2)" }}>
                            {m.phone || "No phone"}
                          </div>

                          {m.biometricId && (
                            <div style={{ fontSize: 10, color: "var(--muted2)" }}>
                              🖐️ Bio ID: {m.biometricId}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{m.plan || "Not Assigned"}</td>
                    <td style={{ fontSize: 12 }}>{m.goal || "—"}</td>
                    <td style={{ fontSize: 12 }}>
                      {m.preferredTime || m.batchTiming || "—"}
                    </td>

                    <td
                      style={{
                        fontSize: 12,
                        color:
                          m.status === "expiring" || m.status === "expired"
                            ? "var(--red)"
                            : "var(--muted2)",
                      }}
                    >
                      {m.expiryDate || "—"}
                    </td>

                    <td
                      style={{
                        fontSize: 12,
                        color: m.status === "expired" ? "var(--red)" : "var(--muted2)",
                        fontWeight: m.status === "expired" ? 700 : 400,
                      }}
                    >
                      {m.status === "expired" ? getDaysExpired(m.expiryDate) : "-"}
                    </td>

                    <td>₹{normalizeAmount(m.amountPaid).toLocaleString()}</td>

                    <td
                      style={{
                        color: getBalanceDue(m) > 0 ? "var(--red)" : "var(--green)",
                        fontWeight: 700,
                      }}
                    >
                      ₹{getBalanceDue(m).toLocaleString()}
                    </td>

                    <td>{statusBadge(m.status)}</td>

                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {m.status === "expired" ? (
                          <button
                            className="btn btn-primary btn-sm tap-scale"
                            onClick={() => navigate(`/members/${m.id}/edit`)}
                          >
                            Renew
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline btn-sm tap-scale"
                            disabled={m.status === "pending"}
                            onClick={() => handleCheckin(m)}
                          >
                            ✓ In
                          </button>
                        )}

                        <button
                          className="btn btn-outline btn-sm tap-scale"
                          onClick={() => navigate(`/members/${m.id}/edit`)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm tap-scale"
                          onClick={() => handleDelete(m.id, m.name)}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 14,
              fontSize: 12,
              color: "var(--muted2)",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease 0.5s",
            }}
          >
            Showing {filtered.length} of {members.length} members ·{" "}
            <span style={{ color: "var(--green)" }}>
              Revenue: ₹{(stats.revenue / 1000).toFixed(1)}k
            </span>{" "}
            ·{" "}
            <span style={{ color: "var(--red)" }}>
              Due: ₹{(stats.balanceDue / 1000).toFixed(1)}k
            </span>
          </div>
        )}
      </div>

      <button
        className="fab tap-scale btn-ripple"
        onClick={() => navigate("/add-member")}
      >
        +
      </button>
    </div>
  );
}