
import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  getNotifications,
  addNotification,
  getMembers,
} from "../firebase/service";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  const [form, setForm] = useState({
    target: "all",
    channel: "WhatsApp",
    message:
      "Hi! Your F2 Fit Factory membership is expiring soon. Renew today and keep crushing your goals! 💪\n\nCall us: [your number]\nLocation: Mandla",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    fetchAll();
  }, []);

async function fetchAll() {
  setLoading(true);
  try {
    const [n, m] = await Promise.all([
      getNotifications(),
      getMembers(),
    ]);

    setNotifications(Array.isArray(n) ? n : []);

    // ✅ FIX HERE (extract actual array)
    setMembers(Array.isArray(m?.members) ? m.members : []);
  } catch {
    toast.error("Could not load notifications.");
  } finally {
    setLoading(false);
  }
}

  // ✅ FIXED FUNCTION NAME
  // const getTargetMembers = () => {
  //   const now = new Date();
  //   const weekLater = new Date(
  //     now.getTime() + 7 * 24 * 60 * 60 * 1000
  //   );

  //   switch (form.target) {
  //     case "all":
  //       return members;

  //     case "expiring":
  //       return members.filter((m) => {
  //         const exp = new Date(m.expiryDate);
  //         return exp > now && exp <= weekLater;
  //       });

  //     case "inactive":
  //       return members.filter((m) => m.status === "inactive");

  //     case "active":
  //       return members.filter((m) => m.status === "active");

  //     default:
  //       return members;
  //   }
  // };
const getTargetMembers = () => {
  const list = Array.isArray(members) ? members : []; // ✅ extra safety

  const now = new Date();
  const weekLater = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000
  );

  switch (form.target) {
    case "all":
      return list;

    case "expiring":
      return list.filter((m) => {
        const exp = new Date(m.expiryDate);
        return exp > now && exp <= weekLater;
      });

    case "inactive":
      return list.filter((m) => m.status === "inactive");

    case "active":
      return list.filter((m) => m.status === "active");

    default:
      return list;
  }
};
  const handleSend = async () => {
    const targets = getTargetMembers(); // ✅ FIXED

    if (targets.length === 0) {
      toast.error("No members match the selected target.");
      return;
    }

    setSending(true);

    try {
      for (const m of targets) {
        await addNotification({
          target: m.name,
          email: m.email || "",
          memberId: m.id,
          message: form.message,
          channel: form.channel,
          date: today,
          status: "sent",
        });
      }

      toast.success(
        `${form.channel} message logged for ${targets.length} member${
          targets.length > 1 ? "s" : ""
        }! ✅`
      );

      fetchAll();
    } catch {
      toast.error("Could not log notifications.");
    } finally {
      setSending(false);
    }
  };

  const targetCount = getTargetMembers().length; // ✅ FIXED

  const dotColor = (ch) =>
    ch === "WhatsApp"
      ? "green"
      : ch === "SMS"
      ? "blue"
      : "orange";

  return (
    <>
      <div className="topbar">
        <div className="page-title">Notifications</div>
        <div className="topbar-right">
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {targetCount} member{targetCount !== 1 ? "s" : ""} selected
          </span>
        </div>
      </div>

      <div className="page-body">
        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Send Form */}
          <div className="card">
            <div className="card-title">Send Message</div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-input"
                value={form.target}
                onChange={(e) => set("target", e.target.value)}
              >
                <option value="all">
                  All Members ({members.length})
                </option>

                <option value="expiring">
                  Expiring This Week (
                  {
                    members.filter((m) => {
                      const exp = new Date(m.expiryDate);
                      const now = new Date();
                      return (
                        exp > now &&
                        exp <=
                          new Date(
                            now.getTime() +
                              7 * 24 * 60 * 60 * 1000
                          )
                      );
                    }).length
                  }
                  )
                </option>

                <option value="inactive">
                  Inactive Members (
                  {
                    members.filter(
                      (m) => m.status === "inactive"
                    ).length
                  }
                  )
                </option>

                <option value="active">
                  Active Members (
                  {
                    members.filter(
                      (m) => m.status === "active"
                    ).length
                  }
                  )
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Channel</label>
              <select
                className="form-input"
                value={form.channel}
                onChange={(e) => set("channel", e.target.value)}
              >
                <option>WhatsApp</option>
                <option>SMS</option>
                <option>In-App</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                rows={6}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>

            {/* Templates */}
            <div style={{ marginBottom: 14 }}>
              <div
                className="form-label"
                style={{ marginBottom: 8 }}
              >
                Quick Templates
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {[
                  {
                    label: "Renewal Reminder",
                    msg: "Hi! Your F2 Fit Factory membership is expiring soon. Renew now and keep going! 💪",
                  },
                  {
                    label: "Welcome Message",
                    msg: "Welcome to F2 Fit Factory 🎉 Your fitness journey starts now!",
                  },
                  {
                    label: "Motivational",
                    msg: "Missing you at F2 Fit Factory 💪 Come back today and crush your goals!",
                  },
                ].map((t) => (
                  <button
                    key={t.label}
                    className="btn btn-outline btn-sm"
                    style={{ textAlign: "left" }}
                    onClick={() => set("message", t.msg)}
                  >
                    📝 {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: 11 }}
              onClick={handleSend}
              disabled={sending}
            >
              {sending
                ? "Sending…"
                : `📤 Send to ${targetCount} Member${
                    targetCount !== 1 ? "s" : ""
                  }`}
            </button>

            <div
              className="info-box warning"
              style={{ marginTop: 12 }}
            >
              ℹ This logs messages in Firebase. For real WhatsApp
              delivery, integrate WhatsApp Business API.
            </div>
          </div>

          {/* History */}
          <div className="card">
            <div className="card-title">Sent History</div>

            {loading ? (
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No notifications sent yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="activity-item">
                  <div
                    className={`activity-dot ${dotColor(
                      n.channel
                    )}`}
                  ></div>
                  <div>
                    <div className="activity-text">
                      <strong>{n.target}</strong> —{" "}
                      {n.message?.slice(0, 50)}…
                    </div>
                    <div className="activity-time">
                      {n.date} · {n.channel} ·{" "}
                      {n.email || n.phone || ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}