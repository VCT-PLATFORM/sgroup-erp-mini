import React, { useMemo } from 'react';
import { useProjects, useLegalDocs } from '../hooks/useProjects';
import { RE_PROJECT_STATUS, RE_LEGAL_PROCEDURE_STATUS } from '../constants';
import { Target, AlertCircle, CheckCircle2, Building2, ArrowRight, MapPin, Box, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ title, value, subtitle, icon: Icon, color, bg, glow }: {
  title: string; value: string | number; subtitle: string; icon: any; color: string; bg: string; glow: string;
}) {
  return (
    <div className="bg-sg-card/60 backdrop-blur-[24px] rounded-[32px] border border-sg-border p-7 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500">
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${bg} blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />
      <div className={`absolute -left-10 -bottom-10 w-24 h-24 rounded-full ${glow} blur-[32px] opacity-20 group-hover:opacity-60 transition-opacity duration-700`} />
      
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-center justify-between z-10 relative">
        <span className="text-[12px] font-extrabold uppercase tracking-[2px] text-sg-subtext group-hover:text-sg-heading transition-colors">{title}</span>
        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${bg} border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} className={color} strokeWidth={2.5} />
        </div>
      </div>
      <div className="z-10 relative flex flex-col gap-1.5 mt-2">
        <span className="text-[40px] font-black text-sg-heading tracking-tighter leading-none drop-shadow-sm">{value}</span>
        <span className="text-[13px] font-bold text-sg-muted mt-1">{subtitle}</span>
      </div>
    </div>
  );
}

export function ProjectDashboardScreen() {
  const { data: projects } = useProjects();
  const { data: legalDocs } = useLegalDocs();

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'SELLING').length;
    const upcoming = projects.filter(p => p.status === 'UPCOMING').length;
    const completed = projects.filter(p => p.status === 'HANDOVER').length;
    return { total, active, upcoming, completed };
  }, [projects]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng dự án" value={stats.total} subtitle="Đang quản lý" icon={Building2} color="text-cyan-500" bg="bg-cyan-500/15" glow="bg-blue-500/20" />
        <StatCard title="Đang mở bán" value={stats.active} subtitle="Bảng hàng hoạt động" icon={Target} color="text-emerald-500" bg="bg-emerald-500/15" glow="bg-emerald-400/20" />
        <StatCard title="Sắp ra mắt" value={stats.upcoming} subtitle="Chuẩn bị phân phối" icon={AlertCircle} color="text-amber-500" bg="bg-amber-500/15" glow="bg-orange-500/20" />
        <StatCard title="Bàn giao" value={stats.completed} subtitle="Đã vận hành" icon={CheckCircle2} color="text-purple-500" bg="bg-purple-500/15" glow="bg-indigo-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Left Column: Projects List Preview */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-black uppercase tracking-[2px] text-sg-heading">Dự án Đang Bán</h3>
            <Link to="/ProjectModule/list" className="text-[12px] font-black text-cyan-600 hover:text-cyan-500 flex items-center gap-1.5 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
              XEM TẤT CẢ <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="bg-sg-card/50 backdrop-blur-2xl border border-sg-border rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
            {projects.slice(0, 4).map((proj, idx) => {
              const statusCfg = RE_PROJECT_STATUS[proj.status] || RE_PROJECT_STATUS.UPCOMING;
              return (
                <Link to={`/ProjectModule/board?id=${proj.id}`} key={proj.id} className={`flex items-center gap-5 p-5 sm:p-6 hover:bg-sg-btn-bg transition-colors group relative overflow-hidden ${idx !== 0 ? 'border-t border-sg-border/50' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 border shadow-sm ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color} group-hover:scale-110 transition-transform duration-500`}>
                    <Building2 size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[16px] font-black text-sg-heading truncate group-hover:text-cyan-500 transition-colors">{proj.name}</h4>
                    <span className="text-[12px] font-bold text-sg-muted mt-1 truncate block">{proj.code} • Phụ trách: {proj.managerName}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 hidden sm:flex">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                      {statusCfg.label}
                    </span>
                    <span className="text-[12px] font-bold text-sg-subtext flex items-center gap-1 bg-sg-bg py-1 px-2 rounded-lg border border-sg-border">
                      <MapPin size={12} className="text-amber-500" /> {proj.location}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Legal Pipeline Preview */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-black uppercase tracking-[2px] text-sg-heading">Pháp lý & Thủ tục</h3>
          </div>

          <div className="flex flex-col gap-4">
            {recentLegalDocs.map(doc => {
              const dStatus = RE_LEGAL_PROCEDURE_STATUS[doc.status];
              return (
                <div key={doc.id} className="bg-sg-card/60 backdrop-blur-xl border-l-[4px] border-l-rose-500 border-y border-r border-sg-border rounded-[20px] p-5 flex flex-col gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(244,63,94,0.1)] hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-[24px] pointer-events-none group-hover:bg-rose-500/20 transition-colors" />
                  
                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <h5 className="text-[14px] font-extrabold text-sg-heading line-clamp-2 leading-tight group-hover:text-rose-500 transition-colors">{doc.title}</h5>
                    <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-wider whitespace-nowrap border shadow-sm ${dStatus?.bg} ${dStatus?.color} ${dStatus?.border || 'border-sg-border'}`}>
                      {dStatus?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 relative z-10">
                    <span className="text-[11px] font-bold text-sg-muted bg-sg-bg px-2 py-1.5 rounded-lg border border-sg-border flex items-center gap-1.5 shadow-inner">
                      <Scale size={12} className="text-rose-500" /> {doc.assigneeName || '?'}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-[12px] font-black flex items-center justify-center border border-white/10 shadow-[0_4px_12px_rgba(6,182,212,0.3)]">
                      {doc.assigneeName ? doc.assigneeName.slice(0, 1).toUpperCase() : '?'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
