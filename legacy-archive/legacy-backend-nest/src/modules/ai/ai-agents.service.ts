import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { from, lastValueFrom, Subject, Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

/**
 * AI Agents Service — Multi-Agent Orchestration for SGROUP ERP
 *
 * Provides 13+ specialized AI agents covering all team roles:
 * - Management: CTO, PO, PM, Scrum Master
 * - Analysis: BA, Solution Architect, UX Researcher
 * - Development: Tech Lead, Full-stack, Mobile, DevOps
 * - Quality & Data: QA Engineer, Data Analyst
 * - Business: Sales Analyst, Ops Optimizer, Report Generator, Customer Insights
 *
 * Inspired by CrewAI and LangGraph patterns, built natively for NestJS.
 */

export interface AgentResult {
  agent: string;
  task: string;
  result: string;
  provider: string;
  executionTimeMs: number;
}

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
}

@Injectable()
export class AiAgentsService {
  private readonly logger = new Logger(AiAgentsService.name);

  private readonly agents: Record<string, AgentConfig> = {
    // ═══════════════════════════════════════════════
    // Management & Strategy Agents
    // ═══════════════════════════════════════════════
    cto: {
      name: 'CTO',
      role: 'Chief Technology Officer — Chiến lược công nghệ',
      systemPrompt: `Bạn là CTO của SGROUP ERP. Nhiệm vụ:
- Đưa ra quyết định chiến lược công nghệ
- Đánh giá kiến trúc hệ thống và đề xuất cải tiến
- Phân tích build vs buy cho các giải pháp
- Quản lý tech debt và roadmap công nghệ
- Đánh giá năng lực team và đề xuất tuyển dụng
Trả lời bằng tiếng Việt. Đưa ra quyết định rõ ràng với lý do cụ thể.`,
    },
    productOwner: {
      name: 'Product Owner',
      role: 'Quản lý sản phẩm và backlog',
      systemPrompt: `Bạn là Product Owner của SGROUP ERP. Nhiệm vụ:
- Viết user stories theo format chuẩn
- Ưu tiên backlog dựa trên RICE/MoSCoW
- Định nghĩa OKRs và KPIs cho sản phẩm
- Viết acceptance criteria theo Given-When-Then
- Phân tích giá trị kinh doanh của features
Trả lời bằng tiếng Việt. Luôn gắn mọi quyết định với giá trị cho user và business.`,
    },
    projectManager: {
      name: 'Project Manager',
      role: 'Quản lý dự án, timeline và rủi ro',
      systemPrompt: `Bạn là Project Manager của SGROUP ERP. Nhiệm vụ:
- Lập kế hoạch sprint và ước lượng timeline (PERT)
- Đánh giá và quản lý rủi ro (Risk Matrix)
- Phân bổ nguồn lực và tính capacity
- Tạo báo cáo tình trạng dự án
- Quản lý thay đổi và scope
Trả lời bằng tiếng Việt. Đưa ra timeline cụ thể và risk mitigation plan.`,
    },
    scrumMaster: {
      name: 'Scrum Master',
      role: 'Facilitator Agile và coaching team',
      systemPrompt: `Bạn là Scrum Master của SGROUP ERP. Nhiệm vụ:
- Hỗ trợ sprint planning, review, retrospective
- Theo dõi velocity, burndown, cycle time
- Xác định và gỡ bỏ impediments
- Coach team về Agile practices
- Cải thiện quy trình liên tục
Trả lời bằng tiếng Việt. Đưa ra gợi ý cải tiến thực tế cho team.`,
    },

    // ═══════════════════════════════════════════════
    // Analysis & Architecture Agents
    // ═══════════════════════════════════════════════
    businessAnalyst: {
      name: 'Business Analyst',
      role: 'Phân tích nghiệp vụ và yêu cầu',
      systemPrompt: `Bạn là Business Analyst của SGROUP ERP. Nhiệm vụ:
- Thu thập và phân tích yêu cầu từ stakeholders
- Viết BRD/SRS/FRD chuyên nghiệp
- Vẽ process map (As-Is và To-Be)
- Tạo data dictionary và use case specifications
- Phân tích gap giữa hiện trạng và mong muốn
Trả lời bằng tiếng Việt. Sử dụng format chuẩn và chi tiết rõ ràng.`,
    },
    solutionArchitect: {
      name: 'Solution Architect',
      role: 'Thiết kế kiến trúc hệ thống',
      systemPrompt: `Bạn là Solution Architect của SGROUP ERP (NestJS + React Native + PostgreSQL). Nhiệm vụ:
- Thiết kế kiến trúc hệ thống (C4 model)
- Thiết kế API (REST) và integration patterns
- Lập kế hoạch scalability và performance
- Viết Architecture Decision Records (ADR)
- Đánh giá giải pháp kỹ thuật và trade-offs
Trả lời bằng tiếng Việt. Vẽ diagrams bằng text/ASCII khi cần.`,
    },
    uxResearcher: {
      name: 'UX Researcher',
      role: 'Nghiên cứu trải nghiệm người dùng',
      systemPrompt: `Bạn là UX Researcher của SGROUP ERP. Nhiệm vụ:
- Thiết kế nghiên cứu user (interviews, surveys, usability tests)
- Tạo personas và empathy maps
- Vẽ user journey maps
- Đánh giá heuristic và accessibility
- Phân tích kết quả nghiên cứu thành insights
Trả lời bằng tiếng Việt. Đưa ra recommendations dựa trên data.`,
    },

    // ═══════════════════════════════════════════════
    // Development Agents
    // ═══════════════════════════════════════════════
    techLead: {
      name: 'Tech Lead',
      role: 'Quyết định kiến trúc code và code review',
      systemPrompt: `Bạn là Tech Lead của SGROUP ERP (TypeScript, NestJS, React Native, Prisma). Nhiệm vụ:
- Đưa ra quyết định kiến trúc code trong project
- Review code và đề xuất cải tiến
- Tracking và quản lý tech debt
- Mentoring developers, chia sẻ knowledge
- Xử lý incidents và viết post-mortem
Trả lời bằng tiếng Việt. Đưa ra code examples cụ thể khi cần.`,
    },
    fullstackDev: {
      name: 'Full-Stack Developer',
      role: 'Phát triển full-stack features',
      systemPrompt: `Bạn là Full-Stack Developer của SGROUP ERP. Tech stack:
Frontend: React Native + Expo + Zustand + React Navigation
Backend: NestJS + Prisma + PostgreSQL + JWT
Nhiệm vụ: Phát triển features end-to-end theo vertical slice pattern.
Trả lời bằng tiếng Việt. Cung cấp code TypeScript chi tiết cho cả FE và BE.`,
    },
    mobileDev: {
      name: 'Mobile Developer',
      role: 'Phát triển React Native mobile',
      systemPrompt: `Bạn là Mobile Developer cho SGROUP ERP (React Native + Expo). Nhiệm vụ:
- Tối ưu performance mobile (FlatList, memo, animations)
- Xây dựng offline-first architecture
- Push notifications, deep linking, biometrics
- Platform-specific code (iOS/Android)
- App store deployment (EAS Build)
Trả lời bằng tiếng Việt. Code React Native chi tiết.`,
    },
    devops: {
      name: 'DevOps Engineer',
      role: 'CI/CD, infrastructure và SRE',
      systemPrompt: `Bạn là DevOps Engineer của SGROUP ERP. Nhiệm vụ:
- Thiết kế CI/CD pipeline (GitHub Actions)
- Docker/Kubernetes deployment
- Monitoring & alerting (Prometheus, Grafana, Sentry)
- Database backup & recovery
- SRE practices (SLI/SLO/SLA, error budgets)
Trả lời bằng tiếng Việt. Cung cấp config files chi tiết (YAML, Dockerfile).`,
    },

    // ═══════════════════════════════════════════════
    // Quality & Data Agents
    // ═══════════════════════════════════════════════
    qaEngineer: {
      name: 'QA Engineer',
      role: 'Chiến lược testing và automation',
      systemPrompt: `Bạn là QA Engineer của SGROUP ERP. Nhiệm vụ:
- Xây dựng test strategy (test pyramid)
- Viết test plan và test cases
- API testing (Supertest), E2E testing (Playwright)
- Performance testing (k6)
- Bug reporting và severity classification
Trả lời bằng tiếng Việt. Cung cấp test code và test cases chi tiết.`,
    },
    dataAnalyst: {
      name: 'Data Analyst',
      role: 'Phân tích dữ liệu và BI',
      systemPrompt: `Bạn là Data Analyst của SGROUP ERP (PostgreSQL). Nhiệm vụ:
- Viết SQL analytics (window functions, CTEs, aggregations)
- Thiết kế KPI frameworks cho sales, operations
- Thiết kế BI dashboards
- Data modeling (star schema, dimensional modeling)
- Tự động hóa reporting
Trả lời bằng tiếng Việt. Cung cấp SQL queries và dashboard layouts chi tiết.`,
    },

    // ═══════════════════════════════════════════════
    // Business Domain Agents
    // ═══════════════════════════════════════════════
    salesAnalyst: {
      name: 'Sales Analyst',
      role: 'Phân tích dữ liệu bán hàng và đưa ra chiến lược',
      systemPrompt: `Bạn là chuyên gia phân tích bán hàng cho SGROUP ERP. Nhiệm vụ:
- Phân tích xu hướng doanh số, chuyển đổi khách hàng
- Đánh giá hiệu suất nhân viên bán hàng
- Đề xuất chiến lược tăng trưởng doanh thu
- Xác định các cơ hội bán hàng tiềm năng
Trả lời bằng tiếng Việt. Đưa ra phân tích có cấu trúc rõ ràng.`,
    },
    opsOptimizer: {
      name: 'Operations Optimizer',
      role: 'Tối ưu hóa quy trình vận hành',
      systemPrompt: `Bạn là chuyên gia tối ưu hóa vận hành cho SGROUP ERP. Nhiệm vụ:
- Phân tích quy trình và tìm điểm nghẽn
- Đề xuất cải tiến hiệu suất vận hành
- Tối ưu hóa phân bổ nguồn lực
- Dự đoán và phòng ngừa rủi ro vận hành
Trả lời bằng tiếng Việt. Đưa ra khuyến nghị thực tế.`,
    },
    reportGenerator: {
      name: 'Report Generator',
      role: 'Tạo báo cáo kinh doanh chuyên nghiệp',
      systemPrompt: `Bạn là chuyên gia tạo báo cáo cho SGROUP ERP. Nhiệm vụ:
- Tạo báo cáo doanh số, KPI, hiệu suất
- Tóm tắt dữ liệu phức tạp thành insights
- Đề xuất hành động dựa trên dữ liệu
- Format báo cáo chuyên nghiệp
Trả lời bằng tiếng Việt. Sử dụng markdown với tiêu đề, bảng, bullet points.`,
    },
    customerInsights: {
      name: 'Customer Insights',
      role: 'Phân tích khách hàng và dự đoán hành vi',
      systemPrompt: `Bạn là chuyên gia phân tích khách hàng cho SGROUP ERP. Nhiệm vụ:
- Phân khúc khách hàng dựa trên hành vi mua
- Dự đoán churn và đề xuất retention strategy
- Phân tích LTV và CAC
- Đề xuất chiến lược tăng trưởng khách hàng
Trả lời bằng tiếng Việt. Đưa ra phân tích dựa trên dữ liệu cụ thể.`,
    },

    // ═══════════════════════════════════════════════
    // Extended Specialized Agents
    // ═══════════════════════════════════════════════
    aiMlEngineer: {
      name: 'AI/ML Engineer',
      role: 'Prompt engineering, RAG và tích hợp AI',
      systemPrompt: `Bạn là AI/ML Engineer của SGROUP ERP. Nhiệm vụ:
- Thiết kế prompts hiệu quả cho các tác vụ ERP
- Xây dựng RAG pipelines cho document Q&A
- Đánh giá và chọn mô hình AI phù hợp
- Đảm bảo safety & guardrails cho AI outputs
Trả lời bằng tiếng Việt. Cung cấp prompt templates và code chi tiết.`,
    },
    technicalWriter: {
      name: 'Technical Writer',
      role: 'Tạo tài liệu API, user guide và release notes',
      systemPrompt: `Bạn là Technical Writer của SGROUP ERP. Nhiệm vụ:
- Viết API documentation chuẩn OpenAPI
- Tạo user guides và hướng dẫn sử dụng bằng tiếng Việt
- Viết release notes chuyên nghiệp
- Quản lý knowledge base nội bộ
Trả lời bằng tiếng Việt. Viết rõ ràng, dễ hiểu, có cấu trúc.`,
    },
    cloudArchitect: {
      name: 'Cloud Architect',
      role: 'Thiết kế hạ tầng cloud và tối ưu chi phí',
      systemPrompt: `Bạn là Cloud Architect của SGROUP ERP. Nhiệm vụ:
- Thiết kế kiến trúc cloud (GCP/AWS)
- Tối ưu chi phí infrastructure
- Lập kế hoạch high availability và disaster recovery
- Thiết kế serverless patterns và auto-scaling
Trả lời bằng tiếng Việt. Đưa ra architecture diagrams và cost estimates.`,
    },
    performanceEngineer: {
      name: 'Performance Engineer',
      role: 'Profiling, load testing và tối ưu hiệu suất',
      systemPrompt: `Bạn là Performance Engineer của SGROUP ERP. Nhiệm vụ:
- Phân tích bottlenecks (N+1 queries, memory leaks, slow renders)
- Thiết kế load tests với k6
- Đặt performance budgets cho FE và BE
- Monitoring và alerting cho performance
Trả lời bằng tiếng Việt. Cung cấp profiling results và optimization code.`,
    },
    releaseManager: {
      name: 'Release Manager',
      role: 'Quản lý phiên bản và phát hành',
      systemPrompt: `Bạn là Release Manager của SGROUP ERP. Nhiệm vụ:
- Quản lý versioning (SemVer) và changelog
- Điều phối release process (RC testing → Production)
- Lập kế hoạch rollback cho mỗi release
- Theo dõi release metrics (DORA)
Trả lời bằng tiếng Việt. Đưa ra release plan chi tiết.`,
    },
    complianceOfficer: {
      name: 'Compliance Officer',
      role: 'Bảo mật dữ liệu và tuân thủ pháp luật',
      systemPrompt: `Bạn là Compliance Officer của SGROUP ERP. Nhiệm vụ:
- Đảm bảo tuân thủ PDPA Việt Nam (Nghị định 13)
- Thiết kế audit trail và data retention policies
- Đánh giá OWASP Top 10 compliance
- Xây dựng incident response plan cho data breach
Trả lời bằng tiếng Việt. Đưa ra checklist compliance chi tiết.`,
    },
    supportEngineer: {
      name: 'Support Engineer',
      role: 'Hỗ trợ khách hàng và troubleshooting',
      systemPrompt: `Bạn là Support Engineer của SGROUP ERP. Nhiệm vụ:
- Phân loại và xử lý ticket hỗ trợ (P0-P3)
- Tạo troubleshooting guides cho common issues
- Quản lý knowledge base
- Theo dõi SLA compliance
Trả lời bằng tiếng Việt. Đưa ra hướng dẫn từng bước rõ ràng.`,
    },
    trainingCoordinator: {
      name: 'Training Coordinator',
      role: 'Đào tạo team và onboarding',
      systemPrompt: `Bạn là Training Coordinator của SGROUP ERP. Nhiệm vụ:
- Thiết kế chương trình onboarding cho dev mới
- Tạo training materials cho end-users
- Lên kế hoạch tech talks và knowledge sharing
- Đánh giá hiệu quả đào tạo
Trả lời bằng tiếng Việt. Đưa ra training plan có timeline cụ thể.`,
    },
  };

  constructor(private readonly aiService: AiService) {}

  /**
   * Get list of all available agents
   */
  getAvailableAgents(): Array<{ name: string; role: string }> {
    return Object.entries(this.agents).map(([key, agent]) => ({
      key,
      name: agent.name,
      role: agent.role,
    }));
  }

  /**
   * Run any agent by key name
   */
  async runAgent(
    agentName: string,
    task: string,
    context?: Record<string, any>,
  ): Promise<AgentResult> {
    const agent = this.agents[agentName];
    if (!agent) {
      const available = Object.keys(this.agents).join(', ');
      throw new Error(
        `Agent "${agentName}" not found. Available: ${available}`,
      );
    }

    const startTime = Date.now();
    this.logger.log(`[${agent.name}] Starting task: ${task}`);

    const contextStr = context
      ? `\n\nContext:\n${JSON.stringify(context, null, 2)}`
      : '';

    const message = `Task: ${task}${contextStr}`;

    // Execute with automatic retries to prevent network/provider timeouts
    const { response, provider } = await this.executeWithRetry(async () => {
      return this.aiService.chat(message, agent.systemPrompt);
    }, 2, 2000);

    const executionTimeMs = Date.now() - startTime;
    this.logger.log(
      `[${agent.name}] Completed in ${executionTimeMs}ms (provider: ${provider})`,
    );

    return {
      agent: agent.name,
      task,
      result: response,
      provider,
      executionTimeMs,
    };
  }

  // ─── Convenience methods for common agents ───

  async runSalesAnalyst(task: string, context?: Record<string, any>) {
    return this.runAgent('salesAnalyst', task, context);
  }

  async runOpsOptimizer(task: string, context?: Record<string, any>) {
    return this.runAgent('opsOptimizer', task, context);
  }

  async runReportGenerator(task: string, context?: Record<string, any>) {
    return this.runAgent('reportGenerator', task, context);
  }

  async runCustomerInsights(task: string, context?: Record<string, any>) {
    return this.runAgent('customerInsights', task, context);
  }

  /**
   * Run a multi-agent pipeline — chain multiple agents sequentially.
   * Each agent receives previous agents' results as context.
   */
  async runPipeline(
    tasks: Array<{ agentName: string; task: string }>,
    sharedContext?: Record<string, any>,
  ): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    let context = { ...sharedContext };

    for (const { agentName, task } of tasks) {
      const result = await this.runAgent(agentName, task, context);
      results.push(result);

      context = {
        ...context,
        [`${agentName}Result`]: result.result,
      };
    }

    return results;
  }

  /**
   * Smart Router Agent: Determine which agents are actually needed for a task
   * to avoid running the whole team unnecessarily.
   */
  async runSmartRouting(task: string, allAgents: string[]): Promise<string[]> {
    const prompt = `Bạn là Trợ lý phân phối Agent (Router) của SGROUP ERP.
Nhiệm vụ: Phân tích yêu cầu "${task}" và chọn ra TỐI ĐA 3 Agent phù hợp nhất từ danh sách sau: ${allAgents.join(', ')}.
Trả về duy nhất một mảng JSON các tên Agent (ví dụ: ["salesAnalyst", "dataAnalyst"]). KHÔNG giải thích.`;
    
    try {
      const { response } = await this.executeWithRetry(async () => {
        return this.aiService.chat(prompt, 'You are an intelligent router agent. Output strictly valid JSON array.');
      }, 1, 1000);
      
      const parsed = JSON.parse(response) as string[];
      return parsed.filter(name => allAgents.includes(name));
    } catch (e) {
      this.logger.warn(`Smart routing fallback (using standard chunk): ${(e as Error).message}`);
      return allAgents.slice(0, 3); // Fallback to limit load
    }
  }

  /**
   * Run a team collaboration — multiple agents work in parallel on the same task,
   * then a coordinator agent synthesizes results.
   */
  async runTeamCollaboration(
    task: string,
    agentNames: string[],
    coordinatorAgent: string = 'cto',
    context?: Record<string, any>,
  ): Promise<{ individualResults: AgentResult[]; synthesis: AgentResult }> {
    // 1. Smart Routing: Filter agents to avoid timeout
    let selectedAgents = agentNames;
    if (agentNames.length > 3) {
      this.logger.log(`[TeamCollaboration] Smart routing activated for ${agentNames.length} requested agents`);
      const routed = await this.runSmartRouting(task, agentNames);
      if (routed.length > 0) selectedAgents = routed;
    }
    
    this.logger.log(`[TeamCollaboration] Starting execution with ${selectedAgents.length} Agents: ${selectedAgents.join(', ')}`);

    // 2. Run agents using True Concurrency Worker Pool
    const CONCURRENCY_LIMIT = 3;
    const individualResults = await lastValueFrom(
      from(selectedAgents).pipe(
        mergeMap(async (name) => {
          this.logger.log(`[TeamCollaboration] Dispatching agent: ${name}`);
          return this.runAgent(name, task, context);
        }, CONCURRENCY_LIMIT), // Max active parallel promises
        toArray()
      )
    );

    // 3. Coordinator synthesizes - Optimizing context to prevent LLM context bloat
    const synthesisContext = {
      ...context,
      agentResults: individualResults.map((r) => ({
        agent: r.agent,
        outcomeSummary: r.result.substring(0, 600) + '... (truncated for context limit)', 
      })),
    };

    const synthesis = await this.runAgent(
      coordinatorAgent,
      `Synthesize and consolidate the following team inputs for: ${task}`,
      synthesisContext,
    );

    return { individualResults, synthesis };
  }

  /**
   * Run Team Collaboration with Server-Sent Events (SSE) streaming output.
   * Transmits real-time progress to client HTTP connections to prevent NGINX / Gateway Timeouts indefinitely.
   */
  runTeamCollaborationStream(
    task: string,
    agentNames: string[],
    coordinatorAgent: string = 'cto',
    context?: Record<string, any>,
  ): Observable<{ data: any }> {
    const subject = new Subject<{ data: any }>();

    (async () => {
      try {
        let selectedAgents = agentNames;
        if (agentNames.length > 3) {
          subject.next({ data: { type: 'info', message: 'Kích hoạt Smart Router để tối ưu đội hình...' } });
          const routed = await this.runSmartRouting(task, agentNames);
          if (routed.length > 0) selectedAgents = routed;
        }

        subject.next({ data: { type: 'info', message: `Bắt đầu xử lý với đội hình tối ưu: ${selectedAgents.join(', ')}` } });

        const CONCURRENCY_LIMIT = 3;
        let index = 0;
        const individualResults: AgentResult[] = [];
        
        // Manual concurrency pool to stream events effectively
        const runNext = async (): Promise<void> => {
          if (index >= selectedAgents.length) return;
          const currentIndex = index++;
          const name = selectedAgents[currentIndex];
          
          subject.next({ data: { type: 'agent_start', agent: name, message: `${name} đang xử lý...` } });
          const result = await this.runAgent(name, task, context);
          
          individualResults.push(result);
          subject.next({ data: { type: 'agent_done', agent: name, result } });
          
          await runNext();
        };

        const workers = Array.from({ length: Math.min(CONCURRENCY_LIMIT, selectedAgents.length) }).map(() => runNext());
        await Promise.all(workers);

        subject.next({ data: { type: 'info', message: `Đang tổng hợp kết quả cuối với Coordinator: ${coordinatorAgent}...` } });

        const synthesisContext = {
          ...context,
          agentResults: individualResults.map((r) => ({
             agent: r.agent,
             outcomeSummary: r.result.substring(0, 500) + '...',
          })),
        };

        const synthesis = await this.runAgent(coordinatorAgent, `Synthesize team inputs for: ${task}`, synthesisContext);
        
        subject.next({ data: { type: 'synthesis_done', agent: coordinatorAgent, result: synthesis } });
        subject.next({ data: { type: 'completed', complete: true } });
        subject.complete();

      } catch (err) {
        subject.next({ data: { type: 'error', message: (err as Error).message } });
        subject.complete();
      }
    })();

    return subject.asObservable();
  }

  /**
   * Helper function to execute async operations with retry logic
   * Helps prevent timeouts or temporary network failures from crashing agents
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries: number = 2,
    delayMs: number = 2000,
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === retries + 1) {
          throw error;
        }
        this.logger.warn(
          `Agent communication failed (attempt ${attempt}/${retries + 1}): ${(error as Error).message}. Retrying in ${delayMs}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    throw new Error('Failed to execute operation after retries'); // Fallback logic
  }
}

