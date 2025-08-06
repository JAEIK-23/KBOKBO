import teamLogos from "../../assets/team-logo";
import styles from "./TeamLogoBar.module.css";

export default function TeamLogoBar() {
  return (
    <div className={styles.logoBar}>
      <div className={styles.logoList}>
        {Object.entries(teamLogos).map(([teamName, logoUrl]) => (
          <div key={teamName} className={styles.logoItem} title={teamName}>
            <img src={logoUrl} alt={teamName} />
          </div>
        ))}
      </div>
    </div>
  );
}
