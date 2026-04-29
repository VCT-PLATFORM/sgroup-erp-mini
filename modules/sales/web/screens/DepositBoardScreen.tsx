import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShieldCheck, Clock, CheckCircle2,
  XCircle, RefreshCw, User, DollarSign, Building2,
  Undo2, Plus, Phone, Edit3, ChevronDown, Users
} from 'lucide-react';
import { useSalesRole } from '../components/shared/RoleContext';
import { salesOpsApi } from '../api/salesApi';

import { DepositEntryModal } from '../components/DepositEntryModal';
import {
  CinematicDrawer, DrawerSection, DrawerHeroCard, DrawerDetailRow,
  SkeletonCard, DateFilter, filterByDateRange
} from '../components/shared';
import { formatVND } from '../hooks/useSalesData';

// ═══════════════════════════════════════════════════════════
// DEPOSIT BOARD SCREEN — Productivity Tracking
// Neo-Glassmorphism v2.2 • sg-stagger animations
// ═══════════════════════════════════════════════════════════

const COLUMNS = [
  { key: 'PENDING', label: 'Chờ Xác Nhận', icon: <Clock size={16} />, color: 'text-amber-500', borderColor: 'border-amber-500/20', glowColor: 'bg-amber-500' },
  { key: 'CONFIRMED', label: 'Đã Nhận Cọc', icon: <CheckCircle2 size={16} />, color: 'text-emerald-500', borderColor: 'border-emerald-500/20', glowColor: 'bg-emerald-500' },
  { key: 'COMPLETED', label: 'Đã Hoàn Tất Hồ Sơ', icon: <ShieldCheck size={16} />, color: 'text-blue-500', borderColor: 'border-blue-500/20', glowColor: 'bg-blue-500' },
];

export interface BoardItem {
  id: string;
  unitCode: string;
  projectName: string;
  customerName: string;
  customerPhone: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
  staffName: string;
  teamName: string;
  depositAmount: number;
  source?: 'BOOKING' | 'DIRECT';
}

function StaffSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const selected = options.find(o => o.value === value)?.label || 'Tất cả nhân sự';
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/50 dark:bg-black/40 border border-sg-border rounded-xl px-3 py-2.5 outline-none hover:bg-white/80 dark:hover:bg-black/60 transition-colors shrink-0 focus:ring-2 focus:ring-blue-500/20">
        <User size={14} className="text-sg-muted" />
        <span className="text-[12px] font-bold text-sg-heading min-w-[100px] text-left truncate">{selected}</span>
        <ChevronDown size={14} className={`text-sg-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 min-w-[220px] bg-white/90 dark:bg-black/90 backdrop-blur-3xl border border-sg-border rounded-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] z-[100] overflow-hidden">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
            {options.map(opt => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg text-[13px] font-bold transition-colors ${value === opt.value ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-sg-heading hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DepositBoardScreen({ mode = 'personal' }: { mode?: 'personal' | 'team' }) {
  const { role } = useSalesRole();
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BoardItem | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | null, to: Date | null }>({ from: null, to: null });
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await salesOpsApi.listDeposits();
      let data = res.data as unknown as BoardItem[];

      // Personal mode: only show current user's items
      if (mode === 'personal' || role === 'sales_staff') {
        data = data.filter(d => (d as any).staffId === 'S1');
      } else if (role === 'sales_manager') {
        if (filterTeam !== 'all') {
          data = data.filter(d => (d as any).teamId === filterTeam);
        } else {
          data = data.filter(d => (d as any).teamId === 'T1' || (d as any).staffId === 'S1');
        }
      }
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const teamOptions = React.useMemo(() => {
    const teams = [...new Set(items.map(i => i.teamName).filter(Boolean))];
    return [{ label: 'Tất cả Team', value: 'all' }, ...teams.map(t => ({ label: t, value: t }))];
  }, [items]);

  const staffOptions = React.useMemo(() => {
    let source = items;
    if (filterTeam !== 'all') {
      source = source.filter(i => i.teamName === filterTeam);
    }
    const names = [...new Set(source.map(i => i.staffName).filter(Boolean))];
    return [{ label: 'Tất cả nhân sự', value: 'all' }, ...names.map(n => ({ label: n, value: n }))];
  }, [items, filterTeam]);

  const filteredItems = React.useMemo(() => {
    let result = items;
    if (filterTeam !== 'all') {
      result = result.filter(i => i.teamName === filterTeam);
    }
    if (filterStaff !== 'all') {
      result = result.filter(i => i.staffName === filterStaff);
    }
    return filterByDateRange(result, i => (i as any).createdAt, dateRange);
  }, [items, filterTeam, filterStaff, dateRange]);

  const grouped = COLUMNS.map(col => ({
    ...col,
    items: filteredItems.filter(i => (i.status || 'PENDING') === col.key),
  }));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative z-20 px-6 lg:px-8 py-5 border-b border-slate-100 dark:border-sg-border/40 bg-white/40 dark:bg-black/20 backdrop-blur-xl shrink-0">
        <div className="flex flex-col gap-6">
          {/* Row 1: Title & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={22} className="text-orange-500" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[20px] font-black text-sg-heading leading-none tracking-tight whitespace-nowrap">
                  {mode === 'team' ? 'Đặt Cọc Team' : 'Quản Lý Đặt Cọc'}
                </h2>
                <p className="text-[12px] font-bold text-sg-muted uppercase tracking-wider mt-1.5 opacity-80">
                  {mode === 'team' ? 'Theo dõi giao dịch toàn đội' : 'Dữ liệu giao dịch cá nhân'} • {(items || []).length} bản ghi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={fetchItems} className="h-11 px-4 flex items-center gap-2 bg-white/60 dark:bg-black/20 border border-sg-border rounded-xl text-sg-muted hover:text-sg-heading hover:bg-white transition-all font-bold text-[13px]">
                <RefreshCw size={16} /> <span className="hidden sm:inline">Làm mới</span>
              </button>
            </div>
          </div>

          {/* Row 2: Filters Area */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-sg-border/30">
            <div className="text-[11px] font-black text-sg-muted uppercase tracking-widest mr-2 opacity-60">Bộ lọc thông minh:</div>
            <DateFilter onChange={(range) => setDateRange(range)} />
            {mode === 'team' && (
              <>
                <div className="w-px h-6 bg-sg-border/50 mx-1 shrink-0 hidden md:block" />
                {role !== 'sales_manager' && (
                  <StaffSelect value={filterTeam} onChange={(v) => { setFilterTeam(v); setFilterStaff('all'); }} options={teamOptions} />
                )}
                <StaffSelect value={filterStaff} onChange={setFilterStaff} options={staffOptions} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4 lg:p-6">
        {loading ? (
          <div className="grid grid-cols-3 gap-6 h-full min-w-[1000px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 h-full min-w-[1000px]">
            {grouped.map((col, colIdx) => (
              <div key={col.key} className="flex flex-col sg-stagger" style={{ animationDelay: `${colIdx * 60}ms` }}>
                {/* Column header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-3 ${col.borderColor} bg-white/60 dark:bg-black/30 backdrop-blur-xl`}>
                  <div className="flex items-center gap-2">
                    <span className={col.color}>{col.icon}</span>
                    <span className="text-[13px] font-black text-sg-heading">{col.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${col.color} bg-sg-card/50`}>
                    {col.items.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto pb-4 custom-scrollbar">
                  {col.items.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setEditItem(item);
                        setIsModalOpen(true);
                      }}
                      className="bg-white dark:bg-black/30 backdrop-blur-3xl rounded-[20px] border border-slate-200/80 dark:border-sg-border p-4 shadow-sg-sm hover:shadow-sg-md hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden sg-stagger"
                      style={{ animationDelay: `${colIdx * 60 + idx * 40}ms` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${col.glowColor}/10 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity`} />

                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[18px] font-black text-sg-heading group-hover:text-orange-500 transition-colors leading-none tracking-tight">{item.unitCode || 'N/A'}</span>
                          {item.source === 'BOOKING' ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">Giữ chỗ ➝ Đặt cọc</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">Khách hàng cọc mới</span>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${col.color} bg-sg-card/50 border ${col.borderColor} shadow-sm shrink-0`}>{col.label}</span>
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
                        {mode === 'team' && (
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-center shrink-0 shadow-sm">
                              <User size={10} className="text-orange-500" />
                            </div>
                            <span className="text-[12px] font-bold text-orange-600 dark:text-orange-400 truncate tracking-wide">{item.staffName || 'N/A'}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 pt-3 border-t border-slate-200/50 dark:border-sg-border border-dashed">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                              <DollarSign size={14} className="text-orange-500" />
                            </div>
                            <span className="text-[11px] font-bold text-sg-muted uppercase tracking-wider">Số tiền cọc</span>
                          </div>
                          <p className="text-[16px] font-black text-orange-500 tracking-tight drop-shadow-sm">{formatVND(item.depositAmount)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty state */}
                  {col.items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center p-8 rounded-[20px] border-2 border-dashed border-sg-border/30 text-center min-h-[150px]">
                      <div>
                        <p className="text-[12px] font-bold text-sg-muted">Trống</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* FAB */}
      <button
        onClick={() => { setEditItem(null); setIsModalOpen(true); }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/40 hover:-translate-y-1 hover:shadow-orange-500/60 flex items-center justify-center transition-all z-40 sg-stagger group"
        style={{ animationDelay: '800ms' }}
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <DepositEntryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditItem(null); }}
        onSuccess={fetchItems}
        editData={editItem}
      />
    </div>
  );
}
