import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { RE_PROJECT_STATUS, RE_PROPERTY_TYPE } from '../constants';
import { Search, Filter, MoreHorizontal, Calendar, Target, Plus, Users, Building2, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { projectApi } from '../api/projectApi';
import type { REProject } from '../types';

export function ProjectListScreen() {
  const { data: projects, refetch } = useProjects();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<REProject | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit = (proj: REProject) => {
    setEditTarget(proj);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = async (proj: REProject) => {
    if (!confirm(`Xác nhận xoá dự án "${proj.name}"?`)) return;
    try {
      await projectApi.delete(proj.id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Không thể xoá dự án');
    }
    setMenuOpen(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative z-10 overflow-hidden p-4 sm:p-8 lg:px-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit mb-2">
             <Building2 size={14} className="text-cyan-500" />
             <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Danh mục Bất động sản</span>
          </div>
          <h2 className="text-[32px] font-black text-sg-heading tracking-tight drop-shadow-md">Quản lý Dự Án</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
            <div className="relative flex items-center h-12 bg-sg-card/80 backdrop-blur-xl border border-sg-border hover:border-cyan-500/30 rounded-xl px-4 transition-colors w-72 shadow-sm">
              <Search size={18} className="text-sg-muted group-hover:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm tên, mã dự án..." 
                className="bg-transparent border-none outline-none ml-3 text-[14px] font-semibold text-sg-heading w-full placeholder:text-sg-muted"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative hidden sm:block">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-12 px-4 pr-10 bg-sg-card/80 backdrop-blur-xl border border-sg-border rounded-xl text-[14px] font-bold text-sg-heading appearance-none cursor-pointer focus:outline-none hover:border-cyan-500/30 transition-colors shadow-sm"
            >
              <option value="ALL">Tất cả Trạng thái</option>
              {Object.entries(RE_PROJECT_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-sg-muted pointer-events-none" />
          </div>

          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="h-12 px-6 flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-[0_8px_24px_rgba(6,182,212,0.25)] hover:shadow-[0_12px_32px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
            <Plus size={20} className="text-white relative z-10" />
            <span className="text-[14px] font-black text-white relative z-10 hidden sm:inline">Thêm Dự án mới</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-sg-card/30 backdrop-blur-xl p-12 rounded-sg-2xl border border-sg-border">
            <div className="w-16 h-16 mx-auto rounded-[20px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <Building2 size={28} className="text-cyan-500" />
            </div>
            <h3 className="text-lg font-black text-sg-heading mb-2">Chưa có dự án nào</h3>
            <p className="text-[13px] font-bold text-sg-muted mb-6">Bắt đầu bằng cách tạo dự án BĐS đầu tiên</p>
            <button
              onClick={() => { setEditTarget(null); setShowForm(true); }}
              className="h-11 px-6 flex items-center gap-2 mx-auto bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-black text-[14px] shadow-lg"
            >
              <Plus size={18} /> Tạo Dự Án
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(proj => {
              const statusCfg = RE_PROJECT_STATUS[proj.status] || RE_PROJECT_STATUS.UPCOMING;
              const typeCfg = RE_PROPERTY_TYPE[proj.type] || RE_PROPERTY_TYPE.LAND;
              const soldPercent = proj.totalUnits > 0 ? Math.round((proj.soldUnits / proj.totalUnits) * 100) : 0;
              return (
                <div key={proj.id} className="relative group perspective-[1000px]">
                  <div className="bg-sg-card/60 backdrop-blur-2xl rounded-sg-2xl border border-sg-border p-7 flex flex-col gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 relative overflow-hidden">
                    
                    {/* Glass Shimmers */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full ${statusCfg.bg} blur-[50px] opacity-20 group-hover:opacity-60 transition-opacity duration-700`} />
                    
                    {/* Status Banner Area */}
                    <div className="flex items-start justify-between relative z-10">
                      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border shadow-inner ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Target size={24} strokeWidth={2.5} />
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                          {statusCfg.label}
                        </span>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === proj.id ? null : proj.id); }}
                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-sg-btn-bg text-sg-muted hover:text-sg-heading transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {menuOpen === proj.id && (
                            <div className="absolute right-0 top-10 w-40 bg-sg-card border border-sg-border rounded-xl shadow-2xl overflow-hidden z-50">
                              <button onClick={() => handleEdit(proj)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-[13px] font-bold text-sg-heading hover:bg-cyan-500/10 transition-colors">
                                <Edit2 size={14} className="text-cyan-500" /> Chỉnh sửa
                              </button>
                              <button onClick={() => handleDelete(proj)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-[13px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors border-t border-sg-border/50">
                                <Trash2 size={14} /> Xoá dự án
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col relative z-10">
                      <Link to={`/ProjectModule/board?id=${proj.id}`} className="text-[20px] font-black text-sg-heading tracking-tight hover:text-cyan-500 transition-colors line-clamp-1 drop-shadow-sm">
                        {proj.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-sm ${typeCfg.bg} ${typeCfg.color} ${typeCfg.border}`}>
                           {typeCfg.label}
                        </span>
                        <span className="text-[12px] font-bold text-sg-muted bg-sg-btn-bg px-2 py-0.5 rounded border border-sg-border">{proj.code}</span>
                      </div>
                    </div>

                    {/* Sales Progress */}
                    <div className="flex flex-col gap-2.5 relative z-10">
                      <div className="flex items-center gap-2 text-[13px] font-bold text-sg-subtext">
                        <MapPin size={14} className="text-sg-muted" />
                        <span className="line-clamp-1">{proj.location}</span>
                      </div>
                      <div className="bg-sg-btn-bg px-3 py-2.5 rounded-xl border border-sg-border">
                        <div className="flex items-center justify-between text-[12px] font-bold text-sg-subtext mb-2">
                          <span>Đã bán</span>
                          <span className="text-sg-heading font-black">{proj.soldUnits}/{proj.totalUnits} ({soldPercent}%)</span>
                        </div>
                        <div className="h-2 bg-sg-bg rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${soldPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 mt-auto border-t border-sg-border/60 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-[10px] bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                          <Users size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-sg-muted">Phụ trách</span>
                          <span className="text-[13px] font-extrabold text-sg-heading leading-tight truncate max-w-[120px]">{proj.managerName || 'Chưa gán'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-sg-muted" title="Mở bán dự kiến">
                        <Calendar size={14} />
                        <span className="text-[12px] font-bold">{proj.startDate ? new Date(proj.startDate).toLocaleDateString('vi-VN') : 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Modal */}
      <ProjectFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTarget(null); }}
        onSuccess={refetch}
        editProject={editTarget}
      />
    </div>
  );
}
