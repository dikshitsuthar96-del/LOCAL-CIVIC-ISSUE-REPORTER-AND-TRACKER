import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Download,
  Printer,
  FileText,
  Building2,
  Clock,
  MapPin,
  AlertTriangle,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Complaint } from '../types.js';
import { generateComplaintPDF } from '../utils/pdfGenerator.js';
import { useLanguage } from '../context/LanguageContext.js';

interface ComplaintSuccessModalProps {
  isOpen: boolean;
  complaint: Complaint | null;
  onClose: () => void;
  onTrackLive: (complaint: Complaint) => void;
}

export const ComplaintSuccessModal: React.FC<ComplaintSuccessModalProps> = ({
  isOpen,
  complaint,
  onClose,
  onTrackLive,
}) => {
  const { language, t } = useLanguage();
  const [copiedId, setCopiedId] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(complaint.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleDownloadPDF = () => {
    generateComplaintPDF(complaint);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
        {/* Animated Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden text-slate-900 my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
        >
          {/* Top Tricolor Strip */}
          <div className="h-1.5 w-full flex">
            <div className="h-full w-1/3 bg-[#ff9933]" />
            <div className="h-full w-1/3 bg-white border-y border-slate-200" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>

          {/* Close X Button in top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 sm:p-7 space-y-5">
            {/* Header with celebratory seal & checkmark */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 shadow-sm animate-bounce-subtle">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  NOTIFICATION • CIVIC DOSSIER REGISTERED
                </span>
                <h2
                  id="success-modal-title"
                  className="text-xl sm:text-2xl font-extrabold text-[#0b2239] mt-1"
                >
                  Complaint Registered Successfully!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
                  Your grievance has been ingested by <strong>Civic Sahayak</strong> and routed to the competent municipal authority with highest priority.
                </p>
              </div>
            </div>

            {/* Prominent Docket & Work Order Reference Box */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Official Grievance Tracking ID
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#0b2239]">
                    {complaint.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 text-slate-500 hover:text-blue-700 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Copy Tracking ID"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {copiedId && (
                    <span className="text-[11px] text-emerald-600 font-semibold font-mono">Copied!</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  Work Order: <span className="font-mono font-bold text-slate-700">{complaint.officialReferenceNumber}</span>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Assigned Priority
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold mt-1 ${
                    complaint.priority === 'EMERGENCY'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : complaint.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  {complaint.priority}
                </span>
              </div>
            </div>

            {/* Grievance Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start space-x-2.5">
                <Building2 className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Assigned Department</span>
                  <span className="font-bold text-slate-900 block truncate">{complaint.departmentName}</span>
                  <span className="text-[10px] text-slate-500">Jurisdiction: {complaint.departmentId}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Location / Site</span>
                  <span className="font-bold text-slate-900 block truncate">{complaint.location}</span>
                  <span className="text-[10px] text-slate-500">Status: {complaint.status}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Resolution SLA</span>
                  <span className="font-bold text-slate-900 block">48 - 72 Hours Guaranteed</span>
                  <span className="text-[10px] text-slate-500">Subject to physical inspection</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Citizen Rights</span>
                  <span className="font-bold text-slate-900 block">Photo Proof Required</span>
                  <span className="text-[10px] text-slate-500">Before & After sign-off</span>
                </div>
              </div>
            </div>

            {/* Highlighted PDF Download Notice Banner */}
            <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-emerald-900">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Save Grievance Report to Local Device (PDF)</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Click below to download the official municipal acknowledgement report in <strong>PDF format directly to your local storage device</strong> (computer or mobile). You can also print the physical receipt immediately.
              </p>
            </div>

            {/* Action Buttons: Download PDF, Print, Track Live */}
            <div className="space-y-2.5 pt-2">
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Primary: Print / Download PDF to Local Storage */}
                <button
                  type="button"
                  id="modal-download-pdf-btn"
                  onClick={handleDownloadPDF}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadSuccess
                      ? '✓ Saved to Local Storage!'
                      : 'Download PDF Report to Device'}
                  </span>
                </button>

                {/* Secondary: Print Receipt */}
                <button
                  type="button"
                  id="modal-print-receipt-btn"
                  onClick={handlePrint}
                  className="py-3 px-4 bg-white hover:bg-slate-100 active:scale-[0.99] border-2 border-slate-300 text-slate-800 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  title="Print paper receipt"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Track Live button */}
                <button
                  type="button"
                  id="modal-track-live-btn"
                  onClick={() => {
                    onClose();
                    onTrackLive(complaint);
                  }}
                  className="flex-1 py-2.5 px-3 bg-[#0b2239] hover:bg-[#153457] text-white font-semibold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#ff9933]" />
                  <span>Track Status in Live Tracker</span>
                </button>

                {/* Dismiss button */}
                <button
                  type="button"
                  id="modal-dismiss-btn"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Close & View Docket
                </button>
              </div>
            </div>

            {/* Official Footer Disclaimer */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span>NIC CPGRAMS • Electronic Public Grievance Acknowledgement</span>
              <span className="font-mono">SLA Ref: CPGRAMS-2026</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
