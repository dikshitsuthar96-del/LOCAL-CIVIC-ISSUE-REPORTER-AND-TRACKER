import React, { useState } from 'react';
import {
  X,
  Camera,
  FileCheck2,
  Ticket,
  ShieldCheck,
  Scale,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  Landmark,
} from 'lucide-react';

interface WorkflowGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (mode: 'citizen' | 'gov', targetTab?: string) => void;
}

export const WorkflowGuideModal: React.FC<WorkflowGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  if (!isOpen) return null;

  const workflowSteps = [
    {
      step: 1,
      title: 'Citizen Photo Capture & Multimodal Vision Analysis',
      actor: 'Citizen + Gemini Multimodal Vision AI',
      portal: 'Citizen Portal',
      icon: Camera,
      badgeColor: 'bg-indigo-100 text-indigo-800',
      summary:
        'Citizen captures or uploads an image of a municipal problem (pothole, streetlight outage, water burst). The vision pipeline inspects pixel data and detects category, severity, and safety hazards.',
      details: [
        'Client sends base64 image to server endpoint /api/analyze-image.',
        'Gemini multimodal model evaluates visual defect indicators and estimates confidence score.',
        'Displays an immediate Pre-Submission AI Vision Findings Card directly to the citizen before submission.',
        'Extracts urgent public safety risks (e.g. "Severe tire blowout hazard", "High risk to motorcyclists").',
      ],
      actionLabel: 'Try Step 1: Open Report Form',
      actionHandler: () => onNavigateTo('citizen', 'report'),
    },
    {
      step: 2,
      title: 'Citizen Review & Official Complaint Intake',
      actor: 'Citizen + Civic Sahayak (Intake LangGraph Pipeline)',
      portal: 'Citizen Portal',
      icon: FileCheck2,
      badgeColor: 'bg-indigo-100 text-indigo-800',
      summary:
        'Citizen verifies the AI findings, modifies description or location, and submits the report. Civic Sahayak executes a 6-node intake graph to synthesize and route the case.',
      details: [
        'classify_image: Confirms defect classification and confidence.',
        'validate_with_text: Cross-references citizen description with image semantics.',
        'determine_department: Routes to responsible department (Transportation, Sanitation, Lighting, Water, Parks).',
        'draft_complaint: Generates formal municipal subject line and safety urgency rating.',
        'submit_complaint: Commits official record to the civic database store.',
        'notify_user: Generates official receipt and tracking instructions.',
      ],
      actionLabel: 'Try Step 2: Submit a Civic Report',
      actionHandler: () => onNavigateTo('citizen', 'report'),
    },
    {
      step: 3,
      title: 'Official Reference ID & Work Order Generation',
      actor: 'System Database & Citizen Interface',
      portal: 'Citizen Portal',
      icon: Ticket,
      badgeColor: 'bg-indigo-100 text-indigo-800',
      summary:
        'The citizen receives an official municipal Complaint ID and Work Order Reference Number for transparent lifecycle tracking.',
      details: [
        'Generates dual tracking identifiers: Citizen Case ID (e.g. CIVIC-2026-1042) and Department Work Order (e.g. WO-DOT-2026-8812).',
        'Provides copyable tracking links and projected department service level agreements (SLAs).',
        'No internal government controls or workflows are exposed on this public screen.',
      ],
      actionLabel: 'Try Step 3: Track a Complaint',
      actionHandler: () => onNavigateTo('citizen', 'track'),
    },
    {
      step: 4,
      title: 'Government Authentication & Role-Based Authorization (RBAC)',
      actor: 'Municipal Officers & Access Gateway',
      portal: 'Government Simulator',
      icon: ShieldCheck,
      badgeColor: 'bg-amber-100 text-amber-800',
      summary:
        'Municipal staff authenticate via official badge credentials or email SSO. The server strictly enforces role-based access control (RBAC) across departments and actions.',
      details: [
        'City Admin (MUNI-001): Universal administrative access across all municipal departments.',
        'Department Dispatcher (DOT-402, WATER-109): Authorized to triage, dispatch, and manage tickets in their designated department only.',
        'Field Supervisor (CREW-774): Can update work order progress and upload completion proof. Prohibited from rejecting cases.',
        'Civic Auditor (AUDIT-901): Strictly read-only access. Any status update or mutation attempt is rejected with HTTP 403 Forbidden.',
      ],
      actionLabel: 'Try Step 4: Open Government SSO',
      actionHandler: () => onNavigateTo('gov'),
    },
    {
      step: 5,
      title: 'Department Triage, Evidence Review & Jurisdiction Routing',
      actor: 'Department Dispatcher / Operations Administrator',
      portal: 'Government Simulator',
      icon: Scale,
      badgeColor: 'bg-amber-100 text-amber-800',
      summary:
        'Dispatcher inspects high-resolution evidence, verifies municipal liability, and either accepts the case, reassigns department jurisdiction, or issues a formal rejection.',
      details: [
        'Evidence Inspection: Zoom in on photographic evidence and review citizen statements.',
        'Accept & Verify: Advances ticket status from UNDER_REVIEW to VERIFIED.',
        'Statutory Rejection: Officers can dismiss non-municipal issues with documented justification (e.g. Private Property, Duplicate).',
        'Department Reassignment: Re-routes cross-jurisdictional issues (e.g. Water leak damaging road transferred from Transportation to Water & Sewer).',
      ],
      actionLabel: 'Try Step 5: Triage in Gov Simulator',
      actionHandler: () => onNavigateTo('gov'),
    },
    {
      step: 6,
      title: 'Field Crew Assignment, Work Order Progression & Resolution Proof',
      actor: 'Field Operations Crew & Supervisor',
      portal: 'Government Simulator',
      icon: Truck,
      badgeColor: 'bg-amber-100 text-amber-800',
      summary:
        'Crews are assigned to the work order, deploy to the site, set target completion ETAs, and document certified physical resolution proof.',
      details: [
        'Status Progression: VERIFIED -> ASSIGNED -> IN_PROGRESS -> RESOLVED.',
        'Dispatch Crew: Assign specific units (e.g. Road Maintenance Unit #4, High-Voltage Bucket Crew).',
        'Set Resolution ETA: "Today by 4:00 PM" or "Within 24 Hours".',
        'Resolution Proof: Record engineering notes and compliance sign-off (e.g. "Asphalt patch rolled and compacted to grade").',
        'Evaluator Fast-Forward: Single-click demo buttons simulate full lifecycle progression in 3 seconds.',
      ],
      actionLabel: 'Try Step 6: Dispatch & Resolve Work Order',
      actionHandler: () => onNavigateTo('gov'),
    },
    {
      step: 7,
      title: 'Autonomous Monitoring & Real-Time Citizen Reflection',
      actor: 'Nagrik Sandesh (Monitoring Agent) + Citizen Tracker',
      portal: 'Cross-Portal Synchronization',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      summary:
        'Updates made in the Government Simulator immediately synchronize with the Citizen Portal. The citizen looks up their Reference ID and sees the verified resolution.',
      details: [
        'Autonomous Polling: Nagrik Sandesh detects work order state changes in the background.',
        'Plain-Language Translation: Translates technical government codes (e.g. MUNI_ASPH_PATCH_04) into clear citizen updates.',
        'Citizen Visibility: The citizen enters their Reference ID in the public tracker to see the completed repair, assigned crew, and completion milestone.',
        'Full End-to-End Loop Closed: Transparent municipal governance with zero leakage of back-office controls.',
      ],
      actionLabel: 'Try Step 7: Verify on Citizen Tracker',
      actionHandler: () => onNavigateTo('citizen', 'track'),
    },
  ];

  const currentStep = workflowSteps.find((s) => s.step === selectedStep) || workflowSteps[0];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-2 border-slate-700 shadow-2xl rounded-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] text-slate-900 font-sans">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                System Specification & Architecture
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                End-to-End Municipal Lifecycle Workflow
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Horizontal Progression Ribbon */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 overflow-x-auto flex items-center space-x-1 sm:space-x-2">
          {workflowSteps.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setSelectedStep(s.step)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedStep === s.step
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center text-[10px] font-bold">
                {s.step}
              </span>
              <span>{s.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Step Details Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center shrink-0">
                <StepIcon className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-500">STAGE {currentStep.step} OF 7</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${currentStep.badgeColor}`}>
                    {currentStep.portal}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Actors
              </span>
              <span className="text-xs font-bold text-slate-800">{currentStep.actor}</span>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {currentStep.summary}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Technical & Operational Details for this Stage:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentStep.details.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Step Navigation & Direct Action Link */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={selectedStep === 1}
              onClick={() => setSelectedStep((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous Stage
            </button>
            <button
              type="button"
              disabled={selectedStep === 7}
              onClick={() => setSelectedStep((prev) => Math.min(7, prev + 1))}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next Stage
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              currentStep.actionHandler();
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <span>{currentStep.actionLabel}</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
