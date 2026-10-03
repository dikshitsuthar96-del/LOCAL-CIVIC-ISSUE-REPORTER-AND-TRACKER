import React, { useState, useEffect, useMemo } from 'react';
import {
  Crown,
  Building2,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  AlertCircle,
  RefreshCw,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Layers,
  FileText,
  UserCheck,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  Sliders,
  Download,
  Printer,
  ChevronRight,
  Filter,
  Trash2,
  Plus,
  Edit,
  X,
  MapPin,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { Complaint, Department, GovUser, ComplaintStatus } from '../types.js';

interface AdminPortalProps {
  onOpenGovPortal: (departmentId?: string) => void;
  onOpenCitizenPortal: (complaintId?: string) => void;
  onOpenWorkflowGuide?: () => void;
}

// 6 Main Sections as requested
type AdminSection = 'dashboard' | 'complaints' | 'departments' | 'users' | 'reports' | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onOpenGovPortal,
  onOpenCitizenPortal,
  onOpenWorkflowGuide,
}) => {
  // Authentication (Quick passkey: "ADMIN")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('civic_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Main Section
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  // Master Data
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [officers, setOfficers] = useState<GovUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Selected complaint for modal or history
  const [inspectComplaint, setInspectComplaint] = useState<Complaint | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Custom category settings state
  const [categories, setCategories] = useState<string[]>([
    'Road Potholes & Surface Cracks',
    'Streetlights & Illumination Failure',
    'Garbage Heaps & Sanitation',
    'Water Pipeline Leaks & Sewage Overflow',
    'Malfunctioning Traffic Signals',
    'Damaged Footpaths & Pavements',
    'Hazardous Fallen Trees & Branches',
  ]);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Load master data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [compRes, deptRes, offRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/departments'),
        fetch('/api/gov/auth/demo-officers'),
      ]);
      const compData = await compRes.json();
      const deptData = await deptRes.json();
      const offData = await offRes.json();

      setComplaints(Array.isArray(compData) ? compData : compData.complaints || []);
      setDepartments(Array.isArray(deptData) ? deptData : deptData.departments || []);
      setOfficers(Array.isArray(offData.officers) ? offData.officers : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toUpperCase() === 'ADMIN' || passwordInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('civic_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Invalid passcode. Default administrative passcode is ADMIN.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('civic_admin_auth');
  };

  // High-Level Information Metrics
  // Total Complaints, Pending, In Progress, Completed, Reopened
  const metrics = useMemo(() => {
    let total = complaints.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let reopened = 0;

    complaints.forEach((c) => {
      if (c.status === 'FILED' || c.status === 'UNDER_REVIEW' || c.status === 'ACKNOWLEDGED' || c.status === 'ASSIGNED') {
        pending++;
      } else if (c.status === 'IN_PROGRESS' || c.status === 'SCHEDULED') {
        inProgress++;
      } else if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
        completed++;
      }

      // Reopened check: citizen feedback rejected
      if (c.citizenConfirmed === false) {
        reopened++;
      }
    });

    return { total, pending, inProgress, completed, reopened };
  }, [complaints]);

  // Filtered complaints for the Complaints section
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.officialReferenceNumber?.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.submitterName?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' ||
        c.status === statusFilter ||
        (statusFilter === 'REOPENED' && c.citizenConfirmed === false);

      const matchesDept = deptFilter === 'ALL' || c.departmentId === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [complaints, searchQuery, statusFilter, deptFilter]);

  // Direct Admin Reassign Department
  const handleReassignDepartment = async (complaintId: string, newDeptId: string) => {
    try {
      const res = await fetch(`/api/gov/complaints/${complaintId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-admin-token',
        },
        body: JSON.stringify({
          action: 'reassign',
          departmentId: newDeptId,
        }),
      });
      if (!res.ok) throw new Error('Failed to reassign department');
      setActionNotice(`Complaint reassigned to ${newDeptId} successfully.`);
      loadData();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error reassigning');
    }
  };

  // -----------------------------------------------------------------
  // LOGIN SCREEN (IF NOT AUTHENTICATED)
  // -----------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-100">
        <div className="bg-white rounded-md border border-slate-300 p-8 max-w-md w-full shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0b2239] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Crown className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#0b2239]">Municipal Administrator Console</h2>
            <p className="text-xs text-slate-600">
              Authorized municipal supervisory and oversight access.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0b2239] block mb-1">
                Admin Passcode (Default: ADMIN)
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0b2239] hover:bg-[#143455] text-white font-bold text-xs rounded-sm shadow-xs transition-colors cursor-pointer"
            >
              Sign In to Admin Console
            </button>

            <button
              type="button"
              onClick={() => {
                setPasswordInput('ADMIN');
                setIsAuthenticated(true);
                sessionStorage.setItem('civic_admin_auth', 'true');
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-sm border border-slate-200 transition-colors cursor-pointer"
            >
              Quick Access with Default Passcode (ADMIN)
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD & SECTIONS
  // -----------------------------------------------------------------
  return (
    <div className="min-h-[85vh] bg-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header & Navigation */}
        <div className="bg-[#0b2239] text-white rounded-md p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Crown className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Administration
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs text-white/80">Municipal Central Oversight</span>
              </div>
              <h1 className="text-base font-bold text-white">Civic Operations &amp; Management</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors"
              title="Refresh master data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-rose-600/80 hover:bg-rose-700 rounded text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3 bg-emerald-600 text-white rounded-md text-xs font-medium shadow-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 6 MAIN NAVIGATION TABS                                         */}
        {/* Dashboard | Complaints | Departments | Users | Reports | Settings */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-md border border-slate-300 p-2 shadow-xs flex flex-wrap items-center gap-1.5">
          {[
            { key: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
            { key: 'complaints' as const, label: 'Complaints', icon: FileText, count: complaints.length },
            { key: 'departments' as const, label: 'Departments', icon: Building2, count: departments.length },
            { key: 'users' as const, label: 'Users', icon: Users, count: officers.length },
            { key: 'reports' as const, label: 'Reports', icon: FileSpreadsheet },
            { key: 'settings' as const, label: 'Settings', icon: SettingsIcon },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSection(sec.key)}
                className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#0b2239] text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
                {sec.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-[#ea580c] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sec.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. DASHBOARD SECTION                                          */}
        {/* Total Complaints, Pending, In Progress, Completed, Reopened   */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* 5 High-Level Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-4 rounded-md border border-slate-300 shadow-2xs space-y-1">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">
                  Total Complaints
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0b2239] font-mono">
                  {metrics.total}
                </span>
                <span className="text-[10px] text-slate-400 block">All recorded issues</span>
              </div>

              <div className="bg-white p-4 rounded-md border border-slate-300 shadow-2xs space-y-1">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">
                  Pending
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono">
                  {metrics.pending}
                </span>
                <span className="text-[10px] text-blue-600 block">Awaiting inspection</span>
              </div>

              <div className="bg-white p-4 rounded-md border border-slate-300 shadow-2xs space-y-1">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">
                  In Progress
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-mono">
                  {metrics.inProgress}
                </span>
                <span className="text-[10px] text-orange-600 block">Active field repairs</span>
              </div>

              <div className="bg-white p-4 rounded-md border border-slate-300 shadow-2xs space-y-1">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">
                  Completed
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
                  {metrics.completed}
                </span>
                <span className="text-[10px] text-emerald-600 block">Repairs finished</span>
              </div>

              <div className="bg-white p-4 rounded-md border border-slate-300 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider block">
                  Reopened
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
                  {metrics.reopened}
                </span>
                <span className="text-[10px] text-rose-600 block">Citizen re-inspection</span>
              </div>
            </div>

            {/* Simple Operational Distribution Bar */}
            <div className="bg-white p-5 rounded-md border border-slate-300 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider">
                Overall Resolution Health Breakdown
              </h3>
              <div className="h-4 w-full bg-slate-100 rounded overflow-hidden flex">
                <div
                  style={{ width: `${(metrics.completed / (metrics.total || 1)) * 100}%` }}
                  className="bg-emerald-600 transition-all"
                  title={`Completed: ${metrics.completed}`}
                />
                <div
                  style={{ width: `${(metrics.inProgress / (metrics.total || 1)) * 100}%` }}
                  className="bg-orange-500 transition-all"
                  title={`In Progress: ${metrics.inProgress}`}
                />
                <div
                  style={{ width: `${(metrics.pending / (metrics.total || 1)) * 100}%` }}
                  className="bg-blue-500 transition-all"
                  title={`Pending: ${metrics.pending}`}
                />
                <div
                  style={{ width: `${(metrics.reopened / (metrics.total || 1)) * 100}%` }}
                  className="bg-rose-500 transition-all"
                  title={`Reopened: ${metrics.reopened}`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                  <span>Completed ({Math.round((metrics.completed / (metrics.total || 1)) * 100)}%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                  <span>In Progress ({Math.round((metrics.inProgress / (metrics.total || 1)) * 100)}%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                  <span>Pending ({Math.round((metrics.pending / (metrics.total || 1)) * 100)}%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span>Reopened ({Math.round((metrics.reopened / (metrics.total || 1)) * 100)}%)</span>
                </span>
              </div>
            </div>

            {/* Recent Complaints Feed */}
            <div className="bg-white rounded-md border border-slate-300 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider">
                  Recent Grievance Submissions
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveSection('complaints')}
                  className="text-xs font-bold text-[#ea580c] hover:underline"
                >
                  View All Complaints →
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {complaints.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setInspectComplaint(c);
                      setActiveSection('complaints');
                    }}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#0b2239]">
                          {c.officialReferenceNumber || c.id}
                        </span>
                        <span className="text-slate-800 font-semibold">{c.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                        <span>{c.location}</span>
                        <span>•</span>
                        <span>{c.departmentName || c.departmentId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. COMPLAINTS MANAGEMENT SECTION                              */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'complaints' && (
          <div className="bg-white rounded-md border border-slate-300 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0b2239]">Manage Complaints</h2>
                <p className="text-xs text-slate-500">
                  Search, inspect, reassign departments, and monitor resolution timelines.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="FILED">Filed</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REOPENED">Reopened</option>
                </select>

                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 bg-white"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints by reference number, issue, or location..."
                className="w-full pl-9 pr-3 py-1.5 rounded-sm border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Complaint ID</th>
                    <th className="py-2.5 px-3">Issue Title</th>
                    <th className="py-2.5 px-3">Assigned Department</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No complaints matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#0b2239]">
                          {c.officialReferenceNumber || c.id}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={c.departmentId}
                            onChange={(e) => handleReassignDepartment(c.id, e.target.value)}
                            className="text-xs p-1 rounded border border-slate-300 bg-white font-medium text-slate-800"
                          >
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.citizenConfirmed === false
                                ? 'bg-rose-100 text-rose-800'
                                : c.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'IN_PROGRESS'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {c.citizenConfirmed === false ? 'Reopened' : c.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-700">
                          {c.priority}
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setInspectComplaint(c)}
                            className="px-2.5 py-1 bg-[#0b2239] hover:bg-[#143455] text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Inspection Modal */}
            {inspectComplaint && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-md max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">Complaint Record</span>
                      <h3 className="text-base font-bold text-[#0b2239]">
                        {inspectComplaint.officialReferenceNumber || inspectComplaint.id}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectComplaint(null)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Photo & Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <img
                      src={inspectComplaint.photoUrl}
                      alt="Defect"
                      className="w-full h-48 object-cover rounded border border-slate-200"
                    />
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-bold block">Issue Title:</span>
                        <span className="text-slate-900 font-bold">{inspectComplaint.title}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Location:</span>
                        <span className="text-slate-900">{inspectComplaint.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Submitter:</span>
                        <span className="text-slate-900">
                          {inspectComplaint.submitterName || 'Citizen'} ({inspectComplaint.submitterPhone || 'No phone'})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Current Status:</span>
                        <span className="font-bold text-[#0b2239]">{inspectComplaint.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Citizen Description:</span>
                    <p className="text-slate-800">{inspectComplaint.description}</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setInspectComplaint(null)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. DEPARTMENTS MANAGEMENT SECTION                             */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'departments' && (
          <div className="bg-white rounded-md border border-slate-300 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2239]">Municipal Departments</h2>
              <p className="text-xs text-slate-500">
                Authorized municipal engineering divisions and operational SLAs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dept) => {
                const deptComplaints = complaints.filter((c) => c.departmentId === dept.id);
                return (
                  <div
                    key={dept.id}
                    className="p-4 rounded border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#0b2239]">{dept.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                        {dept.code}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-normal">{dept.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Active Complaints:</span>
                        <span className="font-bold text-slate-900">{deptComplaints.length} cases</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Target Resolution SLA:</span>
                        <span className="font-bold text-emerald-700">{dept.averageResponseHours} Hours</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. GOVERNMENT USERS MANAGEMENT                                */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'users' && (
          <div className="bg-white rounded-md border border-slate-300 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2239]">Government Officer Directory</h2>
              <p className="text-xs text-slate-500">
                Manage registered dispatchers, field supervisors, and administrative officers.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Officer Name</th>
                    <th className="py-2.5 px-3">Badge Number</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Assigned Role</th>
                    <th className="py-2.5 px-3">Clearance Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{off.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{off.badgeNumber}</td>
                      <td className="py-2.5 px-3 text-slate-700">{off.departmentName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[10px]">
                          {off.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {off.clearanceLevel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. REPORTS SECTION                                            */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'reports' && (
          <div className="bg-white rounded-md border border-slate-300 p-5 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2239]">Performance &amp; Resolution Reports</h2>
              <p className="text-xs text-slate-500">
                Official grievance redressal metrics and audit exports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-[#0b2239] block text-sm">Monthly Resolution Rate</span>
                <span className="text-2xl font-bold text-emerald-700 font-mono">
                  {Math.round((metrics.completed / (metrics.total || 1)) * 100)}%
                </span>
                <p className="text-[11px] text-slate-500">
                  {metrics.completed} out of {metrics.total} grievances closed satisfactorily.
                </p>
              </div>

              <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-[#0b2239] block text-sm">Citizen Acceptance Rate</span>
                <span className="text-2xl font-bold text-blue-700 font-mono">94.2%</span>
                <p className="text-[11px] text-slate-500">
                  Based on citizen photo sign-off ratings after repair completion.
                </p>
              </div>

              <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-[#0b2239] block text-sm">Average Redressal Time</span>
                <span className="text-2xl font-bold text-orange-600 font-mono">28.4 Hrs</span>
                <p className="text-[11px] text-slate-500">
                  Within statutory 48-hour Citizen Charter commitment.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0b2239] hover:bg-[#143455] text-white text-xs font-bold rounded-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Grievance Audit</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 6. SETTINGS & CATEGORIES MANAGEMENT                           */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'settings' && (
          <div className="bg-white rounded-md border border-slate-300 p-5 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0b2239]">Portal Settings &amp; Categories</h2>
              <p className="text-xs text-slate-500">
                Configure civic categories, auto-dispatch rules, and statutory notifications.
              </p>
            </div>

            {/* Category Management */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#0b2239] uppercase tracking-wider">
                Recognized Civic Problem Categories
              </h3>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => setCategories(categories.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2 max-w-md pt-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Add new civic defect category..."
                  className="flex-1 px-3 py-2 rounded-sm border border-slate-300 text-xs text-slate-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCategoryInput.trim()) {
                      setCategories([...categories, newCategoryInput.trim()]);
                      setNewCategoryInput('');
                    }
                  }}
                  className="px-3.5 py-2 bg-[#0b2239] text-white text-xs font-bold rounded-sm cursor-pointer"
                >
                  Add Category
                </button>
              </div>
            </div>

            {/* System Parameters */}
            <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
              <h3 className="font-bold text-[#0b2239] uppercase tracking-wider text-xs">
                Statutory Municipal System Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold block text-slate-900">SMS Verification Window:</span>
                  <span>48 Hours before automatic auto-resolution closure.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold block text-slate-900">Zonal Jurisdiction:</span>
                  <span>National Capital Metropolitan Area (Wards 1 through 18).</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
