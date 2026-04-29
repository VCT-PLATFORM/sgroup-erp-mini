import React from 'react';
import {
  Phone, Users, Target, Building2, BookmarkPlus, ShieldCheck,
  Award, TrendingUp, ArrowRight, Medal, UserCheck, BarChart3
} from 'lucide-react';
import { useActivityDashboard, FunnelTotals } from '../../hooks/useActivityDashboard';
import { SkeletonKPICard } from '../../components/shared';

// ═══════════════════════════════════════════════════════════
// DIRECTOR DASHBOARD — Company-wide KPIs from Activity Log
// ═══════════════════════════════════════════════════════════

const FUNNEL_STEPS: { key: keyof FunnelTotals; label: string; icon: React.ReactNode; color: string; bg: string; border: string; barColor: string }[] = [
  { key: 'calls',    label: 'Cuộc Gọi',     icon: <Phone size={18} />,        color: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    barColor: 'bg-blue-500' },
  { key: 'leads',    label: 'Quan Tâm',      icon: <Users size={18} />,        color: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   barColor: 'bg-amber-500' },
  { key: 'meetings', label: 'Tư Vấn',        icon: <Target size={18} />,       color: 'text-violet-500',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  barColor: 'bg-violet-500' },
  { key: 'visits',   label: 'Trải Nghiệm',   icon: <Building2 size={18} />,    color: 'text-indigo-500',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  barColor: 'bg-indigo-500' },
  { key: 'bookings', label: 'Giữ Chỗ',       icon: <BookmarkPlus size={18} />, color: 'text-pink-500',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    barColor: 'bg-pink-500' },
  { key: 'deposits', label: 'Đặt Cọc',       icon: <ShieldCheck size={18} />,  color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', barColor: 'bg-emerald-500' },
];

export function DirectorDashboard() {
  const { totals, todayTotals, conversions, staffRanking, teamRanking, totalStaff, loading } = useActivityDashboard();

  const maxVal = Math.max(...FUNNEL_STEPS.map(s => totals[s.key] as number), 1);
  const maxTeamPoints = Math.max(...teamRanking.map(t => t.points), 1);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* ══════ HEADER ══════ */}
      <div className="flex items-center justify-between sg-stagger" style={{ animationDelay: '0ms' }}>
        <h2 className="text-[20px] font-black text-sg-heading">Dashboard Giám Đốc Kinh Doanh</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[12px] font-black">
          Toàn Công Ty • {totalStaff} NS
        </div>
      </div>

      {/* ══════ 6 KPI CARDS ══════ */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonKPICard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {FUNNEL_STEPS.map((step, idx) => {
            const monthVal = totals[step.key] as number;
            const todayVal = todayTotals[step.key] as number;
            return (
              <div key={step.key}
                className="relative overflow-hidden bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[20px] border border-slate-200/80 dark:border-sg-border p-5 shadow-sg-sm hover:shadow-sg-md hover:-translate-y-0.5 transition-all sg-stagger"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full ${step.bg} blur-2xl opacity-40`} />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                    <span className={step.color}>{step.icon}</span>
                  </div>
                  {todayVal > 0 && (
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      +{todayVal} hôm nay
                    </span>
                  )}
                </div>
                <p className={`text-[28px] font-black ${step.color} leading-none relative z-10`}>{monthVal}</p>
                <p className="text-[11px] font-bold text-sg-muted uppercase tracking-wider mt-1.5">{step.label} CTy</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════ POINTS + STAFF HERO ══════ */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-[24px] p-5 text-white shadow-xl shadow-purple-500/20 sg-stagger" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center gap-3 mb-2">
              <Award size={22} />
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Tổng Điểm Công Ty</p>
            </div>
            <p className="text-[32px] font-black leading-none">{totals.points}</p>
            <p className="text-[11px] opacity-70 mt-1">TB: {totalStaff > 0 ? (totals.points / totalStaff).toFixed(1) : 0} điểm/người • {teamRanking.length} phòng ban</p>
          </div>
          <div className="bg-white dark:bg-black/30 rounded-[24px] border border-slate-200/80 dark:border-sg-border p-5 shadow-sg-sm sg-stagger" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-2">
              <UserCheck size={22} className="text-blue-500" />
              <p className="text-[11px] font-bold text-sg-muted uppercase tracking-wider">Nhân Sự Active</p>
            </div>
            <p className="text-[32px] font-black text-blue-500 leading-none">{totalStaff}</p>
            <p className="text-[11px] text-sg-muted mt-1">trên {teamRanking.length} phòng ban</p>
          </div>
        </div>
      )}

      {/* ══════ 3 COLUMNS: FUNNEL + TEAM RANKING + TOP SALES ══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Phễu Toàn Công Ty */}
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger flex flex-col" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-500" />
            </div>
            <h3 className="text-[14px] font-black text-sg-heading">Phễu Toàn CTy</h3>
          </div>

          {!loading && (
            <div className="space-y-3 flex-1">
              {FUNNEL_STEPS.map((step) => {
                const val = totals[step.key] as number;
                const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                return (
                  <div key={step.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold ${step.color}`}>{step.label}</span>
                      <span className="text-[12px] font-black text-sg-heading">{val}</span>
                    </div>
                    <div className="h-2.5 bg-sg-btn-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${step.barColor} transition-all duration-1000`}
                        style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 mt-3 border-t border-sg-border/30 space-y-1.5">
                <p className="text-[9px] font-black text-sg-muted uppercase tracking-widest mb-1">Chuyển Đổi</p>
                {[
                  { label: 'QT→TV', value: conversions.leadsToMeetings },
                  { label: 'TV→TN', value: conversions.meetingsToVisits },
                  { label: 'TN→GC', value: conversions.visitsToBookings },
                  { label: 'GC→ĐC', value: conversions.bookingsToDeposits },
                ].map(c => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sg-muted">{c.label}</span>
                    <span className={`text-[11px] font-black ${c.value > 30 ? 'text-emerald-500' : c.value > 0 ? 'text-amber-500' : 'text-sg-muted'}`}>
                      {c.value.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Xếp Hạng Phòng Ban */}
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger flex flex-col" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Medal size={18} className="text-orange-500" />
            </div>
            <h3 className="text-[14px] font-black text-sg-heading">Xếp Hạng Phòng Ban</h3>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {teamRanking.map((team, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const pct = maxTeamPoints > 0 ? (team.points / maxTeamPoints) * 100 : 0;
              return (
                <div key={team.teamName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] w-6">{medals[i] || `#${i + 1}`}</span>
                      <div>
                        <p className="text-[13px] font-bold text-sg-heading">{team.teamName}</p>
                        <p className="text-[10px] text-sg-muted">{team.staffCount} NS · {team.bookings} GC · {team.deposits} ĐC</p>
                      </div>
                    </div>
                    <span className="text-[14px] font-black text-amber-500">{team.points}pts</span>
                  </div>
                  <div className="h-2 bg-sg-btn-bg rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-linear-to-r from-orange-400 to-amber-500 transition-all duration-1000"
                      style={{ width: `${Math.max(pct, 5)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Nhân Sự Toàn CTy */}
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger flex flex-col" style={{ animationDelay: '450ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Award size={18} className="text-purple-500" />
            </div>
            <h3 className="text-[14px] font-black text-sg-heading">Top Nhân Sự CTy</h3>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {staffRanking.slice(0, 10).map((s, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={s.staffId} className="p-2.5 rounded-xl border border-sg-border/50 bg-sg-card/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] w-5 text-center">{medals[i] || `#${i + 1}`}</span>
                    <div>
                      <p className="text-[12px] font-bold text-sg-heading">{s.staffName}</p>
                      <p className="text-[9px] text-sg-muted">{s.teamName} · {s.bookings}GC {s.deposits}ĐC</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-black text-amber-500">{s.points}pts</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════ SO SÁNH PHÒNG BAN — Stacked Bars ══════ */}
      {!loading && teamRanking.length > 0 && (
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger" style={{ animationDelay: '550ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <BarChart3 size={18} className="text-indigo-500" />
            </div>
            <h3 className="text-[15px] font-black text-sg-heading">So Sánh Phòng Ban</h3>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {FUNNEL_STEPS.map(step => (
              <div key={step.key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${step.barColor}`} />
                <span className="text-[10px] font-bold text-sg-muted">{step.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {teamRanking.map((team) => {
              const teamTotal = team.calls + team.leads + team.meetings + team.visits + team.bookings + team.deposits;
              const maxTotal = Math.max(...teamRanking.map(t => t.calls + t.leads + t.meetings + t.visits + t.bookings + t.deposits), 1);
              const widthPct = (teamTotal / maxTotal) * 100;
              return (
                <div key={team.teamName}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-sg-heading">{team.teamName}</span>
                    <span className="text-[11px] font-black text-sg-muted">{teamTotal} hoạt động</span>
                  </div>
                  <div className="h-6 bg-sg-btn-bg rounded-lg overflow-hidden flex" style={{ width: `${Math.max(widthPct, 10)}%` }}>
                    {FUNNEL_STEPS.map(step => {
                      const val = team[step.key] as number;
                      const segPct = teamTotal > 0 ? (val / teamTotal) * 100 : 0;
                      if (segPct < 1) return null;
                      return (
                        <div key={step.key} className={`${step.barColor} h-full flex items-center justify-center text-[8px] font-black text-white`}
                          style={{ width: `${segPct}%` }} title={`${step.label}: ${val}`}>
                          {segPct > 10 && val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
