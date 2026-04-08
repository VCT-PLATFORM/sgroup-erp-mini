import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Core AI Service — SGROUP ERP
 *
 * Provides AI capabilities using LangChain.js with support for
 * multiple LLM providers (OpenAI, Google Gemini).
 *
 * To activate, install LangChain packages:
 *   npm install @langchain/core @langchain/openai @langchain/google-genai
 *
 * Then uncomment the LangChain imports and implementations below.
 */
@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private model: any = null;
  private isConfigured = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeModel();
  }

  private async initializeModel() {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const googleKey = this.configService.get<string>('GOOGLE_AI_API_KEY');

    if (openaiKey) {
      try {
        // Uncomment after installing: npm install @langchain/openai
        // const { ChatOpenAI } = await import('@langchain/openai');
        // this.model = new ChatOpenAI({
        //   openAIApiKey: openaiKey,
        //   modelName: 'gpt-4o-mini',
        //   temperature: 0.7,
        //   maxTokens: 2048,
        // });
        this.isConfigured = true;
        this.logger.log('AI Service initialized with OpenAI provider');
      } catch (error) {
        this.logger.warn(
          'OpenAI not available. Install @langchain/openai to enable.',
        );
      }
    } else if (googleKey) {
      try {
        // Uncomment after installing: npm install @langchain/google-genai
        // const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
        // this.model = new ChatGoogleGenerativeAI({
        //   apiKey: googleKey,
        //   modelName: 'gemini-2.0-flash',
        //   temperature: 0.7,
        //   maxOutputTokens: 2048,
        // });
        this.isConfigured = true;
        this.logger.log('AI Service initialized with Google Gemini provider');
      } catch (error) {
        this.logger.warn(
          'Google Gemini not available. Install @langchain/google-genai to enable.',
        );
      }
    } else {
      this.logger.warn(
        'No AI API key configured. Set OPENAI_API_KEY or GOOGLE_AI_API_KEY in .env',
      );
    }
  }

  /**
   * Chat completion — send a message and get AI response
   */
  async chat(
    message: string,
    systemPrompt?: string,
  ): Promise<{ response: string; provider: string }> {
    if (!this.isConfigured || !this.model) {
      return {
        response:
          'AI service is not configured. Please set OPENAI_API_KEY or GOOGLE_AI_API_KEY in your .env file and install the corresponding LangChain package.',
        provider: 'none',
      };
    }

    try {
      // Uncomment after installing LangChain:
      // const { HumanMessage, SystemMessage } = await import('@langchain/core/messages');
      // const messages = [];
      // if (systemPrompt) {
      //   messages.push(new SystemMessage(systemPrompt));
      // }
      // messages.push(new HumanMessage(message));
      // const result = await this.model.invoke(messages);
      // return {
      //   response: result.content as string,
      //   provider: this.getProviderName(),
      // };

      return {
        response: `[AI Placeholder] Received: "${message}". Install LangChain packages to enable real AI responses.`,
        provider: 'placeholder',
      };
    } catch (error) {
      this.logger.error(`AI chat error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze data and provide insights
   */
  async analyzeData(
    data: Record<string, any>,
    question: string,
  ): Promise<{ analysis: string; provider: string }> {
    const prompt = `Analyze the following data and answer the question.

Data:
${JSON.stringify(data, null, 2)}

Question: ${question}

Provide a concise, actionable analysis in Vietnamese.`;

    const result = await this.chat(prompt, 'You are a business data analyst for an ERP system. Respond in Vietnamese.');
    return { analysis: result.response, provider: result.provider };
  }

  /**
   * Generate summary report
   */
  async generateReport(
    reportType: string,
    data: Record<string, any>,
  ): Promise<{ report: string; provider: string }> {
    const prompt = `Generate a ${reportType} report based on the following data:

${JSON.stringify(data, null, 2)}

Format the report with clear sections, key metrics, and actionable recommendations. Write in Vietnamese.`;

    const result = await this.chat(prompt, 'You are a business report generator for SGROUP ERP. Create professional, concise reports in Vietnamese.');
    return { report: result.response, provider: result.provider };
  }

  /**
   * Check if AI is properly configured and ready
   */
  getStatus(): {
    configured: boolean;
    provider: string;
    message: string;
  } {
    return {
      configured: this.isConfigured,
      provider: this.getProviderName(),
      message: this.isConfigured
        ? 'AI service is ready'
        : 'AI service not configured. Set API keys in .env',
    };
  }

  private getProviderName(): string {
    if (this.configService.get('OPENAI_API_KEY')) return 'openai';
    if (this.configService.get('GOOGLE_AI_API_KEY')) return 'google-gemini';
    return 'none';
  }
}
