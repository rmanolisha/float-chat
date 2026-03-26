"use client";

import { useEffect, useState } from "react";

import { OceanCharts } from "@/components/visualization/ocean-charts";
import { GlassCard } from "@/components/ui/glass-card";
import { fetchProfiles } from "@/lib/api";
import type { ProfileRecord } from "@/lib/types";

export default function VisualizationPage() {
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);

  useEffect(() => {
    void fetchProfiles().then((data) => setProfiles(data.slice(0, 12)));
  }, []);

  if (!profiles.length) {
    return (
      <GlassCard className="p-6 text-white/70">
        Upload data to unlock the depth analytics workspace.
      </GlassCard>
    );
  }

  return <OceanCharts profiles={profiles} />;
}
