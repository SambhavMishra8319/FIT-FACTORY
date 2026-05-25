import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/config";

import { format, subDays } from "date-fns";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import { useMembership } from "../../hooks/useMembership";

import {
  LockGate,
  ExpiryBanner,
} from "../../components/LockGate";

import LoadingSkeleton from "../../components/member/LoadingSkeleton";

import StatCard from "../../components/member/StatCard";

import SectionHeader from "../../components/member/SectionHeader";

import AchievementCard from "../../components/member/AchievementCard";

import {
  getBCAReadings,
  getAchievements,
  checkAndAwardAchievements,
  subscribeLeaderboard,
} from "../../firebase/service";

export default function MemberProgress() {
  const { membership, loading } =
    useMembership();

  const { profile } = useAuth();

  const [attendance, setAttendance] =
    useState([]);

  const [bcaReadings, setBcaReadings] =
    useState([]);

  const [achievements, setAchievements] =
    useState([]);

  const [lbRank, setLbRank] =
    useState(null);

  const [fetching, setFetching] =
    useState(true);

  useEffect(() => {
    if (!membership?.memberId) {
      setFetching(false);
      return;
    }

    const load = async () => {
      try {
        const [
          attendanceSnap,
          bca,
          ach,
        ] = await Promise.all([
          getDocs(
            query(
              collection(
                db,
                "attendance"
              ),
              where(
                "memberId",
                "==",
                membership.memberId
              )
            )
          ),

          getBCAReadings(
            membership.memberId
          ),

          getAchievements(
            membership.memberId
          ),
        ]);

        const attendanceData =
          attendanceSnap.docs.map(
            d => d.data()
          );

        setAttendance(
          attendanceData
        );

        setBcaReadings(bca);

        setAchievements(ach);

        const newAchievements =
          await checkAndAwardAchievements(
            membership.memberId,
            profile?.name,
            {
              attendance:
                attendanceData,
              bcaReadings: bca,
            }
          );

        if (
          newAchievements.length > 0
        ) {
          newAchievements.forEach(
            a => {
              toast.success(
                `🏆 ${a.name}`
              );
            }
          );

          const refreshed =
            await getAchievements(
              membership.memberId
            );

          setAchievements(
            refreshed
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    load();

    const unsub =
      subscribeLeaderboard(
        leaders => {
          const idx =
            leaders.findIndex(
              l =>
                l.memberId ===
                membership.memberId
            );

          if (idx !== -1) {
            setLbRank({
              rank: idx + 1,
              points:
                leaders[idx]
                  .points,
            });
          }
        }
      );

    return () => unsub();
  }, [membership]);

  if (loading || fetching) {
    return <LoadingSkeleton />;
  }

  const dates = new Set(
    attendance.map(a => a.date)
  );

  let streak = 0;

  let current = new Date();

  while (
    dates.has(
      format(
        current,
        "yyyy-MM-dd"
      )
    )
  ) {
    streak++;

    current.setDate(
      current.getDate() - 1
    );
  }

  const thisMonth = format(
    new Date(),
    "yyyy-MM"
  );

  const monthSessions =
    attendance.filter(a =>
      a.date?.startsWith(
        thisMonth
      )
    ).length;

  const earnedCount =
    achievements.filter(
      a => a.earned
    ).length;

  const last7 = Array.from(
    { length: 7 },
    (_, i) => {
      const day = subDays(
        new Date(),
        6 - i
      );

      return {
        date: format(
          day,
          "yyyy-MM-dd"
        ),

        label: format(
          day,
          "EEE"
        ),

        present: dates.has(
          format(
            day,
            "yyyy-MM-dd"
          )
        ),
      };
    }
  );

  return (
    <LockGate
      feature="progress"
      membership={membership}
    >
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">
            My Progress
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner
            membership={membership}
          />

          <div className="stats-grid mb-16">
            <StatCard
              label="Day Streak"
              value={streak}
              sub={
                streak > 0
                  ? "🔥 Keep Going"
                  : "Start Today"
              }
              cls="s-gold"
              valueClass="c-gold"
            />

            <StatCard
              label="This Month"
              value={monthSessions}
              sub="Sessions"
              cls="s-green"
              valueClass="c-green"
            />

            <StatCard
              label="Total"
              value={
                attendance.length
              }
              sub="All Time"
              cls="s-red"
              valueClass="c-red"
            />

            <StatCard
              label="Rank"
              value={
                lbRank
                  ? `#${lbRank.rank}`
                  : "—"
              }
              sub={
                lbRank
                  ? `${lbRank.points} pts`
                  : "No Rank"
              }
              cls="s-blue"
              valueClass="c-blue"
            />
          </div>

          <div className="card mb-16">
            <div className="card-title">
              Last 7 Days
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              {last7.map(day => (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio:
                        "1",

                      borderRadius: 8,

                      background:
                        day.present
                          ? "var(--grad-gold)"
                          : "var(--card2)",

                      display: "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      marginBottom: 6,
                    }}
                  >
                    {day.present
                      ? "✓"
                      : ""}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                    }}
                  >
                    {day.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SectionHeader
            title="Achievements"
            right={`${earnedCount}/${achievements.length}`}
          />

          <div className="grid-3">
            {achievements.map(
              (
                achievement,
                index
              ) => (
                <AchievementCard
                  key={index}
                  achievement={
                    achievement
                  }
                />
              )
            )}
          </div>

          <div className="info-box warning mt-16">
            🏆 Check-ins,
            workouts, BCA and steam
            sessions all contribute
            to leaderboard points.
          </div>
        </div>
      </div>
    </LockGate>
  );
}