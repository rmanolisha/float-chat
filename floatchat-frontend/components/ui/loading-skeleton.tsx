import { cn } from "@/lib/utils";

export function LoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}
