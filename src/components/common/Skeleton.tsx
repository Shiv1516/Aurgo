import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rectangle" | "circle";
  shimmer?: boolean;
}

export default function Skeleton({
  className,
  variant = "rectangle",
  shimmer = true,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-gray-200/60",
        shimmer && "skeleton-shimmer",
        variant === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
    />
  );
}
