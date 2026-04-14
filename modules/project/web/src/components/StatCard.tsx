"use client";

import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isUp: boolean };
  color?: string; // tailwind text color class
};

export function StatCard({ icon, label, value, subtitle, trend, color = "text-blue-500 dark:text-blue-400" }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5 group transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace("text-", "bg-")}/10`}>
          <span className={color}>{icon}</span>
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isUp ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{typeof value === "number" ? value.toLocaleString("vi-VN") : value}</p>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
