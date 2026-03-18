import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function InvalidateOnResize({ dep }) {
  const map = useMap();
  useEffect(() => {
    // Leaflet sometimes renders with a zero/incorrect size when placed inside responsive layouts.
    map.invalidateSize();
  }, [map, dep]);
  return null;
}

function ZoomLevelTracker({ onChange }) {
  const map = useMap();
  useEffect(() => {
    const update = () => onChange(map.getZoom());
    update();
    map.on("zoomend", update);
    return () => {
      map.off("zoomend", update);
    };
  }, [map, onChange]);
  return null;
}

function colorForIntensity(intensity) {
  if (intensity >= 0.85) return "#ef4444"; // red
  if (intensity >= 0.7) return "#f97316"; // orange
  if (intensity >= 0.55) return "#eab308"; // yellow
  return "#22c55e"; // green
}

export default function HotspotMap({ hotspots, height = 320 }) {
  const [zoomLevel, setZoomLevel] = useState(11);

  const center = useMemo(() => {
    if (!Array.isArray(hotspots) || hotspots.length === 0) return [14.5995, 120.9842];
    const valid = hotspots.filter((p) => typeof p?.lat === "number" && typeof p?.lng === "number");
    if (valid.length === 0) return [14.5995, 120.9842];
    const avgLat = valid.reduce((acc, p) => acc + p.lat, 0) / valid.length;
    const avgLng = valid.reduce((acc, p) => acc + p.lng, 0) / valid.length;
    return [avgLat, avgLng];
  }, [hotspots]);

  const plotted = useMemo(() => {
    if (!Array.isArray(hotspots) || hotspots.length === 0) return [];
    const TOP = 140;
    const total = hotspots.length;
    // Keep map readable: render highest-intensity points first.
    const sorted = hotspots
      .filter((p) => typeof p?.lat === "number" && typeof p?.lng === "number")
      .map((p) => ({
        id: p.id ?? `${p.lat},${p.lng}`,
        lat: p.lat,
        lng: p.lng,
        label: p.label ?? p.baseLabel ?? "Unknown",
        intensity: typeof p?.intensity === "number" && Number.isFinite(p.intensity) ? p.intensity : 0.2,
        _total: total,
      }))
      .sort((a, b) => (b.intensity || 0) - (a.intensity || 0));

    return sorted.slice(0, TOP);
  }, [hotspots]);

  return (
    <div className="relative overflow-hidden rounded-xl" style={{ height }}>
      <div className="pointer-events-none absolute left-3 top-2 z-[1000] rounded-md bg-[rgba(255,255,255,0.85)] px-2 py-1 text-[11px] text-fg/60">
        Hotspots: {plotted.length}
      </div>
      <MapContainer
        key={`hm-${plotted.length}`}
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height, width: "100%" }}
      >
        <InvalidateOnResize dep={plotted.length} />
        <ZoomLevelTracker onChange={setZoomLevel} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {plotted.map((p) => {
          const fillColor = colorForIntensity(p.intensity);
          // Leaflet CircleMarker is sized in pixels (not map meters), so when the user zooms out
          // the “heat” can become too subtle. Scale radius/opacity inversely with zoom.
          const zoomFactor = Math.max(0.7, Math.min(2.0, 12 / Math.max(6, zoomLevel)));
          const radius = (4 + (p.intensity ?? 0.2) * 10) * zoomFactor;
          const fillOpacity = 0.18 + (p.intensity ?? 0.2) * 0.55;
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={radius}
              pathOptions={{
                color: fillColor,
                fillColor,
                fillOpacity,
                stroke: true,
                weight: 1,
                opacity: Math.min(0.8, fillOpacity + 0.1),
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

