import { useEffect, useState } from "react";
import styles from "./playerStats-pitcher.module.css";
import playerImg from "../../assets/playerImg";

interface pitcher {
  rank: string;
  name: string;
  team: string;
  era: string;
  games: string;
  wins: string;
  losses: string;
  saves: string;
  hold: string;
  wpct: string;
  ip: string;
  h: string;
  hr: string;
  bb: string;
  hbp: string;
  so: string;
  r: string;
  er: string;
  whip: string;
}

export default function TopEraTable() {
  const [topPitchers, setTopPitchers] = useState<pitcher[]>([]);

  useEffect(() => {
    fetch("/kbo-pitcher-stats.json")
      .then((res) => res.json())
      .then((data: pitcher[]) => {
        const sorted = [...data]
          .filter((player) => !isNaN(Number(player.era)))
          .sort((a, b) => Number(a.era) - Number(b.era))
          .slice(0, 3);
        setTopPitchers(sorted);
      })
      .catch((err) => {
        console.error("❌ 데이터 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>&lt; 🥇 ERA TOP 3 &gt;</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.hitterTh}>순위</th>
            <th className={styles.hitterTh}>이름</th>
            <th className={styles.hitterTh}>팀</th>
            <th className={styles.hitterTh}>ERA</th>
            <th className={styles.hitterTh}>게임</th>
            <th className={styles.hitterTh}>승리</th>
            <th className={styles.hitterTh}>패전</th>
            <th className={styles.hitterTh}>세이브</th>
            <th className={styles.hitterTh}>홀드</th>
            <th className={styles.hitterTh}>승률</th>
            <th className={styles.hitterTh}>이닝</th>
          </tr>
        </thead>
        <tbody>
          {topPitchers.map((player, index) => (
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
                {Number(player.era).toFixed(2)}
              </td>
              <td className={styles.hitterTd}>{player.games}</td>
              <td className={styles.hitterTd}>{player.wins}</td>
              <td className={styles.hitterTd}>{player.losses}</td>
              <td className={styles.hitterTd}>{player.saves}</td>
              <td className={styles.hitterTd}>{player.hold}</td>
              <td className={styles.hitterTd}>{player.wpct}</td>
              <td className={styles.hitterTd}>{player.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
