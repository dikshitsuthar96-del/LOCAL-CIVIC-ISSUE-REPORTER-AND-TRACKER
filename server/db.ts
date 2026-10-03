import {
  Complaint,
  ComplaintStatus,
  Department,
  StatusHistoryRecord,
  NotificationItem,
  GovActionPayload,
  CitizenNotificationRecord,
  IssueCategory,
  PriorityLevel,
  JurisdictionWard,
  RoutingRule,
  SlaRule,
  EscalationRule,
  IssueCategoryConfig,
} from '../src/types.js';
import { CIVIC_ASSETS, getCivicBeforeImage, getCivicAfterImage } from './civicImages.js';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_transport',
    name: 'Public Works & Road Infrastructure (PWD / Roads)',
    code: 'PWD-ROADS',
    contactEmail: 'roads@citygov.org',
    description: 'Road repair, potholes, asphalt resurfacing, lane markings, footpaths, bridges, and municipal roadway safety.',
    categories: ['pothole', 'sidewalk', 'other'],
    averageResponseHours: 48,
  },
  {
    id: 'dept_sanitation',
    name: 'Sanitation & Solid Waste Management',
    code: 'DSWM-OPS',
    contactEmail: 'waste@citygov.org',
    description: 'Garbage disposal, recycling overflow, municipal dumpsters, litter mitigation, and street sweeping.',
    categories: ['garbage', 'other'],
    averageResponseHours: 24,
  },
  {
    id: 'dept_lighting',
    name: 'Street Lighting & Electrical Department',
    code: 'SLED-ELEC',
    contactEmail: 'lighting@citygov.org',
    description: 'Streetlamps, pedestrian illumination, dark spot alleviation, and municipal power conduit repairs.',
    categories: ['streetlight', 'traffic_signal', 'other'],
    averageResponseHours: 36,
  },
  {
    id: 'dept_water',
    name: 'Municipal Water & Sewer Authority',
    code: 'MWSA-ENG',
    contactEmail: 'waterworks@citygov.org',
    description: 'Water main breaks, storm drain clogging, fire hydrant leaks, and sewage overflows.',
    categories: ['water_leak', 'other'],
    averageResponseHours: 12,
  },
  {
    id: 'dept_parks',
    name: 'Parks, Urban Trees & Horticulture',
    code: 'PUH-ENV',
    contactEmail: 'parks@citygov.org',
    description: 'Fallen branches, root sidewalk disruptions, park vandalism, graffiti removal, and public trees.',
    categories: ['tree_hazard', 'graffiti', 'other'],
    averageResponseHours: 72,
  },
];

export const DEPARTMENTS: Department[] = INITIAL_DEPARTMENTS;

export const INITIAL_JURISDICTIONS: JurisdictionWard[] = [
  {
    id: 'ward-01',
    name: 'Ward 1 - Downtown Civic Center',
    code: 'WARD-01-CENTRAL',
    zone: 'North Central Zone',
    zonalOfficerName: 'Amit Verma (Executive Engineer)',
    zonalOfficerBadge: 'PWD-W1-01',
    contactPhone: '+91-11-2345-0001',
    coverageArea: 'Civic Plaza, Metro North Corridor, Connaught Ring',
  },
  {
    id: 'ward-02',
    name: 'Ward 2 - Elmwood & Heritage Block',
    code: 'WARD-02-EAST',
    zone: 'East Riverbank Zone',
    zonalOfficerName: 'Priya Nair (Sanitation Lead)',
    zonalOfficerBadge: 'SAN-W2-04',
    contactPhone: '+91-11-2345-0002',
    coverageArea: 'Elmwood Avenue, Old City Gates, Market Yard',
  },
  {
    id: 'ward-03',
    name: 'Ward 3 - West Industrial & Tech Corridor',
    code: 'WARD-03-WEST',
    zone: 'West Transit Corridor',
    zonalOfficerName: 'Marcus Sterling (Executive Engineer)',
    zonalOfficerBadge: 'DOT-402',
    contactPhone: '+91-11-2345-0003',
    coverageArea: 'West Elm Street, Sector 12, Industrial Outer Ring',
  },
  {
    id: 'ward-04',
    name: 'Ward 4 - South Residential & Riverside',
    code: 'WARD-04-SOUTH',
    zone: 'South Municipal Zone',
    zonalOfficerName: 'Elena Rostova (Utility Supervisor)',
    zonalOfficerBadge: 'WATER-109',
    contactPhone: '+91-11-2345-0004',
    coverageArea: 'Riverside Drive, Green Valley, South Colony',
  },
  {
    id: 'ward-05',
    name: 'Ward 5 - University & Northern Parkland',
    code: 'WARD-05-NORTH',
    zone: 'North Urban Forestry Zone',
    zonalOfficerName: 'Anita Roy (Parks Superintendent)',
    zonalOfficerBadge: 'PARKS-511',
    contactPhone: '+91-11-2345-0005',
    coverageArea: 'Campus Road, Northern Botanical Woods, Lakefront',
  },
];

export const INITIAL_ROUTING_RULES: RoutingRule[] = [
  {
    id: 'rule-pothole',
    category: 'pothole',
    departmentId: 'dept_transport',
    departmentName: 'Public Works & Road Infrastructure (PWD / Roads)',
    priorityLevel: 'HIGH',
    keywords: ['pothole', 'road', 'asphalt', 'crater', 'bitumen', 'tarmac', 'sadak', 'gaddha', 'cavity'],
    autoAssignOfficerBadge: 'DOT-402',
    isActive: true,
  },
  {
    id: 'rule-garbage',
    category: 'garbage',
    departmentId: 'dept_sanitation',
    departmentName: 'Sanitation & Solid Waste Management',
    priorityLevel: 'MEDIUM',
    keywords: ['garbage', 'trash', 'dumpster', 'waste', 'litter', 'kachra', 'dumping', 'bin'],
    autoAssignOfficerBadge: 'SAN-304',
    isActive: true,
  },
  {
    id: 'rule-streetlight',
    category: 'streetlight',
    departmentId: 'dept_lighting',
    departmentName: 'Street Lighting & Electrical Department',
    priorityLevel: 'MEDIUM',
    keywords: ['streetlight', 'light', 'pole', 'lamp', 'dark', 'bulb', 'wire', 'luminaire'],
    autoAssignOfficerBadge: 'LIGHT-205',
    isActive: true,
  },
  {
    id: 'rule-water-leak',
    category: 'water_leak',
    departmentId: 'dept_water',
    departmentName: 'Municipal Water & Sewer Authority',
    priorityLevel: 'EMERGENCY',
    keywords: ['water', 'leak', 'pipeline', 'sewer', 'burst', 'drain', 'paani', 'hydrant', 'flood'],
    autoAssignOfficerBadge: 'WATER-109',
    isActive: true,
  },
  {
    id: 'rule-traffic-signal',
    category: 'traffic_signal',
    departmentId: 'dept_lighting',
    departmentName: 'Street Lighting & Electrical Department',
    priorityLevel: 'EMERGENCY',
    keywords: ['signal', 'traffic light', 'intersection', 'red light', 'amber', 'traffic'],
    autoAssignOfficerBadge: 'LIGHT-205',
    isActive: true,
  },
  {
    id: 'rule-sidewalk',
    category: 'sidewalk',
    departmentId: 'dept_transport',
    departmentName: 'Public Works & Road Infrastructure (PWD / Roads)',
    priorityLevel: 'MEDIUM',
    keywords: ['sidewalk', 'footpath', 'paver', 'curb', 'pedestrian', 'walkway'],
    autoAssignOfficerBadge: 'DOT-402',
    isActive: true,
  },
  {
    id: 'rule-tree',
    category: 'tree_hazard',
    departmentId: 'dept_parks',
    departmentName: 'Parks, Urban Trees & Horticulture',
    priorityLevel: 'HIGH',
    keywords: ['tree', 'branch', 'fallen', 'trunk', 'park', 'ped', 'foliage', 'limb'],
    autoAssignOfficerBadge: 'PARKS-511',
    isActive: true,
  },
  {
    id: 'rule-graffiti',
    category: 'graffiti',
    departmentId: 'dept_parks',
    departmentName: 'Parks, Urban Trees & Horticulture',
    priorityLevel: 'LOW',
    keywords: ['graffiti', 'spray', 'vandalism', 'defacement', 'paint'],
    autoAssignOfficerBadge: 'PARKS-511',
    isActive: true,
  },
  {
    id: 'rule-other',
    category: 'other',
    departmentId: 'dept_transport',
    departmentName: 'Public Works & Road Infrastructure (PWD / Roads)',
    priorityLevel: 'MEDIUM',
    keywords: ['gate', 'structure', 'entrance', 'encroachment', 'barrier', 'wall'],
    autoAssignOfficerBadge: 'DOT-402',
    isActive: true,
  },
];

export const INITIAL_SLA_RULES: SlaRule[] = [
  { id: 'sla-trans-emg', departmentId: 'dept_transport', departmentName: 'Public Works & Road Infrastructure (PWD / Roads)', priority: 'EMERGENCY', maxResolutionHours: 6, firstResponseHours: 1 },
  { id: 'sla-trans-high', departmentId: 'dept_transport', departmentName: 'Public Works & Road Infrastructure (PWD / Roads)', priority: 'HIGH', maxResolutionHours: 24, firstResponseHours: 2 },
  { id: 'sla-trans-med', departmentId: 'dept_transport', departmentName: 'Public Works & Road Infrastructure (PWD / Roads)', priority: 'MEDIUM', maxResolutionHours: 48, firstResponseHours: 4 },
  { id: 'sla-trans-low', departmentId: 'dept_transport', departmentName: 'Public Works & Road Infrastructure (PWD / Roads)', priority: 'LOW', maxResolutionHours: 72, firstResponseHours: 8 },

  { id: 'sla-san-emg', departmentId: 'dept_sanitation', departmentName: 'Sanitation & Solid Waste Management', priority: 'EMERGENCY', maxResolutionHours: 4, firstResponseHours: 1 },
  { id: 'sla-san-high', departmentId: 'dept_sanitation', departmentName: 'Sanitation & Solid Waste Management', priority: 'HIGH', maxResolutionHours: 12, firstResponseHours: 2 },
  { id: 'sla-san-med', departmentId: 'dept_sanitation', departmentName: 'Sanitation & Solid Waste Management', priority: 'MEDIUM', maxResolutionHours: 24, firstResponseHours: 3 },
  { id: 'sla-san-low', departmentId: 'dept_sanitation', departmentName: 'Sanitation & Solid Waste Management', priority: 'LOW', maxResolutionHours: 48, firstResponseHours: 6 },

  { id: 'sla-light-emg', departmentId: 'dept_lighting', departmentName: 'Street Lighting & Electrical Department', priority: 'EMERGENCY', maxResolutionHours: 6, firstResponseHours: 1 },
  { id: 'sla-light-high', departmentId: 'dept_lighting', departmentName: 'Street Lighting & Electrical Department', priority: 'HIGH', maxResolutionHours: 18, firstResponseHours: 2 },
  { id: 'sla-light-med', departmentId: 'dept_lighting', departmentName: 'Street Lighting & Electrical Department', priority: 'MEDIUM', maxResolutionHours: 36, firstResponseHours: 4 },
  { id: 'sla-light-low', departmentId: 'dept_lighting', departmentName: 'Street Lighting & Electrical Department', priority: 'LOW', maxResolutionHours: 72, firstResponseHours: 8 },

  { id: 'sla-water-emg', departmentId: 'dept_water', departmentName: 'Municipal Water & Sewer Authority', priority: 'EMERGENCY', maxResolutionHours: 3, firstResponseHours: 1 },
  { id: 'sla-water-high', departmentId: 'dept_water', departmentName: 'Municipal Water & Sewer Authority', priority: 'HIGH', maxResolutionHours: 8, firstResponseHours: 2 },
  { id: 'sla-water-med', departmentId: 'dept_water', departmentName: 'Municipal Water & Sewer Authority', priority: 'MEDIUM', maxResolutionHours: 16, firstResponseHours: 3 },
  { id: 'sla-water-low', departmentId: 'dept_water', departmentName: 'Municipal Water & Sewer Authority', priority: 'LOW', maxResolutionHours: 36, firstResponseHours: 6 },

  { id: 'sla-parks-emg', departmentId: 'dept_parks', departmentName: 'Parks, Urban Trees & Horticulture', priority: 'EMERGENCY', maxResolutionHours: 6, firstResponseHours: 1 },
  { id: 'sla-parks-high', departmentId: 'dept_parks', departmentName: 'Parks, Urban Trees & Horticulture', priority: 'HIGH', maxResolutionHours: 24, firstResponseHours: 3 },
  { id: 'sla-parks-med', departmentId: 'dept_parks', departmentName: 'Parks, Urban Trees & Horticulture', priority: 'MEDIUM', maxResolutionHours: 48, firstResponseHours: 6 },
  { id: 'sla-parks-low', departmentId: 'dept_parks', departmentName: 'Parks, Urban Trees & Horticulture', priority: 'LOW', maxResolutionHours: 96, firstResponseHours: 12 },
];

export const INITIAL_ESCALATION_RULES: EscalationRule[] = [
  {
    id: 'esc-rule-pwd',
    departmentId: 'dept_transport',
    thresholdHoursAfterSla: 0,
    escalationTargetRole: 'Zonal Chief Engineer & Metropolis City Administrator',
    escalationOfficerBadge: 'MUNI-001',
    escalationOfficerName: 'Jane Vance (City Operations Administrator)',
    notifyCitizenOnEscalation: true,
    priorityElevation: 'EMERGENCY',
  },
  {
    id: 'esc-rule-sanitation',
    departmentId: 'dept_sanitation',
    thresholdHoursAfterSla: 0,
    escalationTargetRole: 'Commissioner of Solid Waste & Public Hygiene',
    escalationOfficerBadge: 'SAN-304',
    escalationOfficerName: 'Carlos Rivera (Sanitation Lead)',
    notifyCitizenOnEscalation: true,
    priorityElevation: 'EMERGENCY',
  },
  {
    id: 'esc-rule-lighting',
    departmentId: 'dept_lighting',
    thresholdHoursAfterSla: 0,
    escalationTargetRole: 'Chief Electrical Grid Inspector',
    escalationOfficerBadge: 'LIGHT-205',
    escalationOfficerName: 'Vikram Patel (Electrical Grid Dispatcher)',
    notifyCitizenOnEscalation: true,
    priorityElevation: 'EMERGENCY',
  },
  {
    id: 'esc-rule-water',
    departmentId: 'dept_water',
    thresholdHoursAfterSla: 0,
    escalationTargetRole: 'Director General of Municipal Water Works',
    escalationOfficerBadge: 'WATER-109',
    escalationOfficerName: 'Elena Rostova (Utility Dispatch Supervisor)',
    notifyCitizenOnEscalation: true,
    priorityElevation: 'EMERGENCY',
  },
  {
    id: 'esc-rule-parks',
    departmentId: 'dept_parks',
    thresholdHoursAfterSla: 0,
    escalationTargetRole: 'Director of Urban Forestry & Parks',
    escalationOfficerBadge: 'PARKS-511',
    escalationOfficerName: 'Anita Roy (Urban Forestry Dispatcher)',
    notifyCitizenOnEscalation: true,
    priorityElevation: 'EMERGENCY',
  },
];

export const INITIAL_CATEGORIES: IssueCategoryConfig[] = [
  {
    id: 'pothole',
    nameEn: 'Road & Pothole Damage',
    nameHi: 'सड़क एवं गड्ढा',
    icon: '🛣️',
    defaultDepartmentId: 'dept_transport',
    defaultSeverity: 'HIGH',
    descriptionEn: 'Roadway asphalt crater, cracked bitumen surface, or potholes causing vehicular and traffic hazard.',
    descriptionHi: 'सड़क की डामर सतह क्षतिग्रस्त, गड्ढे एवं दरारें जिससे यातायात में बाधा हो रही है।',
  },
  {
    id: 'garbage',
    nameEn: 'Garbage & Sanitation Dump',
    nameHi: 'कचरा एवं स्वच्छता',
    icon: '🗑️',
    defaultDepartmentId: 'dept_sanitation',
    defaultSeverity: 'MEDIUM',
    descriptionEn: 'Overflowing municipal solid waste bin, strewn litter, or uncollected garbage pile on public pathway.',
    descriptionHi: 'सार्वजनिक रास्ते पर फैला कचरा, भरा हुआ कूड़ेदान अथवा अनकलेक्टेड अपशिष्ट का ढेर।',
  },
  {
    id: 'streetlight',
    nameEn: 'Broken Streetlight / Electrical Pole',
    nameHi: 'स्ट्रीट लाइट / बिजली का खंभा',
    icon: '💡',
    defaultDepartmentId: 'dept_lighting',
    defaultSeverity: 'MEDIUM',
    descriptionEn: 'Defective street lamp fixture, non-functional luminaire, or hazardous dangling wiring.',
    descriptionHi: 'खराब स्ट्रीट लाइट, बंद लैंप पोस्ट अथवा खतरनाक झूलते बिजली के तार।',
  },
  {
    id: 'water_leak',
    nameEn: 'Water Supply Pipeline Leak',
    nameHi: 'पानी का रिसाव / पाइपलाइन',
    icon: '🚰',
    defaultDepartmentId: 'dept_water',
    defaultSeverity: 'EMERGENCY',
    descriptionEn: 'Pressurized water main pipeline fracture with continuous surface pooling and loss of drinking water.',
    descriptionHi: 'पीने के पानी की मुख्य पाइपलाइन में भारी रिसाव एवं सड़क पर जल भराव।',
  },
  {
    id: 'drainage' as any,
    nameEn: 'Blocked Drainage / Waterlogging',
    nameHi: 'जल निकासी / सीवर भराव',
    icon: '🌊',
    defaultDepartmentId: 'dept_water',
    defaultSeverity: 'HIGH',
    descriptionEn: 'Clogged storm drain or open sewer overflow creating stagnant water stagnation and health hazard.',
    descriptionHi: 'अवरुद्ध नाला अथवा सीवर का गंदा पानी सड़क पर फैलने से जल भराव।',
  },
  {
    id: 'sidewalk',
    nameEn: 'Broken Sidewalk / Footpath Paver',
    nameHi: 'फुटपाथ / पैदल मार्ग',
    icon: '🚶',
    defaultDepartmentId: 'dept_transport',
    defaultSeverity: 'MEDIUM',
    descriptionEn: 'Uneven displaced concrete sidewalk pavers or broken pedestrian walkway kerb causing trip hazards.',
    descriptionHi: 'टूटा हुआ अथवा असमतल फुटपाथ जिससे पैदल यात्रियों को गिरने का खतरा है।',
  },
  {
    id: 'traffic_signal',
    nameEn: 'Traffic Signal Outage',
    nameHi: 'ट्रैफिक सिग्नल खराबी',
    icon: '🚦',
    defaultDepartmentId: 'dept_lighting',
    defaultSeverity: 'EMERGENCY',
    descriptionEn: 'Intersection traffic light completely unlit or stuck in flashing error state creating collision risk.',
    descriptionHi: 'चौराहे का ट्रैफिक सिग्नल बंद अथवा एरर मोड में जिससे दुर्घटना की आशंका है।',
  },
  {
    id: 'tree_hazard',
    nameEn: 'Fallen Tree / Hazardous Branch',
    nameHi: 'पेड़ / खतरनाक शाखा',
    icon: '🌳',
    defaultDepartmentId: 'dept_parks',
    defaultSeverity: 'HIGH',
    descriptionEn: 'Storm-damaged tree trunk or heavy broken branch obstructing traffic lanes or power lines.',
    descriptionHi: 'तूफान से टूटा पेड़ अथवा खतरनाक शाखा जिससे मार्ग या बिजली की तारें अवरुद्ध हैं।',
  },
  {
    id: 'graffiti',
    nameEn: 'Public Property Defacement / Graffiti',
    nameHi: 'सार्वजनिक संपत्ति विरूपण',
    icon: '🎨',
    defaultDepartmentId: 'dept_parks',
    defaultSeverity: 'LOW',
    descriptionEn: 'Spray paint vandalism or unauthorized postings on civic walls and public transport infrastructure.',
    descriptionHi: 'सार्वजनिक दीवारों अथवा बुनियादी ढांचे पर स्प्रे पेंट या अनाधिकृत विरूपण।',
  },
  {
    id: 'other',
    nameEn: 'Public Gate / Structure / Encroachment',
    nameHi: 'मुख्य द्वार / संरचना / अतिक्रमण',
    icon: '🏛️',
    defaultDepartmentId: 'dept_transport',
    defaultSeverity: 'MEDIUM',
    descriptionEn: 'Public gateway, entrance archway, perimeter wall damage, or unauthorized structural encroachment.',
    descriptionHi: 'सार्वजनिक प्रवेश द्वार, मेहराब, चारदीवारी क्षति अथवा अनाधिकृत संरचनात्मक अतिक्रमण।',
  },
];

// Helper to strip undefined values as required by Production Directive 6
export function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Sample initial complaints with realistic photos & histories
function createInitialComplaints(): Complaint[] {
  const now = Date.now();
  const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();
  const hoursFromNow = (h: number) => new Date(now + h * 3600 * 1000).toISOString();

  return [
    {
      id: 'CIVIC-2026-1042',
      officialReferenceNumber: 'WO-DOT-2026-8812',
      issueType: 'pothole',
      title: 'Deep Asphalt Pothole on Main Corridor',
      description: 'Dangerous pothole approximately 8 inches deep near the bike lane causing wheel alignment hazards.',
      location: '412 West Elm Street, Ward 3',
      departmentId: 'dept_transport',
      departmentName: 'Department of Transportation & Streets',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      photoUrl: CIVIC_ASSETS.categories.pothole.before,
      submitterName: 'Elena Rostova',
      submitterEmail: 'elena.r@example.com',
      submitterPhone: '555-0192',
      assignedOfficer: 'Marcus Sterling (Executive Engineer)',
      assignedOfficerBadge: 'DOT-402',
      assignedCrew: 'Road Maintenance Unit #4 (Heavy Sawcut & Paving Crew)',
      slaHours: 24,
      slaDeadline: hoursAgo(2), // Overdue by 2 hours!
      isOverdue: true,
      isEscalated: false,
      lastStatusCheck: {
        checkedAt: hoursAgo(2),
        checkedBy: 'Monitoring Agent (Nagrik Sandesh)',
        progressSummary: 'Crews active on site. Sawcut and cold-mix patch applied; waiting on asphalt roller.',
        actionTaken: 'Traffic cones placed, compaction scheduled.',
      },
      notificationsSent: [
        {
          id: 'notif-disp-1042-1',
          complaintId: 'CIVIC-2026-1042',
          channel: 'SMS',
          timestamp: hoursAgo(26),
          title: 'Complaint Registered',
          message: 'Metropolis Municipal Alert: Grievance #CIVIC-2026-1042 registered with Dept of Transportation.',
          recipient: '555-0192',
          deliveryStatus: 'DELIVERED',
        },
        {
          id: 'notif-disp-1042-2',
          complaintId: 'CIVIC-2026-1042',
          channel: 'PORTAL',
          timestamp: hoursAgo(2),
          title: 'Work In Progress',
          message: 'Field crew deployed at 412 West Elm Street. Asphalt sawcut and leveling underway.',
          recipient: 'elena.r@example.com',
          deliveryStatus: 'DELIVERED',
        },
      ],
      createdAt: hoursAgo(26),
      updatedAt: hoursAgo(2),
      statusHistory: [
        {
          id: 'hist-1042-1',
          complaintId: 'CIVIC-2026-1042',
          timestamp: hoursAgo(26),
          previousStatus: 'FILED',
          newStatus: 'FILED',
          rawStatus: 'REC_INGEST_ACK_01',
          plainLanguageSummary: 'Your complaint was successfully filed and routed to the Department of Transportation.',
          actor: 'Civic Sahayak (Intake AI)',
          agentGenerated: true,
        },
        {
          id: 'hist-1042-2',
          complaintId: 'CIVIC-2026-1042',
          timestamp: hoursAgo(18),
          previousStatus: 'FILED',
          newStatus: 'ASSIGNED',
          rawStatus: 'WO_DISPATCH_CREW_04',
          plainLanguageSummary: 'Road Maintenance Crew #4 was assigned to inspect the pothole and measure asphalt depth.',
          actor: 'Nagrik Sandesh (Monitoring Agent)',
          agentGenerated: true,
        },
        {
          id: 'hist-1042-3',
          complaintId: 'CIVIC-2026-1042',
          timestamp: hoursAgo(2),
          previousStatus: 'ASSIGNED',
          newStatus: 'IN_PROGRESS',
          rawStatus: 'OPS_SAWCUT_PATCH_ACTIVE',
          plainLanguageSummary: 'Crews are currently on-site cutting and filling the asphalt. Cold-mix patch applied; steam rolling in progress.',
          actor: 'Nagrik Sandesh (Monitoring Agent)',
          agentGenerated: true,
        },
      ],
      intakeTrace: [
        {
          nodeName: 'classify_image',
          title: 'Visual Defect Classification',
          timestamp: hoursAgo(26),
          durationMs: 412,
          inputSummary: 'Street pavement photo with visible rim impact cavity',
          reasoning: 'Visual inspection reveals surface fracture, aggregate loss, and sub-base exposure exceeding 4 inches in depth.',
          outputSummary: 'Classified: pothole (Confidence 98%, Severity: HIGH)',
          status: 'success',
        },
        {
          nodeName: 'validate_with_text',
          title: 'Multimodal Text Cross-Check',
          timestamp: hoursAgo(26),
          durationMs: 230,
          inputSummary: 'User notes 8-inch depth and bike lane risk on West Elm St',
          reasoning: 'Image visual cues align directly with user-described road hazard location and vehicular puncture risk.',
          outputSummary: 'Consistency confirmed: High semantic match',
          status: 'success',
        },
        {
          nodeName: 'determine_department',
          title: 'Municipal Routing Rule',
          timestamp: hoursAgo(26),
          durationMs: 140,
          inputSummary: 'Category: pothole | Location: Ward 3 Public Right-of-Way',
          reasoning: 'Right-of-way asphalt falls under DOT-STR jurisdiction. SLA is 48 hours for arterial routes.',
          outputSummary: 'Routed to: Department of Transportation & Streets',
          status: 'success',
        },
        {
          nodeName: 'draft_complaint',
          title: 'Formal Complaint Synthesis',
          timestamp: hoursAgo(26),
          durationMs: 310,
          inputSummary: 'Synthesize formal municipal work ticket',
          reasoning: 'Structured into standard municipal ticket format with priority escalation tags.',
          outputSummary: 'Formal subject and urgency metadata drafted',
          status: 'success',
        },
        {
          nodeName: 'submit_complaint',
          title: 'Registry Persistence',
          timestamp: hoursAgo(26),
          durationMs: 80,
          inputSummary: 'Write to municipal complaints registry',
          reasoning: 'Generated tracking identifier CIVIC-2026-1042 and work order ticket WO-DOT-2026-8812.',
          outputSummary: 'Record committed to database',
          status: 'success',
        },
        {
          nodeName: 'notify_user',
          title: 'Citizen Notification Dispatch',
          timestamp: hoursAgo(26),
          durationMs: 45,
          inputSummary: 'Prepare citizen confirmation response',
          reasoning: 'Sent immediate confirmation with tracking link and department contact info.',
          outputSummary: 'Receipt dispatched',
          status: 'success',
        },
      ],
    },
    {
      id: 'CIVIC-2026-1043',
      officialReferenceNumber: 'WO-BSL-2026-4401',
      issueType: 'streetlight',
      title: 'Dark Intersection: Broken Luminaire Post',
      description: 'Street light fixture is flickering violently and completely dark during night hours at pedestrian crosswalk.',
      location: 'Corner of 5th Ave and Pine Street, Ward 1',
      departmentId: 'dept_lighting',
      departmentName: 'Bureau of Street Lighting & Electrical',
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      photoUrl: CIVIC_ASSETS.categories.streetlight.before,
      submitterName: 'Marcus Vance',
      submitterEmail: 'm.vance@example.com',
      submitterPhone: '555-0811',
      assignedOfficer: 'Elena Rostova (Electrical Inspector)',
      assignedOfficerBadge: 'LIGHT-201',
      assignedCrew: 'High-Voltage Bucket Truck Unit #2',
      slaHours: 36,
      slaDeadline: hoursFromNow(22),
      isOverdue: false,
      isEscalated: false,
      lastStatusCheck: {
        checkedAt: hoursAgo(4),
        checkedBy: 'Monitoring Agent (Nagrik Sandesh)',
        progressSummary: 'Work order dispatched to electrical warehouse; replacement LED ballast pulled.',
        actionTaken: 'Bucket truck route scheduled for tomorrow morning.',
      },
      notificationsSent: [
        {
          id: 'notif-disp-1043-1',
          complaintId: 'CIVIC-2026-1043',
          channel: 'SMS',
          timestamp: hoursAgo(14),
          title: 'Complaint Registered',
          message: 'Grievance #CIVIC-2026-1043 registered with Bureau of Street Lighting.',
          recipient: '555-0811',
          deliveryStatus: 'DELIVERED',
        },
        {
          id: 'notif-disp-1043-2',
          complaintId: 'CIVIC-2026-1043',
          channel: 'PORTAL',
          timestamp: hoursAgo(4),
          title: 'Crew Assigned',
          message: 'Bucket Truck Unit #2 assigned for luminaire repair on Pine Street.',
          recipient: 'm.vance@example.com',
          deliveryStatus: 'DELIVERED',
        },
      ],
      createdAt: hoursAgo(14),
      updatedAt: hoursAgo(4),
      statusHistory: [
        {
          id: 'hist-1043-1',
          complaintId: 'CIVIC-2026-1043',
          timestamp: hoursAgo(14),
          previousStatus: 'FILED',
          newStatus: 'FILED',
          rawStatus: 'ELEC_TICKET_INIT_OK',
          plainLanguageSummary: 'Report received and registered with the Bureau of Street Lighting.',
          actor: 'Civic Sahayak (Intake AI)',
          agentGenerated: true,
        },
        {
          id: 'hist-1043-2',
          complaintId: 'CIVIC-2026-1043',
          timestamp: hoursAgo(4),
          previousStatus: 'FILED',
          newStatus: 'ASSIGNED',
          rawStatus: 'WO_ELEC_TRUCK_ROUTED_02',
          plainLanguageSummary: 'Electrician bucket truck unit #2 has been scheduled for ballast replacement tomorrow morning.',
          actor: 'Nagrik Sandesh (Monitoring Agent)',
          agentGenerated: true,
        },
      ],
    },
    {
      id: 'CIVIC-2026-1044',
      officialReferenceNumber: 'WO-DSWM-2026-2219',
      issueType: 'garbage',
      title: 'Overflowing Municipal Park Waste Bin',
      description: 'Trash can overflowing with weekend picnic waste; bags blowing onto playground turf and attracting pests.',
      location: 'Central Riverside Park, Playground East Entrance',
      departmentId: 'dept_sanitation',
      departmentName: 'Department of Sanitation & Waste Management',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      photoUrl: CIVIC_ASSETS.categories.garbage.before,
      resolutionPhotoUrl: CIVIC_ASSETS.categories.garbage.after,
      resolutionNotes: 'Park receptacle cleared, area sanitized with disinfectant spray, and heavy-duty liners installed.',
      submitterName: 'Sarah Jenkins',
      submitterEmail: 's.jenkins@example.com',
      submitterPhone: '555-9081',
      assignedOfficer: 'Carlos Rivera (Sanitation Superintendent)',
      assignedOfficerBadge: 'SAN-304',
      assignedCrew: 'Sanitation Rapid Response Truck #12',
      slaHours: 24,
      slaDeadline: hoursAgo(24),
      isOverdue: false,
      isEscalated: false,
      createdAt: hoursAgo(48),
      updatedAt: hoursAgo(6),
      proofOfWork: {
        completedAt: hoursAgo(6),
        resolvedByOfficer: 'Carlos Rivera (SAN-304 - Senior Sanitation Supervisor)',
        officerBadge: 'SAN-304',
        departmentName: 'Department of Sanitation & Waste Management',
        resolutionNotes: 'Park receptacle cleared, area sanitized with disinfectant spray, and heavy-duty liners installed.',
        beforePhotoUrl: CIVIC_ASSETS.categories.garbage.before,
        afterPhotoUrl: CIVIC_ASSETS.categories.garbage.after,
        materialsUsed: 'Bio-sanitizing spray, commercial 100L heavy-duty liners, tamper-proof lid latch',
        certificateNumber: 'POW-MUNI-982104',
        sentToCitizen: true,
        citizenNotificationChannel: 'SMS',
        citizenContact: '555-9081',
        dispatchedTimestamp: hoursAgo(6),
      },
      notificationsSent: [
        {
          id: 'notif-disp-1044-1',
          complaintId: 'CIVIC-2026-1044',
          channel: 'SMS',
          timestamp: hoursAgo(6),
          title: 'Issue Resolved & Proof Delivered',
          message: 'Official Municipal Alert: Grievance #CIVIC-2026-1044 has been RESOLVED. Certified repair photo dispatched. Certificate: POW-MUNI-982104.',
          recipient: '555-9081',
          deliveryStatus: 'DELIVERED',
        },
      ],
      statusHistory: [
        {
          id: 'hist-1044-1',
          complaintId: 'CIVIC-2026-1044',
          timestamp: hoursAgo(48),
          previousStatus: 'FILED',
          newStatus: 'FILED',
          rawStatus: 'DSWM_INGEST_REC',
          plainLanguageSummary: 'Cleanliness request logged with Sanitation.',
          actor: 'Civic Sahayak (Intake AI)',
          agentGenerated: true,
        },
        {
          id: 'hist-1044-2',
          complaintId: 'CIVIC-2026-1044',
          timestamp: hoursAgo(30),
          previousStatus: 'FILED',
          newStatus: 'IN_PROGRESS',
          rawStatus: 'DSWM_ROUTED_PACKER_09',
          plainLanguageSummary: 'Park maintenance route added to today’s waste collection sweep.',
          actor: 'Nagrik Sandesh (Monitoring Agent)',
          agentGenerated: true,
        },
        {
          id: 'hist-1044-3',
          complaintId: 'CIVIC-2026-1044',
          timestamp: hoursAgo(6),
          previousStatus: 'IN_PROGRESS',
          newStatus: 'RESOLVED',
          rawStatus: 'DSWM_EMPTY_CLEAN_COMPLETED',
          plainLanguageSummary: 'The waste receptacle has been emptied, disinfected, and new heavy-duty liners installed.',
          actor: 'Nagrik Sandesh (Monitoring Agent)',
          agentGenerated: true,
        },
      ],
    },
    {
      id: 'CIVIC-2026-1045',
      officialReferenceNumber: 'WO-MWSA-2026-0034',
      issueType: 'water_leak',
      title: 'High Pressure Water Hydrant Seepage',
      description: 'Clean water is gushing out of the base flange of the yellow fire hydrant, flooding the curb gutter.',
      location: 'Corner of Oak Boulevard & 12th St, Ward 2',
      departmentId: 'dept_water',
      departmentName: 'Municipal Water & Sewer Authority',
      status: 'FILED',
      priority: 'EMERGENCY',
      photoUrl: CIVIC_ASSETS.categories.water_leak.before,
      submitterName: 'David Cho',
      submitterPhone: '555-4921',
      assignedOfficer: 'Priya Chen (Section Officer)',
      assignedOfficerBadge: 'WATER-109',
      assignedCrew: 'Emergency Utility Hydro-Excavation Team #7',
      slaHours: 12,
      slaDeadline: hoursFromNow(11),
      isOverdue: false,
      isEscalated: false,
      notificationsSent: [
        {
          id: 'notif-disp-1045-1',
          complaintId: 'CIVIC-2026-1045',
          channel: 'SMS',
          timestamp: hoursAgo(1),
          title: 'Emergency Hydrant Leak Registered',
          message: 'EMERGENCY: Grievance #CIVIC-2026-1045 registered with Water Works. On-call plumber notified.',
          recipient: '555-4921',
          deliveryStatus: 'DELIVERED',
        },
      ],
      createdAt: hoursAgo(1),
      updatedAt: hoursAgo(1),
      statusHistory: [
        {
          id: 'hist-1045-1',
          complaintId: 'CIVIC-2026-1045',
          timestamp: hoursAgo(1),
          previousStatus: 'FILED',
          newStatus: 'FILED',
          rawStatus: 'MWSA_EMERGENCY_INGEST',
          plainLanguageSummary: 'Emergency priority ticket opened for hydrant valve failure. Dispatched to on-call utility plumber.',
          actor: 'Civic Sahayak (Intake AI)',
          agentGenerated: true,
        },
      ],
    },
    {
      id: 'CIVIC-2026-1046',
      officialReferenceNumber: 'WO-DSWM-2026-3381',
      issueType: 'garbage',
      title: 'Illegal Commercial Dumping in Residential Alley',
      description: 'Multiple bags of mixed household and commercial construction debris dumped blocking the alley behind 742 Maple Street. Odor and rodent hazard.',
      location: 'Alleyway behind 742 Maple St, Ward 4',
      departmentId: 'dept_sanitation',
      departmentName: 'Department of Sanitation & Waste Management',
      status: 'IN_PROGRESS',
      priority: 'EMERGENCY',
      photoUrl: CIVIC_ASSETS.categories.garbage.before,
      submitterName: 'Patricia Gomez',
      submitterEmail: 'patricia.g@example.com',
      submitterPhone: '555-3381',
      assignedOfficer: 'Carlos Rivera (Sanitation Superintendent)',
      assignedOfficerBadge: 'SAN-304',
      assignedCrew: 'Sanitation Rapid Response Truck #12',
      slaHours: 24,
      slaDeadline: hoursAgo(6), // Overdue by 6 hours
      isOverdue: true,
      isEscalated: true,
      escalatedTo: 'Zonal Sanitation Commissioner & City Administrator',
      escalationReason: 'SLA exceeded by 6 hours. Commercial debris blocking resident vehicle exit.',
      escalationTimestamp: hoursAgo(5),
      lastStatusCheck: {
        checkedAt: hoursAgo(1),
        checkedBy: 'Monitoring Agent (Nagrik Sandesh)',
        progressSummary: 'Heavy grapple loader dispatched from district depot. Commercial debris load being weighed.',
        actionTaken: 'Escalated to Zonal Commissioner; citation filed against dumping vehicle.',
      },
      notificationsSent: [
        {
          id: 'notif-disp-1046-1',
          complaintId: 'CIVIC-2026-1046',
          channel: 'SMS',
          timestamp: hoursAgo(5),
          title: 'Notice of Escalation',
          message: 'Your complaint #CIVIC-2026-1046 has been ESCALATED to Zonal Sanitation Commissioner due to SLA breach. Rapid cleanup crew mobilized.',
          recipient: '555-3381',
          deliveryStatus: 'DELIVERED',
        },
      ],
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(1),
      statusHistory: [
        {
          id: 'hist-1046-1',
          complaintId: 'CIVIC-2026-1046',
          timestamp: hoursAgo(30),
          previousStatus: 'FILED',
          newStatus: 'FILED',
          rawStatus: 'DSWM_INGEST_REC_01',
          plainLanguageSummary: 'Citizen report of illegal alley dumping logged and routed to Sanitation & Waste Management.',
          actor: 'Civic Sahayak (Intake AI)',
          agentGenerated: true,
        },
        {
          id: 'hist-1046-2',
          complaintId: 'CIVIC-2026-1046',
          timestamp: hoursAgo(18),
          previousStatus: 'FILED',
          newStatus: 'IN_PROGRESS',
          rawStatus: 'DSWM_ALLEYWAY_INSPECT',
          plainLanguageSummary: 'Sanitation code enforcement officer reviewing photos for environmental hazard classification.',
          actor: 'Carlos Rivera (SAN-304)',
          agentGenerated: false,
        },
        {
          id: 'hist-1046-3',
          complaintId: 'CIVIC-2026-1046',
          timestamp: hoursAgo(5),
          previousStatus: 'IN_PROGRESS',
          newStatus: 'IN_PROGRESS',
          rawStatus: 'GOV_SLA_ESCALATED',
          plainLanguageSummary: '⚠️ Case escalated to Zonal Sanitation Commissioner & City Administrator. SLA deadline exceeded by 6 hours.',
          actor: 'Nagrik Sandesh (Monitoring Agent)',
          agentGenerated: true,
        },
      ],
    },
    {
      id: 'CIVIC-2026-1047',
      officialReferenceNumber: 'WO-DSWM-2026-4410',
      issueType: 'garbage',
      title: 'Uncollected Curbside Recycling Carts & Windblown Debris',
      description: 'Sanitation truck missed the entire north block on Tuesday. Recyclables and cardboard scattered across sidewalk after overnight windstorm.',
      location: '1200 Block North Elmwood Ave, Ward 2',
      departmentId: 'dept_sanitation',
      departmentName: 'Department of Sanitation & Waste Management',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      photoUrl: CIVIC_ASSETS.categories.garbage.before,
      submitterName: 'Kevin Lee',
      submitterPhone: '555-8834',
      assignedOfficer: 'Carlos Rivera (Sanitation Superintendent)',
      assignedOfficerBadge: 'SAN-304',
      assignedCrew: 'Sanitation Rapid Response Truck #12',
      slaHours: 24,
      slaDeadline: hoursFromNow(12),
      isOverdue: false,
      isEscalated: false,
      lastStatusCheck: {
        checkedAt: hoursAgo(3),
        checkedBy: 'Monitoring Agent (Nagrik Sandesh)',
        progressSummary: 'Sanitation truck #12 en route to Ward 2 North Block.',
        actionTaken: 'Route manifest updated with curbside coordinates.',
      },
      notificationsSent: [
        {
          id: 'notif-disp-1047-1',
          complaintId: 'CIVIC-2026-1047',
          channel: 'SMS',
          timestamp: hoursAgo(12),
          title: 'Report Received',
          message: 'Report received for missed curbside recycling collection on Elmwood Ave.',
          recipient: '555-8834',
          deliveryStatus: 'DELIVERED',
        },
      ],
      createdAt: hoursAgo(12),
      updatedAt: hoursAgo(3),
      statusHistory: [
        {
          id: 'hist-1047-1',
          complaintId: 'CIVIC-2026-1047',
          timestamp: hoursAgo(12),
          previousStatus: 'FILED',
          newStatus: 'FILED',
          rawStatus: 'DSWM_RECYCLE_MISS_01',
          plainLanguageSummary: 'Report received for missed curbside recycling collection.',
          actor: 'Civic Sahayak (Intake AI)',
          agentGenerated: true,
        },
        {
          id: 'hist-1047-2',
          complaintId: 'CIVIC-2026-1047',
          timestamp: hoursAgo(3),
          previousStatus: 'FILED',
          newStatus: 'IN_PROGRESS',
          rawStatus: 'DSWM_CREW_ASSIGNED_TRUCK12',
          plainLanguageSummary: 'Assigned to Sanitation Rapid Response Truck #12 for priority afternoon pickup.',
          actor: 'Carlos Rivera (SAN-304)',
          agentGenerated: false,
        },
      ],
    },
  ];
}

function createInitialNotifications(): NotificationItem[] {
  const now = Date.now();
  const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();

  return [
    {
      id: 'notif-1',
      complaintId: 'CIVIC-2026-1042',
      complaintTitle: 'Deep Asphalt Pothole on Main Corridor',
      timestamp: hoursAgo(2),
      title: 'Work in progress on your report',
      message: 'Crews are currently on-site cutting and filling the asphalt on West Elm St. Estimated completion within 3 hours.',
      read: false,
      type: 'status_change',
    },
    {
      id: 'notif-2',
      complaintId: 'CIVIC-2026-1043',
      complaintTitle: 'Dark Intersection: Broken Luminaire Post',
      timestamp: hoursAgo(4),
      title: 'Electrician dispatched',
      message: 'Electrician bucket truck unit #2 has been scheduled for ballast replacement tomorrow morning.',
      read: false,
      type: 'status_change',
    },
    {
      id: 'notif-3',
      complaintId: 'CIVIC-2026-1044',
      complaintTitle: 'Overflowing Municipal Park Waste Bin',
      timestamp: hoursAgo(6),
      title: 'Issue Resolved!',
      message: 'The waste receptacle has been emptied, disinfected, and new liners installed. Thank you for keeping our parks clean!',
      read: true,
      type: 'status_change',
    },
    {
      id: 'notif-4',
      complaintId: 'CIVIC-2026-1045',
      complaintTitle: 'High Pressure Water Hydrant Seepage',
      timestamp: hoursAgo(1),
      title: 'Complaint Registered',
      message: 'Your report CIVIC-2026-1045 was successfully submitted and marked as EMERGENCY priority with Water Works.',
      read: false,
      type: 'confirmation',
    },
  ];
}

// In-memory data store with state manipulation helpers
class CivicStore {
  private complaints: Complaint[];
  private notifications: NotificationItem[];
  private departments: Department[];
  private jurisdictions: JurisdictionWard[];
  private routingRules: RoutingRule[];
  private slaRules: SlaRule[];
  private escalationRules: EscalationRule[];
  private categories: IssueCategoryConfig[];

  constructor() {
    this.complaints = createInitialComplaints();
    this.notifications = createInitialNotifications();
    this.departments = [...INITIAL_DEPARTMENTS];
    this.jurisdictions = [...INITIAL_JURISDICTIONS];
    this.routingRules = [...INITIAL_ROUTING_RULES];
    this.slaRules = [...INITIAL_SLA_RULES];
    this.escalationRules = [...INITIAL_ESCALATION_RULES];
    this.categories = [...INITIAL_CATEGORIES];
  }

  // -------------------------------------------------------------
  // DEPARTMENTS
  // -------------------------------------------------------------
  getDepartments(): Department[] {
    return [...this.departments];
  }

  getDepartmentById(id: string): Department | undefined {
    return this.departments.find((d) => d.id === id);
  }

  addDepartment(dept: Department): Department {
    const clean = stripUndefined(dept);
    this.departments.push(clean);
    return clean;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | undefined {
    const idx = this.departments.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    this.departments[idx] = stripUndefined({ ...this.departments[idx], ...updates });
    return this.departments[idx];
  }

  deleteDepartment(id: string): boolean {
    const idx = this.departments.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.departments.splice(idx, 1);
    return true;
  }

  // -------------------------------------------------------------
  // JURISDICTIONS / WARDS
  // -------------------------------------------------------------
  getJurisdictions(): JurisdictionWard[] {
    return [...this.jurisdictions];
  }

  addJurisdiction(ward: JurisdictionWard): JurisdictionWard {
    const clean = stripUndefined(ward);
    this.jurisdictions.push(clean);
    return clean;
  }

  updateJurisdiction(id: string, updates: Partial<JurisdictionWard>): JurisdictionWard | undefined {
    const idx = this.jurisdictions.findIndex((w) => w.id === id);
    if (idx === -1) return undefined;
    this.jurisdictions[idx] = stripUndefined({ ...this.jurisdictions[idx], ...updates });
    return this.jurisdictions[idx];
  }

  deleteJurisdiction(id: string): boolean {
    const idx = this.jurisdictions.findIndex((w) => w.id === id);
    if (idx === -1) return false;
    this.jurisdictions.splice(idx, 1);
    return true;
  }

  // -------------------------------------------------------------
  // ROUTING RULES
  // -------------------------------------------------------------
  getRoutingRules(): RoutingRule[] {
    return [...this.routingRules];
  }

  addRoutingRule(rule: RoutingRule): RoutingRule {
    const clean = stripUndefined(rule);
    this.routingRules.push(clean);
    return clean;
  }

  updateRoutingRule(id: string, updates: Partial<RoutingRule>): RoutingRule | undefined {
    const idx = this.routingRules.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.routingRules[idx] = stripUndefined({ ...this.routingRules[idx], ...updates });
    return this.routingRules[idx];
  }

  deleteRoutingRule(id: string): boolean {
    const idx = this.routingRules.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.routingRules.splice(idx, 1);
    return true;
  }

  // -------------------------------------------------------------
  // SLA & ESCALATION RULES
  // -------------------------------------------------------------
  getSlaRules(): SlaRule[] {
    return [...this.slaRules];
  }

  updateSlaRule(id: string, updates: Partial<SlaRule>): SlaRule | undefined {
    const idx = this.slaRules.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.slaRules[idx] = stripUndefined({ ...this.slaRules[idx], ...updates });
    return this.slaRules[idx];
  }

  getEscalationRules(): EscalationRule[] {
    return [...this.escalationRules];
  }

  updateEscalationRule(id: string, updates: Partial<EscalationRule>): EscalationRule | undefined {
    const idx = this.escalationRules.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    this.escalationRules[idx] = stripUndefined({ ...this.escalationRules[idx], ...updates });
    return this.escalationRules[idx];
  }

  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  getCategories(): IssueCategoryConfig[] {
    return [...this.categories];
  }

  updateCategory(id: IssueCategory, updates: Partial<IssueCategoryConfig>): IssueCategoryConfig | undefined {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.categories[idx] = stripUndefined({ ...this.categories[idx], ...updates });
    return this.categories[idx];
  }

  // -------------------------------------------------------------
  // DYNAMIC ROUTING & SLA ENGINE
  // -------------------------------------------------------------
  getSlaHours(departmentId: string, priority: PriorityLevel): number {
    const found = this.slaRules.find(
      (r) => r.departmentId === departmentId && r.priority === priority
    );
    if (found) return found.maxResolutionHours;

    // Fallback defaults
    switch (priority) {
      case 'EMERGENCY': return 6;
      case 'HIGH': return 24;
      case 'MEDIUM': return 48;
      case 'LOW': return 72;
      default: return 48;
    }
  }

  routeComplaint(category: IssueCategory, descriptionText = '', locationText = ''): {
    departmentId: string;
    departmentName: string;
    assignedOfficer: string;
    assignedOfficerBadge: string;
    slaHours: number;
    priority: PriorityLevel;
    ward?: JurisdictionWard;
  } {
    const lowerDesc = descriptionText.toLowerCase();

    // 1. Check keyword routing rules first
    let matchedRule = this.routingRules.find((r) => {
      if (!r.isActive) return false;
      return r.keywords.some((kw) => lowerDesc.includes(kw.toLowerCase()));
    });

    // 2. Fall back to exact category matching
    if (!matchedRule) {
      matchedRule = this.routingRules.find((r) => r.isActive && r.category === category);
    }

    // 3. Fall back to first department or default transport
    const departmentId = matchedRule ? matchedRule.departmentId : 'dept_transport';
    const deptObj = this.getDepartmentById(departmentId);
    const departmentName = deptObj ? deptObj.name : (matchedRule ? matchedRule.departmentName : 'Public Works & Road Infrastructure (PWD / Roads)');
    const priority = matchedRule ? matchedRule.priorityLevel : 'MEDIUM';
    const slaHours = this.getSlaHours(departmentId, priority);

    // 4. Determine ward from location text
    const lowerLoc = locationText.toLowerCase();
    const matchedWard = this.jurisdictions.find((w) => {
      const wName = w.name.toLowerCase();
      const wArea = w.coverageArea.toLowerCase();
      return lowerLoc.includes(w.id.toLowerCase()) || lowerLoc.includes(wName) || lowerLoc.includes(wArea);
    }) || this.jurisdictions[0];

    const assignedOfficer = matchedWard ? matchedWard.zonalOfficerName : 'Marcus Sterling (Executive Engineer)';
    const assignedOfficerBadge = matchedRule?.autoAssignOfficerBadge || matchedWard?.zonalOfficerBadge || 'DOT-402';

    return {
      departmentId,
      departmentName,
      assignedOfficer,
      assignedOfficerBadge,
      slaHours,
      priority,
      ward: matchedWard,
    };
  }

  getComplaints(): Complaint[] {
    return [...this.complaints].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find((c) => c.id === id || c.officialReferenceNumber === id);
  }

  addComplaint(complaint: Complaint): Complaint {
    const clean = stripUndefined(complaint);
    this.complaints.unshift(clean);
    return clean;
  }

  updateComplaint(id: string, updates: Partial<Complaint>): Complaint | undefined {
    const index = this.complaints.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.complaints[index] = stripUndefined({
      ...this.complaints[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return this.complaints[index];
  }

  addStatusHistory(complaintId: string, record: Omit<StatusHistoryRecord, 'id'>): StatusHistoryRecord | undefined {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return undefined;

    const fullRecord: StatusHistoryRecord = stripUndefined({
      ...record,
      id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      complaintId,
    });

    if (!complaint.statusHistory) {
      complaint.statusHistory = [];
    }
    complaint.statusHistory.push(fullRecord);
    complaint.status = record.newStatus;
    complaint.updatedAt = new Date().toISOString();

    return fullRecord;
  }

  getNotifications(): NotificationItem[] {
    return [...this.notifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem {
    const item: NotificationItem = stripUndefined({
      ...notification,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    });
    this.notifications.unshift(item);
    return item;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  executeGovAction(
    complaintId: string,
    payload: GovActionPayload
  ): { complaint: Complaint; historyRecord: StatusHistoryRecord } {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) {
      throw new Error(`Complaint #${complaintId} not found`);
    }

    const previousStatus = complaint.status;
    const actor = payload.actorName || 'Municipal Operations Officer';
    let newStatus = complaint.status;
    let plainLanguageSummary = '';
    let rawStatus = 'GOV_ACTION';

    if (payload.action === 'accept') {
      newStatus = 'VERIFIED';
      rawStatus = 'GOV_ACCEPTED_VERIFIED';
      plainLanguageSummary =
        'Your civic complaint was reviewed by municipal officers and verified as valid infrastructure work.';
    } else if (payload.action === 'reject') {
      newStatus = 'REJECTED';
      rawStatus = 'GOV_REJECTED';
      complaint.rejectionReason =
        payload.rejectionReason || 'Issue assessed as non-jurisdictional or duplicated report.';
      plainLanguageSummary = `Report closed without intervention: ${complaint.rejectionReason}`;
    } else if (payload.action === 'reassign') {
      if (payload.departmentId) {
        complaint.departmentId = payload.departmentId;
        complaint.departmentName =
          payload.departmentName ||
          DEPARTMENTS.find((d) => d.id === payload.departmentId)?.name ||
          complaint.departmentName;
      }
      rawStatus = 'GOV_REASSIGNED';
      plainLanguageSummary = `Department routing transferred to ${complaint.departmentName} for direct dispatch.`;
    } else if (payload.action === 'update_status') {
      if (payload.status) {
        newStatus = payload.status;
      }
      rawStatus = `GOV_STATUS_${newStatus}`;
      if (newStatus === 'UNDER_REVIEW') {
        plainLanguageSummary = 'Municipal team is actively reviewing site imagery and assigning inspection priorities.';
      } else if (newStatus === 'VERIFIED') {
        plainLanguageSummary = 'Defect confirmed on city property. Work order approved for dispatch.';
      } else if (newStatus === 'ASSIGNED') {
        plainLanguageSummary = `Assigned to ${payload.assignedCrew || complaint.assignedCrew || 'District Maintenance Unit'} for field execution.`;
      } else if (newStatus === 'IN_PROGRESS') {
        plainLanguageSummary = 'Field crews are on site actively conducting repairs and mitigation.';
      } else if (newStatus === 'SCHEDULED') {
        plainLanguageSummary = `Repairs scheduled on maintenance calendar. Estimated resolution target: ${payload.estimatedResolutionDate || 'within 48 hours'}.`;
      } else if (newStatus === 'RESOLVED') {
        plainLanguageSummary = `Repairs completed and validated by field supervisor. ${payload.resolutionNotes || 'Issue marked as resolved.'}`;
      } else if (newStatus === 'REJECTED') {
        plainLanguageSummary = `Issue rejected: ${payload.rejectionReason || complaint.rejectionReason || 'Non-jurisdictional'}`;
      } else {
        plainLanguageSummary = `Status updated to ${newStatus}.`;
      }
    } else if (payload.action === 'add_notes') {
      rawStatus = 'GOV_INTERNAL_UPDATE';
      plainLanguageSummary = `Municipal update: ${payload.internalNote || 'Department notes recorded.'}`;
    } else if (payload.action === 'check_status') {
      rawStatus = 'GOV_MONITORING_CHECK';
      const checkSummary = payload.progressSummary || `Site progress verified by ${actor}. Work continues on schedule.`;
      const actionNote = payload.actionTaken || 'Field verification conducted; crew active on site.';
      complaint.lastStatusCheck = {
        checkedAt: new Date().toISOString(),
        checkedBy: actor,
        progressSummary: checkSummary,
        actionTaken: actionNote,
      };
      if (payload.assignedOfficer) complaint.assignedOfficer = payload.assignedOfficer;
      if (payload.assignedOfficerBadge) complaint.assignedOfficerBadge = payload.assignedOfficerBadge;
      if (payload.status && payload.status !== complaint.status) {
        newStatus = payload.status as ComplaintStatus;
        rawStatus = `GOV_STATUS_${newStatus}`;
        if (newStatus === 'IN_PROGRESS' && !complaint.assignedCrew) {
          complaint.assignedCrew = payload.assignedCrew || 'District Rapid Maintenance Unit';
        }
      }
      plainLanguageSummary = `Monitoring Agent Check: ${checkSummary} (Action taken: ${actionNote})`;
    } else if (payload.action === 'escalate') {
      rawStatus = 'GOV_SLA_ESCALATED';
      complaint.isOverdue = true;
      complaint.isEscalated = true;
      complaint.escalatedTo = payload.escalatedTo || 'Senior Executive Engineer & Zonal Commissioner';
      complaint.escalationReason = payload.escalationReason || 'SLA deadline exceeded. Escalated for expedited resolution.';
      complaint.escalationTimestamp = new Date().toISOString();
      complaint.priority = 'EMERGENCY';
      plainLanguageSummary = `⚠️ Case escalated to ${complaint.escalatedTo}. Priority elevated to EMERGENCY due to SLA breach: ${complaint.escalationReason}`;

      const escNotif: CitizenNotificationRecord = {
        id: `notif-esc-${Date.now()}`,
        complaintId: complaint.id,
        channel: 'SMS',
        timestamp: new Date().toISOString(),
        title: 'Notice of Escalation',
        message: `Your complaint #${complaint.id} has been ESCALATED to ${complaint.escalatedTo} due to SLA breach. Priority elevated for rapid resolution.`,
        recipient: complaint.submitterPhone || complaint.submitterEmail || 'Registered Citizen',
        deliveryStatus: 'DELIVERED',
      };
      if (!complaint.notificationsSent) complaint.notificationsSent = [];
      complaint.notificationsSent.unshift(escNotif);
    } else if (payload.action === 'notify_user') {
      rawStatus = 'GOV_CITIZEN_NOTIFICATION';
      const channel = payload.notificationChannel || 'PORTAL';
      const msg = payload.notificationMessage || `Official update on your grievance #${complaint.id}: Current status is ${complaint.status}.`;
      const title = payload.notificationTitle || `Official Municipal Notice for #${complaint.id}`;
      const notifRecord: CitizenNotificationRecord = {
        id: `notif-disp-${Date.now()}`,
        complaintId: complaint.id,
        channel,
        timestamp: new Date().toISOString(),
        title,
        message: msg,
        recipient: complaint.submitterPhone || complaint.submitterEmail || 'Registered Citizen',
        deliveryStatus: 'DELIVERED',
      };
      if (!complaint.notificationsSent) complaint.notificationsSent = [];
      complaint.notificationsSent.unshift(notifRecord);
      plainLanguageSummary = `Citizen notified via ${channel}: "${msg}"`;
    }

    if (payload.assignedOfficer) {
      complaint.assignedOfficer = payload.assignedOfficer;
    }
    if (payload.assignedOfficerBadge) {
      complaint.assignedOfficerBadge = payload.assignedOfficerBadge;
    }

    if (payload.internalNote) {
      if (!complaint.internalNotes) complaint.internalNotes = [];
      complaint.internalNotes.push(`[${new Date().toLocaleDateString()}] ${actor}: ${payload.internalNote}`);
    }

    if (payload.resolutionNotes) {
      complaint.resolutionNotes = payload.resolutionNotes;
    }

    if (payload.estimatedResolutionDate) {
      complaint.estimatedResolutionDate = payload.estimatedResolutionDate;
    }

    if (payload.assignedCrew) {
      complaint.assignedCrew = payload.assignedCrew;
    }

    if (newStatus === 'RESOLVED') {
      const defaultProofImages: Record<string, string> = {
        pothole: CIVIC_ASSETS.categories.pothole.after,
        garbage: CIVIC_ASSETS.categories.garbage.after,
        streetlight: CIVIC_ASSETS.categories.streetlight.after,
        water_leak: CIVIC_ASSETS.categories.water_leak.after,
        traffic_signal: CIVIC_ASSETS.categories.traffic_signal.after,
        sidewalk: CIVIC_ASSETS.categories.sidewalk.after,
        tree_hazard: CIVIC_ASSETS.categories.tree_hazard.after,
        graffiti: CIVIC_ASSETS.categories.graffiti.after,
        other: CIVIC_ASSETS.categories.other.after,
      };

      const proofImg =
        payload.resolutionPhotoBase64 ||
        payload.resolutionPhotoUrl ||
        (payload.proofOfWork && payload.proofOfWork.afterPhotoUrl) ||
        complaint.resolutionPhotoUrl ||
        defaultProofImages[complaint.issueType] ||
        CIVIC_ASSETS.categories.pothole.after;

      complaint.resolutionPhotoUrl = proofImg;

      const certId =
        (payload.proofOfWork && payload.proofOfWork.certificateNumber) ||
        `CERT-MUNI-${Date.now().toString().slice(-6)}`;
      const citizenRecipient =
        complaint.submitterPhone || complaint.submitterEmail || 'Registered Citizen';

      const dispatchedSms = `🏛️ Metropolis Municipal Alert: Grievance #${complaint.id} (${complaint.title}) has been SOLVED by ${complaint.departmentName}. The official photo proof of completed work has been dispatched to your portal. View proof: https://civic.gov.in/track?id=${complaint.id} [Ref: ${certId}]`;

      complaint.proofOfWork = {
        completedAt: (payload.proofOfWork && payload.proofOfWork.completedAt) || new Date().toISOString(),
        resolvedByOfficer: (payload.proofOfWork && payload.proofOfWork.resolvedByOfficer) || actor,
        officerBadge: (payload.proofOfWork && payload.proofOfWork.officerBadge) || payload.officerBadge || 'GOV-OPS-DISPATCH',
        departmentName: complaint.departmentName,
        resolutionNotes:
          (payload.proofOfWork && payload.proofOfWork.resolutionNotes) ||
          payload.resolutionNotes ||
          complaint.resolutionNotes ||
          'Municipal field repair inspected, safety certified, and site restored to code compliance.',
        beforePhotoUrl: (payload.proofOfWork && payload.proofOfWork.beforePhotoUrl) || complaint.photoUrl,
        afterPhotoUrl: proofImg,
        materialsUsed:
          (payload.proofOfWork && payload.proofOfWork.materialsUsed) ||
          payload.materialsUsed ||
          'Hot-mix compaction asphalt, civil sealant, and safety barrier recovery',
        certificateNumber: certId,
        sentToCitizen: true,
        citizenNotificationChannel: 'SMS',
        citizenContact: citizenRecipient,
        dispatchedTimestamp: new Date().toISOString(),
        proofOfWorkDispatchedMessage: dispatchedSms,
      };

      const resNotif: CitizenNotificationRecord = {
        id: `notif-disp-res-${Date.now()}`,
        complaintId: complaint.id,
        channel: 'SMS',
        timestamp: new Date().toISOString(),
        title: 'Issue Resolved & Proof Delivered',
        message: dispatchedSms,
        recipient: citizenRecipient,
        deliveryStatus: 'DELIVERED',
      };
      if (!complaint.notificationsSent) complaint.notificationsSent = [];
      complaint.notificationsSent.unshift(resNotif);

      complaint.citizenConfirmed = undefined;
    }

    // Support citizen feedback update if supplied
    if (payload.citizenFeedback && complaint.proofOfWork) {
      complaint.proofOfWork.citizenFeedback = payload.citizenFeedback;
      if (payload.citizenRating) {
        complaint.proofOfWork.citizenRating = payload.citizenRating;
        complaint.citizenRating = payload.citizenRating;
      }
      if (payload.citizenFeedbackNotes) {
        complaint.proofOfWork.citizenFeedbackNotes = payload.citizenFeedbackNotes;
      }
      complaint.citizenConfirmed = payload.citizenFeedback === 'ACCEPTED';
    }

    complaint.status = newStatus;
    complaint.updatedAt = new Date().toISOString();

    const historyRecord = this.addStatusHistory(complaint.id, {
      complaintId: complaint.id,
      timestamp: new Date().toISOString(),
      previousStatus,
      newStatus,
      rawStatus,
      plainLanguageSummary,
      actor,
      agentGenerated: false,
      notes: payload.internalNote || payload.resolutionNotes,
    })!;

    // Citizen notification dispatched
    const proofPhotoThumbnail = newStatus === 'RESOLVED' ? complaint.resolutionPhotoUrl : undefined;
    this.addNotification({
      complaintId: complaint.id,
      complaintTitle: complaint.title,
      title:
        newStatus === 'RESOLVED'
          ? `📸 Official Proof of Work Picture Delivered for #${complaint.id}`
          : `Status update on #${complaint.id}`,
      message:
        newStatus === 'RESOLVED'
          ? `Problem solved by ${actor}. The government has sent you the official picture of the completed work. Tap to inspect photo proof.`
          : plainLanguageSummary,
      read: false,
      type: newStatus === 'RESOLVED' ? 'alert' : 'status_change',
      photoUrl: proofPhotoThumbnail,
      proofCertificateNumber: complaint.proofOfWork?.certificateNumber,
      isProofOfWork: newStatus === 'RESOLVED',
    });

    return { complaint, historyRecord };
  }

  reset(): void {
    this.complaints = createInitialComplaints();
    this.notifications = createInitialNotifications();
  }
}

export const civicDb = new CivicStore();
