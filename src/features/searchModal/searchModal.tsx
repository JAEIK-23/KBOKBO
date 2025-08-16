import { useState, useEffect } from "react";
import styles from "./searchModal.module.css";
import playerImg from "../../assets/playerImg";

interface SearchModalProps {
  onClose: () => void;
}

interface Player {
  name: string;
  backNumber?: string;
  position?: string;
  dominantHand?: string;

  AVG?: string;
  OPS?: string;
  ERA?: string;
  WHIP?: string;
  age?: string;
  [key: string]: any;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [search, setSearch] = useState("");
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  const teams = [
    "doosan",
    "ssg",
    "hanwha",
    "kia",
    "kiwoom",
    "kt",
    "lg",
    "lotte",
    "nc",
    "samsung",
  ] as const;

  const positions = ["hitter", "pitcher"] as const;

  const urls = teams.flatMap((team) =>
    positions.map((pos) => `/${team}/${team}-${pos}.json`)
  );

  const normalize = (s: string) => s.toLowerCase();

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) return;

    setLoading(true);
    setPlayer(null);

    try {
      const results = await Promise.allSettled(
        urls.map(async (url) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`fetch fail: ${url}`);
          return res.json() as Promise<Player[] | Player>;
        })
      );

      const allPlayers: Player[] = results.flatMap((r) => {
        if (r.status !== "fulfilled") return [];
        const v = r.value;
        return Array.isArray(v) ? v : [v];
      });

      const target = normalize(q);
      const found =
        allPlayers.find((p) => p.name && normalize(p.name) === target) || null;

      setPlayer(found);
    } catch {
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>선수 검색</h2>

        <div className={styles.searchRow}>
          <input
            type="text"
            placeholder="선수 이름을 입력하세요"
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "검색중..." : "검색"}
          </button>
        </div>

        {player ? (
          <div className={styles.playerCard}>
            <img
              src={playerImg[player.name] || "/fallback-player.png"}
              alt={player.name}
              className={styles.playerImg}
              onError={(e) => (e.currentTarget.src = "/fallback-player.png")}
              loading="lazy"
            />
            <h3>{player.name}</h3>

            <p>
              {player.backNumber ? `#${player.backNumber}` : "#-"} ·{" "}
              {player.position ?? "-"} · {player.dominantHand ?? "-"}
            </p>

            {player.age && <p className={styles.subtle}>{player.age}</p>}

            {player.OPS || player.ERA ? (
              <div className={styles.quickStats}>
                {player.OPS ? (
                  <>
                    <span>AVG {player.AVG ?? "-"}</span>
                    <span> OPS {player.OPS}</span>
                  </>
                ) : (
                  <>
                    <span>ERA {player.ERA}</span>
                    <span> WHIP {player.WHIP ?? "-"}</span>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          !loading &&
          search.trim() !== "" && (
            <div className={styles.notFound}>검색 결과가 없습니다.</div>
          )
        )}

        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
