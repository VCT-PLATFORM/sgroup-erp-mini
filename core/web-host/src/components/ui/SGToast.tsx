import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ──────────────────────────────────────────
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ─── Provider ───────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, message, variant, duration }]);
  }, []);

  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, 'error', 6000), [addToast]);
  const warning = useCallback((msg: string) => addToast(msg, 'warning', 5000), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ─── Container ──────────────────────────────────────
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-99999 flex flex-col-reverse gap-3 pointer-events-none max-w-[420px]">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ─── Single Toast Item ──────────────────────────────
const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof CheckCircle; color: string; bg: string; border: string; progress: string }> = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', progress: 'bg-emerald-500' },
  error:   { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', progress: 'bg-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', progress: 'bg-amber-500' },
  info:    { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', progress: 'bg-blue-500' },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const cfg = VARIANT_CONFIG[toast.variant];
  const Icon = cfg.icon;
  const duration = toast.duration || 4000;

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), duration - 300);
    const removeTimer = setTimeout(() => onRemove(toast.id), duration);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, [toast.id, duration, onRemove]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-300 overflow-hidden
        bg-sg-card/95 ${cfg.border}
        ${isExiting ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
      style={{ animation: isExiting ? undefined : 'sgToastIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon size={16} className={cfg.color} strokeWidth={2.5} />
      </div>
      <p className="text-[13px] font-bold text-sg-heading leading-relaxed flex-1 pt-1">{toast.message}</p>
      <button
        onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 300); }}
        className="shrink-0 p-1 rounded-lg text-sg-muted hover:text-sg-heading hover:bg-sg-btn-bg transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-sg-border/30">
        <div
          className={`h-full ${cfg.progress} rounded-full`}
          style={{ animation: `sgToastProgress ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}
