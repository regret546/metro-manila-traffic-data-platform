import React from "react";
import HotspotMap from "./HotspotMap";

// Keep implementation simple for V1: markers act as "hotspots".
export default function IncidentHeatmap({ hotspots }) {
  return <HotspotMap hotspots={hotspots} />;
}

