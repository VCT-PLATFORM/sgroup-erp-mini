import React from 'react';
import { Megaphone, TrendingUp, Users, DollarSign, Zap, BarChart3 } from 'lucide-react';
import { useMKTDashboard, useMKTActivities } from '../hooks/useMKT';
import { SGStatsCard, SGGlassPanel } from '@sgroup/web-ui';
import { CHANNEL_CONFIG, formatCurrency } from '../constants';
import type { MarketingChannel } from '../types';

export function MKTDashboard() {
  const { data: dashboard, isLoading } = useMKTDashboard();
  const { data: rawActivities } = useMKTActivities();
  const activities = Array.isArray(rawActivities) ? rawActivities : [];

  const KPI_CARDS = [
    { id: 'k1', label: 'TỔNG NGÂN SÁCH', value: formatCurrency(dashboard?.totalBudget ?? 0), unit: 'VNĐ', icon: DollarSign, variant: 'purple' as const },
    { id: 'k2', label: 'ĐÃ CHI TIÊU', value: formatCurrency(dashboard?.totalSpent ?? 0), unit: 'VNĐ', icon: BarChart3, variant: 'warning' as const },
    { id: 'k3', label: 'TỔNG LEADS', value: dashboard?.totalLeads ?? 0, unit: '', icon: Users, variant: 'info' as const },
    { id: 'k4', label: 'TỶ LỆ CONVERSION', value: `${dashboard?.conversionRate ?? 0}%`, unit: '', icon: TrendingUp, variant: 'success' as const },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold text-sg-subtext">Đang tải dữ liệu Marketing...</span>
      </div>
    );
  }

  const channelDist = dashboard?.channelDistribution || [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-[20px] bg-linear-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Megaphone size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-sg-heading tracking-tight mb-1">TỔNG QUAN MARKETING</h2>
          <p className="text-[15px] font-semibold text-sg-muted">Dữ liệu thời gian thực — Phòng Marketing SGroup</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {KPI_CARDS.map(k => (
          <SGStatsCard key={k.id} label={k.label} value={k.value} unit={k.unit} icon={k.icon} variant={k.variant} />
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8 flex flex-col gap-8">

          {/* Channel Mix Chart */}
          <SGGlassPanel padding="lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-orange-500/20 bg-orange-500/10">
                <BarChart3 size={20} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-sg-heading flex-1">Phân bổ Ngân sách theo Kênh</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Doughnut Chart */}
              <div className="relative w-[280px] h-[280px] shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90 drop-shadow-sm">
                  {(() => {
                    let cumulativePercent = 0;
                    return channelDist.map((d: any, i: number) => {
                      const radius = 80;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDasharray = `${(d.percent / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                      cumulativePercent += d.percent;
                      const color = CHANNEL_CONFIG[d.channel as MarketingChannel]?.color || '#64748b';
                      return (
                        <circle key={i} cx="100" cy="100" r={radius} fill="none" stroke={color} strokeWidth="24"
                          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000 ease-out hover:stroke-[28px] cursor-pointer"
                          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-sg-heading tracking-tight">{formatCurrency(dashboard?.totalBudget || 0)}</span>
                  <span className="text-xs font-bold text-sg-subtext uppercase tracking-widest mt-1">Tổng NS</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {channelDist.map((d: any) => {
                  const cfg = CHANNEL_CONFIG[d.channel as MarketingChannel];
                  return (
                    <div key={d.channel} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-sg-btn-bg transition-colors border border-transparent hover:border-sg-border group cursor-pointer">
                      <div className="w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-sm" style={{ backgroundColor: cfg?.color || '#64748b' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-[14px] font-extrabold text-sg-heading truncate group-hover:text-orange-500 transition-colors">{cfg?.label || d.channel}</h4>
                          <span className="text-[13px] font-black shrink-0" style={{ color: cfg?.color }}>{d.percent}%</span>
                        </div>
                        <span className="text-[12px] font-semibold text-sg-subtext">{formatCurrency(d.amount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SGGlassPanel>

          {/* Activity Timeline */}
          <SGGlassPanel padding="lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-purple-500/20 bg-purple-500/10">
                <Zap size={20} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-black text-sg-heading">Hoạt động Marketing gần đây</h3>
            </div>
            <div className="pl-2">
              {activities.length === 0 ? (
                <p className="py-4 text-sg-subtext font-medium text-sm pl-4">Chưa có hoạt động nào.</p>
              ) : (
                activities.map((a: any, i: number) => (
                  <div key={a.id || i} className={`flex gap-5 ${i === activities.length - 1 ? '' : 'mb-6'}`}>
                    <div className="flex flex-col items-center w-3.5 shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-sg-card z-10 shrink-0 shadow-sm" style={{ backgroundColor: a.tone || '#3b82f6' }} />
                      {i < activities.length - 1 && <div className="w-[2px] flex-1 bg-sg-border mt-1 -mb-6" />}
                    </div>
                    <div className="flex-1 -mt-1 bg-linear-to-r from-sg-btn-bg/80 to-transparent dark:from-white/5 p-4 rounded-2xl border border-sg-border/60 hover:border-sg-border transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[15px] font-extrabold text-sg-heading">{a.title}</span>
                        <span className="text-[11px] font-bold text-sg-subtext/80 whitespace-nowrap uppercase tracking-wider bg-sg-bg px-2 py-0.5 rounded-md border border-sg-border">{a.time}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-sg-subtext leading-relaxed">{a.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SGGlassPanel>
        </div>

        {/* Right Column — Quick Campaign Stats */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          <SGGlassPanel padding="lg" className="sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-pink-500/20 bg-pink-500/10">
                <Megaphone size={20} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-black text-sg-heading">Chiến dịch đang chạy</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-sg-btn-bg border border-sg-border"><span className="text-sm font-bold text-sg-heading">Campaigns đang active</span><span className="text-2xl font-black text-emerald-500">{dashboard?.activeCampaigns || 0}</span></div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-sg-btn-bg border border-sg-border"><span className="text-sm font-bold text-sg-heading">Tổng nội dung</span><span className="text-2xl font-black text-blue-500">{dashboard?.totalContent || 0}</span></div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-sg-btn-bg border border-sg-border"><span className="text-sm font-bold text-sg-heading">Leads tháng này</span><span className="text-2xl font-black text-purple-500">{dashboard?.totalLeads || 0}</span></div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-sg-btn-bg border border-sg-border">
                <span className="text-sm font-bold text-sg-heading">Ngân sách đã dùng</span>
                <span className="text-lg font-black text-orange-500">{dashboard?.totalBudget ? Math.round((dashboard.totalSpent / dashboard.totalBudget) * 100) : 0}%</span>
              </div>
            </div>
            {/* Budget Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-sg-subtext mb-2">
                <span>ĐÃ CHI: {formatCurrency(dashboard?.totalSpent || 0)}</span>
                <span>HẠN MỨC: {formatCurrency(dashboard?.totalBudget || 0)}</span>
              </div>
              <div className="h-3 bg-sg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-linear-to-r from-orange-500 to-pink-500 transition-all duration-1000"
                  style={{ width: `${dashboard?.totalBudget ? Math.min(100, (dashboard.totalSpent / dashboard.totalBudget) * 100) : 0}%` }} />
              </div>
            </div>
          </SGGlassPanel>
        </div>
      </div>
    </div>
  );
}
