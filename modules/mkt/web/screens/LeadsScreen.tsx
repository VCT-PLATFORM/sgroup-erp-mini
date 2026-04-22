import React, { useState, useMemo } from 'react';
import { UserPlus, Search, Filter, ArrowUpDown, ExternalLink, Phone, Mail } from 'lucide-react';
import { useLeads } from '../hooks/useMKT';
import { LEAD_STATUS_CONFIG, CHANNEL_CONFIG, formatCurrency } from '../constants';
import type { Lead, LeadStatus, MarketingChannel } from '../types';

export function LeadsScreen() {
  const { data: rawLeads, isLoading } = useLeads();
  const leads = (Array.isArray(rawLeads) ? rawLeads : []) as Lead[];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'createdAt' | 'name' | 'value'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = leads.filter(l => {
      if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      return true;
    });
    result.sort((a, b) => {
      const av = sortKey === 'value' ? (a.value || 0) : sortKey === 'name' ? a.name : (a.createdAt || '');
      const bv = sortKey === 'value' ? (b.value || 0) : sortKey === 'name' ? b.name : (b.createdAt || '');
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [leads, searchQuery, filterStatus, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    leads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
    return counts;
  }, [leads]);

  if (isLoading) {
    return (<div className="flex-1 flex flex-col items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" /><span className="text-sm font-semibold text-sg-subtext">Đang tải leads...</span></div>);
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UserPlus size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-sg-heading tracking-tight">QUẢN LÝ LEADS</h2>
            <p className="text-sm font-semibold text-sg-muted">{filtered.length} leads • Theo dõi & phân bổ cho Sales</p>
          </div>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/25">
          <UserPlus size={18} /> Thêm Lead
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ key: 'all', label: 'Tất cả' }, ...Object.entries(LEAD_STATUS_CONFIG).map(([k, v]) => ({ key: k, label: v.label }))].map(t => (
          <button key={t.key} onClick={() => setFilterStatus(t.key)}
            className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all
              ${filterStatus === t.key ? 'bg-blue-500/10 text-blue-600 border-blue-500/30 shadow-sm' : 'bg-sg-card text-sg-subtext border-sg-border hover:border-blue-500/20'}`}>
            {t.label} <span className="ml-1 opacity-60">({statusCounts[t.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-[400px] mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sg-muted" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm theo tên, email..." className="w-full h-11 pl-11 pr-4 bg-sg-card border border-sg-border rounded-xl text-sm font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
      </div>

      {/* Table */}
      <div className="bg-sg-card rounded-2xl border border-sg-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sg-border">
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted cursor-pointer hover:text-sg-heading" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">Tên Lead <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Liên hệ</th>
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Nguồn</th>
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Trạng thái</th>
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Chiến dịch</th>
                <th className="text-right px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted cursor-pointer hover:text-sg-heading" onClick={() => toggleSort('value')}>
                  <span className="flex items-center gap-1 justify-end">Giá trị <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider text-sg-muted">Phụ trách</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const statusCfg = LEAD_STATUS_CONFIG[l.status as LeadStatus];
                const chCfg = CHANNEL_CONFIG[l.source as MarketingChannel];
                return (
                  <tr key={l.id} className="border-b border-sg-border/50 hover:bg-sg-btn-bg transition-colors group">
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-extrabold text-sg-heading group-hover:text-blue-500 transition-colors">{l.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-bold text-sg-subtext flex items-center gap-1"><Mail size={11} />{l.email}</span>
                        {l.phone && <span className="text-[12px] font-bold text-sg-muted flex items-center gap-1"><Phone size={11} />{l.phone}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black" style={{ backgroundColor: `${chCfg?.color || '#64748b'}20`, color: chCfg?.color || '#64748b' }}>{chCfg?.label || l.source}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusCfg?.bg} ${statusCfg?.color}`}>{statusCfg?.label || l.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-bold text-sg-subtext truncate max-w-[150px] block">{l.campaign || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[14px] font-black text-sg-heading">{l.value ? formatCurrency(l.value) : '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {l.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/15 flex items-center justify-center text-[9px] font-black text-purple-500">{l.assignedTo[0]}</div>
                          <span className="text-[12px] font-bold text-sg-subtext">{l.assignedTo}</span>
                        </div>
                      ) : <span className="text-[12px] font-bold text-sg-muted italic">Chưa gán</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sg-subtext font-medium">Không tìm thấy lead nào phù hợp.</div>
        )}
      </div>
    </div>
  );
}
