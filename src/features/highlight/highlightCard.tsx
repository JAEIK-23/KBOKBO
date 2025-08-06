import styles from "./HighlightList.module.css";

interface HighlightCardProps {
  title: string;
  thumbnail: string;
  youtubeUrl: string;
}

export function HighlightCard({
  title,
  thumbnail,
  youtubeUrl,
}: HighlightCardProps) {
  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <img src={thumbnail} alt={title} className={styles.thumbnail} />
    </a>
  );
}
