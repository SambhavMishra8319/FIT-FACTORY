export default function SalaryCard({
  title,
  amount,
}) {
  return (
    <div className="salary-card">
      <p>{title}</p>

      <h2>₹{amount}</h2>
    </div>
  );
}