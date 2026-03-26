import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/12 bg-white/[0.07] shadow-[0_18px_80px_rgba(4,14,40,0.35)] backdrop-blur-2xl",
        className,
      )}
      {...props}
    />
  );
}
