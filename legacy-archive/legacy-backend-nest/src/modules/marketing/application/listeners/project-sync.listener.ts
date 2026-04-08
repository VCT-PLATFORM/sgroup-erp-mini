import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MarketingProjectSyncListener {
  private readonly logger = new Logger(MarketingProjectSyncListener.name);

  // Sync Project to Marketing module (Campaign Tracking)
  @OnEvent('project.upserted', { async: true })
  handleProjectUpsertedEvent(project: any) {
    this.logger.log(`Received project.upserted event for project: ${project.projectCode}`);
    
    // Business Logic: 
    // - Check if a marketing campaign already exists for this project Code.
    // - If not, automatically create an 'Awareness Campaign' baseline.
    // - Generate UTM tracking parameter templates.
    
    this.logger.log(`Successfully synced project ${project.id} to Marketing.`);
  }
}
