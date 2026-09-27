import { cn } from "./ui/utils";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles = {
    low: "bg-green-100 text-green-800 border-green-300",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    critical: "bg-red-100 text-red-800 border-red-300",
  };

  const labels = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    critical: "Critical Risk",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs border",
        styles[level],
        className
      )}
    >
      {labels[level]}
    </span>
  );
}
