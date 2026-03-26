"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GlassCard } from "@/components/ui/glass-card";
import type { ProfileRecord } from "@/lib/types";

type OceanChartsProps = {
  profiles: ProfileRecord[];
};

function buildSeries(seed: number) {
  return Array.from({ length: 14 }, (_, index) => {
    const depth = index * 100;
    return {
      depth,
      temperature: Number((23 - index * 1.15 + Math.sin(seed + index / 2)).toFixed(2)),
      salinity: Number((34.7 + index * 0.08 + Math.cos(seed / 3 + index / 4) * 0.12).toFixed(2)),
    };
  });
}

export function OceanCharts({ profiles }: OceanChartsProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    profiles[0]?.id ?? null,
  );

  const selectedProfile =
    profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];

  const chartData = useMemo(
    () => buildSeries(selectedProfile?.cycle_number ?? 1),
    [selectedProfile?.cycle_number],
  );

  return (
    <div className="space-y-6">
      <GlassCard className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">Profile explorer</p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Temperature and salinity by depth
          </h2>
        </div>
        <select
          value={selectedProfile?.id ?? ""}
          onChange={(event) => setSelectedProfileId(Number(event.target.value))}
          className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none"
        >
          {profiles.map((profile) => (
            <option
              key={profile.id}
              value={profile.id}
              className="bg-slate-950"
            >
              Float {profile.float.platform_number} · Cycle {profile.cycle_number ?? "?"}
            </option>
          ))}
        </select>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-5">
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">Temperature vs depth</p>
            <p className="mt-1 text-sm text-white/55">
              Derived profile preview for UI analytics.
            </p>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tempFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7fffd4" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#7fffd4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="temperature" stroke="rgba(255,255,255,0.5)" />
                <YAxis
                  dataKey="depth"
                  reversed
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(7, 19, 45, 0.92)",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: 18,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#7fffd4"
                  fill="url(#tempFill)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">Salinity vs depth</p>
            <p className="mt-1 text-sm text-white/55">
              Interactive line chart tuned for ocean profile comparison.
            </p>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="salinity" stroke="rgba(255,255,255,0.5)" />
                <YAxis
                  dataKey="depth"
                  reversed
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(7, 19, 45, 0.92)",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: 18,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="salinity"
                  stroke="#39d0ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#39d0ff", strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
