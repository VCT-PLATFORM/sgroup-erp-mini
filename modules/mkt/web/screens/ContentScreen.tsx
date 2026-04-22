import React, { useState, useMemo } from 'react';
import { FileText, Plus, ChevronLeft, ChevronRight, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useContent } from '../hooks/useMKT';
import { SGGlassPanel } from '@sgroup/web-ui';
import { CONTENT_STATUS_CONFIG, PLATFORM_CONFIG } from '../constants';
import type { ContentPost, ContentStatus, ContentPlatform } from '../types';

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function ContentScreen() {
  const { data: rawContent, isLoading } = useContent();
  const content = (Array.isArray(rawContent) ? rawContent : []) as ContentPost[];
  const [currentMonth, setCurrentMonth] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContent = useMemo(() => {
    return content.filter(c => filterStatus === 'all' || c.status === filterStatus);
  }, [content, filterStatus]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentMonth.year, currentMonth.month, 1);
    const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const startPad = firstDay.getDay();
    const days: { date: number; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Previous month padding
    const prevLastDay = new Date(currentMonth.year, currentMonth.month, 0).getDate();
    for (let i = startPad - 1; i >= 0; i--) {
      days.push({ date: prevLastDay - i, isCurrentMonth: false, dateStr: '' });
    }
    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: d, isCurrentMonth: true, dateStr });
    }
    // Next month padding
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: d, isCurrentMonth: false, dateStr: '' });
    }
    return days;
  }, [currentMonth]);

  const getPostsForDate = (dateStr: string) => {
    return filteredContent.filter(c => {
      const d = c.publishedDate || c.scheduledDate || '';
      return d === dateStr;
    });
  };

  const monthLabel = new Date(currentMonth.year, currentMonth.month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (<div className="flex-1 flex flex-col items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" /><span className="text-sm font-semibold text-sg-subtext">Đang tải nội dung...</span></div>);
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-sg-fade-in pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-sg-heading tracking-tight">NỘI DUNG & CONTENT</h2>
            <p className="text-sm font-semibold text-sg-muted">{content.length} bài viết • Lịch xuất bản đa nền tảng</p>
          </div>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-cyan-500/25">
          <Plus size={18} /> Tạo bài viết
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[{ key: 'all', label: 'Tất cả' }, ...Object.entries(CONTENT_STATUS_CONFIG).map(([k, v]) => ({ key: k, label: v.label }))].map(t => (
          <button key={t.key} onClick={() => setFilterStatus(t.key)}
            className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all
              ${filterStatus === t.key ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30 shadow-sm' : 'bg-sg-card text-sg-subtext border-sg-border hover:border-cyan-500/20'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <SGGlassPanel padding="lg">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentMonth(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 })}
            className="w-10 h-10 rounded-xl bg-sg-btn-bg border border-sg-border flex items-center justify-center hover:bg-sg-border transition-colors">
            <ChevronLeft size={18} className="text-sg-heading" />
          </button>
          <h3 className="text-xl font-black text-sg-heading capitalize">{monthLabel}</h3>
          <button onClick={() => setCurrentMonth(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 })}
            className="w-10 h-10 rounded-xl bg-sg-btn-bg border border-sg-border flex items-center justify-center hover:bg-sg-border transition-colors">
            <ChevronRight size={18} className="text-sg-heading" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[11px] font-black uppercase tracking-widest text-sg-muted py-2">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const posts = day.isCurrentMonth ? getPostsForDate(day.dateStr) : [];
            const isToday = day.isCurrentMonth && day.dateStr === new Date().toISOString().slice(0, 10);
            return (
              <div key={i} className={`min-h-[100px] p-2 rounded-xl border transition-colors
                ${day.isCurrentMonth ? 'bg-sg-card border-sg-border/50 hover:border-sg-border' : 'bg-transparent border-transparent opacity-30'}
                ${isToday ? 'ring-2 ring-cyan-500/30 border-cyan-500/30' : ''}`}>
                <span className={`text-[12px] font-bold block mb-1
                  ${isToday ? 'text-cyan-500 font-black' : day.isCurrentMonth ? 'text-sg-heading' : 'text-sg-muted'}`}>
                  {day.date}
                </span>
                {posts.slice(0, 2).map(p => {
                  const platCfg = PLATFORM_CONFIG[p.platform as ContentPlatform];
                  const statusCfg = CONTENT_STATUS_CONFIG[p.status as ContentStatus];
                  return (
                    <div key={p.id} className={`mb-1 px-1.5 py-1 rounded-lg text-[9px] font-bold truncate cursor-pointer hover:opacity-80 transition-opacity ${statusCfg?.bg} ${statusCfg?.color}`}>
                      {platCfg?.icon} {p.title}
                    </div>
                  );
                })}
                {posts.length > 2 && (
                  <span className="text-[9px] font-bold text-sg-muted">+{posts.length - 2} khác</span>
                )}
              </div>
            );
          })}
        </div>
      </SGGlassPanel>

      {/* Content Grid */}
      <h3 className="text-xl font-black text-sg-heading mt-10 mb-6">Bài viết gần đây</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContent.slice(0, 9).map(p => {
          const platCfg = PLATFORM_CONFIG[p.platform as ContentPlatform];
          const statusCfg = CONTENT_STATUS_CONFIG[p.status as ContentStatus];
          return (
            <div key={p.id} className="p-5 rounded-2xl bg-sg-card border border-sg-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{platCfg?.icon}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusCfg?.bg} ${statusCfg?.color}`}>{statusCfg?.label}</span>
              </div>
              <h4 className="text-[15px] font-extrabold text-sg-heading mb-2 group-hover:text-cyan-500 transition-colors leading-snug">{p.title}</h4>
              <div className="flex items-center gap-3 text-[11px] font-bold text-sg-muted mb-3">
                <span className={platCfg?.color}>{platCfg?.label}</span>
                <span>•</span>
                <span>{p.publishedDate || p.scheduledDate || 'Chưa lên lịch'}</span>
              </div>
              {p.engagement && (
                <div className="flex items-center gap-4 text-[11px] font-bold text-sg-subtext pt-3 border-t border-sg-border/50">
                  {p.engagement.views !== undefined && <span className="flex items-center gap-1"><Eye size={12} />{(p.engagement.views / 1000).toFixed(1)}K</span>}
                  {p.engagement.likes !== undefined && <span className="flex items-center gap-1"><Heart size={12} />{p.engagement.likes}</span>}
                  {p.engagement.comments !== undefined && <span className="flex items-center gap-1"><MessageCircle size={12} />{p.engagement.comments}</span>}
                  {p.engagement.shares !== undefined && <span className="flex items-center gap-1"><Share2 size={12} />{p.engagement.shares}</span>}
                </div>
              )}
              {p.author && (
                <div className="mt-3 text-[11px] font-bold text-sg-muted">Tác giả: {p.author}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
