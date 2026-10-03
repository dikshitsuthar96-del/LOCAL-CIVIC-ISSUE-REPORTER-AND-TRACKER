import React, { useState } from 'react';
import {
  Play,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  FileCode,
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types.js';

interface StatusSimulatorProps {
  complaints: Complaint[];
  onComplaintUpdated: (updated: Complaint) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

const STATUS_OPTIONS: ComplaintStatus[] = [
  'FILED',
  'UNDER_REVIEW',
  'VERIFIED',
  'ACKNOWLEDGED',
  'ASSIGNED',
  'IN_PROGRESS',
  'SCHEDULED',
  'RESOLVED',
  'REJECTED',
  'CLOSED',
];

const RAW_CODE_PRESETS: Record<ComplaintStatus, string> = {
  FILED: 'SYS_INTAKE_ACK_01',
  UNDER_REVIEW: 'MUNI_OPS_INTAKE_TRIAGE_EVAL',
  VERIFIED: 'FIELD_ENG_LIABILITY_CONFIRMED',
  ACKNOWLEDGED: 'MUNI_DISPATCH_TRIAGE_VERIFIED',
  ASSIGNED: 'CREW_04_TRUCK_ALLOCATED_ZONE_3',
  IN_PROGRESS: 'OPS_SITE_SAWCUT_ASPHALT_ACTIVE',
  SCHEDULED: 'INSP_SIGNOFF_WINDOW_SET_AM',
  RESOLVED: 'COMP_CERTIFIED_CLOSED_99',
  REJECTED: 'JURISDICTION_DISMISSED_NON_ACTIONABLE',
  CLOSED: 'ARCHIVE_RECORDS_SETTLED',
};

export const StatusSimulator: React.FC<StatusSimulatorProps> = ({
  complaints,
  onComplaintUpdated,
  onSelectComplaint,
}) => {
  const [selectedId, setSelectedId] = useState<string>(complaints[0]?.id || '');
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [customRawCode, setCustomRawCode] = useState<string>(RAW_CODE_PRESETS['IN_PROGRESS']);
  const [isSimulating, setIsSimulating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [latestTranslation, setLatestTranslation] = useState<string | null>(null);

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  const handleStatusChange = (status: ComplaintStatus) => {
    setTargetStatus(status);
    setCustomRawCode(RAW_CODE_PRESETS[status]);
  };

  const handleSimulate = async () => {
    if (!selectedComplaint) return;
    setIsSimulating(true);
    setResultMessage(null);
    setLatestTranslation(null);

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/progress-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nextStatus: targetStatus,
          rawStatusOverride: customRawCode || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to progress municipal status');
      }

      const data = await res.json();
      if (data.complaint) {
        onComplaintUpdated(data.complaint);
        const history = data.complaint.statusHistory;
        const lastRec = history?.[history.length - 1];
        if (lastRec) {
          setLatestTranslation(lastRec.plainLanguageSummary);
        }
        setResultMessage(`Status successfully transitioned to ${targetStatus}! Nagrik Sandesh dispatched notification.`);
      }
    } catch (err: any) {
      setResultMessage(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center space-x-2">
          <Play className="w-5 h-5 text-indigo-600 fill-indigo-600" />
          <span>Municipal Government Work-Order Simulator</span>
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Simulate official internal municipal work-order state updates to test Nagrik Sandesh's automated status change detection, plain-language translation, and notification dispatch.
        </p>
      </div>

      {/* Simulator Control Box */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
        {/* Step 1: Select Complaint */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
            1. Select Municipal Complaint Ticket to Update
          </label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setResultMessage(null);
              setLatestTranslation(null);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-900 bg-white focus:ring-2 focus:ring-slate-900"
          >
            {complaints.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.id}] {c.title} — Current: {c.status} ({c.departmentName})
              </option>
            ))}
          </select>
        </div>

        {selectedComplaint && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div>
              <span className="font-semibold text-slate-800">Current Status: </span>
              <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-900 ml-1">
                {selectedComplaint.status}
              </span>
              <span className="text-neutral-500 ml-3">Official Ref: {selectedComplaint.officialReferenceNumber}</span>
            </div>
            <button
              type="button"
              onClick={() => onSelectComplaint(selectedComplaint)}
              className="text-indigo-600 hover:underline font-medium text-left sm:text-right"
            >
              View Full Ticket Details &rarr;
            </button>
          </div>
        )}

        {/* Step 2: Choose Target Status */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
            2. Select New Municipal Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  targetStatus === status
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {(status || '').replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Raw Government Status Code */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center space-x-1.5">
              <FileCode className="w-3.5 h-3.5 text-neutral-500" />
              <span>3. Raw Internal Government Work-Order Code</span>
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">Simulated backend payload</span>
          </div>
          <input
            type="text"
            value={customRawCode}
            onChange={(e) => setCustomRawCode(e.target.value)}
            className="w-full px-3.5 py-2 font-mono text-xs rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-800"
            placeholder="E.g., WO_CREW_ASPHALT_ROLL_COMPACT"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Nagrik Sandesh reads this cryptic internal code and translates it into warm citizen language.
          </p>
        </div>

        {/* Trigger Button */}
        <div className="pt-2">
          <button
            id="trigger-simulation-btn"
            type="button"
            onClick={handleSimulate}
            disabled={isSimulating || !selectedComplaint}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-sm font-semibold flex items-center justify-center space-x-2 transition-colors shadow-xs cursor-pointer"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Nagrik Sandesh Detecting Delta &amp; Translating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Simulate Status Advance &amp; Trigger Nagrik Sandesh</span>
              </>
            )}
          </button>
        </div>

        {/* Simulation Output Card */}
        {resultMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-3">
            <div className="flex items-center space-x-2 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{resultMessage}</span>
            </div>

            {latestTranslation && (
              <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>Nagrik Sandesh Generated Plain-Language Citizen Update</span>
                </span>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed italic">
                  "{latestTranslation}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
