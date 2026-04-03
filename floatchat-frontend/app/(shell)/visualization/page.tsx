"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { OceanCharts } from "@/components/visualization/ocean-charts";
import { GlassCard } from "@/components/ui/glass-card";
import { fetchProfiles } from "@/lib/api";
import type { ProfileRecord } from "@/lib/types";

export default function VisualizationPage() {
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfiles() {
      try {
        setLoading(true);
        const data = await fetchProfiles();
        if (!mounted) {
          return;
        }

        setProfiles(data.filter((profile) => profile.measurements.length > 0).slice(0, 12));
        setError(null);
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message = axios.isAxiosError(err)
          ? err.message
          : "Unable to load profile measurements.";
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProfiles();

    function handleDatasetRefresh() {
      void loadProfiles();
    }

    window.addEventListener("floatchat:dataset-reloaded", handleDatasetRefresh);
    return () => {
      mounted = false;
      window.removeEventListener("floatchat:dataset-reloaded", handleDatasetRefresh);
    };
  }, []);

  if (error) {
    return <GlassCard className="p-6 text-rose-100">{error}</GlassCard>;
  }

  if (loading) {
    return (
      <GlassCard className="p-6 text-white/70">
        Loading live profile measurements...
      </GlassCard>
    );
  }

  if (!profiles.length) {
    return (
      <GlassCard className="p-6 text-white/70">
        Upload a NetCDF file with measurements to unlock real profile charts.
      </GlassCard>
    );
  }

  return (
    <OceanCharts
      key={profiles.map((profile) => `${profile.id}-${profile.source_file}`).join("|")}
      profiles={profiles}
    />
  );
}
