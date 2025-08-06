import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import SearchModal from "../../features/searchModal/searchModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.header}>
        <Link to="/">
          <img
            src="https://6ptotvmi5753.edge.naverncp.com/KBO_IMAGE/KBOHome/resources/images/common/h1_logo.png"
            className={styles.logo}
          />
        </Link>
        <div className={styles.headerMenu}>
          <Link to="/schedule" className={styles.headerItem}>
            일정·결과
          </Link>
          <Link to="/ranking" className={styles.headerItem}>
            기록·순위
          </Link>
          <Link to="/players" className={styles.headerItem}>
            선수
          </Link>
          <Link to="/teams" className={styles.headerItem}>
            구단
          </Link>
        </div>
        <div className={styles.headerSearch}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
            className={styles.searchIcon}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      {isModalOpen && <SearchModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
