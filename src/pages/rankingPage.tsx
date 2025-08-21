import { useMemo, useState } from "react";
import styles from "./rankingPage.module.css";
import playerImg from "../assets/playerImg";

import pitchersData from "../data/kbo-pitcher-stats.json";
import battersData from "../data/kbo-player-stats.json";

interface Pitcher {
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
interface Batter {
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

export default function PlayerStats() {
  const [selectedType, setSelectedType] = useState<"pitcher" | "batter">(
    "pitcher"
  );

  const pitchers = useMemo(() => pitchersData as Pitcher[], []);
  const batters = useMemo(() => battersData as Batter[], []);

  const title = selectedType === "pitcher" ? "투수 ERA 순위" : "타자 타율 순위";

  const getRankClass = (rank: number) => {
    if (rank >= 1 && rank <= 5)
      return styles[`rank${rank}` as keyof typeof styles] as string;
    return "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setSelectedType("pitcher")}
            className={`${styles.button} ${
              selectedType === "pitcher" ? styles.active : ""
            }`}
          >
            투수
          </button>
          <button
            onClick={() => setSelectedType("batter")}
            className={`${styles.button} ${
              selectedType === "batter" ? styles.active : ""
            }`}
          >
            타자
          </button>
        </div>
      </div>

      {selectedType === "pitcher" && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>팀</th>
              <th>ERA</th>
              <th>경기</th>
              <th>승</th>
              <th>패</th>
              <th>세</th>
              <th>홀</th>
              <th>승률</th>
              <th>이닝</th>
              <th>피안타</th>
              <th>피홈런</th>
              <th>볼넷</th>
              <th>사구</th>
              <th>삼진</th>
              <th>실점</th>
              <th>자책</th>
              <th>WHIP</th>
            </tr>
          </thead>
          <tbody>
            {pitchers.map((p) => (
              <tr key={`${p.rank}-${p.name}`}>
                <td className={getRankClass(Number(p.rank))}>{p.rank}</td>
                <td>
                  <span className={styles.nameWrapper}>
                    {playerImg[p.name] && (
                      <img
                        src={playerImg[p.name]}
                        alt={p.name}
                        className={styles.playerImg}
                        loading="lazy"
                      />
                    )}
                    {p.name}
                  </span>
                </td>
                <td>{p.team}</td>
                <td className={styles.highlightStat}>{p.era}</td>
                <td>{p.games}</td>
                <td>{p.wins}</td>
                <td>{p.losses}</td>
                <td>{p.saves}</td>
                <td>{p.hold}</td>
                <td>{p.wpct}</td>
                <td>{p.ip}</td>
                <td>{p.h}</td>
                <td>{p.hr}</td>
                <td>{p.bb}</td>
                <td>{p.hbp}</td>
                <td>{p.so}</td>
                <td>{p.r}</td>
                <td>{p.er}</td>
                <td>{p.whip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedType === "batter" && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>순위</th>
              <th>이름</th>
              <th>팀</th>
              <th>타율</th>
              <th>경기</th>
              <th>타석</th>
              <th>타수</th>
              <th>득점</th>
              <th>안타</th>
              <th>홈런</th>
              <th>타점</th>
            </tr>
          </thead>
          <tbody>
            {batters.map((b) => (
              <tr key={`${b.rank}-${b.name}`}>
                <td className={getRankClass(Number(b.rank))}>{b.rank}</td>
                <td>
                  <span className={styles.nameWrapper}>
                    {playerImg[b.name] && (
                      <img
                        src={playerImg[b.name]}
                        alt={b.name}
                        className={styles.playerImg}
                        loading="lazy"
                      />
                    )}
                    {b.name}
                  </span>
                </td>
                <td>{b.team}</td>
                <td className={styles.highlightStat}>{b.avg}</td>
                <td>{b.games}</td>
                <td>{b.pa}</td>
                <td>{b.ab}</td>
                <td>{b.r}</td>
                <td>{b.h}</td>
                <td>{b.hr}</td>
                <td>{b.rbi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
