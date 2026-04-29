import React, { useState, useEffect } from 'react';
import {
  Phone, Users, Target, Building2, BookmarkPlus, ShieldCheck,
  Award, Activity, Plus, FileText, CheckCircle2, TrendingDown, TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useActivityDashboard, FunnelTotals } from '../../hooks/useActivityDashboard';
import { salesOpsApi, SalesActivity } from '../../api/salesApi';
import { SkeletonKPICard } from '../../components/shared';
import { ActivityEntryModal } from '../../components/ActivityEntryModal';

// ═══════════════════════════════════════════════════════════
// STAFF DASHBOARD — Personal KPIs from Activity Log
// ═══════════════════════════════════════════════════════════

const FUNNEL_STEPS: { key: keyof FunnelTotals; label: string; icon: React.ReactNode; color: string; bg: string; border: string }[] = [
  { key: 'calls',    label: 'Cuộc Gọi',       icon: <Phone size={18} />,        color: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { key: 'leads',    label: 'Quan Tâm',        icon: <Users size={18} />,        color: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  { key: 'meetings', label: 'Tư Vấn',          icon: <Target size={18} />,       color: 'text-violet-500',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  { key: 'visits',   label: 'Trải Nghiệm',     icon: <Building2 size={18} />,    color: 'text-indigo-500',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20' },
  { key: 'bookings', label: 'Giữ Chỗ',         icon: <BookmarkPlus size={18} />, color: 'text-pink-500',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
  { key: 'deposits', label: 'Đặt Cọc',         icon: <ShieldCheck size={18} />,  color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export function StaffDashboard() {
  const { totals, todayTotals, conversions, staffRanking, myRank, totalStaff, loading, refetch } = useActivityDashboard();
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const res = await salesOpsApi.listActivities();
      setActivities(res.data.slice(0, 3));
    } catch (err) { console.error(err); }
    finally { setActivitiesLoading(false); }
  };

  const maxVal = Math.max(...FUNNEL_STEPS.map(s => totals[s.key] as number), 1);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* ══════ HEADER ══════ */}
      <div className="flex items-center justify-between sg-stagger" style={{ animationDelay: '0ms' }}>
        <h2 className="text-[20px] font-black text-sg-heading">Dashboard Cá Nhân</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[12px] font-black pointer-events-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Online</span>
        </div>
      </div>

      {/* ══════ 6 KPI CARDS — from activity log ══════ */}
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
                className={`relative overflow-hidden bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[20px] border border-slate-200/80 dark:border-sg-border p-5 shadow-sg-sm hover:shadow-sg-md hover:-translate-y-0.5 transition-all sg-stagger`}
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
                <p className="text-[11px] font-bold text-sg-muted uppercase tracking-wider mt-1.5">{step.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════ ĐIỂM CỐNG HIẾN HERO ══════ */}
      {!loading && (
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-[24px] p-6 text-white shadow-xl shadow-purple-500/20 sg-stagger" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Điểm Cống Hiến</p>
                <p className="text-[32px] font-black leading-none">{totals.points} <span className="text-[14px] opacity-80">điểm</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Xếp Hạng Team</p>
              <p className="text-[28px] font-black leading-none">#{myRank}<span className="text-[14px] opacity-80">/{totalStaff}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* ══════ TWO COLUMNS: FUNNEL + JOURNAL ══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Phễu Chuyển Đổi */}
        <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger flex flex-col" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-500" />
            </div>
            <h3 className="text-[15px] font-black text-sg-heading">Phễu Chuyển Đổi</h3>
          </div>

          {!loading && (
            <div className="space-y-3 flex-1">
              {FUNNEL_STEPS.map((step, idx) => {
                const val = totals[step.key] as number;
                const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                return (
                  <div key={step.key} className="sg-stagger" style={{ animationDelay: `${300 + idx * 50}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-bold ${step.color}`}>{step.label}</span>
                      <span className="text-[13px] font-black text-sg-heading">{val}</span>
                    </div>
                    <div className="h-3 bg-sg-btn-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${step.bg.replace('/10', '')} transition-all duration-1000`}
                        style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                  </div>
                );
              })}

              {/* Conversion rates */}
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

        {/* Nhật ký + Xếp hạng */}
        <div className="flex flex-col gap-6">
          {/* Nhật ký hôm nay */}
          <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <FileText size={18} className="text-violet-500" />
                </div>
                <h3 className="text-[15px] font-black text-sg-heading">Nhật Ký Hôm Nay</h3>
              </div>
              <button onClick={() => setIsActivityModalOpen(true)}
                className="w-8 h-8 rounded-full bg-sg-btn-bg border border-sg-border flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                <Plus size={16} />
              </button>
            </div>

            {activitiesLoading ? (
              <div className="flex items-center justify-center py-6 opacity-50"><Activity className="animate-spin text-sg-muted" /></div>
            ) : activities.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[12px] font-bold text-sg-muted">Chưa ghi nhận hoạt động</p>
                <button onClick={() => setIsActivityModalOpen(true)} className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg text-[11px] font-black">
                  Nhập Hoạt Động
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {activities.map((act, i) => (
                  <div key={i} className="p-3 rounded-xl border border-sg-border/50 bg-sg-card/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-sg-heading">+{act.points} Point</p>
                      <p className="text-[10px] text-sg-muted truncate">{act.callsCount} Gọi · {act.newLeads} QT · {act.meetingsMade} TV</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Xếp Hạng Team */}
          {!loading && staffRanking.length > 0 && (
            <div className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[28px] border border-slate-200/80 dark:border-sg-border p-6 shadow-sg-md sg-stagger" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Award size={18} className="text-amber-500" />
                </div>
                <h3 className="text-[15px] font-black text-sg-heading">Xếp Hạng Team</h3>
              </div>
              <div className="space-y-2">
                {staffRanking.slice(0, 5).map((s, i) => {
                  const isMe = s.staffId === 'S1';
                  const medals = ['🥇', '🥈', '🥉'];
                  return (
                    <div key={s.staffId} className={`p-3 rounded-xl border flex items-center justify-between ${isMe ? 'border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-500/5' : 'border-sg-border/50 bg-sg-card/20'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] w-6 text-center">{medals[i] || `#${i + 1}`}</span>
                        <div>
                          <p className={`text-[13px] font-bold ${isMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-sg-heading'}`}>{s.staffName}{isMe ? ' (Bạn)' : ''}</p>
                          <p className="text-[10px] text-sg-muted">{s.calls} Gọi · {s.leads} QT · {s.meetings} TV</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-black text-amber-500">{s.points}pts</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ActivityEntryModal
        isOpen={isActivityModalOpen}
        onClose={() => { setIsActivityModalOpen(false); fetchActivities(); refetch(); }}
      />
    </div>
  );
}
