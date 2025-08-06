import { BrowserRouter, Routes, Route } from "react-router-dom";

import styles from "./App.module.css";
import Footer from "./shared/Footer/Footer";
import Header from "./shared/Header/Header";

import PlayersPage from "./pages/playersPage";
import TeamsPage from "./pages/teamsPage";
import RankingPage from "./pages/rankingPage";
import SchedulePage from "./pages/schedulePage";

import TeamRanking from "./features/team-ranking/TeamRanking";
import ScheduleList from "./features/schedules/ScheduleList";
import HighlightList from "./features/highlight/hightlightList";
import TeamLogoBar from "./features/teamLogoBar/teamLogoBar";
import TopAvgTable from "./features/playerStats/playerStats-hitter";
import TopEraTable from "./features/playerStats/playerStats-pitcher";

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.App}>
        <div className={styles.header}>
          <Header />
        </div>

        <div className={styles.container}>
          <Routes>
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route
              path="/"
              element={
                <>
                  <div className={styles.teamRanking}>
                    <TeamRanking />
                    <div className={styles.header}>
                      <TopAvgTable />
                      <TopEraTable />
                    </div>
                  </div>

                  <div className={styles.teamSchedule}>
                    <ScheduleList />
                  </div>

                  <HighlightList />
                  <TeamLogoBar />
                </>
              }
            />
          </Routes>
        </div>

        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
