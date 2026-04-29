import { useCallback, useEffect, useMemo, useState } from 'react';

export const MONTHS_OPTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;

export type ScenarioKey = 'base' | 'optimistic' | 'pessimistic';
export type FunnelMetric = 'gmv' | 'deals' | 'bookings' | 'meetings' | 'leadsSale';
export type StaffStatus = 'active' | 'planned' | 'off';
export type TeamStatus = 'active' | 'inactive';

export interface FunnelRates {
  meeting: number;
  booking: number;
  deal: number;
}

export interface CeoPlanData {
  year: number;
  targetGMV: number;
  avgDealValue: number;
  inhouseRevenue: number;
  rates: FunnelRates;
  marketingRate: number;
  source: string;
}

export interface CcoPlanData {
  year: number;
  targetGMV: number;
  inhouseRevenue: number;
  avgDealValue: number;
  rates: FunnelRates;
}

export interface MonthPlan {
  month: number;
  weight: number;
  gmv: number;
}

export interface SalesTeam {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  status: TeamStatus;
  activeFrom: number;
  activeTo: number;
}

export interface SalesStaff {
  id: string;
  hoTen: string;
  role: string;
  team: string;
  status: StaffStatus;
  activeFrom: number;
  activeTo: number;
  leadsCapacity: number;
  rates: FunnelRates;
}

export interface FunnelResult {
  deals: number;
  bookings: number;
  meetings: number;
  leads: number;
}

export interface MonthlyFunnel extends FunnelResult {
  month: number;
  gmv: number;
  leadsSale: number;
}

export interface AllocationMonth {
  active: boolean;
  gmv: number;
  deals: number;
  bookings: number;
  meetings: number;
  leadsSale: number;
  staffCount: number;
}

export interface TeamAllocation {
  teamId: string;
  teamName: string;
  status: TeamStatus;
  months: AllocationMonth[];
}

export interface MemberAllocation {
  memberId: string;
  memberName: string;
  status: StaffStatus;
  activeFrom: number;
  activeTo: number;
  months: AllocationMonth[];
}

const safeNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const clampMonth = (month: unknown) => Math.min(12, Math.max(1, Math.round(safeNum(month) || 1)));

const defaultRates: FunnelRates = { deal: 50, booking: 30, meeting: 20 };

const scenarioPresets: Record<ScenarioKey, { label: string; targetGMV: number; avgDealValue: number; marketingRate: number }> = {
  base: { label: 'Thực tế', targetGMV: 1_800, avgDealValue: 5, marketingRate: 0.35 },
  optimistic: { label: 'Lạc quan', targetGMV: 2_200, avgDealValue: 5.4, marketingRate: 0.4 },
  pessimistic: { label: 'Thận trọng', targetGMV: 1_450, avgDealValue: 4.7, marketingRate: 0.3 },
};

export const SCENARIO_META: Record<ScenarioKey, { label: string; tone: string; activeCls: string }> = {
  base: { label: 'Thực tế', tone: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300', activeCls: 'bg-blue-50 text-blue-600 shadow-sm border-blue-200' },
  optimistic: { label: 'Lạc quan', tone: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', activeCls: 'bg-emerald-50 text-emerald-600 shadow-sm border-emerald-200' },
  pessimistic: { label: 'Thận trọng', tone: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', activeCls: 'bg-orange-50 text-orange-600 shadow-sm border-orange-200' },
};

function normalizeRates(rates?: Partial<FunnelRates> | null): FunnelRates {
  const fix = (value: unknown, fallback: number) => {
    const n = safeNum(value);
    if (n <= 0) return fallback;
    return n <= 1 ? n * 100 : n;
  };

  return {
    deal: fix(rates?.deal, defaultRates.deal),
    booking: fix(rates?.booking, defaultRates.booking),
    meeting: fix(rates?.meeting, defaultRates.meeting),
  };
}

function normalizeMarketingRate(value: unknown) {
  const n = safeNum(value);
  if (n <= 0) return 0.35;
  return n > 1 ? n / 100 : n;
}

function calcFunnel(gmv: number, rates: FunnelRates, avgVal: number): FunnelResult {
  const av = safeNum(avgVal) || 1;
  const normalizedRates = normalizeRates(rates);
  const deals = Math.ceil(safeNum(gmv) / av);
  const bookings = normalizedRates.deal > 0 ? Math.ceil(deals / (normalizedRates.deal / 100)) : 0;
  const meetings = normalizedRates.booking > 0 ? Math.ceil(bookings / (normalizedRates.booking / 100)) : 0;
  const leads = normalizedRates.meeting > 0 ? Math.ceil(meetings / (normalizedRates.meeting / 100)) : 0;

  return { deals, bookings, meetings, leads };
}

function defaultMonths(targetGMV: number): MonthPlan[] {
  const baseWeight = Number((100 / 12).toFixed(2));
  return MONTHS_OPTS.map((month, index) => {
    const weight = index === 11 ? Number((100 - baseWeight * 11).toFixed(2)) : baseWeight;
    return {
      month,
      weight,
      gmv: safeNum(targetGMV) * weight / 100,
    };
  });
}

function buildDefaultTeams(): SalesTeam[] {
  return [
    { id: 'team-alpha', name: 'Alpha', leaderId: 'NV001', leaderName: 'Nguyen Minh Chau', status: 'active', activeFrom: 1, activeTo: 12 },
    { id: 'team-delta', name: 'Delta', leaderId: 'NV004', leaderName: 'Tran Quoc Bao', status: 'active', activeFrom: 1, activeTo: 12 },
    { id: 'team-elite', name: 'Elite', leaderId: 'NV007', leaderName: 'Pham Hoang Linh', status: 'active', activeFrom: 3, activeTo: 12 },
  ];
}

function buildDefaultStaff(): SalesStaff[] {
  return [
    { id: 'NV001', hoTen: 'Nguyen Minh Chau', role: 'Truong phong', team: 'Alpha', status: 'active', activeFrom: 1, activeTo: 12, leadsCapacity: 80, rates: defaultRates },
    { id: 'NV002', hoTen: 'Le Gia Han', role: 'Senior Sales', team: 'Alpha', status: 'active', activeFrom: 1, activeTo: 12, leadsCapacity: 70, rates: defaultRates },
    { id: 'NV003', hoTen: 'Hoang Tuan Kiet', role: 'Sales', team: 'Alpha', status: 'active', activeFrom: 2, activeTo: 12, leadsCapacity: 55, rates: defaultRates },
    { id: 'NV004', hoTen: 'Tran Quoc Bao', role: 'Truong phong', team: 'Delta', status: 'active', activeFrom: 1, activeTo: 12, leadsCapacity: 85, rates: defaultRates },
    { id: 'NV005', hoTen: 'Bui Thanh Tam', role: 'Senior Sales', team: 'Delta', status: 'active', activeFrom: 1, activeTo: 12, leadsCapacity: 72, rates: defaultRates },
    { id: 'NV006', hoTen: 'Do My Linh', role: 'Sales', team: 'Delta', status: 'planned', activeFrom: 7, activeTo: 12, leadsCapacity: 45, rates: defaultRates },
    { id: 'NV007', hoTen: 'Pham Hoang Linh', role: 'Truong phong', team: 'Elite', status: 'active', activeFrom: 3, activeTo: 12, leadsCapacity: 90, rates: defaultRates },
    { id: 'NV008', hoTen: 'Vu Duc Anh', role: 'Sales', team: 'Elite', status: 'active', activeFrom: 4, activeTo: 12, leadsCapacity: 60, rates: defaultRates },
    { id: 'NV009', hoTen: 'Dang Ngoc Mai', role: 'Sales', team: 'Elite', status: 'active', activeFrom: 5, activeTo: 12, leadsCapacity: 58, rates: defaultRates },
  ];
}

export function isActiveInMonth(entity: Pick<SalesTeam, 'status' | 'activeFrom' | 'activeTo'> | Pick<SalesStaff, 'status' | 'activeFrom' | 'activeTo'>, month: number) {
  const status = entity.status || 'active';
  if (status === 'inactive' || status === 'planned' || status === 'off') return false;
  const from = clampMonth(entity.activeFrom || 1);
  const to = clampMonth(entity.activeTo || 12);
  return month >= from && month <= to;
}

function applyWeights(targetGMV: number, weights: number[]): MonthPlan[] {
  return MONTHS_OPTS.map((month, index) => {
    const weight = safeNum(weights[index]);
    return { month, weight, gmv: safeNum(targetGMV) * weight / 100 };
  });
}

const monthPresets: Record<string, number[]> = {
  equal: [8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.37],
  year_end: [5, 5, 5, 6, 6, 7, 8, 8, 12, 13, 13, 12],
  spring_peak: [12, 12, 11, 10, 8, 7, 7, 7, 8, 6, 6, 6],
};

export function useSalesPlanData() {
  const [scenarioState, setScenarioState] = useState<ScenarioKey>('base');
  const [ceoData, setCeoData] = useState<CeoPlanData>({
    year: CURRENT_YEAR,
    targetGMV: scenarioPresets.base.targetGMV,
    avgDealValue: scenarioPresets.base.avgDealValue,
    inhouseRevenue: 0,
    rates: defaultRates,
    marketingRate: scenarioPresets.base.marketingRate,
    source: 'default',
  });
  const [ccoData, setCcoData] = useState<CcoPlanData>({
    year: CURRENT_YEAR,
    targetGMV: scenarioPresets.base.targetGMV,
    inhouseRevenue: 90,
    avgDealValue: scenarioPresets.base.avgDealValue,
    rates: defaultRates,
  });
  const [monthsData, setMonthsData] = useState<MonthPlan[]>(() => defaultMonths(scenarioPresets.base.targetGMV));
  const [teams, setTeams] = useState<SalesTeam[]>(() => buildDefaultTeams());
  const [staffList, setStaffList] = useState<SalesStaff[]>(() => buildDefaultStaff());
  const [salesCount, setSalesCount] = useState(() => buildDefaultStaff().filter((staff) => staff.status === 'active').length);
  const [allocTeamId, setAllocTeamId] = useState<string>('team-alpha');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const mktRate = useMemo(() => normalizeMarketingRate(ceoData.marketingRate), [ceoData.marketingRate]);
  const saleRate = 1 - mktRate;

  const funnel = useMemo(
    () => calcFunnel(ccoData.targetGMV, ccoData.rates, ccoData.avgDealValue),
    [ccoData.targetGMV, ccoData.rates, ccoData.avgDealValue],
  );

  const perSale = useMemo(() => {
    const activeSales = Math.max(1, safeNum(salesCount));
    return {
      revenue: safeNum(ccoData.targetGMV) / activeSales / 12,
      deals: safeNum(funnel.deals) / activeSales / 12,
      leads: safeNum(funnel.leads) * saleRate / 12 / activeSales,
      meetings: safeNum(funnel.meetings) / activeSales / 12,
      bookings: safeNum(funnel.bookings) / activeSales / 12,
    };
  }, [ccoData.targetGMV, funnel, saleRate, salesCount]);

  useEffect(() => {
    const t = safeNum(ccoData.targetGMV);
    setMonthsData((prev) => prev.map((m) => ({ ...m, gmv: t * safeNum(m.weight) / 100 })));
  }, [ccoData.targetGMV]);

  useEffect(() => {
    if (!allocTeamId && teams.length > 0) setAllocTeamId(teams[0].id);
    if (allocTeamId && !teams.some((team) => team.id === allocTeamId)) {
      setAllocTeamId(teams[0]?.id || '');
    }
  }, [allocTeamId, teams]);

  const monthlyFunnel = useMemo<MonthlyFunnel[]>(() => {
    return monthsData.map((monthPlan) => {
      const monthFunnel = calcFunnel(monthPlan.gmv, ccoData.rates, ccoData.avgDealValue);
      return {
        month: monthPlan.month,
        gmv: safeNum(monthPlan.gmv),
        ...monthFunnel,
        leadsSale: Math.ceil(safeNum(monthFunnel.leads) * saleRate),
      };
    });
  }, [monthsData, ccoData.rates, ccoData.avgDealValue, saleRate]);

  const activeTeamsByMonth = useMemo(() => {
    return MONTHS_OPTS.map((month) => teams.filter((team) => isActiveInMonth(team, month)));
  }, [teams]);

  const activeStaffByTeamMonth = useMemo(() => {
    const result: Record<string, SalesStaff[][]> = {};
    teams.forEach((team) => {
      result[team.id] = MONTHS_OPTS.map((month) => {
        if (!isActiveInMonth(team, month)) return [];
        return staffList.filter((staff) => staff.team === team.name && isActiveInMonth(staff, month));
      });
    });
    return result;
  }, [staffList, teams]);

  const teamAllocation = useMemo<TeamAllocation[]>(() => {
    return teams.map((team) => {
      const months = MONTHS_OPTS.map((month, monthIndex) => {
        const activeTeams = activeTeamsByMonth[monthIndex];
        const activeTeamCount = activeTeams.length;
        const active = isActiveInMonth(team, month);
        if (!active || activeTeamCount === 0) {
          return { active: false, gmv: 0, deals: 0, bookings: 0, meetings: 0, leadsSale: 0, staffCount: 0 };
        }

        const monthData = monthlyFunnel[monthIndex];
        const staffInTeam = activeStaffByTeamMonth[team.id]?.[monthIndex] || [];
        return {
          active: true,
          gmv: monthData.gmv / activeTeamCount,
          deals: Math.ceil(monthData.deals / activeTeamCount),
          bookings: Math.ceil(monthData.bookings / activeTeamCount),
          meetings: Math.ceil(monthData.meetings / activeTeamCount),
          leadsSale: Math.ceil(monthData.leadsSale / activeTeamCount),
          staffCount: staffInTeam.length,
        };
      });

      return { teamId: team.id, teamName: team.name, status: team.status, months };
    });
  }, [activeStaffByTeamMonth, activeTeamsByMonth, monthlyFunnel, teams]);

  const selectedAllocationTeam = useMemo(
    () => teams.find((team) => team.id === allocTeamId) || null,
    [allocTeamId, teams],
  );

  const memberAllocation = useMemo<MemberAllocation[]>(() => {
    if (!selectedAllocationTeam) return [];
    const teamPlan = teamAllocation.find((allocation) => allocation.teamId === selectedAllocationTeam.id);
    if (!teamPlan) return [];

    const teamMembers = staffList.filter((staff) => staff.team === selectedAllocationTeam.name);
    return teamMembers.map((staff) => {
      const months = MONTHS_OPTS.map((month, monthIndex) => {
        const teamMonth = teamPlan.months[monthIndex];
        if (!teamMonth.active || !isActiveInMonth(staff, month)) {
          return { active: false, gmv: 0, deals: 0, bookings: 0, meetings: 0, leadsSale: 0, staffCount: 0 };
        }

        const staffCount = teamMonth.staffCount || 1;
        return {
          active: true,
          gmv: teamMonth.gmv / staffCount,
          deals: Math.ceil(teamMonth.deals / staffCount),
          bookings: Math.ceil(teamMonth.bookings / staffCount),
          meetings: Math.ceil(teamMonth.meetings / staffCount),
          leadsSale: Math.ceil(teamMonth.leadsSale / staffCount),
          staffCount,
        };
      });

      return {
        memberId: staff.id,
        memberName: staff.hoTen || 'N/A',
        status: staff.status,
        activeFrom: staff.activeFrom,
        activeTo: staff.activeTo,
        months,
      };
    });
  }, [selectedAllocationTeam, staffList, teamAllocation]);

  const setScenario = useCallback((nextScenario: string) => {
    const scenario = (nextScenario in scenarioPresets ? nextScenario : 'base') as ScenarioKey;
    const preset = scenarioPresets[scenario];
    setScenarioState(scenario);
    setCeoData((prev) => ({
      ...prev,
      targetGMV: preset.targetGMV,
      avgDealValue: preset.avgDealValue,
      marketingRate: preset.marketingRate,
      source: 'scenario',
    }));
    setCcoData((prev) => ({
      ...prev,
      targetGMV: preset.targetGMV,
      avgDealValue: preset.avgDealValue,
    }));
  }, []);

  const applyMonthPreset = useCallback((preset: keyof typeof monthPresets) => {
    const weights = monthPresets[preset] || monthPresets.equal;
    setMonthsData(applyWeights(safeNum(ccoData.targetGMV), weights));
  }, [ccoData.targetGMV]);

  const updateMonthWeight = useCallback((monthIndex: number, weight: number) => {
    setMonthsData((prev) => {
      const next = [...prev];
      if (!next[monthIndex]) return prev;
      const nextWeight = Math.max(0, safeNum(weight));
      next[monthIndex] = {
        ...next[monthIndex],
        weight: nextWeight,
        gmv: safeNum(ccoData.targetGMV) * nextWeight / 100,
      };
      return next;
    });
  }, [ccoData.targetGMV]);

  const saveDraft = useCallback(() => {
    const payload = {
      scenario: scenarioState,
      ceoData,
      ccoData,
      months: monthsData,
      allocation: { teams },
      staffList,
      result: {
        targetGMVInhouse: ccoData.targetGMV,
        numDeals: funnel.deals,
        numBookings: funnel.bookings,
        numMeetings: funnel.meetings,
        numLeads: funnel.leads,
        numLeadsMkt: Math.round(funnel.leads * mktRate),
        numLeadsSales: Math.round(funnel.leads * saleRate),
      },
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(`sgroup.exec.sales-plan.${scenarioState}`, JSON.stringify(payload));
    setSavedAt(payload.savedAt);
    return payload;
  }, [ccoData, ceoData, funnel, mktRate, monthsData, saleRate, scenarioState, staffList, teams]);

  return {
    scenario: scenarioState,
    setScenario,
    ceoData,
    setCeoData,
    ccoData,
    setCcoData,
    salesCount,
    setSalesCount,
    staffList,
    setStaffList,
    teams,
    setTeams,
    allocTeamId,
    setAllocTeamId,
    selectedAllocationTeam,
    funnel,
    perSale,
    mktRate,
    saleRate,
    monthsData,
    setMonthsData,
    monthlyFunnel,
    teamAllocation,
    memberAllocation,
    applyMonthPreset,
    updateMonthWeight,
    saveDraft,
    savedAt,
  };
}

export const formatVN = (v: unknown) => safeNum(v).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
export const formatMoney = (v: unknown) => safeNum(v).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
export const formatPercent = (v: unknown, digits = 1) => `${safeNum(v).toFixed(digits)}%`;
export const metricTotal = <T, K extends keyof T>(items: T[], key: K) => items.reduce((sum, item) => sum + safeNum(item[key]), 0);
