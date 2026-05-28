import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getMemberNotifications } from "../../firebase/service";

export default function MemberNotifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const data =
        await getMemberNotifications(
          user?.email
        );

      setNotifications(data || []);
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }

  const dotColor = (channel) => {
    if (channel === "WhatsApp")
      return "green";

    if (channel === "SMS")
      return "blue";

    return "orange";
  };

  return (
    <div className="page-enter">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="page-title">
          Notifications
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="card-title">
            Your Notifications
          </div>

          {loading ? (
            <div
              style={{
                color: "var(--muted2)",
                fontSize: 13,
              }}
            >
              Loading...
            </div>
          ) : notifications.length ===
            0 ? (
            <div
              style={{
                color: "var(--muted2)",
                fontSize: 13,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="activity-item"
              >
                <div
                  className={`activity-dot ${dotColor(
                    n.channel
                  )}`}
                />

                <div style={{ flex: 1 }}>
                  <div className="activity-text">
                    {n.message}
                  </div>

                  <div className="activity-time">
                    {n.date} ·{" "}
                    {n.channel}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}