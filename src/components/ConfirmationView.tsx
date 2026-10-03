import React, { useState } from 'react';
import {
  CheckCircle,
  Building2,
  AlertTriangle,
  ArrowRight,
  Eye,
  PlusCircle,
  FileCheck2,
  Clock,
  Download,
  Printer,
  FileText,
} from 'lucide-react';
import { Complaint, AgentTraceNode } from '../types.js';
import { generateComplaintPDF } from '../utils/pdfGenerator.js';

interface ConfirmationViewProps {
  complaint: Complaint;
  traces: AgentTraceNode[];
  confirmation?: {
    complaintId: string;
    issueType: string;
    departmentName: string;
    priority: string;
    message: string;
  };
  onViewComplaint: (complaint: Complaint) => void;
  onReportAnother: () => void;
  onGoToDashboard: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  complaint,
  traces,
  confirmation,
  onViewComplaint,
  onReportAnother,
  onGoToDashboard,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    generateComplaintPDF(complaint);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2 shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Municipal Complaint Registered
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
          <strong>Civic Sahayak (Intake AI)</strong> has successfully ingested, visually classified, and filed your complaint with the municipal authorities.
        </p>
      </div>

      {/* Official Receipt Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Ticket Header & Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Citizen Tracking Identifier
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-tight">
                {complaint.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900">
                {complaint.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-1.5">
              <p>
                Official Work Order: <span className="font-mono text-neutral-700 font-semibold">{complaint.officialReferenceNumber}</span>
              </p>
              {complaint.citizenId && (
                <>
                  <span>•</span>
                  <p className="inline-flex items-center bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold text-[11px] border border-indigo-100">
                    Citizen User ID: {complaint.citizenId}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Assigned Priority
            </span>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                  complaint.priority === 'EMERGENCY'
                    ? 'bg-rose-100 text-rose-800'
                    : complaint.priority === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                {complaint.priority} PRIORITY
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center text-xs text-slate-500 space-x-1.5 font-medium">
              <Building2 className="w-4 h-4 text-slate-700" />
              <span>Routed Government Department</span>
            </div>
            <p className="text-sm font-bold text-slate-900 pt-0.5">{complaint.departmentName}</p>
            <p className="text-xs text-slate-500">Jurisdiction code: {complaint.departmentId}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center text-xs text-slate-500 space-x-1.5 font-medium">
              <FileCheck2 className="w-4 h-4 text-slate-700" />
              <span>Classified Issue Category</span>
            </div>
            <p className="text-sm font-bold text-slate-900 pt-0.5 capitalize">
              {(complaint.issueType || (complaint as any).category || '').replace('_', ' ')}
            </p>
            <p className="text-xs text-slate-500 truncate">{complaint.location}</p>
          </div>
        </div>

        {/* Synthesized Formal Summary */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block">
            Civic Sahayak Synthesized Work Ticket
          </span>
          <h4 className="text-sm font-semibold text-neutral-900">{complaint.title}</h4>
          <p className="text-xs text-neutral-700 leading-relaxed">{complaint.description}</p>
        </div>

        {/* What Happens Next Roadmap */}
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Autonomous Tracking Lifecycle
          </h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">Civic Sahayak Intake Verification (Completed)</p>
                <p className="text-xs text-neutral-500">
                  Multimodal vision validated your photo and routed the ticket to {complaint.departmentName}.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">Nagrik Sandesh (Notification Agent) Scheduled Watch</p>
                <p className="text-xs text-neutral-500">
                  Nagrik Sandesh periodically polls the municipal work-order queue for progress (e.g. crew dispatched, parts ordered).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">Plain-Language Citizen Alerts</p>
                <p className="text-xs text-neutral-500">
                  Whenever status codes change, Nagrik Sandesh translates technical government jargon into clear, reassuring citizen language and notifies you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Official PDF Document & Local Storage Download Banner */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-emerald-950">Official Grievance Acknowledgement Dossier</h5>
              <p className="text-[11px] text-emerald-800">
                Download PDF report directly to your local storage device or print an official paper receipt.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              id="confirm-download-pdf-btn"
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
              title="Download PDF to device local storage"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? '✓ Saved to Device!' : 'Save PDF to Device'}</span>
            </button>

            <button
              type="button"
              id="confirm-print-btn"
              onClick={handlePrint}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              title="Print receipt"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="track-complaint-now-btn"
            onClick={() => onViewComplaint(complaint)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Track This Complaint Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onReportAnother}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-neutral-500" />
              <span>Report Another</span>
            </button>

            <button
              onClick={onGoToDashboard}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
