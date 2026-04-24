// ═══════════════════════════════════════════════════════════
// @modules/project — Public API
//
// This is the ONLY file that the web-shell imports from this module.
// Everything else is internal to the module.
//
// Usage in module-registry:
//   import { ProjectShell } from '@modules/project';
// ═══════════════════════════════════════════════════════════

// ── Shell (entry points) ──
export { ProjectShell } from './ProjectShell';
export { ProjectSidebar } from './components/ProjectSidebar';

// ── Screens ──
export { ProjectListScreen } from './screens/ProjectListScreen';

// ── Components ──
export { ProjectFormModal } from './components/ProjectFormModal';

// ── Hooks ──
export { useProjects } from './hooks/useProjects';

// ── API ──
export * from './api/projectApi';
export * from './api/projectMocks';

// ── Types ──
export type * from './types';
