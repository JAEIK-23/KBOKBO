import { Link } from "react-router-dom";
import teamLogos from "../../assets/team-logo";
import { TEAMS } from "../../data/teams";
import styles from "./TeamLogoBar.module.css";

export default function TeamLogoBar() {
  return (
    <div className={styles.logoBar}>
      <div className={styles.logoList}>
        {TEAMS.map((t) => (
          <Link
            key={t.id}
            to={`/teams/${t.id}`}
            className={styles.logoItem}
            title={t.name}
          >
            <img src={teamLogos[t.name]} alt={t.name} />
          </Link>
        ))}
      </div>
    </div>
  );
}
