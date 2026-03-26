"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

import { FloatTable } from "@/components/dashboard/float-table";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { fetchFloats, fetchProfiles, fetchStats } from "@/lib/api";
import type { DashboardStats, FloatRecord, ProfileRecord } from "@/lib/types";

const FloatMap = dynamic(
  () => import("@/components/dashboard/float-map").then((mod) => mod.FloatMap),
  {
    ssr: false,
    loading: () => <LoadingSkeleton className="h-[420px] w-full rounded-[28px]" />,
  },
);

export default function DashboardPage() {
  const [floats, setFloats] = useState<FloatRecord[]>([]);
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        const [floatsData, profilesData, statsData] = await Promise.all([
          fetchFloats(),
          fetchProfiles(),
          fetchStats(),
        ]);

        if (!mounted) {
          return;
        }

        setFloats(floatsData);
        setProfiles(profilesData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message = axios.isAxiosError(err)
          ? err.message
          : "Unable to load dashboard data.";
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} loading={loading} />

      {error ? (
        <GlassCard className="p-5 text-sm text-rose-100">
          Unable to reach the backend. {error}
        </GlassCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <FloatTable floats={floats} profiles={profiles} loading={loading} />
        <FloatMap profiles={profiles} />
      </div>
    </div>
  );
}
