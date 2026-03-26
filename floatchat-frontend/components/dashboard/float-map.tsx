"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import { GlassCard } from "@/components/ui/glass-card";
import type { ProfileRecord } from "@/lib/types";

type FloatMapProps = {
  profiles: ProfileRecord[];
};

const fallbackCenter: [number, number] = [14.3, 73.8];

export function FloatMap({ profiles }: FloatMapProps) {
  const points = profiles.filter(
    (profile) => profile.latitude !== null && profile.longitude !== null,
  );

  const center = points[0]
    ? ([points[0].latitude as number, points[0].longitude as number] as [number, number])
    : fallbackCenter;

  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">Geospatial layer</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Global float distribution</h2>
      </div>
      <div className="h-[420px]">
        <MapContainer
          center={center}
          zoom={3}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((profile) => (
            <CircleMarker
              key={profile.id}
              center={[profile.latitude as number, profile.longitude as number]}
              radius={8}
              pathOptions={{
                color: "#7fffd4",
                fillColor: "#39d0ff",
                fillOpacity: 0.65,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">
                    Float {profile.float.platform_number}
                  </p>
                  <p>Cycle: {profile.cycle_number ?? "Unknown"}</p>
                  <p>
                    Lat/Lon: {profile.latitude?.toFixed(2)}, {profile.longitude?.toFixed(2)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </GlassCard>
  );
}
