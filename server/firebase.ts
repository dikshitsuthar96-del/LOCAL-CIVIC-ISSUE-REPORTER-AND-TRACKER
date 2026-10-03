import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Load config from firebase-applet-config.json
let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (err) {
  console.warn('Could not read firebase-applet-config.json:', err);
}

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig || {});
// Use the configured database ID if provided, otherwise default
export const firestore = firebaseConfig?.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface CitizenUserProfile {
  id: string; // Document ID (usually citizenId)
  citizenId: string; // Generated ID e.g. CITIZEN-USR-XXXXXXXX
  name: string;
  email: string;
  phone: string;
  totalReportsFiled: number;
  firstReportAt: string;
  lastReportAt: string;
  complaintIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate a consistent citizen identifier or look up existing by email/phone
 */
export function generateCitizenUserId(): string {
  const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  const timeHex = Date.now().toString(16).slice(-4).toUpperCase();
  return `CITIZEN-USR-${timeHex}${randHex}`;
}

/**
 * Persist or update Citizen User in Firestore
 */
export async function persistCitizenUser(params: {
  name?: string;
  email?: string;
  phone?: string;
  complaintId: string;
  createdAt?: string;
}): Promise<CitizenUserProfile> {
  const email = (params.email || '').trim().toLowerCase();
  const phone = (params.phone || '').trim();
  const name = (params.name || '').trim() || 'Anonymous Citizen';
  const now = params.createdAt || new Date().toISOString();

  // Create a document key: prefer email if present, otherwise sanitized phone or new citizenId
  let docId = '';
  if (email) {
    docId = `email_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (phone) {
    docId = `phone_${phone.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  let existingUser: CitizenUserProfile | null = null;
  if (docId) {
    try {
      const docRef = doc(firestore, 'citizen_users', docId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        existingUser = snapshot.data() as CitizenUserProfile;
      }
    } catch (err) {
      console.warn('Failed to query existing citizen user from Firestore:', err);
    }
  }

  if (existingUser) {
    // Update existing user record
    const updatedIds = Array.from(new Set([...existingUser.complaintIds, params.complaintId]));
    const updatedUser: CitizenUserProfile = {
      ...existingUser,
      name: name !== 'Anonymous Citizen' ? name : existingUser.name,
      email: email || existingUser.email,
      phone: phone || existingUser.phone,
      totalReportsFiled: updatedIds.length,
      lastReportAt: now,
      complaintIds: updatedIds,
      updatedAt: now,
    };

    try {
      await setDoc(doc(firestore, 'citizen_users', docId), updatedUser);
    } catch (err) {
      console.warn('Failed to write citizen user update to Firestore:', err);
    }
    return updatedUser;
  } else {
    // Create new citizen user profile
    const citizenId = generateCitizenUserId();
    const finalDocId = docId || citizenId;
    const newUser: CitizenUserProfile = {
      id: finalDocId,
      citizenId,
      name,
      email: email || 'N/A',
      phone: phone || 'N/A',
      totalReportsFiled: 1,
      firstReportAt: now,
      lastReportAt: now,
      complaintIds: [params.complaintId],
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(firestore, 'citizen_users', finalDocId), newUser);
    } catch (err) {
      console.warn('Failed to insert new citizen user to Firestore:', err);
    }
    return newUser;
  }
}

/**
 * Fetch all Citizen Users from Firestore
 */
export async function getAllCitizenUsers(): Promise<CitizenUserProfile[]> {
  try {
    const colRef = collection(firestore, 'citizen_users');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data() as CitizenUserProfile);
  } catch (err) {
    console.warn('Could not fetch citizen users from Firestore:', err);
    return [];
  }
}

/**
 * Persist Complaint in Firestore
 */
export async function persistComplaintInFirestore(complaint: any): Promise<void> {
  try {
    const docRef = doc(firestore, 'complaints', complaint.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(complaint)), { merge: true });
  } catch (err) {
    console.warn(`Failed to persist complaint ${complaint.id} to Firestore:`, err);
  }
}

/**
 * Persist Civic Report in Firestore
 */
export async function persistCivicReportInFirestore(report: any): Promise<void> {
  try {
    const docRef = doc(firestore, 'civic_reports', report.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(report)), { merge: true });
    console.log(`[Firestore] Successfully persisted civic report #${report.id} to cloud database`);
  } catch (err) {
    console.warn(`[Firestore] Notice persisting civic report #${report?.id}:`, err);
  }
}

/**
 * Get Single Civic Report from Firestore
 */
export async function getCivicReportFromFirestore(id: string): Promise<any | null> {
  try {
    const docRef = doc(firestore, 'civic_reports', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn(`[Firestore] Notice querying civic report #${id}:`, err);
    return null;
  }
}

/**
 * Get All Civic Reports from Firestore
 */
export async function getAllCivicReportsFromFirestore(userId?: string): Promise<any[]> {
  try {
    const colRef = collection(firestore, 'civic_reports');
    const snap = await getDocs(colRef);
    let list = snap.docs.map((d) => d.data());
    if (userId) {
      list = list.filter((r: any) => r.user_id === userId);
    }
    return list.sort(
      (a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  } catch (err) {
    console.warn('[Firestore] Notice querying all civic reports:', err);
    return [];
  }
}

/**
 * Update Civic Report Status in Firestore
 */
export async function updateCivicReportStatusInFirestore(id: string, newStatus: string): Promise<void> {
  try {
    const docRef = doc(firestore, 'civic_reports', id);
    await setDoc(
      docRef,
      {
        status: newStatus,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`[Firestore] Updated status for civic report #${id} to ${newStatus}`);
  } catch (err) {
    console.warn(`[Firestore] Notice updating civic report #${id}:`, err);
  }
}

/**
 * Persist Security Audit Log in Firestore
 */
export async function persistAuditLogInFirestore(log: any): Promise<void> {
  try {
    const docRef = doc(firestore, 'audit_logs', log.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(log)), { merge: true });
  } catch (err) {
    console.warn(`Failed to persist audit log ${log.id} to Firestore:`, err);
  }
}

/**
 * Persist Gov User in Firestore
 */
export async function persistGovUserInFirestore(user: any): Promise<void> {
  try {
    const docRef = doc(firestore, 'gov_users', user.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(user)), { merge: true });
  } catch (err) {
    console.warn(`Failed to persist gov user ${user.id} to Firestore:`, err);
  }
}

/**
 * Generates an executable PostgreSQL script containing all current tables,
 * schema definitions, and INSERT statements for all users, complaints, and audit logs.
 */
export function generatePostgresSqlScript(params: {
  govUsers: any[];
  citizenUsers: CitizenUserProfile[];
  complaints: any[];
  auditLogs: any[];
}): string {
  const { govUsers, citizenUsers, complaints, auditLogs } = params;

  const escapeSql = (str: any) => {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
  };

  const lines: string[] = [];

  lines.push('-- =========================================================================');
  lines.push('-- METROPOLIS CIVIC INFRASTRUCTURE - POSTGRESQL MIGRATION DUMP');
  lines.push(`-- Generated At: ${new Date().toISOString()}`);
  lines.push('-- =========================================================================\n');

  lines.push('BEGIN;\n');

  lines.push('-- Table 1: Government Staff & Officers (RBAC)');
  lines.push(`CREATE TABLE IF NOT EXISTS gov_users (
    id VARCHAR(64) PRIMARY KEY,
    badge_number VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    title VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL,
    department_id VARCHAR(64) NOT NULL,
    department_name VARCHAR(128) NOT NULL,
    clearance_level VARCHAR(32) NOT NULL,
    last_login_at TIMESTAMPTZ
);\n`);

  lines.push('-- Table 2: Citizen Users (Generated IDs & Profiles)');
  lines.push(`CREATE TABLE IF NOT EXISTS citizen_users (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    phone VARCHAR(32),
    total_reports_filed INT DEFAULT 1,
    first_report_at TIMESTAMPTZ,
    last_report_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  lines.push('-- Table 3: Municipal Complaints & Work Orders');
  lines.push(`CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(64) PRIMARY KEY,
    official_reference_number VARCHAR(64) UNIQUE NOT NULL,
    citizen_id VARCHAR(64) REFERENCES citizen_users(citizen_id) ON DELETE SET NULL,
    issue_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    department_id VARCHAR(64) NOT NULL,
    department_name VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    priority VARCHAR(16) NOT NULL,
    submitter_name VARCHAR(128),
    submitter_email VARCHAR(128),
    submitter_phone VARCHAR(32),
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  lines.push('-- Table 4: Security & RBAC Audit Logs');
  lines.push(`CREATE TABLE IF NOT EXISTS gov_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    event_type VARCHAR(32) NOT NULL,
    officer_badge VARCHAR(32),
    officer_name VARCHAR(128),
    officer_role VARCHAR(32),
    action VARCHAR(64),
    complaint_id VARCHAR(64),
    details TEXT NOT NULL
);\n`);

  // Insert Government Users
  if (govUsers && govUsers.length > 0) {
    lines.push('-- Insert Government Officers');
    for (const u of govUsers) {
      lines.push(
        `INSERT INTO gov_users (id, badge_number, name, title, email, role, department_id, department_name, clearance_level, last_login_at) VALUES (${escapeSql(u.id)}, ${escapeSql(u.badgeNumber)}, ${escapeSql(u.name)}, ${escapeSql(u.title)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${escapeSql(u.departmentId)}, ${escapeSql(u.departmentName)}, ${escapeSql(u.clearanceLevel)}, NOW()) ON CONFLICT (id) DO UPDATE SET last_login_at = NOW();`
      );
    }
    lines.push('');
  }

  // Insert Citizen Users
  if (citizenUsers && citizenUsers.length > 0) {
    lines.push('-- Insert Citizen Users');
    for (const c of citizenUsers) {
      lines.push(
        `INSERT INTO citizen_users (id, citizen_id, name, email, phone, total_reports_filed, first_report_at, last_report_at, created_at, updated_at) VALUES (${escapeSql(c.id)}, ${escapeSql(c.citizenId)}, ${escapeSql(c.name)}, ${escapeSql(c.email)}, ${escapeSql(c.phone)}, ${c.totalReportsFiled || 1}, ${escapeSql(c.firstReportAt)}, ${escapeSql(c.lastReportAt)}, ${escapeSql(c.createdAt)}, ${escapeSql(c.updatedAt)}) ON CONFLICT (id) DO UPDATE SET total_reports_filed = EXCLUDED.total_reports_filed, last_report_at = EXCLUDED.last_report_at;`
      );
    }
    lines.push('');
  }

  // Insert Complaints
  if (complaints && complaints.length > 0) {
    lines.push('-- Insert Complaints');
    for (const cmp of complaints) {
      lines.push(
        `INSERT INTO complaints (id, official_reference_number, citizen_id, issue_type, title, description, location, department_id, department_name, status, priority, submitter_name, submitter_email, submitter_phone, photo_url, created_at, updated_at) VALUES (${escapeSql(cmp.id)}, ${escapeSql(cmp.officialReferenceNumber)}, ${escapeSql(cmp.citizenId || null)}, ${escapeSql(cmp.issueType)}, ${escapeSql(cmp.title)}, ${escapeSql(cmp.description)}, ${escapeSql(cmp.location)}, ${escapeSql(cmp.departmentId)}, ${escapeSql(cmp.departmentName)}, ${escapeSql(cmp.status)}, ${escapeSql(cmp.priority)}, ${escapeSql(cmp.submitterName)}, ${escapeSql(cmp.submitterEmail)}, ${escapeSql(cmp.submitterPhone)}, ${escapeSql(cmp.photoUrl)}, ${escapeSql(cmp.createdAt)}, ${escapeSql(cmp.updatedAt)}) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`
      );
    }
    lines.push('');
  }

  // Insert Audit Logs
  if (auditLogs && auditLogs.length > 0) {
    lines.push('-- Insert Audit Logs');
    for (const a of auditLogs.slice(0, 50)) {
      lines.push(
        `INSERT INTO gov_audit_logs (id, timestamp, event_type, officer_badge, officer_name, officer_role, action, complaint_id, details) VALUES (${escapeSql(a.id)}, ${escapeSql(a.timestamp)}, ${escapeSql(a.eventType)}, ${escapeSql(a.officerBadge)}, ${escapeSql(a.officerName)}, ${escapeSql(a.officerRole)}, ${escapeSql(a.action)}, ${escapeSql(a.complaintId)}, ${escapeSql(a.details)}) ON CONFLICT (id) DO NOTHING;`
      );
    }
    lines.push('');
  }

  lines.push('COMMIT;\n');
  return lines.join('\n');
}
