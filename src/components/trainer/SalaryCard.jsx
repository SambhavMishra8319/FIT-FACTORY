export default function SalaryCard({ title, amount = 0 }) {
  return (
    <div className="salary-card">
      <p>{title || "-"}</p>

      <h2>
        ₹{Number(amount || 0).toLocaleString("en-IN")}
      </h2>
    </div>
  );
}