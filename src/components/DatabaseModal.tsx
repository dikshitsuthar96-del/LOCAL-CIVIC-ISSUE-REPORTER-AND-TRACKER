import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  Copy,
  Check,
  Download,
  Users,
  ShieldCheck,
  FileText,
  RefreshCw,
  ExternalLink,
  Table,
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CitizenUserItem {
  id: string;
  citizenId: string;
  name: string;
  email: string;
  phone: string;
  totalReportsFiled: number;
  firstReportAt: string;
  lastReportAt: string;
  complaintIds: string[];
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'citizens' | 'sql' | 'stats'>('citizens');
  const [citizenUsers, setCitizenUsers] = useState<CitizenUserItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [sqlDump, setSqlDump] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch citizen users
      const usersRes = await fetch('/api/admin/citizen-users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        setCitizenUsers(data.users || []);
      }

      // 2. Fetch stats
      const statsRes = await fetch('/api/admin/database-stats');
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
      }

      // 3. Fetch SQL export
      const sqlRes = await fetch('/api/admin/export-postgresql');
      if (sqlRes.ok) {
        const text = await sqlRes.text();
        setSqlDump(text);
      }
    } catch (err) {
      console.error('Failed to load database admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlDump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlDump], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'metropolis_civic_dump.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Database & PostgreSQL User Storage</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                  PERSISTENT CLOUD SYNC
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All generated user IDs, profiles, complaints, and RBAC logs stored persistently and exportable to PostgreSQL.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-4 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('citizens')}
            className={`pb-2.5 px-1 border-b-2 flex items-center space-x-1.5 cursor-pointer transition-colors ${
              activeTab === 'citizens'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Generated Citizen User IDs ({citizenUsers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-1 border-b-2 flex items-center space-x-1.5 cursor-pointer transition-colors ${
              activeTab === 'sql'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Complete PostgreSQL SQL Dump</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`pb-2.5 px-1 border-b-2 flex items-center space-x-1.5 cursor-pointer transition-colors ${
              activeTab === 'stats'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Database Integrity & Schema</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'citizens' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <div>
                  <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Persistent Citizen Profiles & Generated IDs
                  </h3>
                  <p className="text-xs text-indigo-800 mt-0.5">
                    Every issue submission automatically generates or links a persistent Citizen User ID stored in the database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PostgreSQL .sql</span>
                </button>
              </div>

              {citizenUsers.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
                  <p className="font-semibold text-slate-700">No citizen submissions recorded yet</p>
                  <p className="mt-1">
                    Submit an issue via the Citizen Portal to see the auto-generated Citizen User ID recorded here.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Citizen User ID</th>
                        <th className="py-2.5 px-3">Name / Identity</th>
                        <th className="py-2.5 px-3">Email / Contact</th>
                        <th className="py-2.5 px-3 text-center">Reports Filed</th>
                        <th className="py-2.5 px-3">Associated Tickets</th>
                        <th className="py-2.5 px-3">First Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {citizenUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                            {u.citizenId}
                          </td>
                          <td className="py-2.5 px-3 font-semibold">{u.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <div>{u.email}</div>
                            {u.phone && u.phone !== 'N/A' && (
                              <div className="text-[11px] text-slate-400">{u.phone}</div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">{u.totalReportsFiled}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {u.complaintIds?.join(', ') || 'N/A'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                            {u.firstReportAt
                              ? new Date(u.firstReportAt).toLocaleDateString()
                              : 'Recent'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    PostgreSQL Executable Migration Script
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct drop-in SQL containing table schemas (DDL) and live INSERT statements.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSql}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl border border-slate-200 bg-slate-950 p-4 overflow-hidden">
                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed">
                  {sqlDump || '-- Loading PostgreSQL dump...'}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Government Officers
                  </span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats?.counts?.governmentOfficers ?? 6}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Configured & Isolated
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Citizen Users
                  </span>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">
                    {stats?.counts?.citizenUsers ?? citizenUsers.length}
                  </p>
                  <span className="text-[10px] text-indigo-700 font-semibold">
                    Persistent User IDs
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Complaints</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats?.counts?.complaints ?? 0}
                  </p>
                  <span className="text-[10px] text-slate-500">Live Work Orders</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Audit Logs</span>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {stats?.counts?.securityAuditLogs ?? 0}
                  </p>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Security & RBAC Ledger
                  </span>
                </div>
              </div>

              {/* Database Schema Map */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  PostgreSQL & Cloud Firestore Schema Integration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <p className="font-bold text-slate-900">Table: `citizen_users`</p>
                    <p className="text-slate-500 mt-0.5">
                      Stores citizen user identifiers (`citizen_id`), contact details, submission frequency, and associated work orders.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <p className="font-bold text-slate-900">Table: `gov_users`</p>
                    <p className="text-slate-500 mt-0.5">
                      Enforces Role-Based Access Control and departmental boundaries (`role`, `department_id`, `clearance_level`).
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <p className="font-bold text-slate-900">Table: `complaints`</p>
                    <p className="text-slate-500 mt-0.5">
                      Municipal work orders linked to `citizen_id` and verified by autonomous triage agents.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <p className="font-bold text-slate-900">Table: `gov_audit_logs`</p>
                    <p className="text-slate-500 mt-0.5">
                      Immutable trail recording logins, dispatch operations, and `ACTION_DENIED_403` isolation enforcement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Unified Storage: Persistent Firestore + Direct PostgreSQL Migration</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
