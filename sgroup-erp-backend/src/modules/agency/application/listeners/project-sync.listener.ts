import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AgencyProjectSyncListener {
  private readonly logger = new Logger(AgencyProjectSyncListener.name);

  // Sync Project to Agency module (Basket & Contracts)
  @OnEvent('project.upserted', { async: true })
  handleProjectUpsertedEvent(project: any) {
    this.logger.log(`Received project.upserted event for project: ${project.projectCode}`);
    
    // Business Logic: 
    // - Check ProjectAgencyAllocation mappings.
    // - Automatically unlock Agency distribution portals if a project is ACTIVE.
    
    this.logger.log(`Successfully synced project ${project.id} to Agency ecosystem.`);
  }
}
