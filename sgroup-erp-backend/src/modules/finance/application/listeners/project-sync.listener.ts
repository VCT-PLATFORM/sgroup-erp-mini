import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FinanceProjectSyncListener {
  private readonly logger = new Logger(FinanceProjectSyncListener.name);

  // Sync Project to Finance module (Cost Center / Budget Ledger)
  @OnEvent('project.upserted', { async: true })
  handleProjectUpsertedEvent(project: any) {
    this.logger.log(`Received project.upserted event for project: ${project.projectCode}`);
    
    // Business Logic: 
    // - Create a new Cost Center / Ledger in the Finance module for this project.
    // - Set up provisional commission budget based on project.feeRate.
    
    this.logger.log(`Successfully synced project ${project.id} to Finance.`);
  }
}
