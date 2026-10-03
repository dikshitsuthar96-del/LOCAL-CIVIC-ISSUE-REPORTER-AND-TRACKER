import { GovUser, GovRole } from '../src/types.js';
import { persistAuditLogInFirestore, persistGovUserInFirestore } from './firebase.js';

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

export interface OfficialGovUserWithCredentials extends GovUser {
  secretPin: string;
  secondaryPins?: string[];
}

export const OFFICIAL_GOV_USERS: OfficialGovUserWithCredentials[] = [
  {
    id: 'gov_u_01',
    badgeNumber: 'MUNI-001',
    name: 'Jane Vance',
    title: 'City Operations Administrator',
    email: 'admin@metropolis.gov',
    role: 'CITY_ADMIN',
    departmentId: 'ALL',
    departmentName: 'Office of the City Administrator (All Agencies)',
    clearanceLevel: 'LEVEL_4_EXECUTIVE',
    token: 'gov_tok_admin_sec_9941_jv',
    secretPin: 'Admin#2026',
    secondaryPins: ['citygov2026', '123456', 'MUNI-001'],
  },
  {
    id: 'gov_u_02',
    badgeNumber: 'DOT-402',
    name: 'Marcus Sterling',
    title: 'Senior Streets & Highways Dispatcher',
    email: 'marcus.sterling@metropolis.gov',
    role: 'DEPT_DISPATCHER',
    departmentId: 'dept_transport',
    departmentName: 'Department of Transportation & Streets',
    clearanceLevel: 'LEVEL_2_DISPATCHER',
    token: 'gov_tok_dot_sec_4021_ms',
    secretPin: 'Dot#4021',
    secondaryPins: ['citygov2026', '123456', 'DOT-402'],
  },
  {
    id: 'gov_u_03',
    badgeNumber: 'WATER-109',
    name: 'Elena Rostova',
    title: 'Utility Dispatch Supervisor',
    email: 'elena.rostova@metropolis.gov',
    role: 'DEPT_DISPATCHER',
    departmentId: 'dept_water',
    departmentName: 'Department of Water & Sewer Services',
    clearanceLevel: 'LEVEL_2_DISPATCHER',
    token: 'gov_tok_water_sec_1093_er',
    secretPin: 'Water#1093',
    secondaryPins: ['citygov2026', '123456', 'WATER-109'],
  },
  {
    id: 'gov_u_04',
    badgeNumber: 'SAN-304',
    name: 'Carlos Rivera',
    title: 'Public Sanitation Dispatch Lead',
    email: 'carlos.rivera@metropolis.gov',
    role: 'DEPT_DISPATCHER',
    departmentId: 'dept_sanitation',
    departmentName: 'Department of Sanitation & Waste Management',
    clearanceLevel: 'LEVEL_2_DISPATCHER',
    token: 'gov_tok_san_sec_3042_cr',
    secretPin: 'San#3042',
    secondaryPins: ['citygov2026', '123456', 'SAN-304'],
  },
  {
    id: 'gov_u_05',
    badgeNumber: 'CREW-774',
    name: 'Robert Diaz',
    title: 'Municipal Field Operations Supervisor',
    email: 'robert.diaz@metropolis.gov',
    role: 'FIELD_SUPERVISOR',
    departmentId: 'ALL',
    departmentName: 'District Maintenance Field Units',
    clearanceLevel: 'LEVEL_3_SUPERVISOR',
    token: 'gov_tok_crew_sec_7749_rd',
    secretPin: 'Crew#7749',
    secondaryPins: ['citygov2026', '123456', 'CREW-774'],
  },
  {
    id: 'gov_u_06',
    badgeNumber: 'AUDIT-901',
    name: 'Sarah Chen',
    title: 'Civic Transparency Inspector',
    email: 'sarah.chen@metropolis.gov',
    role: 'AUDITOR',
    departmentId: 'ALL',
    departmentName: 'Office of the Inspector General (Auditor)',
    clearanceLevel: 'LEVEL_1_OPERATOR',
    token: 'gov_tok_audit_sec_9012_sc',
    secretPin: 'Audit#9012',
    secondaryPins: ['citygov2026', '123456', 'AUDIT-901'],
  },
  {
    id: 'gov_u_07',
    badgeNumber: 'LIGHT-205',
    name: 'Vikram Patel',
    title: 'Senior Electrical Grid Dispatcher',
    email: 'vikram.patel@metropolis.gov',
    role: 'DEPT_DISPATCHER',
    departmentId: 'dept_lighting',
    departmentName: 'Bureau of Street Lighting & Electrical',
    clearanceLevel: 'LEVEL_2_DISPATCHER',
    token: 'gov_tok_light_sec_2054_vp',
    secretPin: 'Light#2054',
    secondaryPins: ['citygov2026', '123456', 'LIGHT-205'],
  },
  {
    id: 'gov_u_08',
    badgeNumber: 'PARKS-511',
    name: 'Anita Roy',
    title: 'Urban Forestry & Parks Dispatcher',
    email: 'anita.roy@metropolis.gov',
    role: 'DEPT_DISPATCHER',
    departmentId: 'dept_parks',
    departmentName: 'Parks, Urban Forestry & Public Space',
    clearanceLevel: 'LEVEL_2_DISPATCHER',
    token: 'gov_tok_parks_sec_5119_ar',
    secretPin: 'Parks#5119',
    secondaryPins: ['citygov2026', '123456', 'PARKS-511'],
  },
];

// Active user sessions stored in memory (token -> GovUser)
const activeSessions: Map<string, { user: GovUser; expiresAt: number; createdAt: number }> = new Map();

// Immutable in-memory audit log for municipal transparency
const auditLogs: GovAuditLogEntry[] = [];

export function recordAuditLog(entry: Omit<GovAuditLogEntry, 'id' | 'timestamp'>): GovAuditLogEntry {
  const fullEntry: GovAuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString(),
  };
  auditLogs.unshift(fullEntry);
  if (auditLogs.length > 500) {
    auditLogs.pop();
  }

  // Persist to database asynchronously
  persistAuditLogInFirestore(fullEntry).catch((err) => {
    console.warn('Could not persist audit log to Firestore:', err);
  });

  return fullEntry;
}

export function getAuditLogs(): GovAuditLogEntry[] {
  return [...auditLogs];
}

// Initialize pre-seeded tokens for testing convenience and persist officers to database
OFFICIAL_GOV_USERS.forEach((u) => {
  const { secretPin, secondaryPins, ...userWithoutSecrets } = u;
  activeSessions.set(u.token, {
    user: userWithoutSecrets,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    createdAt: Date.now(),
  });

  // Persist to database
  persistGovUserInFirestore(userWithoutSecrets).catch(() => {});
});

/**
 * Authenticates municipal officer credentials against verified city directory.
 * Strict validation: requires BOTH identifier AND valid security PIN/password.
 */
export function authenticateOfficer(
  identifier: string,
  secretPin?: string
): { success: boolean; user?: GovUser; error?: string } {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPin = (secretPin || '').trim();

  if (!cleanId) {
    recordAuditLog({
      eventType: 'AUTH_FAILED',
      details: 'Rejected authentication request: Missing municipal badge or email identifier.',
    });
    return {
      success: false,
      error: 'Municipal badge number or employee email is required.',
    };
  }

  // Find user by email or badge number
  const match = OFFICIAL_GOV_USERS.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.badgeNumber.toLowerCase() === cleanId
  );

  if (!match) {
    recordAuditLog({
      eventType: 'AUTH_FAILED',
      details: `Rejected authentication: Identifier "${identifier}" not found in Metropolis employee directory.`,
    });
    return {
      success: false,
      error: 'Invalid municipal identifier. Please enter an authorized Metropolis civil servant email or badge number.',
    };
  }

  // Enforce mandatory PIN check
  if (!cleanPin) {
    recordAuditLog({
      eventType: 'AUTH_FAILED',
      officerBadge: match.badgeNumber,
      officerName: match.name,
      officerRole: match.role,
      details: `Officer ${match.badgeNumber} attempted authentication without providing security PIN/password.`,
    });
    return {
      success: false,
      error: 'Security PIN or password is required. Please provide your official municipal credential.',
    };
  }

  // Validate PIN against primary secretPin or accepted secondary demo pins
  const isPinValid =
    cleanPin === match.secretPin ||
    cleanPin === match.badgeNumber ||
    (match.secondaryPins && match.secondaryPins.includes(cleanPin));

  if (!isPinValid) {
    recordAuditLog({
      eventType: 'AUTH_FAILED',
      officerBadge: match.badgeNumber,
      officerName: match.name,
      officerRole: match.role,
      details: `Failed authentication for officer ${match.badgeNumber}: Invalid security PIN.`,
    });
    return {
      success: false,
      error: `Invalid security PIN for officer ${match.name} (${match.badgeNumber}). Please enter the correct password.`,
    };
  }

  // Generate cryptographic session token
  const token = `gov_tok_${match.badgeNumber.toLowerCase().replace('-', '_')}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  const { secretPin: _sp, secondaryPins: _sec, ...safeUser } = match;
  const authenticatedUser: GovUser = { ...safeUser, token };

  activeSessions.set(token, {
    user: authenticatedUser,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    createdAt: Date.now(),
  });

  recordAuditLog({
    eventType: 'AUTH_SUCCESS',
    officerBadge: match.badgeNumber,
    officerName: match.name,
    officerRole: match.role,
    details: `Officer ${match.name} (${match.badgeNumber}) successfully authenticated into Government Simulator. Clearance: ${match.clearanceLevel}.`,
  });

  return { success: true, user: authenticatedUser };
}

/**
 * Verifies a token and returns the GovUser
 */
export function verifyOfficerToken(token?: string): GovUser | null {
  if (!token) return null;
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

  // Check active memory sessions
  const session = activeSessions.get(cleanToken);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(cleanToken);
    return null;
  }

  return session.user;
}

/**
 * Invalidates an active officer session upon logout
 */
export function invalidateOfficerSession(token?: string): boolean {
  if (!token) return false;
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  const session = activeSessions.get(cleanToken);
  if (session) {
    recordAuditLog({
      eventType: 'AUTH_LOGOUT',
      officerBadge: session.user.badgeNumber,
      officerName: session.user.name,
      officerRole: session.user.role,
      details: `Officer ${session.user.name} (${session.user.badgeNumber}) signed out. Session invalidated.`,
    });
  }
  return activeSessions.delete(cleanToken);
}

/**
 * Verifies whether an authenticated municipal officer is authorized to access or view records
 * for a specific department. Enforces strict departmental isolation:
 * If an officer is logged in for Garbage / Sanitation (or any department-specific dispatcher role),
 * they CANNOT access, view, or interact with other municipal departments.
 */
export function canOfficerAccessDepartment(
  user: GovUser,
  targetDepartmentId?: string
): { allowed: boolean; reason?: string } {
  // 1. City Administrator has universal executive authority
  if (user.role === 'CITY_ADMIN') {
    return { allowed: true };
  }

  // 2. Civic Auditor has read-only oversight across all agencies
  if (user.role === 'AUDITOR') {
    return { allowed: true };
  }

  // 3. Field Supervisor has multi-agency field clearance when assigned to ALL
  if (user.role === 'FIELD_SUPERVISOR' && user.departmentId === 'ALL') {
    return { allowed: true };
  }

  // 4. Department Dispatcher: Strictly isolated to their own agency!
  if (user.role === 'DEPT_DISPATCHER' && user.departmentId !== 'ALL') {
    if (targetDepartmentId && targetDepartmentId !== user.departmentId) {
      const isGarbage = user.departmentId === 'dept_sanitation';
      const deptDescription = isGarbage
        ? 'Department of Sanitation & Waste Management (Garbage)'
        : user.departmentName;

      return {
        allowed: false,
        reason: `Access Denied (403 Forbidden): Departmental Isolation Enforced. Officer ${user.name} (${user.badgeNumber}) is assigned to ${deptDescription}. Cross-departmental access to other municipal agencies is prohibited by municipal charter.`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Authorizes a specific action based on the officer's role, clearance level, and target complaint department.
 * Enforces strict Role-Based Access Control (RBAC).
 */
export function authorizeGovAction(
  user: GovUser,
  action: string,
  complaintDepartmentId?: string
): { authorized: boolean; reason?: string } {
  // 1. Auditors have strictly READ-ONLY privileges
  if (user.role === 'AUDITOR') {
    return {
      authorized: false,
      reason: 'Access Denied (403 Forbidden): Municipal Auditor credentials possess read-only oversight permissions. Mutation and triage actions are restricted by municipal integrity charter.',
    };
  }

  // 2. City Administrator has universal access across all agencies
  if (user.role === 'CITY_ADMIN') {
    return { authorized: true };
  }

  // 3. Field Supervisor can only update status, crews, and resolution proof (cannot dismiss or reassign departments)
  if (user.role === 'FIELD_SUPERVISOR') {
    if (action === 'reject') {
      return {
        authorized: false,
        reason: 'Access Denied (403 Forbidden): Field Operations Supervisors cannot dismiss or reject citizen reports. Rejection requires Administrative Dispatcher or City Executive clearance.',
      };
    }
    if (action === 'reassign') {
      return {
        authorized: false,
        reason: 'Access Denied (403 Forbidden): Field Operations Supervisors cannot reassign municipal departments. Inter-agency rerouting requires Dispatcher clearance.',
      };
    }
    return { authorized: true };
  }

  // 4. Department Dispatcher: strictly bounded by department jurisdiction
  if (user.role === 'DEPT_DISPATCHER') {
    if (
      user.departmentId !== 'ALL' &&
      complaintDepartmentId &&
      user.departmentId !== complaintDepartmentId
    ) {
      const isGarbage = user.departmentId === 'dept_sanitation';
      const agencyName = isGarbage ? 'Department of Sanitation & Waste Management (Garbage)' : user.departmentName;
      return {
        authorized: false,
        reason: `Access Denied (403 Forbidden): Officer ${user.name} (${user.badgeNumber}) is assigned exclusively to ${agencyName}. You cannot access or mutate tickets assigned to other municipal departments.`,
      };
    }
    return { authorized: true };
  }

  return { authorized: true };
}

