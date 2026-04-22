// ═══════════════════════════════════════════════════════════
// Marketing Module — Mock Data
// ═══════════════════════════════════════════════════════════

import type { Campaign, Lead, ContentPost, MarketingBudgetItem, ChannelMetric, KOLPartner, MKTDashboardData } from '../types';

export const MOCK_DASHBOARD: MKTDashboardData = {
  totalBudget: 2_500_000_000,
  totalSpent: 1_875_000_000,
  totalLeads: 1247,
  conversionRate: 12.8,
  activeCampaigns: 8,
  totalContent: 156,
  channelDistribution: [
    { channel: 'FACEBOOK_ADS', amount: 800_000_000, percent: 32 },
    { channel: 'GOOGLE_ADS', amount: 625_000_000, percent: 25 },
    { channel: 'KOL', amount: 375_000_000, percent: 15 },
    { channel: 'SEO', amount: 250_000_000, percent: 10 },
    { channel: 'EVENTS', amount: 200_000_000, percent: 8 },
    { channel: 'EMAIL', amount: 125_000_000, percent: 5 },
    { channel: 'CONTENT', amount: 100_000_000, percent: 4 },
    { channel: 'OTHER', amount: 25_000_000, percent: 1 },
  ],
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Summer Sale 2026 — Facebook', description: 'Chiến dịch chạy ads Facebook cho Summer Sale Q2/2026', status: 'ACTIVE', channel: 'FACEBOOK_ADS', budget: 300_000_000, spent: 187_000_000, startDate: '2026-04-01', endDate: '2026-06-30', owner: 'Nguyễn Minh Tú', targetLeads: 500, actualLeads: 312, targetConversions: 50, actualConversions: 28, kpiGoal: 'CPL < 500K', tags: ['summer', 'sale', 'facebook'] },
  { id: 'c2', name: 'Google Search — BĐS Cao cấp', description: 'Google Ads search cho dự án BĐS phân khúc cao cấp', status: 'ACTIVE', channel: 'GOOGLE_ADS', budget: 500_000_000, spent: 320_000_000, startDate: '2026-03-15', endDate: '2026-09-30', owner: 'Trần Hải Đăng', targetLeads: 200, actualLeads: 145, targetConversions: 20, actualConversions: 14, kpiGoal: 'ROAS > 5x', tags: ['premium', 'bds'] },
  { id: 'c3', name: 'KOL Review — Dự án Sunrise', description: 'Hợp tác KOL review dự án Sunrise City Walk', status: 'ACTIVE', channel: 'KOL', budget: 200_000_000, spent: 120_000_000, startDate: '2026-04-10', endDate: '2026-05-31', owner: 'Lê Thị Kim Anh', targetLeads: 300, actualLeads: 198, kpiGoal: 'Reach 2M', tags: ['kol', 'sunrise'] },
  { id: 'c4', name: 'Email Nurturing — Khách cũ Q1', description: 'Chiến dịch email chăm sóc khách hàng cũ', status: 'COMPLETED', channel: 'EMAIL', budget: 30_000_000, spent: 28_000_000, startDate: '2026-01-01', endDate: '2026-03-31', owner: 'Phạm Văn Hoàng', targetLeads: 100, actualLeads: 89, targetConversions: 15, actualConversions: 12, kpiGoal: 'Open rate > 25%', tags: ['email', 'nurture'] },
  { id: 'c5', name: 'SEO Blog — Từ khoá BĐS', description: 'Tối ưu SEO cho 50 bài viết blog liên quan BĐS', status: 'ACTIVE', channel: 'SEO', budget: 100_000_000, spent: 65_000_000, startDate: '2026-02-01', endDate: '2026-12-31', owner: 'Vũ Quang Huy', targetLeads: 400, actualLeads: 210, kpiGoal: 'Top 3 cho 20 keywords', tags: ['seo', 'blog'] },
  { id: 'c6', name: 'Event — Open House Quý 2', description: 'Tổ chức event mở bán cho dự án mới', status: 'PLANNING', channel: 'EVENTS', budget: 150_000_000, spent: 0, startDate: '2026-05-15', endDate: '2026-05-16', owner: 'Nguyễn Minh Tú', targetLeads: 200, actualLeads: 0, kpiGoal: '200 khách tham dự', tags: ['event', 'open-house'] },
  { id: 'c7', name: 'TikTok Viral — S-Homes', description: 'Tạo content viral TikTok cho S-Homes', status: 'PLANNING', channel: 'CONTENT', budget: 80_000_000, spent: 0, startDate: '2026-05-01', endDate: '2026-07-31', owner: 'Lê Thị Kim Anh', targetLeads: 150, actualLeads: 0, kpiGoal: '10M views', tags: ['tiktok', 'viral'] },
  { id: 'c8', name: 'Retargeting Q1 — Facebook', description: 'Retarget khách đã xem website trong Q1', status: 'PAUSED', channel: 'FACEBOOK_ADS', budget: 120_000_000, spent: 45_000_000, startDate: '2026-03-01', endDate: '2026-04-30', owner: 'Trần Hải Đăng', targetLeads: 180, actualLeads: 67, kpiGoal: 'CPC < 5K', tags: ['retarget', 'facebook'] },
  { id: 'c9', name: 'Brand Awareness — Instagram', description: 'Xây dựng nhận diện thương hiệu trên Instagram', status: 'ACTIVE', channel: 'FACEBOOK_ADS', budget: 200_000_000, spent: 95_000_000, startDate: '2026-01-01', endDate: '2026-12-31', owner: 'Lê Thị Kim Anh', targetLeads: 600, actualLeads: 280, kpiGoal: 'Followers +5K/tháng', tags: ['brand', 'instagram'] },
  { id: 'c10', name: 'LinkedIn B2B — Đại lý tuyển dụng', description: 'Chiến dịch tuyển đại lý qua LinkedIn', status: 'ARCHIVED', channel: 'OTHER', budget: 50_000_000, spent: 48_000_000, startDate: '2025-10-01', endDate: '2025-12-31', owner: 'Phạm Văn Hoàng', targetLeads: 50, actualLeads: 42, targetConversions: 10, actualConversions: 8, kpiGoal: '10 đại lý mới', tags: ['linkedin', 'b2b'] },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Nguyễn Văn Anh', email: 'anh.nv@gmail.com', phone: '0901234567', source: 'FACEBOOK_ADS', status: 'NEW', campaign: 'Summer Sale 2026', campaignId: 'c1', value: 5_000_000_000, createdAt: '2026-04-16' },
  { id: 'l2', name: 'Trần Thị Bích', email: 'bich.tt@gmail.com', phone: '0912345678', source: 'GOOGLE_ADS', status: 'CONTACTED', campaign: 'Google Search — BĐS Cao cấp', campaignId: 'c2', assignedTo: 'Nguyễn Minh Tú', value: 8_000_000_000, createdAt: '2026-04-15' },
  { id: 'l3', name: 'Lê Hoàng Cường', email: 'cuong.lh@yahoo.com', phone: '0923456789', source: 'KOL', status: 'QUALIFIED', campaign: 'KOL Review — Sunrise', campaignId: 'c3', assignedTo: 'Trần Hải Đăng', value: 12_000_000_000, createdAt: '2026-04-14' },
  { id: 'l4', name: 'Phạm Thuỳ Dương', email: 'duong.pt@hotmail.com', phone: '0934567890', source: 'SEO', status: 'CONVERTED', campaign: 'SEO Blog', campaignId: 'c5', assignedTo: 'Trần Hải Đăng', value: 3_500_000_000, createdAt: '2026-04-10' },
  { id: 'l5', name: 'Hoàng Minh Đức', email: 'duc.hm@gmail.com', phone: '0945678901', source: 'EVENTS', status: 'NEW', campaign: 'Open House Quý 2', campaignId: 'c6', createdAt: '2026-04-17' },
  { id: 'l6', name: 'Vũ Thị Hà', email: 'ha.vt@gmail.com', source: 'EMAIL', status: 'CONTACTED', campaign: 'Email Nurturing Q1', campaignId: 'c4', assignedTo: 'Phạm Văn Hoàng', value: 2_000_000_000, createdAt: '2026-04-12' },
  { id: 'l7', name: 'Đặng Quốc Hùng', email: 'hung.dq@gmail.com', phone: '0967890123', source: 'FACEBOOK_ADS', status: 'LOST', campaign: 'Retargeting Q1', campaignId: 'c8', notes: 'Đã mua BĐS nơi khác', createdAt: '2026-03-25' },
  { id: 'l8', name: 'Bùi Thị Lan', email: 'lan.bt@gmail.com', phone: '0978901234', source: 'GOOGLE_ADS', status: 'QUALIFIED', campaign: 'Google Search — BĐS Cao cấp', campaignId: 'c2', assignedTo: 'Nguyễn Minh Tú', value: 15_000_000_000, createdAt: '2026-04-13' },
  { id: 'l9', name: 'Trịnh Văn Minh', email: 'minh.tv@gmail.com', source: 'CONTENT', status: 'NEW', campaign: 'Brand Awareness', campaignId: 'c9', createdAt: '2026-04-18' },
  { id: 'l10', name: 'Ngô Gia Phong', email: 'phong.ng@gmail.com', phone: '0990123456', source: 'KOL', status: 'CONTACTED', campaign: 'KOL Review — Sunrise', campaignId: 'c3', assignedTo: 'Lê Thị Kim Anh', value: 6_000_000_000, createdAt: '2026-04-11' },
];

export const MOCK_CONTENT: ContentPost[] = [
  { id: 'p1', title: 'Summer Sale — Ưu đãi lên đến 500 triệu', platform: 'FACEBOOK', status: 'PUBLISHED', publishedDate: '2026-04-15', author: 'Lê Thị Kim Anh', engagement: { likes: 1240, comments: 89, shares: 156, views: 45200 }, campaignId: 'c1', tags: ['sale', 'promo'] },
  { id: 'p2', title: 'Top 10 lý do chọn BĐS cao cấp 2026', platform: 'WEBSITE', status: 'PUBLISHED', publishedDate: '2026-04-12', author: 'Vũ Quang Huy', engagement: { views: 8900 }, campaignId: 'c5', tags: ['blog', 'seo'] },
  { id: 'p3', title: 'Review thực tế dự án Sunrise City Walk', platform: 'TIKTOK', status: 'PUBLISHED', publishedDate: '2026-04-14', author: 'KOL @nhahangxom', engagement: { likes: 23400, comments: 1200, shares: 3400, views: 890000 }, campaignId: 'c3', tags: ['kol', 'review'] },
  { id: 'p4', title: 'Bí quyết đầu tư BĐS cho người trẻ', platform: 'INSTAGRAM', status: 'SCHEDULED', scheduledDate: '2026-04-20', author: 'Lê Thị Kim Anh', campaignId: 'c9', tags: ['tips', 'invest'] },
  { id: 'p5', title: 'Email Newsletter — Bảng giá T4/2026', platform: 'WEBSITE', status: 'DRAFT', author: 'Phạm Văn Hoàng', campaignId: 'c4', tags: ['newsletter'] },
  { id: 'p6', title: 'Livestream mở bán Open House', platform: 'FACEBOOK', status: 'SCHEDULED', scheduledDate: '2026-05-15', author: 'Nguyễn Minh Tú', campaignId: 'c6', tags: ['event', 'live'] },
  { id: 'p7', title: 'Infographic — Thị trường BĐS Q1', platform: 'LINKEDIN', status: 'PUBLISHED', publishedDate: '2026-04-08', author: 'Vũ Quang Huy', engagement: { likes: 560, comments: 34, shares: 120, views: 12400 }, tags: ['infographic', 'market'] },
  { id: 'p8', title: 'Video tour — Căn hộ mẫu Sunrise', platform: 'YOUTUBE', status: 'PUBLISHED', publishedDate: '2026-04-11', author: 'KOL @reviewbds', engagement: { likes: 4200, comments: 310, views: 128000 }, campaignId: 'c3', tags: ['video', 'tour'] },
  { id: 'p9', title: 'Carousel — 5 tiện ích nổi bật', platform: 'INSTAGRAM', status: 'DRAFT', author: 'Lê Thị Kim Anh', tags: ['carousel'] },
  { id: 'p10', title: 'Blog — Xu hướng thiết kế nội thất 2026', platform: 'WEBSITE', status: 'SCHEDULED', scheduledDate: '2026-04-22', author: 'Vũ Quang Huy', tags: ['blog', 'design'] },
];

export const MOCK_BUDGET: MarketingBudgetItem[] = [
  { id: 'b1', channel: 'FACEBOOK_ADS', month: '2026-04', budgeted: 100_000_000, actual: 87_000_000 },
  { id: 'b2', channel: 'GOOGLE_ADS', month: '2026-04', budgeted: 80_000_000, actual: 92_000_000 },
  { id: 'b3', channel: 'SEO', month: '2026-04', budgeted: 25_000_000, actual: 22_000_000 },
  { id: 'b4', channel: 'KOL', month: '2026-04', budgeted: 50_000_000, actual: 45_000_000 },
  { id: 'b5', channel: 'EVENTS', month: '2026-04', budgeted: 30_000_000, actual: 0 },
  { id: 'b6', channel: 'EMAIL', month: '2026-04', budgeted: 10_000_000, actual: 8_500_000 },
  { id: 'b7', channel: 'CONTENT', month: '2026-04', budgeted: 15_000_000, actual: 12_000_000 },
  { id: 'b8', channel: 'OTHER', month: '2026-04', budgeted: 5_000_000, actual: 3_200_000 },
  // March data
  { id: 'b9', channel: 'FACEBOOK_ADS', month: '2026-03', budgeted: 90_000_000, actual: 88_000_000 },
  { id: 'b10', channel: 'GOOGLE_ADS', month: '2026-03', budgeted: 75_000_000, actual: 78_000_000 },
  { id: 'b11', channel: 'SEO', month: '2026-03', budgeted: 25_000_000, actual: 24_000_000 },
  { id: 'b12', channel: 'KOL', month: '2026-03', budgeted: 40_000_000, actual: 38_000_000 },
];

export const MOCK_METRICS: ChannelMetric[] = [
  { channel: 'FACEBOOK_ADS', impressions: 2_450_000, clicks: 48_500, ctr: 1.98, cpc: 3_800, cpl: 280_000, conversions: 312, roas: 4.2, spend: 87_000_000 },
  { channel: 'GOOGLE_ADS', impressions: 890_000, clicks: 27_800, ctr: 3.12, cpc: 3_300, cpl: 635_000, conversions: 145, roas: 6.8, spend: 92_000_000 },
  { channel: 'SEO', impressions: 560_000, clicks: 34_200, ctr: 6.11, cpc: 643, cpl: 105_000, conversions: 210, spend: 22_000_000 },
  { channel: 'KOL', impressions: 3_200_000, clicks: 89_000, ctr: 2.78, cpc: 505, cpl: 227_000, conversions: 198, roas: 3.5, spend: 45_000_000 },
  { channel: 'EMAIL', impressions: 45_000, clicks: 8_900, ctr: 19.78, cpc: 955, cpl: 95_500, conversions: 89, spend: 8_500_000 },
  { channel: 'EVENTS', impressions: 12_000, clicks: 4_200, ctr: 35.0, cpc: 0, cpl: 0, conversions: 0, spend: 0 },
  { channel: 'CONTENT', impressions: 780_000, clicks: 23_400, ctr: 3.0, cpc: 513, cpl: 171_000, conversions: 70, spend: 12_000_000 },
];

export const MOCK_KOLS: KOLPartner[] = [
  { id: 'k1', name: 'Nguyễn Hà Linh (@nhahangxom)', platform: 'TIKTOK', followers: 2_400_000, category: 'Lifestyle / BĐS', pricePerPost: 25_000_000, rating: 4.8, totalCollabs: 5, lastCollab: '2026-04-14', contact: 'halinh@mgmt.vn', status: 'ACTIVE' },
  { id: 'k2', name: 'Trần Đức Anh (@reviewbds)', platform: 'YOUTUBE', followers: 890_000, category: 'BĐS Review', pricePerPost: 40_000_000, rating: 4.5, totalCollabs: 3, lastCollab: '2026-04-11', contact: 'ducanhreview@gmail.com', status: 'ACTIVE' },
  { id: 'k3', name: 'Phạm Minh Châu (@chaupham)', platform: 'INSTAGRAM', followers: 560_000, category: 'Interior Design', pricePerPost: 15_000_000, rating: 4.2, totalCollabs: 2, lastCollab: '2026-03-20', contact: 'chau.pham@talent.vn', status: 'ACTIVE' },
  { id: 'k4', name: 'Hoàng Thị Vân (@vantravels)', platform: 'TIKTOK', followers: 1_800_000, category: 'Travel / Lifestyle', pricePerPost: 20_000_000, rating: 4.6, totalCollabs: 1, lastCollab: '2026-02-15', contact: 'van.travel@gmail.com', status: 'INACTIVE' },
  { id: 'k5', name: 'Lưu Quang Hải (@hailuu_finance)', platform: 'YOUTUBE', followers: 1_200_000, category: 'Tài chính / Đầu tư', pricePerPost: 35_000_000, rating: 4.9, totalCollabs: 4, lastCollab: '2026-04-05', contact: 'hai@financecreators.vn', status: 'ACTIVE' },
  { id: 'k6', name: 'Vũ Thị Ngọc (@ngocvu.style)', platform: 'INSTAGRAM', followers: 340_000, category: 'Fashion / Lifestyle', pricePerPost: 8_000_000, rating: 3.8, totalCollabs: 0, contact: 'ngoc.style@gmail.com', status: 'PROSPECT' },
  { id: 'k7', name: 'Đặng Trung Kiên (@kien.bds)', platform: 'FACEBOOK', followers: 450_000, category: 'BĐS Expert', pricePerPost: 12_000_000, rating: 4.3, totalCollabs: 6, lastCollab: '2026-04-16', contact: 'kien.dang@expert.vn', status: 'ACTIVE' },
];

export const MOCK_ACTIVITIES = [
  { id: 'a1', title: 'Chiến dịch mới tạo', detail: 'TikTok Viral — S-Homes đã được lên kế hoạch bởi Kim Anh', time: '2 giờ trước', tone: '#f59e0b' },
  { id: 'a2', title: 'Lead mới từ Google Ads', detail: 'Bùi Thị Lan — Quan tâm BĐS cao cấp quận 7 (giá trị 15 tỷ)', time: '3 giờ trước', tone: '#22c55e' },
  { id: 'a3', title: 'Content đã publish', detail: 'Review thực tế dự án Sunrise City Walk đạt 890K views trên TikTok', time: '5 giờ trước', tone: '#3b82f6' },
  { id: 'a4', title: 'Chiến dịch hoàn thành', detail: 'Email Nurturing Q1 — Đạt 89/100 leads, conversion 12/15', time: 'Hôm qua', tone: '#8b5cf6' },
  { id: 'a5', title: 'Budget alert', detail: 'Google Ads T4 vượt 15% so với ngân sách (92M / 80M)', time: 'Hôm qua', tone: '#f43f5e' },
];
