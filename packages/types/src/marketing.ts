// ═══════════════════════════════════════════════════════════
// @sgroup/types — Marketing Module Types
// ═══════════════════════════════════════════════════════════

export type MKTRole = 'admin' | 'mkt_manager' | 'mkt_director' | 'mkt_staff';

export type CampaignStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type ContentStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
export type ContentPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'LINKEDIN' | 'WEBSITE' | 'YOUTUBE';
export type MarketingChannel = 'FACEBOOK_ADS' | 'GOOGLE_ADS' | 'SEO' | 'EMAIL' | 'EVENTS' | 'KOL' | 'CONTENT' | 'OTHER';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  channel: MarketingChannel;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  owner?: string;
  ownerAvatar?: string;
  targetLeads?: number;
  actualLeads?: number;
  targetConversions?: number;
  actualConversions?: number;
  kpiGoal?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: MarketingChannel | string;
  status: LeadStatus;
  campaign?: string;
  campaignId?: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  notes?: string;
  value?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentPost {
  id: string;
  title: string;
  platform: ContentPlatform;
  status: ContentStatus;
  scheduledDate?: string;
  publishedDate?: string;
  author?: string;
  content?: string;
  imageUrl?: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  campaignId?: string;
  tags?: string[];
  createdAt?: string;
}

export interface MarketingBudgetItem {
  id: string;
  channel: MarketingChannel;
  month: string; // YYYY-MM
  budgeted: number;
  actual: number;
  variance?: number;
  notes?: string;
}

export interface ChannelMetric {
  channel: MarketingChannel;
  impressions: number;
  clicks: number;
  ctr: number; // %
  cpc: number;
  cpl: number;
  conversions: number;
  roas?: number;
  spend: number;
}

export interface KOLPartner {
  id: string;
  name: string;
  platform: ContentPlatform;
  followers: number;
  category?: string;
  pricePerPost?: number;
  rating?: number; // 1-5
  totalCollabs?: number;
  lastCollab?: string;
  contact?: string;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  notes?: string;
}

export interface MKTDashboardData {
  totalBudget: number;
  totalSpent: number;
  totalLeads: number;
  conversionRate: number;
  activeCampaigns: number;
  totalContent: number;
  channelDistribution: { channel: MarketingChannel; amount: number; percent: number }[];
}
