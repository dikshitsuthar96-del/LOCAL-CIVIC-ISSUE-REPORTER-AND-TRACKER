import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Clock,
  ArrowUpRight,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Layers,
} from 'lucide-react';
import { Complaint, ComplaintStatus, IssueCategory, Department } from '../types.js';

interface ComplaintsDashboardProps {
  complaints: Complaint[];
  departments: Department[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNewReport: () => void;
}

export const ComplaintsDashboard: React.FC<ComplaintsDashboardProps> = ({
  complaints,
  departments,
  onSelectComplaint,
  onNewReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filtered complaints calculation
  const filtered = useMemo(() => {
    return complaints.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.officialReferenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesDept = deptFilter === 'ALL' || item.departmentId === deptFilter;
      const matchesCategory = categoryFilter === 'ALL' || item.issueType === categoryFilter;

      return matchesSearch && matchesStatus && matchesDept && matchesCategory;
    });
  }, [complaints, searchQuery, statusFilter, deptFilter, categoryFilter]);

  // Metric stats
  const stats = useMemo(() => {
    const total = complaints.length;
    const active = complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
    const resolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    const emergency = complaints.filter((c) => c.priority === 'EMERGENCY').length;
    return { total, active, resolved, emergency };
  }, [complaints]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Municipal Complaints &amp; Status Feed
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Real-time public tracker with automated plain-language status translations by Nagrik Sandesh.
          </p>
        </div>

        <button
          onClick={onNewReport}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
        >
          <span>Report New Municipal Problem</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Tracked</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
          <span className="text-[11px] text-neutral-400">Filed across city wards</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Active Work Orders</span>
            <Hourglass className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.active}</p>
          <span className="text-[11px] text-blue-600 font-medium">Monitored by Nagrik Sandesh</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Resolved Issues</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.resolved}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Verified by municipal crews</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">High / Emergency</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-1">{stats.emergency}</p>
          <span className="text-[11px] text-rose-600 font-medium">Priority dispatch SLA</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, street name, or ward..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs text-neutral-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs text-neutral-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Categories</option>
              <option value="pothole">Pothole</option>
              <option value="garbage">Garbage / Waste</option>
              <option value="streetlight">Streetlight</option>
              <option value="water_leak">Water Leak</option>
              <option value="traffic_signal">Traffic Signal</option>
              <option value="sidewalk">Sidewalk</option>
              <option value="graffiti">Graffiti</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-600 font-medium mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            Status:
          </span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'FILED', label: 'Filed' },
            { id: 'ASSIGNED', label: 'Assigned' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-neutral-600 hidden sm:inline">
            Showing {filtered.length} of {complaints.length} tickets
          </span>
        </div>
      </div>

      {/* Complaints Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-neutral-200 p-8">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900">No complaints match your filters</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try resetting your search query or department filters to view all recorded municipal reports.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setDeptFilter('ALL');
              setCategoryFilter('ALL');
            }}
            className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const latestHistory = item.statusHistory?.[item.statusHistory.length - 1];

            return (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="group rounded-2xl border border-neutral-200 bg-white hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden"
              >
                {/* Image Header with Category and Priority Badges */}
                <div className="relative aspect-16/9 bg-neutral-900 overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-xs text-neutral-900 capitalize">
                      {(item.issueType || (item as any).category || '').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.priority === 'EMERGENCY'
                          ? 'bg-rose-600 text-white'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700/80 text-white'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="font-mono text-xs font-bold tracking-tight bg-black/40 px-2 py-0.5 rounded-md">
                      {item.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-500 text-white'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-blue-600 text-white'
                          : item.status === 'ASSIGNED'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {(item.status || '').replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-neutral-900 group-hover:text-indigo-950 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-neutral-500 space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-neutral-500 space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="truncate">{item.departmentName}</span>
                    </div>
                  </div>

                  {/* Plain Language Status Bubble (Agent 2 translation preview) */}
                  {latestHistory && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2 text-[11px] text-slate-700">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="line-clamp-2">
                        <span className="font-semibold text-slate-900">Latest Plain Update: </span>
                        {latestHistory.plainLanguageSummary}
                      </div>
                    </div>
                  )}

                  {/* Footer Timestamps */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span className="text-indigo-600 font-medium flex items-center group-hover:underline">
                      Track timeline &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
