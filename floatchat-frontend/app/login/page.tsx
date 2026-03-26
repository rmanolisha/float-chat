"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="landing-ocean absolute inset-0" />
      <div className="glass-panel relative w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Secure access</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Login</h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Enter your operator credentials to continue into the FloatChatAI dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Username</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
              <UserRound className="h-4 w-4 text-white/45" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                placeholder="Enter username"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
              <LockKeyhole className="h-4 w-4 text-white/45" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                placeholder="Enter password"
              />
            </div>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}
