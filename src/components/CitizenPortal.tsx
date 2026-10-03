import React, { useState, useEffect } from 'react';
import {
  Camera,
  Search,
  FileText,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  MapPin,
  Calendar,
} from 'lucide-react';
import { ReportIssueForm } from './ReportIssueForm.js';
import { CitizenTracker } from './CitizenTracker.js';
import { Complaint, AgentTraceNode } from '../types.js';
import { useSupabaseAuth } from '../context/SupabaseAuthContext.js';
import { CIVIC_CATEGORY_ITEMS, CivicCategoryItem } from '../data/civicImages.js';

interface CitizenPortalProps {
  onOpenGovSimulator: (complaintId?: string) => void;
  onOpenWorkflowGuide?: () => void;
  initialTrackingId?: string | null;
  activeNavSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onOpenGovSimulator,
  onOpenWorkflowGuide,
  initialTrackingId,
  activeNavSection,
  onNavigateSection,
}) => {
  const { user, userId } = useSupabaseAuth();

  // Active view: 'home' | 'report' | 'track' | 'my-complaints' | 'help'
  const [activeView, setActiveView] = useState<'home' | 'report' | 'track' | 'my-complaints' | 'help'>(
    initialTrackingId ? 'track' : 'home'
  );

  const [trackingTargetId, setTrackingTargetId] = useState<string | null>(initialTrackingId || null);
  const [quickTrackInput, setQuickTrackInput] = useState('');
  const [myComplaintsList, setMyComplaintsList] = useState<Complaint[]>([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [selectedCategoryPreset, setSelectedCategoryPreset] = useState<string | null>(null);

  // Sync with prop navigation changes
  useEffect(() => {
    if (initialTrackingId) {
      setTrackingTargetId(initialTrackingId);
      setActiveView('track');
    }
  }, [initialTrackingId]);

  useEffect(() => {
    if (activeNavSection === 'report') setActiveView('report');
    else if (activeNavSection === 'track') setActiveView('track');
    else if (activeNavSection === 'my-complaints') setActiveView('my-complaints');
    else if (activeNavSection === 'help') setActiveView('help');
    else if (activeNavSection === 'home') setActiveView('home');
  }, [activeNavSection]);

  // Load complaints for "My Complaints"
  useEffect(() => {
    setIsLoadingComplaints(true);
    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.complaints || [];
        setMyComplaintsList(list);
      })
      .catch((err) => console.error('Failed to load my complaints:', err))
      .finally(() => setIsLoadingComplaints(false));
  }, []);

  // Real-time synchronization for citizen complaints list
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('civic_complaint_channel');
      channel.onmessage = (event) => {
        if (event.data && event.data.complaint) {
          const updated = event.data.complaint;
          setMyComplaintsList((prev) =>
            prev.map((c) =>
              c.id.toLowerCase() === updated.id.toLowerCase() ||
              c.officialReferenceNumber.toLowerCase() === updated.officialReferenceNumber.toLowerCase()
                ? updated
                : c
            )
          );
        }
      };
    } catch (_) {}

    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        const updated = e.detail;
        setMyComplaintsList((prev) =>
          prev.map((c) =>
            c.id.toLowerCase() === updated.id.toLowerCase() ||
            c.officialReferenceNumber.toLowerCase() === updated.officialReferenceNumber.toLowerCase()
              ? updated
              : c
          )
        );
      }
    };
    window.addEventListener('civic:complaint-updated', handleCustomEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('civic:complaint-updated', handleCustomEvent);
    };
  }, []);

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      setTrackingTargetId(quickTrackInput.trim());
      setActiveView('track');
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 py-6 sm:py-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. CITIZEN HOME SCREEN                                         */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'home' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Main Hero Card: "Report a Civic Issue" */}
          <div className="bg-white border-2 border-[#0b2239]/10 rounded-md p-6 sm:p-10 shadow-xs text-center space-y-5">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0b2239] text-[11px] font-bold uppercase tracking-wider">
                Official Citizen Grievance Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2239] tracking-tight">
                Report a Civic Issue
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Take or upload a photo of road potholes, garbage heaps, non-functional streetlights, or broken water pipes. Your complaint is automatically routed to city maintenance crews with full tracking.
              </p>
            </div>

            {/* Large Primary Button: [ Report an Issue ] */}
            <div className="pt-2">
              <button
                type="button"
                id="btn-report-civic-issue-primary"
                onClick={() => {
                  setActiveView('report');
                  if (onNavigateSection) onNavigateSection('report');
                }}
                className="w-full sm:w-auto px-10 py-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-base rounded-md shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 mx-auto cursor-pointer"
              >
                <Camera className="w-6 h-6" />
                <span>Report an Issue</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Photo Detection</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Auto-Location</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SMS Status Alerts</span>
              </span>
            </div>
          </div>

          {/* Simple Secondary Options: Track Complaint, My Complaints, Help */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Option 1: Track Complaint */}
            <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs hover:border-[#0b2239] transition-colors flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded bg-blue-50 text-[#0b2239] flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0b2239]">Track Complaint</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Check live field repair progress using your Reference ID.
                </p>
              </div>

              <form onSubmit={handleQuickTrackSubmit} className="space-y-2 pt-1">
                <input
                  type="text"
                  value={quickTrackInput}
                  onChange={(e) => setQuickTrackInput(e.target.value)}
                  placeholder="e.g., CIVIC-2026-1042"
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-[#0b2239]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0b2239] hover:bg-[#143455] text-white text-xs font-bold rounded-sm cursor-pointer transition-colors"
                >
                  Track Status
                </button>
              </form>
            </div>

            {/* Option 2: My Complaints */}
            <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs hover:border-[#0b2239] transition-colors flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0b2239]">My Complaints</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  View complaints registered from this device or your mobile account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveView('my-complaints');
                  if (onNavigateSection) onNavigateSection('my-complaints');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0b2239] border border-slate-300 text-xs font-bold rounded-sm cursor-pointer transition-colors"
              >
                View History ({myComplaintsList.length})
              </button>
            </div>

            {/* Option 3: Help */}
            <div className="bg-white border border-slate-200 rounded-md p-5 shadow-2xs hover:border-[#0b2239] transition-colors flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0b2239]">Help &amp; Helplines</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Toll-free municipal helpline 1916, resolution SLAs, and FAQs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveView('help');
                  if (onNavigateSection) onNavigateSection('help');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0b2239] border border-slate-300 text-xs font-bold rounded-sm cursor-pointer transition-colors"
              >
                Citizen Charter &amp; FAQs
              </button>
            </div>
          </div>

          {/* Official Civic Grievance Categories (10 Real Photograph Cards) */}
          <div className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-1">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0b2239]">
                  Official Civic Grievance Categories
                </h3>
                <p className="text-xs text-slate-500">
                  Select an infrastructure category below to initiate a targeted municipal report.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                10 Verified Categories
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {CIVIC_CATEGORY_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-[#0b2239] hover:shadow-sm rounded-sm overflow-hidden flex flex-col justify-between transition-all group"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-28 object-cover group-hover:brightness-95 transition-all"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-[#0b2239]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs tracking-tight">
                      Official
                    </span>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#0b2239] leading-tight group-hover:text-[#ea580c] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryPreset(item.name);
                        setActiveView('report');
                        if (onNavigateSection) onNavigateSection('report');
                      }}
                      className="w-full py-1.5 bg-slate-50 hover:bg-[#0b2239] hover:text-white border border-slate-300 hover:border-[#0b2239] text-[#0b2239] text-[11px] font-bold rounded-xs cursor-pointer transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. REPORT AN ISSUE (STEP-BY-STEP FORM)                        */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'report' && (
        <div className="space-y-4">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryPreset(null);
                setActiveView('home');
                if (onNavigateSection) onNavigateSection('home');
              }}
              className="text-xs font-bold text-slate-600 hover:text-[#0b2239] flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Citizen Home</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">Citizen Grievance Submission</span>
          </div>

          <ReportIssueForm
            initialCategory={selectedCategoryPreset}
            onSuccess={(complaint) => {
              setTrackingTargetId(complaint.id);
              // Update local list
              setMyComplaintsList((prev) => [complaint, ...prev]);
            }}
            onCancel={() => {
              setSelectedCategoryPreset(null);
              setActiveView('home');
              if (onNavigateSection) onNavigateSection('home');
            }}
            onTrackComplaint={(id) => {
              setTrackingTargetId(id);
              setActiveView('track');
              if (onNavigateSection) onNavigateSection('track');
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TRACK COMPLAINT (SIMPLE TIMELINE)                          */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'track' && (
        <div className="space-y-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveView('home');
                if (onNavigateSection) onNavigateSection('home');
              }}
              className="text-xs font-bold text-slate-600 hover:text-[#0b2239] flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Citizen Home</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">Real-Time Grievance Timeline</span>
          </div>

          <CitizenTracker
            initialComplaintId={trackingTargetId}
            onNewReport={() => {
              setActiveView('report');
              if (onNavigateSection) onNavigateSection('report');
            }}
            onOpenGovSimulator={onOpenGovSimulator}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MY COMPLAINTS (SIMPLE LIST / TABLE)                        */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'my-complaints' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveView('home');
                if (onNavigateSection) onNavigateSection('home');
              }}
              className="text-xs font-bold text-slate-600 hover:text-[#0b2239] flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Citizen Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('report');
                if (onNavigateSection) onNavigateSection('report');
              }}
              className="px-3.5 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-sm cursor-pointer shadow-2xs"
            >
              + Report New Issue
            </button>
          </div>

          <div className="bg-white rounded-md border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#0b2239]">My Registered Grievances</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All issues registered on this device or associated with your municipal account.
              </p>
            </div>

            {myComplaintsList.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">No complaints registered yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveView('report')}
                  className="px-4 py-2 bg-[#0b2239] text-white text-xs font-bold rounded-sm cursor-pointer"
                >
                  Report Your First Civic Issue
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Complaint ID</th>
                      <th className="py-2.5 px-3">Issue</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myComplaintsList.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/30">
                        <td className="py-3 px-3 font-mono font-bold text-[#0b2239]">
                          {c.officialReferenceNumber || c.id}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                          {c.location}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'RESOLVED' || c.status === 'CLOSED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'IN_PROGRESS'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setTrackingTargetId(c.id);
                              setActiveView('track');
                            }}
                            className="px-2.5 py-1 bg-[#0b2239] hover:bg-[#143455] text-white text-[11px] font-bold rounded-xs cursor-pointer"
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. HELP & CITIZEN CHARTER                                     */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'help' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <button
            type="button"
            onClick={() => {
              setActiveView('home');
              if (onNavigateSection) onNavigateSection('home');
            }}
            className="text-xs font-bold text-slate-600 hover:text-[#0b2239] flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Citizen Home</span>
          </button>

          <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="bg-[#0b2239] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Citizen Support
              </span>
              <h2 className="text-xl font-bold text-[#0b2239] mt-1">Help &amp; Citizen Charter</h2>
              <p className="text-xs text-slate-600">
                Official grievance redressal timelines and emergency municipal contacts.
              </p>
            </div>

            {/* Helpline Numbers */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0b2239]">Official Toll-Free Helplines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Central Civic Helpline:</span>
                  <span className="text-base font-extrabold text-[#0b2239] font-mono">1916 (Toll-Free)</span>
                  <span className="text-[11px] text-slate-500 block">24x7 Road, Sanitation &amp; Water Redressal</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Electricity &amp; Streetlights:</span>
                  <span className="text-base font-extrabold text-[#0b2239] font-mono">1912 (Toll-Free)</span>
                  <span className="text-[11px] text-slate-500 block">Power Outages &amp; Pole Replacements</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Water Board &amp; Sewage:</span>
                  <span className="text-base font-extrabold text-[#0b2239] font-mono">1916 / +91-11-2353-8400</span>
                  <span className="text-[11px] text-slate-500 block">Main Line Pipeline Leakages</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium block">Emergency &amp; Police:</span>
                  <span className="text-base font-extrabold text-[#0b2239] font-mono">112</span>
                  <span className="text-[11px] text-slate-500 block">National Unified Emergency Response</span>
                </div>
              </div>
            </div>

            {/* Resolution Service Level Agreements (SLAs) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#0b2239]">Citizen Charter Resolution Timelines</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-3">Issue Category</th>
                      <th className="py-2 px-3">Responsible Division</th>
                      <th className="py-2 px-3">Max Resolution Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Dangerous Potholes</td>
                      <td className="py-2.5 px-3">Public Works (PWD)</td>
                      <td className="py-2.5 px-3 font-bold text-[#0b2239]">48 Hours</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Streetlight Failure</td>
                      <td className="py-2.5 px-3">Electrical Engineering</td>
                      <td className="py-2.5 px-3 font-bold text-[#0b2239]">24 Hours</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Garbage Accumulation</td>
                      <td className="py-2.5 px-3">Sanitation &amp; Health</td>
                      <td className="py-2.5 px-3 font-bold text-[#0b2239]">24 Hours</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Water Pipeline Leak</td>
                      <td className="py-2.5 px-3">Jal Board (Water Supply)</td>
                      <td className="py-2.5 px-3 font-bold text-[#0b2239]">12 Hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
