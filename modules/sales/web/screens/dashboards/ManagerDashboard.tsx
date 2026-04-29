import React from 'react';
import {
  Phone, Users, Target, Building2, BookmarkPlus, ShieldCheck,
  Award, TrendingUp, ArrowRight, Medal, UserCheck
} from 'lucide-react';
import { useActivityDashboard, FunnelTotals } from '../../hooks/useActivityDashboard';
import { SkeletonKPICard } from '../../components/shared';

// ═══════════════════════════════════════════════════════════
// MANAGER DASHBOARD — Team KPIs from Activity Log
// ═══════════════════════════════════════════════════════════

const FUNNEL_STEPS: { key: keyof FunnelTotals; label: string; icon: React.ReactNode; color: string; bg: string; border: string; barColor: string }[] = [
  { key: 'calls',    label: 'Cuộc Gọi',     icon: <Phone size={18} />,        color: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    barColor: 'bg-blue-500' },
  { key: 'leads',    label: 'Quan Tâm',      icon: <Users size={18} />,        color: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   barColor: 'bg-amber-500' },
  { key: 'meetings', label: 'Tư Vấn',        icon: <Target size={18} />,       color: 'text-violet-500',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  barColor: 'bg-violet-500' },
  { key: 'visits',   label: 'Trải Nghiệm',   icon: <Building2 size={18} />,    color: 'text-indigo-500',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  barColor: 'bg-indigo-500' },
  { key: 'bookings', label: 'Giữ Chỗ',       icon: <BookmarkPlus size={18} />, color: 'text-pink-500',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    barColor: 'bg-pink-500' },
  { key: 'deposits', label: 'Đặt Cọc',       icon: <ShieldCheck size={18} />,  color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', barColor: 'bg-emerald-500' },
];

export function ManagerDashboard() {
  const { totals, todayTotals, conversions, staffRanking, totalStaff, loading } = useActivityDashboard();

  const maxVal = Math.max(...FUNNEL_STEPS.map(s => totals[s.key] as number), 1);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* ══════ HEADER ══════ */}
      <div className="flex items-center justify-between sg-stagger" style={{ animationDelay: '0ms' }}>
        <h2 className="text-[20px] font-black text-sg-heading">Dashboard Quản Lý Đội Nhóm</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-[12px] font-black">
          {totalStaff} nhân sự hoạt động
        </div>
      </div>

      {/* ══════ KPI CARDS ROW 1: 6 Funnel Metrics ══════ */}
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
                <p className="text-[11px] font-bold text-sg-muted uppercase tracking-wider mt-1.5">{step.label} Team</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════ KPI ROW 2: Points + Staff Count ══════ */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-[24px] p-5 text-white shadow-xl shadow-purple-500/20 sg-stagger" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center gap-3 mb-2">
              <Award size={22} />
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Tổng Điểm Team</p>
            </div>
            <p className="text-[32px] font-black leading-none">{totals.points}</p>
            <p className="text-[11px] opacity-70 mt-1">TB: {totalStaff > 0 ? (totals.points / totalStaff).toFixed(1) : 0} điểm/người</p>
          </div>
          <div className="bg-white dark:bg-black/30 rounded-[24px] border border-slate-200/80 dark:border-sg-border p-5 shadow-sg-sm sg-stagger" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-2">
              <UserCheck size={22} className="text-blue-500" />
              <p className="text-[11px] font-bold text-sg-muted uppercase tracking-wider">Nhân Sự Active</p>
            </div>
            <p className="text-[32px] font-black text-blue-500 leading-none">{totalStaff}</p>
            <p className="text-[11px] text-sg-muted mt-1">nhân viên kinh doanh</p>
          </div>
        </div>
      )}

      {/* ══════ TWO COLUMNS: FUNNEL + RANKING ══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Phễu Chuyển Đổi Team */}
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger flex flex-col" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-500" />
            </div>
            <h3 className="text-[15px] font-black text-sg-heading">Phễu Chuyển Đổi Team</h3>
          </div>

          {!loading && (
            <div className="space-y-3 flex-1">
              {FUNNEL_STEPS.map((step, idx) => {
                const val = totals[step.key] as number;
                const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                return (
                  <div key={step.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-bold ${step.color}`}>{step.label}</span>
                      <span className="text-[13px] font-black text-sg-heading">{val}</span>
                    </div>
                    <div className="h-3 bg-sg-btn-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${step.barColor} transition-all duration-1000`}
                        style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 mt-4 border-t border-sg-border/30 space-y-2">
                <p className="text-[10px] font-black text-sg-muted uppercase tracking-widest mb-2">Tỷ Lệ Chuyển Đổi</p>
                {[
                  { label: 'QT → TV', value: conversions.leadsToMeetings },
                  { label: 'TV → TN', value: conversions.meetingsToVisits },
                  { label: 'TN → GC', value: conversions.visitsToBookings },
                  { label: 'GC → ĐC', value: conversions.bookingsToDeposits },
                ].map(c => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sg-muted flex items-center gap-1">
                      {c.label} <ArrowRight size={10} />
                    </span>
                    <span className={`text-[12px] font-black ${c.value > 30 ? 'text-emerald-500' : c.value > 0 ? 'text-amber-500' : 'text-sg-muted'}`}>
                      {c.value.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bảng Xếp Hạng Team */}
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger flex flex-col" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Medal size={18} className="text-orange-500" />
              </div>
              <h3 className="text-[15px] font-black text-sg-heading">Bảng Xếp Hạng Đội Nhóm</h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 bg-sg-card rounded border border-sg-border">Theo Điểm</span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {staffRanking.map((s, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={s.staffId} className="p-3 rounded-xl border border-sg-border/50 bg-sg-card/20 flex items-center justify-between hover:border-orange-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] w-6 text-center">{medals[i] || `#${i + 1}`}</span>
                    <div>
                      <p className="text-[13px] font-bold text-sg-heading">{s.staffName}</p>
                      <p className="text-[10px] text-sg-muted">
                        {s.calls}📞 {s.leads}👥 {s.meetings}🏢 {s.visits}🏠 {s.bookings}📌 {s.deposits}💰
                      </p>
                    </div>
                  </div>
                  <span className="text-[14px] font-black text-amber-500">{s.points}pts</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════ BẢNG CHI TIẾT NHÂN SỰ ══════ */}
      {!loading && staffRanking.length > 0 && (
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Users size={18} className="text-violet-500" />
            </div>
            <h3 className="text-[15px] font-black text-sg-heading">Chi Tiết Từng Nhân Sự</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-sg-border/50">
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest">#</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest">Nhân Sự</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-center">📞 Gọi</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-center">👥 QT</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-center">🏢 TV</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-center">🏠 TN</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-center">📌 GC</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-center">💰 ĐC</th>
                  <th className="px-3 py-3 text-[10px] font-black text-sg-muted uppercase tracking-widest text-right">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {staffRanking.map((s, i) => (
                  <tr key={s.staffId} className="border-b border-sg-border/30 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3 text-[12px] font-bold text-sg-muted">#{i + 1}</td>
                    <td className="px-3 py-3 text-[13px] font-bold text-sg-heading whitespace-nowrap">{s.staffName}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-blue-500 text-center">{s.calls}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-amber-500 text-center">{s.leads}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-violet-500 text-center">{s.meetings}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-indigo-500 text-center">{s.visits}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-pink-500 text-center">{s.bookings}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-emerald-500 text-center">{s.deposits}</td>
                    <td className="px-3 py-3 text-[14px] font-black text-amber-500 text-right">{s.points}</td>
                  </tr>
                ))}
                {/* Tổng Row */}
                <tr className="bg-slate-50/80 dark:bg-white/5 font-black">
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3 text-[12px] text-sg-heading uppercase tracking-wider">Tổng</td>
                  <td className="px-3 py-3 text-[14px] text-blue-600 text-center">{totals.calls}</td>
                  <td className="px-3 py-3 text-[14px] text-amber-600 text-center">{totals.leads}</td>
                  <td className="px-3 py-3 text-[14px] text-violet-600 text-center">{totals.meetings}</td>
                  <td className="px-3 py-3 text-[14px] text-indigo-600 text-center">{totals.visits}</td>
                  <td className="px-3 py-3 text-[14px] text-pink-600 text-center">{totals.bookings}</td>
                  <td className="px-3 py-3 text-[14px] text-emerald-600 text-center">{totals.deposits}</td>
                  <td className="px-3 py-3 text-[14px] text-amber-600 text-right">{totals.points}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
