
import { useEffect, useMemo, useState } from "react";

import { format } from "date-fns";

import { useMembership } from "../../hooks/useMembership";
import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import StatCard from "../../components/member/ui/StatCard";
import SectionHeader from "../../components/member/ui/SectionHeader";
import EmptyState from "../../components/member/ui/EmptyState";

import { getMassageSessions } from "../../firebase/service";

import "../../styles/massageChair.css";

export default function MemberMassage() {
  const { membership, loading } = useMembership();

  const [sessions, setSessions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState("all");

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!membership?.memberId) {
      setFetching(false);
      return;
    }

    async function load() {
      try {
        setFetching(true);
        const data = await getMassageSessions(membership.memberId);
        setSessions(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    }

    load();
  }, [membership?.memberId]);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const dateCompare = new Date(b.date || 0) - new Date(a.date || 0);
      if (dateCompare !== 0) return dateCompare;
      return String(b.time || "").localeCompare(String(a.time || ""));
    });
  }, [sessions]);

  const upcomingSessions = useMemo(() => {
    return sortedSessions.filter((s) => s.date >= today);
  }, [sortedSessions, today]);

  const pastSessions = useMemo(() => {
    return sortedSessions.filter((s) => s.date < today);
  }, [sortedSessions, today]);

  const filteredSessions = useMemo(() => {
    if (filter === "upcoming") return upcomingSessions;
    if (filter === "past") return pastSessions;
    if (filter === "pending")
      return sortedSessions.filter((s) => (s.status || "pending") === "pending");
    if (filter === "approved")
      return sortedSessions.filter((s) => s.status === "approved");
    if (filter === "completed")
      return sortedSessions.filter((s) => s.status === "completed");
    if (filter === "rejected")
      return sortedSessions.filter((s) => s.status === "rejected");

    return sortedSessions;
  }, [filter, sortedSessions, upcomingSessions, pastSessions]);

  const latest = sortedSessions[0] || null;
  const nextSession = upcomingSessions[upcomingSessions.length - 1] || upcomingSessions[0] || null;

  const allowed = membership?.massageSessionsAllowed;
  const used = membership?.massageSessionsUsed ?? sessions.length;
  const remaining = membership?.massageSessionsRemaining;

  const showAllowed = allowed === "unlimited" ? "Unlimited" : allowed ?? 0;
  const showRemaining = remaining === "unlimited" ? "Unlimited" : remaining ?? 0;

  const statusLabel = (status = "pending") => {
    if (status === "approved") return "✅ Approved";
    if (status === "completed") return "✅ Completed";
    if (status === "rejected") return "❌ Rejected";
    return "⏳ Pending";
  };

  if (loading || fetching) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate feature="massage" membership={membership}>
      <div className="page-enter">
        <div className="topbar">
          <div>
            <div className="page-title">My Massage Sessions</div>
            <div className="page-subtitle">
              View upcoming, past and approved massage chair sessions
            </div>
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner membership={membership} />

          <div className="stats-grid mb-16">
            <StatCard
              label="Total Sessions"
              value={showAllowed}
              cls="s-gold"
              valueClass="c-gold"
            />

            <StatCard
              label="Used Sessions"
              value={used}
              cls="s-orange"
              valueClass="c-orange"
            />

            <StatCard
              label="Remaining"
              value={showRemaining}
              cls="s-green"
              valueClass="c-green"
            />

            <StatCard
              label="Upcoming"
              value={upcomingSessions.length}
              cls="s-blue"
              valueClass="c-blue"
            />
          </div>

          {nextSession && (
            <div className="massage-card mb-16">
              <div className="card-title">Next / Upcoming Massage</div>

              <div className="member-massage-latest">
                <div>
                  <span>Date</span>
                  <strong>{nextSession.date || "—"}</strong>
                </div>

                <div>
                  <span>Time</span>
                  <strong>{nextSession.time || "—"}</strong>
                </div>

                <div>
                  <span>Duration</span>
                  <strong>{nextSession.duration || 20} min</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{statusLabel(nextSession.status)}</strong>
                </div>
              </div>

              {nextSession.notes && (
                <div className="member-massage-notes">
                  <span>Notes</span>
                  <p>{nextSession.notes}</p>
                </div>
              )}
            </div>
          )}

          {latest && (
            <div className="massage-card mb-16">
              <div className="card-title">Latest Massage Record</div>

              <div className="member-massage-latest">
                <div>
                  <span>Date</span>
                  <strong>{latest.date || "—"}</strong>
                </div>

                <div>
                  <span>Time</span>
                  <strong>{latest.time || "—"}</strong>
                </div>

                <div>
                  <span>Duration</span>
                  <strong>{latest.duration || 20} min</strong>
                </div>

                <div>
                  <span>Session No.</span>
                  <strong>{latest.sessionNumber || "—"}</strong>
                </div>
              </div>
            </div>
          )}

          <SectionHeader title="Massage History" />

          <div className="steam-filter-row mb-16">
            {[
              ["all", "All"],
              ["upcoming", "Upcoming"],
              ["past", "Past"],
              ["pending", "Pending"],
              ["approved", "Approved"],
              ["completed", "Completed"],
              ["rejected", "Rejected"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`steam-filter-btn ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredSessions.length === 0 ? (
            <EmptyState
              icon="💆"
              title="NO MASSAGE SESSIONS"
              desc="No massage chair sessions found for this filter."
            />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Session No.</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSessions.map((s) => (
                    <tr key={s.id}>
                      <td>{s.date || "—"}</td>
                      <td>{s.time || "—"}</td>
                      <td>{s.duration || 20} min</td>
                      <td>{s.sessionNumber || "—"}</td>
                      <td>
                        <span className={`status-pill ${s.status || "pending"}`}>
                          {s.status || "pending"}
                        </span>
                      </td>
                      <td>{s.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LockGate>
  );
}