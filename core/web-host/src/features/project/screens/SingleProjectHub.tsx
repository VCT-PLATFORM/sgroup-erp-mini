import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { RE_PROJECT_STATUS, RE_PROPERTY_TYPE } from '../constants';
import { Building2, MapPin, Target, Calendar, User, LayoutDashboard, Grid, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SingleProjectHub() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data: projects, loading } = useProjects();
  
  const proj = projects.find(p => p.id === id);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent relative z-10">
        <div className="w-12 h-12 border-4 border-sg-border border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!proj) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-transparent relative z-10">
         <h2 className="text-2xl font-black text-sg-heading tracking-tight drop-shadow-md">Không tìm thấy dự án</h2>
         <Link to="/ProjectModule/list" className="mt-6 text-cyan-500 hover:text-cyan-400 font-bold flex items-center gap-2">
           <ArrowLeft size={16} /> Quay lại danh mục
         </Link>
      </div>
    );
  }

  const statusCfg = RE_PROJECT_STATUS[proj.status] || RE_PROJECT_STATUS.UPCOMING;
  const typeCfg = RE_PROPERTY_TYPE[proj.type] || RE_PROPERTY_TYPE.LAND;

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative z-10 overflow-x-hidden overflow-y-auto custom-scrollbar">
      
      {/* Header Cover Area */}
      <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-blue-900/30 to-indigo-900/40 z-0 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 z-0 saturate-50 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-sg-portal-bg via-sg-portal-bg/60 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-end gap-6 relative">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-sg-card/80 backdrop-blur-3xl border-2 border-sg-border flex items-center justify-center shadow-2xl ${statusCfg.bg} ${statusCfg.border} overflow-hidden group`}>
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <Building2 size={48} className={statusCfg.color} strokeWidth={2} />
            </div>
            
            <div className="flex flex-col pb-2">
               <div className="flex items-center gap-3 mb-2">
                 <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border shadow-inner ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                   {statusCfg.label}
                 </span>
                 <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border shadow-inner ${typeCfg.bg} ${typeCfg.color} ${typeCfg.border}`}>
                   {typeCfg.label}
                 </span>
               </div>
               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter drop-shadow-lg leading-tight">
                 {proj.name}
               </h1>
               <div className="flex items-center gap-2 mt-2 font-bold text-sg-muted">
                 <span className="bg-sg-btn-bg/50 px-2.5 py-1 rounded-lg border border-sg-border/50 text-cyan-400 backdrop-blur-md">Mã: {proj.code}</span>
               </div>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
             <Link to={`/ProjectModule/inventory?project=${proj.id}`} className="h-12 px-5 flex items-center gap-2 bg-sg-card/60 hover:bg-sg-btn-bg border border-sg-border backdrop-blur-xl rounded-xl transition-all shadow-sm font-bold text-sg-heading group">
               <Grid size={18} className="text-cyan-500 group-hover:scale-110 transition-transform" /> Rổ hàng
             </Link>
             <button className="h-12 px-6 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-[0_8px_24px_rgba(6,182,212,0.25)] font-black text-white group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                <LayoutDashboard size={18} className="relative z-10" />
                <span className="relative z-10">Báo cáo Phân khu</span>
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 sm:p-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 flex flex-col gap-8">
            {/* Context Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: 'Sản phẩm', val: proj.totalUnits, icon: Target, c: 'text-indigo-400' },
                 { label: 'Quy Mô Đất', val: '120 Ha', icon: Grid, c: 'text-cyan-400' },
                 { label: 'Đã Bán', val: '35%', icon: Building2, c: 'text-emerald-400' },
                 { label: 'Pháp Lý', val: '1/500', icon: LayoutDashboard, c: 'text-rose-400' }
               ].map((x, i) => (
                 <div key={i} className="bg-sg-card/50 backdrop-blur-lg border border-sg-border rounded-[24px] p-5 flex flex-col gap-3 group hover:-translate-y-1 hover:shadow-lg transition-all">
                   <div className="flex items-center justify-between">
                     <span className="text-[12px] font-bold text-sg-muted uppercase tracking-wide">{x.label}</span>
                     <x.icon size={16} className={x.c} />
                   </div>
                   <span className="text-[20px] font-black text-sg-heading tracking-tight">{x.val}</span>
                 </div>
               ))}
            </div>

            {/* About the Project */}
            <div className="bg-sg-card/40 backdrop-blur-xl border border-sg-border rounded-[32px] p-8 shadow-sm">
               <h3 className="text-lg font-black text-sg-heading flex items-center gap-2 mb-6"><Target size={20} className="text-cyan-500" /> Vị trí & Tổng quan</h3>
               <p className="text-sg-subtext font-semibold leading-relaxed mb-6 whitespace-pre-wrap">{proj.description}</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-sg-bg/30 p-5 rounded-[20px] border border-sg-border/50">
                 <div className="flex flex-col gap-1.5">
                   <span className="text-[11px] font-bold text-sg-muted uppercase flex items-center gap-1"><MapPin size={12} /> Tọa độ / Vị trí</span>
                   <span className="text-[14px] font-extrabold text-sg-heading">{proj.location}</span>
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <span className="text-[11px] font-bold text-sg-muted uppercase flex items-center gap-1"><Calendar size={12} /> Bàn giao dự kiến</span>
                   <span className="text-[14px] font-extrabold text-sg-heading">{new Date(proj.endDate).toLocaleDateString('vi')}</span>
                 </div>
               </div>
            </div>
         </div>

         {/* Right Details Panel */}
         <div className="flex flex-col gap-6">
            <div className="bg-sg-card/40 backdrop-blur-xl border border-sg-border rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-[15px] font-black text-sg-heading flex items-center gap-2">
                 <User size={18} className="text-cyan-500" /> Nhân sự phụ trách
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-sg-btn-bg rounded-2xl border border-sg-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black shadow-inner">
                    CĐT
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-sg-heading">{proj.developer}</span>
                    <span className="text-[11px] font-bold text-sg-muted mt-0.5">Đơn vị phát triển</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-sg-btn-bg rounded-2xl border border-sg-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center font-black shadow-inner">
                    {proj.managerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-sg-heading">{proj.managerName}</span>
                    <span className="text-[11px] font-bold text-sg-muted mt-0.5">Trưởng phòng Giao dịch</span>
                  </div>
                </div>
                <button className="h-8 px-3 rounded-lg bg-sg-bg hover:bg-white/5 border border-sg-border hover:border-cyan-500/30 text-[11px] font-bold text-cyan-400 transition-colors">LH</button>
              </div>
            </div>

            <div className="bg-sg-card/40 backdrop-blur-xl border border-sg-border rounded-[32px] p-6 shadow-sm">
                <h3 className="text-[15px] font-black text-sg-heading flex items-center gap-2 mb-4 border-b border-sg-border/60 pb-4">
                   Từ khóa định vị
                </h3>
                <div className="flex flex-wrap gap-2">
                  {proj.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-[12px] font-bold shadow-sm">
                      #{tag}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 bg-sg-btn-bg border border-sg-border rounded-lg text-[12px] font-bold text-sg-muted shadow-sm hover:text-sg-heading cursor-pointer transition-colors">+ Thêm tag</span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
