// ═══════════════════════════════════════════════════════════
// Marketing Module — Constants & Helpers
// ═══════════════════════════════════════════════════════════

import type { CampaignStatus, LeadStatus, ContentStatus, ContentPlatform, MarketingChannel } from './types';

// ── Campaign Status Config ──
export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string; border: string }> = {
  PLANNING: { label: 'Lên kế hoạch', color: 'text-slate-500', bg: 'bg-slate-500/15', border: 'border-slate-500/20' },
  ACTIVE: { label: 'Đang chạy', color: 'text-emerald-500', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  PAUSED: { label: 'Tạm dừng', color: 'text-amber-500', bg: 'bg-amber-500/15', border: 'border-amber-500/20' },
  COMPLETED: { label: 'Hoàn thành', color: 'text-blue-500', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
  ARCHIVED: { label: 'Lưu trữ', color: 'text-gray-400', bg: 'bg-gray-400/15', border: 'border-gray-400/20' },
};

// ── Lead Status Config ──
export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  NEW: { label: 'Mới', color: 'text-blue-500', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
  CONTACTED: { label: 'Đã liên hệ', color: 'text-cyan-500', bg: 'bg-cyan-500/15', border: 'border-cyan-500/20' },
  QUALIFIED: { label: 'Tiềm năng', color: 'text-purple-500', bg: 'bg-purple-500/15', border: 'border-purple-500/20' },
  CONVERTED: { label: 'Chuyển đổi', color: 'text-emerald-500', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  LOST: { label: 'Mất', color: 'text-red-500', bg: 'bg-red-500/15', border: 'border-red-500/20' },
};

// ── Content Status Config ──
export const CONTENT_STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Bản nháp', color: 'text-slate-500', bg: 'bg-slate-500/15' },
  SCHEDULED: { label: 'Đã lên lịch', color: 'text-amber-500', bg: 'bg-amber-500/15' },
  PUBLISHED: { label: 'Đã đăng', color: 'text-emerald-500', bg: 'bg-emerald-500/15' },
  ARCHIVED: { label: 'Lưu trữ', color: 'text-gray-400', bg: 'bg-gray-400/15' },
};

// ── Platform Config ──
export const PLATFORM_CONFIG: Record<ContentPlatform, { label: string; color: string; icon: string }> = {
  FACEBOOK: { label: 'Facebook', color: 'text-blue-600', icon: '📘' },
  INSTAGRAM: { label: 'Instagram', color: 'text-pink-500', icon: '📸' },
  TIKTOK: { label: 'TikTok', color: 'text-gray-800', icon: '🎵' },
  LINKEDIN: { label: 'LinkedIn', color: 'text-blue-700', icon: '💼' },
  WEBSITE: { label: 'Website', color: 'text-indigo-500', icon: '🌐' },
  YOUTUBE: { label: 'YouTube', color: 'text-red-500', icon: '▶️' },
};

// ── Channel Config ──
export const CHANNEL_CONFIG: Record<MarketingChannel, { label: string; color: string }> = {
  FACEBOOK_ADS: { label: 'Facebook Ads', color: '#3b82f6' },
  GOOGLE_ADS: { label: 'Google Ads', color: '#f59e0b' },
  SEO: { label: 'SEO', color: '#22c55e' },
  EMAIL: { label: 'Email Marketing', color: '#8b5cf6' },
  EVENTS: { label: 'Events', color: '#ec4899' },
  KOL: { label: 'KOL/Influencer', color: '#f43f5e' },
  CONTENT: { label: 'Content Marketing', color: '#06b6d4' },
  OTHER: { label: 'Khác', color: '#64748b' },
};

// ── Helpers ──
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toLocaleString('vi-VN');
}

export function formatNumber(num: number): string {
  return num.toLocaleString('vi-VN');
}

export function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'U';
}

export function nameToColorClass(name?: string) {
  const colors = [
    { text: 'text-orange-500', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
    { text: 'text-pink-500', bg: 'bg-pink-500/15', border: 'border-pink-500/30' },
    { text: 'text-purple-500', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
    { text: 'text-blue-500', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
    { text: 'text-emerald-500', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    { text: 'text-cyan-500', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
    { text: 'text-indigo-500', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
    { text: 'text-rose-500', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
