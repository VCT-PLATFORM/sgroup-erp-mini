import React, { useMemo } from 'react';
import { LineChart, BarChart2, TrendingUp, Download, Eye, MousePointerClick, Zap } from 'lucide-react';
import { useMetrics } from '../hooks/useMKT';
import { SGGlassPanel } from '@sgroup/web-ui';
import { CHANNEL_CONFIG, formatCurrency, formatNumber } from '../constants';
import type { ChannelMetric, MarketingChannel } from '../types';

export function AnalyticsScreen() {
  const { data: rawMetrics, isLoading } = useMetrics();
  const metrics = (Array.isArray(rawMetrics) ? rawMetrics : []) as ChannelMetric[];

  const summary = useMemo(() => {
    let imp = 0, clicks = 0, conv = 0, spend = 0;
    metrics.forEach(m => {
      imp += m.impressions;
      clicks += m.clicks;
      conv += m.conversions;
      spend += m.spend;
    });
    return { 
      imp, 
      clicks, 
      conv, 
      spend, 
      avgCtr: imp ? (clicks / imp) * 100 : 0,
      avgCpc: clicks ? spend / clicks : 0,
      avgCpl: conv ? spend / conv : 0
    };
  }, [metrics]);

  if (isLoading) {
    return (<div className="flex-1 flex flex-col items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" /><span className="text-sm font-semibold text-sg-subtext">Đang tải báo cáo...</span></div>);
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <LineChart size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-sg-heading tracking-tight">REPORT & ANALYTICS</h2>
            <p className="text-sm font-semibold text-sg-muted">Phân tích hiệu quả chiến dịch & Tối ưu chuyển đổi</p>
          </div>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-sg-btn-bg border border-sg-border hover:bg-sg-border text-sg-heading font-bold text-sm flex items-center gap-2 transition-all shadow-sm">
          <Download size={18} /> Export Data
        </button>
      </div>

      {/* Top Level Metric Summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
            <Eye size={16} /><span className="text-[11px] font-black uppercase tracking-wider">Tổng Impressions</span>
          </div>
          <div className="text-2xl font-black text-sg-heading">{formatNumber(summary.imp)}</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <MousePointerClick size={16} /><span className="text-[11px] font-black uppercase tracking-wider">Tổng Clicks</span>
          </div>
          <div className="text-2xl font-black text-sg-heading">{formatNumber(summary.clicks)}</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <Zap size={16} /><span className="text-[11px] font-black uppercase tracking-wider">Lượt chuyển đổi</span>
          </div>
          <div className="text-2xl font-black text-sg-heading">{formatNumber(summary.conv)}</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
            <TrendingUp size={16} /><span className="text-[11px] font-black uppercase tracking-wider">Chi phí / Lead (Avg)</span>
          </div>
          <div className="text-2xl font-black text-sg-heading">{formatCurrency(summary.avgCpl)}</div>
        </div>
      </div>

      {/* Metrics Table */}
      <h3 className="text-xl font-black text-sg-heading mb-6 flex items-center gap-2">
        <BarChart2 size={20} className="text-sg-muted" /> Hiệu quả theo Kênh
      </h3>
      <div className="bg-sg-card rounded-2xl border border-sg-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sg-border bg-sg-bg/50">
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Kênh quảng cáo</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Spend</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Impressions</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Clicks</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">CTR</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">CPC</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Leads</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">CPL</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => {
                const chCfg = CHANNEL_CONFIG[m.channel as MarketingChannel];
                return (
                  <tr key={m.channel} className="border-b border-sg-border/50 hover:bg-sg-btn-bg transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: chCfg?.color || '#ccc' }} />
                        <span className="text-[14px] font-extrabold text-sg-heading group-hover:text-indigo-500 transition-colors">{chCfg?.label || m.channel}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right"><span className="text-[13px] font-bold text-sg-subtext">{formatCurrency(m.spend)}</span></td>
                    <td className="px-5 py-4 text-right"><span className="text-[13px] font-bold text-sg-subtext">{formatNumber(m.impressions)}</span></td>
                    <td className="px-5 py-4 text-right"><span className="text-[13px] font-bold text-sg-subtext">{formatNumber(m.clicks)}</span></td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${m.ctr > 5 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-sg-btn-bg text-sg-heading'}`}>
                        {m.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right"><span className="text-[13px] font-bold text-sg-heading">{formatCurrency(m.cpc)}</span></td>
                    <td className="px-5 py-4 text-right"><span className="text-[14px] font-black text-blue-500">{m.conversions}</span></td>
                    <td className="px-5 py-4 text-right"><span className="text-[13px] font-bold text-sg-heading">{formatCurrency(m.cpl)}</span></td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-[13px] font-black ${m.roas && m.roas > 3 ? 'text-emerald-500' : 'text-sg-muted'}`}>
                        {m.roas ? `${m.roas.toFixed(1)}x` : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
