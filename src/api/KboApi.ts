export interface TeamStanding {
  rank: number;
  teamName: string;
  competitorId: number;
  played: number;
  win: number;
  loss: number;
  draw: number;
  winningPercentage: number;
}

export async function fetchTeamRanking(): Promise<TeamStanding[]> {
  const API_KEY = import.meta.env.VITE_SPORTSRADAR_API_KEY;

  const res = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.sportradar.com/baseball/trial/v2/ko/seasons/sr:season:128213/standings.json?api_key=${API_KEY}`
  );

  if (!res.ok) throw new Error(`API 호출 실패: ${res.status}`);

  const json = await res.json();

  const standings = json.standings[0].groups[0].standings;

  return standings.map((team: any) => ({
    rank: team.rank,
    teamName: team.competitor.name,
    played: team.played,
    competitorId: team.competitor.id,
    win: team.win,
    loss: team.loss,
    draw: team.draw,
    winningPercentage: team.winning_percentage,
  }));
}
