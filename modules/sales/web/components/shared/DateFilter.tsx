import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// SMART DATE FILTER — Reusable Preset + Custom Range Picker
// ═══════════════════════════════════════════════════════════

export type DatePreset = 'all' | 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'custom';

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
    default:
      return { from: null, to: null };
  }
}

function formatShortDate(d: Date | null): string {
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function toInputDate(d: Date | null): string {
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DateFilter({ onChange }: DateFilterProps) {
  const [activePreset, setActivePreset] = useState<DatePreset>('all');
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowCustom(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handlePreset = (preset: DatePreset) => {
    if (preset === 'custom') {
      setShowCustom(true);
      return;
    }
    setActivePreset(preset);
    setShowCustom(false);
    onChange(getPresetRange(preset), preset);
  };

  const handleCustomApply = () => {
    if (!customFrom || !customTo) return;
    const from = new Date(customFrom + 'T00:00:00');
    const to = new Date(customTo + 'T23:59:59');
    setActivePreset('custom');
    setShowCustom(false);
    onChange({ from, to }, 'custom');
  };

  const handleClear = () => {
    setActivePreset('all');
    setCustomFrom('');
    setCustomTo('');
    onChange({ from: null, to: null }, 'all');
  };

  const activeLabel = activePreset === 'custom'
    ? `${formatShortDate(new Date(customFrom))} → ${formatShortDate(new Date(customTo))}`
    : PRESETS.find(p => p.key === activePreset)?.label || 'Tất cả';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Preset Chips */}
      {PRESETS.map(p => (
        <button
          key={p.key}
          onClick={() => handlePreset(p.key)}
          className={`px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 border whitespace-nowrap ${
            activePreset === p.key
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.12)]'
              : 'bg-white/60 dark:bg-black/20 border-slate-200/80 dark:border-sg-border text-sg-muted hover:text-sg-heading hover:border-slate-300 dark:hover:border-sg-border/80'
          }`}
        >
          {p.label}
        </button>
      ))}

      {/* Custom Range Trigger */}
      <div className="relative" ref={popoverRef}>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 border whitespace-nowrap ${
            activePreset === 'custom'
              ? 'bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 shadow-[0_2px_8px_rgba(139,92,246,0.12)]'
              : 'bg-white/60 dark:bg-black/20 border-slate-200/80 dark:border-sg-border text-sg-muted hover:text-sg-heading hover:border-slate-300'
          }`}
        >
          <Calendar size={13} />
          {activePreset === 'custom' ? activeLabel : 'Chọn ngày'}
          <ChevronDown size={12} className={`transition-transform ${showCustom ? 'rotate-180' : ''}`} />
        </button>

        {/* Custom Range Popover */}
        {showCustom && (
          <div className="absolute right-0 top-full mt-2 w-[320px] bg-white dark:bg-black/90 backdrop-blur-3xl border border-slate-200 dark:border-sg-border rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-sg-muted">Khoảng thời gian</span>
              <button onClick={() => setShowCustom(false)} className="text-sg-muted hover:text-sg-heading">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-sg-muted uppercase tracking-wider mb-1 block">Từ ngày</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-sg-card/50 border border-sg-border text-[13px] font-bold text-sg-heading focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-sg-muted uppercase tracking-wider mb-1 block">Đến ngày</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-sg-card/50 border border-sg-border text-[13px] font-bold text-sg-heading focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <button
                onClick={handleCustomApply}
                disabled={!customFrom || !customTo}
                className="w-full h-10 rounded-xl bg-linear-to-r from-violet-500 to-purple-600 text-white text-[13px] font-black hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clear filter */}
      {activePreset !== 'all' && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <X size={12} /> Xóa lọc
        </button>
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
      // Try dd/MM/yyyy format
      const parts = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
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
