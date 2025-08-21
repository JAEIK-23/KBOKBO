import { useQuery } from "@tanstack/react-query";
import { fetchKboSchedule, type Game } from "../../api/ScheduleApi";
import { fetchHighlightVideo, type VideoInfo } from "../../api/YoutubeApi";
import { HighlightCard } from "./highlightCard";
import styles from "./highlightList.module.css";

export default function HighlightList() {
  const {
    data: games,
    isLoading,
    error,
  } = useQuery<Game[]>({
    queryKey: ["kboSchedule"],
    queryFn: () => fetchKboSchedule(),
    staleTime: 1000 * 60 * 60,
  });

  const highlights = useQuery({
    queryKey: ["highlights", games?.map((g) => g.id)],
    queryFn: async () => {
      if (!games) return [];
      const results = await Promise.all(
        games.map((game) => {
          const gameDate = new Date(game.start_time).toISOString().slice(0, 10);
          const team1 = game.competitors[0]?.name ?? "";
          const team2 = game.competitors[1]?.name ?? "";
          const query = `${gameDate} ${team1} vs ${team2} 하이라이트`;
          return fetchHighlightVideo(query);
        })
      );
      return results.filter((v): v is VideoInfo => v !== null);
    },
    enabled: !!games,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading)
    return (
      <div className={styles.container}>
        <div className={styles.longSkeleton} />
      </div>
    );
  if (error instanceof Error)
    return <p style={{ color: "red" }}>에러: {error.message}</p>;
  if (!games || games.length === 0) return <p>오늘 경기 일정이 없습니다.</p>;

  if (highlights.isLoading)
    return (
      <div className={styles.container}>
        <div className={styles.longSkeleton} />
      </div>
    );
  if (highlights.isError) return <p>하이라이트 불러오기 실패 </p>;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.icon}>🎥</span> 오늘의 하이라이트
      </div>
      <div className={styles.videoContent}>
        {highlights.data?.map((video, i) => (
          <HighlightCard
            key={i}
            title={video.title}
            thumbnail={video.thumbnail}
            youtubeUrl={video.youtubeUrl}
          />
        ))}
      </div>
    </div>
  );
}
