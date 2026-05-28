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
const sortedReadings = useMemo(() => {
  return [...readings].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}, [readings]);
  const latest = sortedReadings?.[0] || null;
const previous = sortedReadings?.[1] || null;
  // const diff = key => {
  //   if (
  //     !latest ||
  //     !previous ||
  //     !latest[key] ||
  //     !previous[key]
  //   ) {
  //     return null;
  //   }

  //   const d = (
  //     latest[key] - previous[key]
  //   ).toFixed(1);

  //   return Number(d) > 0
  //     ? `+${d}`
  //     : d;
  // };
  const diff = (key) => {
  if (!latest || !previous) return null;

  const a = Number(latest[key]);
  const b = Number(previous[key]);

  if (isNaN(a) || isNaN(b)) return null;

  const d = (a - b).toFixed(1);
  return Number(d) > 0 ? `+${d}` : d;
};

  // const chartData = useMemo(() => {
  //   return [...readings]
  //     .reverse()
  //     .map(r => ({
  //       date: r.date?.slice(5),
  //       weight: r.weight,
  //       fat: r.fat,
  //       muscle: r.muscle,
  //     }));
  // }, [readings]);
  const chartData = useMemo(() => {
  return [...sortedReadings]
    .reverse()
    .map(r => ({
      date: r.date?.slice(5),
      weight: Number(r.weight || 0),
fat: Number(r.fat || 0),
muscle: Number(r.muscle || 0),
    }));
}, [sortedReadings]);

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
              <div className="stats-grid mb-16">

  <StatCard
    label="Body Water"
    value={latest?.water}
    unit="%"
    cls="s-blue"
    valueClass="c-blue"
  />

  <StatCard
    label="Protein"
    value={latest?.protein}
    unit="%"
    cls="s-green"
    valueClass="c-green"
  />

  <StatCard
    label="BMR"
    value={latest?.bmr}
    unit="kcal"
    cls="s-orange"
    valueClass="c-orange"
  />

  <StatCard
    label="Body Age"
    value={latest?.bodyAge}
    cls="s-gold"
    valueClass="c-gold"
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
<div className="card mb-16">
  <div className="card-title">
    Body Composition
  </div>

  <div className="bca-bar-wrap">
    <div className="bca-label-row">
      <span>Fat %</span>
      <span>{latest?.fat}%</span>
    </div>

    <div className="bca-track">
      <div
        className="bca-fill fat"
        style={{
          width: `${Math.min(
            Number(latest?.fat || 0),
            100
          )}%`,
        }}
      />
    </div>
  </div>

  <div className="bca-bar-wrap">
    <div className="bca-label-row">
      <span>Water %</span>
      <span>{latest?.water}%</span>
    </div>

    <div className="bca-track">
      <div
        className="bca-fill water"
        style={{
          width: `${Math.min(
            Number(latest?.water || 0),
            100
          )}%`,
        }}
      />
    </div>
  </div>

  <div className="bca-bar-wrap">
    <div className="bca-label-row">
      <span>Muscle</span>
      <span>{latest?.muscle} kg</span>
    </div>

    <div className="bca-track">
      <div
        className="bca-fill muscle"
        style={{
          width: `${Math.min(
            Number(latest?.muscle || 0),
            100
          )}%`,
        }}
      />
    </div>
  </div>
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
    <th>Water%</th>
    <th>Protein%</th>
    <th>BMR</th>
    <th>Body Age</th>
    <th>BMI</th>
  </tr>
</thead>

                  <tbody>
  {sortedReadings.map(r => (
    <tr key={r.id || r.date}>
      <td>{r.date}</td>

      <td>{r.weight} kg</td>

      <td>{r.fat}%</td>

      <td>{r.muscle} kg</td>

      <td>{r.water}%</td>

      <td>{r.protein}%</td>

      <td>{r.bmr}</td>

      <td>{r.bodyAge}</td>

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