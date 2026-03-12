---
description: UI/UX design process from research to developer handoff using SGDS design system
---

# UI/UX Design Workflow

Quy trình thiết kế UI/UX từ nghiên cứu người dùng đến bàn giao cho developer, sử dụng SGDS (SGroup Design System).

## When to Trigger
- Feature mới có giao diện người dùng
- Redesign màn hình hiện có
- Cải thiện UX dựa trên user feedback

## Steps

1. **Understand Requirements**
   - Review user story và acceptance criteria từ `/requirement-analysis`
   - Xác định user personas và use cases
   - Nghiên cứu competitor screens (nếu cần)
   - Xác nhận platform targets: Web / Mobile / Both

2. **User Research (tùy scope)**
   - Conduct user interviews (tham khảo ux-researcher skill)
   - Analyze existing usage data
   - Create user journey map:
     ```
     [Trigger] → [Entry] → [Action 1] → [Action 2] → [Success/Error] → [Exit]
     ```
   - Document pain points & opportunities

3. **Information Architecture**
   - Define screen hierarchy & navigation flow
   - Create sitemap for the feature
   - Define content structure:
     ```
     Screen: [Tên màn hình]
     ├── Header: [Navigation, Title, Actions]
     ├── Content: [Main content area]
     │   ├── Section 1: [Cards, Lists, Forms]
     │   └── Section 2: [Charts, Tables, Stats]
     └── Footer: [Actions, Navigation]
     ```

4. **Wireframing (Lo-fi)**
   - Sketch layout concepts (2-3 options)
   - Focus on:
     - Content hierarchy & spacing
     - User flow & interactions
     - Responsive breakpoints (mobile → tablet → desktop)
   - Quick review with PO / stakeholder
   - Select direction forward

5. **High-Fidelity Mockup**
   - Apply SGDS design system (tham khảo ui-ux-design skill):
     - **Colors**: Brand palette, semantic colors, dark mode support
     - **Typography**: Inter/Roboto, proper hierarchy (H1-H6, body, caption)
     - **Components**: Sử dụng SG-prefixed components (SGButton, SGCard, SGInput...)
     - **Spacing**: 4px grid system (4, 8, 12, 16, 20, 24, 32, 40, 48)
     - **Elevation**: Glassmorphism, shadows, blur effects
   - Design states:
     - [ ] Empty state
     - [ ] Loading state
     - [ ] Error state
     - [ ] Success state
     - [ ] Populated state (few items)
     - [ ] Full state (many items)

6. **Micro-interactions & Animations**
   - Define animations (tham khảo ui-ux-design skill):
     - Entry: fadeIn, slideUp (200-300ms)
     - Hover: scale, glow, color shift  
     - Loading: shimmer, skeleton, pulse
     - Transitions: spring physics, easeOut
   - Ensure 60fps performance target

7. **Design Review**
   - Present to PO, Tech Lead, Dev team
   - Review checklist:
     - [ ] Consistent with SGDS design system
     - [ ] All states designed (empty, loading, error, data)
     - [ ] Responsive layouts defined
     - [ ] Dark mode supported
     - [ ] Accessibility: color contrast ≥ 4.5:1, touch targets ≥ 44px
     - [ ] Micro-animations specified
   - Collect feedback & iterate

8. **Developer Handoff**
   - Specs to provide:
     - Component names (SG-prefixed)
     - Colors (HSL tokens from design system)
     - Spacing (px values)
     - Typography (font, size, weight, lineHeight)
     - Animation timing & easing functions
     - Asset exports (icons, images)
   - Link back to relevant components in `src/shared/components/`
   -  Handoff to dev → Chạy `/feature-development`

## Next Workflow
→ `/feature-development` for implementation using the design specs
