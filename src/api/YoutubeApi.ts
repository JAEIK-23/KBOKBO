export interface VideoInfo {
  title: string;
  youtubeUrl: string;
  thumbnail: string;
}

export async function fetchHighlightVideo(
  gameTitle: string
): Promise<VideoInfo | null> {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      gameTitle + " 하이라이트"
    )}&key=${API_KEY}`
  );

  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const item = data.items[0];
    const videoId = item.id.videoId;

    return {
      title: gameTitle,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  return null;
}
