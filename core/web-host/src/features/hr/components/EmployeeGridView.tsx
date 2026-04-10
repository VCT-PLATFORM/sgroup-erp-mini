import React from 'react';
import { Hash, Phone, Building, Mail, UsersRound, Pencil } from 'lucide-react';
import { Employee } from '../types';
import { getInitials, nameToColorClass, STATUS_OPTIONS } from '../constants';

export interface EmployeeGridViewProps {
  employees: Employee[];
  canEdit: boolean;
  onEdit: (employee: Employee) => void;
}

export function EmployeeGridView({ employees, canEdit, onEdit }: EmployeeGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {employees.map((staff) => {
        const clr = nameToColorClass(staff.fullName || '');
        const st = STATUS_OPTIONS.find(s => s.value === staff.status) || STATUS_OPTIONS[0];
        
        return (
          <div key={staff.id} onClick={() => window.location.hash = `hr_profile?id=${staff.id}`} className="bg-sg-card border border-sg-border rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative">
             {/* Top Accent Bar */}
             <div className={`h-1.5 w-full bg-gradient-to-r ${clr.bg.replace('/15', '')} opacity-40`} />
             
             <div className="p-6">
                {/* Identity Row */}
                <div className="flex items-start gap-4 mb-5">
                   <div className={`w-[56px] h-[56px] rounded-[18px] flex flex-shrink-0 items-center justify-center ${clr.bg} border border-sg-border`}>
                      <span className={`text-[18px] font-black ${clr.text}`}>{getInitials(staff.fullName || '')}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-[17px] font-extrabold text-sg-heading truncate mb-0.5 group-hover:text-sg-red transition-colors">{staff.fullName}</h4>
                      {staff.englishName && <span className="text-[13px] font-semibold italic text-sg-subtext truncate block mb-1">{staff.englishName}</span>}
                      <div className="flex items-center gap-1.5 text-sg-muted">
                        <Hash size={13} />
                        <span className="text-[12px] font-bold">{staff.employeeCode}</span>
                      </div>
                   </div>
                </div>

                {/* Meta tags */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                   <span className="px-3 py-1.5 rounded-xl bg-sg-btn-bg border border-sg-border text-[11px] font-black text-sg-heading uppercase tracking-wide">
                      {staff.position?.name || 'Staff'}
                   </span>
                   <span className={`px-2.5 py-1 rounded-xl border ${st.bg} ${st.border} ${st.color} text-[10px] font-black uppercase tracking-wide ml-auto`}>
                      {st.label}
                   </span>
                </div>

                {/* Department */}
                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-sg-border">
                   <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Building size={14} className="text-indigo-500" />
                   </div>
                   <span className="text-[14px] font-extrabold text-sg-heading flex-1 truncate">{staff.department?.name || '—'}</span>
                   {staff.team?.name && (
                     <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sg-btn-bg border border-sg-border">
                        <UsersRound size={12} className="text-sg-muted" />
                        <span className="text-[11px] font-bold text-sg-subtext">{staff.team.name}</span>
                     </div>
                   )}
                </div>

                {/* Contact */}
                <div className="flex gap-3">
                   <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-sg-btn-bg border border-sg-border" title={staff.email}>
                      <Mail size={16} className="text-blue-500 flex-shrink-0" />
                      <span className="text-[13px] font-bold text-sg-heading truncate">{staff.email || '—'}</span>
                   </div>
                   <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-sg-btn-bg border border-sg-border">
                      <Phone size={16} className="text-purple-500 flex-shrink-0" />
                      <span className="text-[13px] font-bold text-sg-heading truncate">{staff.phone || '—'}</span>
                   </div>
                </div>

                {canEdit && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); onEdit(staff); }} 
                     className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-sg-card border border-sg-border shadow-sm flex items-center justify-center text-sg-muted hover:text-sg-red hover:border-sg-red/30 transition-all opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                   >
                     <Pencil size={16} />
                   </button>
                )}
             </div>
          </div>
        )
      })}
    </div>
  );
}
