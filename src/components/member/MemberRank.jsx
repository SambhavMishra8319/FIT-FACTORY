export default function MemberRank({
  rank,
}) {
  return (
    <div className="stat-card s-gold">
      <div className="stat-label">
        Member Rank
      </div>

      <div className="stat-value c-gold">
        #{rank?.rank || "--"}
      </div>

      <div className="stat-sub">
        Leaderboard Position
      </div>
    </div>
  );
}