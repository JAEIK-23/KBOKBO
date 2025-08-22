import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styles from "./playersPage.module.css";
import playerImg from "../assets/playerImg";

interface Pitcher {
  name: string;
  backNumber: string;
  position: string;
  dominantHand: string;
  ERA: string;
  WHIP: string;
  IP: string;
  SO: string;
  BB: string;
  "K/BB": string;
  age: string;
}
interface Hitter {
  name: string;
  backNumber: string;
  position: string;
  dominantHand: string;
  AVG: string;
  OBP: string;
  SLG: string;
  OPS: string;
  H: string;
  HR: string;
  RBI: string;
  BB: string;
  SO: string;
  "BB/K": string;
  age: string;
}
type Player = Pitcher | Hitter;

const teams = [
  "doosan",
  "ssg",
  "kia",
  "kiwoom",
  "hanwha",
  "kt",
  "lg",
  "lotte",
  "nc",
  "samsung",
];

type LocationState = { player?: Player; team?: string } | undefined;

export default function PlayersPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>(teams[0]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const location = useLocation();
  const state = (location.state as LocationState) || {};

  useEffect(() => {
    if (state?.team) setSelectedTeam(state.team);
    if (state?.player) setSelectedPlayer(state.player);
  }, []);

  const {
    data: pitchers,
    isLoading: loadingPitchers,
    isError: errorPitchers,
  } = useQuery({
    queryKey: ["pitchers", selectedTeam],
    queryFn: () =>
      fetch(`/${selectedTeam}-pitcher.json`).then((res) => res.json()),
  });

  const {
    data: hitters,
    isLoading: loadingHitters,
    isError: errorHitters,
  } = useQuery({
    queryKey: ["hitters", selectedTeam],
    queryFn: () =>
      fetch(`/${selectedTeam}-hitter.json`).then((res) => res.json()),
  });

  if (loadingPitchers || loadingHitters) return <p>Loading...</p>;
  if (errorPitchers || errorHitters) return <p>Error loading data</p>;

  const selectedPlayerImgUrl =
    selectedPlayer && playerImg[selectedPlayer.name]
      ? playerImg[selectedPlayer.name]
      : null;

  return (
    <div className={styles.container}>
      <h2>선수 상세 정보</h2>
      <div className={styles.detailBox}>
        {selectedPlayer ? (
          <div className={styles.detailFlex}>
            <div className={styles.detailName}>
              <h3>{selectedPlayer.name}</h3>
              {selectedPlayerImgUrl && (
                <img
                  src={selectedPlayerImgUrl}
                  alt={selectedPlayer.name}
                  className={styles.playerImage}
                  onError={(e) =>
                    (e.currentTarget.src = "/fallback-player.png")
                  }
                  style={{ border: "2px solid #ddd", marginTop: 10 }}
                />
              )}
            </div>

            <div className={styles.detailInfo}>
              <p>
                <strong>등번호:</strong> {selectedPlayer.backNumber}
              </p>
              <p>
                <strong>포지션:</strong> {selectedPlayer.position}
              </p>
              <p>
                <strong>주손:</strong> {selectedPlayer.dominantHand}
              </p>
              <p>
                <strong>나이 / 생년월일:</strong>{" "}
                {"age" in selectedPlayer ? selectedPlayer.age : "-"}
              </p>

              {"ERA" in selectedPlayer ? (
                <>
                  <p>
                    <strong>ERA:</strong> {selectedPlayer.ERA}
                  </p>
                  <p>
                    <strong>WHIP:</strong> {selectedPlayer.WHIP}
                  </p>
                  <p>
                    <strong>IP:</strong> {selectedPlayer.IP}
                  </p>
                  <p>
                    <strong>SO:</strong> {selectedPlayer.SO}
                  </p>
                  <p>
                    <strong>BB:</strong> {selectedPlayer.BB}
                  </p>
                  <p>
                    <strong>K/BB:</strong> {selectedPlayer["K/BB"]}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>AVG:</strong> {(selectedPlayer as Hitter).AVG}
                  </p>
                  <p>
                    <strong>OBP:</strong> {(selectedPlayer as Hitter).OBP}
                  </p>
                  <p>
                    <strong>SLG:</strong> {(selectedPlayer as Hitter).SLG}
                  </p>
                  <p>
                    <strong>OPS:</strong> {(selectedPlayer as Hitter).OPS}
                  </p>
                  <p>
                    <strong>H:</strong> {(selectedPlayer as Hitter).H}
                  </p>
                  <p>
                    <strong>HR:</strong> {(selectedPlayer as Hitter).HR}
                  </p>
                  <p>
                    <strong>RBI:</strong> {(selectedPlayer as Hitter).RBI}
                  </p>
                  <p>
                    <strong>BB:</strong> {(selectedPlayer as Hitter).BB}
                  </p>
                  <p>
                    <strong>SO:</strong> {(selectedPlayer as Hitter).SO}
                  </p>
                  <p>
                    <strong>BB/K:</strong> {(selectedPlayer as Hitter)["BB/K"]}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.emptyText}>
            선수를 선택하면 상세 정보가 표시됩니다.
          </div>
        )}
      </div>

      <div className={styles.pitcherHeader}>
        <h3>투수 명단</h3>
        <div className={styles.teamSelect}>
          <label htmlFor="team-select">팀 선택: </label>
          <select
            id="team-select"
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value);
              setSelectedPlayer(null);
            }}
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className={styles.listTable}>
        <thead>
          <tr>
            <th>이름</th>
            <th>포지션</th>
            <th>ERA</th>
            <th>WHIP</th>
            <th>SO</th>
          </tr>
        </thead>
        <tbody>
          {pitchers?.map((p: Pitcher) => (
            <tr
              key={`${p.name}-${p.backNumber}`}
              onClick={() => setSelectedPlayer(p)}
              className={styles.clickableRow}
            >
              <td>{p.name}</td>
              <td>{p.position}</td>
              <td>{p.ERA}</td>
              <td>{p.WHIP}</td>
              <td>{p.SO}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>타자 명단</h3>
      <table className={styles.listTable}>
        <thead>
          <tr>
            <th>이름</th>
            <th>포지션</th>
            <th>AVG</th>
            <th>OPS</th>
            <th>HR</th>
          </tr>
        </thead>
        <tbody>
          {hitters?.map((h: Hitter) => (
            <tr
              key={`${h.name}-${h.backNumber}`}
              onClick={() => setSelectedPlayer(h)}
              className={styles.clickableRow}
            >
              <td>{h.name}</td>
              <td>{h.position}</td>
              <td>{h.AVG}</td>
              <td>{h.OPS}</td>
              <td>{h.HR}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
