import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTrainerIncomeAnalytics } from "../../../firebase/service";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function TrainerAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await getTrainerIncomeAnalytics();

      setAnalytics(data || []);
    } catch (err) {
      console.error(err);
      setAnalytics([]);
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    return analytics.reduce(
      (acc, trainer) => {
        acc.revenue += Number(trainer.revenue || 0);
        acc.earnings += Number(trainer.earnings || 0);
        acc.paid += Number(trainer.paid || 0);
        acc.pending += Number(trainer.pending || 0);

        return acc;
      },
      {
        revenue: 0,
        earnings: 0,
        paid: 0,
        pending: 0,
      }
    );
  }, [analytics]);

  const chartData = analytics.map((trainer) => ({
    name: trainer.name,
    revenue: trainer.revenue,
  }));

  if (loading) {
    return (
      <div className="page-enter">
        <div className="page-body">
          <div className="card">
            Loading trainer analytics...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">
          Trainer Analytics
        </div>
      </div>

      <div className="page-body">

        {/* SUMMARY */}
        <div className="stats-grid mb-20">

          <div className="stat-card s-gold">
            <div className="stat-label">
              Total PT Revenue
            </div>

            <div className="stat-value c-gold">
              ₹{totals.revenue.toLocaleString()}
            </div>
          </div>

          <div className="stat-card s-green">
            <div className="stat-label">
              Trainer Earnings
            </div>

            <div className="stat-value c-green">
              ₹{totals.earnings.toLocaleString()}
            </div>
          </div>

          <div className="stat-card s-blue">
            <div className="stat-label">
              Salary Paid
            </div>

            <div className="stat-value c-blue">
              ₹{totals.paid.toLocaleString()}
            </div>
          </div>

          <div className="stat-card s-red">
            <div className="stat-label">
              Pending Salary
            </div>

            <div className="stat-value c-red">
              ₹{totals.pending.toLocaleString()}
            </div>
          </div>

        </div>

        {/* CHART */}
        <div className="card mb-20">
          <div className="card-title">
            Trainer Revenue Comparison
          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div className="card">
          <div className="card-title">
            Trainer Income Summary
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Trainer</th>
                  <th>Clients</th>
                  <th>PT Sessions</th>
                  <th>Monthly Revenue</th>
                  <th>Total Revenue</th>
                  <th>Earned</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {analytics.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>{trainer.name}</td>

                    <td>
                      {trainer.activeClients}
                    </td>

                    <td>
                      {trainer.ptSessions}
                    </td>

                    <td>
                      ₹
                      {trainer.monthlyRevenue.toLocaleString()}
                    </td>

                    <td>
                      ₹
                      {trainer.revenue.toLocaleString()}
                    </td>

                    <td>
                      ₹
                      {trainer.earnings.toLocaleString()}
                    </td>

                    <td>
                      ₹
                      {trainer.paid.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={
                          trainer.pending > 0
                            ? "c-red"
                            : "c-green"
                        }
                      >
                        ₹
                        {trainer.pending.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate(
                            `/trainer-payments?trainer=${trainer.id}`
                          )
                        }
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                ))}

                {analytics.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No trainer data found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}