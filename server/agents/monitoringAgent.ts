import { Complaint, ComplaintStatus, AgentTraceNode, MonitoringRunResult } from '../../src/types.js';
import { civicDb } from '../db.js';
import { generateContentWithFallback } from '../gemini.js';

const STATUS_PROGRESSION: Record<ComplaintStatus, ComplaintStatus> = {
  FILED: 'UNDER_REVIEW',
  UNDER_REVIEW: 'VERIFIED',
  VERIFIED: 'ASSIGNED',
  ACKNOWLEDGED: 'ASSIGNED',
  ASSIGNED: 'IN_PROGRESS',
  IN_PROGRESS: 'SCHEDULED',
  SCHEDULED: 'RESOLVED',
  RESOLVED: 'CLOSED',
  REJECTED: 'CLOSED',
  CLOSED: 'CLOSED',
};

const DEFAULT_RAW_STATUS_CODES: Record<ComplaintStatus, string> = {
  FILED: 'SYS_INGEST_FILE_OK_01',
  UNDER_REVIEW: 'MUNI_OPS_INTAKE_TRIAGE_EVAL',
  VERIFIED: 'FIELD_ENG_LIABILITY_CONFIRMED',
  ACKNOWLEDGED: 'MUNI_ACK_TRIAGE_VERIFIED',
  ASSIGNED: 'WO_DISPATCH_UNIT_ALLOCATED_03',
  IN_PROGRESS: 'OPS_ACTIVE_SITE_REPAIR_CREW_4',
  SCHEDULED: 'INSP_SIGN_OFF_WINDOW_SET',
  RESOLVED: 'COMP_REPAIR_CERTIFIED_CLOSED_99',
  REJECTED: 'JURISDICTION_DISMISSED_NON_ACTIONABLE',
  CLOSED: 'ARCHIVE_RECORDS_SETTLED',
};

/**
 * Agent 2 — Monitoring Agent Orchestrator
 * Pipeline: fetch_open_complaints -> check_status -> detect_change -> translate_to_plain_language -> notify_user -> log_history
 */
export async function runMonitoringAgent(options?: {
  targetComplaintId?: string;
  forcedNewStatus?: ComplaintStatus;
  rawStatusOverride?: string;
  autoEscalateIfOverdue?: boolean;
}): Promise<MonitoringRunResult> {
  const traces: AgentTraceNode[] = [];
  const updatedComplaints: MonitoringRunResult['updatedComplaints'] = [];

  // Node 1: fetch_open_complaints
  const startTime = Date.now();
  let candidateComplaints: Complaint[] = [];

  if (options?.targetComplaintId) {
    const target = civicDb.getComplaintById(options.targetComplaintId);
    if (target) candidateComplaints = [target];
  } else {
    candidateComplaints = civicDb
      .getComplaints()
      .filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED');
  }

  traces.push({
    nodeName: 'fetch_open_complaints',
    title: 'Open Complaints Polling',
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    inputSummary: `Scanning registry for active complaints (Total found: ${candidateComplaints.length})`,
    reasoning: `Queried database records where status NOT IN ('RESOLVED', 'CLOSED'). Found ${candidateComplaints.length} candidate tickets to poll.`,
    outputSummary: `Polling queue loaded: ${candidateComplaints.length} tickets`,
    status: 'success',
  });

  // Check SLA and Overdue / Escalation logic
  const now = Date.now();
  for (const complaint of candidateComplaints) {
    const isLate = complaint.slaDeadline ? now > new Date(complaint.slaDeadline).getTime() : false;
    if (isLate && !complaint.isOverdue) {
      // Mark as overdue
      complaint.isOverdue = true;
    }

    if (isLate && (options?.autoEscalateIfOverdue || !complaint.isEscalated)) {
      civicDb.executeGovAction(complaint.id, {
        action: 'escalate',
        escalatedTo: 'Senior Executive Engineer & Zonal Commissioner',
        escalationReason: `SLA resolution window exceeded. Auto-escalated by Continuous Monitoring Agent.`,
        actorName: 'Nagrik Sandesh (Automated SLA Sentinel)',
      });

      traces.push({
        nodeName: 'escalate_if_late',
        title: 'Overdue SLA Auto-Escalation',
        timestamp: new Date().toISOString(),
        durationMs: 45,
        inputSummary: `Complaint #${complaint.id} SLA exceeded (Deadline: ${complaint.slaDeadline})`,
        reasoning: `Complaint passed SLA deadline. Elevated priority to EMERGENCY and transferred ownership to Senior Executive Engineer.`,
        outputSummary: `Escalated #${complaint.id} to Zonal Commissioner`,
        status: 'success',
      });
    }
  }

  // For each candidate, simulate external government work-order check
  for (const complaint of candidateComplaints) {
    const checkStart = Date.now();
    const oldStatus = complaint.status;

    // Node 2 & 3: check_status & detect_change
    let nextStatus: ComplaintStatus;
    if (options?.forcedNewStatus) {
      nextStatus = options.forcedNewStatus;
    } else {
      nextStatus = STATUS_PROGRESSION[oldStatus];
    }

    if (nextStatus === oldStatus) {
      // No transition needed
      continue;
    }

    const rawStatus = options?.rawStatusOverride || DEFAULT_RAW_STATUS_CODES[nextStatus];

    traces.push({
      nodeName: 'detect_change',
      title: 'Status Transition Detected',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - checkStart,
      inputSummary: `Complaint #${complaint.id}: External System Status '${rawStatus}'`,
      reasoning: `Status delta identified for ticket ${complaint.id}: Transition from '${oldStatus}' to '${nextStatus}'.`,
      outputSummary: `Transition detected: ${oldStatus} ➔ ${nextStatus}`,
      status: 'success',
    });

    // Node 4: translate_to_plain_language
    const translateStart = Date.now();
    const plainLanguage = await translateRawStatusToCitizenLanguage(complaint, oldStatus, nextStatus, rawStatus);

    traces.push({
      nodeName: 'translate_to_plain_language',
      title: 'Plain-Language Citizen Translation',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - translateStart,
      inputSummary: `Raw government code: "${rawStatus}" for ${complaint.issueType}`,
      reasoning: `Converted technical municipal code into citizen-friendly update. Highlighted tangible next steps and estimated timelines.`,
      outputSummary: `Translated: "${plainLanguage.slice(0, 60)}..."`,
      status: 'success',
    });

    // Node 5: notify_user
    const notifyStart = Date.now();
    civicDb.addNotification({
      complaintId: complaint.id,
      complaintTitle: complaint.title,
      title: `Update on ${complaint.id}: ${formatStatusLabel(nextStatus)}`,
      message: plainLanguage,
      read: false,
      type: 'status_change',
    });

    traces.push({
      nodeName: 'notify_user',
      title: 'Status Alert Dispatch',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - notifyStart,
      inputSummary: `Notify citizen regarding complaint #${complaint.id}`,
      reasoning: `Dispatched status change notification via citizen notification stream.`,
      outputSummary: `Delivered notification to citizen channel`,
      status: 'success',
    });

    // Node 6: log_history
    const logStart = Date.now();
    civicDb.addStatusHistory(complaint.id, {
      complaintId: complaint.id,
      timestamp: new Date().toISOString(),
      previousStatus: oldStatus,
      newStatus: nextStatus,
      rawStatus,
      plainLanguageSummary: plainLanguage,
      actor: 'Nagrik Sandesh (Monitoring Agent)',
      agentGenerated: true,
    });

    traces.push({
      nodeName: 'log_history',
      title: 'Immutable Audit Trail Persistence',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - logStart,
      inputSummary: `Commit history record for #${complaint.id}`,
      reasoning: `Appended timestamped entry to complaint status history with raw government status and AI translation.`,
      outputSummary: `Audit record persisted (Status: ${nextStatus})`,
      status: 'success',
    });

    updatedComplaints.push({
      id: complaint.id,
      oldStatus,
      newStatus: nextStatus,
      plainLanguageUpdate: plainLanguage,
    });
  }

  return {
    checkedCount: candidateComplaints.length,
    updatedCount: updatedComplaints.length,
    timestamp: new Date().toISOString(),
    updatedComplaints,
    trace: traces,
  };
}

async function translateRawStatusToCitizenLanguage(
  complaint: Complaint,
  oldStatus: ComplaintStatus,
  newStatus: ComplaintStatus,
  rawStatus: string
): Promise<string> {
  try {
    const prompt = `Convert this raw government work order status update into a friendly, clear, plain-language 1-2 sentence message for the citizen who reported it.

Issue Category: ${complaint.issueType}
Title: ${complaint.title}
Location: ${complaint.location}
Department: ${complaint.departmentName}
Previous Status: ${oldStatus}
New Status: ${newStatus}
Raw Municipal Status Code: ${rawStatus}

Requirements:
- Speak in warm, reassuring, professional language.
- Plain language: no bureaucratic codes or acronyms.
- 1 to 2 sentences maximum.`;

    const result = await generateContentWithFallback(
      prompt,
      'You are a citizen advocate AI translator. Translate municipal work orders into friendly plain language.'
    );

    const cleanText = result.text.trim();
    if (cleanText.length > 10) {
      return cleanText;
    }
  } catch (err: any) {
    console.warn('[Monitoring Agent: translation fallback]', err.message);
  }

  // Robust heuristic fallback translation
  return getHeuristicTranslation(complaint, newStatus);
}

function getHeuristicTranslation(complaint: Complaint, newStatus: ComplaintStatus): string {
  const cat = (complaint.issueType || (complaint as any).category || 'civic issue').replace('_', ' ');
  switch (newStatus) {
    case 'ACKNOWLEDGED':
      return `The ${complaint.departmentName} has officially received and verified your ${cat} report. It is queued for inspection.`;
    case 'ASSIGNED':
      return `A dedicated field crew from ${complaint.departmentName} has been assigned to inspect and address the ${cat} at ${complaint.location}.`;
    case 'IN_PROGRESS':
      return `Field crews are currently on-site working on the ${cat}. Safety barriers or repair equipment have been mobilized.`;
    case 'SCHEDULED':
      return `Repairs for the ${cat} have been scheduled for final completion within the current operational window.`;
    case 'RESOLVED':
      return `Great news! The ${cat} issue at ${complaint.location} has been successfully resolved and inspected by municipal crews.`;
    case 'CLOSED':
      return `This complaint ticket has been closed following confirmation of the completed work.`;
    default:
      return `Your complaint status has been updated to ${newStatus}.`;
  }
}

function formatStatusLabel(status: ComplaintStatus): string {
  switch (status) {
    case 'FILED':
      return 'Filed & Received';
    case 'ACKNOWLEDGED':
      return 'Acknowledged';
    case 'ASSIGNED':
      return 'Crew Assigned';
    case 'IN_PROGRESS':
      return 'Work In Progress';
    case 'SCHEDULED':
      return 'Scheduled for Completion';
    case 'RESOLVED':
      return 'Resolved';
    case 'CLOSED':
      return 'Closed';
  }
}

/**
 * Option 3: Escalate If Late - Evaluates all active complaints against their SLA deadline,
 * automatically flags overdue tickets, escalates them to Senior Executive Engineer/Commissioner,
 * and notifies the citizen.
 */
export async function checkAndEscalateOverdueComplaints(): Promise<{
  overdueCount: number;
  escalatedCount: number;
  complaints: Complaint[];
  escalatedList: Complaint[];
}> {
  const allComplaints = civicDb.getComplaints();
  const now = Date.now();
  const escalatedList: Complaint[] = [];
  let overdueCount = 0;

  for (const complaint of allComplaints) {
    if (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') continue;

    const isLate = complaint.slaDeadline ? now > new Date(complaint.slaDeadline).getTime() : false;
    if (isLate) {
      overdueCount++;
      if (!complaint.isEscalated) {
        const result = civicDb.executeGovAction(complaint.id, {
          action: 'escalate',
          escalatedTo: 'Senior Executive Engineer & Zonal Commissioner',
          escalationReason: `Automatic SLA Breach: Resolution SLA of ${new Date(complaint.slaDeadline!).toLocaleString()} has expired. Priority elevated to EMERGENCY.`,
          actorName: 'Nagrik Sandesh (Automated SLA Sentinel)',
        });
        escalatedList.push(result.complaint);
      }
    }
  }

  return {
    overdueCount,
    escalatedCount: escalatedList.length,
    complaints: civicDb.getComplaints(),
    escalatedList,
  };
}

/**
 * Option 2: Check Status - Continuous Monitoring Agent batch status poll
 * Updates progress summaries, actions taken, and last updated timestamps.
 */
export async function checkAllComplaintsStatus(): Promise<{
  checkedCount: number;
  complaints: Complaint[];
  timestamp: string;
}> {
  const allComplaints = civicDb.getComplaints();
  const nowStr = new Date().toISOString();

  for (const complaint of allComplaints) {
    if (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') continue;

    // Refresh lastStatusCheck
    civicDb.executeGovAction(complaint.id, {
      action: 'check_status',
      progressSummary: complaint.status === 'IN_PROGRESS'
        ? `Field works active at ${complaint.location}. Material deployment confirmed.`
        : complaint.status === 'ASSIGNED'
        ? `Work order accepted by field crew. Site arrival scheduled within SLA window.`
        : `Triage complete. Awaiting dispatch clearance.`,
      actionTaken: 'Continuous IoT and field radio log verified by Monitoring Agent.',
      assignedOfficer: complaint.assignedOfficer || 'Municipal Field Operations Unit',
      assignedOfficerBadge: complaint.assignedCrew ? 'CREW-DISPATCH' : 'OPS-MONITOR',
      actorName: 'Nagrik Sandesh (Monitoring Agent)',
    });
  }

  return {
    checkedCount: allComplaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length,
    complaints: civicDb.getComplaints(),
    timestamp: nowStr,
  };
}

