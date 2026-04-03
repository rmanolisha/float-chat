"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LockKeyhole, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="mt-8 space-y-4"
    >
      <label className="block">
        <span className="mb-2 block text-sm text-white/70">Username</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 shadow-[0_10px_35px_rgba(3,10,30,0.18)]">
          <UserRound className="h-4 w-4 text-white/45" />
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            placeholder="Enter username"
            autoComplete="username"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/70">Password</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 shadow-[0_10px_35px_rgba(3,10,30,0.18)]">
          <LockKeyhole className="h-4 w-4 text-white/45" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </div>
      </label>

      {error ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
        >
          {error}
        </motion.p>
      ) : null}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.995 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Enter Dashboard"}
      </motion.button>
    </motion.form>
  );
}
