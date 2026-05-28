import { useEffect, useMemo, useState } from "react";

import { useMembership } from "../../hooks/useMembership";

import {
  LockGate,
  ExpiryBanner,
} from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import StatCard from "../../components/member/ui/StatCard";
import SectionHeader from "../../components/member/ui/SectionHeader";
import EmptyState from "../../components/member/ui/EmptyState";

import { getBCAReadings } from "../../firebase/service";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MemberBCA() {
  const { membership, loading } =
    useMembership();

  const [readings, setReadings] =
    useState([]);

  const [fetching, setFetching] =
    useState(true);

  useEffect(() => {
    if (!membership?.memberId) {
      setFetching(false);
      return;
    }

    const load = async () => {
      try {
        const data =
          await getBCAReadings(
            membership.memberId
          );

        setReadings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [membership]);

  const latest = readings[0];
  const previous = readings[1];

  const diff = key => {
    if (
      !latest ||
      !previous ||
      !latest[key] ||
      !previous[key]
    ) {
      return null;
    }

    const d = (
      latest[key] - previous[key]
    ).toFixed(1);

    return Number(d) > 0
      ? `+${d}`
      : d;
  };

  const chartData = useMemo(() => {
    return [...readings]
      .reverse()
      .map(r => ({
        date: r.date?.slice(5),
        weight: r.weight,
        fat: r.fat,
        muscle: r.muscle,
      }));
  }, [readings]);

  if (loading || fetching) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate
      feature="bca"
      membership={membership}
    >
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">
            My Body Analysis
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner
            membership={membership}
          />

          {readings.length === 0 ? (
            <EmptyState
              icon="📊"
              title="NO BCA READINGS"
              desc="Ask your trainer to record your first BCA reading."
            />
          ) : (
            <>
              <div className="stats-grid mb-16">
                <StatCard
                  label="Weight"
                  value={latest?.weight}
                  unit="kg"
                  cls="s-red"
                  valueClass="c-red"
                  sub={
                    diff("weight")
                      ? `${diff(
                          "weight"
                        )} vs prev`
                      : ""
                  }
                />

                <StatCard
                  label="Fat"
                  value={latest?.fat}
                  unit="%"
                  cls="s-gold"
                  valueClass="c-gold"
                  sub={
                    diff("fat")
                      ? `${diff(
                          "fat"
                        )} vs prev`
                      : ""
                  }
                />

                <StatCard
                  label="Muscle"
                  value={latest?.muscle}
                  unit="kg"
                  cls="s-green"
                  valueClass="c-green"
                  sub={
                    diff("muscle")
                      ? `${diff(
                          "muscle"
                        )} vs prev`
                      : ""
                  }
                />

                <StatCard
                  label="BMI"
                  value={latest?.bmi}
                  cls="s-blue"
                  valueClass="c-blue"
                />
              </div>

              <div className="card mb-16">
                <div className="card-title">
                  Progress Chart
                </div>

                {chartData.length < 2 ? (
                  <div
                    style={{
                      height: 140,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      color:
                        "var(--muted2)",
                    }}
                  >
                    Add 2+ readings
                  </div>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >
                    <LineChart
                      data={chartData}
                    >
                      <XAxis
                        dataKey="date"
                      />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#f5c842"
                        strokeWidth={2}
                      />

                      <Line
                        type="monotone"
                        dataKey="muscle"
                        stroke="#22c55e"
                        strokeWidth={2}
                      />

                      <Line
                        type="monotone"
                        dataKey="fat"
                        stroke="#ef4444"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <SectionHeader title="All Readings" />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight</th>
                      <th>Fat%</th>
                      <th>Muscle</th>
                      <th>BMI</th>
                    </tr>
                  </thead>

                  <tbody>
                    {readings.map(r => (
                      <tr key={r.id}>
                        <td>{r.date}</td>

                        <td>
                          {r.weight} kg
                        </td>

                        <td>
                          {r.fat}%
                        </td>

                        <td>
                          {r.muscle} kg
                        </td>

                        <td>{r.bmi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </LockGate>
  );
}