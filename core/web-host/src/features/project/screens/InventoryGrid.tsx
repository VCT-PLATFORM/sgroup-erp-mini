import React, { useState } from 'react';
import { useProjects, useInventory } from '../hooks/useProjects';
import { RE_INVENTORY_STATUS, RE_PROPERTY_TYPE } from '../constants';
import { Search, Filter, Grid, LayoutList, Download, ArrowUpRight } from 'lucide-react';

export function InventoryGrid() {
  const { data: inventory } = useInventory();
  const { data: projects } = useProjects();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  const filtered = inventory.filter(inv => {
    const matchSearch = inv.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchProj = projectFilter === 'ALL' || inv.projectId === projectFilter;
    return matchSearch && matchStatus && matchProj;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative z-10 overflow-hidden p-4 sm:p-8 lg:px-10">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit mb-2">
             <Grid size={14} className="text-cyan-500" />
             <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Master Inventory</span>
          </div>
          <h2 className="text-[32px] font-black text-sg-heading tracking-tight drop-shadow-md">Rổ Hàng Tổng</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
            <div className="relative flex items-center h-12 bg-sg-card/80 backdrop-blur-xl border border-sg-border hover:border-cyan-500/30 rounded-xl px-4 transition-colors w-64 shadow-sm">
              <Search size={18} className="text-sg-muted group-hover:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tra cứu mã căn..." 
                className="bg-transparent border-none outline-none ml-3 text-[14px] font-semibold text-sg-heading w-full placeholder:text-sg-muted"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <select 
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="h-12 px-4 pr-10 bg-sg-card/80 backdrop-blur-xl border border-sg-border rounded-xl text-[14px] font-bold text-sg-heading appearance-none cursor-pointer focus:outline-none hover:border-cyan-500/30 transition-colors shadow-sm"
          >
            <option value="ALL">Tất cả Dự án</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-12 px-4 pr-10 bg-sg-card/80 backdrop-blur-xl border border-sg-border rounded-xl text-[14px] font-bold text-sg-heading appearance-none cursor-pointer focus:outline-none hover:border-cyan-500/30 transition-colors shadow-sm"
          >
            <option value="ALL">Tình trạng</option>
            {Object.entries(RE_INVENTORY_STATUS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <div className="h-12 flex items-center bg-sg-card/80 backdrop-blur-xl border border-sg-border rounded-xl p-1 shadow-sm">
             <button 
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/10 text-cyan-500 font-bold' : 'text-sg-subtext hover:bg-sg-bg hover:text-sg-heading'}`}
             >
                <Grid size={18} />
             </button>
             <button 
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-cyan-500/10 text-cyan-500 font-bold' : 'text-sg-subtext hover:bg-sg-bg hover:text-sg-heading'}`}
             >
                <LayoutList size={18} />
             </button>
          </div>
          
          <button className="h-12 w-12 flex items-center justify-center bg-sg-card/80 backdrop-blur-xl border border-sg-border hover:border-cyan-500/30 rounded-xl transition-all shadow-sm group">
            <Download size={20} className="text-cyan-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
          {filtered.map(item => {
            const statusCfg = RE_INVENTORY_STATUS[item.status] || RE_INVENTORY_STATUS.AVAILABLE;
            const typeCfg = RE_PROPERTY_TYPE[item.type] || RE_PROPERTY_TYPE.APARTMENT;
            const projName = projects.find(p => p.id === item.projectId)?.code || 'N/A';
            
            return (
              <div key={item.id} className="bg-sg-card/70 backdrop-blur-xl border border-sg-border rounded-[24px] p-5 flex flex-col gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all cursor-pointer relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full ${statusCfg.bg} blur-[20px] opacity-30 group-hover:opacity-70 transition-opacity`} />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[20px] font-black tracking-tight text-sg-heading group-hover:text-cyan-500 transition-colors drop-shadow-sm">{item.code}</span>
                    <span className="text-[11px] font-bold text-sg-muted uppercase tracking-wider">{projName} • {typeCfg.label}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-sg-bg border border-sg-border flex items-center justify-center text-sg-muted group-hover:text-cyan-500 group-hover:bg-cyan-500/10 transition-colors">
                     <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-1.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-sg-subtext">Diện tích</span>
                    <span className="text-[13px] font-black text-sg-heading">{item.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-sg-subtext">Giá (VND)</span>
                    <span className="text-[13px] font-black text-emerald-500 drop-shadow-sm">{(item.price / 1000000000).toFixed(2)} Tỷ</span>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-sg-border/60 relative z-10 flex items-center justify-between">
                   <div className="flex flex-col">
                     {item.status === 'SOLD' && item.salespersonId && (
                       <span className="text-[11px] font-extrabold text-sg-heading truncate max-w-[100px]" title="Saleman">Seller ID {item.salespersonId}</span>
                     )}
                     {item.status === 'RESERVED' && (
                       <span className="text-[11px] font-extrabold text-amber-500">Giữ chỗ 50tr</span>
                     )}
                   </div>
                   <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-sm ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                     {statusCfg.label}
                   </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
