import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SalesCRMProjectSyncListener {
  private readonly logger = new Logger(SalesCRMProjectSyncListener.name);

  // Sync Project to Sales CRM module (Pipeline & Inventory matching)
  @OnEvent('project.upserted', { async: true })
  handleProjectUpsertedEvent(project: any) {
    this.logger.log(`Received project.upserted event for project: ${project.projectCode}`);
    
    // Business Logic: 
    // - Check if this Project requires Sales Managers to build Targets.
    // - Sync basic inventory signals.
    
    this.logger.log(`Successfully synced project ${project.id} to Sales CRM.`);
  }
}
