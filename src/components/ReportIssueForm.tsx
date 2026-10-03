import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  Sparkles,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Edit3,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Complaint, AgentTraceNode, ImageAnalysisResult } from '../types.js';
import { useLanguage } from '../context/LanguageContext.js';
import { VoiceDictationButton } from './VoiceDictationButton.js';
import { useSupabaseAuth } from '../context/SupabaseAuthContext.js';

interface ReportIssueFormProps {
  onSuccess: (complaint: Complaint, traces: AgentTraceNode[], confirmation: any) => void;
  onCancel?: () => void;
  onTrackComplaint?: (complaintId: string) => void;
  initialCategory?: string | null;
}

// Verified real municipal photographs for 1-click test upload and category reference
const SAMPLE_PHOTOS = [
  {
    name: 'Road & Pothole',
    url: '/assets/civic/pothole.jpg',
    category: 'Road Defect',
  },
  {
    name: 'Broken Streetlight',
    url: '/assets/civic/streetlight.jpg',
    category: 'Electrical Defect',
  },
  {
    name: 'Garbage & Sanitation',
    url: '/assets/civic/garbage.jpg',
    category: 'Sanitation Defect',
  },
  {
    name: 'Water Supply / Leakage',
    url: '/assets/civic/water-leakage.jpg',
    category: 'Water Defect',
  },
  {
    name: 'Drainage / Waterlogging',
    url: '/assets/civic/drainage.jpg',
    category: 'Drainage Defect',
  },
  {
    name: 'Public Toilet',
    url: '/assets/civic/public-toilet.jpg',
    category: 'Sanitation Defect',
  },
  {
    name: 'Damaged Traffic / Road Sign',
    url: '/assets/civic/road-sign.jpg',
    category: 'Traffic Sign Defect',
  },
  {
    name: 'Illegal Garbage Dumping',
    url: '/assets/civic/illegal-dumping.jpg',
    category: 'Sanitation Defect',
  },
  {
    name: 'Stray Animals',
    url: '/assets/civic/stray-animals.jpg',
    category: 'Animal Hazard',
  },
  {
    name: 'Other Civic Issue',
    url: '/assets/civic/other-civic.jpg',
    category: 'Civic Infrastructure',
  },
];

// Official Municipal Civic Defect Categories
const CIVIC_CATEGORIES = [
  {
    id: 'pothole',
    nameEn: 'Road & Pothole Damage',
    nameHi: 'सड़क एवं गड्ढा',
    deptEn: 'Public Works & Infrastructure',
    deptHi: 'लोक निर्माण विभाग',
    icon: '🛣️',
    defaultDescEn: 'Roadway asphalt crater, cracked bitumen surface, or potholes causing vehicular and traffic hazard.',
    defaultDescHi: 'सड़क की डामर सतह क्षतिग्रस्त, गड्ढे एवं दरारें जिससे यातायात में बाधा हो रही है।',
  },
  {
    id: 'other',
    nameEn: 'Public Gate / Structure / Encroachment',
    nameHi: 'मुख्य द्वार / संरचना / अतिक्रमण',
    deptEn: 'Public Works & Urban Admin',
    deptHi: 'लोक निर्माण एवं शहरी प्रशासन',
    icon: '🏛️',
    defaultDescEn: 'Public gateway, entrance archway, perimeter wall damage, or unauthorized structural encroachment.',
    defaultDescHi: 'सार्वजनिक प्रवेश द्वार, मेहराब, चारदीवारी क्षति अथवा अनाधिकृत संरचनात्मक अतिक्रमण।',
  },
  {
    id: 'streetlight',
    nameEn: 'Broken Streetlight / Electrical Pole',
    nameHi: 'स्ट्रीट लाइट / बिजली का खंभा',
    deptEn: 'Electrical & Lighting',
    deptHi: 'विद्युत एवं प्रकाश व्यवस्था',
    icon: '💡',
    defaultDescEn: 'Defective street lamp fixture, non-functional luminaire, or hazardous dangling wiring.',
    defaultDescHi: 'खराब स्ट्रीट लाइट, बंद लैंप पोस्ट अथवा खतरनाक झूलते बिजली के तार।',
  },
  {
    id: 'garbage',
    nameEn: 'Garbage & Sanitation Dump',
    nameHi: 'कचरा एवं स्वच्छता',
    deptEn: 'Solid Waste Management',
    deptHi: 'ठोस अपशिष्ट प्रबंधन',
    icon: '🗑️',
    defaultDescEn: 'Overflowing municipal solid waste bin, strewn litter, or uncollected garbage pile on public pathway.',
    defaultDescHi: 'सार्वजनिक रास्ते पर फैला कचरा, भरा हुआ कूड़ेदान अथवा अनकलेक्टेड अपशिष्ट का ढेर।',
  },
  {
    id: 'water_leak',
    nameEn: 'Water Supply Pipeline Leak',
    nameHi: 'पानी का रिसाव / पाइपलाइन',
    deptEn: 'Water & Sewage Board',
    deptHi: 'जल एवं सीवेज बोर्ड',
    icon: '🚰',
    defaultDescEn: 'Pressurized water main pipeline fracture with continuous surface pooling and loss of drinking water.',
    defaultDescHi: 'पीने के पानी की मुख्य पाइपलाइन में भारी रिसाव एवं सड़क पर जल भराव।',
  },
  {
    id: 'drainage',
    nameEn: 'Blocked Drainage / Waterlogging',
    nameHi: 'जल निकासी / सीवर भराव',
    deptEn: 'Stormwater & Drainage',
    deptHi: 'जल निकासी प्रभाग',
    icon: '🌊',
    defaultDescEn: 'Clogged storm drain or open sewer overflow creating stagnant water stagnation and health hazard.',
    defaultDescHi: 'अवरुद्ध नाला अथवा सीवर का गंदा पानी सड़क पर फैलने से जल भराव।',
  },
  {
    id: 'tree_hazard',
    nameEn: 'Fallen Tree / Hazardous Branch',
    nameHi: 'पेड़ / खतरनाक शाखा',
    deptEn: 'Parks & Horticulture',
    deptHi: 'उद्यान एवं बागवानी',
    icon: '🌳',
    defaultDescEn: 'Storm-damaged tree trunk or heavy broken branch obstructing traffic lanes or power lines.',
    defaultDescHi: 'तूफान से टूटा पेड़ अथवा खतरनाक शाखा जिससे मार्ग या बिजली की तारें अवरुद्ध हैं।',
  },
  {
    id: 'sidewalk',
    nameEn: 'Broken Sidewalk / Footpath Paver',
    nameHi: 'फुटपाथ / पैदल मार्ग',
    deptEn: 'Pedestrian Infrastructure',
    deptHi: 'पैदल यात्री अवसंरचना',
    icon: '🚶',
    defaultDescEn: 'Uneven displaced concrete sidewalk pavers or broken pedestrian walkway kerb causing trip hazards.',
    defaultDescHi: 'टूटा हुआ अथवा असमतल फुटपाथ जिससे पैदल यात्रियों को गिरने का खतरा है।',
  },
  {
    id: 'traffic_signal',
    nameEn: 'Traffic Signal Outage',
    nameHi: 'ट्रैफिक सिग्नल खराबी',
    deptEn: 'Traffic Operations & Signals',
    deptHi: 'यातायात संचालन एवं सिग्नल',
    icon: '🚦',
    defaultDescEn: 'Intersection traffic light completely unlit or stuck in flashing error state creating collision risk.',
    defaultDescHi: 'चौराहे का ट्रैफिक सिग्नल बंद अथवा एरर मोड में जिससे दुर्घटना की आशंका है।',
  },
  {
    id: 'graffiti',
    nameEn: 'Graffiti / Public Defacement',
    nameHi: 'सार्वजनिक संपत्ति विरूपण',
    deptEn: 'Civic Enforcement',
    deptHi: 'नगर निगम प्रवर्तन',
    icon: '🎨',
    defaultDescEn: 'Unauthorized spray paint markings or illegal commercial posters defacing municipal civic infrastructure.',
    defaultDescHi: 'सार्वजनिक सरकारी संपत्ति अथवा दीवार पर अनधिकृत पोस्टर व विरूपण।',
  },
];

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  onSuccess,
  onCancel,
  onTrackComplaint,
  initialCategory,
}) => {
  const { language, t } = useLanguage();
  const { userId, requireAuth, session } = useSupabaseAuth();

  // Current Step: 1 (Photo) -> 2 (Description) -> 3 (Location) -> 4 (Contact) -> 5 (Review) -> 6 (Submitted)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Fetching GPS location...');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Category selection & user override
  const [selectedCategory, setSelectedCategory] = useState<string>('other');
  const [isUserEditedCategory, setIsUserEditedCategory] = useState(false);
  const [isUserEditedDescription, setIsUserEditedDescription] = useState(false);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // AI Vision state
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [aiDescription, setAiDescription] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Auto-fetch GPS on component mount and handle initialCategory preset
  useEffect(() => {
    handleGetLocation();

    if (initialCategory) {
      const match = SAMPLE_PHOTOS.find(
        (s) => s.name.toLowerCase().includes(initialCategory.toLowerCase()) ||
               s.category.toLowerCase().includes(initialCategory.toLowerCase()) ||
               initialCategory.toLowerCase().includes(s.name.toLowerCase())
      );
      if (match) {
        handleSelectSamplePhoto(match);
      }
    }
  }, [initialCategory]);

  // Fetch High-Accuracy GPS Location with Reverse Geocoding
  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setIsLocating(false);
      setLatitude(28.6139);
      setLongitude(77.209);
      setLocation('Civic Center Plaza, Ward 4, New Delhi');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        if (pos.coords.accuracy) {
          setLocationAccuracy(Math.round(pos.coords.accuracy));
        }

        // Query server reverse geocoding
        try {
          const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
          if (res.ok) {
            const data = await res.json();
            if (data.address) {
              setLocation(data.address);
              return;
            }
          }
        } catch (geoErr) {
          console.warn('[Reverse Geocode]:', geoErr);
        }
        setLocation(`${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E (GPS Verified Location)`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        if (!location || location === 'Fetching GPS location...') {
          setLatitude(28.6139);
          setLongitude(77.209);
          setLocation('Sector 12 Main Civic Road, Ward 4');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Trigger Vision Analysis on image load
  const triggerImageAnalysis = async (params: {
    photoBase64?: string | null;
    photoMimeType?: string | null;
    photoUrl?: string | null;
    description?: string;
  }) => {
    setIsAnalyzingImage(true);
    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data: ImageAnalysisResult = await res.json();
        setAiAnalysis(data);

        // Auto-select category from AI if user hasn't explicitly overridden
        if (!isUserEditedCategory) {
          setSelectedCategory(data.category);
        }

        const issuePart = data.detectedIssue || 'Civic infrastructure defect';
        const findingsPart = data.visualFindings ? ` (${data.visualFindings})` : '';
        const sevPart = data.severity ? ` [Priority: ${data.severity}]` : '';
        const generatedDesc = `${issuePart}${findingsPart}${sevPart}`;

        setAiDescription(generatedDesc);
        if (!isUserEditedDescription) {
          setDescription(generatedDesc);
        }
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setIsUserEditedCategory(true);
    const found = CIVIC_CATEGORIES.find((c) => c.id === catId);
    if (found) {
      const catLabel = language === 'hi' ? found.nameHi : found.nameEn;
      const deptLabel = language === 'hi' ? found.deptHi : found.deptEn;
      const defaultDesc = language === 'hi' ? found.defaultDescHi : found.defaultDescEn;

      setAiAnalysis((prev) => ({
        detectedIssue: catLabel,
        category: catId as any,
        suggestedDepartmentId: catId === 'other' ? 'dept_transport' : (prev?.suggestedDepartmentId || 'dept_transport'),
        suggestedDepartmentName: deptLabel,
        confidenceScore: 0.95,
        severity: prev?.severity || 'MEDIUM',
        visualFindings: prev?.visualFindings || `${catLabel} verified by citizen.`,
        safetyRisks: prev?.safetyRisks || ['Field verification scheduled'],
        isCivicIssue: true,
        relevanceExplanation: `Citizen verified category: ${catLabel}`,
        defectLocationType: 'road',
      }));

      // If description wasn't manually typed by user, update to the selected category's description
      if (!isUserEditedDescription) {
        setDescription(defaultDesc);
      }
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPEG, WebP)');
      return;
    }
    setErrorMessage(null);
    setPhotoMimeType(file.type);
    setPhotoUrl(null);

    // Reset previous auto-generated sample description so new photo starts clean
    if (!isUserEditedDescription) {
      setDescription('');
      setAiDescription('');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
      triggerImageAnalysis({
        photoBase64: result,
        photoMimeType: file.type,
        description: isUserEditedDescription ? description : '',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSamplePhoto = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setErrorMessage(null);
    setPhotoPreview(sample.url);
    setPhotoUrl(sample.url);
    setPhotoBase64(null);
    setPhotoMimeType('image/jpeg');

    if (!isUserEditedDescription) {
      setDescription('');
      setAiDescription('');
    }

    triggerImageAnalysis({
      photoUrl: sample.url,
      description: isUserEditedDescription ? description : '',
    });
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    setPhotoBase64(null);
    setPhotoMimeType(null);
    setPhotoUrl(null);
    setAiAnalysis(null);
    setAiDescription('');
    setIsUserEditedCategory(false);
    if (!isUserEditedDescription) {
      setDescription('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Step 1 -> Step 2
  const handleNextFromPhoto = () => {
    if (!photoPreview) {
      setErrorMessage('Please upload or select a photo of the civic problem.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3
  const handleNextFromDescription = () => {
    if (!description.trim()) {
      setErrorMessage('Please enter or verify the description of the issue.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(3);
  };

  // Step 3 -> Step 4
  const handleNextFromLocation = () => {
    if (!location.trim()) {
      setErrorMessage('Please confirm the location of the civic issue.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(4);
  };

  // Step 4 -> Step 5
  const handleNextFromContact = () => {
    const cleanedMobile = mobileNumber.trim();
    if (!cleanedMobile) {
      setErrorMessage('Mobile number is mandatory for statutory municipal SMS resolution notifications.');
      return;
    }
    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (!phonePattern.test(cleanedMobile.replace(/\s+/g, ''))) {
      setErrorMessage('Please enter a valid mobile number (e.g. +91 98765 43210 or 555-019-2834).');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(5);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 1. Ensure authenticated user ID
      const authedUserId = await requireAuth();
      if (!authedUserId) {
        throw new Error('Citizen Session Error: Unable to verify authenticated session.');
      }

      // Determine target municipal department for the selected category
      const categoryDeptMap: Record<string, { id: string; name: string }> = {
        pothole: { id: 'dept_transport', name: 'Public Works & Road Infrastructure (PWD / Roads)' },
        sidewalk: { id: 'dept_transport', name: 'Public Works & Road Infrastructure (PWD / Roads)' },
        garbage: { id: 'dept_sanitation', name: 'Sanitation & Solid Waste Management' },
        streetlight: { id: 'dept_lighting', name: 'Street Lighting & Electrical Department' },
        traffic_signal: { id: 'dept_lighting', name: 'Street Lighting & Electrical Department' },
        water_leak: { id: 'dept_water', name: 'Water Supply & Sewerage Board' },
        drainage: { id: 'dept_water', name: 'Water Supply & Sewerage Board' },
        tree_hazard: { id: 'dept_parks', name: 'Parks, Urban Trees & Horticulture' },
        graffiti: { id: 'dept_parks', name: 'Parks, Urban Trees & Horticulture' },
        other: { id: 'dept_transport', name: 'Public Works & Road Infrastructure (PWD / Roads)' },
      };

      const matchedDept = categoryDeptMap[selectedCategory] || {
        id: 'dept_transport',
        name: 'Public Works & Road Infrastructure (PWD / Roads)',
      };

      // 2. Persist to Supabase civic_reports table
      const cleanedMobile = mobileNumber.trim();
      const supabaseRes = await fetch('/api/civic-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          user_id: authedUserId,
          mobile_number: cleanedMobile,
          image_url: photoUrl || photoPreview || null,
          ai_description: aiDescription || aiAnalysis?.detectedIssue || null,
          user_description: description.trim(),
          latitude: typeof latitude === 'number' ? latitude : null,
          longitude: typeof longitude === 'number' ? longitude : null,
          address: location.trim(),
          department: matchedDept.name,
          status: 'Submitted',
        }),
      });

      if (!supabaseRes.ok) {
        const errPayload = await supabaseRes.json().catch(() => ({}));
        throw new Error(`Database save error: ${errPayload.details || errPayload.error || 'Failed to persist report'}`);
      }

      const supabaseResult = await supabaseRes.json();
      const savedCivicReport = supabaseResult.report;

      // 3. Trigger intake classification & multi-agent routing
      const intakeResponse = await fetch('/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: savedCivicReport.id,
          category: selectedCategory,
          departmentId: matchedDept.id,
          departmentName: matchedDept.name,
          photoBase64,
          photoMimeType,
          photoUrl: photoUrl || photoPreview || undefined,
          description: description.trim(),
          location: location.trim(),
          submitterName: submitterName || 'Citizen Submitter',
          submitterEmail,
          submitterPhone: cleanedMobile,
        }),
      });

      let complaintObj: Complaint;
      let traces: AgentTraceNode[] = [];
      let confirmation: any = {};

      if (intakeResponse.ok) {
        const intakeData = await intakeResponse.json();
        complaintObj = intakeData.complaint;
        traces = intakeData.traces || [];
        confirmation = intakeData.confirmation || {};
      } else {
        // Safe fallback using the verified database record
        complaintObj = {
          id: savedCivicReport.id,
          officialReferenceNumber: `MET-CIVIC-${savedCivicReport.id.substring(0, 8).toUpperCase()}`,
          issueType: 'pothole',
          title: aiAnalysis?.detectedIssue || 'Reported Civic Defect',
          description: savedCivicReport.user_description,
          location: savedCivicReport.address || 'Reported Location',
          status: 'FILED',
          priority: 'MEDIUM',
          departmentId: 'dept_transport',
          departmentName: savedCivicReport.department || 'Public Works & Infrastructure',
          createdAt: savedCivicReport.created_at,
          updatedAt: savedCivicReport.updated_at,
          photoUrl: savedCivicReport.image_url || photoPreview || '',
          submitterName: submitterName || 'Citizen Submitter',
          submitterPhone: cleanedMobile,
        };
      }

      setSubmittedComplaint(complaintObj);
      setCurrentStep(6);
      setIsSubmitting(false);

      // Invoke parent callback
      onSuccess(complaintObj, traces, confirmation);
    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit report. Please check your network and try again.');
    }
  };

  const stepsList = [
    { num: 1, label: t('formStepPhoto') || 'Photo' },
    { num: 2, label: t('formStepDesc') || 'Description' },
    { num: 3, label: t('formStepLocation') || 'Location' },
    { num: 4, label: t('formStepContact') || 'Contact' },
    { num: 5, label: t('formStepReview') || 'Review' },
    { num: 6, label: t('formStepSubmit') || 'Submit' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      {/* Hidden File and Camera Inputs - always mounted to guarantee change photo works */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* ------------------------------------------------------------- */}
      {/* STEP-BY-STEP PROGRESS INDICATOR                               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs mb-6">
        <div className="flex items-center justify-between">
          {stepsList.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#0b2239] text-white ring-2 ring-[#ea580c]'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1 hidden sm:block ${
                      isCurrent
                        ? 'font-bold text-[#0b2239]'
                        : isCompleted
                        ? 'font-semibold text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-md text-rose-800 text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Attention Required: </span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: PHOTO UPLOAD OR CAPTURE                               */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0b2239] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Step 1 of 5
              </span>
              <h2 className="text-xl font-bold text-[#0b2239]">
                {t('uploadOrCaptureHeading') || 'Upload or Capture Photo'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Provide a clear image of the civic problem. Our municipal vision system analyzes the defect and suggests the statutory jurisdiction.
            </p>
          </div>

          {/* Photo Dropzone or Preview */}
          {!photoPreview ? (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#0b2239] bg-slate-50 hover:bg-blue-50/40 rounded-md p-8 sm:p-10 text-center cursor-pointer transition-all space-y-3"
              >
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto text-[#0b2239] shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0b2239] block">
                    Click to Upload Image from Device
                  </span>
                  <span className="text-xs text-slate-500">Supports JPG, PNG, WebP (Direct municipal inspection standards)</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0b2239] font-bold text-xs rounded border border-slate-300 flex items-center space-x-2 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-[#ea580c]" />
                  <span>Take Live Photo with Camera</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-md overflow-hidden border border-slate-300 bg-slate-900 max-h-80 flex items-center justify-center">
                <img
                  src={photoPreview}
                  alt="Civic Issue Preview"
                  className="w-full h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded-full text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Remove Photo"
                >
                  <X className="w-4 h-4" />
                </button>
                {isAnalyzingImage && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ea580c]" />
                    <span className="text-xs font-semibold">
                      {t('analyzingCivicVision') || 'Analyzing photo with civic vision system...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Options Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('photoUploadedSuccess') || 'Photo attached successfully'}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (cameraInputRef.current) {
                        cameraInputRef.current.value = '';
                        cameraInputRef.current.click();
                      }
                    }}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#0b2239] font-bold text-[11px] rounded cursor-pointer"
                  >
                    Take New Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                        fileInputRef.current.click();
                      }
                    }}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#0b2239] font-bold text-[11px] rounded cursor-pointer"
                  >
                    {t('changePhotoBtn') || 'Upload Different Image'}
                  </button>
                </div>
              </div>

              {/* Citizen Defect Category Verification & Override */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b2239]">
                    {language === 'hi' ? 'समस्या की श्रेणी सत्यापित करें:' : 'Verify or Select Civic Category:'}
                  </span>
                  {isUserEditedCategory ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {language === 'hi' ? 'नागरिक द्वारा चयनित' : 'Selected by Citizen'}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{language === 'hi' ? 'एआई द्वारा अनुशंसित' : 'AI Suggested'}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CIVIC_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-2 rounded border text-left cursor-pointer transition-all flex flex-col items-start ${
                          isSelected
                            ? 'bg-[#0b2239] text-white border-[#0b2239] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100/60'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-[11px] font-bold mt-1 leading-tight line-clamp-2">
                          {language === 'hi' ? cat.nameHi : cat.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick 1-Click Sample Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                {t('orSelectSamplePhoto') || 'Or select an official civic category photograph to test:'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {t('verifiedCategoriesCount') || '10 Verified Municipal Categories'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleSelectSamplePhoto(sample)}
                  className="p-1.5 bg-white border border-slate-200 hover:border-[#0b2239] hover:bg-blue-50/40 rounded-sm text-left transition-all cursor-pointer flex flex-col items-center space-y-1.5 shadow-2xs group"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-16 object-cover rounded-xs border border-slate-200 group-hover:brightness-95 transition-all"
                  />
                  <span className="text-[11px] font-bold text-slate-800 text-center leading-tight line-clamp-2 px-0.5">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleNextFromPhoto}
              disabled={!photoPreview || isAnalyzingImage}
              className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-bold text-xs rounded-sm shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{t('nextReviewDescBtn') || 'Next: Review Description'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: DESCRIPTION (AI GENERATED & EDITABLE)                 */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0b2239] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Step 2 of 5
              </span>
              <h2 className="text-xl font-bold text-[#0b2239]">
                {t('issueDescHeading') || 'Issue Description'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {t('issueDescSubheading') || 'Review and edit the description below. You can add specific landmarks, campus gates, or notes.'}
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="user-description"
                className="text-xs font-bold text-[#0b2239] flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>{t('aiGeneratedDescLabel') || 'Issue Description (Editable)'}</span>
              </label>
              <div className="flex items-center space-x-2">
                <VoiceDictationButton
                  onTranscript={(text) => {
                    setIsUserEditedDescription(true);
                    setDescription((prev) => `${prev} ${text}`.trim());
                  }}
                />
              </div>
            </div>

            <textarea
              id="user-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setIsUserEditedDescription(true);
                setDescription(e.target.value);
              }}
              placeholder={t('descFieldPlaceholder') || 'Describe the issue (e.g., Gate entrance archway structure damage or road defect)...'}
              className="w-full p-3 rounded-sm border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#0b2239] focus:ring-1 focus:ring-[#0b2239] leading-relaxed"
            />
            <p className="text-[11px] text-slate-500">
              {t('descFieldHint') || 'Citizens can freely edit or expand upon the description prior to submission.'}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToPhotoBtn') || 'Back to Photo'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextFromDescription}
              disabled={!description.trim()}
              className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-bold text-xs rounded-sm shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{t('nextConfirmLocationBtn') || 'Next: Confirm Location'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: LOCATION (DETECTED & EDITABLE)                        */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 3 && (
        <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0b2239] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Step 3 of 5
              </span>
              <h2 className="text-xl font-bold text-[#0b2239]">
                {t('locationVerificationHeading') || 'Location Verification'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {t('locationVerificationSubheading') || 'Accurate location ensures municipal field teams reach the exact spot quickly.'}
            </p>
          </div>

          {/* Location Box */}
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0b2239] flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                <span>{t('detectedAddressWard') || 'Detected Address & Ward'}</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#0b2239] text-[11px] font-bold rounded-sm flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin text-[#ea580c]' : ''}`} />
                  <span>{t('useCurrentGpsBtn') || 'Use Current Location'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingLocation(!isEditingLocation)}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-[#0b2239] text-[11px] font-bold rounded-sm flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingLocation ? (t('doneEditingBtn') || 'Done Editing') : (t('editLocationBtn') || 'Edit Location')}</span>
                </button>
              </div>
            </div>

            {isEditingLocation ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-sm border border-[#0b2239] text-xs font-medium text-slate-900 bg-white"
                placeholder="Enter street, landmark, or ward number..."
              />
            ) : (
              <div className="p-3 bg-white rounded-sm border border-slate-200 text-xs font-semibold text-slate-900">
                {location}
              </div>
            )}

            {latitude && longitude && (
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                <span>{t('gpsCoordinatesLabel') || 'GPS Coordinates:'}</span>
                <span className="text-[#0b2239] font-bold">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </span>
                {locationAccuracy && (
                  <span className="text-[10px] text-slate-400">
                    (±{locationAccuracy}m accuracy)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backBtn') || 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextFromLocation}
              disabled={!location.trim() || isLocating}
              className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-bold text-xs rounded-sm shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{t('nextContactBtn') || 'Next: Contact Details'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: CONTACT INFORMATION (MANDATORY MOBILE)               */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 4 && (
        <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0b2239] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Step 4 of 5
              </span>
              <h2 className="text-xl font-bold text-[#0b2239]">
                {t('contactDetailsHeading') || 'Citizen Contact Details'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Your mobile number is mandatory for receiving official SMS updates and statutory verification notifications.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0b2239] flex items-center space-x-1 block mb-1">
                <span>{t('mobileNumberLabel') || 'Mobile Number'}</span>
                <span className="text-rose-600 font-bold">
                  {t('mobileMandatoryBadge') || '* (Mandatory for SMS Updates)'}
                </span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={t('mobilePlaceholder') || '+91 98765 43210'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-[#0b2239] focus:ring-1 focus:ring-[#0b2239]"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {t('mobileDispatchNote') || 'Statutory resolution alerts and work-completed proof are dispatched to this number.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('citizenNameOptional') || 'Citizen Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('citizenEmailOptional') || 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="citizen@example.gov.in"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#0b2239]"
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backBtn') || 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextFromContact}
              disabled={!mobileNumber.trim()}
              className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-bold text-xs rounded-sm shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{t('nextReviewComplaintBtn') || 'Next: Review Complaint'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 5: REVIEW COMPLAINT & SUBMIT                             */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 5 && (
        <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#0b2239] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Step 5 of 5
              </span>
              <h2 className="text-xl font-bold text-[#0b2239]">
                {t('reviewComplaintHeading') || 'Review Complaint'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {t('reviewComplaintSubheading') || 'Verify all details before official submission to the Municipal Civic Registry.'}
            </p>
          </div>

          {/* Summary Card */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50/70 space-y-4 text-xs">
            {/* Photo & Detected Issue */}
            <div className="flex flex-col sm:flex-row gap-4 items-start pb-4 border-b border-slate-200">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Review preview"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xs border border-slate-300 shrink-0"
                />
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#ea580c] tracking-wider block">
                  {t('classifiedIssueLabel') || 'Classified Issue'}
                </span>
                <div className="font-bold text-sm text-[#0b2239]">
                  {aiAnalysis?.detectedIssue || 'Civic Defect'}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">{t('departmentLabel') || 'Department:'} </span>
                  <span>{aiAnalysis?.suggestedDepartmentName || 'Public Works & Infrastructure'}</span>
                </div>
                {aiAnalysis?.severity && (
                  <div className="text-slate-600">
                    <span className="font-semibold">{t('severityLabel') || 'Severity:'} </span>
                    <span className="font-bold text-amber-700">{aiAnalysis.severity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">
                {t('descriptionReviewLabel') || 'Description:'}
              </span>
              <p className="text-slate-900 bg-white p-2.5 rounded-xs border border-slate-200 leading-relaxed font-sans">
                {description}
              </p>
            </div>

            {/* Location */}
            <div className="pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">
                {t('locationReviewLabel') || 'Location:'}
              </span>
              <p className="text-slate-900 font-semibold flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                <span>{location}</span>
              </p>
            </div>

            {/* Mobile Number */}
            <div>
              <span className="text-slate-500 font-bold block mb-1">
                {t('mobileSmsTargetLabel') || 'Mobile Number (SMS Target):'}
              </span>
              <p className="text-[#0b2239] font-mono font-bold">{mobileNumber}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToEditBtn') || 'Back to Edit'}</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-8 py-3 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-bold text-sm rounded-sm shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('submittingToCivicRegistry') || 'Submitting to Civic Registry...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('submitOfficialComplaintBtn') || 'Submit Complaint'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 6: COMPLAINT SUBMITTED SUCCESSFULLY                      */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 6 && submittedComplaint && (
        <div className="bg-white rounded-md border-2 border-emerald-500 p-6 sm:p-10 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#0b2239]">
              {t('complaintSubmittedSuccess') || 'Complaint Submitted Successfully'}
            </h2>
            <p className="text-xs text-slate-600">
              {t('complaintSubmittedSubheading') || 'Your grievance has been officially registered and queued for municipal field dispatch.'}
            </p>
          </div>

          {/* Key Details Card */}
          <div className="max-w-md mx-auto bg-slate-50 rounded-md border border-slate-200 p-4 text-xs space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-bold">{t('complaintIdLabel') || 'Complaint ID:'}</span>
              <span className="font-mono font-bold text-[#0b2239] text-sm">
                {submittedComplaint.officialReferenceNumber || submittedComplaint.id}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-bold">{t('currentStatusLabel') || 'Current Status:'}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                {t('statusSubmittedBadge') || 'Submitted (Under Municipal Dispatch)'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-bold">{t('assignedDepartmentLabel') || 'Assigned Department:'}</span>
              <span className="font-semibold text-slate-800">
                {submittedComplaint.departmentName || submittedComplaint.department}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold">{t('mobileUpdatesLabel') || 'Mobile Updates:'}</span>
              <span className="font-mono text-slate-700">{mobileNumber}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onTrackComplaint) onTrackComplaint(submittedComplaint.id);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0b2239] hover:bg-[#143455] text-white font-bold text-xs rounded-sm shadow-xs transition-colors cursor-pointer"
            >
              {t('trackComplaintBtn') || 'Track Complaint'}
            </button>

            <button
              type="button"
              onClick={() => {
                // Reset form for fresh submission
                handleClearPhoto();
                setDescription('');
                setCurrentStep(1);
                setSubmittedComplaint(null);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-sm transition-colors cursor-pointer"
            >
              {t('reportAnotherIssueBtn') || 'Report Another Issue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
