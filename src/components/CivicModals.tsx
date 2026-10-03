import React from 'react';
import { X, Phone, AlertTriangle, ShieldAlert, HeartPulse, Flame, FileText, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const helplines = [
    { name: 'National Emergency Response (All in One)', number: '112', icon: ShieldAlert, color: 'text-rose-700 bg-rose-50' },
    { name: 'Municipal Control Room & Disaster Desk', number: '1800-11-2026', icon: Phone, color: 'text-blue-700 bg-blue-50' },
    { name: 'Fire & Rescue Services', number: '101', icon: Flame, color: 'text-orange-700 bg-orange-50' },
    { name: 'Ambulance & Medical Emergency', number: '102 / 108', icon: HeartPulse, color: 'text-emerald-700 bg-emerald-50' },
    { name: 'Police Control Room', number: '100', icon: ShieldAlert, color: 'text-indigo-700 bg-indigo-50' },
    { name: 'Women Helpline Desk', number: '1091', icon: Phone, color: 'text-purple-700 bg-purple-50' },
    { name: 'Childline Emergency Desk', number: '1098', icon: Phone, color: 'text-amber-700 bg-amber-50' },
    { name: 'Electric Hazard / Transformer Spark', number: '1912', icon: AlertTriangle, color: 'text-yellow-700 bg-yellow-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border-2 border-slate-300 rounded-xs max-w-lg w-full shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-rose-100 text-rose-700 rounded-xs">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b2239]">
              {t.emergencyHelplinesTitle}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          For critical life safety, fire, open electric live wires, or active water main bursts, please contact immediate dispatch operators below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {helplines.map((line, idx) => {
            const Icon = line.icon;
            return (
              <div key={idx} className="p-2.5 border border-slate-200 rounded-xs bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-xs flex items-center justify-center shrink-0 ${line.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">{line.name}</div>
                    <div className="text-xs font-mono font-bold text-blue-900">{line.number}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0b2239] text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

interface NoticesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNotice?: { date: string; title: string; dept: string; desc: string } | null;
}

export const NoticesModal: React.FC<NoticesModalProps> = ({ isOpen, onClose, selectedNotice }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const defaultNotice = {
    date: '14 Sep 2026',
    title: 'Road maintenance and resurfacing work scheduled in Ward 12 & 14',
    dept: 'Public Works Department (PWD)',
    desc: 'Notice is hereby given that mechanized milling and hot-mix bitumen overlay will be executed along Sector 4 Commercial Belt from 10:00 PM to 05:00 AM. Traffic will be diverted via Outer Ring Road. Citizens are requested to cooperate.',
  };

  const notice = selectedNotice || defaultNotice;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border-2 border-slate-300 rounded-xs max-w-lg w-full shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-amber-100 text-amber-800 rounded-xs">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b2239]">
              {t.officialCircularTitle}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-3 border border-slate-200 rounded-xs space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-200">
            <span className="font-mono font-bold text-slate-700 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{notice.date}</span>
            </span>
            <span className="font-bold text-blue-900">{notice.dept}</span>
          </div>

          <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
          <p className="text-slate-700 leading-relaxed text-xs">{notice.desc}</p>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-500 font-mono">Order No: MUN/ENG/2026/09/NOT-884</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0b2239] text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            {t.acknowledgeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CitizenServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport?: () => void;
}

export const CitizenServicesModal: React.FC<CitizenServicesModalProps> = ({
  isOpen,
  onClose,
  onNavigateToReport,
}) => {
  const { language, t } = useLanguage();
  if (!isOpen) return null;

  const services = [
    {
      id: 'srv-birth-death',
      title: language === 'hi' ? 'जन्म एवं मृत्यु प्रमाण पत्र' : 'Birth & Death Registration & Certificates',
      dept: language === 'hi' ? 'स्वास्थ्य एवं सांख्यिकी विभाग' : 'Health & Vital Statistics Dept',
      tat: language === 'hi' ? '3 कार्य दिवस' : '3 Working Days',
      fee: language === 'hi' ? 'निःशुल्क (21 दिनों में)' : 'Free (within 21 days)',
      desc: language === 'hi' ? 'डिजिटल रूप से हस्ताक्षरित जन्म एवं मृत्यु प्रमाण पत्र डाउनलोड एवं सत्यापन।' : 'Instant verification and digital issuance of digitally signed registration records.',
    },
    {
      id: 'srv-trade-license',
      title: language === 'hi' ? 'व्यापार एवं कारखाना लाइसेंस' : 'Municipal Trade & Factory License',
      dept: language === 'hi' ? 'राजस्व एवं लाइसेंसिंग विभाग' : 'Revenue & Licensing Dept',
      tat: language === 'hi' ? '7 कार्य दिवस' : '7 Working Days',
      fee: language === 'hi' ? 'श्रेणी अनुसार' : 'As per category',
      desc: language === 'hi' ? 'दुकानों, वाणिज्यिक प्रतिष्ठानों एवं लघु उद्योगों हेतु नया अथवा नवीनीकरण लाइसेंस।' : 'Fresh registration and annual renewal for retail shops, offices and factories.',
    },
    {
      id: 'srv-property-tax',
      title: language === 'hi' ? 'संपत्ति कर स्व-मूल्यांकन एवं भुगतान' : 'Property Tax Assessment & e-Receipt',
      dept: language === 'hi' ? 'कर निर्धारण एवं राजस्व विभाग' : 'Assessment & Collection Dept',
      tat: language === 'hi' ? 'तत्काल' : 'Instant',
      fee: language === 'hi' ? 'मूल्यांकन अनुसार' : 'As assessed',
      desc: language === 'hi' ? 'वार्ड अनुसार यूआईडी सर्च, बकाया कर भुगतान एवं आधिकारिक डिजिटल भुगतान रसीद।' : 'Check dues by Property UID, make digital payment, and obtain verified tax clearance.',
    },
    {
      id: 'srv-water-sewer',
      title: language === 'hi' ? 'नया घरेलू नल एवं सीवर कनेक्शन' : 'New Drinking Water & Sewer Connection',
      dept: language === 'hi' ? 'जल आपूर्ति एवं स्वच्छता बोर्ड' : 'Water Supply & Sewerage Board',
      tat: language === 'hi' ? '5 कार्य दिवस' : '5 Working Days',
      fee: language === 'hi' ? 'मानक मीटर शुल्क' : 'Standard Meter Fee',
      desc: language === 'hi' ? 'पाइपलाइन निरीक्षण, मीटर स्थापना एवं नया वैध जल उपभोक्ता खाता आवंटन।' : 'Site inspection, meter installation, and consumer ledger allocation.',
    },
    {
      id: 'srv-building-plan',
      title: language === 'hi' ? 'भवन निर्माण अनुमति (ओबीपीएस)' : 'Online Building Plan Sanction (OBPS)',
      dept: language === 'hi' ? 'नगर नियोजन एवं वास्तु विभाग' : 'Town Planning & Architecture',
      tat: language === 'hi' ? '15 कार्य दिवस' : '15 Working Days',
      fee: language === 'hi' ? 'कवर्ड एरिया अनुसार' : 'Based on plinth area',
      desc: language === 'hi' ? 'वास्तुकार लेआउट अनुमोदन, संरचनात्मक सुरक्षा प्रमाण पत्र एवं निर्माण स्वीकृति।' : 'Automated scrutiny of architectural drawings and structural stability verification.',
    },
    {
      id: 'srv-green-clearance',
      title: language === 'hi' ? 'वृक्ष छंटाई एवं हरित अनापत्ति प्रमाण पत्र' : 'Tree Pruning & Green Corridor NOC',
      dept: language === 'hi' ? 'उद्यान एवं वन प्रभाग' : 'Horticulture & Forestry Wing',
      tat: language === 'hi' ? '2 कार्य दिवस' : '2 Working Days',
      fee: language === 'hi' ? 'निःशुल्क' : 'Free',
      desc: language === 'hi' ? 'तारों या भवनों से टकराती शाखाओं की छंटाई एवं खतरनाक सूखे पेड़ों का सुरक्षित निष्कासन।' : 'Pruning branches near power lines and scientific removal of dead hazardous trees.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white border-2 border-slate-300 rounded-xs max-w-2xl w-full shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xs">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0b2239]">
                {language === 'hi' ? 'नगरपालिका नागरिक सेवाएं एवं प्रमाणपत्र डायरेक्टरी' : 'Municipal Citizen Services & Applications'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'आधिकारिक सेवा अधिकार (RTS) समय-सीमा के अंतर्गत उपलब्ध' : 'Delivered under Right to Public Service (RTS) Guarantee'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-3 border border-slate-200 rounded-xs bg-slate-50 hover:bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-slate-200/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{srv.title}</h4>
                  <span className="text-[10px] text-blue-900 font-semibold">{srv.dept}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px]">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-xs font-mono font-bold">
                    TAT: {srv.tat}
                  </span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded-xs font-mono">
                    {srv.fee}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-slate-500">
            {language === 'hi' ? 'किसी समस्या या शिकायत हेतु लोक शिकायत फॉर्म का उपयोग करें।' : 'Have a defect or maintenance issue? Use our Grievance Portal.'}
          </span>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {onNavigateToReport && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToReport();
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xs cursor-pointer"
              >
                {t.fileGrievanceBtn}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#0b2239] text-white font-bold text-xs rounded-xs cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
