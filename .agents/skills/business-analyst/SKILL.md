---
name: Business Analyst
description: Requirements gathering, BRD/SRS creation, process mapping, and stakeholder analysis for SGROUP ERP
---

# Business Analyst Skill — SGROUP ERP

## Role Overview
The BA bridges business needs and technical solutions by gathering requirements, documenting processes, and ensuring the development team builds the right product.

## Core Deliverables

### 1. Requirements Gathering

#### Techniques
| Technique | When to Use | Output |
|-----------|-------------|--------|
| Stakeholder Interview | Initial discovery | Interview notes, pain points |
| Workshop/JAD | Complex requirements | Requirements document |
| Observation | Process understanding | Process notes, bottlenecks |
| Survey/Questionnaire | Large audience | Quantitative data |
| Document Analysis | Existing systems | Gap analysis |
| Prototyping | UI/UX requirements | Clickable prototype |

#### Interview Template
```markdown
## Stakeholder Interview — {Module Name}

**Interviewee**: {Name}, {Role}
**Date**: {YYYY-MM-DD}
**Duration**: {minutes}

### Current Process
1. How do you currently handle [process]?
2. What tools/systems do you use?
3. How much time does this take?

### Pain Points
1. What are the biggest challenges?
2. What errors/mistakes commonly occur?
3. What information is missing or hard to find?

### Desired Outcome
1. What would the ideal solution look like?
2. What would save you the most time?
3. How would you measure success?

### Key Findings
- Finding 1: ...
- Finding 2: ...

### Follow-up Items
- [ ] Item 1
- [ ] Item 2
```

### 2. Business Requirements Document (BRD)

```markdown
# BRD — {Feature/Module Name}

## 1. Executive Summary
Brief overview of the business need and proposed solution.

## 2. Business Objectives
| Objective | Metric | Target | Timeline |
|-----------|--------|--------|----------|
| Tăng hiệu suất bán hàng | Deals/tháng | +30% | Q2 2026 |

## 3. Scope
### In Scope
- Feature A, B, C

### Out of Scope
- Feature X, Y (deferred to Phase 2)

## 4. Stakeholders
| Name | Role | Interest | Influence |
|------|------|----------|-----------|
| {Name} | Sales Manager | High | High |

## 5. Business Rules
| ID | Rule | Example |
|----|------|---------|
| BR-001 | Discount cannot exceed 15% without manager approval | 20% → requires approval |

## 6. Functional Requirements
| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| FR-001 | System shall allow creating new leads | Must | AC-001, AC-002 |

## 7. Non-Functional Requirements
| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Performance | Page load < 2 seconds |
| NFR-002 | Security | Role-based access control |

## 8. Assumptions & Constraints
### Assumptions
- Users have stable internet connection
### Constraints
- Must integrate with existing BizFly CRM

## 9. Dependencies
| Dependency | Type | Risk |
|-----------|------|------|
| BizFly API | External | Medium |

## 10. Glossary
| Term | Definition |
|------|-----------|
| Lead | Potential customer in sales pipeline |
```

### 3. Process Mapping

#### BPMN Notation
```
(○) Start Event
[□] Task/Activity
<◇> Decision Gateway
(●) End Event
→   Sequence Flow
⇢   Message Flow
```

#### Sales Process Example
```
(○)→[Tiếp nhận Lead]→<Đủ điều kiện?>
                          │ Yes     │ No
                          ↓         ↓
                   [Tạo Appointment] [Archive Lead]
                          ↓                ↓
                   [Gặp khách hàng]       (●)
                          ↓
                   <Quan tâm?>
                    │ Yes    │ No
                    ↓        ↓
              [Tạo Deal]  [Follow-up]
                    ↓        ↓
              [Chốt hợp đồng] → (●)
```

#### Swimlane Diagram Template
```
┌─────────────┬──────────────┬──────────────┐
│ Sales Rep   │ Sales Mgr    │ System       │
├─────────────┼──────────────┼──────────────┤
│ Tạo lead    │              │ Validate     │
│      ↓      │              │      ↓       │
│ Nhập data   │              │ Store data   │
│      ↓      │              │      ↓       │
│             │ Review lead  │ Send notify  │
│             │      ↓       │              │
│             │ Approve/Reject│             │
└─────────────┴──────────────┴──────────────┘
```

### 4. Gap Analysis

| # | Current State | Desired State | Gap | Solution |
|---|--------------|---------------|-----|----------|
| 1 | Manual lead entry in Excel | Auto-capture from website | No web integration | Build web-to-lead form |
| 2 | Email-based reporting | Real-time dashboard | No analytics | Build BI dashboard |
| 3 | No mobile access | Mobile CRM | No mobile app | Build React Native app |

### 5. RACI Matrix for Requirements

| Activity | BA | PO | Stakeholder | Dev | QA |
|----------|----|----|-------------|-----|----|
| Requirements gathering | R | A | C | I | I |
| BRD creation | R | A | C | I | I |
| BRD review | R | A | R | C | C |
| Acceptance criteria | R | A | C | C | R |
| UAT planning | C | A | R | I | R |

### 6. Data Dictionary

| Field | Type | Required | Rules | Source |
|-------|------|----------|-------|--------|
| customer_name | String(100) | Yes | Min 2 chars | User input |
| phone | String(15) | Yes | VN format: 0xxx-xxx-xxxx | User input |
| lead_source | Enum | Yes | [Web, Call, Referral, Event] | Dropdown |
| estimated_value | Decimal | No | ≥ 0, max 999,999,999 | User input |
| assigned_to | UUID | Yes | Must be active sales rep | System |

### 7. Use Case Specification

```markdown
## UC-001: Tạo Lead Mới

**Actor**: Sales Representative
**Precondition**: User logged in with SALES_REP role
**Trigger**: User clicks "New Lead" button

### Main Flow
1. System displays lead creation form
2. User enters customer information (name, phone, email)
3. User selects lead source
4. User enters estimated value (optional)
5. System validates input
6. System creates lead with status "New"
7. System sends notification to Sales Manager
8. System displays success message

### Alternative Flows
- **3a**: User selects "Referral" → System shows referrer field
- **5a**: Validation fails → System highlights errors, user corrects

### Exception Flows
- **E1**: Network error → System saves draft locally, syncs when online

### Postcondition
- New lead record created in database
- Sales Manager notified
- Lead appears in assigned rep's pipeline
```
