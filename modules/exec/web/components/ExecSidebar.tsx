import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  Target,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  section?: string;
}

const EXEC_MENU: SidebarItem[] = [
  { id: 'total-plan', label: 'Kế hoạch tổng thể', icon: BarChart3, path: 'total-plan', section: 'TRUNG TÂM KẾ HOẠCH' },
  { id: 'sales-plan', label: 'Kế hoạch kinh doanh', icon: Target, path: 'sales-plan' },
];

export function ExecSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop() || 'total-plan';

  return (
    <aside className={`flex h-full flex-col bg-white/95 backdrop-blur-xl transition-all duration-300 dark:bg-[#0a0a0a]/95 ${isCollapsed ? 'w-[72px]' : 'w-[272px]'}`}>
      <div className={`flex h-[84px] items-center border-b border-slate-200/80 dark:border-white/5 ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-5'}`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-indigo-600">
          <ClipboardList size={20} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="truncate text-base font-black tracking-tight text-sg-heading">SGroup</span>
            <span className="text-[9px] font-bold uppercase tracking-[2px] text-sg-subtext">Executive Module</span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {EXEC_MENU.map(item => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <React.Fragment key={item.id}>
              {item.section && !isCollapsed && (
                <div className="pt-3 pb-1 px-4 first:pt-0">
                  <span className="text-[9px] font-black uppercase tracking-[2px] text-sg-muted/80">{item.section}</span>
                </div>
              )}
              {item.section && isCollapsed && (
                <div className="mx-2 my-1.5 h-px bg-slate-200 dark:bg-slate-800" />
              )}
              <button
               onClick={() => navigate(`/ExecModule/${item.path}`)}
               title={isCollapsed ? item.label : undefined}
               className={`group relative flex w-full items-center gap-3 rounded-lg border transition-all duration-200 ${
                 isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
               } ${
                 isActive
                   ? 'border-indigo-200/80 bg-indigo-50/80 text-indigo-700 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300'
                   : 'border-transparent text-sg-muted hover:border-slate-200/80 hover:bg-slate-50/80 hover:text-sg-heading dark:hover:border-white/5 dark:hover:bg-white/5'
               }`}
             >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-600" />
              )}

              <Icon size={18} className={`shrink-0 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-300' : 'group-hover:text-sg-heading'}`} />

              {!isCollapsed && (
                <span className={`truncate text-[13px] font-bold ${isActive ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                  {item.label}
                </span>
              )}
            </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 border-t border-slate-200/80 p-3 dark:border-white/5">
        <button
          onClick={() => navigate('/')}
          className={`group flex w-full items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/80 py-2.5 text-sg-muted transition-colors hover:border-slate-300 hover:bg-white hover:text-sg-heading dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          title="Thoát về Portal"
        >
          <Home size={16} />
          {!isCollapsed && <span className="text-[13px] font-bold">Về Portal</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 py-2.5 text-sg-muted transition-colors hover:bg-slate-50 hover:text-sg-heading dark:border-white/5 dark:bg-transparent dark:hover:bg-white/5"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
