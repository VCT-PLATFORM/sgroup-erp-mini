import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { RE_PROPERTY_TYPE } from '../constants';
import { 
  Clock, CheckCircle, XCircle, Search, 
  Phone, User, CreditCard, Building2,
  Plus, MoreHorizontal, Filter
} from 'lucide-react';
import type { REBooking, REBookingStatus } from '../types';

const COLUMNS: { id: REBookingStatus; label: string; color: string; bg: string; border: string; icon: any }[] = [
  { id: 'PENDING', label: 'Chờ Duyệt', color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: Clock },
  { id: 'APPROVED', label: 'Đã Duyệt', color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle },
  { id: 'REJECTED', label: 'Từ Chối', color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/20', icon: XCircle },
];

export function BookingManagementScreen() {
  const { data: bookings, moveBooking, loading } = useBookings();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('bookingId', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: REBookingStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('bookingId');
    if (id) {
      moveBooking(id, status);
    }
    setDraggedId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-8 lg:px-12">
      {/* Cinematic Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[32px] font-black text-sg-heading tracking-tighter leading-none">Quản lý Giữ Chỗ</h2>
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-bold text-sg-subtext">Theo dõi và phê duyệt lệnh giữ chỗ từ hệ thống</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm lệnh..." 
              className="h-11 pl-10 pr-4 bg-white dark:bg-black/20 border border-sg-border rounded-xl text-[13px] font-semibold text-sg-heading focus:outline-none focus:border-cyan-500/50 transition-all w-64"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sg-muted" />
          </div>
          <button className="h-11 px-4 flex items-center gap-2 bg-sg-btn-bg border border-sg-border rounded-xl text-sg-heading hover:bg-sg-bg transition-all">
            <Filter size={16} />
            <span className="text-[13px] font-bold">Lọc</span>
          </button>
          <button className="h-11 w-11 flex items-center justify-center bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg hover:shadow-cyan-500/30 transition-all">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        {COLUMNS.map(col => {
          const colItems = bookings.filter(b => b.status === col.id);
          return (
            <div 
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="w-[380px] flex-shrink-0 flex flex-col h-full rounded-[24px] bg-slate-50/50 dark:bg-black/20 border border-sg-border/50"
            >
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-white dark:bg-sg-card border border-sg-border shadow-sm px-4 py-2.5 rounded-2xl w-full">
                  <col.icon size={18} className={col.color} />
                  <span className="text-[14px] font-black text-sg-heading tracking-tight">{col.label}</span>
                  <span className={`ml-auto text-[13px] font-black ${col.color}`}>{colItems.length}</span>
                </div>
              </div>

              {/* Column Items */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4 custom-scrollbar">
                {colItems.map(item => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={`bg-white dark:bg-black/40 border border-sg-border/60 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-grab active:cursor-grabbing ${draggedId === item.id ? 'opacity-40 grayscale' : ''}`}
                  >
                    {/* Status indicator line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${col.bg.replace('/5', '/40')}`} />
                    
                    {/* Project & Tag */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col">
                        <h4 className="text-[16px] font-black text-sg-heading leading-tight group-hover:text-cyan-500 transition-colors">{item.projectName}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${col.bg.replace('/5', '/15')} ${col.color} ${col.border}`}>
                        {col.label}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-col gap-2 mb-5">
                      <div className="flex items-center gap-2 text-sg-subtext">
                        <User size={14} className="text-sg-muted" />
                        <span className="text-[13px] font-bold">{item.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sg-subtext">
                        <Phone size={14} className="text-sg-muted" />
                        <span className="text-[12px] font-semibold">{item.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-2 py-1 bg-cyan-500/10 rounded-lg flex items-center gap-1.5 border border-cyan-500/20">
                           <User size={10} className="text-cyan-500" />
                           <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400">{item.staffName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-4 border-t border-sg-border/60 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-sg-muted uppercase tracking-widest">Số Tiền</span>
                          <span className="text-[16px] font-black text-blue-600 dark:text-blue-400 leading-none mt-1">{item.amount}M</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-sg-muted uppercase tracking-widest">Nhân Sự</span>
                          <span className="text-[13px] font-black text-sg-heading leading-none mt-1">{item.staffName}</span>
                       </div>
                    </div>
                  </div>
                ))}
                {colItems.length === 0 && (
                   <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-sg-border/40 rounded-[32px] opacity-40 grayscale">
                      <Building2 size={40} className="text-sg-muted mb-3" />
                      <span className="text-[13px] font-bold text-sg-muted">Trống</span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
