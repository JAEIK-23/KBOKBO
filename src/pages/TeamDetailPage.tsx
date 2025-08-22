import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import teamLogos from "../assets/team-logo";
import playerImg from "../assets/playerImg";
import { getTeamById } from "../data/teams";
import styles from "./TeamDetailPage.module.css";

import { fetchHighlightVideo } from "../api/YoutubeApi";

interface Pitcher {
  name: string;
  backNumber: string;
  position: string;
  dominantHand: string;
  ERA: string;
  WHIP: string;
  IP: string;
  SO: string;
  BB: string;
  "K/BB": string;
  age: string;
}
interface Hitter {
  name: string;
  backNumber: string;
  position: string;
  dominantHand: string;
  AVG: string;
  OBP: string;
  SLG: string;
  OPS: string;
  H: string;
  HR: string;
  RBI: string;
  BB: string;
  SO: string;
  "BB/K": string;
  age: string;
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.replace("/", "");
    return null;
  } catch {
    return null;
  }
}

function logoDivIcon(src: string) {
  return L.divIcon({
    className: "",
    iconSize: [56, 56],
    iconAnchor: [28, 28],
    html: `
      <div style="
        width:56px;height:56px;border-radius:9999px;
        background:#ffffff;border:1px solid rgba(0,0,0,0.06);
        box-shadow:0 8px 20px rgba(0,0,0,0.18);
        display:flex;align-items:center;justify-content:center;overflow:hidden
      ">
        <img src="${src}" style="width:88%;height:88%;object-fit:contain" />
      </div>
    `,
  });
}

export default function TeamDetailPage() {
  const { id = "" } = useParams();
  const team = useMemo(() => getTeamById(id), [id]);

  if (!team) {
    return (
      <div className={styles.wrap}>
        <div className={styles.empty}>
          팀 정보를 찾을 수 없습니다. <Link to="/teams">구단 목록으로</Link>
        </div>
      </div>
    );
  }

  const logo = teamLogos[team.name];

  const {
    data: anthem,
    isLoading: anthemLoading,
    isError: anthemError,
  } = useQuery({
    queryKey: ["team-anthem", team.id],
    queryFn: () =>
      fetchHighlightVideo(team.anthemQuery ?? `${team.name} 응원가`),
    staleTime: 1000 * 60 * 30,
  });
  const videoId = anthem?.youtubeUrl ? getYouTubeId(anthem.youtubeUrl) : null;

  const [rosterTab, setRosterTab] = useState<"P" | "H">("P");

  const {
    data: pitchers = [],
    isLoading: pitchersLoading,
    isError: pitchersError,
  } = useQuery<Pitcher[]>({
    queryKey: ["pitchers", team.id],
    queryFn: async () => {
      const res = await fetch(`./${team.id}/${team.id}-pitcher.json`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const {
    data: hitters = [],
    isLoading: hittersLoading,
    isError: hittersError,
  } = useQuery<Hitter[]>({
    queryKey: ["hitters", team.id],
    queryFn: async () => {
      const res = await fetch(`./${team.id}/${team.id}-hitter.json`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  return (
    <div className={styles.wrap}>
      <header className={styles.headerGrid}>
        <div className={styles.headerMain}>
          <div className={styles.headerTop}>
            <div className={styles.logoBox}>
              <img src={logo} alt={team.name} />
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.title}>{team.name}</h1>
              <p className={styles.meta}>
                {team.city} · {team.stadium}
              </p>
              <div className={styles.metaRow}>
                <span>
                  감독: <b>{team.manager ?? "정보 없음"}</b>
                </span>
                <span className={styles.dot} />
                <span>
                  창단:{" "}
                  <b>{team.founded ? `${team.founded}년` : "정보 없음"}</b>
                </span>
              </div>
              {team.website && (
                <a
                  href={team.website}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.siteBtn}
                >
                  공식 사이트
                </a>
              )}
            </div>
          </div>
        </div>

        <aside className={styles.headerSide}>
          {anthemLoading && (
            <div className={styles.videoWrapMinimal}>
              <div className={`${styles.videoFrame} ${styles.skelVideo}`} />

              <div className={styles.skelText} />
            </div>
          )}
          {anthemError && (
            <div className={styles.empty}>응원가 영상 로드 실패</div>
          )}
          {!anthemLoading && !anthemError && !anthem && (
            <div className={styles.empty}>응원가 영상을 찾지 못했습니다.</div>
          )}

          {!anthemLoading && !anthemError && anthem && (
            <div className={styles.videoWrapMinimal}>
              <div className={styles.videoFrame}>
                {videoId ? (
                  <iframe
                    className={styles.iframeSmall}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={anthem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <a
                    className={styles.thumbLink}
                    href={anthem.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={anthem.thumbnail}
                      alt={anthem.title}
                      className={styles.thumb}
                    />
                  </a>
                )}
              </div>
              <div className={styles.videoMetaMinimal}>
                <a href={anthem.youtubeUrl} target="_blank" rel="noreferrer">
                  {anthem.title}
                </a>
              </div>
            </div>
          )}
        </aside>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>구장 위치</h2>
        <div className={styles.mapCard}>
          <MapContainer
            center={[team.lat, team.lng]}
            zoom={13}
            className={styles.miniMap}
            scrollWheelZoom={false}
            dragging={true}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
            />
            <Marker position={[team.lat, team.lng]} icon={logoDivIcon(logo)} />
          </MapContainer>

          <div className={styles.mapActions}>
            <a
              href={`https://maps.google.com/?q=${team.lat},${team.lng}`}
              target="_blank"
              rel="noreferrer"
              className={styles.openBtn}
            >
              Google 지도에서 열기
            </a>
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(
                team.stadium
              )}`}
              target="_blank"
              rel="noreferrer"
              className={styles.openBtn}
            >
              네이버 지도에서 열기
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.rosterHeader}>
          <h2 className={styles.sectionTitle}>선수 명단</h2>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${
                rosterTab === "P" ? styles.active : ""
              }`}
              onClick={() => setRosterTab("P")}
            >
              투수
            </button>
            <button
              className={`${styles.tabBtn} ${
                rosterTab === "H" ? styles.active : ""
              }`}
              onClick={() => setRosterTab("H")}
            >
              타자
            </button>
          </div>
        </div>

        {(pitchersLoading || hittersLoading) && (
          <div className={styles.skeleton}>로스터 불러오는 중…</div>
        )}
        {(pitchersError || hittersError) && (
          <div className={styles.empty}>로스터를 불러오지 못했습니다.</div>
        )}

        {rosterTab === "P" ? (
          <div className={styles.rosterTableWrap}>
            <table className={styles.rosterTable}>
              <thead>
                <tr>
                  <th className={styles.thName}>선수</th>
                  <th>등번호</th>
                  <th>포지션</th>
                  <th>주손</th>
                  <th>ERA</th>
                  <th>WHIP</th>
                  <th>SO</th>
                </tr>
              </thead>
              <tbody>
                {pitchers.map((p) => (
                  <tr key={`${p.name}-${p.backNumber}`}>
                    <td>
                      <div className={styles.playerCell}>
                        <img
                          src={playerImg[p.name] || "/fallback-player.png"}
                          onError={(e) =>
                            (e.currentTarget.src = "/fallback-player.png")
                          }
                          alt={p.name}
                        />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.backNumber}</td>
                    <td>{p.position}</td>
                    <td>{p.dominantHand}</td>
                    <td>{p.ERA}</td>
                    <td>{p.WHIP}</td>
                    <td>{p.SO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.rosterTableWrap}>
            <table className={styles.rosterTable}>
              <thead>
                <tr>
                  <th className={styles.thName}>선수</th>
                  <th>등번호</th>
                  <th>포지션</th>
                  <th>주손</th>
                  <th>AVG</th>
                  <th>OPS</th>
                  <th>HR</th>
                </tr>
              </thead>
              <tbody>
                {hitters.map((h) => (
                  <tr key={`${h.name}-${h.backNumber}`}>
                    <td>
                      <div className={styles.playerCell}>
                        <img
                          src={playerImg[h.name] || "/fallback-player.png"}
                          onError={(e) =>
                            (e.currentTarget.src = "/fallback-player.png")
                          }
                          alt={h.name}
                        />
                        <span>{h.name}</span>
                      </div>
                    </td>
                    <td>{h.backNumber}</td>
                    <td>{h.position}</td>
                    <td>{h.dominantHand}</td>
                    <td>{h.AVG}</td>
                    <td>{h.OPS}</td>
                    <td>{h.HR}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
