import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Building2,
  Download,
  Printer,
  ChevronDown,
  ArrowLeft,
  X,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
  Maximize2,
  FileCheck,
  Radio,
  Zap,
  RefreshCw,
  PlayCircle,
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types.js';
import { getCivicAfterImage } from '../data/civicImages.js';
import { generateComplaintPDF } from '../utils/pdfGenerator.js';

interface CitizenTrackerProps {
  initialComplaintId?: string | null;
  onNewReport: () => void;
  onOpenGovSimulator: (complaintId?: string) => void;
}

// 6 Linear Status Stages as requested
type SimpleStage = 'Submitted' | 'Assigned' | 'In Progress' | 'Work Completed' | 'Your Confirmation' | 'Resolved';

interface TimelineStep {
  key: SimpleStage;
  title: string;
  explanation: string;
  order: number;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    key: 'Submitted',
    title: 'Submitted',
    explanation: 'Your grievance has been logged in the official municipal system and assigned a reference ID.',
    order: 1,
  },
  {
    key: 'Assigned',
    title: 'Assigned',
    explanation: 'Assigned to the responsible municipal engineering division and local zonal supervisor.',
    order: 2,
  },
  {
    key: 'In Progress',
    title: 'In Progress',
    explanation: 'Maintenance field crew has arrived at the location and repair work is underway.',
    order: 3,
  },
  {
    key: 'Work Completed',
    title: 'Work Completed',
    explanation: 'Physical repair work has been marked finished by the field engineer with certified photographic proof.',
    order: 4,
  },
  {
    key: 'Your Confirmation',
    title: 'Your Confirmation',
    explanation: 'Citizen review: Confirm whether the repairs satisfy the problem before official closure.',
    order: 5,
  },
  {
    key: 'Resolved',
    title: 'Resolved',
    explanation: 'Complaint officially closed and certified in municipal audit records.',
    order: 6,
  },
];

// Helper to determine stage number based on raw ComplaintStatus
function getStageNumber(status: ComplaintStatus, citizenConfirmed?: boolean): number {
  switch (status) {
    case 'FILED':
    case 'UNDER_REVIEW':
      return 1; // Submitted
    case 'VERIFIED':
    case 'ACKNOWLEDGED':
    case 'ASSIGNED':
      return 2; // Assigned
    case 'IN_PROGRESS':
    case 'SCHEDULED':
      return 3; // In Progress
    case 'RESOLVED':
      // If citizen has already confirmed, it's stage 6. If awaiting citizen confirmation, it's stage 5.
      return citizenConfirmed !== undefined ? 6 : 5;
    case 'CLOSED':
      return 6;
    case 'REJECTED':
      return 1;
    default:
      return 1;
  }
}

export const CitizenTracker: React.FC<CitizenTrackerProps> = ({
  initialComplaintId,
  onNewReport,
  onOpenGovSimulator,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialComplaintId || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  // Citizen verification state
  const [citizenRating, setCitizenRating] = useState<number>(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccessMessage, setFeedbackSuccessMessage] = useState<string | null>(null);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [liveStatusToast, setLiveStatusToast] = useState<{
    status: ComplaintStatus;
    message: string;
    timestamp: string;
  } | null>(null);

  // Central handler to apply real-time complaint updates smoothly
  const handleRealtimeComplaintUpdate = (updated: Complaint) => {
    if (!updated || !updated.id) return;

    // Update in recent complaints list if present
    setRecentComplaints((prev) =>
      prev.map((c) =>
        c.id.toLowerCase() === updated.id.toLowerCase() ||
        c.officialReferenceNumber.toLowerCase() === updated.officialReferenceNumber.toLowerCase()
          ? updated
          : c
      )
    );

    // Update current active complaint if it matches
    setComplaint((current) => {
      if (!current) return current;
      const isTarget =
        current.id.toLowerCase() === updated.id.toLowerCase() ||
        current.officialReferenceNumber.toLowerCase() === updated.officialReferenceNumber.toLowerCase();

      if (!isTarget) return current;

      const previousStatus = current.status;
      const currentStage = getStageNumber(current.status, current.citizenConfirmed);
      const newStage = getStageNumber(updated.status, updated.citizenConfirmed);

      if (previousStatus !== updated.status || currentStage !== newStage) {
        setLiveStatusToast({
          status: updated.status,
          message:
            updated.status === 'IN_PROGRESS'
              ? '⚡ Municipal crew dispatched on site. Work marked IN PROGRESS.'
              : updated.status === 'RESOLVED'
              ? '✓ Work completed by municipal crew. Photographic proof dispatched for your review.'
              : `Official municipal status updated to: ${updated.status.replace(/_/g, ' ')}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
        setTimeout(() => {
          setLiveStatusToast(null);
        }, 9000);
      }

      return updated;
    });
  };

  // 1. Multi-tab BroadcastChannel & Window event listeners (0ms local cross-tab latency)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('civic_complaint_channel');
      channel.onmessage = (event) => {
        if (event.data && event.data.complaint) {
          handleRealtimeComplaintUpdate(event.data.complaint);
        }
      };
    } catch (_) {}

    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        handleRealtimeComplaintUpdate(e.detail);
      }
    };
    window.addEventListener('civic:complaint-updated', handleCustomEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('civic:complaint-updated', handleCustomEvent);
    };
  }, []);

  // 2. Server-Sent Events (SSE) live stream from backend
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/complaints/live');
      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.id) {
            handleRealtimeComplaintUpdate(data);
          }
        } catch (_) {}
      };
      eventSource.onerror = () => {
        // SSE will attempt auto-reconnect
      };
    } catch (_) {}

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // 3. Periodic high-frequency polling fallback (every 3.5s while complaint is active)
  useEffect(() => {
    if (!complaint || complaint.status === 'CLOSED') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/complaints/${encodeURIComponent(complaint.id)}`);
        if (res.ok) {
          const fresh = await res.json();
          handleRealtimeComplaintUpdate(fresh);
        }
      } catch (_) {}
    }, 3500);

    return () => clearInterval(interval);
  }, [complaint?.id, complaint?.status, complaint?.officialReferenceNumber]);

  // Load complaints list for quick testing
  useEffect(() => {
    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.complaints || [];
        setRecentComplaints(list.slice(0, 5));
        if (initialComplaintId) {
          const match = list.find(
            (c: Complaint) =>
              c.id.toLowerCase() === initialComplaintId.toLowerCase() ||
              c.officialReferenceNumber.toLowerCase() === initialComplaintId.toLowerCase()
          );
          if (match) {
            setComplaint(match);
          } else {
            handleLookup(initialComplaintId);
          }
        } else if (list.length > 0 && !complaint) {
          setComplaint(list[0]);
          setSearchQuery(list[0].id);
        }
      })
      .catch((err) => console.error('Error loading complaints for tracker:', err));
  }, [initialComplaintId]);

  const handleLookup = async (idToSearch?: string) => {
    const id = (idToSearch || searchQuery).trim();
    if (!id) {
      setError('Please enter a Complaint ID or Reference Number.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(id)}`);
      if (!res.ok) {
        throw new Error(`No complaint found with Reference ID "${id}". Please check the number.`);
      }
      const data = await res.json();
      setComplaint(data);
      setSearchQuery(data.id);
    } catch (err: any) {
      setError(err.message || 'Could not retrieve complaint status');
      setComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCitizenVerification = async (decision: 'ACCEPTED' | 'REJECTED') => {
    if (!complaint) return;
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(complaint.id)}/citizen-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenFeedback: decision,
          rating: decision === 'ACCEPTED' ? citizenRating : 1,
          notes:
            feedbackNotes.trim() ||
            (decision === 'ACCEPTED'
              ? 'Work has been completed. Citizen verified and approved resolution.'
              : 'Citizen reported defect is still not resolved. Re-inspection requested.'),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit verification');
      setComplaint(data.complaint);
      setFeedbackSuccessMessage(
        decision === 'ACCEPTED'
          ? 'Thank you! Your verification has been recorded and the complaint is officially resolved.'
          : 'Re-inspection request recorded. The municipal supervisor has been alerted.'
      );
      setIsDisputeOpen(false);
      setFeedbackNotes('');
      setTimeout(() => setFeedbackSuccessMessage(null), 7000);
    } catch (err: any) {
      alert(err.message || 'Error submitting feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const currentStageNumber = complaint ? getStageNumber(complaint.status, complaint.citizenConfirmed) : 1;
  const isWorkCompletedOrLater = currentStageNumber >= 4;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* SEARCH / LOOKUP BAR                                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-md border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#0b2239]">Track Complaint Status</h2>
            <p className="text-xs text-slate-600">
              Enter your complaint reference number to check the current stage and field progress.
            </p>
          </div>
          <button
            type="button"
            onClick={onNewReport}
            className="text-xs font-bold text-[#ea580c] hover:underline flex items-center space-x-1"
          >
            <span>+ Report a New Issue</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex flex-col sm:flex-row gap-2.5 mt-4"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="citizen-tracking-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Complaint ID (e.g., CIVIC-2026-1042 or MET-CIVIC-...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-[#0b2239] focus:ring-1 focus:ring-[#0b2239]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#0b2239] hover:bg-[#143455] text-white rounded-sm text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Searching...' : 'Track Complaint'}</span>
          </button>
        </form>

        {/* Quick Demo Selector */}
        {recentComplaints.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">Quick Select:</span>
            {recentComplaints.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchQuery(c.id);
                  handleLookup(c.id);
                }}
                className={`px-2.5 py-1 rounded-sm text-xs font-mono transition-all cursor-pointer border ${
                  complaint?.id === c.id
                    ? 'bg-blue-50 border-[#0b2239] text-[#0b2239] font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Complaint Not Found</p>
            <p className="text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Live Status Toast Banner */}
      {liveStatusToast && (
        <div className="p-3.5 bg-gradient-to-r from-[#0b2239] via-blue-900 to-[#ea580c] text-white rounded-md text-xs font-semibold shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <span className="p-1 bg-white/20 rounded-full">
              <Zap className="w-4 h-4 text-yellow-300 shrink-0" />
            </span>
            <div>
              <span className="font-bold">{liveStatusToast.message}</span>
              <span className="text-white/80 block text-[10px]">Synchronized at {liveStatusToast.timestamp}</span>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 border border-white/30 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider shrink-0">
            Live Stream Active
          </span>
        </div>
      )}

      {/* Success Notification Banner */}
      {feedbackSuccessMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-md text-xs font-medium shadow-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedbackSuccessMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COMPLAINT DETAILS SUMMARY                                     */}
      {/* ------------------------------------------------------------- */}
      {complaint && (
        <div className="space-y-6">
          <div className="bg-white rounded-md border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  <span>Registered Grievance</span>
                  <span>•</span>
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Real-Time Live Sync</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0b2239]">{complaint.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-xs text-slate-600">
                  <span className="font-bold text-[#0b2239] bg-slate-100 px-2 py-0.5 rounded-sm">
                    ID: {complaint.officialReferenceNumber || complaint.id}
                  </span>
                  <span>•</span>
                  <span>Dept: {complaint.departmentName || complaint.departmentId}</span>
                </div>
              </div>

              {/* Action Buttons: PDF, Print, and Manual Refresh */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleLookup()}
                  disabled={isLoading}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
                  title="Check for newest government updates"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#ea580c]' : 'text-slate-600'}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => generateComplaintPDF(complaint)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-sm text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                  title="Download official PDF acknowledgment"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Print official receipt"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold">Location</span>
                <span className="text-slate-900 font-semibold flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                  <span className="truncate">{complaint.location}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold">Registered Contact</span>
                <span className="text-slate-900 font-mono font-semibold flex items-center space-x-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{complaint.submitterPhone || 'Not recorded'}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-bold">Current Stage</span>
                <span className="font-bold text-[#0b2239] mt-0.5 block">
                  {TIMELINE_STEPS[Math.min(currentStageNumber - 1, 5)].title}
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SIMPLE TIMELINE (SUBMITTED -> ASSIGNED -> IN PROGRESS ->       */}
          {/* WORK COMPLETED -> YOUR CONFIRMATION -> RESOLVED)               */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0b2239] pb-4 border-b border-slate-100 mb-6">
              Resolution Progress Timeline
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {TIMELINE_STEPS.map((step) => {
                const isPassed = currentStageNumber > step.order;
                const isCurrent = currentStageNumber === step.order;
                const isUpcoming = currentStageNumber < step.order;

                return (
                  <div key={step.key} className="relative group">
                    {/* Node Dot / Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-[#0b2239] text-white ring-4 ring-orange-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{step.order}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-[#0b2239]'
                              : isPassed
                              ? 'text-emerald-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold text-[10px] uppercase">
                            Current Stage
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs leading-relaxed ${
                          isUpcoming ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {step.explanation}
                      </p>

                      {/* Real-time Field Telemetry for In Progress stage */}
                      {step.key === 'In Progress' && (isCurrent || isPassed) && (
                        <div className="mt-3 p-3.5 rounded-md bg-blue-50/80 border border-blue-200 text-xs space-y-2">
                          <div className="flex items-center justify-between text-blue-900 font-bold">
                            <span className="flex items-center space-x-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                              <span>Live Municipal Field Operations:</span>
                            </span>
                            {complaint.assignedCrew ? (
                              <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-mono font-bold">
                                {complaint.assignedCrew}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-mono font-bold">
                                Rapid Maintenance Crew Deployed
                              </span>
                            )}
                          </div>

                          {complaint.lastStatusCheck ? (
                            <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded border border-blue-100 space-y-1 shadow-2xs">
                              <p className="font-semibold text-slate-800">
                                <span className="text-blue-900 font-bold">Progress Verified: </span>
                                {complaint.lastStatusCheck.progressSummary}
                              </p>
                              <p className="text-slate-600">
                                <span className="text-slate-800 font-bold">Action Taken: </span>
                                {complaint.lastStatusCheck.actionTaken}
                              </p>
                              <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-100">
                                <span>Site Inspector: {complaint.lastStatusCheck.checkedBy}</span>
                                <span>{new Date(complaint.lastStatusCheck.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-blue-800 italic">
                              Repair truck and crew actively deployed to location. Safety perimeter and remediation underway.
                            </p>
                          )}
                        </div>
                      )}

                      {/* ------------------------------------------------------------- */}
                      {/* WHEN GOVERNMENT MARKS WORK COMPLETED: CITIZEN VERIFICATION     */}
                      {/* ------------------------------------------------------------- */}
                      {step.key === 'Your Confirmation' && isWorkCompletedOrLater && (
                        <div className="mt-4 p-4 rounded-md border-2 border-[#ea580c]/30 bg-orange-50/40 space-y-4">
                          <div className="space-y-1">
                            <h5 className="text-sm font-extrabold text-[#0b2239]">
                              "Work has been completed. Please verify."
                            </h5>
                            <p className="text-xs text-slate-600">
                              Please review the official photo of the completed repair taken by the field crew.
                            </p>
                          </div>

                          {/* Side-by-side Before and After Photo */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded border border-slate-300 overflow-hidden bg-slate-900">
                              <img
                                src={complaint.photoUrl}
                                alt="Original Issue (Before)"
                                className="w-full h-44 object-cover"
                              />
                              <div className="p-2 bg-slate-900 text-white text-[11px] font-bold flex justify-between items-center">
                                <span>Reported Defect (Before)</span>
                              </div>
                            </div>

                            <div className="rounded border-2 border-emerald-500 overflow-hidden bg-slate-900">
                              <img
                                src={
                                  complaint.proofOfWork?.afterPhotoUrl ||
                                  complaint.resolutionPhotoUrl ||
                                  getCivicAfterImage(complaint.issueType)
                                }
                                alt="Work Done (After)"
                                className="w-full h-44 object-cover cursor-pointer"
                                onClick={() => setIsProofModalOpen(true)}
                              />
                              <div className="p-2 bg-emerald-700 text-white text-[11px] font-bold flex justify-between items-center">
                                <span className="flex items-center space-x-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Picture of Completed Work (After)</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsProofModalOpen(true)}
                                  className="text-[10px] text-emerald-200 underline"
                                >
                                  View Full
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Citizen Decision: If already verified */}
                          {complaint.citizenConfirmed !== undefined ? (
                            <div className="p-3 bg-white rounded-sm border border-emerald-300 text-xs flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {complaint.citizenConfirmed ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="font-bold text-emerald-950">
                                      You verified and accepted this resolution. (Rating: {complaint.citizenRating || 5}/5 Stars)
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    <span className="font-bold text-amber-950">
                                      Re-inspection requested by citizen. Case escalated for supervisor inspection.
                                    </span>
                                  </>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">RECORDED</span>
                            </div>
                          ) : (
                            /* Verification Buttons */
                            <div className="space-y-3 pt-2">
                              {/* Rating Stars */}
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-[#0b2239]">Your Rating:</span>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setCitizenRating(star)}
                                      className="p-0.5 hover:scale-115 transition-transform cursor-pointer"
                                    >
                                      <Star
                                        className={`w-4 h-4 ${
                                          star <= citizenRating
                                            ? 'fill-amber-400 text-amber-500'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {isDisputeOpen && (
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-rose-900 block">
                                    Why is the issue still not resolved?
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={feedbackNotes}
                                    onChange={(e) => setFeedbackNotes(e.target.value)}
                                    placeholder="Please explain what is missing or unsatisfactory (e.g. debris remains, light still not turning on)..."
                                    className="w-full text-xs p-2.5 rounded-sm border border-rose-300 text-slate-900 focus:outline-hidden"
                                  />
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-3">
                                <button
                                  type="button"
                                  disabled={isSubmittingFeedback}
                                  onClick={() => submitCitizenVerification('ACCEPTED')}
                                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-sm shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Yes, Issue Resolved</span>
                                </button>

                                {!isDisputeOpen ? (
                                  <button
                                    type="button"
                                    disabled={isSubmittingFeedback}
                                    onClick={() => setIsDisputeOpen(true)}
                                    className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs rounded-sm transition-colors cursor-pointer"
                                  >
                                    <span>No, Still Not Resolved</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isSubmittingFeedback}
                                    onClick={() => submitCitizenVerification('REJECTED')}
                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-sm shadow-xs transition-colors cursor-pointer"
                                  >
                                    <span>Submit Re-inspection Request</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Full Resolution Photo */}
      {isProofModalOpen && complaint && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-2xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-sm text-[#0b2239]">Certified Work Completion Picture</span>
              <button
                type="button"
                onClick={() => setIsProofModalOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={
                complaint.proofOfWork?.afterPhotoUrl ||
                complaint.resolutionPhotoUrl ||
                getCivicAfterImage(complaint.issueType)
              }
              alt="Full Resolution Proof"
              className="w-full max-h-[70vh] object-contain rounded bg-slate-900"
            />
          </div>
        </div>
      )}
    </div>
  );
};
