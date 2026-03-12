---
description: Data analysis, BI dashboards, KPI reporting, and analytics automation for SGROUP ERP
---

# Data Analytics Workflow

Quy trình phân tích dữ liệu, xây dựng dashboard BI, và tự động hóa báo cáo cho SGROUP ERP.

## When to Trigger
- Cần tạo dashboard/báo cáo mới
- Yêu cầu phân tích dữ liệu ad-hoc
- Setup KPI tracking cho module mới
- Tối ưu hóa hiệu suất kinh doanh

## Steps

1. **Define Analytics Requirements**
   - Xác định business question cần trả lời:
     ```
     QUESTION: [Câu hỏi cần trả lời]
     AUDIENCE: [Ai sẽ dùng dữ liệu này]
     FREQUENCY: [Daily / Weekly / Monthly / Ad-hoc]
     DATA SOURCES: [Bảng / module nào liên quan]
     ```
   - Xác định KPIs & metrics (tham khảo data-analyst skill):
     | KPI | Formula | Target | Frequency |
     |-----|---------|--------|-----------|
     | Revenue | SUM(deal_value) WHERE won | ₫500M/month | Daily |
     | Conversion Rate | Won / Total Leads × 100 | ≥ 10% | Weekly |
     | Avg Deal Size | SUM(value) / COUNT(won) | ₫50M | Monthly |

2. **Data Exploration**
   - Kiểm tra data availability:
     ```bash
     cd sgroup-erp-backend && npx prisma studio
     ```
   - Review Prisma schema cho entities liên quan
   - Assess data quality:
     - [ ] Có đủ data? (Volume)
     - [ ] Data có chính xác? (Accuracy)
     - [ ] Có missing/null values? (Completeness)
     - [ ] Data format nhất quán? (Consistency)

3. **Write SQL Queries / Prisma Queries**
   - Follow SQL patterns từ data-analyst skill
   - Best practices:
     - Sử dụng CTE cho queries phức tạp
     - Window functions cho trend analysis
     - `DATE_TRUNC` cho time grouping
     - `FILTER (WHERE ...)` cho conditional aggregation
   - Test queries:
     ```bash
     cd sgroup-erp-backend && npx prisma db execute --stdin <<< "SELECT ..."
     ```

4. **Build Backend Analytics Endpoints**
   - Create analytics service:
     ```typescript
     // src/modules/analytics/analytics.service.ts
     async getSalesDashboard(period: 'day' | 'week' | 'month') {
       const [revenue, leads, pipeline] = await Promise.all([
         this.getRevenue(period),
         this.getLeadMetrics(period),
         this.getPipelineFunnel(period),
       ]);
       return { revenue, leads, pipeline };
     }
     ```
   - Pagination cho large datasets
   - Caching cho expensive queries (Redis)

5. **Design Dashboard Layout**
   - Follow dashboard design from data-analyst skill:
     ```
     ┌────────┬────────┬────────┬────────┐
     │ KPI 1  │ KPI 2  │ KPI 3  │ KPI 4  │  ← Summary cards
     ├────────┴────────┴────────┴────────┤
     │      Trend Chart (Line/Bar)       │  ← Primary visualization
     ├──────────────┬───────────────────┤
     │ Breakdown    │  Top Performers   │  ← Secondary charts
     │ (Pie/Funnel) │  (Leaderboard)    │
     └──────────────┴───────────────────┘
     ```
   - Chạy `/ui-ux-design` nếu cần mockup chi tiết

6. **Implement Frontend Charts**
   - Libraries: Victory Native (React Native), Chart.js (Web)
   - Chart types cho từng loại dữ liệu:
     | Data Type | Chart Type | Example |
     |-----------|-----------|---------|
     | Trend over time | Line chart | Revenue by month |
     | Comparison | Bar chart | Sales by rep |
     | Composition | Pie/Donut | Revenue by source |
     | Funnel | Funnel chart | Lead conversion |
     | Rank | Horizontal bar | Top performers |

7. **Setup Automated Reports**
   - Schedule report generation (tham khảo data-analyst skill):
     ```typescript
     // Automated daily report
     async function generateDailyReport(date: Date) {
       const data = await analyticsService.getDailyMetrics(date);
       // Send via email, Slack, or store in DB
     }
     ```
   - Report types:
     | Report | Frequency | Recipients |
     |--------|-----------|-----------|
     | Daily Sales Summary | Daily 8 AM | Sales Manager |
     | Weekly Pipeline | Monday 9 AM | PO, Sales Team |
     | Monthly KPI Review | 1st of month | CEO, Management |

8. **Validate & Iterate**
   - Cross-check numbers with raw data
   - Get feedback from stakeholders
   - Iterate on dashboard layout / metrics
   - Monitor query performance → `/performance-testing` nếu chậm

## Tools
| Tool | Purpose |
|------|---------|
| Prisma Studio | Data exploration |
| Metabase | Self-service BI |
| Grafana | Real-time dashboards |
| Google Sheets | Ad-hoc analysis |
