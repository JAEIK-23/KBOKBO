export interface Competitor {
  id: string;
  name: string;
  abbreviation?: string;
  qualifier?: "home" | "away";
}

export interface SportEventContext {
  competition: {
    id: string;
    name?: string;
  };
  season?: {
    id: string;
    name?: string;
  };
}

export interface PeriodScore {
  number: number;
  home_score: number;
  away_score: number;
  type: string;
}

export interface SportEventStatus {
  status: string;
  match_status: string;
  home_score: number;
  away_score: number;
  winner_id?: string;
  period_scores?: PeriodScore[];
}

export interface Game {
  id: string;
  start_time: string;
  competitors: Competitor[];
  sport_event_context: SportEventContext;
  sport_event_status?: SportEventStatus;
}

export interface Summary {
  sport_event?: Game;
  sport_event_status?: SportEventStatus;
}

export interface ApiResponse {
  generated_at: string;
  summaries: Summary[];
}

const KBO_COMPETITION_ID = "sr:competition:2541";

export async function fetchKboSchedule(date?: string): Promise<Game[]> {
  const targetDate = date ?? new Date().toISOString().slice(0, 10);
  const API_KEY = import.meta.env.VITE_SPORTSRADAR_API_KEY;

  const res = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.sportradar.com/baseball/trial/v2/ko/schedules/${targetDate}/summaries.json?api_key=${API_KEY}`
  );

  if (!res.ok) throw new Error(`API 호출 실패: ${res.status}`);

  const data: ApiResponse = await res.json();

  return data.summaries
    .filter(
      (summary) =>
        summary.sport_event?.sport_event_context?.competition?.id ===
        KBO_COMPETITION_ID
    )
    .map((summary) => ({
      ...summary.sport_event!,
      sport_event_status: summary.sport_event_status,
    }));
}
