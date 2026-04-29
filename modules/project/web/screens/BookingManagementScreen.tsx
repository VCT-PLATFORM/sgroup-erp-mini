import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { RE_PROPERTY_TYPE } from '../constants';
import { 
  Clock, CheckCircle, XCircle, Search, 
  Phone, User, CreditCard, Building2,
  Plus, MoreHorizontal, Filter, CheckCircle2
} from 'lucide-react';
import type { REBooking, REBookingStatus } from '../types';
import { DepositEntryModal } from '@modules/sales/components/DepositEntryModal';

export function BookingManagementScreen({ filterType }: { filterType?: 'BOOKING' | 'DEPOSIT' }) {
  const { data: bookings, moveBooking, loading } = useBookings();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const COLUMNS: { id: REBookingStatus; label: string; color: string; bg: string; border: string; icon: any }[] = filterType === 'DEPOSIT' ? [
    { id: 'PENDING', label: 'Chờ Xác Nhận', color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: Clock },
    { id: 'CONFIRMED', label: 'Đã Nhận Cọc', color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20', icon: CheckCircle2 },
    { id: 'COMPLETED', label: 'Đã Hoàn Tất Hồ Sơ', color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle },
  ] : [
    { id: 'PENDING', label: 'Chờ Duyệt', color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: Clock },
    { id: 'APPROVED', label: 'Đã Duyệt', color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle },
    { id: 'REJECTED', label: 'Từ Chối', color: 'text-rose-500', bg: 'bg-rose-500/5', border: 'border-rose-500/20', icon: XCircle },
  ];

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

  // Map booking item to the format DepositEntryModal expects as editData
  const mapToEditData = (item: REBooking) => ({
    id: item.id,
    customerName: item.customerName,
    customerPhone: item.customerPhone || '',
    idNumber: '',
    projectName: item.projectName || 'SGroup Royal City',
    unitCode: item.unitCode || '',
    depositAmount: item.amount || 0,
    price: (item as any).price || 0,
    note: (item as any).note || '',
    status: item.status,
    source: item.source,
    type: item.type,
    isAgreementSigned: (item as any).isAgreementSigned || false,
    isContractSigned: (item as any).isContractSigned || false,
  });

  const handleCardClick = (item: REBooking) => {
    setSelectedItem(mapToEditData(item));
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-8 lg:px-12">
      {/* Cinematic Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[32px] font-black text-sg-heading tracking-tighter leading-none">
            {filterType === 'DEPOSIT' ? 'Quản lý Đặt Cọc' : filterType === 'BOOKING' ? 'Quản lý Giữ Chỗ' : 'Quản lý Giao Dịch'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-bold text-sg-subtext">
              {filterType === 'DEPOSIT' ? 'Theo dõi và phê duyệt Đặt Cọc từ bộ phận Kinh Doanh' : filterType === 'BOOKING' ? 'Theo dõi và phê duyệt Giữ Chỗ từ bộ phận Kinh Doanh' : 'Theo dõi và phê duyệt Giữ Chỗ / Đặt Cọc từ bộ phận Kinh Doanh'}
            </span>
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
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4 lg:p-6 custom-scrollbar">
        <div className="grid grid-cols-3 gap-6 h-full min-w-[1000px]">
          {COLUMNS.map((col, colIdx) => {
            const colItems = bookings.filter(b => b.status === col.id && (!filterType || b.type === filterType));
            return (
              <div 
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex flex-col sg-stagger"
                style={{ animationDelay: `${colIdx * 60}ms` }}
              >
                {/* Column header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-3 ${col.border} bg-white/60 dark:bg-black/30 backdrop-blur-xl`}>
                  <div className="flex items-center gap-2">
                    <col.icon size={16} className={col.color} />
                    <span className="text-[13px] font-black text-sg-heading">{col.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${col.color} bg-sg-card/50`}>
                    {colItems.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="flex-1 space-y-3 overflow-y-auto pb-4 custom-scrollbar">
                  {colItems.map((item, idx) => (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={() => setDraggedId(null)}
                      onClick={() => handleCardClick(item)}
                      className={`bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[20px] border border-slate-200/80 dark:border-sg-border p-4 shadow-sg-sm hover:shadow-sg-md hover:-translate-y-1 transition-all cursor-pointer active:cursor-grabbing group relative overflow-hidden sg-stagger ${draggedId === item.id ? 'opacity-40 grayscale' : ''}`}
                      style={{ animationDelay: `${colIdx * 60 + idx * 40}ms` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${col.bg.replace('/5', '/10')} blur-2xl opacity-0 group-hover:opacity-60 transition-opacity`} />
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[18px] font-black text-sg-heading group-hover:text-cyan-500 transition-colors leading-none tracking-tight">{item.unitCode || 'N/A'}</span>
                        {item.type === 'BOOKING' ? (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">Giữ chỗ</span>
                        ) : item.source === 'BOOKING' ? (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">Giữ chỗ ➝ Đặt cọc</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">Khách hàng cọc mới</span>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${col.color} ${col.bg} border ${col.border} shadow-sm shrink-0`}>{col.label}</span>
                    </div>

                    <div className="flex flex-col gap-2 text-[13px] font-medium text-sg-heading mb-4 relative z-10 bg-slate-50/50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                          <User size={12} className="text-slate-500" />
                        </div>
                        <span className="truncate">{item.customerName || 'Chưa có KH'}</span>
                      </div>
                      {item.customerPhone && (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                            <Phone size={10} className="text-slate-500" />
                          </div>
                          <span className="font-mono text-[12px]">{item.customerPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center shrink-0 shadow-sm">
                          <User size={10} className="text-cyan-500" />
                        </div>
                        <span className="text-[12px] font-bold text-cyan-600 dark:text-cyan-400 truncate tracking-wide">{item.staffName || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-200/50 dark:border-sg-border border-dashed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.type === 'BOOKING' ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
                            <CreditCard size={14} className={item.type === 'BOOKING' ? 'text-blue-500' : 'text-orange-500'} />
                          </div>
                          <span className="text-[11px] font-bold text-sg-muted uppercase tracking-wider">{item.type === 'BOOKING' ? 'Tiền Giữ Chỗ' : 'Tiền Cọc'}</span>
                        </div>
                        <p className={`text-[16px] font-black tracking-tight drop-shadow-sm ${item.type === 'BOOKING' ? 'text-blue-500' : 'text-orange-500'}`}>{item.amount >= 1000000 ? `${item.amount / 1000000}M` : `${item.amount}M`}</p>
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

      {/* Deposit Entry Modal — Admin mode */}
      <DepositEntryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
        editData={selectedItem}
        isAdmin={true}
      />
    </div>
  );
}
