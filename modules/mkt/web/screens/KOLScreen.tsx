import React, { useState, useMemo } from 'react';
import { Star, Plus, Search, Filter, Mail, Calendar, Users, Briefcase, DollarSign } from 'lucide-react';
import { useKOLs } from '../hooks/useMKT';
import { PLATFORM_CONFIG, formatCurrency, formatNumber } from '../constants';
import type { KOLPartner, ContentPlatform } from '../types';

export function KOLScreen() {
  const { data: rawKOLs, isLoading } = useKOLs();
  const kols = (Array.isArray(rawKOLs) ? rawKOLs : []) as KOLPartner[];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const filtered = useMemo(() => {
    return kols.filter(k => {
      if (searchQuery && !k.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterPlatform !== 'all' && k.platform !== filterPlatform) return false;
      return true;
    });
  }, [kols, searchQuery, filterPlatform]);

  if (isLoading) {
    return (<div className="flex-1 flex flex-col items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" /><span className="text-sm font-semibold text-sg-subtext">Đang tải danh sách KOLs...</span></div>);
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-linear-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Star size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-sg-heading tracking-tight">KOL & INFLUENCERS</h2>
            <p className="text-sm font-semibold text-sg-muted">{filtered.length} đối tác • Quản lý quan hệ & Booking</p>
          </div>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 text-white font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-500/25">
          <Plus size={18} /> Thêm KOL
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[250px] max-w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sg-muted" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm theo tên..." className="w-full h-11 pl-11 pr-4 bg-sg-card border border-sg-border rounded-xl text-sm font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-sg-muted" />
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="h-11 px-4 bg-sg-card border border-sg-border rounded-xl text-sm font-bold text-sg-heading cursor-pointer focus:outline-none focus:border-rose-500">
            <option value="all">Tất cả nền tảng</option>
            {Object.entries(PLATFORM_CONFIG).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(kol => {
          const platCfg = PLATFORM_CONFIG[kol.platform as ContentPlatform];
          const isActive = kol.status === 'ACTIVE';
          return (
            <div key={kol.id} className="bg-sg-card rounded-2xl border border-sg-border p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group overflow-hidden relative">
              {/* Status Band */}
              <div className={`absolute top-0 inset-x-0 h-1.5 ${isActive ? 'bg-emerald-500' : kol.status === 'PROSPECT' ? 'bg-blue-500' : 'bg-sg-border'}`} />

              <div className="flex items-start justify-between mb-4 mt-2">
                <div className="w-12 h-12 rounded-full bg-sg-bg border-2 border-sg-border flex items-center justify-center text-xl shadow-inner">
                  {kol.avatarUrl ? <img src={kol.avatarUrl} alt={kol.name} className="w-full h-full rounded-full object-cover" /> : platCfg?.icon}
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isActive ? 'bg-emerald-500/10 text-emerald-600' : kol.status === 'PROSPECT' ? 'bg-blue-500/10 text-blue-600' : 'bg-sg-btn-bg text-sg-muted'}`}>
                  {kol.status === 'PROSPECT' ? 'Đang tiếp cận' : isActive ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                </div>
              </div>

              <h3 className="text-[16px] font-extrabold text-sg-heading mb-1 truncate group-hover:text-rose-500 transition-colors">{kol.name}</h3>
              <div className="text-[12px] font-bold text-sg-muted mb-4">{kol.category || 'Lifestyle'}</div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-sg-btn-bg rounded-xl p-3">
                  <div className="text-[11px] font-bold text-sg-muted flex items-center gap-1 mb-1"><Users size={12} /> Followers</div>
                  <div className="text-[14px] font-black text-sg-heading">{formatNumber(kol.followers)}</div>
                </div>
                <div className="bg-sg-btn-bg rounded-xl p-3">
                  <div className="text-[11px] font-bold text-sg-muted flex items-center gap-1 mb-1"><DollarSign size={12} /> Báo giá</div>
                  <div className="text-[14px] font-black text-sg-heading">{kol.pricePerPost ? formatCurrency(kol.pricePerPost) : 'Thỏa thuận'}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-sg-border/50">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-sg-muted flex items-center gap-1.5"><Briefcase size={14} /> Số lần hợp tác</span>
                  <span className="font-black text-sg-heading">{kol.totalCollabs || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-sg-muted flex items-center gap-1.5"><Star size={14} className="text-amber-500" /> Đánh giá</span>
                  <span className="font-black text-sg-heading">{kol.rating?.toFixed(1) || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-sg-muted flex items-center gap-1.5"><Calendar size={14} /> Lần cuối hợp tác</span>
                  <span className="font-black text-sg-heading">{kol.lastCollab || '—'}</span>
                </div>
                {kol.contact && (
                  <div className="flex items-center justify-between text-[12px] mt-2">
                    <span className="font-bold text-sg-muted flex items-center gap-1.5"><Mail size={14} /> Liên hệ</span>
                    <a href={`mailto:${kol.contact}`} className="font-bold text-blue-500 hover:underline truncate ml-2">{kol.contact}</a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center text-sg-subtext font-medium border-2 border-dashed border-sg-border rounded-2xl">
            Không tìm thấy KOL nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
