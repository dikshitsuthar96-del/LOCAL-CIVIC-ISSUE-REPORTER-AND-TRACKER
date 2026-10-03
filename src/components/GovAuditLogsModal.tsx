import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Search,
  Filter,
  FileSpreadsheet,
  X,
  BadgeAlert,
  ShieldCheck,
  User,
  Key,
} from 'lucide-react';
import { GovUser, GovAuditLogEntry } from '../types.js';

interface GovAuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: GovUser | null;
}

export const GovAuditLogsModal: React.FC<GovAuditLogsModalProps> = ({
  isOpen,
  onClose,
  currentOfficer,
}) => {
  const [logs, setLogs] = useState<GovAuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchLogs = async () => {
    if (!currentOfficer?.token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gov/auth/audit-logs', {
        headers: {
          Authorization: `Bearer ${currentOfficer.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to retrieve municipal audit records.');
      }
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentOfficer) {
      fetchLogs();
    }
  }, [isOpen, currentOfficer?.token]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'ALL' && log.eventType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOfficer = log.officerName?.toLowerCase().includes(q) || log.officerBadge?.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchComplaint = log.complaintId?.toLowerCase().includes(q);
      if (!matchOfficer && !matchDetails && !matchComplaint) return false;
    }
    return true;
  });

  const getEventBadge = (type: GovAuditLogEntry['eventType']) => {
    switch (type) {
      case 'AUTH_SUCCESS':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Auth Success',
        };
      case 'AUTH_FAILED':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Auth Rejected',
        };
      case 'AUTH_LOGOUT':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <Key className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Session Terminated',
        };
      case 'ACTION_AUTHORIZED':
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Action Executed',
        };
      case 'ACTION_DENIED_403':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <BadgeAlert className="w-3.5 h-3.5 text-amber-700" />,
          label: '403 Denied',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
          label: type,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-2 border-slate-700 shadow-2xl rounded-2xl max-w-4xl w-full overflow-hidden text-slate-900 font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400 flex items-center space-x-2">
                <span>Metropolis Civil Audit & Transparency Division</span>
                <span>•</span>
                <span className="text-slate-400">Section 14-B Compliance</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Municipal Security & Authorization Audit Ledger
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar / Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by officer, badge, or case ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 w-56 font-mono"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-semibold"
              >
                <option value="ALL">All Event Types ({logs.length})</option>
                <option value="ACTION_AUTHORIZED">Authorized Actions</option>
                <option value="ACTION_DENIED_403">403 Denied Actions</option>
                <option value="AUTH_SUCCESS">Successful Logins</option>
                <option value="AUTH_FAILED">Rejected Logins</option>
                <option value="AUTH_LOGOUT">Terminated Sessions</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fetchLogs}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              Clearance: <strong className="text-slate-800">{currentOfficer?.clearanceLevel}</strong>
            </span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center space-y-2">
              <RotateCw className="w-6 h-6 animate-spin text-slate-400" />
              <span>Querying verified municipal audit ledger...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No audit events match current criteria</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Authentication and authorization attempts are automatically recorded upon interaction.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              {filteredLogs.map((log) => {
                const badge = getEventBadge(log.eventType);
                return (
                  <div key={log.id} className="p-3.5 hover:bg-slate-50/80 transition-colors text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border flex items-center space-x-1 shrink-0 ${badge.bg}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        {log.officerBadge && (
                          <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {log.officerName} ({log.officerBadge})
                          </span>
                        )}

                        {log.officerRole && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            [{log.officerRole}]
                          </span>
                        )}

                        {log.complaintId && (
                          <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            #{log.complaintId}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-800 text-[11px] leading-relaxed">
                        {log.details}
                      </p>
                    </div>

                    <div className="shrink-0 text-right font-mono text-[10px] text-slate-400">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-slate-500 font-semibold">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-[11px] text-slate-500 font-mono">
          <span>Metropolis Municipal Audit Log • Immutable Digital Verification Record</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
