---
name: Data Analyst
description: Data modeling, SQL analytics, BI dashboards, KPI tracking, and reporting automation for SGROUP ERP
---

# Data Analyst Skill — SGROUP ERP

## Role Overview
The Data Analyst transforms raw ERP data into actionable business insights through analytics, dashboards, and automated reporting.

## SQL Analytics Patterns

### 1. Sales Performance Analysis
```sql
-- Monthly sales by rep
SELECT
  u.name AS sales_rep,
  DATE_TRUNC('month', d.closed_at) AS month,
  COUNT(*) AS deals_closed,
  SUM(d.value) AS total_revenue,
  AVG(d.value) AS avg_deal_size,
  COUNT(*) FILTER (WHERE d.status = 'WON') AS won,
  COUNT(*) FILTER (WHERE d.status = 'LOST') AS lost,
  ROUND(
    COUNT(*) FILTER (WHERE d.status = 'WON')::numeric /
    NULLIF(COUNT(*), 0) * 100, 1
  ) AS win_rate_pct
FROM deals d
JOIN users u ON d.assigned_to_id = u.id
WHERE d.closed_at >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY u.name, DATE_TRUNC('month', d.closed_at)
ORDER BY month DESC, total_revenue DESC;
```

### 2. Pipeline Funnel Analysis
```sql
-- Lead-to-Deal conversion funnel
WITH funnel AS (
  SELECT
    COUNT(*) FILTER (WHERE status IN ('NEW','CONTACTED','QUALIFIED','WON','LOST')) AS total_leads,
    COUNT(*) FILTER (WHERE status IN ('CONTACTED','QUALIFIED','WON','LOST')) AS contacted,
    COUNT(*) FILTER (WHERE status IN ('QUALIFIED','WON','LOST')) AS qualified,
    COUNT(*) FILTER (WHERE status IN ('WON','LOST')) AS negotiated,
    COUNT(*) FILTER (WHERE status = 'WON') AS won
  FROM leads
  WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
)
SELECT
  total_leads,
  contacted,
  ROUND(contacted::numeric / NULLIF(total_leads, 0) * 100, 1) AS contact_rate,
  qualified,
  ROUND(qualified::numeric / NULLIF(contacted, 0) * 100, 1) AS qualify_rate,
  won,
  ROUND(won::numeric / NULLIF(total_leads, 0) * 100, 1) AS overall_conversion
FROM funnel;
```

### 3. Cohort Analysis (Customer Retention)
```sql
-- Monthly cohort retention
WITH cohorts AS (
  SELECT
    user_id,
    DATE_TRUNC('month', MIN(created_at)) AS cohort_month
  FROM orders
  GROUP BY user_id
),
activity AS (
  SELECT
    c.cohort_month,
    DATE_TRUNC('month', o.created_at) AS activity_month,
    COUNT(DISTINCT o.user_id) AS active_users
  FROM orders o
  JOIN cohorts c ON o.user_id = c.user_id
  GROUP BY c.cohort_month, DATE_TRUNC('month', o.created_at)
)
SELECT
  cohort_month,
  activity_month,
  active_users,
  EXTRACT(MONTH FROM AGE(activity_month, cohort_month)) AS months_since_join
FROM activity
ORDER BY cohort_month, activity_month;
```

### 4. Window Functions for Trend Analysis
```sql
-- Sales trend with moving average and growth rate
SELECT
  date,
  daily_revenue,
  AVG(daily_revenue) OVER (
    ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d,
  ROUND(
    (daily_revenue - LAG(daily_revenue) OVER (ORDER BY date))::numeric /
    NULLIF(LAG(daily_revenue) OVER (ORDER BY date), 0) * 100, 1
  ) AS growth_rate_pct,
  SUM(daily_revenue) OVER (
    ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_revenue
FROM daily_sales
ORDER BY date DESC;
```

## KPI Framework

### Sales KPIs
| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| Total Revenue | SUM(deal_value) WHERE won | ₫500M/month | Daily |
| Conversion Rate | Won / Total Leads × 100 | ≥ 10% | Weekly |
| Avg Deal Size | SUM(value) / COUNT(won) | ₫50M | Monthly |
| Sales Cycle Length | AVG(closed_at - created_at) | ≤ 30 days | Monthly |
| Pipeline Coverage | Pipeline Value / Target × 100 | ≥ 300% | Weekly |
| Activities per Rep | COUNT(activities) / COUNT(reps) | ≥ 20/day | Daily |
| Lead Response Time | AVG(first_contact - lead_created) | ≤ 1 hour | Daily |

### Operational KPIs
| KPI | Formula | Target | Frequency |
|-----|---------|--------|-----------|
| DAU/MAU | Daily Active / Monthly Active | ≥ 40% | Daily |
| Feature Adoption | Users using feature / Total users | ≥ 60% | Monthly |
| System Uptime | Uptime / Total time × 100 | ≥ 99.9% | Monthly |
| Avg Response Time | AVG(api_response_ms) | < 200ms | Real-time |
| Support Ticket Volume | COUNT(tickets) per period | Decreasing | Weekly |

## Dashboard Design

### Executive Dashboard Layout
```
┌─────────────────────────────────────────────────────┐
│  SGROUP ERP — Executive Dashboard     [This Month ▼]│
├──────────┬──────────┬──────────┬───────────────────┤
│ Revenue  │ Deals    │ Pipeline │ Win Rate          │
│ ₫1.2B    │ 45       │ ₫3.5B    │ 23%               │
│ +15% ↑   │ +8% ↑   │ +12% ↑  │ +2pp ↑            │
├──────────┴──────────┴──────────┴───────────────────┤
│                                                     │
│  [Revenue Trend Line Chart — 12 months]            │
│                                                     │
├─────────────────────┬───────────────────────────────┤
│ Pipeline by Stage   │ Top Performers                │
│ [Funnel Chart]      │ 1. Nguyễn A — ₫200M          │
│                     │ 2. Trần B — ₫180M             │
│                     │ 3. Lê C — ₫150M               │
├─────────────────────┴───────────────────────────────┤
│ Revenue by Source [Pie]  │ Monthly Comparison [Bar]  │
└─────────────────────────────────────────────────────┘
```

## Data Modeling

### Star Schema for Sales Analytics
```
           ┌────────────┐
           │ dim_date    │
           │ date_key    │
           │ day, month  │
           │ quarter, year│
           └──────┬─────┘
                  │
┌────────────┐   │   ┌────────────┐
│ dim_product │───┤───│ dim_customer│
│ product_key│   │   │ customer_key│
│ name, cat  │   │   │ name, segment│
└────────────┘   │   └────────────┘
                  │
           ┌──────▼─────┐
           │fact_sales   │
           │ date_key FK │
           │ product_key │
           │ customer_key│
           │ rep_key FK  │
           │ quantity    │
           │ revenue     │
           │ discount    │
           └──────┬─────┘
                  │
           ┌──────▼─────┐
           │ dim_sales_rep│
           │ rep_key     │
           │ name, team  │
           │ region      │
           └────────────┘
```

## Reporting Automation

### Automated Daily Report (Prisma Query)
```typescript
async function generateDailyReport(date: Date) {
  const startOfDay = new Date(date.setHours(0,0,0,0));
  const endOfDay = new Date(date.setHours(23,59,59,999));

  const [newLeads, closedDeals, activities, revenue] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: startOfDay, lte: endOfDay } } }),
    prisma.deal.count({ where: { closedAt: { gte: startOfDay, lte: endOfDay }, status: 'WON' } }),
    prisma.activity.count({ where: { createdAt: { gte: startOfDay, lte: endOfDay } } }),
    prisma.deal.aggregate({
      where: { closedAt: { gte: startOfDay, lte: endOfDay }, status: 'WON' },
      _sum: { value: true },
    }),
  ]);

  return {
    date: startOfDay.toISOString().split('T')[0],
    newLeads,
    closedDeals,
    activities,
    revenue: revenue._sum.value || 0,
  };
}
```

## Tools Ecosystem
| Tool | Purpose | Integration |
|------|---------|-------------|
| Metabase | BI Dashboard | Connect to PostgreSQL directly |
| Grafana | Real-time monitoring | Prometheus + PostgreSQL datasource |
| Google Sheets | Ad-hoc analysis | Export via API |
| Prisma Studio | Data exploration | Built-in with Prisma |
| pgAdmin | Database management | Direct PostgreSQL connection |
