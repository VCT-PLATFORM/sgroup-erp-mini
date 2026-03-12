---
description: AI feature integration, RAG pipelines, prompt engineering, and model deployment for SGROUP ERP
---

# AI Integration Workflow

Quy trình tích hợp tính năng AI/ML vào SGROUP ERP: từ thiết kế prompt đến deploy model.

## When to Trigger
- Thêm tính năng AI mới (chatbot, auto-report, scoring)
- Cải thiện AI feature hiện có
- Tích hợp LLM API mới
- Setup RAG pipeline cho document Q&A

## Steps

1. **Define AI Feature Requirements**
   ```markdown
   ## AI Feature Spec
   **Feature**: [Tên tính năng]
   **Use Case**: [Mô tả use case cụ thể]
   **Input**: [Dữ liệu gì AI sẽ nhận]
   **Output**: [AI trả về gì cho user]
   **Success Criteria**: [KPI measurable]
   **Fallback**: [Nếu AI fail thì sao]
   ```
   - Ví dụ features (tham khảo ai-ml-engineer skill):
     | Feature | Input | Output | Complexity |
     |---------|-------|--------|-----------|
     | Smart Lead Scoring | Lead data | Score 1-100 | Medium |
     | Sales Forecasting | Historical data | Revenue prediction | High |
     | Auto-Report | Sales data | Written report | Medium |
     | Meeting Summary | Meeting notes | Structured summary | Low |
     | Chatbot | User question | Answer + context | Medium |

2. **Select Model & Provider**
   - Choose based on requirements (tham khảo ai-ml-engineer skill):
     | Model | Best For | Cost | Speed |
     |-------|---------|------|-------|
     | GPT-4o | Complex analysis | $$$ | Medium |
     | GPT-4o-mini | Chat, simple tasks | $ | Fast |
     | Gemini 2.0 Flash | General, Vietnamese | $ | Fast |
     | Gemini 2.0 Pro | Deep reasoning | $$ | Medium |
     | Claude 3.5 Sonnet | Long docs, coding | $$ | Medium |
   - Considerations:
     - Vietnamese language support
     - Token cost vs. response quality
     - Latency requirements
     - Data privacy (on-premise vs. cloud API)

3. **Design Prompts**
   - Follow prompt engineering principles (tham khảo ai-ml-engineer skill):
     ```typescript
     const systemPrompt = `
     Bạn là [role] chuyên nghiệp cho hệ thống SGROUP ERP.
     
     ## Dữ liệu
     ${contextData}
     
     ## Yêu cầu
     ${userTask}
     
     ## Quy tắc
     - Trả lời bằng tiếng Việt
     - Phân tích dựa trên dữ liệu cụ thể
     - Format output dạng markdown
     - Nếu thiếu dữ liệu, nêu rõ
     `;
     ```
   - Patterns:
     - **Chain-of-Thought**: Cho phân tích phức tạp
     - **Few-Shot**: Cho format nhất quán
     - **Role-Play**: Cho domain expertise

4. **Implement RAG (if document-based)**
   - Architecture (tham khảo ai-ml-engineer skill):
     ```
     User Query → Embedding → Vector Search → Top-K → LLM + Context → Response
     ```
   - Sources to index:
     - Prisma Schema (DB structure)
     - API Endpoints & DTOs
     - Business rules & workflows
     - Sales data & reports
     - User documentation

5. **Build Backend AI Service**
   ```typescript
   // src/modules/ai/ai.service.ts
   @Injectable()
   export class AiService {
     async chat(message: string, userId: string) {
       const context = await this.getRelevantContext(message);
       const response = await this.llm.chat({
         model: 'gemini-2.0-flash',
         systemPrompt: this.buildSystemPrompt(context),
         userMessage: message,
         maxTokens: 2048,
       });
       await this.logInteraction(userId, message, response);
       return response;
     }
   }
   ```
   - Safety & guardrails:
     - [ ] Validate LLM output before displaying
     - [ ] Sanitize generated SQL/code
     - [ ] Set max token limits
     - [ ] Log all AI interactions for audit
     - [ ] Never expose API keys in frontend
     - [ ] Rate limit AI endpoints

6. **Build Frontend AI Components**
   - Chat interface / AI assistant panel
   - Loading states (AI may take 2-5s)
   - Error handling (API timeout, rate limit)
   - History display (previous conversations)

7. **Test & Evaluate**
   - Create golden test set:
     ```typescript
     const testCases = [
       { input: "Phân tích doanh số Q1", expectedContains: ["doanh thu", "so sánh"] },
       { input: "Đánh giá lead ABC", expectedContains: ["điểm", "khả năng"] },
     ];
     ```
   - Quality metrics (tham khảo ai-ml-engineer skill):
     | Metric | Target |
     |--------|--------|
     | Relevance (human eval) | ≥ 4.0/5.0 |
     | Accuracy | ≥ 90% |
     | Format compliance | 100% |
     | Response time | < 5s |
     | Cost per query | < $0.01 |

8. **Deploy & Monitor**
   - Monitor token usage & cost
   - Track user satisfaction with AI responses
   - A/B test prompt variations
   - Iterate based on user feedback

## Next Workflow
→ `/feature-development` for implementation
→ `/security-review` for AI data safety
