"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";

import type { ToastItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<NonNullable<ToastItem["tone"]>, string> = {
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  error: "border-rose-400/30 bg-rose-400/10 text-rose-100",
  info: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
};

const toneIcon = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    const nextToast: ToastItem = { id, tone: "info", ...toast };
    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3800);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toneIcon[toast.tone ?? "info"];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={cn(
                  "pointer-events-auto rounded-3xl border px-4 py-3 shadow-[0_18px_60px_rgba(3,12,32,0.45)] backdrop-blur-2xl",
                  toneStyles[toast.tone ?? "info"],
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm text-white/70">{toast.description}</p>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
