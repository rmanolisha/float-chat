import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="landing-ocean absolute inset-0" />
      <div className="glass-panel relative w-full max-w-md overflow-hidden p-8">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Secure access</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Login</h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Enter your operator credentials to continue into the FloatChatAI dashboard.
        </p>
        <LoginForm />
        <p className="mt-4 text-xs text-white/45">
          Demo credentials: <span className="text-white/65">admin / admin</span>
        </p>
      </div>
    </main>
  );
}
