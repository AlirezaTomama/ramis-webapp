import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
}: KPICardProps) {
  const variantStyles = {
    default: "border-gray-200",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    danger: "border-red-200 bg-red-50",
  };

  const trendColors = {
    up: "text-red-600",
    down: "text-green-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className={`p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl mt-1 text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <p className={`text-xs mt-2 ${trendColors[trend]}`}>
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="ml-3">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
    </Card>
  );
}
