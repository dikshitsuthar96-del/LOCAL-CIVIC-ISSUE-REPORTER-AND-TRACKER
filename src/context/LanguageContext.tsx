import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Nav
  appName: string;
  appNameEn: string;
  officialPortal: string;
  citizenPortal: string;
  departmentPortal: string;
  adminPortal: string;
  workflow: string;
  databaseAndSql: string;
  nicPortalTitle: string;
  govtOfIndia: string;
  grievancePortal: string;
  tollFree: string;
  tollFreeNumber: string;
  switchLang: string;
  skipToMain: string;
  screenReader: string;
  sitemap: string;
  contact: string;
  officialHeaderTitle: string;
  officialHeaderSubtitle: string;
  emergencyServices: string;
  searchComplaintPlaceholder: string;
  citizenLogin: string;
  officerAccess: string;
  adminGate: string;

  // Nav Items
  navHome: string;
  navReport: string;
  navTrack: string;
  navProofOfWork: string;
  navDepartments: string;
  navServices: string;
  navNotices: string;
  navContact: string;

  // Citizen Portal
  citizenServices: string;
  fastReporting: string;
  reportAnIssue: string;
  trackComplaint: string;
  reportTitle: string;
  reportSubtitle: string;
  describeIssue: string;
  describeIssuePlaceholder: string;
  speakComplaint: string;
  listening: string;
  stopListening: string;
  micPermissionError: string;
  micNotSupported: string;
  defectLocation: string;
  defectLocationPlaceholder: string;
  detectGps: string;
  photoEvidence: string;
  uploadOrDrop: string;
  aiDefectAnalysis: string;
  yourName: string;
  yourEmail: string;
  yourPhone: string;
  submitComplaint: string;
  submitting: string;
  sampleIssues: string;
  potholeSample: string;
  garbageSample: string;
  streetlightSample: string;
  waterLeakSample: string;

  // Action Cards ("How can we help you?")
  howCanWeHelp: string;
  officialServicesDir: string;
  card1Title: string;
  card1Desc: string;
  card1Action: string;
  card2Title: string;
  card2Desc: string;
  card2Action: string;
  card3Title: string;
  card3Desc: string;
  card3Action: string;
  card4Title: string;
  card4Desc: string;
  card4Action: string;
  card5Title: string;
  card5Desc: string;
  card5Action: string;
  card6Title: string;
  card6Desc: string;
  card6Action: string;

  // 6-Stage Timeline
  stage1Title: string;
  stage2Title: string;
  stage3Title: string;
  stage4Title: string;
  stage5Title: string;
  stage6Title: string;
  stageTimelineHeader: string;
  trackInputPlaceholder: string;
  trackBtn: string;

  // Proof of Work
  proofOfWorkTitle: string;
  proofOfWorkSubtitle: string;
  sideBySide: string;
  afterProof: string;
  beforeReport: string;
  beforeLabel: string;
  afterLabel: string;
  resolutionDate: string;
  workCompletedLabel: string;
  officerVerificationLabel: string;
  rateCompletedWork: string;
  viewProofOfWork: string;
  confirmResolution: string;
  resolutionConfirmed: string;
  reopenComplaint: string;
  reopenModalTitle: string;
  reopenModalDesc: string;
  reopenReasonLabel: string;
  reopenReasonPlaceholder: string;
  submitReopen: string;
  cancel: string;
  filterByDepartment: string;
  allDepartmentsOption: string;

  // Departments
  deptAccessTitle: string;
  deptAccessSubtitle: string;
  openOfficerConsole: string;
  openComplaints: string;
  inProgress: string;
  resolved: string;
  pendingVerification: string;
  deptHead: string;
  viewQueue: string;

  // Metrics
  metricsTitle: string;
  metricsLive: string;
  complaintsReceived: string;
  complaintsResolved: string;
  complaintsInProgress: string;
  resolutionRate: string;
  avgResolutionTime: string;
  daysUnit: string;

  // Notices
  latestNoticesTitle: string;
  officialGazettes: string;
  readNotice: string;

  // Popular Categories
  popularCategoriesTitle: string;
  clickToReport: string;

  // Tracker
  trackGrievanceTitle: string;
  trackGrievanceSubtitle: string;
  enterTicketId: string;
  searchTicket: string;
  searching: string;
  quickCheckRecent: string;
  grievanceDossier: string;
  officialRefNo: string;
  filedOn: string;
  currentStatus: string;
  assignedAgency: string;
  resolutionTimeline: string;
  intakeAiReasoning: string;

  // Statuses
  statusSubmitted: string;
  statusUnderReview: string;
  statusVerified: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;
  statusClosed: string;

  // Government Portal
  govPortalTitle: string;
  govPortalSubtitle: string;
  selectDepartmentFirst: string;
  selectDepartmentDesc: string;
  step1: string;
  step2: string;
  authorityLogin: string;
  badgeNumberOrEmail: string;
  badgePlaceholder: string;
  securityPin: string;
  pinPlaceholder: string;
  signInBtn: string;
  verifyingBtn: string;
  quickLoginVerified: string;
  restrictedNetNotice: string;
  deptIsolationNotice: string;
  deptIsolationActive: string;
  workOrdersQueue: string;
  noComplaintsForDept: string;
  noComplaintsDesc: string;
  switchDepartmentBtn: string;
  searchTicketsPlaceholder: string;
  allStatuses: string;
  allDepartments: string;
  dossierTitle: string;
  advanceLifecycle: string;
  markInProgress: string;
  markResolved: string;
  rejectComplaint: string;
  internalNoteLabel: string;
  crewDispatchLabel: string;

  // Departments
  deptRoads: string;
  deptRoadsDesc: string;
  deptWater: string;
  deptWaterDesc: string;
  deptSanitation: string;
  deptSanitationDesc: string;
  deptLighting: string;
  deptLightingDesc: string;
  deptParks: string;
  deptParksDesc: string;

  // Admin Portal
  adminPortalTitle: string;
  adminPortalSubtitle: string;
  allDeptsAndAuthorities: string;
  allGovAccess: string;
  sqlConsole: string;
  runSql: string;
  runningSql: string;
  presetQueries: string;
  relationalSchemas: string;
  downloadSql: string;
  copySqlDump: string;

  // Footer
  footerAboutDept: string;
  footerCitizenCharter: string;
  footerRTI: string;
  footerOrgStructure: string;
  footerContactUs: string;
  footerCitizenServices: string;
  footerReportGrievance: string;
  footerTrackStatus: string;
  footerProofOfWork: string;
  footerNotices: string;
  footerImportantLinks: string;
  footerNationalPortal: string;
  footerCpgrams: string;
  footerMohua: string;
  footerEmergencyNumbers: string;
  footerHelpGov: string;
  footerFAQ: string;
  footerAccessibility: string;
  footerPrivacy: string;
  footerWorkflowGuide: string;
  footerCopyright: string;
  footerContentManaged: string;
  footerLastUpdated: string;

  // Additional Form Keys
  uploadOrCapturePhoto: string;
  describeProblem: string;
  formRef: string;
  photoAttached: string;
  changePhoto: string;
  clickToBrowseOrSnapshot: string;
  supportedImageFormats: string;
  aiAssistedIdentification: string;
  aiAssistedIdentificationComplete: string;
  detectedIssue: string;
  department: string;
  priority: string;
  reviewDetailsAndAutofill: string;
  autoRoutedBySystem: string;
  micVoiceGuidance: string;
  quickWards: string;
  citizenContactOptional: string;
  officialWorkOrderNotice: string;
  submittingComplaint: string;
  submitComplaintBtn: string;
  photoRequiredWarning: string;
  fullNamePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;

  // Additional Proof of Work & Tracker Keys
  selectGrievance: string;
  complaintNumber: string;
  issueCategory: string;
  status: string;
  statusResolvedLabel: string;
  photographicEvidenceBeforeAfter: string;
  proofDispatchedToUserVia: string;
  target: string;
  officialProofOfWorkDelivered: string;
  govtPhotoVerification: string;
  proofSentAlert: string;
  fullscreenProof: string;
  printCertificate: string;
  pictureOfWorkDone: string;
  reportedProblemBefore: string;
  citizenSignOffQuestion: string;
  citizenSignOffHelp: string;
  confirmAndApproveWorkDone: string;
  reportDefectOrReinspect: string;
  verifiedAndAccepted: string;
  reinspectionRequested: string;
  certifiedProofOfWorkTitle: string;
  deliveredToCitizen: string;
  dispatchedToCitizenMobile: string;
  closeFullscreen: string;
  inspectionView: string;
  sideBySideComparison: string;
  supervisingOfficer: string;
  qualitySignOff: string;
  ratingLabel: string;
  reasonIncompleteLabel: string;
  reasonIncompletePlaceholder: string;
  submitReinspectionRequest: string;
  cancelBtn: string;
  repairSummaryLabel: string;
  materialsDeployedLabel: string;
  recordedInAuditLog: string;
  municipalFieldAuditBadge: string;
  proofSectionSubtitle: string;
  beforeCitizenReportTag: string;
  afterEngineerUploadTag: string;
  isoQualitySignOff: string;

  // Notifications
  notifications: string;
  citizenAlerts: string;
  markAllRead: string;
  noNotificationsYet: string;
  noNotificationsDesc: string;
  notificationsAgentFooter: string;
  verifiedProofPictureLabel: string;
  govRepairPhotoAttached: string;
  viewTicket: string;
  newBadge: string;

  // Header and Modals
  selectAccessRole: string;
  fileAndTrackComplaints: string;
  dispatchRepairProof: string;
  rbacAuditDb: string;
  screenReaderAccessEnabled: string;
  emergencyHelplinesTitle: string;
  officialCircularTitle: string;
  closeBtn: string;
  acknowledgeBtn: string;

  // Voice & Dictation
  testVoiceBtn: string;
  liveSpeechLabel: string;
  fillSampleVoice: string;
  sampleVoiceText: string;
  speechNoticeLabel: string;
  transcribingVoice: string;
  micInitError: string;

  // Form & GPS
  detectingGps: string;
  aiClassifyingText: string;

  // Department & Authority Login
  authorityAuthStep: string;
  accessingDeptQueue: string;
  oneClickOfficerProfile: string;
  badgeLabel: string;
  pinLabel: string;
  loginBtn: string;
  badgeOrEmailLabel: string;
  securityPinLabel: string;
  verifyingCredentials: string;
  authenticateAndEnter: string;
  restrictedNetworkWarning: string;
  digitalIndiaCommission: string;
  step1SelectDept: string;
  step2VerifyAuthority: string;
  selectDeptToAccess: string;
  agenciesAvailable: string;
  satyamevaJayateNic: string;

  // Gov Simulator & Admin
  invalidAdminPass: string;
  agenciesTab: string;
  metricsTab: string;
  charterTab: string;
  http403Enforced: string;
  govVerification: string;
  nationalCivicHelpdesk: string;
  tollFreeHelpline: string;
  dedicatedForCivicIntake: string;
  officialGovMunicipalPortal: string;
  encryptedMunicipalServerDesc: string;
  dismissBtn: string;

  // Citizen Portal & Common Civic Keys
  welcomeCivicTitle: string;
  welcomeCivicSubtitle: string;
  reportGrievanceAction: string;
  reportGrievanceDesc: string;
  fileGrievanceBtn: string;
  trackComplaintAction: string;
  trackComplaintDesc: string;
  checkStatusBtn: string;
  findDepartmentAction: string;
  findDepartmentDesc: string;
  viewDepartmentsBtn: string;
  citizenServicesAction: string;
  citizenServicesDesc: string;
  accessCertificatesBtn: string;
  emergencyContactsAction: string;
  emergencyContactsDesc: string;
  dialHelplinesBtn: string;
  noticesUpdatesAction: string;
  noticesUpdatesDesc: string;
  viewCircularsBtn: string;
  trackYourComplaintTitle: string;
  trackYourComplaintDesc: string;
  enterComplaintPlaceholder: string;
  trackStatusBtn: string;
  standardTimelineTitle: string;
  popularComplaintsTitle: string;
  clickToReportCat: string;
  departmentAccessTitle: string;
  departmentAccessDesc: string;
  openOfficerConsoleBtn: string;
  openComplaintsLabel: string;
  inProgressLabel: string;
  resolvedLabel: string;
  pendingVerificationLabel: string;
  viewQueueBtn: string;
  perfIndicatorsTitle: string;
  realtimeDashboardMetrics: string;
  resolvedComplaints: string;
  readMoreNotice: string;
  adminDashboard: string;
  photographicEvidence: string;
  reportCivicIssue: string;
  reportCivicSubtitle: string;

  // Form Wizard Specific Keys
  formStepPhoto: string;
  formStepDesc: string;
  formStepLocation: string;
  formStepContact: string;
  formStepReview: string;
  formStepSubmit: string;
  stepOfTotal: string;
  uploadOrCaptureHeading: string;
  uploadOrCaptureSubheading: string;
  clickToTakePhotoOrUpload: string;
  supportedFormats: string;
  changePhotoBtn: string;
  removePhotoBtn: string;
  photoUploadedSuccess: string;
  analyzingCivicVision: string;
  orSelectSamplePhoto: string;
  verifiedCategoriesCount: string;
  nextReviewDescBtn: string;
  issueDescHeading: string;
  issueDescSubheading: string;
  aiGeneratedDescLabel: string;
  editableBadge: string;
  descFieldPlaceholder: string;
  descFieldHint: string;
  backToPhotoBtn: string;
  nextConfirmLocationBtn: string;
  locationVerificationHeading: string;
  locationVerificationSubheading: string;
  detectedAddressWard: string;
  useCurrentGpsBtn: string;
  editLocationBtn: string;
  doneEditingBtn: string;
  gpsCoordinatesLabel: string;
  gpsAccuracyLabel: string;
  gpsMandatoryNote: string;
  locationInputPlaceholder: string;
  backBtn: string;
  nextContactBtn: string;
  contactDetailsHeading: string;
  contactDetailsSubheading: string;
  mobileNumberLabel: string;
  mobileMandatoryBadge: string;
  mobilePlaceholder: string;
  mobileDispatchNote: string;
  citizenNameOptional: string;
  citizenNamePlaceholder: string;
  citizenEmailOptional: string;
  citizenEmailPlaceholder: string;
  nextReviewComplaintBtn: string;
  reviewComplaintHeading: string;
  reviewComplaintSubheading: string;
  classifiedIssueLabel: string;
  departmentLabel: string;
  severityLabel: string;
  descriptionReviewLabel: string;
  locationReviewLabel: string;
  mobileSmsTargetLabel: string;
  backToEditBtn: string;
  submittingToCivicRegistry: string;
  submitOfficialComplaintBtn: string;
  selectIssueCategoryPrompt: string;
  manualCategoryOverride: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'Local Civic Issue Reporter and Tracker',
    appNameEn: 'Local Civic Issue Reporter and Tracker',
    officialPortal: 'Official Municipal Grievance Portal',
    citizenPortal: 'Citizen Portal',
    departmentPortal: 'Department Portal',
    adminPortal: 'Admin Portal',
    workflow: 'Workflow Guide',
    databaseAndSql: 'Database & SQL',
    nicPortalTitle: 'National Civic Grievance Redressal System',
    govtOfIndia: 'GOVERNMENT OF INDIA | National Civic Services & Grievance Redressal',
    grievancePortal: 'CPGRAMS / Municipal Grievance Monitoring System',
    tollFree: 'Toll Free Helpline',
    tollFreeNumber: '1800-11-2026',
    switchLang: 'हिन्दी',
    skipToMain: 'Skip to Main Content',
    screenReader: 'Screen Reader Access',
    sitemap: 'Sitemap',
    contact: 'Contact Us',
    officialHeaderTitle: 'Local Civic Issue Reporter and Tracker',
    officialHeaderSubtitle: 'Municipal Corporation Public Grievance Portal',
    emergencyServices: 'Emergency Services',
    searchComplaintPlaceholder: 'Search complaint ID...',
    citizenLogin: 'Citizen Login',
    officerAccess: 'Department Officer',
    adminGate: 'Admin Gate',

    // Nav Items
    navHome: 'Home',
    navReport: 'Report a Grievance',
    navTrack: 'Track Complaint',
    navProofOfWork: 'Proof of Work',
    navDepartments: 'Departments',
    navServices: 'Services',
    navNotices: 'Notices',
    navContact: 'Contact Us',

    // Citizen Portal
    citizenServices: 'Public Grievance Redressal Service',
    fastReporting: 'AI Multimodal Vision Inspection & Official Work Order Dispatch',
    reportAnIssue: 'Lodge Grievance',
    trackComplaint: 'Track Grievance Status',
    reportTitle: 'Citizen Grievance Lodging Desk',
    reportSubtitle: 'Report road damage, water leakage, broken streetlights, or sanitation defects with instant AI verification.',
    describeIssue: 'Grievance Description (विवरण)',
    describeIssuePlaceholder: 'Describe the civic defect in detail (e.g., 8-inch deep dangerous pothole near pedestrian crossing)...',
    speakComplaint: 'Speak Complaint (बोलकर दर्ज करें)',
    listening: 'Listening... Please speak now',
    stopListening: 'Stop Mic',
    micPermissionError: 'Microphone access denied. Please allow microphone in browser.',
    micNotSupported: 'Speech recognition not supported in this browser. Please type description.',
    defectLocation: 'Defect Site Location (स्थान)',
    defectLocationPlaceholder: 'Exact road, landmark, street name or ward number...',
    detectGps: 'Detect Live GPS',
    photoEvidence: 'Photographic Evidence (साइट फोटो)',
    uploadOrDrop: 'Click or drop defect image here (JPEG, PNG, WebP up to 10MB)',
    aiDefectAnalysis: 'AI Vision Pre-Verification Analysis',
    yourName: 'Citizen Full Name (नागरिक का नाम)',
    yourEmail: 'Official Email (ईमेल)',
    yourPhone: 'Mobile Number (मोबाइल नंबर)',
    submitComplaint: 'Submit Grievance to Municipal Registry',
    submitting: 'Ingesting & Routing via AI...',
    sampleIssues: 'Quick Fill Presets:',
    potholeSample: '🛣️ Deep Pothole',
    garbageSample: '🗑️ Garbage Dump',
    streetlightSample: '💡 Broken Streetlight',
    waterLeakSample: '💧 Water Main Burst',

    // Action Cards
    howCanWeHelp: 'How can we help you?',
    officialServicesDir: 'Official Public Services Directory',
    card1Title: '1. Report a Civic Issue',
    card1Desc: 'Report potholes, garbage, streetlight failures, water leakage and other local problems.',
    card1Action: 'File Grievance',
    card2Title: '2. Track Your Complaint',
    card2Desc: 'Check complaint status using your complaint/token number received after filing.',
    card2Action: 'Check Status',
    card3Title: '3. Find a Department',
    card3Desc: 'Find the responsible municipal department and engineer in charge for your issue.',
    card3Action: 'View 7 Departments',
    card4Title: '4. Citizen Services',
    card4Desc: 'Access commonly used municipal services, certificates and civic applications.',
    card4Action: 'Access Certificates',
    card5Title: '5. Emergency Contacts',
    card5Desc: 'Important emergency, disaster control desk and municipal civic helpline numbers.',
    card5Action: 'Dial Helplines (112 / 101)',
    card6Title: '6. Notices & Updates',
    card6Desc: 'View official municipal announcements, road closures and public service notices.',
    card6Action: 'View Circulars',

    // 6-Stage Timeline
    stage1Title: 'Complaint Registered',
    stage2Title: 'Department Assigned',
    stage3Title: 'Officer Reviewing',
    stage4Title: 'Work in Progress',
    stage5Title: 'Resolved (Proof Uploaded)',
    stage6Title: 'Citizen Verification',
    stageTimelineHeader: 'Standard 6-Stage Municipal Grievance Redressal Timeline:',
    trackInputPlaceholder: 'Enter Complaint / Token Number (e.g. CIV-2026-001245 or CMP-101)',
    trackBtn: 'Track Status',

    // Proof of Work
    proofOfWorkTitle: 'Resolution Verification & Proof of Work',
    proofOfWorkSubtitle: 'Official photographic proof of completed repairs dispatched to citizens for verification.',
    sideBySide: 'Side-by-Side',
    afterProof: 'After (Proof)',
    beforeReport: 'Before',
    beforeLabel: '1. Before (Reported Problem)',
    afterLabel: '2. After (Official Work Done)',
    resolutionDate: 'Resolution Date:',
    workCompletedLabel: 'Work Completed:',
    officerVerificationLabel: 'Officer Verification:',
    rateCompletedWork: 'Rate Completed Work:',
    viewProofOfWork: 'View Proof of Work',
    confirmResolution: 'Confirm Resolution',
    resolutionConfirmed: 'Resolution Confirmed',
    reopenComplaint: 'Reopen Complaint',
    reopenModalTitle: 'Reopen Grievance Ticket',
    reopenModalDesc: 'If the repair is incomplete or sub-standard, please provide specific supervisor notes below:',
    reopenReasonLabel: 'Reason for Reopening *',
    reopenReasonPlaceholder: 'Describe why the resolution is insufficient or needs re-work...',
    submitReopen: 'Submit Reopen Request',
    cancel: 'Cancel',
    filterByDepartment: 'Filter by Department:',
    allDepartmentsOption: 'All Departments',

    // Departments
    deptAccessTitle: 'Department Access',
    deptAccessSubtitle: 'Administrative monitoring and live operational status across 7 municipal departments.',
    openOfficerConsole: 'Open Officer Dispatch Console',
    openComplaints: 'Open Complaints:',
    inProgress: 'In Progress:',
    resolved: 'Resolved:',
    pendingVerification: 'Pending Verification:',
    deptHead: 'Head:',
    viewQueue: 'View Queue',

    // Metrics
    metricsTitle: 'Municipal Grievance Redressal Performance Indicators',
    metricsLive: 'Real-time Dashboard Metrics',
    complaintsReceived: 'Civic Complaints Received',
    complaintsResolved: 'Resolved Complaints',
    complaintsInProgress: 'Complaints In Progress',
    resolutionRate: 'Resolution Rate',
    avgResolutionTime: 'Average Resolution Time',
    daysUnit: 'Days',

    // Notices
    latestNoticesTitle: 'Latest Notices & Civic Updates',
    officialGazettes: 'Official Municipal Gazettes',
    readNotice: 'Read →',

    // Popular Categories
    popularCategoriesTitle: 'Popular Civic Complaints',
    clickToReport: 'Click to report specific category',

    // Tracker
    trackGrievanceTitle: 'Citizen Grievance Tracking',
    trackGrievanceSubtitle: 'Enter your tracking identifier (CIVIC-2026-XXXX) or Work Order Reference number.',
    enterTicketId: 'Complaint ID or Reference #',
    searchTicket: 'Search Grievance',
    searching: 'Searching...',
    quickCheckRecent: 'Quick Inspect:',
    grievanceDossier: 'MUNICIPAL GRIEVANCE DOSSIER',
    officialRefNo: 'Work Order Reference:',
    filedOn: 'Registration Date:',
    currentStatus: 'Current Lifecycle Stage:',
    assignedAgency: 'Competent Department:',
    resolutionTimeline: 'Target SLA Resolution Time:',
    intakeAiReasoning: 'Intake Multi-Agent Verification Trace:',

    // Statuses
    statusSubmitted: 'Registered (दर्ज)',
    statusUnderReview: 'Under Scrutiny (समीक्षाधीन)',
    statusVerified: 'Verified on Cadastre (सत्यापित)',
    statusAssigned: 'Crew Assigned (दल नियुक्त)',
    statusInProgress: 'Work In Progress (कार्य प्रगति पर)',
    statusResolved: 'Resolved & Restored (समाधान पूर्ण)',
    statusRejected: 'Rejected (खारिज)',
    statusClosed: 'Closed (फाइल बंद)',

    // Government Portal
    govPortalTitle: 'Government Department Operations Portal',
    govPortalSubtitle: 'Departmental Grievance Redressal & Work Order Management System',
    selectDepartmentFirst: 'Select Municipal Department',
    selectDepartmentDesc: 'Choose your authorized municipal agency to proceed with officer credential verification:',
    step1: 'Step 1 of 2: Department Selection',
    step2: 'Step 2 of 2: Authority Authentication',
    authorityLogin: 'Authority Officer Login',
    badgeNumberOrEmail: 'Authority Badge # or Official City Email',
    badgePlaceholder: 'e.g. DOT-402 or dispatcher@metropolis.gov',
    securityPin: 'Departmental Security PIN',
    pinPlaceholder: 'Enter Security PIN (demo: citygov2026)',
    signInBtn: 'Authenticate & Enter Department Queue',
    verifyingBtn: 'Verifying with Municipal Directory...',
    quickLoginVerified: '1-Click Verified Officer Profile:',
    restrictedNetNotice: 'OFFICIAL GOVERNMENT OF INDIA / MUNICIPAL NETWORK • RESTRICTED ACCESS',
    deptIsolationNotice: 'Departmental Isolation Enforced: Authorities can only inspect and act upon complaints belonging to their assigned agency.',
    deptIsolationActive: 'Departmental Isolation Active',
    workOrdersQueue: 'Department Work Order Docket',
    noComplaintsForDept: 'No complaints registered for',
    noComplaintsDesc: 'There are currently 0 active complaints or pending work orders assigned to this agency queue. All civic issues under this jurisdiction are resolved or none have been filed yet.',
    switchDepartmentBtn: 'Switch Department',
    searchTicketsPlaceholder: 'Search docket #, landmark, keywords...',
    allStatuses: 'All Statuses',
    allDepartments: 'All Departments',
    dossierTitle: 'Official Grievance Case Record',
    advanceLifecycle: 'Advance Grievance Lifecycle',
    markInProgress: 'Deploy Field Crew (In Progress)',
    markResolved: 'Complete Resolution & Restore Site',
    rejectComplaint: 'Reject Invalid Grievance',
    internalNoteLabel: 'Supervisor Internal Note:',
    crewDispatchLabel: 'Assigned Field Operations Crew:',

    // Departments
    deptRoads: 'Department of Transportation & Streets (Road Department)',
    deptRoadsDesc: 'Road repair, potholes, asphalt paving, street markings, curbs & sidewalks.',
    deptWater: 'Municipal Water & Sewer Authority',
    deptWaterDesc: 'Water main leaks, fire hydrant faults, storm drainage, sewage backup.',
    deptSanitation: 'Department of Sanitation & Waste Management',
    deptSanitationDesc: 'Garbage disposal, recycling overflow, dumpster clearances, street sweeping.',
    deptLighting: 'Bureau of Street Lighting & Electrical',
    deptLightingDesc: 'Streetlamps, intersection lighting, electrical conduit repairs, signals.',
    deptParks: 'Parks, Urban Forestry & Public Space',
    deptParksDesc: 'Public parks, hazard tree limbs, turf maintenance, playground equipment.',

    // Admin Portal
    adminPortalTitle: 'Central Municipal Administration & Database Portal',
    adminPortalSubtitle: 'Master Government Oversight • All Departments & Authorities Directory • Live SQL Engine',
    allDeptsAndAuthorities: 'All Departments & Authorities',
    allGovAccess: 'Master Government Access (All Queues)',
    sqlConsole: 'Database & SQL Query Console',
    runSql: 'Execute SQL Query',
    runningSql: 'Executing Query...',
    presetQueries: 'Standard Administrative SQL Queries (1-Click Run):',
    relationalSchemas: 'PostgreSQL Relational Schema Definitions',
    downloadSql: 'Download Full .sql Dump',
    copySqlDump: 'Copy SQL Dump',

    // Footer
    footerAboutDept: 'About the Department',
    footerCitizenCharter: 'Citizen Charter',
    footerRTI: 'Right to Information (RTI)',
    footerOrgStructure: 'Organizational Setup & Wards',
    footerContactUs: 'Contact Us & Municipal H.Q.',
    footerCitizenServices: 'Citizen Services',
    footerReportGrievance: 'Report Grievance',
    footerTrackStatus: 'Track Complaint Status',
    footerProofOfWork: 'Resolution & Proof of Work',
    footerNotices: 'Notices & Circulars',
    footerImportantLinks: 'Important Links',
    footerNationalPortal: 'National Portal of India',
    footerCpgrams: 'CPGRAMS Portal (pgportal.gov.in)',
    footerMohua: 'Ministry of Housing & Urban Affairs',
    footerEmergencyNumbers: 'Emergency Services: Toll Free 112 / 101 / 102',
    footerHelpGov: 'Help & Governance',
    footerFAQ: 'Frequently Asked Questions (FAQ)',
    footerAccessibility: 'Accessibility Statement',
    footerPrivacy: 'Privacy Policy & Terms',
    footerWorkflowGuide: 'System Architecture Workflow Guide',
    footerCopyright: '© 2026 Local Civic Grievance Redressal & Tracker',
    footerContentManaged: 'Content Managed by the Municipal Administration Department',
    footerLastUpdated: 'Last Updated: 14 September 2026',

    // Additional Form Keys
    uploadOrCapturePhoto: 'Upload / Capture Photo',
    describeProblem: 'Describe the Problem',
    formRef: 'Form Ref: CPGRAMS-MUN-2026',
    photoAttached: 'Photo Attached',
    changePhoto: 'Change Photo',
    clickToBrowseOrSnapshot: 'Click to browse or take snapshot with camera',
    supportedImageFormats: 'Supported: JPEG, PNG, WebP',
    aiAssistedIdentification: 'AI-assisted issue identification in progress...',
    aiAssistedIdentificationComplete: 'AI-assisted issue identification',
    detectedIssue: 'Detected Issue:',
    department: 'Department:',
    priority: 'Priority:',
    reviewDetailsAndAutofill: 'Review Details & Autofill',
    autoRoutedBySystem: 'Auto-routed by System',
    micVoiceGuidance: 'Click mic to speak in Hindi or English, or type description',
    quickWards: 'Quick Wards:',
    citizenContactOptional: 'Citizen Contact (Optional for Status Tracking)',
    officialWorkOrderNotice: 'Official work order dispatched with real-time tracking',
    submittingComplaint: 'Submitting Complaint...',
    submitComplaintBtn: 'Submit Complaint',
    photoRequiredWarning: 'Please upload a photo of the defect site',
    fullNamePlaceholder: 'Full Name (optional)',
    emailPlaceholder: 'Email for notifications (optional)',
    phonePlaceholder: 'Mobile Number for SMS updates (optional)',

    // Additional Proof of Work & Tracker Keys
    selectGrievance: 'Select Grievance:',
    complaintNumber: 'Complaint Number:',
    issueCategory: 'Issue Category:',
    status: 'Status:',
    statusResolvedLabel: 'Resolved',
    photographicEvidenceBeforeAfter: 'Photographic Evidence (Before vs. After Work Completed)',
    proofDispatchedToUserVia: 'Dispatched via National Portal SMS & WhatsApp Gateway',
    target: 'Target:',
    officialProofOfWorkDelivered: 'Official Proof of Work Delivered',
    govtPhotoVerification: 'GOVERNMENT PHOTO VERIFICATION',
    proofSentAlert: 'Municipal Corporation Alert: Your problem has been SOLVED. The official picture of completed work has been dispatched.',
    fullscreenProof: 'Fullscreen Proof',
    printCertificate: 'Print Certificate',
    pictureOfWorkDone: '📸 Picture of Work Done (After)',
    reportedProblemBefore: 'Reported Problem (Before)',
    citizenSignOffQuestion: 'Citizen Sign-Off: Does the picture show completed work?',
    citizenSignOffHelp: 'Your verification helps maintain high municipal standards and closes the official public audit loop.',
    confirmAndApproveWorkDone: 'Confirm & Approve Work Done',
    reportDefectOrReinspect: 'Report Defect / Request Re-inspection',
    verifiedAndAccepted: 'You verified and accepted this repair work!',
    reinspectionRequested: 'Re-inspection requested. Case flagged for supervisor audit.',
    certifiedProofOfWorkTitle: 'Certified Photographic Proof of Work Done',
    deliveredToCitizen: 'Delivered to Citizen',
    dispatchedToCitizenMobile: 'Dispatched to citizen mobile:',
    closeFullscreen: 'Close Fullscreen',
    inspectionView: 'Inspection View:',
    sideBySideComparison: 'Side-by-Side Comparison',
    supervisingOfficer: 'Supervising Officer:',
    qualitySignOff: 'Quality Sign-off:',
    ratingLabel: 'Rating:',
    reasonIncompleteLabel: 'Reason work in the photo is incomplete or unsatisfactory:',
    reasonIncompletePlaceholder: 'Explain what is still unresolved (e.g., debris left behind, uneven asphalt, light still flickering)...',
    submitReinspectionRequest: 'Submit Re-inspection Request',
    cancelBtn: 'Cancel',
    repairSummaryLabel: 'Repair Execution Summary:',
    materialsDeployedLabel: 'Materials & Equipment Deployed:',
    recordedInAuditLog: 'RECORDED IN AUDIT LOG',
    municipalFieldAuditBadge: 'MUNICIPAL FIELD AUDIT',
    proofSectionSubtitle: 'Photographic proof uploaded by municipal engineers upon completion of on-ground repairs. Citizens must verify the work.',
    beforeCitizenReportTag: 'Citizen Report',
    afterEngineerUploadTag: 'Field Engineer Upload',
    isoQualitySignOff: 'ISO 9001 / CPGRAMS Certified',

    // Notifications
    notifications: 'Notifications',
    citizenAlerts: 'Citizen Alerts',
    markAllRead: 'Mark all read',
    noNotificationsYet: 'No notifications yet.',
    noNotificationsDesc: "You'll receive plain-language updates here whenever Nagrik Sandesh detects a status change.",
    notificationsAgentFooter: 'Generated automatically by Nagrik Sandesh (Status & Notification Agent)',
    verifiedProofPictureLabel: '📸 Verified Proof of Work Picture',
    govRepairPhotoAttached: 'Government repair photo attached',
    viewTicket: 'View ticket',
    newBadge: 'new',

    // Header and Modals
    selectAccessRole: 'Select Access Role / Portal',
    fileAndTrackComplaints: 'File & Track Complaints',
    dispatchRepairProof: 'Dispatch, Repair & Photo Proof',
    rbacAuditDb: 'RBAC, System Audit & DB',
    screenReaderAccessEnabled: 'Screen Reader Access is enabled according to GIGW standards.',
    emergencyHelplinesTitle: 'Emergency Civic & Disaster Helplines',
    officialCircularTitle: 'Official Municipal Circular',
    closeBtn: 'Close',
    acknowledgeBtn: 'Acknowledge',

    // Voice & Dictation
    testVoiceBtn: 'Test Voice',
    liveSpeechLabel: 'Live speech:',
    fillSampleVoice: '👉 Fill using sample voice note',
    sampleVoiceText: 'Severe deep pothole on the main avenue causing severe vehicle damage and hazardous traffic bottlenecks, please dispatch repair team immediately.',
    speechNoticeLabel: 'Speech detection notice:',
    transcribingVoice: 'Transcribing voice input...',
    micInitError: 'Could not initialize speech recognition. Use the test voice button below.',

    // Form & GPS
    detectingGps: 'Detecting GPS...',
    aiClassifyingText: 'Classifying photographic features against municipal department schemas.',

    // Department & Authority Login
    authorityAuthStep: '2. Authority Officer Authentication',
    accessingDeptQueue: 'Accessing Department Queue',
    oneClickOfficerProfile: '1-Click Verified Officer Profile:',
    badgeLabel: 'Badge:',
    pinLabel: 'PIN:',
    loginBtn: 'Login',
    badgeOrEmailLabel: 'Authority Badge # or Official City Email',
    securityPinLabel: 'Departmental Security PIN',
    verifyingCredentials: 'Verifying Credentials...',
    authenticateAndEnter: 'Authenticate & Enter',
    restrictedNetworkWarning: 'Restricted Government Network: Unauthorized access is strictly prohibited under the IT Act. All access sessions and dispatch actions are digitally logged and audited.',
    digitalIndiaCommission: 'Digital India & Municipal Public Service Commission',
    step1SelectDept: 'Step 1: Department Selection',
    step2VerifyAuthority: 'Step 2: Authority Login',
    selectDeptToAccess: '1. Select Department to Access',
    agenciesAvailable: 'agencies available',
    satyamevaJayateNic: 'Satyameva Jayate • National Informatics Centre (NIC) Standards Interface',

    // Gov Simulator & Admin
    invalidAdminPass: 'Invalid administrative password. Access requires master key "ADMIN".',
    agenciesTab: 'Agencies',
    metricsTab: 'SLAs & Metrics',
    charterTab: 'Charter',
    http403Enforced: 'HTTP 403 ENFORCED',
    govVerification: 'Gov Verification',
    nationalCivicHelpdesk: 'National Civic Helpdesk',
    tollFreeHelpline: 'Toll-Free Helpline: ',
    dedicatedForCivicIntake: 'Dedicated for immediate emergency & civic issue intake',
    officialGovMunicipalPortal: 'Official Government Municipal Portal:',
    encryptedMunicipalServerDesc: 'All complaints and work orders are hashed and dispatched directly to authorized municipal department queues.',
    dismissBtn: 'Dismiss',

    // Citizen Portal & Common Civic Keys
    welcomeCivicTitle: 'Municipal Public Grievance Redressal Portal',
    welcomeCivicSubtitle: 'Official platform for citizens to register grievances, track resolution progress, and verify completed municipal field works across all city wards.',
    reportGrievanceAction: 'Report a Civic Issue',
    reportGrievanceDesc: 'Report potholes, garbage, streetlight failures, water leakage and other local municipal problems.',
    fileGrievanceBtn: 'File Grievance',
    trackComplaintAction: 'Track Your Complaint',
    trackComplaintDesc: 'Check real-time resolution status and inspection logs using your official complaint token number.',
    checkStatusBtn: 'Check Status',
    findDepartmentAction: 'Find a Department',
    findDepartmentDesc: 'Locate the responsible municipal department, zonal engineer and public grievance officer.',
    viewDepartmentsBtn: 'View 7 Departments',
    citizenServicesAction: 'Citizen Services',
    citizenServicesDesc: 'Access commonly used municipal services, civic permits, birth/death records and public forms.',
    accessCertificatesBtn: 'Access Services',
    emergencyContactsAction: 'Emergency Contacts',
    emergencyContactsDesc: 'Direct 24x7 hotlines for disaster control, fire, water pipe bursts and municipal emergency helplines.',
    dialHelplinesBtn: 'Dial Helplines (112 / 101)',
    noticesUpdatesAction: 'Notices & Updates',
    noticesUpdatesDesc: 'Official municipal announcements, road closures, monsoon advisories and public gazettes.',
    viewCircularsBtn: 'View Circulars',
    trackYourComplaintTitle: 'Track Your Complaint',
    trackYourComplaintDesc: 'Enter your unique Complaint Reference ID received via SMS or portal acknowledgment to view live progress.',
    enterComplaintPlaceholder: 'Enter Complaint Reference Number (e.g. CMP-2025-0842)',
    trackStatusBtn: 'Track Status',
    standardTimelineTitle: 'STANDARD 6-STAGE CITIZEN RESOLUTION LIFECYCLE',
    popularComplaintsTitle: 'Popular Civic Complaints',
    clickToReportCat: 'Click on any category to auto-fill report form',
    departmentAccessTitle: 'Department Access',
    departmentAccessDesc: 'Authorised municipal engineering branches managing active complaint queues and dispatch.',
    openOfficerConsoleBtn: 'Open Officer Console',
    openComplaintsLabel: 'Open',
    inProgressLabel: 'In Progress',
    resolvedLabel: 'Resolved',
    pendingVerificationLabel: 'Pending Verification',
    viewQueueBtn: 'View Queue',
    perfIndicatorsTitle: 'Key Performance Indicators',
    realtimeDashboardMetrics: 'Real-time Municipal Redressal Dashboard',
    resolvedComplaints: 'Resolved Complaints',
    readMoreNotice: 'Read Details',
    adminDashboard: 'Admin Dashboard',
    photographicEvidence: 'Photographic Evidence',
    reportCivicIssue: 'Report a Civic Issue',
    reportCivicSubtitle: 'File a municipal complaint with automated AI categorization, GPS location tagging, and field department routing.',

    // Form Wizard English
    formStepPhoto: 'Photo',
    formStepDesc: 'Description',
    formStepLocation: 'Location',
    formStepContact: 'Contact',
    formStepReview: 'Review',
    formStepSubmit: 'Submit',
    stepOfTotal: 'Step',
    uploadOrCaptureHeading: 'Upload or Capture Photo',
    uploadOrCaptureSubheading: 'Provide a clear image of the defect. Our civic inspection system analyzes the issue accurately.',
    clickToTakePhotoOrUpload: 'Click to Take Photo or Upload Image',
    supportedFormats: 'Supports JPG, PNG, WebP',
    changePhotoBtn: 'Change Photo',
    removePhotoBtn: 'Remove Photo',
    photoUploadedSuccess: 'Photo uploaded successfully',
    analyzingCivicVision: 'Analyzing image characteristics and civic defect profile...',
    orSelectSamplePhoto: 'Or select an official civic category photograph to test:',
    verifiedCategoriesCount: '10 Verified Municipal Categories',
    nextReviewDescBtn: 'Next: Review Description',
    issueDescHeading: 'Issue Description',
    issueDescSubheading: 'Review and refine the issue description. You can add specific landmarks or municipal notes.',
    aiGeneratedDescLabel: 'Inspection Description (Editable)',
    editableBadge: 'Editable',
    descFieldPlaceholder: 'Describe the issue (e.g., Damaged entrance gate structure with loose brickwork and pedestrian obstruction)...',
    descFieldHint: 'Citizens can freely edit or expand upon the description prior to official submission.',
    backToPhotoBtn: 'Back to Photo',
    nextConfirmLocationBtn: 'Next: Confirm Location',
    locationVerificationHeading: 'Location Verification',
    locationVerificationSubheading: 'Accurate location ensures municipal field teams reach the exact spot quickly.',
    detectedAddressWard: 'Detected Address & Ward',
    useCurrentGpsBtn: 'Use Live GPS Location',
    editLocationBtn: 'Edit Location',
    doneEditingBtn: 'Done Editing',
    gpsCoordinatesLabel: 'GPS Coordinates:',
    gpsAccuracyLabel: 'Accuracy:',
    gpsMandatoryNote: 'High-accuracy GPS location is required for statutory municipal work dispatch.',
    locationInputPlaceholder: 'Enter street, landmark, or ward number...',
    backBtn: 'Back',
    nextContactBtn: 'Next: Contact Details',
    contactDetailsHeading: 'Citizen Contact Details',
    contactDetailsSubheading: 'Your mobile number is mandatory for receiving official SMS updates and statutory verification notifications.',
    mobileNumberLabel: 'Mobile Number',
    mobileMandatoryBadge: '* (Mandatory for SMS Updates)',
    mobilePlaceholder: '+91 98765 43210 or 10-digit mobile number',
    mobileDispatchNote: 'Statutory resolution alerts and work-completed proof are dispatched to this number.',
    citizenNameOptional: 'Citizen Name (Optional)',
    citizenNamePlaceholder: 'Your Full Name',
    citizenEmailOptional: 'Email Address (Optional)',
    citizenEmailPlaceholder: 'citizen@example.gov.in',
    nextReviewComplaintBtn: 'Next: Review Complaint',
    reviewComplaintHeading: 'Review Complaint',
    reviewComplaintSubheading: 'Verify all details before official submission to the Municipal Civic Registry.',
    classifiedIssueLabel: 'Classified Issue',
    departmentLabel: 'Department',
    severityLabel: 'Severity',
    descriptionReviewLabel: 'Description:',
    locationReviewLabel: 'Location:',
    mobileSmsTargetLabel: 'Mobile Number (SMS Target):',
    backToEditBtn: 'Back to Edit',
    submittingToCivicRegistry: 'Submitting to Civic Registry...',
    submitOfficialComplaintBtn: 'Submit Official Complaint',
    selectIssueCategoryPrompt: 'Select Issue Category',
    manualCategoryOverride: 'Category Selected by Citizen',
  },
  hi: {
    appName: 'स्थानीय नागरिक समस्या निवारण एवं ट्रैकर',
    appNameEn: 'Local Civic Issue Reporter and Tracker',
    officialPortal: 'आधिकारिक नगरपालिका जन शिकायत निवारण पोर्टल',
    citizenPortal: 'नागरिक पोर्टल',
    departmentPortal: 'विभागीय पोर्टल',
    adminPortal: 'प्रशासन पोर्टल',
    workflow: 'कार्यप्रणाली गाइड',
    databaseAndSql: 'डेटाबेस एवं एसक्यूएल',
    nicPortalTitle: 'राष्ट्रीय नागरिक शिकायत निवारण प्रणाली',
    govtOfIndia: 'भारत सरकार | राष्ट्रीय नागरिक सेवा एवं लोक शिकायत निवारण',
    grievancePortal: 'सीपीजीआरएएमएस / नगरपालिका शिकायत निगरानी प्रणाली',
    tollFree: 'टोल फ्री सहायता',
    tollFreeNumber: '1800-11-2026',
    switchLang: 'English',
    skipToMain: 'मुख्य सामग्री पर जाएं',
    screenReader: 'स्क्रीन रीडर',
    sitemap: 'साइटमैप',
    contact: 'संपर्क सूत्र',
    officialHeaderTitle: 'स्थानीय नागरिक समस्या निवारण एवं ट्रैकर',
    officialHeaderSubtitle: 'महानगर नगर निगम जन शिकायत निवारण पोर्टल',
    emergencyServices: 'आपातकालीन सेवा',
    searchComplaintPlaceholder: 'शिकायत संख्या खोजें...',
    citizenLogin: 'नागरिक लॉगिन',
    officerAccess: 'विभागीय अधिकारी',
    adminGate: 'प्रशासन पोर्टल',

    // Nav Items
    navHome: 'मुख्य पृष्ठ',
    navReport: 'शिकायत दर्ज करें',
    navTrack: 'स्थिति जांचें',
    navProofOfWork: 'समाधान एवं प्रमाण',
    navDepartments: 'विभाग',
    navServices: 'नागरिक सेवाएं',
    navNotices: 'सूचनाएं एवं परिपत्र',
    navContact: 'संपर्क सूत्र',

    // Citizen Portal
    citizenServices: 'लोक शिकायत निवारण सेवा',
    fastReporting: 'एआई बहु-आयामी दृष्टि निरीक्षण एवं त्वरित कार्य आदेश प्रेषण',
    reportAnIssue: 'समस्या दर्ज करें',
    trackComplaint: 'शिकायत की स्थिति देखें',
    reportTitle: 'नागरिक शिकायत पंजीकरण केंद्र',
    reportSubtitle: 'सड़क गड्ढे, पानी का रिसाव, खराब स्ट्रीट लाइट या कचरे की समस्या दर्ज करें। एआई द्वारा तुरंत सत्यापन होगा।',
    describeIssue: 'शिकायत का पूरा विवरण',
    describeIssuePlaceholder: 'समस्या का स्पष्ट विवरण लिखें (उदा. मुख्य मार्ग पर पैदल पार पथ के पास 8 इंच गहरा खतरनाक गड्ढा है)...',
    speakComplaint: 'बोलकर शिकायत दर्ज करें',
    listening: 'सुन रहे हैं... कृपया अब बोलिए',
    stopListening: 'माइक रोकें',
    micPermissionError: 'माइक्रोफ़ोन की अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।',
    micNotSupported: 'इस ब्राउज़र में ध्वनि पहचान समर्थित नहीं है। कृपया लिखकर दर्ज करें।',
    defectLocation: 'समस्या का सटीक स्थान / पता',
    defectLocationPlaceholder: 'सड़क का नाम, निकटतम लैंडमार्क, वार्ड नंबर या गली नंबर...',
    detectGps: 'लाइव जीपीएस पता लगाएं',
    photoEvidence: 'समस्या की तस्वीर (साइट फोटो)',
    uploadOrDrop: 'तस्वीर चुनें या यहाँ ड्रैग करें (JPEG, PNG, WebP अधिकतम 10MB)',
    aiDefectAnalysis: 'एआई दृष्टि पूर्व-सत्यापन विश्लेषण',
    yourName: 'नागरिक का पूरा नाम',
    yourEmail: 'आधिकारिक ईमेल',
    yourPhone: 'मोबाइल नंबर',
    submitComplaint: 'नगरपालिका रजिस्ट्री में शिकायत दर्ज करें',
    submitting: 'एआई द्वारा जांच और प्रेषण जारी...',
    sampleIssues: 'त्वरित नमूना उदाहरण:',
    potholeSample: '🛣️ गहरा सड़क गड्ढा',
    garbageSample: '🗑️ कचरे का ढेर',
    streetlightSample: '💡 खराब स्ट्रीट लाइट',
    waterLeakSample: '💧 जल पाइपलाइन रिसाव',

    // Action Cards
    howCanWeHelp: 'हम आपकी क्या सहायता कर सकते हैं?',
    officialServicesDir: 'आधिकारिक नागरिक सेवाएं निर्देशिका',
    card1Title: '1. नागरिक समस्या दर्ज करें',
    card1Desc: 'सड़क के गड्ढे, कचरा, स्ट्रीटलाइट खराबी, पानी का रिसाव और अन्य स्थानीय समस्याओं की शिकायत करें।',
    card1Action: 'शिकायत दर्ज करें',
    card2Title: '2. शिकायत की स्थिति जांचें',
    card2Desc: 'शिकायत दर्ज करने के बाद प्राप्त टोकन संख्या से वास्तविक समय स्थिति जांचें।',
    card2Action: 'स्थिति जांचें',
    card3Title: '3. संबंधित विभाग खोजें',
    card3Desc: 'अपनी समस्या के लिए जिम्मेदार नगरपालिका विभाग एवं प्रभारी अभियंता का विवरण देखें।',
    card3Action: '7 विभाग देखें',
    card4Title: '4. अन्य नागरिक सेवाएं',
    card4Desc: 'जन्म-मृत्यु प्रमाण पत्र, संपत्ति कर, व्यापार लाइसेंस व अन्य नागरिक सेवाएं।',
    card4Action: 'सेवाएं देखें',
    card5Title: '5. आपातकालीन संपर्क',
    card5Desc: 'महत्वपूर्ण आपातकालीन, आपदा नियंत्रण कक्ष व नगरपालिका हेल्पलाइन नंबर।',
    card5Action: 'हेल्पलाइन डायल करें (112 / 101)',
    card6Title: '6. सूचनाएं एवं परिपत्र',
    card6Desc: 'आधिकारिक नगरपालिका घोषणाएं, मार्ग डायवर्जन एवं सार्वजनिक सूचनाएं।',
    card6Action: 'परिपत्र देखें',

    // 6-Stage Timeline
    stage1Title: 'शिकायत पंजीकृत',
    stage2Title: 'विभाग आवंटित',
    stage3Title: 'अधिकारी समीक्षा',
    stage4Title: 'कार्य प्रगति पर',
    stage5Title: 'समाधान पूर्ण (प्रमाण अपलोड)',
    stage6Title: 'नागरिक सत्यापन',
    stageTimelineHeader: 'मानक 6-चरणीय नगरपालिका शिकायत निवारण समयरेखा:',
    trackInputPlaceholder: 'शिकायत / टोकन संख्या दर्ज करें (उदा. CIV-2026-001245 या CMP-101)',
    trackBtn: 'स्थिति जांचें',

    // Proof of Work
    proofOfWorkTitle: 'समाधान सत्यापन एवं कार्य का प्रमाण',
    proofOfWorkSubtitle: 'पारदर्शी नगरपालिका जवाबदेही: मरम्मत कार्य की आधिकारिक फोटो नागरिकों के सत्यापन हेतु प्रस्तुत।',
    sideBySide: 'आमने-सामने तुलना',
    afterProof: 'कार्य के बाद (प्रमाण)',
    beforeReport: 'कार्य से पहले',
    beforeLabel: '1. मरम्मत से पहले (नागरिक शिकायत)',
    afterLabel: '2. मरम्मत के बाद (आधिकारिक कार्य संपन्न)',
    resolutionDate: 'समाधान तिथि:',
    workCompletedLabel: 'पूर्ण किया गया कार्य:',
    officerVerificationLabel: 'अधिकारी सत्यापन:',
    rateCompletedWork: 'कार्य की गुणवत्ता का मूल्यांकन:',
    viewProofOfWork: 'कार्य का प्रमाण देखें',
    confirmResolution: 'समाधान सत्यापित करें',
    resolutionConfirmed: 'समाधान स्वीकृत',
    reopenComplaint: 'शिकायत पुनः खोलें',
    reopenModalTitle: 'शिकायत टोकन पुनः खोलें',
    reopenModalDesc: 'यदि कार्य अपूर्ण है या गुणवत्ता संतोषजनक नहीं है, तो कृपया पर्यवेक्षक हेतु कारण लिखें:',
    reopenReasonLabel: 'पुनः खोलने का कारण *',
    reopenReasonPlaceholder: 'विस्तार से बताएं कि कार्य में क्या कमी रह गई है...',
    submitReopen: 'पुनः खोलने का अनुरोध भेजें',
    cancel: 'रद्द करें',
    filterByDepartment: 'विभाग अनुसार फ़िल्टर करें:',
    allDepartmentsOption: 'सभी विभाग',

    // Departments
    deptAccessTitle: 'विभागीय कतार व स्थिति',
    deptAccessSubtitle: 'सभी 7 नगरपालिका विभागों की प्रशासनिक निगरानी एवं लाइव परिचालन स्थिति।',
    openOfficerConsole: 'अधिकारी डिस्पैच कंसोल खोलें',
    openComplaints: 'खुली शिकायतें:',
    inProgress: 'प्रगति पर:',
    resolved: 'समाधान पूर्ण:',
    pendingVerification: 'सत्यापन लंबित:',
    deptHead: 'विभागाध्यक्ष:',
    viewQueue: 'कतार देखें',

    // Metrics
    metricsTitle: 'नगरपालिका शिकायत निवारण प्रदर्शन संकेतक',
    metricsLive: 'रीयल-टाइम डैशबोर्ड मेट्रिक्स',
    complaintsReceived: 'प्राप्त नागरिक शिकायतें',
    complaintsResolved: 'निस्तारित शिकायतें',
    complaintsInProgress: 'प्रगति पर शिकायतें',
    resolutionRate: 'समाधान दर',
    avgResolutionTime: 'औसत समाधान समय',
    daysUnit: 'दिन',

    // Notices
    latestNoticesTitle: 'नवीनतम आधिकारिक सूचनाएं एवं परिपत्र',
    officialGazettes: 'आधिकारिक नगरपालिका राजपत्र',
    readNotice: 'विस्तार से पढ़ें →',

    // Popular Categories
    popularCategoriesTitle: 'लोकप्रिय नागरिक शिकायतें',
    clickToReport: 'विशिष्ट श्रेणी में शिकायत दर्ज करने हेतु क्लिक करें',

    // Tracker
    trackGrievanceTitle: 'शिकायत की स्थिति ट्रैक करें',
    trackGrievanceSubtitle: 'अपनी शिकायत संख्या (CIVIC-2026-XXXX) या कार्य आदेश संदर्भ संख्या दर्ज करें।',
    enterTicketId: 'शिकायत संख्या या संदर्भ # दर्ज करें',
    searchTicket: 'स्थिति खोजें',
    searching: 'खोज जारी...',
    quickCheckRecent: 'हालिया शिकायतें:',
    grievanceDossier: 'नगरपालिका आधिकारिक शिकायत विवरण',
    officialRefNo: 'कार्य आदेश संदर्भ संख्या:',
    filedOn: 'पंजीकरण तिथि एवं समय:',
    currentStatus: 'वर्तमान स्थिति:',
    assignedAgency: 'सक्षम नगरपालिका विभाग:',
    resolutionTimeline: 'लक्षित समाधान समय सीमा (SLA):',
    intakeAiReasoning: 'एआई मल्टी-एजेंट सत्यापन प्रक्रिया:',

    // Statuses
    statusSubmitted: 'पंजीकृत (दर्ज)',
    statusUnderReview: 'समीक्षाधीन (जांच जारी)',
    statusVerified: 'सत्यापित (स्वीकृत)',
    statusAssigned: 'दल नियुक्त (क्रू भेजा गया)',
    statusInProgress: 'कार्य प्रगति पर (मरम्मत जारी)',
    statusResolved: 'समाधान पूर्ण (मरम्मत सफल)',
    statusRejected: 'खारिज (अमान्य)',
    statusClosed: 'फाइल बंद (अभिलेख पूर्ण)',

    // Government Portal
    govPortalTitle: 'सरकारी विभागीय परिचालन पोर्टल',
    govPortalSubtitle: 'विभागीय शिकायत निवारण एवं कार्य आदेश प्रबंधन प्रणाली',
    selectDepartmentFirst: 'सर्वप्रथम अपना नगरपालिका विभाग चुनें',
    selectDepartmentDesc: 'अधिकारी क्रेडेंशियल सत्यापन से पूर्व अपना अधिकृत विभाग चुनें:',
    step1: 'चरण 1: विभाग का चयन',
    step2: 'चरण 2: प्राधिकारी सत्यापन',
    authorityLogin: 'प्राधिकारी अधिकारी लॉगिन',
    badgeNumberOrEmail: 'अधिकारी बैज नंबर अथवा आधिकारिक ईमेल',
    badgePlaceholder: 'उदा. DOT-402 या dispatcher@metropolis.gov',
    securityPin: 'विभागीय सुरक्षा पिन / पासवर्ड',
    pinPlaceholder: 'सुरक्षा पिन दर्ज करें (डेमो: citygov2026)',
    signInBtn: 'सत्यापित करें एवं विभागीय कतार में प्रवेश करें',
    verifyingBtn: 'नगरपालिका निर्देशिका से सत्यापन जारी...',
    quickLoginVerified: '1-क्लिक सत्यापित अधिकारी प्रोफाइल:',
    restrictedNetNotice: 'भारत सरकार / नगरपालिका प्रतिबंधित कंप्यूटर नेटवर्क • केवल अधिकृत प्रवेश',
    deptIsolationNotice: 'सख्त विभागीय अलगाव: प्राधिकारी केवल अपने विभाग से संबंधित शिकायतों का निरीक्षण और निस्तारण कर सकते हैं।',
    deptIsolationActive: 'विभागीय अलगाव सुरक्षा सक्रिय',
    workOrdersQueue: 'विभागीय कार्य आदेश रजिस्टर',
    noComplaintsForDept: 'के लिए कोई शिकायत दर्ज नहीं है',
    noComplaintsDesc: 'वर्तमान में इस विभागीय कतार में 0 सक्रिय शिकायतें या लंबित कार्य आदेश हैं। इस क्षेत्राधिकार की सभी नागरिक समस्याओं का समाधान हो चुका है अथवा कोई शिकायत दर्ज नहीं है।',
    switchDepartmentBtn: 'विभाग बदलें',
    searchTicketsPlaceholder: 'टिकट संख्या, पता, मुख्य शब्द खोजें...',
    allStatuses: 'सभी स्थितियाँ',
    allDepartments: 'सभी विभाग',
    dossierTitle: 'आधिकारिक शिकायत केस रिकॉर्ड',
    advanceLifecycle: 'शिकायत चरण आगे बढ़ाएं',
    markInProgress: 'कार्य प्रगति पर चिह्नित करें (क्रू तैनात)',
    markResolved: 'समाधान पूर्ण एवं साइट बहाल चिह्नित करें',
    rejectComplaint: 'अमान्य शिकायत खारिज करें',
    internalNoteLabel: 'पर्यवेक्षक आंतरिक टिप्पणी:',
    crewDispatchLabel: 'नियुक्त फील्ड परिचालन दल:',

    // Departments
    deptRoads: 'सड़क एवं परिवहन विभाग (सड़क विभाग)',
    deptRoadsDesc: 'सड़क मरम्मत, गड्ढे, डामर पैचिंग, लेन मार्किंग, फुटपाथ एवं पैदल पथ।',
    deptWater: 'नगरपालिका जल एवं सीवर प्राधिकरण',
    deptWaterDesc: 'जल आपूर्ति पाइपलाइन रिसाव, फायर हाइड्रेंट खराबी, सीवर जाम एवं नाला सफाई।',
    deptSanitation: 'स्वच्छता एवं ठोस अपशिष्ट प्रबंधन विभाग',
    deptSanitationDesc: 'कचरा उठाव, ओवरफ्लो डस्टबिन, सामुदायिक कंटेनर, सड़क सफाई एवं कीटनाशक।',
    deptLighting: 'पथ प्रकाश एवं विद्युत ब्यूरो',
    deptLightingDesc: 'स्ट्रीट लाइट, अंधेरे चौराहे, केबलिंग खराबी, विद्युत पोल एवं ट्रैफिक सिग्नल।',
    deptParks: 'उद्यान, शहरी वानिकी एवं सार्वजनिक स्थल',
    deptParksDesc: 'सार्वजनिक पार्क, खतरनाक पेड़ की टहनी, घास छंटाई एवं खेल उपकरण मरम्मत।',

    // Admin Portal
    adminPortalTitle: 'केंद्रीय नगरपालिका प्रशासन एवं डेटाबेस पोर्टल',
    adminPortalSubtitle: 'समग्र प्रशासनिक नियंत्रण • सभी विभागों एवं प्राधिकारियों की सूची • लाइव एसक्यूएल इंजन',
    allDeptsAndAuthorities: 'सभी विभाग एवं प्राधिकारी',
    allGovAccess: 'सर्व विभागीय नियंत्रण (सभी कतारें)',
    sqlConsole: 'डेटाबेस एवं एसक्यूएल कंसोल',
    runSql: 'एसक्यूएल क्वेरी चलाएं',
    runningSql: 'क्वेरी चल रही है...',
    presetQueries: 'मानक प्रशासनिक एसक्यूएल क्वेरी (1-क्लिक रन):',
    relationalSchemas: 'पोस्टग्रेएसक्यूएल रिलेशनल स्कीमा परिभाषाएँ',
    downloadSql: 'पूर्ण .sql डंप डाउनलोड करें',
    copySqlDump: 'एसक्यूएल डंप कॉपी करें',

    // Footer
    footerAboutDept: 'विभाग के बारे में',
    footerCitizenCharter: 'नागरिक अधिकार पत्र',
    footerRTI: 'सूचना का अधिकार (RTI)',
    footerOrgStructure: 'विभागीय संरचना एवं वार्ड',
    footerContactUs: 'मुख्यालय एवं संपर्क',
    footerCitizenServices: 'नागरिक सेवाएं',
    footerReportGrievance: 'शिकायत दर्ज करें',
    footerTrackStatus: 'शिकायत की स्थिति जांचें',
    footerProofOfWork: 'समाधान एवं प्रमाण',
    footerNotices: 'सार्वजनिक सूचनाएं',
    footerImportantLinks: 'महत्वपूर्ण लिंक',
    footerNationalPortal: 'भारत सरकार का राष्ट्रीय पोर्टल',
    footerCpgrams: 'सीपीजीआरएएमएस पोर्टल (pgportal.gov.in)',
    footerMohua: 'आवासन और शहरी कार्य मंत्रालय',
    footerEmergencyNumbers: 'आपातकालीन सेवाएं: टोल फ्री 112 / 101 / 102',
    footerHelpGov: 'सहायता एवं नीतियां',
    footerFAQ: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    footerAccessibility: 'पहुंच विवरण (Accessibility)',
    footerPrivacy: 'गोपनीयता नीति एवं नियम',
    footerWorkflowGuide: 'सिस्टम आर्किटेक्चर वर्कफ़्लो गाइड',
    footerCopyright: '© 2026 स्थानीय नागरिक समस्या निवारण एवं ट्रैकर',
    footerContentManaged: 'सामग्री नगरपालिका प्रशासन विभाग द्वारा प्रबंधित',
    footerLastUpdated: 'अंतिम अद्यतन: 14 सितंबर 2026',

    // Additional Form Keys
    uploadOrCapturePhoto: 'फोटो अपलोड / कैप्चर करें',
    describeProblem: 'समस्या का विवरण दें',
    formRef: 'प्रपत्र संदर्भ: CPGRAMS-MUN-2026',
    photoAttached: 'फोटो संलग्न है',
    changePhoto: 'फोटो बदलें',
    clickToBrowseOrSnapshot: 'ब्राउज़ करने या कैमरे से स्नैपशॉट लेने के लिए क्लिक करें',
    supportedImageFormats: 'समर्थित: JPEG, PNG, WebP',
    aiAssistedIdentification: 'एआई-सहायता प्राप्त समस्या पहचान जारी है...',
    aiAssistedIdentificationComplete: 'एआई-सहायता प्राप्त समस्या पहचान',
    detectedIssue: 'पहचानी गई समस्या:',
    department: 'विभाग:',
    priority: 'प्राथमिकता:',
    reviewDetailsAndAutofill: 'विवरण की समीक्षा करें और स्वतः भरें',
    autoRoutedBySystem: 'प्रणाली द्वारा स्वतः अग्रेषित',
    micVoiceGuidance: 'माइक दबाकर बोलें या टाइप करें (हिन्दी व अंग्रेजी समर्थित)',
    quickWards: 'वार्ड चुनें:',
    citizenContactOptional: 'नागरिक संपर्क (स्थिति ट्रैकिंग हेतु वैकल्पिक)',
    officialWorkOrderNotice: 'आधिकारिक कार्य आदेश एवं तुरंत ट्रैकिंग नंबर जारी होगा',
    submittingComplaint: 'शिकायत दर्ज हो रही है...',
    submitComplaintBtn: 'शिकायत दर्ज करें',
    photoRequiredWarning: 'कृपया समस्या स्थल की एक तस्वीर अपलोड करें',
    fullNamePlaceholder: 'पूरा नाम (वैकल्पिक)',
    emailPlaceholder: 'सूचनाओं हेतु ईमेल (वैकल्पिक)',
    phonePlaceholder: 'एसएमएस अपडेट हेतु मोबाइल नंबर (वैकल्पिक)',

    // Additional Proof of Work & Tracker Keys
    selectGrievance: 'शिकायत चुनें:',
    complaintNumber: 'शिकायत संख्या:',
    issueCategory: 'समस्या श्रेणी:',
    status: 'स्थिति:',
    statusResolvedLabel: 'समाधान हो चुका',
    photographicEvidenceBeforeAfter: 'तस्वीर प्रमाण (कार्य पूर्ण होने से पहले एवं बाद)',
    proofDispatchedToUserVia: 'राष्ट्रीय पोर्टल एसएमएस एवं व्हाट्सएप गेटवे द्वारा प्रेषित',
    target: 'लक्षित मोबाइल / ईमेल:',
    officialProofOfWorkDelivered: 'कार्य संपन्नता का आधिकारिक प्रमाण प्रेषित',
    govtPhotoVerification: 'सरकारी फोटो सत्यापन',
    proofSentAlert: 'नगर निगम अलर्ट: आपकी समस्या का समाधान हो चुका है। संपन्न कार्य की आधिकारिक तस्वीर प्रेषित कर दी गई है।',
    fullscreenProof: 'पूर्ण स्क्रीन प्रमाण',
    printCertificate: 'प्रमाणपत्र प्रिंट करें',
    pictureOfWorkDone: '📸 संपन्न कार्य की तस्वीर (बाद में)',
    reportedProblemBefore: 'शिकायत की गई समस्या (पहले)',
    citizenSignOffQuestion: 'नागरिक सत्यापन: क्या तस्वीर में काम पूरा दिख रहा है?',
    citizenSignOffHelp: 'आपका सत्यापन उच्च नगरपालिका मानक बनाए रखने में सहायक है और आधिकारिक जन ऑडिट चक्र पूरा करता है।',
    confirmAndApproveWorkDone: 'कार्य की पुष्टि करें और स्वीकृति दें',
    reportDefectOrReinspect: 'कमी बताएं / पुनः निरीक्षण का अनुरोध करें',
    verifiedAndAccepted: 'आपने इस मरम्मत कार्य को सत्यापित और स्वीकृत किया है!',
    reinspectionRequested: 'पुनः निरीक्षण का अनुरोध किया गया। मामला पर्यवेक्षक जांच हेतु चिह्नित।',
    certifiedProofOfWorkTitle: 'संपन्न कार्य का प्रमाणित तस्वीर प्रमाण',
    deliveredToCitizen: 'नागरिक को प्रेषित',
    dispatchedToCitizenMobile: 'नागरिक के मोबाइल पर प्रेषित:',
    closeFullscreen: 'फुलस्क्रीन बंद करें',
    inspectionView: 'निरीक्षण दृश्य:',
    sideBySideComparison: 'आमने-सामने तुलना',
    supervisingOfficer: 'पर्यवेक्षक अधिकारी:',
    qualitySignOff: 'गुणवत्ता अनुमोदन:',
    ratingLabel: 'रेटिंग:',
    reasonIncompleteLabel: 'तस्वीर में कार्य अधूरा या असंतोषजनक होने का कारण:',
    reasonIncompletePlaceholder: 'विस्तार से बताएं कि क्या कार्य अधूरा है (उदा. मलबा वहीं छूटा है, समतलीकरण नहीं हुआ, बत्ती अभी भी टिमटिमा रही है)...',
    submitReinspectionRequest: 'पुनः निरीक्षण का अनुरोध भेजें',
    cancelBtn: 'रद्द करें',
    repairSummaryLabel: 'मरम्मत कार्य सारांश:',
    materialsDeployedLabel: 'उपयोग की गई सामग्री एवं उपकरण:',
    recordedInAuditLog: 'आधिकारिक ऑडिट लॉग में दर्ज',
    municipalFieldAuditBadge: 'नगरपालिका फील्ड ऑडिट',
    proofSectionSubtitle: 'जमीनी मरम्मत कार्य पूरा होने पर नगरपालिका इंजीनियरों द्वारा अपलोड किया गया फोटो प्रमाण। नागरिक इसका सत्यापन करें।',
    beforeCitizenReportTag: 'नागरिक शिकायत',
    afterEngineerUploadTag: 'फील्ड इंजीनियर अपलोड',
    isoQualitySignOff: 'आईएसओ 9001 / सीपीजीआरएएमएस प्रमाणित',

    // Notifications
    notifications: 'सूचनाएं',
    citizenAlerts: 'नागरिक अलर्ट',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    noNotificationsYet: 'अभी कोई नई सूचना नहीं है।',
    noNotificationsDesc: 'नागरिक संदेश द्वारा शिकायत स्थिति में बदलाव होने पर आपको यहाँ तुरंत सूचना प्राप्त होगी।',
    notificationsAgentFooter: 'नागरिक संदेश (स्थिति एवं सूचना एजेंट) द्वारा स्वचालित रूप से उत्पन्न',
    verifiedProofPictureLabel: '📸 सत्यापित कार्य का फोटो प्रमाण',
    govRepairPhotoAttached: 'सरकारी मरम्मत फोटो संलग्न है',
    viewTicket: 'टिकट देखें',
    newBadge: 'नई',

    // Header and Modals
    selectAccessRole: 'पोर्टल एवं भूमिका चुनें',
    fileAndTrackComplaints: 'शिकायत दर्ज एवं ट्रैक करें',
    dispatchRepairProof: 'डिस्पैच, मरम्मत एवं कार्य प्रमाण',
    rbacAuditDb: 'प्रशासनिक नियंत्रण एवं एसक्यूएल',
    screenReaderAccessEnabled: 'स्क्रीन रीडर एक्सेस GIGW मानकों के अनुसार सक्षम है।',
    emergencyHelplinesTitle: 'महत्वपूर्ण आपातकालीन एवं नागरिक सहायता नंबर',
    officialCircularTitle: 'आधिकारिक नगर निगम सूचना',
    closeBtn: 'बंद करें',
    acknowledgeBtn: 'स्वीकार करें',

    // Voice & Dictation
    testVoiceBtn: 'टेस्ट वॉयस नोट',
    liveSpeechLabel: 'आवाज़ रिकॉर्ड:',
    fillSampleVoice: '👉 टेस्ट वॉयस सैंपल से भरें',
    sampleVoiceText: 'मुख्य सड़क पर बहुत गहरा गड्ढा है जिससे वाहनों को भारी खतरा हो रहा है और जलभराव भी हो गया है, कृपया त्वरित निस्तारण करें।',
    speechNoticeLabel: 'ध्वनि पहचान संदेश:',
    transcribingVoice: 'आवाज़ ट्रांसक्रिप्शन हो रहा है...',
    micInitError: 'माइक्रोफ़ोन प्रारंभ नहीं हो सका। कृपया टेस्ट वॉयस इनपुट का उपयोग करें।',

    // Form & GPS
    detectingGps: 'जीपीएस पता लगा रहे हैं...',
    aiClassifyingText: 'नगरपालिका विभागीय वर्गीकरण के आधार पर विश्लेषण किया जा रहा है।',

    // Department & Authority Login
    authorityAuthStep: '2. प्राधिकारी अधिकारी लॉगिन',
    accessingDeptQueue: 'चयनित सक्रिय विभाग (Active Agency)',
    oneClickOfficerProfile: '1-क्लिक अधिकृत अधिकारी प्रोफाइल:',
    badgeLabel: 'बैज संख्या:',
    pinLabel: 'पिन:',
    loginBtn: 'प्रवेश करें',
    badgeOrEmailLabel: 'अधिकारी बैज नंबर अथवा आधिकारिक ईमेल',
    securityPinLabel: 'विभागीय सुरक्षा कोड (Security PIN)',
    verifyingCredentials: 'सत्यापन जारी...',
    authenticateAndEnter: 'सत्यापित करें एवं प्रवेश करें',
    restrictedNetworkWarning: 'प्रतिबंधित सरकारी नेटवर्क: अनधिकृत प्रवेश सूचना प्रौद्योगिकी अधिनियम 2000 (IT Act 2000) के तहत गैरकानूनी है। सभी क्रियाकलाप लॉग किए जाते हैं।',
    digitalIndiaCommission: 'डिजिटल इंडिया एवं नगरपालिका लोक सेवा आयोग',
    step1SelectDept: 'चरण 1: विभाग चयन',
    step2VerifyAuthority: 'चरण 2: प्राधिकारी सत्यापन',
    selectDeptToAccess: '1. अधिकृत विभाग चुनें',
    agenciesAvailable: 'विभाग उपलब्ध',
    satyamevaJayateNic: 'सत्यमेव जयते • राष्ट्रीय सूचना विज्ञान केंद्र (NIC) मानक इंटरफ़ेस',

    // Gov Simulator & Admin
    invalidAdminPass: 'अमान्य प्रशासनिक पासवर्ड। कृपया मास्टर कुंजी "ADMIN" दर्ज करें।',
    agenciesTab: 'विभागीय निकाय',
    metricsTab: 'समय-सीमा व मीट्रिक्स',
    charterTab: 'नागरिक चार्टर',
    http403Enforced: 'धारा 403 लागू',
    govVerification: 'सत्यापन विवरण',
    nationalCivicHelpdesk: 'राष्ट्रीय नागरिक सहायता केंद्र',
    tollFreeHelpline: 'टोल-फ्री 24x7 हेल्पलाइन: ',
    dedicatedForCivicIntake: 'नागरिक शिकायतों के त्वरित निस्तारण हेतु समर्पित',
    officialGovMunicipalPortal: 'आधिकारिक नगरपालिका डिजिटल पोर्टल:',
    encryptedMunicipalServerDesc: 'सभी दर्ज की गई शिकायतें एवं कार्य आदेश आधिकारिक सरकारी सर्वर पर सीधे एनक्रिप्टेड रूप में प्रेषित किए जाते हैं।',
    dismissBtn: 'बंद करें',

    // Citizen Portal & Common Civic Keys
    welcomeCivicTitle: 'नगरपालिका लोक शिकायत निवारण पोर्टल',
    welcomeCivicSubtitle: 'शहर के सभी वार्डों में नागरिक समस्याओं को दर्ज करने, प्रगति ट्रैक करने और पूर्ण कार्यों के भौतिक सत्यापन हेतु आधिकारिक डिजिटल मंच।',
    reportGrievanceAction: 'नागरिक समस्या दर्ज करें',
    reportGrievanceDesc: 'सड़क गड्ढे, कचरा, स्ट्रीटलाइट खराबी, जल रिसाव व अन्य स्थानीय समस्याओं की त्वरित शिकायत करें।',
    fileGrievanceBtn: 'शिकायत दर्ज करें',
    trackComplaintAction: 'शिकायत की स्थिति ट्रैक करें',
    trackComplaintDesc: 'शिकायत संख्या/टोकन दर्ज कर समाधान स्थिति और निरीक्षण विवरण का वास्तविक समय में पता लगाएं।',
    checkStatusBtn: 'स्थिति जांचें',
    findDepartmentAction: 'संबंधित विभाग खोजें',
    findDepartmentDesc: 'अपनी समस्या से संबंधित अधिकृत नगर निगम विभाग, क्षेत्रीय अभियंता एवं नोडल अधिकारी की जानकारी प्राप्त करें।',
    viewDepartmentsBtn: 'सभी 7 विभाग देखें',
    citizenServicesAction: 'नागरिक सेवाएं',
    citizenServicesDesc: 'प्रमाणपत्र, व्यापार लाइसेंस, संपत्ति कर व अन्य आवश्यक नागरिक सेवाओं के लिए आवेदन करें।',
    accessCertificatesBtn: 'सेवाएं देखें',
    emergencyContactsAction: 'आपातकालीन संपर्क',
    emergencyContactsDesc: 'आपदा नियंत्रण, अग्नि, गंभीर जल भराव एवं आपातकालीन नगर निगम हेल्पलाइन नंबर (112 / 101)।',
    dialHelplinesBtn: 'हेल्पलाइन डायल करें (112 / 101)',
    noticesUpdatesAction: 'सूचनाएं एवं परिपत्र',
    noticesUpdatesDesc: 'नगरपालिका के आधिकारिक परिपत्र, सड़क कार्य सूचनाएं, मानसून परामर्श और जन सूचनाएं देखें।',
    viewCircularsBtn: 'परिपत्र देखें',
    trackYourComplaintTitle: 'अपनी शिकायत की स्थिति ट्रैक करें',
    trackYourComplaintDesc: 'एसएमएस या रसीद से प्राप्त विशिष्ट शिकायत संदर्भ संख्या दर्ज कर प्रगति की लाइव स्थिति देखें।',
    enterComplaintPlaceholder: 'शिकायत संदर्भ संख्या दर्ज करें (उदा. CMP-2025-0842)',
    trackStatusBtn: 'स्थिति खोजें',
    standardTimelineTitle: 'मानक 6-चरणीय नागरिक निवारण जीवन-चक्र',
    popularComplaintsTitle: 'प्रमुख नागरिक समस्याएं',
    clickToReportCat: 'फॉर्म में स्वतः भरने हेतु किसी भी श्रेणी पर क्लिक करें',
    departmentAccessTitle: 'विभागीय पहुंच एवं कार्यक्षेत्र',
    departmentAccessDesc: 'सक्रिय कार्य आदेशों एवं समाधान दल का प्रबंधन करने वाले अधिकृत नगर निगम इंजीनियरिंग प्रभाग।',
    openOfficerConsoleBtn: 'अधिकारी कंसोल खोलें',
    openComplaintsLabel: 'लंबित',
    inProgressLabel: 'प्रक्रियाधीन',
    resolvedLabel: 'निस्तारित',
    pendingVerificationLabel: 'सत्यापन प्रतीक्षित',
    viewQueueBtn: 'कार्य सूची देखें',
    perfIndicatorsTitle: 'प्रमुख कार्य निष्पादन संकेतक',
    realtimeDashboardMetrics: 'वास्तविक समय नगरपालिका निवारण डैशबोर्ड',
    resolvedComplaints: 'निस्तारित शिकायतें',
    readMoreNotice: 'विवरण पढ़ें',
    adminDashboard: 'प्रशासक डैशबोर्ड',
    photographicEvidence: 'फोटोग्राफिक साक्ष्य',
    reportCivicIssue: 'नागरिक समस्या दर्ज करें',
    reportCivicSubtitle: 'एआई श्रेणीकरण, जीपीएस स्थान टैगिंग एवं त्वरित विभागीय प्रेषण के साथ नगर निगम शिकायत दर्ज करें।',

    // Form Wizard Hindi
    formStepPhoto: 'फोटो',
    formStepDesc: 'विवरण',
    formStepLocation: 'स्थान',
    formStepContact: 'संपर्क',
    formStepReview: 'समीक्षा',
    formStepSubmit: 'जमा करें',
    stepOfTotal: 'चरण',
    uploadOrCaptureHeading: 'फोटो अपलोड अथवा कैप्चर करें',
    uploadOrCaptureSubheading: 'समस्या की स्पष्ट फोटो प्रदान करें। हमारी नागरिक निरीक्षण प्रणाली इसका सटीक विश्लेषण करती है।',
    clickToTakePhotoOrUpload: 'फोटो खींचने या अपलोड करने के लिए क्लिक करें',
    supportedFormats: 'JPG, PNG, WebP समर्थित',
    changePhotoBtn: 'फोटो बदलें',
    removePhotoBtn: 'फोटो हटाएं',
    photoUploadedSuccess: 'फोटो सफलतापूर्वक अपलोड हो गई',
    analyzingCivicVision: 'छवि विशेषताओं एवं नागरिक समस्या का विश्लेषण जारी...',
    orSelectSamplePhoto: 'अथवा परीक्षण हेतु आधिकारिक नागरिक श्रेणी फोटो चुनें:',
    verifiedCategoriesCount: '10 सत्यापित नगरपालिका श्रेणियां',
    nextReviewDescBtn: 'आगे: विवरण की समीक्षा करें',
    issueDescHeading: 'समस्या का विवरण',
    issueDescSubheading: 'समस्या के विवरण की समीक्षा करें व सुधारें। आप विशिष्ट लैंडमार्क अथवा विभागीय टिप्पणी जोड़ सकते हैं।',
    aiGeneratedDescLabel: 'निरीक्षण विवरण (संशोधन योग्य)',
    editableBadge: 'संशोधन योग्य',
    descFieldPlaceholder: 'समस्या का विवरण दर्ज करें (उदा. मुख्य प्रवेश द्वार व दीवार क्षतिग्रस्त, पैदल मार्ग में अवरोध)...',
    descFieldHint: 'नागरिक आधिकारिक सबमिशन से पूर्व विवरण को पूर्णतः संपादित या विस्तृत कर सकते हैं।',
    backToPhotoBtn: 'फोटो पर वापस जाएं',
    nextConfirmLocationBtn: 'आगे: स्थान की पुष्टि करें',
    locationVerificationHeading: 'स्थान सत्यापन',
    locationVerificationSubheading: 'सटीक स्थान से नगरपालिका दल मौके पर त्वरित गति से पहुंच सकता है।',
    detectedAddressWard: 'सत्यापित पता एवं वार्ड',
    useCurrentGpsBtn: 'लाइव जीपीएस स्थान का उपयोग करें',
    editLocationBtn: 'स्थान संपादित करें',
    doneEditingBtn: 'संपादन पूर्ण',
    gpsCoordinatesLabel: 'जीपीएस निर्देशांक:',
    gpsAccuracyLabel: 'सटीकता:',
    gpsMandatoryNote: 'वैधानिक नगरपालिका कार्य प्रेषण हेतु उच्च सटीकता वाला जीपीएस अनिवार्य है।',
    locationInputPlaceholder: 'सड़क, लैंडमार्क या वार्ड संख्या दर्ज करें...',
    backBtn: 'पीछे जाएं',
    nextContactBtn: 'आगे: संपर्क विवरण',
    contactDetailsHeading: 'नागरिक संपर्क विवरण',
    contactDetailsSubheading: 'आधिकारिक एसएमएस अपडेट एवं वैधानिक सत्यापन सूचनाएं प्राप्त करने हेतु मोबाइल नंबर अनिवार्य है।',
    mobileNumberLabel: 'मोबाइल नंबर',
    mobileMandatoryBadge: '* (एसएमएस अपडेट हेतु अनिवार्य)',
    mobilePlaceholder: '+91 98765 43210 अथवा 10 अंकों का मोबाइल नंबर',
    mobileDispatchNote: 'समाधान अलर्ट एवं कार्य पूर्णता का फोटो प्रमाण इसी नंबर पर भेजा जाएगा।',
    citizenNameOptional: 'नागरिक का नाम (वैकल्पिक)',
    citizenNamePlaceholder: 'आपका पूरा नाम',
    citizenEmailOptional: 'ईमेल पता (वैकल्पिक)',
    citizenEmailPlaceholder: 'citizen@example.gov.in',
    nextReviewComplaintBtn: 'आगे: शिकायत की समीक्षा करें',
    reviewComplaintHeading: 'शिकायत की समीक्षा',
    reviewComplaintSubheading: 'नगरपालिका नागरिक रजिस्ट्री में आधिकारिक प्रेषण से पूर्व सभी विवरण सत्यापित करें।',
    classifiedIssueLabel: 'वर्गीकृत समस्या',
    departmentLabel: 'संबंधित विभाग',
    severityLabel: 'प्राथमिकता स्तर',
    descriptionReviewLabel: 'विवरण:',
    locationReviewLabel: 'स्थान:',
    mobileSmsTargetLabel: 'मोबाइल नंबर (एसएमएस लक्ष्य):',
    backToEditBtn: 'संपादन पर वापस जाएं',
    submittingToCivicRegistry: 'नागरिक रजिस्ट्री में दर्ज हो रहा है...',
    submitOfficialComplaintBtn: 'आधिकारिक शिकायत दर्ज करें',
    selectIssueCategoryPrompt: 'समस्या की श्रेणी चुनें',
    manualCategoryOverride: 'नागरिक द्वारा चयनित श्रेणी',
  },
};

export type TranslateFunction = ((key: string) => string) & Translations & Record<string, any>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslateFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('civic_portal_lang');
      if (saved === 'hi' || saved === 'en') return saved;
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('civic_portal_lang', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const tValue = React.useMemo<TranslateFunction>(() => {
    const dict = translations[language] || translations.en;
    const fn = ((key: string): string => {
      if (typeof key === 'string') {
        if (key in dict) return (dict as any)[key];
        if (key in translations.en) return (translations.en as any)[key];
        return key;
      }
      return '';
    }) as TranslateFunction;

    Object.assign(fn, dict);

    return new Proxy(fn, {
      get(target, prop, receiver) {
        if (typeof prop === 'string' && prop in dict) {
          return (dict as any)[prop];
        }
        if (typeof prop === 'string' && prop in translations.en) {
          return (translations.en as any)[prop];
        }
        return Reflect.get(target, prop, receiver);
      },
      apply(target, _thisArg, argArray) {
        const key = argArray[0];
        if (typeof key === 'string') {
          if (key in dict) return (dict as any)[key];
          if (key in translations.en) return (translations.en as any)[key];
          return key;
        }
        return '';
      },
    });
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: tValue,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
