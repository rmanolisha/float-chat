"use client";

import { Bell, Search, Waves } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { LogoutButton } from "@/components/auth/logout-button";
import { GlassCard } from "@/components/ui/glass-card";

const titles: Record<string, string> = {
  "/dashboard": "Mission dashboard",
  "/chat": "Ocean copilot chat",
  "/visualization": "Profile visualization",
  "/upload": "NetCDF ingestion",
};

export function TopNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const title = titles[pathname] ?? "FloatChatAI";
  const username = session?.user?.name ?? "admin";

  return (
    <GlassCard className="mb-6 flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">FloatChatAI</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/55">Signed in as {username}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/55">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search floats, cycles, or regions</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
            <Waves className="h-4 w-4" />
            API live
          </div>
          <LogoutButton />
          <button className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white/70 transition hover:bg-white/[0.08] hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
