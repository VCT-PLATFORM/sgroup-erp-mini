import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { AiAgentsService } from './ai-agents.service';
import { Public } from '../../common/decorators/public.decorator';

/**
 * AI Controller — REST API endpoints for AI-powered features
 *
 * Core Endpoints:
 *   GET  /ai/status              — Check AI service status
 *   POST /ai/chat                — Chat with AI assistant
 *   POST /ai/analyze             — Analyze business data
 *   POST /ai/report              — Generate report
 *
 * Agent Endpoints:
 *   GET  /ai/agents              — List all available agents
 *   POST /ai/agent/:role         — Run a specific agent by role
 *   POST /ai/agent/sales         — Run sales analysis agent
 *   POST /ai/agent/ops           — Run operations optimization agent
 *
 * Team Endpoints:
 *   POST /ai/team/pipeline       — Run multi-agent pipeline (sequential)
 *   POST /ai/team/collaborate    — Run team collaboration (parallel + synthesize)
 */
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly aiAgentsService: AiAgentsService,
  ) {}

  // ─── Core AI Endpoints ───

  @Get('status')
  @Public()
  getStatus() {
    return this.aiService.getStatus();
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: { message: string; systemPrompt?: string }) {
    return this.aiService.chat(body.message, body.systemPrompt);
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  async analyzeData(
    @Body() body: { data: Record<string, any>; question: string },
  ) {
    return this.aiService.analyzeData(body.data, body.question);
  }

  @Post('report')
  @HttpCode(HttpStatus.OK)
  async generateReport(
    @Body() body: { reportType: string; data: Record<string, any> },
  ) {
    return this.aiService.generateReport(body.reportType, body.data);
  }

  // ─── Agent Endpoints ───

  @Get('agents')
  @Public()
  listAgents() {
    return this.aiAgentsService.getAvailableAgents();
  }

  @Post('agent/sales')
  @HttpCode(HttpStatus.OK)
  async runSalesAgent(
    @Body() body: { task: string; context?: Record<string, any> },
  ) {
    return this.aiAgentsService.runSalesAnalyst(body.task, body.context);
  }

  @Post('agent/ops')
  @HttpCode(HttpStatus.OK)
  async runOpsAgent(
    @Body() body: { task: string; context?: Record<string, any> },
  ) {
    return this.aiAgentsService.runOpsOptimizer(body.task, body.context);
  }

  @Post('agent/:role')
  @HttpCode(HttpStatus.OK)
  async runAgentByRole(
    @Param('role') role: string,
    @Body() body: { task: string; context?: Record<string, any> },
  ) {
    return this.aiAgentsService.runAgent(role, body.task, body.context);
  }

  // ─── Team Collaboration Endpoints ───

  @Post('team/pipeline')
  @HttpCode(HttpStatus.OK)
  async runPipeline(
    @Body()
    body: {
      tasks: Array<{ agentName: string; task: string }>;
      sharedContext?: Record<string, any>;
    },
  ) {
    return this.aiAgentsService.runPipeline(body.tasks, body.sharedContext);
  }

  @Post('team/collaborate')
  @HttpCode(HttpStatus.OK)
  async runTeamCollaboration(
    @Body()
    body: {
      task: string;
      agents: string[];
      coordinator?: string;
      context?: Record<string, any>;
    },
  ) {
    return this.aiAgentsService.runTeamCollaboration(
      body.task,
      body.agents,
      body.coordinator,
      body.context,
    );
  }
}
