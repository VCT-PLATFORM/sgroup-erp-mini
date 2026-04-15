import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, UserCog, Briefcase, Building2,
  ChevronLeft, ChevronRight, UserCircle, TrendingUp,
  Handshake, BarChart4, Settings, Target
} from 'lucide-react';
import { useAuthStore } from '@sgroup/platform';

/* ════════════════════════════════════════════════════════
   TYPES & CONFIG
   ════════════════════════════════════════════════════════ */

export type SalesRole = 'sales_staff' | 'sales_manager' | 'sales_director' | 'admin';

export interface SalesSidebarItem {
  key: string;
  label: string;
  icon: any;
  section: 'dashboard' | 'crm' | 'pipeline' | 'team' | 'director';
  minRole: SalesRole[];
}

const ALL_ROLES: SalesRole[] = ['sales_staff', 'sales_manager', 'sales_director', 'admin'];
const MANAGER_UP: SalesRole[] = ['sales_manager', 'sales_director', 'admin'];
const DIRECTOR_UP: SalesRole[] = ['sales_director', 'admin'];

const SIDEBAR_ITEMS: SalesSidebarItem[] = [
  { key: 'SALES_DASHBOARD', label: 'Tổng quan Doanh số', icon: LayoutDashboard, section: 'dashboard', minRole: ALL_ROLES },
  { key: 'SALES_CUSTOMERS', label: 'Khách hàng (CRM)', icon: Users, section: 'crm', minRole: ALL_ROLES },
  { key: 'SALES_PIPELINE', label: 'Pipeline Giao Dịch', icon: Handshake, section: 'pipeline', minRole: ALL_ROLES },
  { key: 'SALES_TEAM', label: 'Quản lý Đội Nhóm', icon: Target, section: 'team', minRole: MANAGER_UP },
  { key: 'SALES_DEPARTMENT', label: 'Phòng Ban KD', icon: Building2, section: 'director', minRole: DIRECTOR_UP },
  { key: 'SALES_REPORTS', label: 'Báo cáo & Phân tích', icon: BarChart4, section: 'director', minRole: DIRECTOR_UP },
  { key: 'SALES_SETTINGS', label: 'Cài đặt Module', icon: Settings, section: 'director', minRole: DIRECTOR_UP },
];

const SECTIONS = [
  { key: 'dashboard', label: '' },
  { key: 'crm', label: 'QUẢN LÝ KHÁCH HÀNG' },
  { key: 'pipeline', label: 'GIAO DỊCH' },
  { key: 'team', label: 'QUẢN LÝ ĐỘI NHÓM' },
  { key: 'director', label: 'ĐIỀU HÀNH CẤP CAO' },
];

/* ════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════ */

interface Props {
  activeKey: string;
  onSelect: (item: SalesSidebarItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole?: SalesRole;
}

export function SalesSidebar({ activeKey, onSelect, collapsed, onToggleCollapse, userRole = 'sales_staff' }: Props) {
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const visibleItems = SIDEBAR_ITEMS.filter(item => item.minRole.includes(userRole));

  const renderItem = (item: SalesSidebarItem) => {
    const isActive = activeKey === item.key;
    const IconComp = item.icon;
    return (
      <button
        key={item.key}
        onClick={() => onSelect(item)}
        className={`w-[calc(100%-24px)] flex items-center mx-3 mb-1 px-3 py-3 rounded-2xl transition-all duration-300 border border-transparent
          ${isActive
            ? (isDark
              ? 'bg-emerald-500/15 border-emerald-500/20'
              : 'bg-emerald-50 shadow-[0_4px_14px_rgba(16,185,129,0.12)] border-emerald-100')
            : 'hover:bg-sg-btn-bg'
          }
        `}
      >
        <div className="w-6 flex items-center justify-center flex-shrink-0">
          <IconComp size={20} className={isActive ? 'text-emerald-500' : 'text-sg-muted'} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        {!collapsed && (
          <span className={`ml-3.5 text-sm truncate flex-1 text-left tracking-[0.2px]
            ${isActive ? 'font-extrabold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-sg-subtext'}
          `}>
            {item.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className={`
      relative h-screen flex flex-col border-r transition-all duration-300
      bg-sg-card border-sg-border
      ${collapsed ? 'w-20' : 'w-[260px]'}
    `}>
      {/* ═══ Brand Header ═══ */}
      <div className="h-20 flex flex-row justify-between items-center px-4 border-b border-sg-border">
        <div className={`flex flex-row items-center overflow-hidden ${collapsed ? 'gap-0 flex-none' : 'gap-3 flex-1'}`}>
          <div className="w-[38px] h-[38px] rounded-xl flex justify-center items-center flex-shrink-0 bg-gradient-to-br from-emerald-400 to-amber-500 shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
            <span className="text-[15px] font-black text-white tracking-[1.5px]">KD</span>
          </div>
          <div className={`flex flex-col flex-1 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <span className="text-sm font-extrabold text-sg-heading tracking-[0.8px] truncate">KINH DOANH</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-[2px] mt-0.5 whitespace-nowrap">SALES MODULE</span>
          </div>
        </div>
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-sg-btn-bg border border-sg-border hover:bg-sg-border transition-colors flex-shrink-0 z-10"
        >
          {collapsed ? <ChevronRight size={14} className="text-sg-muted" strokeWidth={2.5} /> : <ChevronLeft size={14} className="text-sg-muted" strokeWidth={2.5} />}
        </button>
      </div>

      {/* ═══ Navigation Menu ═══ */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-2">
        {SECTIONS.map(sec => {
          const sectionItems = visibleItems.filter(i => i.section === sec.key);
          if (sectionItems.length === 0) return null;
          return (
            <div key={sec.key}>
              {!collapsed && sec.label && (
                <div className="text-[11px] font-extrabold tracking-[1.8px] uppercase text-sg-muted px-6 mt-4 mb-2.5 truncate">
                  {sec.label}
                </div>
              )}
              {sectionItems.map(renderItem)}
              <div className="h-px mx-6 my-1.5 bg-sg-border" />
            </div>
          );
        })}
      </div>

      {/* ═══ Footer: User Profile ═══ */}
      <div className="p-3 border-t border-sg-border flex flex-col gap-2">
        <div className={`flex items-center ${collapsed ? 'justify-center mx-auto' : 'justify-between'}`}>
          <div className={`flex items-center flex-1 rounded-xl transition-all border border-transparent overflow-hidden ${collapsed ? 'p-0 w-9 h-9 justify-center' : 'p-2 mr-2'} hover:bg-sg-btn-bg`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-[13px] font-black text-white">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
            </div>
            {!collapsed && (
              <div className="ml-2.5 flex flex-col text-left truncate flex-1 min-w-0 pointer-events-none">
                <span className="text-[12px] font-extrabold text-sg-heading truncate">{user?.name || 'User'}</span>
                <span className="text-[9px] font-bold text-sg-subtext uppercase tracking-[1px] truncate mt-0.5">{userRole.replace(/_/g, ' ')}</span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => window.location.href = '/'}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-sg-btn-bg hover:bg-sg-border border border-sg-border transition-colors group shadow-sm"
              title="Về Workspace"
            >
              <LayoutDashboard size={15} className="text-sg-muted group-hover:text-sg-heading" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => window.location.href = '/'}
            className="w-9 h-9 mt-1 rounded-xl flex items-center justify-center flex-shrink-0 bg-sg-btn-bg hover:bg-sg-border border border-sg-border transition-colors group mx-auto shadow-sm"
            title="Về Workspace"
          >
            <LayoutDashboard size={15} className="text-sg-muted group-hover:text-sg-heading" />
          </button>
        )}
      </div>
    </aside>
  );
}

export { SIDEBAR_ITEMS };
