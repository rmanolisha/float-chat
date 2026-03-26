"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, MessageSquareText, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquareText },
  { href: "/visualization", label: "Visualization", icon: BarChart3 },
  { href: "/upload", label: "Upload", icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <GlassCard className="sticky top-6 overflow-hidden p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-teal-300 to-sky-500 text-slate-950 shadow-[0_12px_30px_rgba(14,216,255,0.35)]">
          <span className="text-lg font-black">F</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200/80">
            FloatChatAI
          </p>
          <p className="text-xs text-white/45">Ocean intelligence console</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border px-4 py-3 transition-all",
                  active
                    ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                    : "border-transparent bg-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
                )}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {active ? (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 via-cyan-300/8 to-transparent"
                  />
                ) : null}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/30 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/60">System</p>
        <p className="mt-3 text-sm font-medium text-white">Backend connected</p>
        <p className="mt-1 text-sm text-white/55">
          Live ingestion, profile indexing, and geospatial analytics.
        </p>
      </div>
    </GlassCard>
  );
}
