import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import styles from "./teamsPage.module.css";
import teamLogos from "../assets/team-logo";
import { TEAMS } from "../data/teams";

const makeIcon = (logoUrl: string) =>
  L.icon({
    iconUrl: logoUrl,
    iconSize: [40, 40],
    className: styles.logoIcon,
  });

function FitAllTeams({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();
  const bounds = useMemo(
    () =>
      L.latLngBounds(points.map((p) => [p.lat, p.lng]) as [number, number][]),
    [points]
  );
  React.useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, bounds, points]);
  return null;
}

export default function TeamsPage() {
  const nav = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>구단</h1>

      <div className={styles.mapBar}>
        <MapContainer className={styles.map} center={[36.5, 127.8]} zoom={7}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles © Esri"
          />

          {TEAMS.map((team) => {
            const logo = teamLogos[team.name];
            return (
              <Marker
                key={team.id}
                position={[team.lat, team.lng]}
                icon={makeIcon(logo)}
                eventHandlers={{ click: () => nav(`/teams/${team.id}`) }}
              >
                <Popup>
                  <strong>{team.name}</strong>
                  <br />
                  {team.stadium}
                  <br />
                  <Link to={`/teams/${team.id}`}>상세 보기</Link>
                </Popup>
              </Marker>
            );
          })}

          <FitAllTeams points={TEAMS.map(({ lat, lng }) => ({ lat, lng }))} />
        </MapContainer>
      </div>

      <div className={styles.logoStrip} role="list">
        {TEAMS.map((team) => (
          <button
            key={team.id}
            role="listitem"
            className={styles.logoItem}
            onClick={() => nav(`/teams/${team.id}`)}
            title={team.name}
          >
            <img
              src={teamLogos[team.name]}
              alt={team.name}
              className={styles.logoImg}
            />
            <span className={styles.logoLabel}>{team.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
