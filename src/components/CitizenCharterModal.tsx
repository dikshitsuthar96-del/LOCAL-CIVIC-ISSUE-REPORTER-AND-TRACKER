import React from 'react';
import { X, FileText, CheckCircle2, Clock, ShieldCheck, PhoneCall, Building2, Download, Award } from 'lucide-react';

interface CitizenCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitizenCharterModal: React.FC<CitizenCharterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0B1E36] text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                  OFFICIAL MUNICIPAL CHARTER
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-500/30">
                  GAZETTE REGISTRY 2026
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Citizen Service Charter &amp; SLA Commitment Booklet
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed">
          {/* Mission Overview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Award className="w-4 h-4 text-orange-600" />
              <span>Pledge of Transparent Civic Governance</span>
            </div>
            <p className="text-slate-600 text-xs">
              Under the Metropolis Public Services Guarantee Act, the <strong>Local Civic Issue Reporter and Tracker</strong> guarantees prompt, auditable, and citizen-first remediation of all public infrastructure defects. Every citizen has a statutory right to automated tracking, clear plain-language updates, and escalation if deadlines are breached.
            </p>
          </div>

          {/* SLA Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Statutory Service Level Agreements (SLAs) by Department</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Department &amp; Service</th>
                    <th className="p-3">Issue Types Covered</th>
                    <th className="p-3">Standard SLA</th>
                    <th className="p-3">Emergency SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">Transportation &amp; Streets</td>
                    <td className="p-3 text-slate-600">Potholes, crater repairs, lane obstructions</td>
                    <td className="p-3 text-blue-700 font-bold">48 Hours</td>
                    <td className="p-3 text-rose-600 font-bold">6 Hours</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">Sanitation &amp; Waste Mgmt</td>
                    <td className="p-3 text-slate-600">Overflowing bins, illegal alley dumps, missed pickups</td>
                    <td className="p-3 text-blue-700 font-bold">24 Hours</td>
                    <td className="p-3 text-rose-600 font-bold">4 Hours</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">Street Lighting &amp; Electrical</td>
                    <td className="p-3 text-slate-600">Luminaire outages, exposed wiring, dark crossings</td>
                    <td className="p-3 text-blue-700 font-bold">36 Hours</td>
                    <td className="p-3 text-rose-600 font-bold">3 Hours</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">Water &amp; Sewer Authority</td>
                    <td className="p-3 text-slate-600">Main bursts, sewer overflows, hydrant leaks</td>
                    <td className="p-3 text-blue-700 font-bold">12 Hours</td>
                    <td className="p-3 text-rose-600 font-bold">1 Hour</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">Parks &amp; Public Spaces</td>
                    <td className="p-3 text-slate-600">Fallen tree branches, broken benches, turf safety</td>
                    <td className="p-3 text-blue-700 font-bold">72 Hours</td>
                    <td className="p-3 text-rose-600 font-bold">8 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Autonomous AI Agents Role in Charter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-orange-900">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>Civic Sahayak (Intake AI)</span>
              </div>
              <p className="text-slate-700 text-xs">
                Inspects citizen photos with multimodal computer vision, determines statutory jurisdiction, assigns urgency tiers, and eliminates manual paperwork delays.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nagrik Sandesh (Notification AI)</span>
              </div>
              <p className="text-slate-700 text-xs">
                Maintains 24/7 background watch over government work-order pipelines, translating engineering codes into plain citizen language so you never have to guess ticket progress.
              </p>
            </div>
          </div>

          {/* Grievance Redressal & Helpline */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm text-white">
                <PhoneCall className="w-4 h-4 text-orange-400" />
                <span>Citizen Grievance Redressal &amp; Escalation</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">TOLL-FREE 24x7</span>
            </div>
            <p className="text-slate-300 text-xs">
              If an issue exceeds the published SLA without certified progress, the case is automatically escalated to the Municipal Commissioner's Office for administrative review.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-orange-300">
              <span>Helpline: 1800-CIVIC-GOV</span>
              <span>•</span>
              <span>SMS: 56161 ("STATUS &lt;ID&gt;")</span>
              <span>•</span>
              <span>Email: grievances@metropolis.gov</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Published pursuant to Metropolis Municipal Transparency Directive • Ref: MMD-2026-CHTR
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            Close Booklet
          </button>
        </div>
      </div>
    </div>
  );
};
