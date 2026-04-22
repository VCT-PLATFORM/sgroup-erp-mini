// ═══════════════════════════════════════════════════════════
// Marketing Module — API Client
// ═══════════════════════════════════════════════════════════

import { MOCK_DASHBOARD, MOCK_CAMPAIGNS, MOCK_LEADS, MOCK_CONTENT, MOCK_BUDGET, MOCK_METRICS, MOCK_KOLS, MOCK_ACTIVITIES } from './mktMocks';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const mktApi = {
  // Dashboard
  getDashboard: async () => { await delay(400); return MOCK_DASHBOARD; },
  getActivities: async () => { await delay(300); return MOCK_ACTIVITIES; },

  // Campaigns
  getCampaigns: async () => { await delay(500); return MOCK_CAMPAIGNS; },
  getCampaignById: async (id: string) => { await delay(300); return MOCK_CAMPAIGNS.find(c => c.id === id); },

  // Leads
  getLeads: async () => { await delay(500); return MOCK_LEADS; },

  // Content
  getContent: async () => { await delay(400); return MOCK_CONTENT; },

  // Budget
  getBudget: async () => { await delay(400); return MOCK_BUDGET; },

  // Analytics
  getMetrics: async () => { await delay(300); return MOCK_METRICS; },

  // KOL
  getKOLs: async () => { await delay(400); return MOCK_KOLS; },
};
