export default function PTTable({ data }) {
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
              <td>{item.memberName}</td>

              <td>₹{item.amount}</td>

              <td>₹{item.trainerShare}</td>

              <td>₹{item.gymShare}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}