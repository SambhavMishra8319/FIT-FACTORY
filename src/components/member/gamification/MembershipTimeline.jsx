
export default function MembershipTimeline({
  history = [],
}) {
  return (
    <div className="card">
      <div className="card-title">
        Membership Timeline
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          No history found
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="timeline-item"
          >
            <div className="timeline-dot" />

            <div>
              <strong>
                {item.type}
              </strong>

              <div className="timeline-date">
                {item.date}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}