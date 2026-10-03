/**
 * Types and interfaces for the Civic Issue Reporter and Tracker
 */

export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'water_leak'
  | 'traffic_signal'
  | 'sidewalk'
  | 'graffiti'
  | 'tree_hazard'
  | 'other';

export type ComplaintStatus =
  | 'FILED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SCHEDULED'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CLOSED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface Department {
  id: string;
  name: string;
  code: string;
  contactEmail: string;
  description: string;
  categories: IssueCategory[];
  averageResponseHours: number;
}

export interface AgentTraceNode {
  nodeName: string;
  title: string;
  timestamp: string;
  durationMs: number;
  inputSummary: string;
  reasoning: string;
  outputSummary: string;
  status: 'success' | 'warning' | 'info';
}

export interface StatusHistoryRecord {
  id: string;
  complaintId: string;
  timestamp: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  rawStatus: string;
  plainLanguageSummary: string;
  agentGenerated: boolean;
  notes?: string;
  actor: string;
}

export interface ProofOfWork {
  completedAt: string;
  resolvedByOfficer: string;
  officerBadge: string;
  departmentName: string;
  resolutionNotes: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  materialsUsed?: string;
  certificateNumber: string;
  sentToCitizen: boolean;
  citizenNotificationChannel?: 'SMS' | 'EMAIL' | 'PORTAL';
  citizenContact?: string;
  dispatchedTimestamp?: string;
  proofOfWorkDispatchedMessage?: string;
  citizenFeedback?: 'ACCEPTED' | 'REJECTED';
  citizenRating?: number;
  citizenFeedbackNotes?: string;
}

export interface Complaint {
  id: string;
  issueType: IssueCategory;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  locationTimestamp?: string;
  locationMethod?: 'GPS' | 'MANUAL';
  aiAnalysis?: ImageAnalysisResult;
  userEditedDescription?: string;
  jurisdictionWard?: string;
  departmentId: string;
  departmentName: string;
  status: ComplaintStatus;
  priority: PriorityLevel;
  photoUrl: string;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  citizenId?: string;
  createdAt: string;
  updatedAt: string;
  officialReferenceNumber: string;
  intakeTrace?: AgentTraceNode[];
  statusHistory?: StatusHistoryRecord[];
  // Government / Back-office fields
  rejectionReason?: string;
  internalNotes?: string[];
  resolutionNotes?: string;
  resolutionPhotoUrl?: string;
  proofOfWork?: ProofOfWork;
  estimatedResolutionDate?: string;
  assignedCrew?: string;
  citizenConfirmed?: boolean;
  citizenRating?: number;
  // Monitoring Agent & SLA Tracking fields
  assignedOfficer?: string;
  assignedOfficerBadge?: string;
  slaHours?: number;
  slaDeadline?: string;
  isOverdue?: boolean;
  isEscalated?: boolean;
  escalatedTo?: string;
  escalationReason?: string;
  escalationTimestamp?: string;
  lastStatusCheck?: {
    checkedAt: string;
    checkedBy: string;
    progressSummary: string;
    actionTaken: string;
  };
  notificationsSent?: CitizenNotificationRecord[];
}

export interface CitizenNotificationRecord {
  id: string;
  complaintId: string;
  channel: 'PORTAL' | 'SMS' | 'EMAIL' | 'MOBILE_APP';
  timestamp: string;
  title: string;
  message: string;
  recipient: string;
  deliveryStatus: 'DELIVERED' | 'DISPATCHED' | 'PENDING';
}

export interface GovActionPayload {
  action: 'accept' | 'reject' | 'reassign' | 'update_status' | 'add_notes' | 'check_status' | 'escalate' | 'notify_user';
  status?: ComplaintStatus;
  rejectionReason?: string;
  departmentId?: string;
  departmentName?: string;
  internalNote?: string;
  resolutionNotes?: string;
  resolutionPhotoUrl?: string;
  resolutionPhotoBase64?: string;
  materialsUsed?: string;
  officerBadge?: string;
  proofOfWork?: Partial<ProofOfWork>;
  estimatedResolutionDate?: string;
  assignedCrew?: string;
  actorName?: string;
  citizenFeedback?: 'ACCEPTED' | 'REJECTED';
  citizenRating?: number;
  citizenFeedbackNotes?: string;
  // Monitoring Agent action extensions
  progressSummary?: string;
  actionTaken?: string;
  assignedOfficer?: string;
  assignedOfficerBadge?: string;
  escalatedTo?: string;
  escalationReason?: string;
  notificationChannel?: 'PORTAL' | 'SMS' | 'EMAIL' | 'MOBILE_APP';
  notificationMessage?: string;
  notificationTitle?: string;
}

export interface ImageAnalysisResult {
  detectedIssue: string;
  category: IssueCategory;
  suggestedDepartmentId: string;
  suggestedDepartmentName: string;
  confidenceScore: number;
  severity: PriorityLevel;
  visualFindings: string;
  safetyRisks: string[];
  isCivicIssue?: boolean;
  relevanceExplanation?: string;
  defectLocationType?: 'road' | 'street' | 'footpath' | 'sanitation' | 'water' | 'electrical' | 'other';
  detectedIssueEn?: string;
  detectedIssueHi?: string;
  visualFindingsEn?: string;
  visualFindingsHi?: string;
  conciseDescriptionEn?: string;
  conciseDescriptionHi?: string;
}

export interface NotificationItem {
  id: string;
  complaintId: string;
  complaintTitle: string;
  timestamp: string;
  title: string;
  message: string;
  read: boolean;
  type: 'status_change' | 'confirmation' | 'alert';
  photoUrl?: string;
  proofCertificateNumber?: string;
  isProofOfWork?: boolean;
}

export interface IntakeSubmissionPayload {
  id?: string;
  photoBase64?: string;
  photoMimeType?: string;
  photoUrl?: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  locationTimestamp?: string;
  locationMethod?: 'GPS' | 'MANUAL';
  category?: IssueCategory;
  departmentId?: string;
  departmentName?: string;
  aiAnalysis?: ImageAnalysisResult;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  citizenId?: string;
}

export interface JurisdictionWard {
  id: string;
  name: string;
  code: string;
  zone: string;
  zonalOfficerName: string;
  zonalOfficerBadge: string;
  contactPhone: string;
  coverageArea: string;
}

export interface RoutingRule {
  id: string;
  category: IssueCategory;
  departmentId: string;
  departmentName: string;
  priorityLevel: PriorityLevel;
  keywords: string[];
  autoAssignOfficerBadge?: string;
  isActive: boolean;
}

export interface SlaRule {
  id: string;
  departmentId: string;
  departmentName: string;
  priority: PriorityLevel;
  maxResolutionHours: number;
  firstResponseHours: number;
}

export interface EscalationRule {
  id: string;
  departmentId: string;
  thresholdHoursAfterSla: number;
  escalationTargetRole: string;
  escalationOfficerBadge: string;
  escalationOfficerName: string;
  notifyCitizenOnEscalation: boolean;
  priorityElevation: PriorityLevel;
}

export interface IssueCategoryConfig {
  id: IssueCategory;
  nameEn: string;
  nameHi: string;
  icon: string;
  defaultDepartmentId: string;
  defaultSeverity: PriorityLevel;
  descriptionEn: string;
  descriptionHi: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  username?: string;
  error?: string;
}

export interface MonitoringRunResult {
  checkedCount: number;
  updatedCount: number;
  timestamp: string;
  updatedComplaints: {
    id: string;
    oldStatus: ComplaintStatus;
    newStatus: ComplaintStatus;
    plainLanguageUpdate: string;
  }[];
  trace: AgentTraceNode[];
}

export type GovRole = 'CITY_ADMIN' | 'DEPT_DISPATCHER' | 'FIELD_SUPERVISOR' | 'AUDITOR';

export interface GovUser {
  id: string;
  badgeNumber: string;
  name: string;
  title: string;
  email: string;
  role: GovRole;
  departmentId: string; // 'ALL' or specific e.g. 'dept_transport'
  departmentName: string;
  clearanceLevel: 'LEVEL_1_OPERATOR' | 'LEVEL_2_DISPATCHER' | 'LEVEL_3_SUPERVISOR' | 'LEVEL_4_EXECUTIVE';
  token: string;
  demoPin?: string;
  acceptedPins?: string[];
}

export interface GovAuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'AUTH_SUCCESS' | 'AUTH_FAILED' | 'AUTH_LOGOUT' | 'ACTION_AUTHORIZED' | 'ACTION_DENIED_403';
  officerBadge?: string;
  officerName?: string;
  officerRole?: GovRole;
  action?: string;
  complaintId?: string;
  details: string;
}

export interface GovAuthResponse {
  success: boolean;
  user: GovUser;
  expiresIn: string;
}

/**
 * Supabase civic_reports table schema definition
 * Matches: id, user_id, mobile_number, image_url, ai_description, user_description,
 * latitude, longitude, address, department, status, created_at, updated_at
 */
export type CivicReportStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Work Completed'
  | 'Awaiting User Confirmation'
  | 'Resolved';

export interface CivicReport {
  id: string; // UUID primary key
  user_id: string; // Supabase Auth UUID
  mobile_number: string; // Mandatory phone number for notifications
  image_url?: string | null;
  ai_description?: string | null;
  user_description: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  department?: string | null;
  status: CivicReportStatus;
  created_at: string;
  updated_at: string;
}


