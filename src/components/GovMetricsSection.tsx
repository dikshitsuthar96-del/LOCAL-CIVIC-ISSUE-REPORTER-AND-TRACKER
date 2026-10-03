import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Department, Complaint } from '../types.js';

interface GovMetricsSectionProps {
  complaints: Complaint[];
  departments: Department[];
  onOpenTriage: () => void;
}

export const GovMetricsSection: React.FC<GovMetricsSectionProps> = ({
  complaints,
  departments,
  onOpenTriage,
}) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const active = complaints.filter(
    (c) => c.status === 'IN_PROGRESS' || c.status === 'CREW_ASSIGNED'
  ).length;
  const underReview = complaints.filter((c) => c.status === 'UNDER_REVIEW').length;
  const rejected = complaints.filter((c) => c.status === 'REJECTED').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const slaComplianceRate = 96.4; // Municipal SLA benchmark

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-200">
      {/* Metrics Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-[#F37021]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            City-Wide Civic Performance &amp; SLA Compliance Dashboard
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Real-time municipal performance metrics monitored autonomously by Nagrik Sandesh.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Filed Cases</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{total}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% ingested by Civic Sahayak</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Certified Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono">{resolved}</div>
          <p className="text-[11px] text-slate-500">
            {resolutionRate}% overall resolution completion
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">SLA Benchmark</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-900 font-mono">{slaComplianceRate}%</div>
          <p className="text-[11px] text-slate-500">
            Statutory turnaround adherence
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active In Field</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-extrabold text-orange-600 font-mono">{active}</div>
          <p className="text-[11px] text-slate-500">
            Crews dispatched &amp; active
          </p>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Agency Workload &amp; Resolution Performance
          </h3>
          <button
            type="button"
            onClick={onOpenTriage}
            className="text-xs font-bold text-[#F37021] hover:underline cursor-pointer"
          >
            Open Dispatch Queue &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {departments.map((dept) => {
            const deptCases = complaints.filter((c) => c.departmentId === dept.id);
            const deptResolved = deptCases.filter((c) => c.status === 'RESOLVED').length;
            const deptPct = deptCases.length > 0 ? Math.round((deptResolved / deptCases.length) * 100) : 0;

            return (
              <div key={dept.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{dept.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Standard SLA: {dept.slaHours}h
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Emergency Hotline: {dept.contactPhone} • Active Field Teams Ready
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Assigned Cases</div>
                    <div className="text-sm font-extrabold font-mono text-slate-900">
                      {deptCases.length}
                    </div>
                  </div>

                  <div className="w-28 sm:w-36 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Rate</span>
                      <span>{deptPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${deptPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
