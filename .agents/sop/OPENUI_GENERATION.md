# 📜 SOP: OpenUI Generation Standard (HERA V5.5 NEXUS UI)

## 1. Overview
This SOP defines how agents should generate interactive UI components using **OpenUI Lang**. This is the standard for real-time mission updates and dynamic dashboards.

## 2. Core Principles
1. **Compactness**: Use the most efficient tokens. Avoid verbose explanations.
2. **Streaming-Ready**: Components must be structured for progressive rendering.
3. **Themed**: Every component must follow the VCT Platform **Neo-Glassmorphism** design system.
4. **Interactive**: UI is not just for viewing; it should have interactive hooks for the Chairman to provide feedback.

## 3. OpenUI Lang Primitives
Agents should prioritize these primitives:
- `card`: For grouping information.
- `stack`: For layout.
- `chart`: For data visualization (HERA scores, mission progress).
- `form`: For interactive inputs/decisions.
- `mission-tree`: A custom component for visualizing the Task Tree.

## 4. Execution Flow
1. **Identify Need**: Does the task benefit from visual feedback? (e.g., Progress report, data analysis).
2. **Draft Schema**: Define the data structure to be visualized.
3. **Generate OpenUI Block**: 
    ```openui
    card "Mission M-001 Progress" {
      stack direction="row" {
        chart type="gauge" value=85 label="Success Probability"
        stack {
          text "Task 1: Complete" variant="success"
          text "Task 2: In Progress" variant="loading"
        }
      }
    }
    ```
4. **Verify**: Ensure all interactive hooks are connected to agent actions.

## 5. Guardrails
- ❌ Do NOT generate complex logic inside OpenUI blocks. Keep it declarative.
- ❌ Do NOT use colors outside the HSL palette defined in `nova/SOUL.md`.
- ❌ DO NOT stream massive data sets. Use pagination or summaries.

---
> [!TIP]
> Use the `/goal status` command to trigger an OpenUI-powered visualization.
