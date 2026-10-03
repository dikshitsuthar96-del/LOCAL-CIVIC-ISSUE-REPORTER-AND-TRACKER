import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  X,
  User,
  Activity,
  FileText,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Complaint, GovUser } from '../../types.js';

interface GovCheckStatusModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: GovUser;
  onStatusUpdated: (updatedComplaint: Complaint) => void;
}

export const GovCheckStatusModal: React.FC<GovCheckStatusModalProps> = ({
  complaint,
  isOpen,
  onClose,
  currentOfficer,
  onStatusUpdated,
}) => {
  if (!isOpen || !complaint) return null;

  const [progressSummary, setProgressSummary] = useState(
    complaint.lastStatusCheck?.progressSummary ||
      `Field operations active at ${complaint.location}. Repair work proceeding as scheduled.`
  );
  const [actionTaken, setActionTaken] = useState(
    complaint.lastStatusCheck?.actionTaken ||
      'Visual on-site inspection conducted, asphalt compaction and leveling underway.'
  );
  const [targetStatus, setTargetStatus] = useState<string>(complaint.status);
  const [assignedCrew, setAssignedCrew] = useState<string>(
    complaint.assignedCrew || `${currentOfficer.departmentName} Maintenance Crew`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/gov/complaints/${complaint.id}/check-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
        body: JSON.stringify({
          progressSummary: progressSummary.trim(),
          actionTaken: actionTaken.trim(),
          status: targetStatus,
          assignedCrew: assignedCrew.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update complaint status telemetry.');
      }

      onStatusUpdated(data.complaint);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing status check.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden font-sans text-xs">
        {/* Modal Header */}
        <div className="bg-[#0b2239] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#ea580c] flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Check &amp; Update Live Status Telemetry
              </h2>
              <p className="text-[10px] text-white/70">
                Ticket: {complaint.officialReferenceNumber || complaint.id} • {complaint.departmentName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdateStatus} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Verified Metadata Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 space-y-2">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-bold">Issue: {complaint.title}</span>
              <span className="font-mono text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                Status: {complaint.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Responsible Officer:</span>
                <span className="font-semibold text-slate-800">
                  {complaint.assignedOfficer || currentOfficer.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Last Checked:</span>
                <span className="font-mono text-slate-800">
                  {complaint.lastStatusCheck?.checkedAt
                    ? new Date(complaint.lastStatusCheck.checkedAt).toLocaleTimeString()
                    : 'Just now'}
                </span>
              </div>
            </div>
          </div>

          {/* Latest Progress Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              1. Latest Progress Summary:
            </label>
            <textarea
              rows={2}
              required
              value={progressSummary}
              onChange={(e) => setProgressSummary(e.target.value)}
              placeholder="Detail current physical progress on the ground..."
              className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
            />
          </div>

          {/* Action Taken Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              2. Action Taken by Municipal Crew:
            </label>
            <textarea
              rows={2}
              required
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="Specific intervention taken (e.g. excavation completed, gravel compacted, electrical fuse replaced)..."
              className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] text-slate-500 font-semibold block">
              Quick Observation Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Site Inspected', act: 'Field engineer conducted site inspection; materials allocated.' },
                { label: 'Crew On Site', act: 'Repair truck deployed; safety perimeter cones established.' },
                { label: 'Repairs Underway', act: 'Heavy sawcut & asphalt paving actively in progress.' },
                { label: 'Quality Check', act: 'Civil engineering supervisor conducted durability inspection.' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActionTaken(p.act)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xs text-[10px] font-medium border border-slate-200 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Update Workflow Status */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-800 block">
              3. Advance Workflow Status in Civic Timeline:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'IN_PROGRESS',
                  label: '⚡ In Progress',
                  desc: 'Field crew active on site repairing defect',
                  badgeColor: 'bg-blue-100 text-blue-800',
                },
                {
                  id: 'ASSIGNED',
                  label: '📋 Assigned',
                  desc: 'Dispatched to department maintenance unit',
                  badgeColor: 'bg-amber-100 text-amber-800',
                },
                {
                  id: 'UNDER_REVIEW',
                  label: '🔍 Under Review',
                  desc: 'Site verification or logistics check pending',
                  badgeColor: 'bg-slate-100 text-slate-800',
                },
                {
                  id: 'RESOLVED',
                  label: '✓ Work Completed',
                  desc: 'Physical repair work completed on site',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTargetStatus(opt.id)}
                  className={`p-2 rounded border text-left cursor-pointer transition-all ${
                    targetStatus === opt.id
                      ? 'bg-[#0b2239] text-white border-[#0b2239] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">{opt.label}</span>
                    {targetStatus === opt.id && (
                      <span className="text-[9px] bg-orange-500 text-white px-1 rounded font-bold">Selected</span>
                    )}
                  </div>
                  <p
                    className={`text-[9px] mt-0.5 leading-tight ${
                      targetStatus === opt.id ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Assigned Crew Input (Visible especially if In Progress) */}
          {targetStatus === 'IN_PROGRESS' && (
            <div className="space-y-1 p-2.5 bg-blue-50/60 rounded border border-blue-200">
              <label className="font-bold text-blue-900 block text-[11px]">
                Active Maintenance Crew Assigned:
              </label>
              <input
                type="text"
                value={assignedCrew}
                onChange={(e) => setAssignedCrew(e.target.value)}
                placeholder="e.g. District 4 Asphalt Maintenance Crew"
                className="w-full p-2 bg-white border border-blue-300 rounded text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
              />
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#0b2239] hover:bg-[#143455] text-white font-bold rounded-sm flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Commit Status Check</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
