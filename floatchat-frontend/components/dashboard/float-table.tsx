"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import type { FloatRecord, ProfileRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type FloatTableProps = {
  floats: FloatRecord[];
  profiles: ProfileRecord[];
  loading: boolean;
};

export function FloatTable({ floats, profiles, loading }: FloatTableProps) {
  const profileCountByFloat = new Map<number, number>();

  profiles.forEach((profile) => {
    profileCountByFloat.set(
      profile.float_id,
      (profileCountByFloat.get(profile.float_id) ?? 0) + 1,
    );
  });

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">Fleet registry</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Active float inventory</h2>
        </div>
        <p className="text-sm text-white/55">{floats.length} floats indexed</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.24em] text-white/45">
              <th className="px-5 py-4 font-medium">Platform</th>
              <th className="px-5 py-4 font-medium">Project</th>
              <th className="px-5 py-4 font-medium">Principal Investigator</th>
              <th className="px-5 py-4 font-medium">Profiles</th>
              <th className="px-5 py-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b border-white/6">
                    <td className="px-5 py-4">
                      <LoadingSkeleton className="h-5 w-28" />
                    </td>
                    <td className="px-5 py-4">
                      <LoadingSkeleton className="h-5 w-32" />
                    </td>
                    <td className="px-5 py-4">
                      <LoadingSkeleton className="h-5 w-36" />
                    </td>
                    <td className="px-5 py-4">
                      <LoadingSkeleton className="h-5 w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <LoadingSkeleton className="h-5 w-24" />
                    </td>
                  </tr>
                ))
              : floats.map((float, index) => (
                  <motion.tr
                    key={float.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-white/6 text-sm text-white/75 transition hover:bg-white/[0.035]"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-white">{float.platform_number}</p>
                        <p className="mt-1 text-xs text-white/45">Float ID #{float.id}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{float.project_name ?? "Unknown project"}</td>
                    <td className="px-5 py-4">{float.pi_name ?? "Unknown PI"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                        {profileCountByFloat.get(float.id) ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/55">{formatDate(float.updated_at)}</td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
