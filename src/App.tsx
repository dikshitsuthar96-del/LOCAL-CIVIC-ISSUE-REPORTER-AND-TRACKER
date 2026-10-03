import React, { useState, useEffect } from 'react';
import { CitizenPortal } from './components/CitizenPortal.js';
import { GovSimulator } from './components/GovSimulator.js';
import { AdminPortal } from './components/AdminPortal.js';
import { WorkflowGuideModal } from './components/WorkflowGuideModal.js';
import { MunicipalHeader } from './components/MunicipalHeader.js';
import { MunicipalFooter } from './components/MunicipalFooter.js';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { SupabaseAuthProvider } from './context/SupabaseAuthContext.js';

function MainAppShell() {
  const { language, toggleLanguage, t } = useLanguage();

  // Application Mode: 'citizen' (User-facing Portal), 'gov' (Government Department Access Portal), or 'admin' (Admin Portal)
  const [appMode, setAppMode] = useState<'citizen' | 'gov' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('app');
      if (mode === 'admin') return 'admin';
      if (mode === 'gov') return 'gov';
    }
    return 'citizen';
  });

  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('id');
    }
    return null;
  });

  const [activeNavSection, setActiveNavSection] = useState<string>('home');
  const [isWorkflowGuideOpen, setIsWorkflowGuideOpen] = useState(false);

  // Keep URL search params in sync without reloading page
  const updateUrl = (mode: 'citizen' | 'gov' | 'admin', id?: string | null) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('app', mode);
      if (id) {
        url.searchParams.set('id', id);
      } else {
        url.searchParams.delete('id');
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleSwitchToGov = (departmentId?: string) => {
    setAppMode('gov');
    updateUrl('gov', activeComplaintId);
  };

  const handleSwitchToCitizen = (complaintId?: string) => {
    const id = complaintId || activeComplaintId;
    setAppMode('citizen');
    if (id) setActiveComplaintId(id);
    updateUrl('citizen', id);
  };

  const handleSwitchToAdmin = () => {
    setAppMode('admin');
    updateUrl('admin', activeComplaintId);
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveNavSection(sectionId);
    if (appMode !== 'citizen') {
      setAppMode('citizen');
      updateUrl('citizen', activeComplaintId);
    }
  };

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('app');
      if (mode === 'admin') setAppMode('admin');
      else if (mode === 'gov') setAppMode('gov');
      else setAppMode('citizen');
      const id = params.get('id');
      setActiveComplaintId(id);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Authentic 3-Level Indian Government Municipal Header */}
      <MunicipalHeader
        appMode={appMode}
        onSwitchMode={(mode) => {
          if (mode === 'citizen') handleSwitchToCitizen();
          else if (mode === 'gov') handleSwitchToGov();
          else handleSwitchToAdmin();
        }}
        onNavigateSection={handleNavigateSection}
        activeSection={activeNavSection}
        onOpenWorkflowGuide={() => setIsWorkflowGuideOpen(true)}
      />

      {/* Role / Mode Indication Banner when in Officer or Admin mode */}
      {appMode !== 'citizen' && (
        <div className="bg-[#0b2239] text-white border-b border-[#ff9933] py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-xs font-bold text-[10px] uppercase bg-[#ff9933] text-black">
                {appMode === 'gov' ? 'OFFICER ACCESS' : 'MUNICIPAL ADMIN GATE'}
              </span>
              <span>
                {appMode === 'gov'
                  ? 'Currently logged into Department Field Console & Dispatch Desk'
                  : 'Currently logged into Municipal Administrator Governance System'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSwitchToCitizen()}
              className="font-bold text-[#ff9933] hover:underline cursor-pointer"
            >
              &larr; Return to Public Citizen Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {appMode === 'citizen' ? (
          <CitizenPortal
            onOpenGovSimulator={handleSwitchToGov}
            onOpenWorkflowGuide={() => setIsWorkflowGuideOpen(true)}
            initialTrackingId={activeComplaintId}
            activeNavSection={activeNavSection}
            onNavigateSection={handleNavigateSection}
          />
        ) : appMode === 'gov' ? (
          <GovSimulator
            onOpenCitizenPortal={handleSwitchToCitizen}
            onOpenWorkflowGuide={() => setIsWorkflowGuideOpen(true)}
            onOpenAdminPortal={handleSwitchToAdmin}
          />
        ) : (
          <AdminPortal
            onOpenGovPortal={handleSwitchToGov}
            onOpenCitizenPortal={handleSwitchToCitizen}
            onOpenWorkflowGuide={() => setIsWorkflowGuideOpen(true)}
          />
        )}
      </div>

      {/* Authentic Indian Municipal Footer */}
      <MunicipalFooter
        onNavigateSection={handleNavigateSection}
        onOpenWorkflowGuide={() => setIsWorkflowGuideOpen(true)}
      />

      {/* End-to-End Workflow Architecture Modal */}
      <WorkflowGuideModal
        isOpen={isWorkflowGuideOpen}
        onClose={() => setIsWorkflowGuideOpen(false)}
        onNavigateTo={(targetMode) => {
          if (targetMode === 'gov') {
            handleSwitchToGov();
          } else {
            handleSwitchToCitizen();
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SupabaseAuthProvider>
        <MainAppShell />
      </SupabaseAuthProvider>
    </LanguageProvider>
  );
}

