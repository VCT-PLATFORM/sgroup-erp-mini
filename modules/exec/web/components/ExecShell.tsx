import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun, Target } from 'lucide-react';
import { ExecSidebar } from './ExecSidebar';

// ═══ Screens ═══
import { TotalPlanScreen } from '../screens/TotalPlanScreen';
import { SalesPlanScreen } from '../screens/SalesPlanScreen';

export function ExecShell() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-sg-heading transition-colors duration-300 dark:bg-slate-950">
      <div className="z-20 border-r border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
        <ExecSidebar />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col bg-slate-50/50 dark:bg-[#0a0a0a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px]" />
        </div>
        <header className="sticky top-0 z-50 flex h-[84px] items-center justify-between border-b border-slate-200/80 bg-white/70 px-6 backdrop-blur-2xl transition-colors duration-300 dark:border-white/5 dark:bg-black/40 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Target size={21} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black leading-tight tracking-tight text-sg-heading">Ban điều hành</h1>
              <span className="mt-0.5 text-[11px] font-bold uppercase tracking-[1.5px] text-sg-subtext">Executive Planning Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sg-subtext transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-indigo-300"
              title={isDark ? 'Chế độ tối' : 'Chế độ sáng'}
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-black tracking-tight text-sg-heading">CEO Mode</span>
              <span className="mt-0.5 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                Quyền điều hành
              </span>
            </div>
          </div>
        </header>

        <main className="relative flex flex-1 flex-col overflow-auto z-10">
          <Routes>
            <Route path="/" element={<Navigate to="total-plan" replace />} />
            <Route path="total-plan" element={<TotalPlanScreen />} />
            <Route path="sales-plan" element={<SalesPlanScreen />} />
            <Route path="*" element={<Navigate to="total-plan" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
