import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Landmark,
  Eye,
  Truck,
  ArrowLeftRight,
  FileCheck2,
  FileSpreadsheet,
  X,
  BadgeCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { GovUser, GovRole } from '../types.js';

interface GovAuthMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: GovUser | null;
  onSwitchOfficer?: (officer: GovUser) => void;
  demoOfficers?: GovUser[];
}

interface CapabilityRow {
  name: string;
  description: string;
  category: string;
  cityAdmin: { allowed: boolean; note: string };
  dispatcher: { allowed: boolean; note: string };
  fieldSupervisor: { allowed: boolean; note: string };
  auditor: { allowed: boolean; note: string };
}

const CAPABILITIES: CapabilityRow[] = [
  {
    name: 'View Municipal Queue',
    description: 'Access full complaint list, GIS cadastre tags, and citizen contact records',
    category: 'Information Access',
    cityAdmin: { allowed: true, note: 'Universal access across all city departments' },
    dispatcher: { allowed: true, note: 'All tickets visible; department filtered by default' },
    fieldSupervisor: { allowed: true, note: 'Read access for operational situational awareness' },
    auditor: { allowed: true, note: 'Full read access for independent compliance oversight' },
  },
  {
    name: 'Gemini Multimodal Vision Telemetry',
    description: 'Inspect AI detected hazard, confidence scores, and safety risks',
    category: 'Information Access',
    cityAdmin: { allowed: true, note: 'Full inspection access' },
    dispatcher: { allowed: true, note: 'Inspect technical triage diagnostics' },
    fieldSupervisor: { allowed: true, note: 'View site safety hazard warnings' },
    auditor: { allowed: true, note: 'Review AI classification accuracy' },
  },
  {
    name: 'Triage & Assign Dispatch Crew',
    description: 'Select municipal rapid response team, repair truck, or utility crew',
    category: 'Operational Action',
    cityAdmin: { allowed: true, note: 'Can assign any municipal crew' },
    dispatcher: { allowed: true, note: 'Allowed strictly within assigned department jurisdiction' },
    fieldSupervisor: { allowed: true, note: 'Can mobilize assigned field crew equipment' },
    auditor: { allowed: false, note: 'Restricted: Read-only oversight role' },
  },
  {
    name: 'Department Reassignment',
    description: 'Reroute work order to another municipal agency (e.g. DOT to Water)',
    category: 'Administrative Triage',
    cityAdmin: { allowed: true, note: 'Executive jurisdiction across all departments' },
    dispatcher: { allowed: true, note: 'Allowed when ticket misrouted to their department' },
    fieldSupervisor: { allowed: false, note: 'Restricted: Requires administrative clearance' },
    auditor: { allowed: false, note: 'Restricted: Mutation forbidden' },
  },
  {
    name: 'Reject Complaint / Dismiss',
    description: 'Formally reject ticket with mandatory statutory justification',
    category: 'Administrative Triage',
    cityAdmin: { allowed: true, note: 'Permitted with executive record logging' },
    dispatcher: { allowed: true, note: 'Permitted only for tickets in their department' },
    fieldSupervisor: { allowed: false, note: 'Restricted: Field crews cannot dismiss citizen reports' },
    auditor: { allowed: false, note: 'Restricted: Mutation forbidden' },
  },
  {
    name: 'Advance Work Status & Completion',
    description: 'Mark ticket In Progress, update resolution notes, and confirm fix',
    category: 'Field Execution',
    cityAdmin: { allowed: true, note: 'Executive override permitted' },
    dispatcher: { allowed: true, note: 'Permitted within department operational window' },
    fieldSupervisor: { allowed: true, note: 'Primary responsibility: on-site repair verification' },
    auditor: { allowed: false, note: 'Restricted: Mutation forbidden' },
  },
  {
    name: 'Close Work Order Permanently',
    description: 'Archive resolved ticket to permanent municipal historical ledger',
    category: 'Administrative Triage',
    cityAdmin: { allowed: true, note: 'Executive sign-off' },
    dispatcher: { allowed: true, note: 'Department head closure confirmation' },
    fieldSupervisor: { allowed: false, note: 'Restricted: Requires dispatcher or admin sign-off' },
    auditor: { allowed: false, note: 'Restricted: Mutation forbidden' },
  },
  {
    name: 'Audit Log & Forensic Chain of Custody',
    description: 'Review digital officer signatures, badge stamps, and timing deltas',
    category: 'Compliance & Audit',
    cityAdmin: { allowed: true, note: 'Administrative audit review' },
    dispatcher: { allowed: true, note: 'Departmental performance logs' },
    fieldSupervisor: { allowed: true, note: 'Crew dispatch history' },
    auditor: { allowed: true, note: 'Primary mission: independent civic transparency' },
  },
];

export const GovAuthMatrixModal: React.FC<GovAuthMatrixModalProps> = ({
  isOpen,
  onClose,
  currentOfficer,
  onSwitchOfficer,
  demoOfficers = [],
}) => {
  if (!isOpen) return null;

  const getRoleColumnHighlight = (role: GovRole) => {
    if (!currentOfficer) return '';
    return currentOfficer.role === role ? 'bg-indigo-50/50' : '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-2 border-slate-700 shadow-2xl rounded-2xl max-w-5xl w-full overflow-hidden text-slate-900 font-sans flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400 flex items-center space-x-2">
                <span>Metropolis Municipal Code • Title 3 § 104</span>
                <span>•</span>
                <span>Civic Operations Security</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Role-Based Access Control (RBAC) & Clearance Matrix</span>
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close matrix"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Officer Status Banner */}
        {currentOfficer ? (
          <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                {currentOfficer.badgeNumber.split('-')[0]}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{currentOfficer.name}</span>
                  <span className="font-mono text-slate-500 font-semibold">({currentOfficer.badgeNumber})</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-900 text-amber-300">
                    {currentOfficer.clearanceLevel}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{currentOfficer.title} • {currentOfficer.departmentName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-[11px]">Active Clearance:</span>
              <span className="px-2.5 py-1 rounded-md font-bold text-xs bg-indigo-100 text-indigo-800 border border-indigo-200">
                {currentOfficer.role}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center space-x-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>No officer currently authenticated. Sign in with municipal credentials to execute triage.</span>
            </div>
          </div>
        )}

        {/* Scrollable Matrix Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Quick Role Tester Bar */}
          {onSwitchOfficer && demoOfficers.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Interactive Role Switcher (Test RBAC Live)</span>
                </span>
                <span className="text-[11px] text-slate-500">Click any officer to switch clearance immediately:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {demoOfficers.map((officer) => {
                  const isActive = currentOfficer?.badgeNumber === officer.badgeNumber;
                  return (
                    <button
                      key={officer.badgeNumber}
                      type="button"
                      onClick={() => onSwitchOfficer(officer)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 block truncate">{officer.name}</span>
                        <span className="font-mono text-[10px] text-slate-500 block">{officer.badgeNumber}</span>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase font-mono text-slate-700">
                          {officer.role.replace('_', ' ')}
                        </span>
                        {isActive && <BadgeCheck className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Master RBAC Authorization Matrix Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] font-mono uppercase tracking-wider">
                    <th className="p-3 border-r border-slate-800 font-bold min-w-[220px]">
                      Municipal Operation / Action
                    </th>
                    <th className={`p-3 border-r border-slate-800 text-center min-w-[150px] ${currentOfficer?.role === 'CITY_ADMIN' ? 'bg-purple-950 text-purple-200' : ''}`}>
                      <span className="block font-bold">City Admin</span>
                      <span className="text-[9px] text-slate-400 font-normal">Level 4 Executive</span>
                    </th>
                    <th className={`p-3 border-r border-slate-800 text-center min-w-[160px] ${currentOfficer?.role === 'DEPT_DISPATCHER' ? 'bg-blue-950 text-blue-200' : ''}`}>
                      <span className="block font-bold">Dept Dispatcher</span>
                      <span className="text-[9px] text-slate-400 font-normal">Level 2 Dispatcher</span>
                    </th>
                    <th className={`p-3 border-r border-slate-800 text-center min-w-[160px] ${currentOfficer?.role === 'FIELD_SUPERVISOR' ? 'bg-emerald-950 text-emerald-200' : ''}`}>
                      <span className="block font-bold">Field Supervisor</span>
                      <span className="text-[9px] text-slate-400 font-normal">Level 3 Supervisor</span>
                    </th>
                    <th className={`p-3 text-center min-w-[150px] ${currentOfficer?.role === 'AUDITOR' ? 'bg-slate-800 text-amber-300' : ''}`}>
                      <span className="block font-bold">Civic Auditor</span>
                      <span className="text-[9px] text-slate-400 font-normal">Level 1 Oversight</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {CAPABILITIES.map((cap, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-medium text-slate-900 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{cap.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{cap.description}</div>
                        <span className="inline-block mt-1 px-1.5 py-0.2 text-[9px] rounded font-mono bg-slate-100 text-slate-600">
                          {cap.category}
                        </span>
                      </td>

                      {/* City Admin */}
                      <td className={`p-2.5 text-center border-r border-slate-200 ${getRoleColumnHighlight('CITY_ADMIN')}`}>
                        <div className="flex flex-col items-center">
                          {cap.cityAdmin.allowed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 mb-0.5" />
                          )}
                          <span className="text-[10px] font-bold text-slate-700">
                            {cap.cityAdmin.allowed ? 'Authorized' : 'Forbidden'}
                          </span>
                          <span className="text-[9px] text-slate-400 leading-tight mt-0.5 max-w-[130px]">
                            {cap.cityAdmin.note}
                          </span>
                        </div>
                      </td>

                      {/* Dept Dispatcher */}
                      <td className={`p-2.5 text-center border-r border-slate-200 ${getRoleColumnHighlight('DEPT_DISPATCHER')}`}>
                        <div className="flex flex-col items-center">
                          {cap.dispatcher.allowed ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mb-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 mb-0.5" />
                          )}
                          <span className="text-[10px] font-bold text-slate-700">
                            {cap.dispatcher.allowed ? 'Authorized' : 'Forbidden'}
                          </span>
                          <span className="text-[9px] text-slate-500 leading-tight mt-0.5 max-w-[140px]">
                            {cap.dispatcher.note}
                          </span>
                        </div>
                      </td>

                      {/* Field Supervisor */}
                      <td className={`p-2.5 text-center border-r border-slate-200 ${getRoleColumnHighlight('FIELD_SUPERVISOR')}`}>
                        <div className="flex flex-col items-center">
                          {cap.fieldSupervisor.allowed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-0.5" />
                          ) : (
                            <Lock className="w-4 h-4 text-amber-600 mb-0.5" />
                          )}
                          <span className="text-[10px] font-bold text-slate-700">
                            {cap.fieldSupervisor.allowed ? 'Authorized' : 'Restricted'}
                          </span>
                          <span className="text-[9px] text-slate-500 leading-tight mt-0.5 max-w-[140px]">
                            {cap.fieldSupervisor.note}
                          </span>
                        </div>
                      </td>

                      {/* Auditor */}
                      <td className={`p-2.5 text-center ${getRoleColumnHighlight('AUDITOR')}`}>
                        <div className="flex flex-col items-center">
                          {cap.auditor.allowed ? (
                            <CheckCircle2 className="w-4 h-4 text-slate-600 mb-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 mb-0.5" />
                          )}
                          <span className="text-[10px] font-bold text-slate-700">
                            {cap.auditor.allowed ? 'Read Only' : 'Denied (403)'}
                          </span>
                          <span className="text-[9px] text-slate-500 leading-tight mt-0.5 max-w-[130px]">
                            {cap.auditor.note}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal & Governance Rationale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>Departmental Jurisdiction & Division of Powers</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Municipal department dispatchers (such as DOT Streets or Water & Sewer) possess authority
                strictly within their agency’s budget and resource mandate. Cross-department actions are
                intercepted by the server and blocked with HTTP 403 Forbidden to prevent unauthorized work
                order expenditures without inter-agency memorandums.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Independent Auditor Safeguard (Non-Repudiation)</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                The Office of the Inspector General operates under strict read-only transparency guidelines.
                Auditors can inspect case dossiers, GPS geotags, AI analysis scores, and triage timing,
                but cannot edit tickets or erase citizen submissions, guaranteeing audit integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Security Specification: OWASP A01 (Broken Access Control) & NIST SP 800-53 AC-2/AC-3
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Acknowledge & Return to Console
          </button>
        </div>
      </div>
    </div>
  );
};
