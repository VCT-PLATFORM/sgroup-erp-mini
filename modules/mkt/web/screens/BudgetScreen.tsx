import React, { useMemo } from 'react';
import { DollarSign, Download, PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import { useBudget } from '../hooks/useMKT';
import { SGGlassPanel } from '@sgroup/web-ui';
import { CHANNEL_CONFIG, formatCurrency } from '../constants';
import type { MarketingBudgetItem, MarketingChannel } from '../types';

export function BudgetScreen() {
  const { data: rawBudget, isLoading } = useBudget();
  const budgetData = (Array.isArray(rawBudget) ? rawBudget : []) as MarketingBudgetItem[];

  const currentMonthData = useMemo(() => {
    return budgetData.filter(b => b.month === '2026-04'); // Mock current month
  }, [budgetData]);

  const summary = useMemo(() => {
    let totalBudgeted = 0;
    let totalActual = 0;
    currentMonthData.forEach(b => {
      totalBudgeted += b.budgeted;
      totalActual += b.actual;
    });
    const variance = totalBudgeted - totalActual;
    const isOverSpent = totalActual > totalBudgeted;
    return { totalBudgeted, totalActual, variance, isOverSpent };
  }, [currentMonthData]);

  if (isLoading) {
    return (<div className="flex-1 flex flex-col items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" /><span className="text-sm font-semibold text-sg-subtext">Đang tải ngân sách...</span></div>);
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <DollarSign size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-sg-heading tracking-tight">NGÂN SÁCH MARKETING</h2>
            <p className="text-sm font-semibold text-sg-muted">Tháng 04/2026 • Theo dõi & Phân bổ chi tiêu</p>
          </div>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-sg-btn-bg border border-sg-border hover:bg-sg-border text-sg-heading font-bold text-sm flex items-center gap-2 transition-all shadow-sm">
          <Download size={18} /> Xuất báo cáo
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SGGlassPanel padding="lg" className="border-l-4 border-l-blue-500">
          <div className="text-sm font-bold text-sg-muted uppercase tracking-wider mb-2">Tổng Ngân Sách (T04/2026)</div>
          <div className="text-3xl font-black text-blue-500 mb-1">{formatCurrency(summary.totalBudgeted)}</div>
          <div className="text-xs font-semibold text-sg-subtext">Đã duyệt theo kế hoạch Q2</div>
        </SGGlassPanel>

        <SGGlassPanel padding="lg" className={`border-l-4 ${summary.isOverSpent ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
          <div className="text-sm font-bold text-sg-muted uppercase tracking-wider mb-2">Thực Tế Chi Tiêu</div>
          <div className={`text-3xl font-black mb-1 ${summary.isOverSpent ? 'text-red-500' : 'text-emerald-500'}`}>
            {formatCurrency(summary.totalActual)}
          </div>
          <div className="h-2 mt-3 bg-sg-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${summary.isOverSpent ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((summary.totalActual / summary.totalBudgeted) * 100, 100)}%` }} />
          </div>
        </SGGlassPanel>

        <SGGlassPanel padding="lg" className={`border-l-4 ${summary.variance >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-sg-muted uppercase tracking-wider">Chênh lệch (Variance)</div>
            {summary.variance >= 0 ? <TrendingDown size={18} className="text-emerald-500" /> : <TrendingUp size={18} className="text-red-500" />}
          </div>
          <div className={`text-3xl font-black mb-1 ${summary.variance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {summary.variance >= 0 ? '+' : ''}{formatCurrency(summary.variance)}
          </div>
          <div className="text-xs font-semibold text-sg-subtext">
            {summary.variance >= 0 ? 'Dưới ngân sách (Tiết kiệm)' : 'Vượt ngân sách (Cảnh báo)'}
          </div>
        </SGGlassPanel>
      </div>

      {/* Allocation Table */}
      <h3 className="text-xl font-black text-sg-heading mb-6 flex items-center gap-2">
        <PieChart size={20} className="text-sg-muted" /> Phân bổ theo Kênh
      </h3>
      <div className="bg-sg-card rounded-2xl border border-sg-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sg-border bg-sg-bg/50">
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Kênh Marketing</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">N/S Kế hoạch</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">TT Chi tiêu</th>
                <th className="text-center px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Tiến độ (%)</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Chênh lệch</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthData.map(b => {
                const chCfg = CHANNEL_CONFIG[b.channel as MarketingChannel];
                const pct = b.budgeted ? (b.actual / b.budgeted) * 100 : 0;
                const isOver = pct > 100;
                const variance = b.budgeted - b.actual;

                return (
                  <tr key={b.id} className="border-b border-sg-border/50 hover:bg-sg-btn-bg transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: chCfg?.color || '#ccc' }} />
                        <span className="text-[14px] font-extrabold text-sg-heading">{chCfg?.label || b.channel}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[14px] font-bold text-sg-muted">{formatCurrency(b.budgeted)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-[14px] font-black ${isOver ? 'text-red-500' : 'text-sg-heading'}`}>{formatCurrency(b.actual)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1.5 w-32 mx-auto">
                        <div className="h-1.5 w-full bg-sg-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={`text-[11px] font-black ${isOver ? 'text-red-500' : 'text-sg-subtext'}`}>{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-[13px] font-bold ${variance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {variance < 0 ? '' : '+'}{formatCurrency(variance)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-sg-bg border-t-2 border-sg-border">
                <td className="px-5 py-4 text-[14px] font-black text-sg-heading uppercase">Tổng số</td>
                <td className="px-5 py-4 text-right text-[15px] font-black text-blue-500">{formatCurrency(summary.totalBudgeted)}</td>
                <td className="px-5 py-4 text-right text-[15px] font-black text-orange-500">{formatCurrency(summary.totalActual)}</td>
                <td className="px-5 py-4 text-center text-[13px] font-black text-sg-subtext">{summary.totalBudgeted ? ((summary.totalActual / summary.totalBudgeted) * 100).toFixed(1) : 0}%</td>
                <td className="px-5 py-4 text-right text-[15px] font-black text-emerald-500">{formatCurrency(summary.variance)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
