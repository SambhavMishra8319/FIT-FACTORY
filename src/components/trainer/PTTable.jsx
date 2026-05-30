export default function PTTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="table-wrapper">
        <h2>PT History</h2>

        <div className="empty-state">
          <h3>No PT Records Found</h3>
          <p>PT sessions will appear here once added</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <h2>PT History</h2>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Amount</th>
            <th>Trainer Share</th>
            <th>Gym Share</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.memberName || "-"}</td>

              <td>
                ₹{Number(item.amount || 0).toLocaleString("en-IN")}
              </td>

              <td>
                ₹{Number(item.trainerShare || 0).toLocaleString("en-IN")}
              </td>

              <td>
                ₹{Number(item.gymShare || 0).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}