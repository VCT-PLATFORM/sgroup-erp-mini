import React, { useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SGNumberInputProps {
  value: string | number;
  onChange: (val: string) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  wrapClassName?: string;
  suffix?: React.ReactNode;
  suffixClassName?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function SGNumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  className = '',
  wrapClassName = '',
  suffix,
  suffixClassName = 'sg-suffix',
  inputProps
}: SGNumberInputProps) {
  const holdRef = useRef<{ t: ReturnType<typeof setTimeout> | null, i: ReturnType<typeof setInterval> | null }>({ t: null, i: null });

  const safeNum = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

  const clamp = (n: number) => {
    if (min != null && n < min) n = min;
    if (max != null && n > max) n = max;
    return n;
  };

  const stepBy = (dir: number) => {
    const curr = safeNum(value);
    const next = clamp(curr + (safeNum(step) * dir));
    const fixed = (String(step).includes('.'))
      ? Number(next.toFixed(String(step).split('.')[1].length))
      : next;
    onChange(String(fixed));
  };

  const stopHold = () => {
    if (!holdRef.current) return;
    if (holdRef.current.t) { clearTimeout(holdRef.current.t); holdRef.current.t = null; }
    if (holdRef.current.i) { clearInterval(holdRef.current.i); holdRef.current.i = null; }
  };

  const startHold = (dir: number) => {
    stepBy(dir);
    stopHold();
    holdRef.current.t = setTimeout(() => {
      holdRef.current.i = setInterval(() => { stepBy(dir); }, 150);
    }, 340);
  };

  return (
    <div className={`relative flex items-center w-full group/sg-numwrap ${wrapClassName}`}>
      <input
        {...inputProps}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 min-w-0 appearance-none outline-none ${className}`}
        style={{ MozAppearance: 'textfield' }} // hide native arrows in Firefox
      />
      {/* Custom Stepper */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 pointer-events-none group-hover/sg-numwrap:opacity-100 group-hover/sg-numwrap:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto transition-opacity duration-150">
        <button
          type="button"
          title="Tăng"
          className="w-[22px] h-[18px] rounded-[10px] border border-slate-400/30 dark:border-slate-500/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-sm hover:border-indigo-400 active:scale-95 transition-all"
          onMouseDown={(e) => { e.preventDefault(); startHold(1); }}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
        >
          <ChevronUp size={12} strokeWidth={3} />
        </button>
        <button
          type="button"
          title="Giảm"
          className="w-[22px] h-[18px] rounded-[10px] border border-slate-400/30 dark:border-slate-500/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-sm hover:border-indigo-400 active:scale-95 transition-all"
          onMouseDown={(e) => { e.preventDefault(); startHold(-1); }}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
        >
          <ChevronDown size={12} strokeWidth={3} />
        </button>
      </div>
      {suffix && <span className={`pointer-events-none flex-shrink-0 ${suffixClassName}`}>{suffix}</span>}
      <style>{`
        /* Hide Webkit native spinners */
        .group\\/sg-numwrap input[type="number"]::-webkit-inner-spin-button,
        .group\\/sg-numwrap input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
