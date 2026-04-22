import React, { Suspense, useMemo } from 'react';
import { MKTSidebar } from './MKTSidebar';
import { useMKTRoute } from './hooks/useMKTRoute';
import { MKTErrorBoundary } from './components/ErrorBoundary';

// ── Lazy Loading Screens ──
const MKTDashboard = React.lazy(() => import('./screens/MKTDashboard').then(m => ({ default: m.MKTDashboard })));
const CampaignsScreen = React.lazy(() => import('./screens/CampaignsScreen').then(m => ({ default: m.CampaignsScreen })));
const LeadsScreen = React.lazy(() => import('./screens/LeadsScreen').then(m => ({ default: m.LeadsScreen })));
const ContentScreen = React.lazy(() => import('./screens/ContentScreen').then(m => ({ default: m.ContentScreen })));
const BudgetScreen = React.lazy(() => import('./screens/BudgetScreen').then(m => ({ default: m.BudgetScreen })));
const AnalyticsScreen = React.lazy(() => import('./screens/AnalyticsScreen').then(m => ({ default: m.AnalyticsScreen })));
const KOLScreen = React.lazy(() => import('./screens/KOLScreen').then(m => ({ default: m.KOLScreen })));

// ── Loading Fallback ──
const ScreenLoader = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
    <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
    <span className="text-sm font-semibold text-sg-subtext">Đang tải màn hình...</span>
  </div>
);

export function MKTShell() {
  const VALID_ROUTES = [
    'MKT_DASHBOARD', 'MKT_CAMPAIGNS', 'MKT_LEADS', 'MKT_CONTENT',
    'MKT_BUDGET', 'MKT_ANALYTICS', 'MKT_KOL'
  ];
  
  const { activeKey, navigate } = useMKTRoute(VALID_ROUTES);

  const CurrentScreen = useMemo(() => {
    switch (activeKey) {
      case 'MKT_DASHBOARD': return <MKTDashboard />;
      case 'MKT_CAMPAIGNS': return <CampaignsScreen />;
      case 'MKT_LEADS': return <LeadsScreen />;
      case 'MKT_CONTENT': return <ContentScreen />;
      case 'MKT_BUDGET': return <BudgetScreen />;
      case 'MKT_ANALYTICS': return <AnalyticsScreen />;
      case 'MKT_KOL': return <KOLScreen />;
      default: return <MKTDashboard />;
    }
  }, [activeKey]);

  return (
    <div className="flex w-full h-[100vh] bg-sg-bg text-sg-text font-inter overflow-hidden subpixel-antialiased">
      {/* Dynamic Aurora Background specific to MKT Module */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20 transition-opacity duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <MKTSidebar activeKey={activeKey} onNavigate={(key) => navigate(key as any)} />
      
      <main className="flex-1 h-full overflow-y-auto relative z-10 custom-scrollbar">
        <MKTErrorBoundary>
          <Suspense fallback={<ScreenLoader />}>
            {CurrentScreen}
          </Suspense>
        </MKTErrorBoundary>
      </main>
    </div>
  );
}
