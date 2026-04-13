import React, { useMemo } from 'react';
import { useProjects, useLegalDocs, useInventory } from '../hooks/useProjects';
import { RE_PROJECT_STATUS, RE_LEGAL_PROCEDURE_STATUS, RE_PRODUCT_STATUS } from '../constants';
import { Target, AlertCircle, CheckCircle2, Building2, ArrowRight, MapPin, Box, Scale, TrendingUp, DollarSign, Banknote, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ title, value, subtitle, icon: Icon, color, bg, glow }: {
  title: string; value: string | number; subtitle: string | null; icon: any; color: string; bg: string; glow: string;
}) {
  return (
    <div className="bg-sg-card/60 backdrop-blur-xl rounded-sg-2xl border border-sg-border p-7 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500">
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${bg} blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />
      <div className={`absolute -left-10 -bottom-10 w-24 h-24 rounded-full ${glow} blur-[32px] opacity-20 group-hover:opacity-60 transition-opacity duration-700`} />
      
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-center justify-between z-10 relative">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-extrabold uppercase tracking-[2px] text-sg-subtext group-hover:text-sg-heading transition-colors">{title}</span>
          {subtitle && <span className="text-[11px] font-semibold text-sg-muted/70">{subtitle}</span>}
        </div>
        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${bg} border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} className={color} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-auto z-10 relative flex items-end justify-between">
        <span className="text-[32px] font-black text-sg-heading tracking-tighter drop-shadow-sm">{value}</span>
      </div>
    </div>
  );
}

function MiniBarChart({ data, colors }: { data: { label: string; value: number; color: string }[]; colors?: string[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-24 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-sg-heading">{d.value}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-700 min-h-[4px]"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: d.color,
            }}
          />
          <span className="text-[9px] font-bold text-sg-muted text-center leading-tight mt-1">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectDashboardScreen() {
  const { data: projects } = useProjects();
  const { data: legalDocs } = useLegalDocs();
  const { data: inventory } = useInventory();

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'SELLING').length;
    const upcoming = projects.filter(p => p.status === 'UPCOMING').length;
    const completed = projects.filter(p => p.status === 'HANDOVER' || p.status === 'CLOSED').length;
    const totalUnits = projects.reduce((s, p) => s + (p.totalUnits || 0), 0);
    const totalSold = projects.reduce((s, p) => s + (p.soldUnits || 0), 0);
    const absorptionRate = totalUnits > 0 ? Math.round((totalSold / totalUnits) * 100) : 0;

    const totalGrossVolume = projects.reduce((s, p) => s + (p.soldUnits || 0) * (p.avgPrice || 0), 0);
    const totalExpectedCommission = projects.reduce((s, p) => s + ((p.soldUnits || 0) * (p.avgPrice || 0) * ((p.feeRate || 0) / 100)), 0);

    return { total, active, upcoming, completed, totalUnits, totalSold, absorptionRate, totalGrossVolume, totalExpectedCommission };
  }, [projects]);

  const inventoryStats = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    inventory.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    return statusCounts;
  }, [inventory]);

  const recentLegalDocs = useMemo(() => legalDocs.slice(0, 4), [legalDocs]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:px-10 flex flex-col gap-10 custom-scrollbar relative z-10">
      
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit mb-2">
           <Box size={14} className="text-cyan-500" />
           <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Real Estate Overview</span>
        </div>
        <h2 className="text-[32px] sm:text-[40px] font-black text-sg-heading tracking-tight drop-shadow-md">Theo dõi Dự án BĐS</h2>
        <p className="text-[15px] font-semibold text-sg-subtext max-w-2xl">Báo cáo real-time về rổ hàng, pháp lý dự án và các chỉ số kinh doanh cốt lõi của sàn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Tổng dự án" value={stats.total} subtitle="Đang quản lý" icon={Building2} color="text-cyan-500" bg="bg-cyan-500/15" glow="bg-blue-500/20" />
        <StatCard title="Đang mở bán" value={stats.active} subtitle="Bảng hàng hoạt động" icon={Target} color="text-emerald-500" bg="bg-emerald-500/15" glow="bg-emerald-400/20" />
        <StatCard title="Tỷ lệ hấp thụ" value={`${stats.absorptionRate}%`} subtitle={`${stats.totalSold}/${stats.totalUnits} sản phẩm`} icon={TrendingUp} color="text-amber-500" bg="bg-amber-500/15" glow="bg-orange-500/20" />
        <StatCard title="Bàn giao/Đóng" value={stats.completed} subtitle="Đã vận hành" icon={CheckCircle2} color="text-purple-500" bg="bg-purple-500/15" glow="bg-indigo-500/20" />
        <StatCard title="Gross Vol (Tỷ)" value={(stats.totalGrossVolume / 1000000000).toFixed(1)} subtitle="Doanh số (ước tính)" icon={Banknote} color="text-rose-500" bg="bg-rose-500/15" glow="bg-pink-500/20" />
        <StatCard title="Hoa Hồng (Tỷ)" value={(stats.totalExpectedCommission / 1000000000).toFixed(2)} subtitle="Target Commission" icon={Wallet} color="text-fuchsia-500" bg="bg-fuchsia-500/15" glow="bg-purple-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Left Column: Projects + Inventory Chart */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Inventory Status Chart */}
          <div className="bg-sg-card/50 backdrop-blur-2xl border border-sg-border rounded-sg-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-black uppercase tracking-[2px] text-sg-heading">Phân bổ rổ hàng</h3>
              <Link to="/ProjectModule/inventory" className="text-[12px] font-black text-cyan-600 hover:text-cyan-500 flex items-center gap-1.5 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                XEM CHI TIẾT <ArrowRight size={14} />
              </Link>
            </div>
            <MiniBarChart data={
              Object.entries(RE_PRODUCT_STATUS).map(([key, cfg]) => ({
                label: cfg.label,
                value: inventoryStats[key] || 0,
                color: key === 'AVAILABLE' ? '#10b981' : key === 'LOCKED' ? '#f97316' : key === 'DEPOSIT' ? '#3b82f6' : key === 'SOLD' ? '#f43f5e' : key === 'COMPLETED' ? '#94a3b8' : key === 'RESERVED' ? '#eab308' : '#a78bfa',
              }))
            } />
          </div>

          {/* Projects List Preview */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-black uppercase tracking-[2px] text-sg-heading">Dự án Đang Bán</h3>
              <Link to="/ProjectModule/list" className="text-[12px] font-black text-cyan-600 hover:text-cyan-500 flex items-center gap-1.5 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                XEM TẤT CẢ <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="bg-sg-card/50 backdrop-blur-2xl border border-sg-border rounded-sg-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
              {projects.length === 0 ? (
                <div className="p-8 text-center">
                  <Building2 size={32} className="text-sg-muted mx-auto mb-3" />
                  <p className="text-[14px] font-bold text-sg-muted">Chưa có dự án nào.</p>
                  <Link to="/ProjectModule/list" className="text-[13px] font-black text-cyan-500 mt-2 inline-block">+ Tạo dự án đầu tiên</Link>
                </div>
              ) : (
                projects.slice(0, 4).map((proj, idx) => {
                  const statusCfg = RE_PROJECT_STATUS[proj.status] || RE_PROJECT_STATUS.UPCOMING;
                  return (
                    <Link to={`/ProjectModule/board?id=${proj.id}`} key={proj.id} className={`flex items-center gap-5 p-5 sm:p-6 hover:bg-sg-btn-bg transition-colors group relative overflow-hidden ${idx !== 0 ? 'border-t border-sg-border/50' : ''}`}>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 border shadow-sm ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color} group-hover:scale-110 transition-transform duration-500`}>
                        <Building2 size={24} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[16px] font-black text-sg-heading truncate group-hover:text-cyan-500 transition-colors">{proj.name}</h4>
                        <span className="text-[12px] font-bold text-sg-muted mt-1 truncate block">{proj.code} • Phụ trách: {proj.managerName || 'Chưa gán'}</span>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                          {statusCfg.label}
                        </span>
                        <span className="text-[12px] font-bold text-sg-subtext flex items-center gap-1 bg-sg-bg py-1 px-2 rounded-lg border border-sg-border">
                          <MapPin size={12} className="text-amber-500" /> {proj.location}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Legal Pipeline Preview */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-black uppercase tracking-[2px] text-sg-heading">Pháp lý & Thủ tục</h3>
            <Link to="/ProjectModule/legal" className="text-[12px] font-black text-rose-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
              XEM <ArrowRight size={14} />
            </Link>
          </div>

          {recentLegalDocs.length === 0 ? (
            <div className="bg-sg-card/40 backdrop-blur-xl border border-sg-border rounded-sg-xl p-8 text-center">
              <Scale size={28} className="text-sg-muted mx-auto mb-3" />
              <p className="text-[13px] font-bold text-sg-muted">Chưa có hồ sơ pháp lý nào.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentLegalDocs.map(doc => {
                const dStatus = RE_LEGAL_PROCEDURE_STATUS[doc.status];
                const accentColor = doc.status === 'APPROVED' ? 'border-l-emerald-500' : doc.status === 'SUBMITTED' ? 'border-l-blue-500' : doc.status === 'ISSUE_FIXING' ? 'border-l-orange-500' : 'border-l-slate-400';
                return (
                  <div key={doc.id} className={`bg-sg-card/60 backdrop-blur-xl border-l-4 ${accentColor} border-y border-r border-sg-border rounded-[20px] p-5 flex flex-col gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group`}>
                    <div className={`absolute top-0 right-0 w-24 h-24 ${dStatus?.bg || 'bg-slate-500/10'} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`} />
                    
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <h5 className="text-[14px] font-extrabold text-sg-heading line-clamp-2 leading-tight group-hover:text-cyan-500 transition-colors">{doc.title}</h5>
                      <span className={`px-2 py-1 rounded-sg-sm text-[9px] font-black uppercase tracking-wider whitespace-nowrap border shadow-sm ${dStatus?.bg} ${dStatus?.color} ${dStatus?.border || 'border-sg-border'}`}>
                        {dStatus?.label}
                      </span>
                    </div>
                    <p className="text-[12px] font-bold text-sg-muted line-clamp-1 relative z-10">{doc.description}</p>
                    <div className="flex items-center justify-between mt-1 relative z-10">
                      <span className="text-[11px] font-bold text-sg-muted bg-sg-bg px-2 py-1.5 rounded-lg border border-sg-border flex items-center gap-1.5 shadow-inner">
                        <Scale size={12} className="text-rose-500" /> {doc.assigneeName || '?'}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 text-white text-[12px] font-black flex items-center justify-center border border-white/10 shadow-[0_4px_12px_rgba(6,182,212,0.3)]">
                        {doc.assigneeName ? doc.assigneeName.slice(0, 1).toUpperCase() : '?'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
