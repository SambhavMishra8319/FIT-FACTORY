import { useEffect, useState } from "react";
import { getAllMembers, getAttendance } from "../../firebase/service";
import { format, subDays } from "date-fns";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export default function Progress() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchData();
    setTimeout(() => setVisible(true), 60);
  }, []);

  async function fetchData() {
    try {
      const [m, a] = await Promise.all([getAllMembers(), getAttendance()]);
      setMembers(m);
      setAttendance(a);
    } catch {
      toast.error("Could not load progress data.");
    } finally {
      setLoading(false);
    }
  }

  const today = format(new Date(), "yyyy-MM-dd");
  const thisMonth = format(new Date(), "yyyy-MM");

  // Overall stats
  const totalSessions = attendance.length;
  const todaySessions = attendance.filter((a) => a.date === today).length;
  const monthSessions = attendance.filter((a) =>
    a.date?.startsWith(thisMonth),
  ).length;

  // Last 14 days heatmap
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const count = attendance.filter((a) => a.date === dateStr).length;
    return {
      date: dateStr,
      label: format(d, "d"),
      day: format(d, "EEE"),
      count,
    };
  });
  const maxCount = Math.max(...last14.map((d) => d.count), 1);

  // Top attending members (last 30 days)
  const last30Start = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const recentAttendance = attendance.filter((a) => a.date >= last30Start);
  const memberCounts = recentAttendance.reduce((acc, a) => {
    acc[a.memberId] = acc[a.memberId] || { name: a.memberName, count: 0 };
    acc[a.memberId].count++;
    return acc;
  }, {});
  const topMembers = Object.entries(memberCounts)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });
  const activeMembers = members.filter((m) => m.status === "active").length;

  const inactiveMembers = members.filter((m) => m.status === "inactive").length;

  const expiringMembers = members.filter((m) => m.status === "expiring").length;

  const attendanceRate =
    members.length > 0 ? Math.round((todaySessions / members.length) * 100) : 0;
  const weeklyData = last14.map((d) => ({
    day: d.day,
    attendance: d.count,
  }));
  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Progress Overview</div>
      </div>
      <div className="page-body">
        {/* Stats */}
        {/* <div className="stats-grid mb-20">
          {[
            { label: "Total Sessions",  value: loading ? "—" : totalSessions,  cls: "s-gold",  val: "c-gold"  },
            { label: "Today",           value: loading ? "—" : todaySessions,  cls: "s-green", val: "c-green" },
            { label: "This Month",      value: loading ? "—" : monthSessions,  cls: "s-gold",  val: "c-gold"  },
            { label: "Active Members",  value: loading ? "—" : members.filter(m => m.status === "active").length, cls: "s-green", val: "c-green" },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.cls}`} style={anim(i * 0.07)}>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`}>{s.value}</div>
            </div>
          ))}
        </div> */}
        <div className="stats-grid mb-20">
          {[
            {
              label: "Total Sessions",
              value: totalSessions,
              cls: "s-gold",
              val: "c-gold",
            },
            {
              label: "Today's Attendance",
              value: todaySessions,
              cls: "s-green",
              val: "c-green",
            },
            {
              label: "Attendance Rate",
              value: `${attendanceRate}%`,
              cls: "s-blue",
              val: "c-blue",
            },
            {
              label: "Active Members",
              value: activeMembers,
              cls: "s-green",
              val: "c-green",
            },
            {
              label: "Expiring Soon",
              value: expiringMembers,
              cls: "s-gold",
              val: "c-gold",
            },
            {
              label: "Inactive",
              value: inactiveMembers,
              cls: "s-red",
              val: "c-red",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`stat-card ${s.cls}`}
              style={anim(i * 0.05)}
            >
              <div className="stat-label">{s.label}</div>

              <div className={`stat-value ${s.val}`}>
                {loading ? "—" : s.value}
              </div>
            </div>
          ))}
        </div>
        {/* 14-day heatmap */}
        <div className="card mb-20" style={anim(0.28)}>
          <div className="card-title">Last 14 Days — Attendance Heatmap</div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {last14.map((d, i) => {
              const intensity = d.count / maxCount;
              const bg =
                d.count === 0
                  ? "var(--card2)"
                  : `rgba(245,200,66,${0.15 + intensity * 0.7})`;
              return (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    flex: "1 0 auto",
                    minWidth: 36,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      background: bg,
                      border: `1px solid ${d.count > 0 ? "rgba(245,200,66,0.3)" : "var(--border)"}`,
                      borderRadius: "var(--r-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      color: d.count > 0 ? "var(--black)" : "var(--muted)",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {d.count > 0 ? d.count : ""}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--muted2)" }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 8, color: "var(--muted)" }}>
                    {d.day}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 12,
              fontSize: 11,
              color: "var(--muted2)",
            }}
          >
            <span>Less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
              <div
                key={v}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: `rgba(245,200,66,${v})`,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
<div className="card mb-20" style={anim(0.32)}>
  <div className="card-title">
    Weekly Attendance Trend
  </div>

  <ResponsiveContainer
    width="100%"
    height={260}
  >
    <BarChart data={weeklyData}>
      <XAxis dataKey="day" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="attendance"
        fill="#f5c842"
        radius={[6, 6, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
<div className="card mb-20" style={anim(0.34)}>
  <div className="card-title">
    Membership Insights
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(220px,1fr))",
      gap: 12,
    }}
  >
    <div className="info-box success">
      ✅ {activeMembers} active members
    </div>

    <div className="info-box warning">
      ⚠ {expiringMembers} memberships expiring soon
    </div>

    <div className="info-box danger">
      ❌ {inactiveMembers} inactive members
    </div>
  </div>
</div>
        {/* Top members */}
        <div style={anim(0.35)}>
          <div className="section-header mb-12">
            <div className="section-title">Top Members — Last 30 Days</div>
          </div>
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton mb-8"
                style={{ height: 52, borderRadius: "var(--r-sm)" }}
              />
            ))
          ) : topMembers.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--muted2)",
                fontSize: 13,
              }}
            >
              No attendance data yet. Start checking members in!
            </div>
          ) : (
            topMembers.map((m, i) => (
              <div
                key={m.id}
                className="lb-row"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                  transition: `all 0.4s ease ${0.35 + i * 0.05}s`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    width: 26,
                    color: i < 3 ? "var(--gold)" : "var(--muted2)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="lb-avatar">
                  {m.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?"}
                </div>
                <div className="lb-info">
                  <div className="lb-name">{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted2)" }}>
                    {m.count} sessions in 30 days
                  </div>
                </div>
                {/* Attendance bar */}
                <div style={{ flex: 1, maxWidth: 120 }}>
                  <div
                    style={{
                      height: 6,
                      background: "var(--card2)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        background: "var(--grad-gold)",
                        width: `${Math.min((m.count / 30) * 100, 100)}%`,
                        transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted2)",
                      marginTop: 3,
                      textAlign: "right",
                    }}
                  >
                    {Math.round((m.count / 30) * 100)}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
