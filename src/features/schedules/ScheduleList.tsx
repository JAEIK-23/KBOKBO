import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchKboSchedule } from "../../api/ScheduleApi";
import type { Game } from "../../api/ScheduleApi";
import styles from "./ScheduleList.module.css";
import teamLogos from "../../assets/team-logo";

export default function ScheduleList() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = selectedDate.toISOString().split("T")[0];

  const {
    data: games,
    isLoading,
    error,
  } = useQuery<Game[]>({
    queryKey: ["kboSchedule", formattedDate],
    queryFn: () => fetchKboSchedule(formattedDate),
  });

  const handlePrevDate = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const formatDateKorean = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  return (
    <div className={styles.wrapper}>
      <div className={styles.dateHeader}>
        <button className={styles.navBtn} onClick={handlePrevDate}>
          &lt;
        </button>
        <span className={styles.dateText}>
          {formatDateKorean(selectedDate)}
        </span>
        <button className={styles.navBtn} onClick={handleNextDate}>
          &gt;
        </button>
      </div>

      {isLoading && <p className={styles.message}>불러오는 중...</p>}
      {error instanceof Error && (
        <p className={styles.error}>에러: {error.message}</p>
      )}
      {!isLoading && (!games || games.length === 0) && (
        <p className={styles.message}>경기 일정이 없습니다.</p>
      )}

      <ul className={styles.cardList}>
        {games?.map((game) => {
          const homeTeam =
            game.competitors.find((c) => c.qualifier === "home")?.name ?? "팀1";
          const awayTeam =
            game.competitors.find((c) => c.qualifier === "away")?.name ?? "팀2";

          const startTime = new Date(game.start_time).toLocaleTimeString(
            "ko-KR",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );

          const homeScore = game.sport_event_status?.home_score;
          const awayScore = game.sport_event_status?.away_score;

          return (
            <li key={game.id} className={styles.card}>
              <div className={styles.time}>{startTime}</div>
              <div className={styles.match}>
                <div className={styles.team}>
                  <img
                    src={teamLogos[homeTeam] ?? "/default-logo.png"}
                    alt={homeTeam}
                  />
                  <span>{homeTeam}</span>
                </div>
                <div className={styles.vs}>VS</div>
                <div className={styles.team}>
                  <img
                    src={teamLogos[awayTeam] ?? "/default-logo.png"}
                    alt={awayTeam}
                  />
                  <span>{awayTeam}</span>
                </div>
              </div>
              {
                <div className={styles.score}>
                  <span className={styles.homeScore}>{homeScore}</span>
                  <span className={styles.separator}>:</span>
                  <span className={styles.awayScore}>{awayScore}</span>
                </div>
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
}
