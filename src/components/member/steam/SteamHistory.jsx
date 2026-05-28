// components/member/SteamHistory.jsx

export default function SteamHistory({
  steam = [],
}) {
  return (
    <div className="card mb-20">
      <div className="card-title">
        Steam Usage
      </div>

      {steam.length === 0 ? (
        <div className="form-label">
          No steam sessions.
        </div>
      ) : (
        steam.map((s) => (
          <div
            key={s.id}
            className="activity-item"
          >
            <div className="activity-dot gold" />

            <div>
              <div className="activity-text">
                {s.slot}
              </div>

              <div className="activity-time">
                {s.date} • {s.period}
              </div>

              <div className="activity-time">
                Status: {s.status}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}