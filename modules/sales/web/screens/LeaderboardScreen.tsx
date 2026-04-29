import React, { useState } from "react";
import {
  Trophy,
  Medal,
  MapPin,
  Users,
  Award,
  TrendingUp,
  Building2,
  Crown,
  User,
  Filter,
} from "lucide-react";
import {
  useTopSellers,
  useTeamPerformance,
  formatVND,
} from "../hooks/useSalesData";
import { SkeletonLeaderboard, DateFilter } from "../components/shared";

// ═══════════════════════════════════════════════════════════
// LEADERBOARD SCREEN — Global Rankings
// Neo-Glassmorphism v2.2
// ═══════════════════════════════════════════════════════════

export function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<"sales" | "teams">("sales");
  const [dateRange, setDateRange] = useState<any>({ type: 'all', start: '', end: '' });
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");

  const { data: topSellers, loading: sellersLoading } = useTopSellers(50);
  const { data: topTeams, loading: teamsLoading } = useTeamPerformance();

  // Filter topSellers by team if selected
  const filteredSellers = React.useMemo(() => {
    if (!topSellers) return [];
    if (selectedTeamId === "all") return topSellers;
    // We map teamId from topTeams since TopSeller only has teamName.
    const selectedTeam = topTeams?.find(t => t.teamId === selectedTeamId);
    if (!selectedTeam) return topSellers;
    return topSellers.filter(s => s.teamName === selectedTeam.teamName);
  }, [topSellers, selectedTeamId, topTeams]);

  // Sort teams by GMV just in case hook doesn't
  const sortedTeams = [...(topTeams || [])].sort((a, b) => b.gmv - a.gmv);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-[#0a0a0a]">
      {/* ════ HEADER ════ */}
      <div className="px-6 lg:px-10 py-8 border-b border-slate-100 dark:border-sg-border/40 bg-white dark:bg-sg-card backdrop-blur-xl relative shrink-0 z-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy size={28} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-[28px] font-black text-sg-heading leading-tight tracking-tight">
                Bảng Xếp Hạng
              </h1>
              <p className="text-[13px] font-bold text-sg-muted mt-1">
                Đường đua doanh số SGroup Real Estate
              </p>
            </div>
          </div>

          {/* Tabs & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Time Filter */}
            <DateFilter onChange={(range, preset) => setDateRange({ ...range, preset })} />
            
            {activeTab === "sales" && (
              <div className="flex items-center gap-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-sg-border rounded-xl px-3 py-2 text-[13px] font-bold text-sg-heading">
                <Filter size={14} className="text-sg-muted" />
                <select 
                  className="bg-transparent outline-none cursor-pointer pr-4 appearance-none"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                  <option value="all">Tất cả Team</option>
                  {(topTeams || []).map(t => (
                    <option key={t.teamId} value={t.teamId}>{t.teamName}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex p-1.5 bg-sg-btn-bg border border-sg-border rounded-xl w-fit">
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-black transition-all ${
                  activeTab === "sales"
                    ? "bg-white dark:bg-sg-card text-amber-500 shadow-sm border border-sg-border/50"
                    : "text-sg-muted hover:text-sg-heading"
                }`}
              >
                <User size={16} /> Top Cá Nhân
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-black transition-all ${
                  activeTab === "teams"
                    ? "bg-white dark:bg-sg-card text-emerald-500 shadow-sm border border-sg-border/50"
                    : "text-sg-muted hover:text-sg-heading"
                }`}
              >
                <Users size={16} /> Top Phòng Ban
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════ CONTENT ════ */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TAB: TOP SALES */}
          {activeTab === "sales" && (
            <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-sg-max border border-slate-200/80 dark:border-sg-border p-6 lg:p-8 shadow-sg-lg sg-stagger">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[18px] font-black text-sg-heading flex items-center gap-2">
                  <Medal className="text-amber-500" size={20} /> Top Sales Xuất
                  Sắc
                </h2>
                <span className="text-[11px] font-bold text-sg-muted bg-sg-card/50 px-3 py-1 rounded-lg">
                  Cập nhật realtime
                </span>
              </div>

              {sellersLoading ? (
                <div className="space-y-4">
                  <SkeletonLeaderboard />
                  <SkeletonLeaderboard />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-sg-border/50">
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest">Tên</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest">Team</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">KPI</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Điểm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">% KPI Điểm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Kết Quả</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-right">Doanh Số</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Quan Tâm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">HG Tư Vấn</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">HG Trải Nghiệm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Giữ Chỗ</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Giao Dịch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSellers.map((seller, idx) => {
                          // Determine KPI based on date range duration
                          let kpi = 400; // Default to month
                          
                          if (dateRange && dateRange.from && dateRange.to) {
                            const diffDays = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24));
                            if (diffDays <= 7) {
                              kpi = 100;
                            } else if (diffDays <= 31) {
                              kpi = 400;
                            } else {
                              kpi = 1200;
                            }
                          } else if (dateRange && dateRange.preset) {
                            switch (dateRange.preset) {
                              case 'today':
                              case 'yesterday':
                              case 'this_week':
                              case 'last_week':
                                kpi = 100;
                                break;
                              case 'this_month':
                              case 'last_month':
                                kpi = 400;
                                break;
                              case 'this_quarter':
                              case 'all':
                              default:
                                kpi = 1200;
                                break;
                            }
                          }

                          const points = seller.activityPoints || 0;
                          const kpiPercent = (points / kpi) * 100;
                          const passed = kpiPercent >= 100;
                          
                          return (
                            <tr 
                              key={seller.staffId}
                              className="border-b border-slate-100 dark:border-sg-border/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors sg-stagger"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading whitespace-nowrap">
                                {seller.staffName}
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase whitespace-nowrap">
                                  {seller.teamName}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {kpi}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-black text-sg-heading text-center tabular-nums">
                                {points}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {kpiPercent.toFixed(1)}%
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-block px-2.5 py-1 rounded-md font-black text-[10px] uppercase whitespace-nowrap ${passed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'}`}>
                                  {passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[13px] font-black text-amber-600 dark:text-amber-400 text-right tabular-nums whitespace-nowrap">
                                {seller.gmv > 0 ? formatVND(seller.gmv) : '0'}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {seller.leads || 0}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {seller.meetings || 0}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {seller.visits || 0}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {seller.bookings || 0}
                              </td>
                              <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                                {seller.deals || 0}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredSellers.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-sg-muted">
                      <Trophy size={48} className="opacity-20 mb-4" />
                      <p className="text-[14px] font-bold">
                        Chưa có dữ liệu xếp hạng
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: TOP TEAMS */}
          {activeTab === "teams" && (
            <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-sg-max border border-slate-200/80 dark:border-sg-border p-6 lg:p-8 shadow-sg-lg sg-stagger">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[18px] font-black text-sg-heading flex items-center gap-2">
                  <Award className="text-emerald-500" size={20} /> Top Phòng Ban
                  Xuất Sắc
                </h2>
                <span className="text-[11px] font-bold text-sg-muted bg-sg-card/50 px-3 py-1 rounded-lg">
                  Cập nhật realtime
                </span>
              </div>

              {teamsLoading ? (
                <div className="space-y-4">
                  <SkeletonLeaderboard />
                  <SkeletonLeaderboard />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-sg-border/50">
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest">Team</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest">Leader</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Tổng Điểm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Tổng Doanh Số</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Quan Tâm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">HG Tư Vấn</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">HG Trải Nghiệm</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Giữ Chỗ</th>
                          <th className="py-4 px-4 text-[11px] font-black text-sg-muted uppercase tracking-widest text-center">Giao Dịch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedTeams.map((team, idx) => (
                          <tr 
                            key={team.teamId}
                            className="border-b border-slate-100 dark:border-sg-border/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors sg-stagger"
                            style={{ animationDelay: `${idx * 40}ms` }}
                          >
                            <td className="py-4 px-4">
                              <span className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[12px] uppercase whitespace-nowrap">
                                {team.teamName}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-[13px] font-bold text-sg-heading whitespace-nowrap">
                              {team.leaderName || 'Trống'}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-black text-sg-heading text-center tabular-nums">
                              {team.totalActivityPoints || 0}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-black text-emerald-600 dark:text-emerald-400 text-center tabular-nums whitespace-nowrap">
                              {team.gmv > 0 ? formatVND(team.gmv) : '0'}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                              {team.leads || 0}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                              {team.meetings || 0}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                              {team.visits || 0}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                              {team.bookings || 0}
                            </td>
                            <td className="py-4 px-4 text-[13px] font-bold text-sg-heading text-center tabular-nums">
                              {team.closedDeals || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {sortedTeams.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-sg-muted">
                      <Users size={48} className="opacity-20 mb-4" />
                      <p className="text-[14px] font-bold">
                        Chưa có dữ liệu phòng ban
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
