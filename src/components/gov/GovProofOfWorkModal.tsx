import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  X,
  Camera,
  UploadCloud,
  FileCheck,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Complaint, GovUser } from '../../types.js';
import { getCivicAfterImage } from '../../data/civicImages.js';

interface GovProofOfWorkModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  currentOfficer: GovUser;
  onResolved: (updatedComplaint: Complaint) => void;
}

export const GovProofOfWorkModal: React.FC<GovProofOfWorkModalProps> = ({
  complaint,
  isOpen,
  onClose,
  currentOfficer,
  onResolved,
}) => {
  if (!isOpen || !complaint) return null;

  const defaultAfterPhoto = getCivicAfterImage(complaint.issueType) || complaint.photoUrl;

  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(defaultAfterPhoto);
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    'Certified physical repair completed by Municipal Engineering Unit. Surface leveled, debris removed, site safe for public use.'
  );
  const [materialsUsed, setMaterialsUsed] = useState<string>(
    'Hot asphalt mix (Class 2), sealant emulsion, safety cones & perimeter tape'
  );
  const [certificateNumber, setCertificateNumber] = useState<string>(
    `CERT-MUNI-${Date.now().toString().slice(-6)}`
  );
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload handler (converts user uploaded photo to base64 DataURL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPEG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAfterPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!afterPhotoUrl) {
      setErrorMessage('Proof of Work photo is mandatory to certify resolution.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const payload = {
        action: 'update_status',
        status: 'RESOLVED',
        resolutionPhotoUrl: afterPhotoUrl,
        resolutionNotes: resolutionNotes.trim(),
        materialsUsed: materialsUsed.trim(),
        actorName: `${currentOfficer.name} (${currentOfficer.badgeNumber})`,
        proofOfWork: {
          completedAt: new Date().toISOString(),
          resolvedByOfficer: currentOfficer.name,
          officerBadge: currentOfficer.badgeNumber,
          departmentName: currentOfficer.departmentName,
          resolutionNotes: resolutionNotes.trim(),
          beforePhotoUrl: complaint.photoUrl,
          afterPhotoUrl: afterPhotoUrl,
          materialsUsed: materialsUsed.trim(),
          certificateNumber: certificateNumber.trim(),
          sentToCitizen: true,
          citizenNotificationChannel: 'SMS',
          citizenContact: complaint.submitterPhone || '+91 98765-00000',
          dispatchedTimestamp: new Date().toISOString(),
          proofOfWorkDispatchedMessage: `Metropolis Municipal Alert: Your grievance #${complaint.id} has been SOLVED. Photo proof of completed work dispatched to citizen portal.`,
        },
      };

      const res = await fetch(`/api/gov/complaints/${complaint.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentOfficer.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to submit resolution proof.');
      }

      onResolved(data.complaint);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting resolution proof.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden font-sans text-xs max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0b2239] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xs bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Mark Complaint Resolved (Mandatory Proof Upload)
              </h2>
              <p className="text-[10px] text-white/70">
                Ticket #{complaint.officialReferenceNumber || complaint.id} • {complaint.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleResolveSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Side-by-Side Photo Comparison (Before vs After) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              1. Photographic Evidence Comparison (Before vs. After Repair):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Before Photo */}
              <div className="border border-slate-300 rounded-sm overflow-hidden bg-slate-900">
                <div className="bg-slate-800 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Before (Citizen Report)</span>
                  <span className="text-amber-400 font-mono text-[9px]">Original</span>
                </div>
                <div className="h-40 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={complaint.photoUrl}
                    alt="Before Defect"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* After Photo (Proof of Work) */}
              <div className="border-2 border-emerald-500 rounded-sm overflow-hidden bg-slate-900 shadow-xs">
                <div className="bg-emerald-800 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>After (Proof of Work)</span>
                  <span className="text-emerald-200 font-mono text-[9px]">Mandatory</span>
                </div>
                <div className="h-40 bg-slate-950 flex items-center justify-center overflow-hidden relative group">
                  <img
                    src={afterPhotoUrl}
                    alt="After Proof of Work"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded text-xs font-bold shadow cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 block text-xs">
                  Upload Official Repair Proof Photo:
                </span>
                <span className="text-[10px] text-slate-500">
                  Upload file directly from site or select a certified municipal inspection photo.
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-[#0b2239] flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-2xs"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Browse Local Photo</span>
              </button>
            </div>

            {/* Quick Sample Photos for Testing */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                Or Select Certified Sample Resolution Evidence:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: 'Repaved Asphalt Road',
                    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&auto=format&fit=crop&q=80',
                  },
                  {
                    label: 'Sanitation Cleaned Ground',
                    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
                  },
                  {
                    label: 'Fixed Pipeline Valve',
                    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
                  },
                  {
                    label: 'Working Street Light',
                    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
                  },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAfterPhotoUrl(s.url)}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 border border-slate-200 rounded text-[10px] text-slate-700 font-medium cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Field Resolution Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">
              2. Supervising Engineer Resolution Notes:
            </label>
            <textarea
              rows={2}
              required
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Detail the technical remediation executed..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
            />
          </div>

          {/* Materials Used & Certificate Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                3. Materials Used:
              </label>
              <input
                type="text"
                required
                value={materialsUsed}
                onChange={(e) => setMaterialsUsed(e.target.value)}
                placeholder="e.g. Cold asphalt mix, seal emulsion"
                className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                4. Municipal Certificate Number:
              </label>
              <input
                type="text"
                required
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-sm text-xs font-mono text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
              />
            </div>
          </div>

          {/* Automated Citizen Verification Dispatch Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-[11px] text-emerald-900 flex items-start space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Statutory Citizen Verification Dispatch:</span>
              <span>
                Upon marking resolved, this photographic evidence will be dispatched directly to citizen mobile ({complaint.submitterPhone || 'SMS Gateway'}) for statutory citizen verification and star rating.
              </span>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-sm flex items-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
              <span>Certify &amp; Mark Resolved</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
