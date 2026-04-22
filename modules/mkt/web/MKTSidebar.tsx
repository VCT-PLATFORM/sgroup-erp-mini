import React from 'react';
import { Target, Users, Megaphone, LogOut, Search, Settings, FileText, DollarSign, LineChart, Star } from 'lucide-react';
import { useAuthStore } from '@sgroup/platform';

type RouteKey = 'MKT_DASHBOARD' | 'MKT_CAMPAIGNS' | 'MKT_LEADS' | 'MKT_CONTENT' | 'MKT_BUDGET' | 'MKT_ANALYTICS' | 'MKT_KOL';

interface Props {
  activeKey: string;
  onNavigate: (key: RouteKey) => void;
}

export function MKTSidebar({ activeKey, onNavigate }: Props) {
  const user = useAuthStore(state => state.user);
  
  const MAIN_MENU: { key: RouteKey; label: string; icon: React.ElementType }[] = [
    { key: 'MKT_DASHBOARD', label: 'Tổng quan', icon: Megaphone },
    { key: 'MKT_CAMPAIGNS', label: 'Chiến dịch', icon: Target },
    { key: 'MKT_LEADS', label: 'Leads', icon: Users },
    { key: 'MKT_CONTENT', label: 'Nội dung', icon: FileText },
  ];

  const MGMT_MENU: { key: RouteKey; label: string; icon: React.ElementType }[] = [
    { key: 'MKT_BUDGET', label: 'Ngân sách', icon: DollarSign },
    { key: 'MKT_ANALYTICS', label: 'Báo cáo', icon: LineChart },
    { key: 'MKT_KOL', label: 'KOL & Đối tác', icon: Star },
  ];

  const handleLogout = () => {
    window.location.href = '#';
    window.location.reload();
  };

  const navItemClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-bold text-[14px] ${
      isActive 
        ? 'bg-linear-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/25 rotate-1' 
        : 'text-sg-muted hover:bg-sg-btn-bg hover:text-sg-heading hover:translate-x-1'
    }`;

  return (
    <div className="w-[280px] bg-sg-bg/80 dark:bg-sg-gb/40 backdrop-blur-2xl border-r border-sg-border flex flex-col h-full shadow-2xl relative z-10 shrink-0">
      
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-2 ring-white/10">
            <Megaphone size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[20px] font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-pink-600 tracking-tight leading-none mb-0.5">S-GROUP</h1>
            <p className="text-[11px] font-black text-sg-subtext uppercase tracking-widest">Marketing</p>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sg-muted group-hover:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh... (Ctrl+K)" 
            className="w-full h-10 pl-10 pr-4 bg-sg-btn-bg border-none rounded-xl text-[13px] font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="mb-8">
          <p className="px-2 text-[11px] font-black uppercase text-sg-muted tracking-widest mb-3 opacity-70">Nghiệp vụ cốt lõi</p>
          <nav className="flex flex-col gap-1.5">
            {MAIN_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} onClick={() => onNavigate(item.key)} className={navItemClass(activeKey === item.key)}>
                  <Icon size={18} strokeWidth={activeKey === item.key ? 2.5 : 2} />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mb-8">
          <p className="px-2 text-[11px] font-black uppercase text-sg-muted tracking-widest mb-3 opacity-70">Quản trị & Báo cáo</p>
          <nav className="flex flex-col gap-1.5">
            {MGMT_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} onClick={() => onNavigate(item.key)} className={navItemClass(activeKey === item.key)}>
                  <Icon size={18} strokeWidth={activeKey === item.key ? 2.5 : 2} />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 mt-auto border-t border-sg-border/60 bg-linear-to-t from-sg-btn-bg/50 to-transparent">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sg-border transition-colors group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-orange-500/20 to-pink-500/20 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform border border-orange-500/30">
            <span className="text-[14px] font-black text-orange-500 leading-none">
              {user?.name?.split(' ').map((n: string) => n[0]).slice(-2).join('') || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-extrabold text-sg-heading truncate group-hover:text-orange-500 transition-colors">{user?.name || 'Người dùng'}</h4>
            <p className="text-[11px] font-bold text-sg-subtext uppercase tracking-wider">{user?.role === 'admin' ? 'Quản trị viên' : 'Marketing'}</p>
          </div>
          <button className="p-2 text-sg-muted hover:text-sg-heading hover:bg-sg-btn-bg rounded-lg transition-colors" title="Cài đặt cá nhân">
            <Settings size={16} />
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sg-border text-sg-muted hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all font-bold text-[13px]"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>

    </div>
  );
}
