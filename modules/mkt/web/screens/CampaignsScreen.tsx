import React, { useState, useMemo } from 'react';
import { Target, Plus, Search, Filter, GripVertical, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useCampaigns } from '../hooks/useMKT';
import { SGGlassPanel } from '@sgroup/web-ui';
import { CAMPAIGN_STATUS_CONFIG, CHANNEL_CONFIG, formatCurrency } from '../constants';
import type { Campaign, CampaignStatus, MarketingChannel } from '../types';

const KANBAN_COLUMNS: { key: CampaignStatus; label: string; color: string }[] = [
  { key: 'PLANNING', label: 'Lên kế hoạch', color: 'border-slate-400' },
  { key: 'ACTIVE', label: 'Đang chạy', color: 'border-emerald-500' },
  { key: 'PAUSED', label: 'Tạm dừng', color: 'border-amber-500' },
  { key: 'COMPLETED', label: 'Hoàn thành', color: 'border-blue-500' },
];

export function CampaignsScreen() {
  const { data: rawCampaigns, isLoading } = useCampaigns();
  const campaigns = (Array.isArray(rawCampaigns) ? rawCampaigns : []) as Campaign[];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);

  // Sync from API
  React.useEffect(() => {
    if (campaigns.length && !localCampaigns.length) setLocalCampaigns(campaigns);
  }, [campaigns]);

  const displayCampaigns = localCampaigns.length ? localCampaigns : campaigns;

  const filtered = useMemo(() => {
    return displayCampaigns.filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterChannel !== 'all' && c.channel !== filterChannel) return false;
      return true;
    });
  }, [displayCampaigns, searchQuery, filterChannel]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: CampaignStatus) => {
    e.preventDefault();
    if (!draggedId) return;
    setLocalCampaigns(prev => prev.map(c => c.id === draggedId ? { ...c, status: targetStatus } : c));
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold text-sg-subtext">Đang tải chiến dịch...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-linear-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-sg-heading tracking-tight">CHIẾN DỊCH MARKETING</h2>
            <p className="text-sm font-semibold text-sg-muted">{filtered.length} chiến dịch • Kéo thả để chuyển trạng thái</p>
          </div>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-linear-to-r from-orange-500 to-pink-600 text-white font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-orange-500/25">
          <Plus size={18} /> Tạo chiến dịch
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[250px] max-w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sg-muted" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm chiến dịch..." className="w-full h-11 pl-11 pr-4 bg-sg-card border border-sg-border rounded-xl text-sm font-bold text-sg-heading placeholder:text-sg-muted/50 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-sg-muted" />
          <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)} className="h-11 px-4 bg-sg-card border border-sg-border rounded-xl text-sm font-bold text-sg-heading cursor-pointer focus:outline-none focus:border-orange-500">
            <option value="all">Tất cả kênh</option>
            {Object.entries(CHANNEL_CONFIG).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-w-0">
        {KANBAN_COLUMNS.map(col => {
          const colCampaigns = filtered.filter(c => c.status === col.key);
          const statusCfg = CAMPAIGN_STATUS_CONFIG[col.key];
          return (
            <div key={col.key}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, col.key)}
              className="flex flex-col min-h-[400px] bg-sg-bg/50 dark:bg-white/[0.02] rounded-2xl border border-sg-border/50 p-4"
            >
              {/* Column Header */}
              <div className={`flex items-center gap-3 pb-4 mb-4 border-b-2 ${col.color}`}>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</span>
                <span className="ml-auto text-[13px] font-extrabold text-sg-muted bg-sg-btn-bg border border-sg-border px-2 py-0.5 rounded-lg">{colCampaigns.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 flex-1">
                {colCampaigns.map(c => {
                  const chCfg = CHANNEL_CONFIG[c.channel as MarketingChannel];
                  const spentPct = c.budget ? Math.min(100, Math.round((c.spent / c.budget) * 100)) : 0;
                  return (
                    <div key={c.id}
                      draggable
                      onDragStart={e => handleDragStart(e, c.id)}
                      className={`p-4 rounded-2xl bg-sg-card border border-sg-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing group ${draggedId === c.id ? 'opacity-50 scale-95' : ''}`}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <GripVertical size={14} className="text-sg-muted/50 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-[14px] font-extrabold text-sg-heading leading-snug flex-1">{c.name}</h4>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ backgroundColor: `${chCfg?.color}20`, color: chCfg?.color }}>{chCfg?.label}</span>
                        {c.tags?.slice(0, 2).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sg-btn-bg text-sg-subtext border border-sg-border">#{t}</span>
                        ))}
                      </div>

                      {/* Budget Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] font-bold text-sg-subtext mb-1">
                          <span className="flex items-center gap-1"><DollarSign size={10} />{formatCurrency(c.spent)}</span>
                          <span>{formatCurrency(c.budget)}</span>
                        </div>
                        <div className="h-1.5 bg-sg-border rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${spentPct}%`, backgroundColor: spentPct > 90 ? '#ef4444' : spentPct > 70 ? '#f59e0b' : '#22c55e' }} />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center text-[11px] font-bold text-sg-subtext">
                        <span className="flex items-center gap-1"><Users size={11} />{c.actualLeads ?? 0}/{c.targetLeads ?? '—'}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} />{c.endDate?.slice(5) || '—'}</span>
                      </div>

                      {c.owner && (
                        <div className="mt-3 pt-3 border-t border-sg-border/50 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center text-[9px] font-black text-orange-500">{c.owner[0]}</div>
                          <span className="text-[11px] font-bold text-sg-muted truncate">{c.owner}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {colCampaigns.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-sg-muted text-sm font-medium p-8 text-center border-2 border-dashed border-sg-border rounded-2xl">
                    Kéo thả chiến dịch vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
