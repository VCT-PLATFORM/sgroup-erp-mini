import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X, Clock } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// SMART DATE FILTER — Compact Dropdown Design
// ═══════════════════════════════════════════════════════════

export type DatePreset = 'all' | 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'custom';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateFilterProps {
  onChange: (range: DateRange, preset: DatePreset) => void;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'today',      label: 'Hôm nay' },
  { key: 'yesterday',  label: 'Hôm qua' },
  { key: 'this_week',  label: 'Tuần này' },
  { key: 'last_week',  label: 'Tuần trước' },
  { key: 'this_month', label: 'Tháng này' },
  { key: 'last_month', label: 'Tháng trước' },
  { key: 'this_quarter', label: 'Quý này' },
];

function getPresetRange(preset: DatePreset): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'today':
      return { from: today, to: new Date(today.getTime() + 86400000 - 1) };
    case 'yesterday': {
      const y = new Date(today.getTime() - 86400000);
      return { from: y, to: new Date(y.getTime() + 86400000 - 1) };
    }
    case 'this_week': {
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday = start
      const monday = new Date(today.getTime() - diff * 86400000);
      return { from: monday, to: new Date(today.getTime() + 86400000 - 1) };
    }
    case 'last_week': {
      const day = today.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const thisMonday = new Date(today.getTime() - diff * 86400000);
      const lastMonday = new Date(thisMonday.getTime() - 7 * 86400000);
      const lastSunday = new Date(thisMonday.getTime() - 1);
      return { from: lastMonday, to: lastSunday };
    }
    case 'this_month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: firstDay, to: new Date(today.getTime() + 86400000 - 1) };
    }
    case 'last_month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { from: firstDay, to: lastDay };
    }
    case 'this_quarter': {
      const currentMonth = today.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      const firstDay = new Date(today.getFullYear(), currentQuarter * 3, 1);
      return { from: firstDay, to: new Date(today.getTime() + 86400000 - 1) };
    }
    default:
      return { from: null, to: null };
  }
}

function formatShortDate(d: Date | null): string {
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function DateFilter({ onChange }: DateFilterProps) {
  const [activePreset, setActivePreset] = useState<DatePreset>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handlePreset = (preset: DatePreset) => {
    setActivePreset(preset);
    setIsOpen(false);
    onChange(getPresetRange(preset), preset);
  };

  const handleCustomApply = () => {
    if (!customFrom || !customTo) return;
    const from = new Date(customFrom + 'T00:00:00');
    const to = new Date(customTo + 'T23:59:59');
    setActivePreset('custom');
    setIsOpen(false);
    onChange({ from, to }, 'custom');
  };

  const handleClear = () => {
    setActivePreset('all');
    setCustomFrom('');
    setCustomTo('');
    setIsOpen(false);
    onChange({ from: null, to: null }, 'all');
  };

  const activeLabel = activePreset === 'custom'
    ? `${formatShortDate(new Date(customFrom))} → ${formatShortDate(new Date(customTo))}`
    : PRESETS.find(p => p.key === activePreset)?.label || 'Toàn thời gian';

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 border ${
          activePreset !== 'all'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
            : 'bg-white/60 dark:bg-black/20 border-slate-200 dark:border-white/10 text-sg-heading hover:bg-white dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-sm'
        }`}
      >
        {activePreset !== 'all' ? <Calendar size={16} /> : <Clock size={16} className="text-sg-muted" />}
        <span>{activeLabel}</span>
        <ChevronDown size={14} className={`text-sg-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[340px] bg-white dark:bg-[#1a1a1c] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-sg-muted">Chọn thời gian</span>
            {activePreset !== 'all' && (
              <button 
                onClick={handleClear}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-md"
              >
                <X size={12} /> Xóa lọc
              </button>
            )}
          </div>
          
          {/* Preset Grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => handlePreset(p.key)}
                className={`px-3 py-2.5 rounded-xl text-[12px] font-bold text-left transition-all ${
                  activePreset === p.key
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 dark:bg-white/5 text-sg-heading hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent dark:border-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom Range Separator */}
          <div className="relative py-2 mb-3 flex items-center">
            <div className="grow border-t border-slate-200 dark:border-white/10"></div>
            <span className="shrink-0 px-3 text-[10px] font-black uppercase tracking-widest text-sg-muted">Hoặc tùy chỉnh</span>
            <div className="grow border-t border-slate-200 dark:border-white/10"></div>
          </div>

          {/* Custom Range Form */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-sg-muted uppercase tracking-wider mb-1 block">Từ ngày</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[12px] font-bold text-sg-heading focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-sg-muted uppercase tracking-wider mb-1 block">Đến ngày</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[12px] font-bold text-sg-heading focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleCustomApply}
              disabled={!customFrom || !customTo}
              className="w-full h-10 mt-1 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white text-[13px] font-black hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Utility function to filter data by date range.
 * Supports date strings in 'dd/MM/yyyy', 'yyyy-MM-dd', ISO 8601, etc.
 */
export function filterByDateRange<T>(
  items: T[],
  dateAccessor: (item: T) => string | Date | undefined,
  range: { from: Date | null; to: Date | null }
): T[] {
  if (!range.from && !range.to) return items;
  
  return items.filter(item => {
    const raw = dateAccessor(item);
    if (!raw) return false;
    
    let d: Date;
    if (raw instanceof Date) {
      d = raw;
    } else if (typeof raw === 'string') {
      const parts = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (parts) {
        d = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]));
      } else {
        d = new Date(raw);
      }
    } else {
      return false;
    }
    
    if (isNaN(d.getTime())) return false;
    if (range.from && d < range.from) return false;
    if (range.to && d > range.to) return false;
    return true;
  });
}
