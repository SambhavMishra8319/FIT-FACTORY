import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { format } from "date-fns";
import toast from "react-hot-toast";
import { getMembershipStatus } from "../../utils/membershipStatus";
import {
  subscribeMembersSnapshot,
  deleteMember,
  addAttendance,
} from "../../firebase/service";
// import "../styles/member.css";
const normalizeAmount = (val) => {
  if (!val) return 0;
  if (typeof val === "number") return val;
  return Number(String(val).replace(/[^0-9]/g, "")) || 0;
};
export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Realtime listener — updates instantly when admin adds/edits member
    const unsub = subscribeMembersSnapshot((data) => {
      

 const updated = data
  .map((m) => {
    const status = m.expiryDate
      ? getMembershipStatus(m.expiryDate)
      : "pending";

    return {
      ...m,
      status,
    };
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
      setMembers(updated);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    });
    return () => unsub();
  }, []);

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.memberId?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Remove ${name} from members list? This cannot be undone.`,
      )
    )
      return;
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
    // active:   members.filter(m => m.status === "active").length,
    active: members.filter(
      (m) => m.status === "active" || m.status === "expiring",
    ).length,
    expiring: members.filter((m) => m.status === "expiring").length,
    // inactive: members.filter((m) => m.status === "inactive").length,
    expired: members.filter((m) => m.status === "expired").length,

    pending: members.filter((m) => m.status === "pending").length,
    // revenue: members.reduce((s, m) => s + (Number(m.amountPaid) || 0), 0),
    revenue: members.reduce(
  (s, m) => s + normalizeAmount(m.amountPaid),
  0
),
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

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Members ({filtered.length})</div>
        <div className="topbar-right">
          <input
            className="search-input"
            placeholder="🔍 Name, phone, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-input"
            style={{ width: "auto", fontSize: 12, padding: "8px 10px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            {/* <option value="inactive">Inactive</option> */}
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
          <button
            className="btn btn-primary btn-sm tap-scale btn-ripple"
            onClick={() => navigate("/add-member")}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stats-grid mb-20">
          {[
            {
              label: "Active",
              value: stats.active,
              cls: "s-green",
              val: "c-green",
            },
            {
              label: "Expiring",
              value: stats.expiring,
              cls: "s-red",
              val: "c-red",
            },
            {
              label: "Expired",
              value: stats.expired,
              cls: "s-red",
              val: "c-red",
            },
            {
              label: "Pending",
              value: stats.pending,
              cls: "s-gold",
              val: "c-gold",
            },
            {
              label: "Revenue",
              value: `₹${(stats.revenue / 1000).toFixed(1)}k`,
              cls: "s-gold",
              val: "c-gold",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`stat-card ${s.cls}`}
              style={anim(i * 0.07)}
            >
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`}>
                {loading ? "—" : s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="table-wrap" style={anim(0.28)}>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Goal</th>
                <th>Expiry</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td colSpan={7} style={{ padding: 16 }}>
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
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      color: "var(--muted2)",
                      padding: 40,
                    }}
                  >
                    {members.length === 0
                      ? "No members yet. Add your first member! 💪"
                      : "No members match your search."}
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
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
                            .toUpperCase()}
                        </div>
                        <div>
                          <strong
                            style={{
                              cursor: "pointer",
                              color: "var(--gold)",
                            }}
                            onClick={() => navigate(`/members/${m.id}`)}
                          >
                            {m.name}
                          </strong>

                          <div style={{ fontSize: 11, color: "var(--muted2)" }}>
                            {m.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{m.membershipAssigned ? m.plan : "Not Assigned"}</td>
                    <td style={{ fontSize: 12 }}>{m.goal || "—"}</td>
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
                    {/* <td>₹{Number(m.amountPaid || 0).toLocaleString()}</td> */}
                    <td>
                      ₹{normalizeAmount(m.amountPaid).toLocaleString()}
                    </td>
                    <td>{statusBadge(m.status)}</td>
                    <td>
                      <div
                        style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
                      >
                        <button
                          className="btn btn-outline btn-sm tap-scale"
                          disabled={
                            m.status === "expired" || m.status === "pending"
                          }
                          onClick={() => handleCheckin(m)}
                        >
                          ✓ In
                        </button>
                        <button
                          className="btn btn-primary btn-sm tap-scale"
                          onClick={() => navigate(`/members/${m.id}/edit`)}
                          title="Edit member"
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

        {/* Summary footer */}
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
            <span style={{ color: "var(--gold)" }}>
              Total: ₹
              {(
                // members.reduce((s, m) => s + (Number(m.amountPaid) || 0), 0) /
                members.reduce((s, m) => s + normalizeAmount(m.amountPaid), 0)/
                1000
              ).toFixed(1)}
              k revenue
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
