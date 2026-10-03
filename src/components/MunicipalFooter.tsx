import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Phone, Mail, FileText, Globe, X, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { CitizenCharterModal } from './CitizenCharterModal.js';

interface MunicipalFooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenWorkflowGuide?: () => void;
}

export const MunicipalFooter: React.FC<MunicipalFooterProps> = ({
  onNavigateSection,
  onOpenWorkflowGuide,
}) => {
  const { language, t } = useLanguage();
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{ title: string; subtitle: string; content: string[] } | null>(null);

  const openRTI = () => {
    setInfoModal({
      title: language === 'hi' ? 'सूचना का अधिकार (RTI) प्रकटीकरण' : 'Right to Information (RTI) Mandatory Disclosure',
      subtitle: language === 'hi' ? 'धारा 4(1)(b) - पारदर्शिता एवं उत्तरदायित्व' : 'Section 4(1)(b) - Transparency & Public Accountability',
      content: [
        language === 'hi'
          ? 'लोक सूचना अधिकारी (PIO): कमरा नं. 102, प्रथम तल, केंद्रीय नगर निगम भवन।'
          : 'Public Information Officer (PIO): Room 102, 1st Floor, Central Municipal Civic Center.',
        language === 'hi'
          ? 'प्रथम अपीलीय प्राधिकारी (FAA): अतिरिक्त नगर आयुक्त (प्रशासन), संपर्क: faa-rti@metromunicipal.gov.in'
          : 'First Appellate Authority (FAA): Addl. Municipal Commissioner (Admin), Contact: faa-rti@metromunicipal.gov.in',
        language === 'hi'
          ? 'नागरिक आरटीआई अधिनियम 2005 के अंतर्गत 30 कार्य दिवसों के भीतर आधिकारिक प्रपत्र या ऑनलाइन आवेदन कर सकते हैं।'
          : 'Citizens can file digital or physical applications under the RTI Act, 2005 with statutory disposal within 30 days.',
      ],
    });
  };

  const openFAQ = () => {
    setInfoModal({
      title: language === 'hi' ? 'नागरिक अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Citizen Frequently Asked Questions (FAQ)',
      subtitle: language === 'hi' ? 'शिकायत निवारण एवं सेवा नियमावली' : 'Civic Redressal & Portal Operations',
      content: [
        language === 'hi'
          ? 'प्र. शिकायत दर्ज करने के बाद क्या होता है? - प्रणाली स्वतः एआई द्वारा श्रेणीबद्ध कर संबंधित जोनल इंजीनियर को कार्य आदेश प्रेषित करती है।'
          : 'Q: What happens after filing a complaint? - AI engine validates GPS, assigns jurisdiction and alerts the ward junior engineer immediately.',
        language === 'hi'
          ? 'प्र. स्थिति कैसे ट्रैक करें? - पोर्टल पर 12-अंकीय टोकन (उदा. CMP-2025-0842) दर्ज करें या पंजीकृत मोबाइल नंबर से खोजें।'
          : 'Q: How to track status? - Enter your unique reference number (e.g. CMP-2025-0842) in the tracker for real-time stage updates.',
        language === 'hi'
          ? 'प्र. यदि समय पर समाधान न हो तो? - नागरिक चार्टर एसएलए उल्लंघन पर स्वतः वरिष्ठ आयुक्त को एस्केलेशन अलर्ट भेजा जाता है।'
          : 'Q: What if deadline expires? - Breached SLAs trigger automated escalation to the Municipal Commissioner desk.',
      ],
    });
  };

  const openAccessibility = () => {
    setInfoModal({
      title: language === 'hi' ? 'अभिगम्यता वक्तव्य (Accessibility)' : 'Accessibility Compliance Statement',
      subtitle: language === 'hi' ? 'WCAG 2.1 AA एवं GIGW 3.0 दिशानिर्देश' : 'WCAG 2.1 AA & GIGW 3.0 Conformance',
      content: [
        language === 'hi'
          ? 'यह पोर्टल भारत सरकार के डिजिटल दिशा-निर्देशों (GIGW 3.0) तथा अंतरराष्ट्रीय WCAG 2.1 लेवल AA मानकों के अनुरूप तैयार किया गया है।'
          : 'This portal is designed in compliance with Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 Level AA criteria.',
        language === 'hi'
          ? 'स्क्रीन रीडर उपयोगकर्ताओं हेतु स्पष्ट ARIA लेबल्स, उच्च-कंट्रास्ट मोड एवं पूर्ण कीबोर्ड नेविगेशन समर्थन उपलब्ध है।'
          : 'Supports full screen-reader semantic landmarks, high contrast ratios (4.5:1+), keyboard navigation, and bilingual localization.',
      ],
    });
  };

  const openPrivacy = () => {
    setInfoModal({
      title: language === 'hi' ? 'गोपनीयता नीति एवं डेटा सुरक्षा' : 'Privacy Policy & Citizen Data Protection',
      subtitle: language === 'hi' ? 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम' : 'Digital Personal Data Protection Act Standards',
      content: [
        language === 'hi'
          ? 'नागरिकों का मोबाइल नंबर, ईमेल एवं जीपीएस केवल शिकायत सत्यापन एवं समाधान हेतु सुरक्षित एन्क्रिप्शन के साथ रखा जाता है।'
          : 'Citizen contact and location records are strictly encrypted in transit and at rest, accessible only to authorized municipal officers.',
        language === 'hi'
          ? 'यह डेटा किसी तीसरे पक्ष के साथ साझा या विज्ञापनों हेतु उपयोग नहीं किया जाता है।'
          : 'No personal data is shared with external commercial parties. All records adhere to national public records archiving policies.',
      ],
    });
  };

  return (
    <footer className="w-full bg-[#0b2239] text-slate-300 border-t-4 border-[#ff9933] text-xs select-none">
      {/* Tricolor Government Border Accent */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-[#ff9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Main 4-Column Government Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-700">
          {/* Column 1: About the Department */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {t.footerAboutDept}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => setIsCharterOpen(true)}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerCitizenCharter}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openRTI}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerRTI}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection && onNavigateSection('departments')}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerOrgStructure}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection && onNavigateSection('departments')}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerZonalOffices}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Citizen Helpdesk */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {t.footerCitizenHelpdesk}
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#ff9933] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Toll-Free:</strong> 1800-11-2026 / 112
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#ff9933] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Email:</strong> grievances@metromunicipal.gov.in
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <FileText className="w-3.5 h-3.5 text-[#ff9933] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Working Hours:</strong> Mon-Sat (09:30 AM - 06:00 PM)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Portals & Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {t.footerImpPortals}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <span className="flex items-center space-x-1 hover:text-[#ff9933] transition-colors">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>{t.footerCPGRAMS}</span>
                </span>
              </li>
              <li>
                <span className="flex items-center space-x-1 hover:text-[#ff9933] transition-colors">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>{t.footerNationalPortal}</span>
                </span>
              </li>
              <li>
                <span className="flex items-center space-x-1 hover:text-[#ff9933] transition-colors">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>{t.footerMyGov}</span>
                </span>
              </li>
              <li>
                <span className="flex items-center space-x-1 hover:text-[#ff9933] transition-colors">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>{t.footerDigitalIndia}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Governance */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {t.footerHelpGov}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={openFAQ}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerFAQ}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openAccessibility}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerAccessibility}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openPrivacy}
                  className="hover:text-[#ff9933] transition-colors cursor-pointer text-left"
                >
                  {t.footerPrivacy}
                </button>
              </li>
              {onOpenWorkflowGuide && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenWorkflowGuide}
                    className="text-[#ffb049] hover:underline transition-colors cursor-pointer text-left font-semibold"
                  >
                    {t.footerWorkflowGuide}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Compliance & Copyright Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <span>{t.footerCopyright}</span>
            <span className="hidden sm:inline">•</span>
            <span>{t.footerContentManaged}</span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.footerLastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Citizen Charter Modal */}
      <CitizenCharterModal isOpen={isCharterOpen} onClose={() => setIsCharterOpen(false)} />

      {/* Government Info Disclosure Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-slate-300 rounded-xs max-w-lg w-full shadow-2xl p-5 space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-blue-100 text-blue-900 rounded-xs">
                  <Info className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0b2239]">{infoModal.title}</h3>
                  <p className="text-[11px] text-slate-500">{infoModal.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-xs"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 py-1">
              {infoModal.content.map((paragraph, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs leading-relaxed">
                  {paragraph}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="px-4 py-1.5 bg-[#0b2239] text-white font-bold text-xs rounded-xs cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
