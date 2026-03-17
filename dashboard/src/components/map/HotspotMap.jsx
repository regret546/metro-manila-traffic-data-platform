import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function colorForIntensity(intensity) {
  if (intensity >= 0.85) return "#ef4444"; // red
  if (intensity >= 0.7) return "#f97316"; // orange
  if (intensity >= 0.55) return "#eab308"; // yellow
  return "#22c55e"; // green
}

export default function HotspotMap({ hotspots }) {
  const center = useMemo(() => [14.5995, 120.9842], []);

  return (
    <div className="h-[260px] overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "260px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotspots.map((p) => {
          const fillColor = colorForIntensity(p.intensity);
          const radius = 10 + Math.round(p.intensity * 12);
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={radius}
              pathOptions={{
                color: fillColor,
                fillColor,
                fillOpacity: 0.35,
                weight: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                {p.label}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

