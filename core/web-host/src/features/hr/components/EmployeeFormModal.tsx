import React from 'react';
import { X, UsersRound, History, ArrowRightLeft } from 'lucide-react';
import { Department, Position, Team, TransferRecord } from '../types';
import { STATUS_OPTIONS } from '../constants';

export interface EmployeeFormData {
  fullName: string;
  englishName: string;
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  teamId: string;
  status: typeof STATUS_OPTIONS[number]['value'];
}

export interface EmployeeFormModalProps {
  mode: 'create' | 'edit';
  form: EmployeeFormData;
  setForm: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  deptOptions: Department[];
  posOptions: Position[];
  teamOptions: Team[];
  transfers: TransferRecord[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDeptChange: (deptId: string) => void;
}

export function EmployeeFormModal({
  mode,
  form,
  setForm,
  deptOptions,
  posOptions,
  teamOptions,
  transfers,
  isSaving,
  onClose,
  onSubmit,
  onDeptChange
}: EmployeeFormModalProps) {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-8 animate-sg-fade-in bg-sg-heading/40 backdrop-blur-md">
      {/* Overlay to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-[560px] max-h-[90vh] flex flex-col bg-sg-portal-bg rounded-sg-2xl border border-sg-border/50 shadow-sg-xl animate-sg-slide-up overflow-hidden ring-1 ring-white/50 dark:ring-white/5">
         
         {/* Modal Header */}
         <div className="px-8 pt-8 pb-4 flex items-center justify-between z-10 bg-sg-portal-bg shrink-0">
            <h3 className="text-2xl font-black tracking-tight text-sg-heading">
               {mode === 'edit' ? 'Chỉnh sửa hồ sơ' : 'Thêm hồ sơ nhân viên'}
            </h3>
            <button onClick={onClose} className="p-2 -mr-2 text-sg-muted hover:bg-sg-border rounded-full transition-all hover:rotate-90">
              <X size={20} strokeWidth={2.5} />
            </button>
         </div>

         {/* Modal Body */}
         <div className="px-8 pb-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-sg-border [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Họ và tên <span className="text-sg-red">*</span></label>
               <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Nguyễn Văn A" className="h-11 w-full bg-white dark:bg-white/5 border border-sg-border/50 rounded-xl px-4 text-[14px] font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-sg-red focus:ring-4 focus:ring-sg-red/10 shadow-sm transition-all" />
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Tên tiếng Anh</label>
               <input value={form.englishName} onChange={e => setForm(f => ({ ...f, englishName: e.target.value }))} placeholder="Nguyen Van A" className="h-11 w-full bg-white dark:bg-white/5 border border-sg-border/50 rounded-xl px-4 text-[14px] font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-sg-red focus:ring-4 focus:ring-sg-red/10 shadow-sm transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 items-start">
                 <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Email</label>
                 <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@sgroup.vn" type="email" className="h-11 w-full bg-white dark:bg-white/5 border border-sg-border/50 rounded-xl px-4 text-[14px] font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-sg-red focus:ring-4 focus:ring-sg-red/10 shadow-sm transition-all" />
              </div>
              <div className="flex flex-col gap-2 items-start">
                 <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Số điện thoại</label>
                 <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0901234567" type="tel" className="h-11 w-full bg-white dark:bg-white/5 border border-sg-border/50 rounded-xl px-4 text-[14px] font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-sg-red focus:ring-4 focus:ring-sg-red/10 shadow-sm transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Phòng ban</label>
              <div className="flex flex-wrap gap-2">
                 {deptOptions.map(d => (
                   <button
                     key={d.id}
                     onClick={() => onDeptChange(d.id)}
                     className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all shadow-sm
                       ${form.departmentId === d.id ? 'bg-sg-red/10 text-sg-red-dark border-sg-red/30 hover:bg-sg-red/15 dark:bg-sg-red/20 dark:text-sg-red-light dark:border-sg-red/30' : 'bg-white dark:bg-white/5 border-sg-border/50 text-sg-subtext hover:bg-slate-50 dark:hover:bg-white/10 hover:text-sg-heading hover:border-sg-border'}
                     `}
                   >
                     {d.name}
                   </button>
                 ))}
              </div>
            </div>

            {form.departmentId && teamOptions.length > 0 && (
              <div className="flex flex-col gap-2 animate-sg-fade-in-up">
                <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70 flex items-center gap-1.5"><UsersRound size={12} strokeWidth={2.5}/> Thuộc Team</label>
                <div className="flex flex-wrap gap-2">
                   <button
                     onClick={() => setForm(f => ({ ...f, teamId: '' }))}
                     className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all shadow-sm
                       ${!form.teamId ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30' : 'bg-white dark:bg-white/5 border-sg-border/50 text-sg-subtext hover:bg-slate-50 dark:hover:bg-white/10 hover:text-sg-heading hover:border-sg-border'}
                     `}
                   >
                     Không gắn
                   </button>
                   {teamOptions.map(t => (
                     <button
                       key={t.id}
                       onClick={() => setForm(f => ({...f, teamId: f.teamId === t.id ? '' : t.id}))}
                       className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all shadow-sm
                         ${form.teamId === t.id ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30' : 'bg-white dark:bg-white/5 border-sg-border/50 text-sg-subtext hover:bg-slate-50 dark:hover:bg-white/10 hover:text-sg-heading hover:border-sg-border'}
                       `}
                     >
                       {t.name}
                     </button>
                   ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Chức vụ</label>
              <div className="flex flex-wrap gap-2">
                 {posOptions.map(p => (
                   <button
                     key={p.id}
                     onClick={() => setForm(f => ({...f, positionId: f.positionId === p.id ? '' : p.id}))}
                     className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all shadow-sm
                       ${form.positionId === p.id ? 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30' : 'bg-white dark:bg-white/5 border-sg-border/50 text-sg-subtext hover:bg-slate-50 dark:hover:bg-white/10 hover:text-sg-heading hover:border-sg-border'}
                     `}
                   >
                     {p.name}
                   </button>
                 ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-sg-border/30">
              <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70">Trạng thái làm việc</label>
              <div className="flex flex-wrap gap-2">
                 {STATUS_OPTIONS.map(s => (
                   <button
                     key={s.value}
                     onClick={() => setForm(f => ({...f, status: s.value as any}))}
                     className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all shadow-sm
                       ${form.status === s.value ? `${s.bg} ${s.border} ${s.color} hover:scale-105` : 'bg-white dark:bg-white/5 border-sg-border/50 text-sg-subtext hover:border-sg-heading/30 hover:text-sg-heading'}
                     `}
                   >
                     {s.label}
                   </button>
                 ))}
              </div>
            </div>

            {mode === 'edit' && transfers.length > 0 && (
               <div className="flex flex-col gap-2 pt-4 border-t border-sg-border/30">
                 <label className="text-[10px] font-black uppercase tracking-widest text-sg-subtext/70 flex items-center gap-1.5"><History size={12} strokeWidth={2.5}/> Lịch sử luân chuyển ({transfers.length})</label>
                 <div className="border border-sg-border/50 rounded-2xl overflow-hidden bg-white dark:bg-white/5 shadow-sm">
                    {transfers.map((t, idx) => (
                       <div key={t.id} className={`p-4 flex items-center gap-4 hover:bg-black/5 transition-colors ${idx < transfers.length - 1 ? 'border-b border-sg-border/50' : ''}`}>
                          <div className="w-9 h-9 rounded-full bg-sg-btn-bg flex items-center justify-center border border-sg-border/50">
                             <ArrowRightLeft size={14} strokeWidth={2.5} className="text-sg-muted" />
                          </div>
                          <div className="flex-1">
                             {(t.transferType === 'DEPARTMENT' || t.transferType === 'BOTH') && (
                                <span className="text-[13px] font-extrabold text-sg-heading block">{t.fromDepartment?.name || '—'} <ArrowRightLeft size={10} className="inline mx-1 text-sg-muted" /> {t.toDepartment?.name || '—'}</span>
                             )}
                             {(t.transferType === 'TEAM' || t.transferType === 'BOTH') && (
                                <span className="text-[12px] font-bold text-indigo-500 block mt-0.5">Team: {t.fromTeam?.name || '—'} → {t.toTeam?.name || '—'}</span>
                             )}
                             <span className="text-[10px] font-bold text-sg-subtext/70 uppercase tracking-wider mt-1 block">
                               {new Date(t.effectiveDate).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
               </div>
            )}

         </div>

         {/* Modal Footer */}
         <div className="px-8 pb-8 pt-4 flex gap-4 shrink-0 bg-sg-portal-bg rounded-b-sg-2xl">
            <button onClick={onClose} className="flex-1 h-12 rounded-2xl border border-sg-border/50 bg-white dark:bg-white/5 text-sg-subtext font-bold text-[14px] hover:text-sg-heading hover:border-sg-heading/30 transition-all shadow-sm">
               Hủy bỏ
            </button>
            <button onClick={onSubmit} disabled={isSaving} className={`flex-2 h-12 rounded-2xl font-black text-[14px] text-white transition-all shadow-sg-brand
              ${isSaving ? 'bg-sg-muted cursor-not-allowed' : 'bg-sg-red hover:bg-sg-red-light transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'}
            `}>
               {isSaving ? 'ĐANG LƯU...' : mode === 'edit' ? 'CẬP NHẬT HỒ SƠ' : 'TẠO MỚI HỒ SƠ'}
            </button>
         </div>
      </div>
    </div>
  );
}
