"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Layers,
  Users,
  Activity,
  ShieldCheck,
  Target,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { getDashboardStats, getTotalStatusBreakdown } from "@/lib/projectApi";
import type { DashboardStats, StatusCount } from "@/lib/types";
import { PRODUCT_STATUS_MAP } from "@/lib/types";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [breakdown, setBreakdown] = useState<StatusCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats().catch(() => null),
      getTotalStatusBreakdown().catch(() => []),
    ]).then(([s, b]) => {
      setStats(s);
      setBreakdown(b || []);
      setLoading(false);
    });
  }, []);

  const absorptionRate =
    stats && stats.totalProducts > 0
      ? ((stats.soldProducts / stats.totalProducts) * 100).toFixed(1)
      : stats?.absorptionRate?.toString() ?? "0";

  return (
    <div className="max-w-7xl mx-auto antialiased">
      {/* ────────────── Hero Section ────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-blue-400/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white leading-none">
              Bảng Điều Hành Dự Án
            </h1>
            <p className="text-emerald-400 mt-1.5 flex items-center font-bold text-sm bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
              <Activity className="w-4 h-4 mr-2" />
              Trung tâm Dữ liệu Chính — Quản lý Bất Động Sản
            </p>
          </div>
        </div>
      </div>

      {/* ────────────── KPI Cards ────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-[160px]">
              <div className="w-11 h-11 rounded-2xl bg-white/5 mb-5" />
              <div className="h-3 bg-white/5 rounded w-24 mb-3" />
              <div className="h-7 bg-white/5 rounded w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              icon={<Building2 className="w-5 h-5" />}
              label="Tổng Dự Án"
              value={stats?.totalProjects ?? 0}
              subtitle={`${stats?.activeProjects ?? 0} đang mở bán`}
              color="text-blue-400"
              borderColor="border-blue-500/30"
              glowColor="bg-blue-500/10"
              trend={{ value: 12, isUp: true }}
            />
            <StatCard
              icon={<Layers className="w-5 h-5" />}
              label="Tổng Sản Phẩm"
              value={stats?.totalProducts ?? 0}
              subtitle={`${stats?.soldProducts ?? 0} đã bán thành công`}
              color="text-emerald-400"
              borderColor="border-emerald-500/30"
              glowColor="bg-emerald-500/10"
              trend={{ value: 8, isUp: true }}
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Tỷ Lệ Hấp Thụ"
              value={`${absorptionRate}%`}
              subtitle="Đã bán / Tổng số căn trong kho"
              color="text-amber-400"
              borderColor="border-amber-500/30"
              glowColor="bg-amber-500/10"
              trend={{ value: 5, isUp: true }}
            />
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Doanh Thu Dự Kiến"
              value={`${(stats?.totalRevenue ?? 0).toLocaleString("vi-VN")} Tỷ`}
              subtitle="Giá trung bình × Số căn đã bán"
              color="text-purple-400"
              borderColor="border-purple-500/30"
              glowColor="bg-purple-500/10"
              trend={{ value: 15, isUp: true }}
            />
          </>
        )}
      </div>

      {/* ────────────── Cơ Cấu Kho Hàng ────────────── */}
      {breakdown.length > 0 && (
        <div className="glass-card rounded-3xl p-8 mb-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Cơ Cấu Trạng Thái Kho Hàng Toàn Hệ Thống
          </h3>

          {/* Visual Bar Chart */}
          <div className="flex gap-1 h-5 rounded-full overflow-hidden mb-5 border border-white/10 relative z-10">
            {breakdown.map((b) => {
              const total = breakdown.reduce((a, c) => a + c.count, 0);
              const pct = total > 0 ? (b.count / total) * 100 : 0;
              const config = (
                PRODUCT_STATUS_MAP as Record<string, { label: string; color: string; bg: string; border: string }>
              )[b.status];
              const barColor =
                config?.color.replace("text-", "bg-").replace(" dark:text-", " dark:bg-") ?? "bg-slate-500";
              return (
                <div
                  key={b.status}
                  className={`${barColor} transition-all duration-500 first:rounded-l-full last:rounded-r-full opacity-70 hover:opacity-100`}
                  style={{ width: `${pct}%` }}
                  title={`${config?.label ?? b.status}: ${b.count} căn (${pct.toFixed(0)}%)`}
                />
              );
            })}
          </div>

          {/* Legend Pills */}
          <div className="flex gap-3 flex-wrap relative z-10">
            {breakdown.map((b) => {
              const config = (
                PRODUCT_STATUS_MAP as Record<string, { label: string; color: string; bg: string; border: string }>
              )[b.status];
              return (
                <div
                  key={b.status}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border backdrop-blur-sm shadow-inner ${
                    config?.bg.replace("bg-", "bg-").replace(" dark:", " ") ?? "bg-slate-500/10"
                  } ${config?.border ?? "border-slate-500/20"}`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      config?.color.replace("text-", "bg-") ?? "bg-slate-400"
                    }`}
                  />
                  <span className="text-sm font-bold text-slate-300">{config?.label || b.status}</span>
                  <span className="text-sm font-black text-white">{b.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ────────────── Lối Tắt Nghiệp Vụ ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/projects" className="group">
          <div className="glass-card rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 h-full border border-white/10 relative overflow-hidden hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] hover:border-blue-500/30">
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-blue-500/20 shadow-inner relative z-10">
              <Building2 className="text-blue-400 w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white mb-2 relative z-10 tracking-tight">Mở Rổ Hàng Trực Tiếp</h2>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed relative z-10 font-medium">
              Xem danh sách, tạo mới và quản lý toàn bộ các dự án bất động sản đang triển khai.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors relative z-10">
              Mở danh sách{" "}
              <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </div>
        </Link>

        <div className="glass-card rounded-3xl p-7 border border-dashed border-white/10 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/20 shadow-inner relative z-10">
            <Plus className="text-emerald-400 w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white mb-2 relative z-10 tracking-tight">Thiết Lập Dự Án Mới</h2>
          <p className="text-slate-400 text-sm mb-5 leading-relaxed relative z-10 font-medium">
            Khởi tạo bảng hàng, thiết lập dữ liệu gốc và cấu hình chính sách giá cho dự án mới.
          </p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-bold hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] transition-all active:scale-95 inline-block relative z-10"
          >
            Khởi tạo bảng hàng
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-7 border border-white/10 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-purple-500/20 shadow-inner relative z-10">
            <Target className="text-purple-400 w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white mb-2 relative z-10 tracking-tight">Báo Cáo & Phân Tích</h2>
          <p className="text-slate-400 text-sm mb-5 leading-relaxed relative z-10 font-medium">
            Xem báo cáo doanh số, tỷ lệ hấp thụ và hiệu suất bán hàng theo từng dự án.
          </p>
          <span className="text-sm font-bold text-slate-500 relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Sắp ra mắt
          </span>
        </div>
      </div>
    </div>
  );
}
