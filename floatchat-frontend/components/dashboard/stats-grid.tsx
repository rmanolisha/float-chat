"use client";

import { motion } from "framer-motion";
import { Activity, Database, Radar } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { formatCompactNumber } from "@/lib/utils";

type StatsGridProps = {
  stats?: {
    total_floats: number;
    total_profiles: number;
    total_measurements: number;
  };
  loading: boolean;
};

const statItems = [
  { key: "total_floats", label: "Total Floats", icon: Radar, accent: "from-cyan-300 to-sky-500" },
  { key: "total_profiles", label: "Total Profiles", icon: Database, accent: "from-teal-300 to-emerald-500" },
  { key: "total_measurements", label: "Total Measurements", icon: Activity, accent: "from-sky-300 to-cyan-500" },
] as const;

export function StatsGrid({ stats, loading }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        const value = stats?.[item.key] ?? 0;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <GlassCard className="group relative overflow-hidden px-5 py-5">
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/50">
                    {item.label}
                  </p>
                  {loading ? (
                    <LoadingSkeleton className="mt-4 h-10 w-28" />
                  ) : (
                    <p className="mt-4 text-4xl font-semibold text-white">
                      {formatCompactNumber(value)}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-white/55">
                    Synced against live backend telemetry.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
