import React, { useMemo } from 'react';
import { useProjects, useLegalDocs } from '../hooks/useProjects';
import { RE_LEGAL_PROCEDURE_STATUS } from '../constants';
import { RELegalProcedureStatus } from '../types';
import { FileText, Plus, Search, Calendar, FolderClock } from 'lucide-react';
import { legalDocApi } from '../api/projectApi';

export function LegalKanbanScreen() {
  const { data: legalDocs, refetch } = useLegalDocs();
  const { data: projects } = useProjects();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const columns = useMemo(() => {
    const cols: Record<RELegalProcedureStatus, typeof legalDocs> = {
      PREPARATION: [],
      SUBMITTED: [],
      ISSUE_FIXING: [],
      APPROVED: []
    };
    legalDocs.forEach(doc => {
      if (cols[doc.status]) {
        cols[doc.status].push(doc);
      }
    });
    return cols;
  }, [legalDocs]);

  const handleDragStart = (e: React.DragEvent, docId: string, projectId: string) => {
    e.dataTransfer.setData('docId', docId);
    e.dataTransfer.setData('projectId', projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const docId = e.dataTransfer.getData('docId');
    const projectId = e.dataTransfer.getData('projectId');
    
    if (!docId || !projectId) return;

    try {
      setIsUpdating(true);
      await legalDocApi.updateStatus(projectId, docId, newStatus);
      refetch();
    } catch(err: any) {
      alert(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative z-10 overflow-hidden">
      
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-8 border-b border-sg-border/60 bg-sg-card/30 backdrop-blur-md relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit mb-2 shadow-sm">
               <FileText size={14} className="text-rose-500 drop-shadow-sm" />
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none mt-0.5">Legal Pipeline</span>
            </div>
            <h2 className="text-[28px] sm:text-[32px] font-black text-sg-heading tracking-tight drop-shadow-md">Tiến Độ Pháp Lý</h2>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group hidden sm:block">
              <div className="absolute inset-0 bg-linear-to-r from-rose-500/0 via-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
              <div className="relative flex items-center h-11 bg-sg-card/80 backdrop-blur-xl border border-sg-border hover:border-rose-500/30 rounded-xl px-4 transition-colors w-64 shadow-sm">
                <Search size={16} className="text-sg-muted group-hover:text-rose-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Tìm số công văn, hồ sơ..." 
                  className="bg-transparent border-none outline-none ml-3 text-[13px] font-bold text-sg-heading w-full placeholder:text-sg-muted"
                />
              </div>
            </div>
            
            <button className="h-11 px-5 flex items-center gap-2 bg-linear-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 rounded-xl transition-all shadow-[0_8px_24px_rgba(244,63,94,0.25)] hover:shadow-[0_12px_32px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
              <Plus size={18} className="text-white relative z-10" />
              <span className="text-[13px] font-black text-white relative z-10">Tạo Hồ Sơ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-sg-bg/30">
        <div className="h-full px-4 sm:px-8 lg:px-10 py-6 min-w-max flex gap-6 items-start">
          
          {(Object.entries(RE_LEGAL_PROCEDURE_STATUS) as [RELegalProcedureStatus, any][]).map(([statusString, statusCfg]) => {
            const status = statusString as RELegalProcedureStatus;
            const columnDocs = columns[status] || [];

            return (
              <div 
                key={status} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
                className={`w-[340px] flex flex-col h-full bg-sg-card/40 backdrop-blur-2xl rounded-sg-2xl border border-sg-border/60 shadow-[0_8px_32px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Column Header */}
                <div className={`p-5 flex items-center justify-between border-b border-sg-border/60 relative overflow-hidden`}>
                   <div className={`absolute top-0 left-0 right-0 h-1 ${statusCfg.bg}`} />
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-inner ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                       <FolderClock size={16} strokeWidth={2.5} />
                     </div>
                     <h3 className="text-[15px] font-black text-sg-heading tracking-wide drop-shadow-sm">{statusCfg.label}</h3>
                   </div>
                   <div className={`px-2.5 py-1 rounded-lg text-[12px] font-black border shadow-inner bg-sg-bg ${statusCfg.color} ${statusCfg.border}`}>
                     {columnDocs.length}
                   </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {columnDocs.map(doc => {
                    const docProject = projects.find(p => p.id === doc.projectId);
                    return (
                      <div 
                        key={doc.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, doc.id, doc.projectId)}
                        className="bg-sg-card/80 backdrop-blur-xl border border-sg-border rounded-sg-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-rose-500/30 transition-all cursor-grab active:cursor-grabbing group hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-inner ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                            {docProject?.code || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <h4 className="text-[15px] font-black text-sg-heading leading-tight group-hover:text-rose-500 transition-colors drop-shadow-sm">{doc.title}</h4>
                          <p className="text-[12px] font-bold text-sg-muted mt-2 line-clamp-2 leading-relaxed">{doc.description}</p>
                        </div>

                        <div className="pt-4 border-t border-sg-border/60 flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-1.5 bg-sg-bg border border-sg-border px-2 py-1.5 rounded-lg shadow-inner">
                              <Calendar size={12} className="text-sg-muted" />
                              <span className="text-[11px] font-bold text-sg-subtext">{doc.submitDate ? new Date(doc.submitDate).toLocaleDateString('vi') : 'Chưa nộp'}</span>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 border border-white/10 shadow-sm flex items-center justify-center text-white text-[10px] font-black">
                              {doc.assigneeName ? doc.assigneeName.slice(0, 2).toUpperCase() : 'NA'}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
