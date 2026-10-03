import React, { useState } from 'react';
import {
  Bell,
  Send,
  X,
  Smartphone,
  Mail,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import { Complaint, GovUser } from '../../types.js';

interface GovNotifyCitizenModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: GovUser;
  onNotificationSent: (updatedComplaint: Complaint) => void;
}

export const GovNotifyCitizenModal: React.FC<GovNotifyCitizenModalProps> = ({
  complaint,
  isOpen,
  onClose,
  currentOfficer,
  onNotificationSent,
}) => {
  if (!isOpen || !complaint) return null;

  const [channel, setChannel] = useState<'SMS' | 'PORTAL' | 'EMAIL' | 'MOBILE_APP'>('SMS');
  const [title, setTitle] = useState(`Status Update: Complaint #${complaint.id}`);
  const [message, setMessage] = useState(
    `Namaste ${complaint.submitterName || 'Citizen'}, your civic report for ${complaint.title} at ${complaint.location} is actively in progress with ${complaint.departmentName}.`
  );
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const templates = [
    {
      label: 'Work In Progress Alert',
      title: `Field Crew Active: #${complaint.id}`,
      text: `Municipal field crew and equipment have arrived at ${complaint.location}. Repair works are actively underway.`,
    },
    {
      label: 'SLA Escalation Notice',
      title: `Expedited Review: #${complaint.id}`,
      text: `Your complaint has been escalated to Senior Executive Engineer for expedited resolution under municipal charter.`,
    },
    {
      label: 'Scheduled For Paving',
      title: `Work Scheduled: #${complaint.id}`,
      text: `Material allocation confirmed. Field crew scheduled for physical remediation within current operational window.`,
    },
    {
      label: 'Resolution Proof Ready',
      title: `Work Completed: #${complaint.id}`,
      text: `Remediation completed by ${complaint.departmentName}. Please view before/after photo proof in your citizen portal.`,
    },
  ];

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/gov/complaints/${complaint.id}/notify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
        body: JSON.stringify({
          channel,
          title: title.trim(),
          message: message.trim(),
          recipient:
            channel === 'SMS'
              ? complaint.submitterPhone || '+91 98765-00000'
              : channel === 'EMAIL'
              ? complaint.submitterEmail || 'citizen@citizenmail.org'
              : 'Citizen Portal Device Push',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch citizen notification.');
      }

      onNotificationSent(data.complaint);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error dispatching notification.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden font-sans text-xs">
        {/* Header */}
        <div className="bg-[#0b2239] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xs bg-[#ea580c] flex items-center justify-center text-white font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Dispatch Statutory Notification to Citizen
              </h2>
              <p className="text-[10px] text-white/70">
                Ticket #{complaint.officialReferenceNumber || complaint.id} • Submitter: {complaint.submitterName || 'Citizen'}
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
        <form onSubmit={handleSendNotification} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Citizen Contact Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 flex items-center justify-between text-slate-700">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Citizen Submitter</span>
              <span className="font-bold text-slate-900 text-xs">{complaint.submitterName || 'Registered Resident'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Direct Mobile / SMS</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {complaint.submitterPhone || '+91 98765-43210'}
              </span>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              1. Select Statutory Communication Gateway:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'SMS', label: 'SMS Alert', icon: Smartphone },
                { id: 'PORTAL', label: 'In-App Portal', icon: Globe },
                { id: 'EMAIL', label: 'Gov Email', icon: Mail },
                { id: 'MOBILE_APP', label: 'Push Alert', icon: Bell },
              ].map((ch) => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id as any)}
                    className={`p-2 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      isSelected
                        ? 'border-[#ea580c] bg-orange-50 text-[#ea580c] font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Notice Templates */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold block">
              Quick Notice Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(tmpl.title);
                    setMessage(tmpl.text);
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-900 rounded-xs text-[10px] font-medium border border-slate-200 cursor-pointer"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">2. Notice Title / Subject:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">3. Statutory Dispatch Content:</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
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
              disabled={isSending}
              className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-sm flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
              <span>Dispatch Notification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
