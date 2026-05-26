export default function WorkoutHistory({
  workouts = [],
}) {
  return (
    <div className="card">
      <div className="card-title">
        Workout History
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          No workouts found
        </div>
      ) : (
        workouts.map((w) => (
          <div
            key={w.id}
            className="activity-item"
          >
            <div className="activity-dot green" />

            <div>
              <div className="activity-text">
                {w.plan}
              </div>

              <div className="activity-time">
                {w.exercisesDone}/{w.total} exercises
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}