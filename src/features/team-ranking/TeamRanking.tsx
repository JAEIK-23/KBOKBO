import { useQuery } from "@tanstack/react-query";
import { fetchTeamRanking } from "../../api/KboApi";
import type { TeamStanding } from "../../api/KboApi";
import styles from "./TeamRanking.module.css";
import teamLogos from "../../assets/team-logo";

export default function TeamRanking() {
  const { data, isLoading, error } = useQuery<TeamStanding[]>({
    queryKey: ["teamRanking"],
    queryFn: fetchTeamRanking,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2> &lt; TEAM RANKING &gt; </h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>순위</th>
            <th> 팀</th>
            <th>경기수</th>
            <th>승</th>
            <th>패</th>
            <th>무</th>
            <th>승률</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((team) => (
            <tr key={team.competitorId}>
              <td>{team.rank}</td>
              <td className={styles.teamCell}>
                <img
                  src={teamLogos[team.teamName]}
                  alt={`${team.teamName} 로고`}
                  className={styles.logo}
                />
                <span>{team.teamName}</span>
              </td>
              <td>{team.played}</td>
              <td>{team.win}</td>
              <td>{team.loss}</td>
              <td>{team.draw}</td>
              <td>{(team.winningPercentage * 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
