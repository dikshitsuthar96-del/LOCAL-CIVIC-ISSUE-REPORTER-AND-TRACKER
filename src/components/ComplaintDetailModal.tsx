import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  AlertTriangle,
  Play,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Cpu,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Complaint, ComplaintStatus, StatusHistoryRecord, AgentTraceNode } from '../types.js';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onComplaintUpdated: (updated: Complaint) => void;
}

const LIFECYCLE_STEPS: { status: ComplaintStatus; label: string }[] = [
  { status: 'FILED', label: 'Filed' },
  { status: 'ACKNOWLEDGED', label: 'Acknowledged' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'SCHEDULED', label: 'Scheduled' },
  { status: 'RESOLVED', label: 'Resolved' },
];

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onComplaintUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'traces'>('timeline');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [advanceFeedback, setAdvanceFeedback] = useState<string | null>(null);

  if (!complaint) return null;

  const currentStepIdx = LIFECYCLE_STEPS.findIndex((s) => s.status === complaint.status);

  const handleAdvanceStatus = async () => {
    setIsAdvancing(true);
    setAdvanceFeedback(null);
    try {
      const res = await fetch(`/api/complaints/${complaint.id}/progress-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to advance complaint status');
      }

      const data = await res.json();
      if (data.complaint) {
        onComplaintUpdated(data.complaint);
        setAdvanceFeedback('Nagrik Sandesh detected status change and generated plain-language update!');
        setTimeout(() => setAdvanceFeedback(null), 4000);
      }
    } catch (err: any) {
      setAdvanceFeedback(`Error: ${err.message}`);
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-start justify-between bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                {complaint.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  complaint.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : complaint.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {complaint.status ? complaint.status.replace('_', ' ') : ''}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  complaint.priority === 'EMERGENCY'
                    ? 'bg-rose-100 text-rose-800'
                    : complaint.priority === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                {complaint.priority}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
              {complaint.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-0.5">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{complaint.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>{complaint.departmentName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Filed {new Date(complaint.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-neutral-200 flex space-x-4 bg-white">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Status Progression &amp; Timeline
          </button>
          <button
            onClick={() => setActiveTab('traces')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'traces'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Civic Sahayak Intake Traces &amp; Photo
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'timeline' && (
            <>
              {/* Lifecycle Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Municipal Workflow State
                </span>
                <div className="grid grid-cols-6 gap-1 sm:gap-2">
                  {LIFECYCLE_STEPS.map((step, idx) => {
                    const isCompleted = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    return (
                      <div key={step.status} className="flex flex-col items-center text-center">
                        <div
                          className={`w-full h-1.5 rounded-full mb-1.5 transition-colors ${
                            isCompleted ? 'bg-emerald-500' : 'bg-neutral-200'
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-xs font-semibold truncate ${
                            isCurrent
                              ? 'text-slate-900 font-bold'
                              : isCompleted
                              ? 'text-emerald-800'
                              : 'text-neutral-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation Trigger Bar */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-950">
                    <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                    <span>Nagrik Sandesh (Status &amp; Notification Agent) Simulation</span>
                  </div>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    Advance this ticket in the municipal work order system to trigger Nagrik Sandesh's automated plain-language translation.
                  </p>
                </div>

                <button
                  id="advance-status-btn"
                  onClick={handleAdvanceStatus}
                  disabled={isAdvancing || complaint.status === 'RESOLVED'}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer flex-shrink-0"
                >
                  {isAdvancing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Nagrik Sandesh Translating...</span>
                    </>
                  ) : complaint.status === 'RESOLVED' ? (
                    <span>Already Resolved</span>
                  ) : (
                    <>
                      <span>Advance Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {advanceFeedback && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{advanceFeedback}</span>
                </div>
              )}

              {/* Status History Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Official Status Transition Audit Log
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {complaint.statusHistory?.length || 0} updates logged
                  </span>
                </div>

                <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
                  {complaint.statusHistory && complaint.statusHistory.length > 0 ? (
                    complaint.statusHistory.map((rec: StatusHistoryRecord, index: number) => (
                      <div key={rec.id || index} className="relative group">
                        {/* Timeline node icon */}
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center" />

                        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900">{rec.newStatus}</span>
                              <span className="text-neutral-400 text-[11px]">via {rec.actor}</span>
                            </div>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              {new Date(rec.timestamp).toLocaleString()}
                            </span>
                          </div>

                          {/* Plain-Language Citizen Translation Bubble */}
                          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                            <div className="flex items-center space-x-1.5 font-semibold text-[11px] text-emerald-800 uppercase tracking-wider">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Plain-Language Citizen Translation</span>
                            </div>
                            <p className="leading-relaxed font-medium">{rec.plainLanguageSummary}</p>
                          </div>

                          {/* Raw Government System Code */}
                          <div className="flex items-center space-x-2 text-[11px] text-neutral-500 font-mono bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-150">
                            <span className="font-semibold text-neutral-600 uppercase">Raw Gov Code:</span>
                            <span className="text-neutral-800">{rec.rawStatus}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500">No status updates logged yet.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'traces' && (
            <div className="space-y-6">
              {/* Photo & Submitter Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 aspect-16/10">
                  <img
                    src={complaint.photoUrl}
                    alt={complaint.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Submission &amp; Routing Specs
                  </span>
                  <div>
                    <span className="text-slate-500 font-medium">Work Order Ticket: </span>
                    <span className="font-mono font-semibold text-slate-800">{complaint.officialReferenceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Classified Hazard: </span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {(complaint.issueType || (complaint as any).category || '').replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Assigned Department: </span>
                    <span className="font-semibold text-slate-800">{complaint.departmentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Submitter: </span>
                    <span className="text-slate-800">{complaint.submitterName || 'Citizen Anonymous'}</span>
                  </div>
                  {complaint.submitterEmail && (
                    <div>
                      <span className="text-slate-500 font-medium">Notification Channel: </span>
                      <span className="text-slate-800">{complaint.submitterEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Civic Sahayak LangGraph Execution Traces */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Civic Sahayak (Intake AI) LangGraph Node Traces
                  </h3>
                </div>

                {complaint.intakeTrace && complaint.intakeTrace.length > 0 ? (
                  <div className="space-y-2.5">
                    {complaint.intakeTrace.map((node: AgentTraceNode, idx: number) => (
                      <div
                        key={node.nodeName + idx}
                        className="p-3.5 rounded-xl border border-neutral-200 bg-white text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900">{node.title}</span>
                            <span className="font-mono text-[10px] text-neutral-400">({node.nodeName})</span>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-500">{node.durationMs}ms</span>
                        </div>

                        <p className="text-neutral-700 leading-relaxed pl-7">{node.reasoning}</p>

                        <div className="pl-7 pt-1 flex items-center space-x-2 text-[11px] text-neutral-500">
                          <span className="font-semibold text-neutral-700">Output:</span>
                          <span className="text-emerald-700 font-medium">{node.outputSummary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500">No trace logs available for this ticket.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
