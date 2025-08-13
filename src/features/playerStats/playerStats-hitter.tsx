import styles from "./playerStats-hitter.module.css";
import playerImg from "../../assets/playerImg";
import playersData from "../../data/kbo-player-stats.json"; // JSON 직접 import

interface Player {
  rank: string;
  name: string;
  team: string;
  avg: string;
  games: string;
  pa: string;
  ab: string;
  r: string;
  h: string;
  hr: string;
  rbi: string;
}

export default function TopAvgTable() {
  // 렌더 전에 한 번만 계산
  const topPlayers: Player[] = [...(playersData as Player[])]
    .filter((player) => !isNaN(Number(player.avg)))
    .sort((a, b) => Number(b.avg) - Number(a.avg))
    .slice(0, 3);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>&lt; 🥇 타율 TOP 3 &gt;</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.hitterTh}>순위</th>
            <th className={styles.hitterTh}>이름</th>
            <th className={styles.hitterTh}>팀</th>
            <th className={styles.hitterTh}>타율</th>
            <th className={styles.hitterTh}>경기수</th>
            <th className={styles.hitterTh}>타석</th>
            <th className={styles.hitterTh}>타수</th>
            <th className={styles.hitterTh}>득점</th>
            <th className={styles.hitterTh}>안타</th>
            <th className={styles.hitterTh}>홈런</th>
            <th className={styles.hitterTh}>타점</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, index) => (
            <tr key={player.rank}>
              <td className={styles.hitterTd}>{index + 1}</td>
              <td className={styles.hitterTd}>
                <div className={styles.nameWrapper}>
                  <img
                    src={playerImg[player.name]}
                    alt={player.name}
                    className={styles.playerImg}
                  />
                  <span>{player.name}</span>
                </div>
              </td>
              <td className={styles.hitterTd}>{player.team}</td>
              <td className={styles.hitterTd}>
                {Number(player.avg).toFixed(3)}
              </td>
              <td className={styles.hitterTd}>{player.games}</td>
              <td className={styles.hitterTd}>{player.pa}</td>
              <td className={styles.hitterTd}>{player.ab}</td>
              <td className={styles.hitterTd}>{player.r}</td>
              <td className={styles.hitterTd}>{player.h}</td>
              <td className={styles.hitterTd}>{player.hr}</td>
              <td className={styles.hitterTd}>{player.rbi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
