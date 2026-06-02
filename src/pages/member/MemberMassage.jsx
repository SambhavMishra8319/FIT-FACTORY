import { useEffect, useMemo, useState } from "react";

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
    return [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sessions]);

  const latest = sortedSessions[0] || null;

  const allowed = membership?.massageSessionsAllowed;
  const used = membership?.massageSessionsUsed ?? sessions.length;
  const remaining = membership?.massageSessionsRemaining;

  const showAllowed = allowed === "unlimited" ? "Unlimited" : allowed ?? 0;
  const showRemaining = remaining === "unlimited" ? "Unlimited" : remaining ?? 0;

  if (loading || fetching) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate feature="massage" membership={membership}>
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">My Massage Sessions</div>
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
              label="Last Session"
              value={latest?.date || "—"}
              cls="s-blue"
              valueClass="c-blue"
            />
          </div>

          {sortedSessions.length === 0 ? (
            <EmptyState
              icon="💆"
              title="NO MASSAGE SESSIONS"
              desc="Ask the gym team to add your first massage chair session."
            />
          ) : (
            <>
              <div className="massage-card mb-16">
                <div className="card-title">Latest Session</div>
                <div className="member-massage-latest">
                  <div>
                    <span>Date</span>
                    <strong>{latest?.date || "—"}</strong>
                  </div>
                  <div>
                    <span>Time</span>
                    <strong>{latest?.time || "—"}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{latest?.duration || 20} min</strong>
                  </div>
                  <div>
                    <span>Session No.</span>
                    <strong>{latest?.sessionNumber || "—"}</strong>
                  </div>
                </div>

                {latest?.notes && (
                  <div className="member-massage-notes">
                    <span>Notes</span>
                    <p>{latest.notes}</p>
                  </div>
                )}
              </div>

              <SectionHeader title="Massage History" />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Duration</th>
                      <th>Session No.</th>
                      <th>Notes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedSessions.map((s) => (
                      <tr key={s.id}>
                        <td>{s.date || "—"}</td>
                        <td>{s.time || "—"}</td>
                        <td>{s.duration || 20} min</td>
                        <td>{s.sessionNumber || "—"}</td>
                        <td>{s.notes || "—"}</td>
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
