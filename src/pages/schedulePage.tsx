import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, dateFnsLocalizer, type SlotInfo } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchKboSchedule, type Game } from "../api/ScheduleApi";
import styles from "./schedulePage.module.css";

const locales = { ko };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  game?: Game;
};

function getDateRange(start: Date, end: Date): string[] {
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const dateStrings = getDateRange(startDate, endDate);

  const { data, isLoading, error } = useQuery<Game[][]>({
    queryKey: ["kboSchedule", currentDate],
    queryFn: async () => {
      const results = await Promise.all(
        dateStrings.map((dateStr) => fetchKboSchedule(dateStr))
      );
      return results;
    },
  });

  const games = data ? data.flat() : [];

  const events: Event[] = games.map((game) => {
    const start = new Date(game.start_time);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

    const home = game.competitors.find((c) => c.qualifier === "home")?.name;
    const away = game.competitors.find((c) => c.qualifier === "away")?.name;

    return {
      title: home && away ? `${home} vs ${away}` : "경기",
      start,
      end,
      allDay: false,
      game,
    };
  });

  if (isLoading) return <div className={styles.calendarSkeleton} />;
  if (error) return <p className={styles.status}>데이터 로드 실패</p>;

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={setCurrentDate}
        className={styles.customCalendar}
        selectable={true}
        onSelectSlot={(slotInfo: SlotInfo) => {
          const clickedDate = slotInfo.start;
          const matched = events.filter((event) =>
            isSameDay(event.start, clickedDate)
          );
          setSelectedEvents(matched);
          setModalOpen(true);
        }}
      />

      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setModalOpen(false)}
              aria-label="모달 닫기"
            >
              ×
            </button>
            <h2>{selectedEvents.length}개의 경기 일정</h2>
            {selectedEvents.length === 0 ? (
              <p>해당 날짜에는 일정이 없습니다.</p>
            ) : (
              <ul className={styles.eventList}>
                {selectedEvents.map((event, idx) => {
                  const home = event.game?.competitors.find(
                    (c) => c.qualifier === "home"
                  )?.name;
                  const away = event.game?.competitors.find(
                    (c) => c.qualifier === "away"
                  )?.name;
                  const startTime = event.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const status = event.game?.sport_event_status;
                  const isFinished = event.start.getTime() < Date.now();
                  const homeScore = status?.home_score;
                  const awayScore = status?.away_score;

                  return (
                    <li key={idx} className={styles.eventItem}>
                      <strong>
                        {away} vs {home}
                      </strong>
                      <br />
                      {startTime}
                      {isFinished && homeScore != null && awayScore != null ? (
                        <span>
                          &nbsp;&nbsp;| 점수: {homeScore} : {awayScore}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
