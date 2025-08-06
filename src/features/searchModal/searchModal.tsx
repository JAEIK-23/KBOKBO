import { useState } from "react";
import styles from "./searchModal.module.css";

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [search, setSearch] = useState("");

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>선수 검색</h2>
        <input
          type="text"
          placeholder="선수 이름을 입력하세요"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.searchButton}>검색</button>

        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
