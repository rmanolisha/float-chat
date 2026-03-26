import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, Waves } from "lucide-react";

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="landing-ocean absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.1),_transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-teal-300 to-sky-500 text-slate-950 shadow-[0_12px_30px_rgba(57,208,255,0.35)]">
              <Waves className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white">FloatChatAI</p>
              <p className="text-sm text-cyan-100/65">ARGO intelligence workspace</p>
            </div>
          </div>

          <div className="text-sm text-cyan-100/55">Ocean intelligence workspace</div>
        </header>

        <section className="flex flex-1 items-center py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100">
                <ChartNoAxesCombined className="h-4 w-4" />
                Premium ocean analytics
              </div>
              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                FloatChatAI
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                A high-end control center for ARGO float ingestion, ocean profile exploration,
                live geospatial monitoring, and AI-assisted analysis.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 px-7 py-4 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(57,208,255,0.32)] transition hover:scale-[1.01]"
                >
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-7 py-4 text-sm font-medium text-white transition hover:bg-white/[0.12]"
                >
                  Upload NetCDF
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="glass-panel p-6">
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Operational snapshot</p>
                  <div className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
                    Live API
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Dashboard", value: "Fleet, map, stats" },
                    { label: "Chat", value: "AI-guided exploration" },
                    { label: "Visualization", value: "Depth analytics" },
                    { label: "Upload", value: "NetCDF ingestion" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/55">
                        {item.label}
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-6">
                <div className="ocean-wave h-48 rounded-[24px]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
