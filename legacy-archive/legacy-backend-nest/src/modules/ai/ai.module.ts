import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiAgentsService } from './ai-agents.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, AiAgentsService],
  exports: [AiService, AiAgentsService],
})
export class AiModule {}
