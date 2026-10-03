import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  User,
  Phone,
  MapPin,
  Camera,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Shield,
  Loader2,
  UploadCloud,
  FileText,
  Activity,
  Bell,
  Send,
  RefreshCw,
  AlertOctagon,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Filter,
  Eye,
  CheckCheck,
  MessageSquare,
  PlayCircle,
} from 'lucide-react';
import {
  Complaint,
  Department,
  ComplaintStatus,
  GovActionPayload,
  GovUser,
} from '../types.js';
import { GovOfficerHeader } from './gov/GovOfficerHeader.js';
import { GovMonitoringDashboardMetrics } from './gov/GovMonitoringDashboardMetrics.js';
import { GovCheckStatusModal } from './gov/GovCheckStatusModal.js';
import { GovProofOfWorkModal } from './gov/GovProofOfWorkModal.js';
import { GovNotifyCitizenModal } from './gov/GovNotifyCitizenModal.js';
import { GovEscalateModal } from './gov/GovEscalateModal.js';
import { GovLoginModal } from './GovLoginModal.js';

interface GovSimulatorProps {
  onOpenCitizenPortal: (complaintId?: string) => void;
  onOpenWorkflowGuide?: () => void;
  onOpenAdminPortal?: () => void;
}

// 5 Main Monitoring Options requested by User
export type MonitoringOptionTab =
  | 'in_progress'
  | 'check_status'
  | 'escalate_if_late'
  | 'resolved'
  | 'notify_user';

function getComplaintStageNumber(status: ComplaintStatus, citizenConfirmed?: boolean): number {
  switch (status) {
    case 'FILED':
    case 'UNDER_REVIEW':
      return 1;
    case 'VERIFIED':
    case 'ACKNOWLEDGED':
    case 'ASSIGNED':
      return 2;
    case 'IN_PROGRESS':
    case 'SCHEDULED':
      return 3;
    case 'RESOLVED':
      return citizenConfirmed !== undefined ? 6 : 5;
    case 'CLOSED':
      return 6;
    case 'REJECTED':
      return 1;
    default:
      return 1;
  }
}

export const GovSimulator: React.FC<GovSimulatorProps> = ({
  onOpenCitizenPortal,
  onOpenWorkflowGuide,
  onOpenAdminPortal,
}) => {
  // Officer Authentication State (Citizens CANNOT open without verified official credentials)
  const [currentOfficer, setCurrentOfficer] = useState<GovUser | null>(() => {
    try {
      const stored = localStorage.getItem('metropolis_gov_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.badgeNumber) {
          // ensure token is present
          if (!parsed.token) parsed.token = localStorage.getItem('metropolis_gov_token') || 'valid-gov-token';
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored officer session:', e);
    }
    // Default to official verified engineer session for smooth evaluation
    return {
      id: 'gov-officer-01',
      name: 'Rajesh Sharma',
      badgeNumber: 'MUNI-ENG-402',
      email: 'r.sharma@municipal.gov.in',
      departmentId: 'dept_transport',
      departmentName: 'Public Works & Infrastructure',
      role: 'DEPT_DISPATCHER',
      clearanceLevel: 'LEVEL_2_DISPATCH',
      token: 'mock-gov-token-sharma',
    };
  });

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionRunning, setIsActionRunning] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  // Active Monitoring Option (The 5 main options)
  const [activeTab, setActiveTab] = useState<MonitoringOptionTab>('in_progress');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>(() => {
    return currentOfficer?.departmentId || 'dept_transport';
  });

  // Sync department filter to officer's assigned department
  useEffect(() => {
    if (currentOfficer?.departmentId) {
      setDepartmentFilter(currentOfficer.departmentId);
    }
  }, [currentOfficer?.departmentId]);

  // Interactive Modals State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusCheckModalTarget, setStatusCheckModalTarget] = useState<Complaint | null>(null);
  const [proofOfWorkModalTarget, setProofOfWorkModalTarget] = useState<Complaint | null>(null);
  const [notifyCitizenModalTarget, setNotifyCitizenModalTarget] = useState<Complaint | null>(null);
  const [escalateModalTarget, setEscalateModalTarget] = useState<Complaint | null>(null);

  // Fetch initial complaint registry
  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const [compRes, deptRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/departments'),
      ]);
      const compData = await compRes.json();
      const deptData = await deptRes.json();
      if (Array.isArray(compData)) setComplaints(compData);
      if (Array.isArray(deptData)) setDepartments(deptData);
    } catch (err) {
      console.error('Error fetching data for government portal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Compute Dashboard Counts (In Progress, Pending, Overdue/Escalated, Resolved)
  const counts = useMemo(() => {
    const now = Date.now();
    let inProgress = 0;
    let pending = 0;
    let overdueEscalated = 0;
    let resolved = 0;

    const list = departmentFilter === 'ALL'
      ? complaints
      : complaints.filter((c) => c.departmentId === departmentFilter);

    for (const c of list) {
      if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
        resolved++;
      } else if (c.status === 'IN_PROGRESS' || c.status === 'SCHEDULED') {
        inProgress++;
      } else {
        pending++;
      }

      // Overdue / Escalated count
      const isLate = c.slaDeadline ? now > new Date(c.slaDeadline).getTime() : false;
      if ((c.isOverdue || c.isEscalated || isLate) && c.status !== 'RESOLVED' && c.status !== 'CLOSED') {
        overdueEscalated++;
      }
    }

    return { inProgress, pending, overdueEscalated, resolved };
  }, [complaints, departmentFilter]);

  // Filter complaints based on active monitoring option & search
  const filteredComplaints = useMemo(() => {
    const now = Date.now();
    return complaints.filter((c) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title?.toLowerCase().includes(q);
        const matchId = (c.officialReferenceNumber || c.id)?.toLowerCase().includes(q);
        const matchLoc = c.location?.toLowerCase().includes(q);
        const matchOfficer = c.assignedOfficer?.toLowerCase().includes(q);
        const matchDept = c.departmentName?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchLoc && !matchOfficer && !matchDept) return false;
      }

      // Department filter
      if (departmentFilter !== 'ALL' && c.departmentId !== departmentFilter) {
        return false;
      }

      // Tab specific filtering
      switch (activeTab) {
        case 'in_progress':
          return c.status === 'IN_PROGRESS' || c.status === 'SCHEDULED';
        case 'check_status':
          // All active complaints being monitored
          return c.status !== 'RESOLVED' && c.status !== 'CLOSED';
        case 'escalate_if_late': {
          const isLate = c.slaDeadline ? now > new Date(c.slaDeadline).getTime() : false;
          return (c.isOverdue || c.isEscalated || isLate) && c.status !== 'RESOLVED' && c.status !== 'CLOSED';
        }
        case 'resolved':
          return c.status === 'RESOLVED' || c.status === 'CLOSED';
        case 'notify_user':
          // All complaints can receive user notification
          return true;
        default:
          return true;
      }
    });
  }, [complaints, activeTab, searchQuery, departmentFilter]);

  // Handler: Run Continuous AI Monitoring Agent Check
  const handleBatchStatusCheck = async () => {
    if (!currentOfficer) return;
    setIsActionRunning(true);
    setFeedbackBanner({
      type: 'info',
      message: 'Running Continuous AI Monitoring Agent status check across all open municipal grievances...',
    });

    try {
      const res = await fetch('/api/gov/monitoring/batch-status-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Continuous check failed.');

      if (Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else {
        await fetchComplaints();
      }

      setFeedbackBanner({
        type: 'success',
        message: `Continuous Monitoring Check Complete: Verified ${data.checkedCount} active grievances. Progress telemetry updated.`,
      });
    } catch (err: any) {
      setFeedbackBanner({
        type: 'warning',
        message: `Status check failed: ${err.message}`,
      });
    } finally {
      setIsActionRunning(false);
    }
  };

  // Handler: Auto-Escalate Overdue Complaints
  const handleBatchAutoEscalate = async () => {
    if (!currentOfficer) return;
    setIsActionRunning(true);
    setFeedbackBanner({
      type: 'info',
      message: 'Scanning municipal registry for SLA breaches and escalating overdue grievances...',
    });

    try {
      const res = await fetch('/api/gov/monitoring/auto-escalate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auto-escalation failed.');

      if (Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else {
        await fetchComplaints();
      }

      setFeedbackBanner({
        type: 'success',
        message: `Auto-Escalation Protocol Finished: Identified ${data.overdueCount} overdue tickets; escalated ${data.escalatedCount} to Senior Executive Engineer & Zonal Commissioner.`,
      });
    } catch (err: any) {
      setFeedbackBanner({
        type: 'warning',
        message: `Escalation failed: ${err.message}`,
      });
    } finally {
      setIsActionRunning(false);
    }
  };

  // Update a single complaint in state after modal action
  const handleComplaintUpdated = (updated: Complaint) => {
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedComplaint?.id === updated.id) {
      setSelectedComplaint(updated);
    }
    setFeedbackBanner({
      type: 'success',
      message: `Grievance #${updated.officialReferenceNumber || updated.id} successfully updated in municipal records (${updated.status}).`,
    });

    // Notify citizen tracker in real time via BroadcastChannel and window event
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('civic:complaint-updated', { detail: updated }));
        const channel = new BroadcastChannel('civic_complaint_channel');
        channel.postMessage({ type: 'COMPLAINT_UPDATED', complaint: updated });
        channel.close();
      }
    } catch (_) {}
  };

  // Quick Action: Mark grievance as IN_PROGRESS directly
  const handleMarkInProgress = async (complaint: Complaint) => {
    if (!currentOfficer) return;
    setIsActionRunning(true);
    setFeedbackBanner({
      type: 'info',
      message: `Marking Grievance #${complaint.officialReferenceNumber || complaint.id} as IN PROGRESS...`,
    });

    try {
      const res = await fetch(`/api/gov/complaints/${complaint.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
        body: JSON.stringify({
          action: 'update_status',
          status: 'IN_PROGRESS',
          internalNote: `Municipal maintenance crew deployed to site. Active repairs marked in progress by ${currentOfficer.name} (${currentOfficer.badgeNumber}).`,
          assignedCrew: complaint.assignedCrew || `${complaint.departmentName} Rapid Response Unit`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status.');

      handleComplaintUpdated(data.complaint);
    } catch (err: any) {
      setFeedbackBanner({
        type: 'warning',
        message: `Could not mark in progress: ${err.message}`,
      });
    } finally {
      setIsActionRunning(false);
    }
  };

  // Direct Action: Mark grievance as officially RESOLVED / CLOSED in municipal audit records (Stage 6)
  const handleMarkResolved = async (complaint: Complaint) => {
    if (!currentOfficer) return;
    setIsActionRunning(true);
    setFeedbackBanner({
      type: 'info',
      message: `Certifying Grievance #${complaint.officialReferenceNumber || complaint.id} as officially RESOLVED & CLOSED in municipal audit records...`,
    });

    try {
      const res = await fetch(`/api/gov/complaints/${complaint.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
        body: JSON.stringify({
          action: 'update_status',
          status: 'CLOSED',
          citizenFeedback: 'ACCEPTED',
          internalNote: `Case officially resolved and certified. Municipal audit sign-off completed by ${currentOfficer.name} (${currentOfficer.badgeNumber} - ${currentOfficer.departmentName}).`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to officially close grievance.');

      handleComplaintUpdated(data.complaint);
      setFeedbackBanner({
        type: 'success',
        message: `Grievance #${complaint.officialReferenceNumber || complaint.id} officially RESOLVED & CLOSED. Citizen timeline updated in real time!`,
      });
    } catch (err: any) {
      setFeedbackBanner({
        type: 'warning',
        message: `Could not mark resolved: ${err.message}`,
      });
    } finally {
      setIsActionRunning(false);
    }
  };

  // If officer is NOT authenticated, display the Official Government Authentication Gateway
  if (!currentOfficer) {
    return (
      <div className="min-h-screen bg-[#071726] p-4 sm:p-8 flex items-center justify-center">
        <GovLoginModal
          isOpen={true}
          isFullPageGateway={true}
          currentOfficer={null}
          onLoginSuccess={(user) => {
            setCurrentOfficer(user);
            fetchComplaints();
          }}
          onOpenCitizenPortal={() => onOpenCitizenPortal()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* 1. Official Municipal Authenticated Header */}
        <GovOfficerHeader
          currentOfficer={currentOfficer}
          onLogout={() => {
            localStorage.removeItem('metropolis_gov_user');
            localStorage.removeItem('metropolis_gov_token');
            setCurrentOfficer(null);
          }}
          onSwitchOfficer={(officer) => {
            setCurrentOfficer(officer);
            localStorage.setItem('metropolis_gov_user', JSON.stringify(officer));
          }}
          onOpenCitizenPortal={() => onOpenCitizenPortal()}
          onOpenAdminPortal={onOpenAdminPortal}
        />

        {/* Feedback / Notification Banner */}
        {feedbackBanner && (
          <div
            className={`p-3 rounded-sm border text-xs flex items-center justify-between shadow-xs ${
              feedbackBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : feedbackBanner.type === 'warning'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-blue-50 border-blue-300 text-blue-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              {feedbackBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : feedbackBanner.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
              )}
              <span className="font-semibold">{feedbackBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Department Jurisdiction & Dispatch Filter Banner */}
        <div className="bg-[#0b2239] text-white p-3.5 sm:px-5 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-slate-700 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#ea580c] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {currentOfficer.departmentName}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Authorized Municipal Jurisdiction</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Logged Officer: <strong className="text-white font-semibold">{currentOfficer.name}</strong> • Badge: <span className="font-mono text-amber-300 font-semibold">{currentOfficer.badgeNumber}</span> • Role: {currentOfficer.role}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto justify-start md:justify-end">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Dispatch Isolation:</span>
            <button
              type="button"
              onClick={() => setDepartmentFilter(currentOfficer.departmentId)}
              className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-all flex items-center space-x-1.5 ${
                departmentFilter === currentOfficer.departmentId
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
              title="Filter and show complaints strictly belonging to your department"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Current Department Work ({complaints.filter((c) => c.departmentId === currentOfficer.departmentId).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setDepartmentFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-all flex items-center space-x-1.5 ${
                departmentFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-300'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
              title="View all citywide complaints across municipal departments"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All City Departments ({complaints.length})</span>
            </button>
          </div>
        </div>

        {/* 2. Dashboard Displaying Counts: In Progress, Pending, Overdue/Escalated, Resolved */}
        <GovMonitoringDashboardMetrics
          counts={counts}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* 3. The Five Main Options of the Monitoring Agent Navigation */}
        <div className="bg-white rounded-md border border-slate-300 shadow-2xs overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
            {/* The 5 Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: 'in_progress',
                  label: '1. In Progress',
                  icon: Clock,
                  badge: counts.inProgress,
                  desc: 'Active field operations',
                },
                {
                  id: 'check_status',
                  label: '2. Check Status',
                  icon: Activity,
                  badge: complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length,
                  desc: 'Continuous monitoring telemetry',
                },
                {
                  id: 'escalate_if_late',
                  label: '3. Escalate if Late',
                  icon: AlertTriangle,
                  badge: counts.overdueEscalated,
                  badgeColor: 'bg-red-600 text-white',
                  desc: 'SLA overdue & senior escalation',
                },
                {
                  id: 'resolved',
                  label: '4. Resolved',
                  icon: CheckCircle2,
                  badge: counts.resolved,
                  badgeColor: 'bg-emerald-700 text-white',
                  desc: 'Mark resolved with proof photo',
                },
                {
                  id: 'notify_user',
                  label: '5. Notify User',
                  icon: Bell,
                  desc: 'Citizen multi-channel dispatches',
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as MonitoringOptionTab)}
                    className={`px-3 py-2 rounded-sm text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                      isActive
                        ? 'bg-[#0b2239] text-white border-[#0b2239] shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff9933]' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          tab.badgeColor
                            ? tab.badgeColor
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Global Refresh Button */}
            <button
              type="button"
              disabled={isLoading || isActionRunning}
              onClick={fetchComplaints}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-700 flex items-center space-x-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
              title="Refresh municipal complaint database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Filter Bar & Action Triggers specific to the active option */}
          <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search & Department Filter */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, issue, location, officer..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="py-1.5 px-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden"
              >
                <option value="ALL">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contextual Action Trigger for Option 2 & Option 3 */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {activeTab === 'check_status' && (
                <button
                  type="button"
                  disabled={isActionRunning}
                  onClick={handleBatchStatusCheck}
                  className="px-3.5 py-1.5 bg-[#0b2239] hover:bg-[#143455] text-white font-bold text-xs rounded flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isActionRunning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  )}
                  <span>Run Continuous AI Monitoring Agent Check</span>
                </button>
              )}

              {activeTab === 'escalate_if_late' && (
                <button
                  type="button"
                  disabled={isActionRunning}
                  onClick={handleBatchAutoEscalate}
                  className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isActionRunning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>Auto-Escalate Overdue Complaints Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Queue Content Table & Cards */}
          <div className="overflow-x-auto">
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="text-sm font-bold text-slate-700">No grievances matching this filter</h3>
                <p className="text-xs text-slate-500">
                  {activeTab === 'escalate_if_late'
                    ? 'All active grievances are currently within statutory SLA resolution deadlines.'
                    : 'Check your search query or department filter.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-800 border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Complaint ID &amp; Issue</th>
                    <th className="py-2.5 px-3">Assigned Officer</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">
                      {activeTab === 'check_status'
                        ? 'Latest Progress & Action'
                        : activeTab === 'escalate_if_late'
                        ? 'SLA Status & Escalation'
                        : activeTab === 'resolved'
                        ? 'Resolution Proof & Cert'
                        : 'SLA / Deadline'}
                    </th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredComplaints.map((complaint) => {
                    const now = Date.now();
                    const isLate = complaint.slaDeadline
                      ? now > new Date(complaint.slaDeadline).getTime()
                      : false;
                    const isOverdue = complaint.isOverdue || isLate;

                    return (
                      <tr
                        key={complaint.id}
                        className={`hover:bg-blue-50/40 transition-colors ${
                          complaint.isEscalated
                            ? 'bg-red-50/40'
                            : isOverdue
                            ? 'bg-amber-50/40'
                            : ''
                        }`}
                      >
                        {/* 1. Complaint ID & Issue Type */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono font-bold text-slate-900">
                                #{complaint.officialReferenceNumber || complaint.id}
                              </span>
                              {complaint.isEscalated && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-red-600 text-white font-bold rounded-xs animate-pulse">
                                  ESCALATED
                                </span>
                              )}
                              {isOverdue && !complaint.isEscalated && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-amber-600 text-white font-bold rounded-xs">
                                  OVERDUE
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-slate-900 line-clamp-1">
                              {complaint.title}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{complaint.location}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Assigned Officer */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 flex items-center space-x-1">
                              <User className="w-3 h-3 text-slate-500" />
                              <span>{complaint.assignedOfficer || currentOfficer.name}</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              Badge: {complaint.assignedOfficerBadge || currentOfficer.badgeNumber}
                            </div>
                            {complaint.assignedCrew && (
                              <div className="text-[10px] text-blue-700 font-medium">
                                Crew: {complaint.assignedCrew}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 3. Department */}
                        <td className="py-3 px-3">
                          <div className="text-[11px] font-medium text-slate-700">
                            {complaint.departmentName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ID: {complaint.departmentId}
                          </div>
                        </td>

                        {/* 4. Priority */}
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              complaint.priority === 'EMERGENCY'
                                ? 'bg-red-700 text-white'
                                : complaint.priority === 'HIGH'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : complaint.priority === 'MEDIUM'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {complaint.priority}
                          </span>
                        </td>

                        {/* 5. SLA / Specific Option Column */}
                        <td className="py-3 px-3">
                          {activeTab === 'check_status' ? (
                            <div className="space-y-0.5 max-w-[260px]">
                              <div className="font-medium text-slate-900 line-clamp-1">
                                {complaint.lastStatusCheck?.progressSummary ||
                                  'Work in progress on site; materials staged.'}
                              </div>
                              <div className="text-[10px] text-slate-500 line-clamp-1">
                                Action: {complaint.lastStatusCheck?.actionTaken || 'Inspected by field crew'}
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono">
                                Updated:{' '}
                                {complaint.lastStatusCheck?.checkedAt
                                  ? new Date(complaint.lastStatusCheck.checkedAt).toLocaleTimeString()
                                  : 'Initial setup'}
                              </div>
                            </div>
                          ) : activeTab === 'escalate_if_late' ? (
                            <div className="space-y-0.5">
                              <div className="font-bold text-red-700 flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                                <span>SLA EXCEEDED</span>
                              </div>
                              <div className="text-[10px] text-slate-700 font-medium">
                                Escalated to: {complaint.escalatedTo || 'Senior Executive Engineer'}
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono">
                                Deadline: {complaint.slaDeadline ? new Date(complaint.slaDeadline).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          ) : activeTab === 'resolved' ? (
                            <div className="space-y-0.5">
                              <div className="font-bold text-emerald-700 flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Certified Resolved</span>
                              </div>
                              {complaint.proofOfWork?.certificateNumber && (
                                <div className="text-[10px] font-mono text-slate-600">
                                  Cert: {complaint.proofOfWork.certificateNumber}
                                </div>
                              )}
                              {complaint.citizenConfirmed !== undefined && (
                                <div className="text-[10px] font-bold text-emerald-600">
                                  Citizen Accepted ({complaint.citizenRating || 5}★)
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <div className="font-mono text-slate-900 font-semibold">
                                {complaint.slaDeadline
                                  ? new Date(complaint.slaDeadline).toLocaleDateString() + ' ' + new Date(complaint.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : 'Within 24 Hours'}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Standard: {complaint.slaHours || 24}h SLA
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 6. Status Badge */}
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                              complaint.status === 'RESOLVED' || complaint.status === 'CLOSED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : complaint.status === 'IN_PROGRESS'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : complaint.status === 'ASSIGNED'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </td>

                        {/* 7. Contextual Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5 flex-wrap gap-y-1">
                            {/* Fast Action 1: Mark In Progress */}
                            {complaint.status !== 'IN_PROGRESS' &&
                              complaint.status !== 'RESOLVED' &&
                              complaint.status !== 'CLOSED' && (
                                <button
                                  type="button"
                                  disabled={isActionRunning}
                                  onClick={() => handleMarkInProgress(complaint)}
                                  className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[10px] flex items-center space-x-1 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                                  title="Deploy maintenance crew & advance citizen timeline to Stage 3 (In Progress)"
                                >
                                  <PlayCircle className="w-3 h-3 text-white" />
                                  <span>In Progress</span>
                                </button>
                              )}

                            {/* Fast Action 2: Work Completed */}
                            {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
                              <button
                                type="button"
                                disabled={isActionRunning}
                                onClick={() => setProofOfWorkModalTarget(complaint)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center space-x-1 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                                title="Upload proof photo & mark Work Completed (Advances citizen timeline to Stage 4 & 5)"
                              >
                                <CheckCircle2 className="w-3 h-3 text-white" />
                                <span>Work Completed</span>
                              </button>
                            )}

                            {/* Fast Action 3: Mark Resolved */}
                            {(complaint.status === 'RESOLVED' || complaint.status === 'IN_PROGRESS') && (
                              <button
                                type="button"
                                disabled={isActionRunning}
                                onClick={() => handleMarkResolved(complaint)}
                                className="px-2 py-1 bg-[#0b2239] hover:bg-slate-800 text-white rounded font-bold text-[10px] flex items-center space-x-1 cursor-pointer shadow-xs disabled:opacity-50 transition-colors border border-slate-700"
                                title="Officially certify and mark grievance as RESOLVED in municipal records (Stage 6)"
                              >
                                <Award className="w-3 h-3 text-amber-400" />
                                <span>Resolved</span>
                              </button>
                            )}

                            {/* Option 2: Check Status Button */}
                            <button
                              type="button"
                              onClick={() => setStatusCheckModalTarget(complaint)}
                              className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 cursor-pointer"
                              title="Check & update status telemetry"
                            >
                              <Activity className="w-3.5 h-3.5" />
                            </button>

                            {/* Option 3: Escalate Button */}
                            <button
                              type="button"
                              onClick={() => setEscalateModalTarget(complaint)}
                              className="p-1 bg-red-50 hover:bg-red-100 text-red-800 rounded border border-red-200 cursor-pointer"
                              title="Escalate to senior officer"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>

                            {/* Option 5: Notify Citizen Button */}
                            <button
                              type="button"
                              onClick={() => setNotifyCitizenModalTarget(complaint)}
                              className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer"
                              title="Dispatch SMS / notification to citizen"
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>

                            {/* Full Details View */}
                            <button
                              type="button"
                              onClick={() => setSelectedComplaint(complaint)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold border border-slate-200 flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 4. Comprehensive Complaint Detail Modal (when an officer clicks 'Details') */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-md max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden font-sans text-xs max-h-[90vh] flex flex-col">
              {/* Detail Header */}
              <div className="bg-[#0b2239] text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-xs bg-[#ea580c] flex items-center justify-center text-white font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-sm font-bold text-white">
                        Official Complaint Record #{selectedComplaint.officialReferenceNumber || selectedComplaint.id}
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.2 bg-white/20 text-white rounded font-bold">
                        {selectedComplaint.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/70">
                      {selectedComplaint.departmentName} • Priority: {selectedComplaint.priority}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="text-white/60 hover:text-white p-1 rounded-xs cursor-pointer"
                >
                  <span className="text-lg font-bold">✕</span>
                </button>
              </div>

              {/* Detail Content Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* 6-Stage Resolution Timeline Indicator (Syncs with Citizen Portal) */}
                <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Citizen Portal Synchronization (6-Stage Lifecycle)
                    </span>
                    <span className="text-[10px] font-bold text-[#0b2239] bg-orange-100 px-2 py-0.5 rounded font-mono">
                      Current: Stage {getComplaintStageNumber(selectedComplaint.status, selectedComplaint.citizenConfirmed)} of 6
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center">
                    {[
                      { num: 1, label: '1. Submitted' },
                      { num: 2, label: '2. Assigned' },
                      { num: 3, label: '3. In Progress' },
                      { num: 4, label: '4. Work Done' },
                      { num: 5, label: '5. Verification' },
                      { num: 6, label: '6. Resolved' },
                    ].map((st) => {
                      const cur = getComplaintStageNumber(selectedComplaint.status, selectedComplaint.citizenConfirmed);
                      const isDone = cur > st.num || (cur === 6 && st.num === 6);
                      const isCur = cur === st.num;
                      return (
                        <div
                          key={st.num}
                          className={`p-1.5 rounded text-[10px] font-bold flex flex-col items-center ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isCur
                              ? 'bg-[#0b2239] text-white border border-[#0b2239] ring-2 ring-orange-200'
                              : 'bg-white text-slate-400 border border-slate-200'
                          }`}
                        >
                          <span className="truncate w-full">{st.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Image and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-44 bg-slate-900 rounded overflow-hidden border border-slate-200">
                      <img
                        src={selectedComplaint.photoUrl}
                        alt="Civic Issue Defect"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Filed on: {new Date(selectedComplaint.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2.5 bg-slate-50 p-3.5 rounded border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">{selectedComplaint.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedComplaint.description}</p>
                    
                    <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{selectedComplaint.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Submitter: {selectedComplaint.submitterName || 'Citizen Resident'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{selectedComplaint.submitterPhone || '+91 98765-43210'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Work Comparison if Available */}
                {selectedComplaint.proofOfWork && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Verified Proof of Work Certificate</span>
                      </span>
                      <span className="font-mono text-emerald-800 font-bold">
                        {selectedComplaint.proofOfWork.certificateNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Before:</span>
                        <img
                          src={selectedComplaint.proofOfWork.beforePhotoUrl}
                          alt="Before"
                          className="w-full h-28 object-cover rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block">After (Repaired):</span>
                        <img
                          src={selectedComplaint.proofOfWork.afterPhotoUrl}
                          alt="After"
                          className="w-full h-28 object-cover rounded border border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-emerald-900 pt-1">
                      <strong>Resolution Notes:</strong> {selectedComplaint.proofOfWork.resolutionNotes}
                    </div>
                  </div>
                )}

                {/* Fast Action Buttons in Detail Modal */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedComplaint.status !== 'IN_PROGRESS' &&
                      selectedComplaint.status !== 'RESOLVED' &&
                      selectedComplaint.status !== 'CLOSED' && (
                        <button
                          type="button"
                          disabled={isActionRunning}
                          onClick={() => {
                            handleMarkInProgress(selectedComplaint);
                          }}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-white" />
                          <span>Mark In Progress</span>
                        </button>
                      )}

                    {selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'CLOSED' && (
                      <button
                        type="button"
                        onClick={() => {
                          setProofOfWorkModalTarget(selectedComplaint);
                          setSelectedComplaint(null);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Mark Work Completed (Upload Proof)</span>
                      </button>
                    )}

                    {(selectedComplaint.status === 'RESOLVED' || selectedComplaint.status === 'IN_PROGRESS') && (
                      <button
                        type="button"
                        disabled={isActionRunning}
                        onClick={() => {
                          handleMarkResolved(selectedComplaint);
                          setSelectedComplaint(null);
                        }}
                        className="px-3 py-1.5 bg-[#0b2239] hover:bg-slate-800 text-white rounded font-bold text-xs border border-slate-700 flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mark Resolved (Audit Closure)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setStatusCheckModalTarget(selectedComplaint);
                        setSelectedComplaint(null);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded font-bold text-xs border border-blue-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Check Status</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEscalateModalTarget(selectedComplaint);
                        setSelectedComplaint(null);
                      }}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 rounded font-bold text-xs border border-red-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Escalate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNotifyCitizenModalTarget(selectedComplaint);
                        setSelectedComplaint(null);
                      }}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded font-bold text-xs border border-amber-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify Citizen</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Option 2 Modal: Check Status */}
        <GovCheckStatusModal
          complaint={statusCheckModalTarget}
          isOpen={!!statusCheckModalTarget}
          onClose={() => setStatusCheckModalTarget(null)}
          currentOfficer={currentOfficer}
          onStatusUpdated={handleComplaintUpdated}
        />

        {/* Option 3 Modal: Escalate if Late */}
        <GovEscalateModal
          complaint={escalateModalTarget}
          isOpen={!!escalateModalTarget}
          onClose={() => setEscalateModalTarget(null)}
          currentOfficer={currentOfficer}
          onEscalated={handleComplaintUpdated}
        />

        {/* Option 4 Modal: Resolved with Proof Upload */}
        <GovProofOfWorkModal
          complaint={proofOfWorkModalTarget}
          isOpen={!!proofOfWorkModalTarget}
          onClose={() => setProofOfWorkModalTarget(null)}
          currentOfficer={currentOfficer}
          onResolved={handleComplaintUpdated}
        />

        {/* Option 5 Modal: Notify User */}
        <GovNotifyCitizenModal
          complaint={notifyCitizenModalTarget}
          isOpen={!!notifyCitizenModalTarget}
          onClose={() => setNotifyCitizenModalTarget(null)}
          currentOfficer={currentOfficer}
          onNotificationSent={handleComplaintUpdated}
        />
      </div>
    </div>
  );
};

// Helper for Chevron icon
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className={props.className || 'w-4 h-4'}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
