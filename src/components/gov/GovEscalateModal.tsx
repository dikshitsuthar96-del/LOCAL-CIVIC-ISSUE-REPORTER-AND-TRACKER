import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  UserCheck,
  ShieldAlert,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import { Complaint, GovUser } from '../../types.js';

interface GovEscalateModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: GovUser;
  onEscalated: (updatedComplaint: Complaint) => void;
}

export const GovEscalateModal: React.FC<GovEscalateModalProps> = ({
  complaint,
  isOpen,
  onClose,
  currentOfficer,
  onEscalated,
}) => {
  if (!isOpen || !complaint) return null;

  const [escalatedTo, setEscalatedTo] = useState('Senior Executive Engineer & Zonal Commissioner');
  const [escalationReason, setEscalationReason] = useState(
    'Resolution timeline nearing or exceeding SLA benchmark. Escalated for emergency resource allocation and senior oversight.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEscalate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/gov/complaints/${complaint.id}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
        body: JSON.stringify({
          escalatedTo: escalatedTo.trim(),
          escalationReason: escalationReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to escalate complaint.');
      }

      onEscalated(data.complaint);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing escalation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden font-sans text-xs">
        {/* Header */}
        <div className="bg-red-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xs bg-white text-red-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Escalate Grievance to Senior Authority
              </h2>
              <p className="text-[10px] text-white/80">
                Ticket #{complaint.officialReferenceNumber || complaint.id} • {complaint.departmentName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleEscalate} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Status & SLA Warning */}
          <div className="bg-red-50 border border-red-200 rounded-sm p-3 space-y-1 text-red-900">
            <div className="font-bold flex items-center justify-between">
              <span>Current Priority: {complaint.priority}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-red-200 rounded font-bold">
                Escalation Elevates to EMERGENCY
              </span>
            </div>
            <p className="text-[11px] text-red-800">
              SLA Deadline: {complaint.slaDeadline ? new Date(complaint.slaDeadline).toLocaleString() : 'Standard 24h'}
            </p>
          </div>

          {/* Target Authority Selector */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              1. Escalate to Senior Authority:
            </label>
            <select
              value={escalatedTo}
              onChange={(e) => setEscalatedTo(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-red-600"
            >
              <option value="Senior Executive Engineer & Zonal Commissioner">
                Senior Executive Engineer &amp; Zonal Commissioner
              </option>
              <option value="Municipal Commissioner & Head of Civil Infrastructure">
                Municipal Commissioner &amp; Head of Civil Infrastructure
              </option>
              <option value="Special Municipal Vigilance &amp; Quality Audit Wing">
                Special Municipal Vigilance &amp; Quality Audit Wing
              </option>
              <option value="Mayor / Grievance Redressal Taskforce">
                Mayor / Grievance Redressal Taskforce
              </option>
            </select>
          </div>

          {/* Reason Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              2. Reason for Senior Escalation:
            </label>
            <textarea
              rows={3}
              required
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-red-600"
            />
          </div>

          {/* Footer Submit Buttons */}
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
              className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-sm flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              )}
              <span>Authorize Senior Escalation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
