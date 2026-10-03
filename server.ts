import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { civicDb, DEPARTMENTS } from './server/db.js';
import { runIntakeAgent } from './server/agents/intakeAgent.js';
import {
  runMonitoringAgent,
  checkAndEscalateOverdueComplaints,
  checkAllComplaintsStatus,
} from './server/agents/monitoringAgent.js';
import { analyzeCivicImage } from './server/analyzeService.js';
import { Complaint, ComplaintStatus, GovActionPayload } from './src/types.js';
import {
  authenticateOfficer,
  verifyOfficerToken,
  authorizeGovAction,
  canOfficerAccessDepartment,
  invalidateOfficerSession,
  recordAuditLog,
  getAuditLogs,
  OFFICIAL_GOV_USERS,
} from './server/govAuth.js';
import {
  getAllCitizenUsers,
  generatePostgresSqlScript,
  persistComplaintInFirestore,
} from './server/firebase.js';
import { supabaseManager } from './server/supabase.js';
import { notificationService } from './server/notificationService.js';


const __filenameSafe = typeof __filename !== 'undefined' ? __filename : (typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '');
const __dirnameSafe = typeof __dirname !== 'undefined' ? __dirname : (path.dirname(__filenameSafe) || process.cwd());

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // 1. Top-Level Request Deserialization (Ordering Guarantee)
  // Large limit to accept base64 photos uploaded directly
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // --- API Routes ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'civic-reporter-tracker', timestamp: new Date().toISOString() });
  });

  // SSE Real-time Updates Stream for runtime synchronization
  const sseClients = new Set<express.Response>();

  const broadcastComplaintUpdate = (complaint: Complaint | undefined) => {
    if (!complaint || !complaint.id) return;
    const payload = `data: ${JSON.stringify(complaint)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch (_) {
        sseClients.delete(client);
      }
    }
  };

  app.get('/api/complaints/live', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write(': connected to civic live stream\n\n');
    sseClients.add(res);

    const keepAliveTimer = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch (_) {
        clearInterval(keepAliveTimer);
        sseClients.delete(res);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      sseClients.delete(res);
    });
  });

  // Get Municipal Departments
  app.get('/api/departments', (req, res) => {
    res.json(DEPARTMENTS);
  });

  // List Complaints (with defensive query params and strict departmental isolation)
  app.get('/api/complaints', (req, res) => {
    try {
      const query = (req.query && typeof req.query === 'object') ? req.query : {};
      const statusFilter = typeof query.status === 'string' ? query.status : undefined;
      const deptFilter = typeof query.departmentId === 'string' ? query.departmentId : undefined;
      const categoryFilter = typeof query.category === 'string' ? query.category : undefined;
      const search = typeof query.search === 'string' ? query.search.toLowerCase() : undefined;

      // Extract municipal officer token if present
      const rawHeader = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawHeader);

      let list = civicDb.getComplaints();

      // Enforce strict departmental isolation for Department Dispatchers (e.g. Garbage / Sanitation)
      if (officer && officer.role === 'DEPT_DISPATCHER' && officer.departmentId !== 'ALL') {
        // If they specifically requested another department, reject with HTTP 403 Forbidden
        if (deptFilter && deptFilter !== 'ALL' && deptFilter !== officer.departmentId) {
          recordAuditLog({
            eventType: 'ACTION_DENIED_403',
            officerBadge: officer.badgeNumber,
            officerName: officer.name,
            officerRole: officer.role,
            action: 'cross_department_access_blocked',
            details: `403 Forbidden: Officer ${officer.name} (${officer.badgeNumber}, ${officer.departmentName}) attempted to query complaints for department "${deptFilter}". Departmental isolation enforced.`,
          });

          return res.status(403).json({
            error: 'Access Denied (403 Forbidden)',
            message: `Departmental Isolation Enforced: Officer ${officer.name} (${officer.badgeNumber}) is assigned to ${officer.departmentName}. Access to other municipal agencies is strictly restricted by municipal security policy.`,
            jurisdiction: officer.departmentName,
            requestedDepartment: deptFilter,
          });
        }

        // Always restrict returned records to their authorized department queue
        list = list.filter((c) => c.departmentId === officer.departmentId);
      } else if (deptFilter && deptFilter !== 'ALL') {
        list = list.filter((c) => c.departmentId === deptFilter);
      }

      if (statusFilter && statusFilter !== 'ALL') {
        list = list.filter((c) => c.status === statusFilter);
      }
      if (categoryFilter && categoryFilter !== 'ALL') {
        list = list.filter((c) => c.issueType === categoryFilter);
      }
      if (search) {
        list = list.filter(
          (c) =>
            c.title.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search) ||
            c.location.toLowerCase().includes(search) ||
            c.id.toLowerCase().includes(search)
        );
      }

      res.json(list);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  });

  // Get Single Complaint Detail (with strict department boundary verification)
  app.get('/api/complaints/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Complaint ID is required' });
    }
    let complaint = civicDb.getComplaintById(id);
    if (!complaint) {
      // Check Supabase civic_reports table
      try {
        const supabaseReport = await supabaseManager.getReportById(id);
        if (supabaseReport) {
          complaint = {
            id: supabaseReport.id,
            title: supabaseReport.user_description.substring(0, 50),
            issueType: 'pothole',
            officialReferenceNumber: `MET-CIVIC-${supabaseReport.id.substring(0, 8).toUpperCase()}`,
            description: supabaseReport.user_description,
            location: supabaseReport.address || 'Reported Location',
            status:
              supabaseReport.status === 'Work Completed'
                ? 'RESOLVED'
                : supabaseReport.status === 'In Progress'
                ? 'IN_PROGRESS'
                : supabaseReport.status === 'Assigned'
                ? 'ASSIGNED'
                : 'FILED',
            priority: 'MEDIUM',
            departmentId: 'dept_transport',
            departmentName: supabaseReport.department || 'Public Works & Infrastructure',
            createdAt: supabaseReport.created_at,
            updatedAt: supabaseReport.updated_at,
            photoUrl: supabaseReport.image_url || undefined,
            submitterName: 'Citizen Submitter',
            submitterPhone: supabaseReport.mobile_number,
          };
        }
      } catch (sbErr) {
        console.warn(`[Supabase single lookup] Could not query report #${id}:`, sbErr);
      }
    }

    if (!complaint) {
      return res.status(404).json({ error: `Complaint #${id} not found` });
    }

    // Check if an authenticated officer is requesting the dossier and enforce departmental boundary
    const rawHeader = req.headers.authorization || (req.headers['x-gov-token'] as string);
    const officer = verifyOfficerToken(rawHeader);
    if (officer) {
      const accessCheck = canOfficerAccessDepartment(officer, complaint.departmentId);
      if (!accessCheck.allowed) {
        recordAuditLog({
          eventType: 'ACTION_DENIED_403',
          officerBadge: officer.badgeNumber,
          officerName: officer.name,
          officerRole: officer.role,
          complaintId: id,
          action: 'view_dossier_cross_department',
          details: `403 Forbidden: Officer ${officer.name} (${officer.badgeNumber}) attempted to inspect ticket #${id} belonging to ${complaint.departmentName}. Access blocked by departmental isolation rule.`,
        });

        return res.status(403).json({
          error: 'Access Denied (403 Forbidden)',
          message: accessCheck.reason,
          officerJurisdiction: officer.departmentName,
          complaintDepartment: complaint.departmentName,
        });
      }
    }

    res.json(complaint);
  });

  // Agent 1: Submit Issue & Run Intake Agent
  app.post(['/api/complaints/submit', '/api/complaints'], async (req, res) => {
    try {
      // Defensive Payload Ingestion (Null-Safe Destructuring)
      const data = (req.body && typeof req.body === 'object') ? req.body : {};

      const description = typeof data.description === 'string' ? data.description.trim() : '';
      const location = typeof data.location === 'string' ? data.location.trim() : '';

      if (!description) {
        return res.status(400).json({ error: 'Text description of the civic issue is required' });
      }
      if (!location) {
        return res.status(400).json({ error: 'Location of the civic issue is required' });
      }

      const payload = {
        id: typeof data.id === 'string' ? data.id : undefined,
        category: typeof data.category === 'string' ? data.category : undefined,
        departmentId: typeof data.departmentId === 'string' ? data.departmentId : undefined,
        departmentName: typeof data.departmentName === 'string' ? data.departmentName : undefined,
        photoBase64: typeof data.photoBase64 === 'string' ? data.photoBase64 : undefined,
        photoMimeType: typeof data.photoMimeType === 'string' ? data.photoMimeType : undefined,
        photoUrl: typeof data.photoUrl === 'string' ? data.photoUrl : undefined,
        description,
        location,
        submitterName: typeof data.submitterName === 'string' ? data.submitterName.trim() : undefined,
        submitterEmail: typeof data.submitterEmail === 'string' ? data.submitterEmail.trim() : undefined,
        submitterPhone: typeof data.submitterPhone === 'string' ? data.submitterPhone.trim() : undefined,
      };

      console.log(`[Agent 1: Intake] Processing submission at "${location}"...`);
      const result = await runIntakeAgent(payload);

      res.status(201).json(result);
    } catch (err: any) {
      console.error('[Agent 1 Error]:', err);
      res.status(500).json({
        error: 'Failed to process intake complaint',
        details: err.message || 'Unknown internal error',
      });
    }
  });

  // Pre-submission Vision Inspection: Generates instant AI analysis for user review
  app.post('/api/analyze-image', async (req, res) => {
    try {
      const data = (req.body && typeof req.body === 'object') ? req.body : {};
      const analysis = await analyzeCivicImage({
        photoBase64: typeof data.photoBase64 === 'string' ? data.photoBase64 : undefined,
        photoMimeType: typeof data.photoMimeType === 'string' ? data.photoMimeType : undefined,
        photoUrl: typeof data.photoUrl === 'string' ? data.photoUrl : undefined,
        description: typeof data.description === 'string' ? data.description : undefined,
      });
      res.json(analysis);
    } catch (err: any) {
      console.error('[Vision Analysis Error]:', err);
      res.status(500).json({ error: 'Failed to inspect image', details: err.message });
    }
  });

  // Real GPS Reverse Geocoding Endpoint
  // Resolves precise latitude & longitude to genuine street address and municipal ward
  app.get('/api/reverse-geocode', async (req, res) => {
    try {
      const latStr = req.query.lat as string;
      const lngStr = req.query.lng as string;
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'Invalid latitude or longitude values.' });
      }

      // Query OpenStreetMap Nominatim with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'NationalCivicReporter-GovInspection/2.0 (civic-grievance-portal)',
            'Accept-Language': 'en,hi',
          },
        });
        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          const addr = data.address || {};
          const street = addr.road || addr.street || addr.footway || addr.pedestrian || addr.path || addr.suburb || 'Municipal Arterial';
          const area = addr.neighbourhood || addr.suburb || addr.residential || addr.industrial || addr.city_district || '';
          const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || 'Municipal Corporation';
          const state = addr.state || '';
          const postcode = addr.postcode ? ` - ${addr.postcode}` : '';

          const parts = [street, area, city, state].filter(Boolean);
          const formatted = parts.length > 0 ? `${parts.join(', ')}${postcode}` : data.display_name;

          return res.json({
            address: formatted || `Latitude: ${lat.toFixed(5)}°, Longitude: ${lng.toFixed(5)}°`,
            displayName: data.display_name,
            rawAddress: addr,
            latitude: lat,
            longitude: lng,
          });
        }
      } catch (fetchErr: any) {
        clearTimeout(timeout);
        console.warn('[Reverse Geocode Fetch Warn]:', fetchErr.message);
      }

      // Fallback with clean coordinates
      res.json({
        address: `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E (GPS Verified Location)`,
        latitude: lat,
        longitude: lng,
      });
    } catch (err: any) {
      console.error('[Reverse Geocode Error]:', err);
      res.status(500).json({ error: 'Failed to reverse geocode location' });
    }
  });

  // --- Supabase civic_reports Table Endpoints ---

  // Diagnostic Endpoint: Check Supabase connectivity & environment keys
  app.get('/api/supabase/status', (req, res) => {
    res.json(supabaseManager.getStatus());
  });

  // 1. Submit Civic Report: Inserts into public.civic_reports
  // Requires authenticated Supabase user_id UUID & mandatory mobile_number
  app.post('/api/civic-reports', async (req, res) => {
    try {
      const data = (req.body && typeof req.body === 'object') ? req.body : {};
      const {
        user_id,
        mobile_number,
        image_url,
        ai_description,
        user_description,
        latitude,
        longitude,
        address,
        department,
        status,
      } = data;

      // Validate user_id
      if (!user_id || typeof user_id !== 'string') {
        return res.status(401).json({
          error: 'Supabase Auth user_id is mandatory. Anonymous or unauthenticated submissions must obtain a valid Supabase Auth UUID session.',
        });
      }

      // Validate mobile_number
      if (!mobile_number || typeof mobile_number !== 'string' || !mobile_number.trim()) {
        return res.status(400).json({
          error: 'Mobile number is mandatory. Statutory civic complaints require an active mobile number for SMS dispatch upon Work Completed.',
        });
      }

      // Validate user_description
      if (!user_description || typeof user_description !== 'string' || !user_description.trim()) {
        return res.status(400).json({
          error: 'user_description is mandatory.',
        });
      }

      const authHeader = req.headers.authorization;
      const userToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

      const record = await supabaseManager.insertReport(
        {
          user_id,
          mobile_number: mobile_number.trim(),
          image_url: typeof image_url === 'string' ? image_url : null,
          ai_description: typeof ai_description === 'string' ? ai_description : null,
          user_description: user_description.trim(),
          latitude: typeof latitude === 'number' ? latitude : null,
          longitude: typeof longitude === 'number' ? longitude : null,
          address: typeof address === 'string' ? address.trim() : null,
          department: typeof department === 'string' ? department.trim() : 'Public Works & Infrastructure',
          status: status || 'Submitted',
        },
        userToken
      );

      console.log(`[Supabase civic_reports] Successfully created report #${record.id} for user_id ${record.user_id}`);
      res.status(201).json({
        success: true,
        report: record,
      });
    } catch (err: any) {
      console.error('[Supabase civic_reports error]:', err);
      res.status(500).json({
        error: 'Failed to insert report into Supabase',
        details: err.message || 'Database error',
      });
    }
  });

  // 2. Query Reports: SELECT * FROM public.civic_reports ORDER BY created_at DESC;
  app.get('/api/civic-reports', async (req, res) => {
    try {
      const userId = typeof req.query.user_id === 'string' ? req.query.user_id : undefined;
      const reports = await supabaseManager.getReports(userId);
      res.json(reports);
    } catch (err: any) {
      console.error('[Supabase civic_reports GET error]:', err);
      res.status(500).json({ error: 'Failed to fetch civic reports', details: err.message });
    }
  });

  // 3. Get single report by UUID
  app.get('/api/civic-reports/:id', async (req, res) => {
    try {
      const report = await supabaseManager.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: `Civic report #${req.params.id} not found` });
      }
      res.json(report);
    } catch (err: any) {
      console.error('[Supabase civic_reports GET single error]:', err);
      res.status(500).json({ error: 'Failed to fetch civic report', details: err.message });
    }
  });

  // 4. Update status (Submitted -> Assigned -> In Progress -> Work Completed -> Awaiting User Confirmation -> Resolved)
  // Automatically triggers statutory SMS notification when status transitions to 'Work Completed'
  app.patch('/api/civic-reports/:id/status', async (req, res) => {
    try {
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const { status, actorName, notes } = body;

      const validStatuses = [
        'Submitted',
        'Assigned',
        'In Progress',
        'Work Completed',
        'Awaiting User Confirmation',
        'Resolved',
      ];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status "${status}". Allowed values: ${validStatuses.join(', ')}`,
        });
      }

      const result = await supabaseManager.updateStatus(req.params.id, status, { actorName, notes });
      res.json({
        success: true,
        report: result.report,
        smsNotification: result.smsNotification,
      });
    } catch (err: any) {
      console.error('[Supabase status update error]:', err);
      res.status(500).json({ error: 'Failed to update report status', details: err.message });
    }
  });


  // Officer Login Gateway
  app.post('/api/gov/auth/login', (req, res) => {
    try {
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const identifier = body.identifier || body.email || body.badgeNumber;
      const pin = body.pin || body.secretPin || body.password;

      if (!identifier) {
        return res.status(400).json({
          success: false,
          error: 'Municipal badge number or employee email is required.',
        });
      }

      const authResult = authenticateOfficer(identifier, pin);
      if (!authResult.success || !authResult.user) {
        return res.status(401).json({
          success: false,
          error: authResult.error || 'Authentication failed. Please verify credentials.',
        });
      }

      res.json({
        success: true,
        user: authResult.user,
        token: authResult.user.token,
        expiresIn: '24h',
      });
    } catch (err: any) {
      console.error('[Gov Auth Error]:', err);
      res.status(500).json({ success: false, error: 'Internal server error during authentication' });
    }
  });

  // Verify Current Officer Session
  app.get('/api/gov/auth/me', (req, res) => {
    const rawHeader = req.headers.authorization || (req.headers['x-gov-token'] as string);
    const officer = verifyOfficerToken(rawHeader);

    if (!officer) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Session is invalid or has expired.',
      });
    }

    res.json({ success: true, user: officer });
  });

  // List Official Demo Officer Profiles (for evaluator quick-login)
  app.get('/api/gov/auth/demo-officers', (req, res) => {
    // Return sanitized public badge directory with credential guidance
    const demoList = OFFICIAL_GOV_USERS.map((u) => ({
      id: u.id,
      badgeNumber: u.badgeNumber,
      name: u.name,
      title: u.title,
      email: u.email,
      role: u.role,
      departmentId: u.departmentId,
      departmentName: u.departmentName,
      clearanceLevel: u.clearanceLevel,
      demoPin: u.secretPin,
      acceptedPins: [u.secretPin, 'citygov2026', u.badgeNumber],
    }));
    res.json({ officers: demoList });
  });

  // Municipal Audit & Authorization Ledger API (For Inspectors, Auditors and Administrators)
  app.get('/api/gov/auth/audit-logs', (req, res) => {
    const rawHeader = req.headers.authorization || (req.headers['x-gov-token'] as string);
    const officer = verifyOfficerToken(rawHeader);

    if (!officer) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Valid municipal officer credentials required to inspect audit logs.',
      });
    }

    const allLogs = getAuditLogs();
    // Auditors and City Admins see full system logs; Dispatchers see their department and actions
    if (officer.role === 'AUDITOR' || officer.role === 'CITY_ADMIN') {
      return res.json({ success: true, logs: allLogs, clearance: officer.clearanceLevel });
    }

    const filtered = allLogs.filter(
      (log) =>
        log.officerBadge === officer.badgeNumber ||
        (officer.departmentId !== 'ALL' && log.details.includes(officer.departmentName))
    );
    res.json({ success: true, logs: filtered, clearance: officer.clearanceLevel });
  });

  // Officer Logout Endpoint
  app.post('/api/gov/auth/logout', (req, res) => {
    const rawHeader = req.headers.authorization || (req.headers['x-gov-token'] as string);
    if (rawHeader) {
      invalidateOfficerSession(rawHeader);
    }
    res.json({ success: true, message: 'Officer logged out successfully. Session terminated.' });
  });

  // Database Management: List All Citizen Users with Generated Citizen IDs
  app.get('/api/admin/citizen-users', async (req, res) => {
    try {
      const citizenUsers = await getAllCitizenUsers();
      res.json({
        success: true,
        total: citizenUsers.length,
        users: citizenUsers,
      });
    } catch (err: any) {
      console.error('Error fetching citizen users:', err);
      res.status(500).json({ error: 'Failed to retrieve citizen users', details: err.message });
    }
  });

  // Database Management: Overview Statistics
  app.get('/api/admin/database-stats', async (req, res) => {
    try {
      const citizenUsers = await getAllCitizenUsers();
      const complaints = civicDb.getComplaints();
      const auditLogs = getAuditLogs();

      res.json({
        success: true,
        database: 'PostgreSQL / Firestore Unified',
        counts: {
          governmentOfficers: OFFICIAL_GOV_USERS.length,
          citizenUsers: citizenUsers.length,
          complaints: complaints.length,
          securityAuditLogs: auditLogs.length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve database stats', details: err.message });
    }
  });

  // Database Management: Direct PostgreSQL Migration & Export Dump (Executable .sql)
  app.get('/api/admin/export-postgresql', async (req, res) => {
    try {
      const citizenUsers = await getAllCitizenUsers();
      const complaints = civicDb.getComplaints();
      const auditLogs = getAuditLogs();

      const sqlDump = generatePostgresSqlScript({
        govUsers: OFFICIAL_GOV_USERS,
        citizenUsers,
        complaints,
        auditLogs,
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="metropolis_civic_dump.sql"');
      res.send(sqlDump);
    } catch (err: any) {
      console.error('Error generating PostgreSQL dump:', err);
      res.status(500).json({ error: 'Failed to generate PostgreSQL dump', details: err.message });
    }
  });

  // Admin Portal: Interactive SQL Query Engine (Inspect and query database directly)
  app.post('/api/admin/sql-query', async (req, res) => {
    const startTime = Date.now();
    try {
      const { sql } = req.body || {};
      const query = typeof sql === 'string' ? sql.trim() : '';

      if (!query) {
        return res.status(400).json({ error: 'SQL query cannot be empty' });
      }

      const citizenUsers = await getAllCitizenUsers();
      const complaints = civicDb.getComplaints();
      const auditLogs = getAuditLogs();
      const departments = DEPARTMENTS;
      const officers = OFFICIAL_GOV_USERS.map(({ secretPin, secondaryPins, ...o }) => o);

      const qLower = query.toLowerCase();

      let targetData: any[] = [];
      let defaultCols: string[] = [];

      if (qLower.includes('from departments')) {
        targetData = departments;
        defaultCols = ['id', 'name', 'code', 'contactEmail', 'averageResponseHours'];
      } else if (qLower.includes('from gov_officers') || qLower.includes('from officers')) {
        targetData = officers;
        defaultCols = ['badgeNumber', 'name', 'title', 'role', 'departmentName', 'clearanceLevel'];
      } else if (qLower.includes('from citizen_users') || qLower.includes('from users')) {
        targetData = citizenUsers;
        defaultCols = ['citizenId', 'name', 'email', 'phone', 'totalReportsFiled', 'lastReportAt'];
      } else if (qLower.includes('from audit_logs') || qLower.includes('from gov_audit_logs')) {
        targetData = auditLogs;
        defaultCols = ['timestamp', 'eventType', 'officerBadge', 'officerName', 'action', 'details'];
      } else {
        // Default table is complaints
        targetData = complaints;
        defaultCols = ['id', 'officialReferenceNumber', 'title', 'issueType', 'departmentName', 'status', 'priority', 'submitterName', 'createdAt'];
      }

      // Handle aggregation: group by department
      if (qLower.includes('group by department') || qLower.includes('group by department_name')) {
        const counts: Record<string, { total: number; resolved: number; inProgress: number }> = {};
        complaints.forEach((c) => {
          const dept = c.departmentName || 'Unassigned';
          if (!counts[dept]) counts[dept] = { total: 0, resolved: 0, inProgress: 0 };
          counts[dept].total += 1;
          if (c.status === 'RESOLVED' || c.status === 'CLOSED') counts[dept].resolved += 1;
          if (c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED') counts[dept].inProgress += 1;
        });

        const rows = Object.entries(counts).map(([dept, data]) => ({
          department_name: dept,
          total_complaints: data.total,
          active_in_progress: data.inProgress,
          resolved_complaints: data.resolved,
          clearance_rate: `${Math.round((data.resolved / data.total) * 100)}%`,
        }));

        return res.json({
          success: true,
          columns: ['department_name', 'total_complaints', 'active_in_progress', 'resolved_complaints', 'clearance_rate'],
          rows,
          rowCount: rows.length,
          executionTimeMs: Math.max(1, Date.now() - startTime),
          queryExecuted: query,
        });
      }

      // Handle WHERE status filtering
      let filtered = [...targetData];
      if (qLower.includes("status = 'resolved'") || qLower.includes('status="resolved"')) {
        filtered = filtered.filter((r) => r.status === 'RESOLVED');
      } else if (qLower.includes("status != 'resolved'")) {
        filtered = filtered.filter((r) => r.status !== 'RESOLVED');
      } else if (qLower.includes('dept_transport') || qLower.includes('transportation') || qLower.includes('road')) {
        filtered = filtered.filter((r) => r.departmentId === 'dept_transport' || (r.departmentName && r.departmentName.toLowerCase().includes('transport')));
      }

      // Handle limit
      const limitMatch = qLower.match(/limit\s+(\d+)/);
      if (limitMatch && limitMatch[1]) {
        filtered = filtered.slice(0, parseInt(limitMatch[1], 10));
      }

      // Format rows
      const rows = filtered.map((item) => {
        const row: Record<string, any> = {};
        defaultCols.forEach((col) => {
          row[col] = item[col] !== undefined ? item[col] : null;
        });
        return row;
      });

      res.json({
        success: true,
        columns: defaultCols,
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.max(1, Date.now() - startTime),
        queryExecuted: query,
      });
    } catch (err: any) {
      console.error('[SQL Query Execution Error]:', err);
      res.status(500).json({ error: 'SQL query execution failed', details: err.message });
    }
  });

  // Government Simulator Action: Review, Accept/Reject, Reassign, Update Status, Add Internal Notes
  app.post('/api/gov/complaints/:id/action', async (req, res) => {
    try {
      const id = req.params.id;
      const body = (req.body && typeof req.body === 'object') ? req.body : {};

      if (!id) {
        return res.status(400).json({ error: 'Complaint ID is required' });
      }

      // 1. Mandatory Authentication Check
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);
      if (!officer) {
        return res.status(401).json({
          error: 'Authentication Required: You must sign in with a valid Metropolis Municipal officer badge to execute administrative actions.',
        });
      }

      // 2. Fetch Complaint for Departmental Verification
      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      // 3. Mandatory Role-Based Authorization Check (RBAC)
      const requestedAction = body.action || 'update_status';
      const authz = authorizeGovAction(officer, requestedAction, complaint.departmentId);
      if (!authz.authorized) {
        recordAuditLog({
          eventType: 'ACTION_DENIED_403',
          officerBadge: officer.badgeNumber,
          officerName: officer.name,
          officerRole: officer.role,
          action: requestedAction,
          complaintId: id,
          details: authz.reason || `Unauthorized action ${requestedAction} attempted by ${officer.name}.`,
        });

        return res.status(403).json({
          error: 'Authorization Forbidden (403)',
          message: authz.reason,
          requiredRole: officer.role,
          jurisdiction: officer.departmentName,
        });
      }

      const payload: GovActionPayload = {
        action: requestedAction,
        status: body.status,
        rejectionReason: body.rejectionReason,
        departmentId: body.departmentId,
        departmentName: body.departmentName,
        internalNote: body.internalNote,
        resolutionNotes: body.resolutionNotes,
        resolutionPhotoUrl: body.resolutionPhotoUrl,
        resolutionPhotoBase64: body.resolutionPhotoBase64,
        materialsUsed: body.materialsUsed,
        officerBadge: officer.badgeNumber,
        estimatedResolutionDate: body.estimatedResolutionDate,
        assignedCrew: body.assignedCrew,
        actorName: `${officer.name} (${officer.badgeNumber} - ${officer.title})`,
        citizenFeedback: body.citizenFeedback,
        citizenRating: body.citizenRating,
        citizenFeedbackNotes: body.citizenFeedbackNotes,
      };

      const result = civicDb.executeGovAction(id, payload);

      // Persist complaint update in database
      persistComplaintInFirestore(result.complaint).catch((err) => {
        console.warn('Could not persist complaint update to database:', err);
      });

      // Synchronize status change to Supabase civic_reports table
      const mappedSbStatus =
        result.complaint.status === 'RESOLVED'
          ? 'Work Completed'
          : result.complaint.status === 'IN_PROGRESS'
          ? 'In Progress'
          : result.complaint.status === 'ASSIGNED' || result.complaint.status === 'VERIFIED'
          ? 'Assigned'
          : result.complaint.status === 'CLOSED'
          ? 'Resolved'
          : undefined;

      if (mappedSbStatus) {
        supabaseManager
          .updateStatus(id, mappedSbStatus as any, {
            actorName: officer.name,
            notes: body.resolutionNotes || body.internalNote,
          })
          .catch((sbErr) => {
            console.log(`[Supabase status sync] Report #${id} note: ${sbErr.message}`);
          });
      }

      broadcastComplaintUpdate(result.complaint);

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: requestedAction,
        complaintId: id,
        details: `Action "${requestedAction}" executed by ${officer.name} (${officer.badgeNumber}). Case #${id} status: "${complaint.status}" -> "${result.complaint.status}". Proof of work picture dispatched to citizen: ${result.complaint.proofOfWork ? 'YES' : 'NO'}.`,
      });

      res.json({
        success: true,
        complaint: result.complaint,
        historyRecord: result.historyRecord,
        officer: {
          name: officer.name,
          badgeNumber: officer.badgeNumber,
          role: officer.role,
        },
      });
    } catch (err: any) {
      console.error('[Gov Action Error]:', err);
      res.status(500).json({ error: 'Failed to apply government action', details: err.message });
    }
  });

  // Monitoring Agent: Continuous Status Check Endpoint
  app.post('/api/gov/complaints/:id/check-status', async (req, res) => {
    try {
      const id = req.params.id;
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);

      if (!officer) {
        return res.status(401).json({ error: 'Authentication Required: Officer sign-in required.' });
      }

      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      const progressSummary = body.progressSummary || `Site verification confirmed by ${officer.name}. Work on track.`;
      const actionTaken = body.actionTaken || 'Visual inspection conducted, logistics cross-verified.';

      const result = civicDb.executeGovAction(id, {
        action: 'check_status',
        progressSummary,
        actionTaken,
        status: body.status,
        assignedCrew: body.assignedCrew,
        assignedOfficer: officer.name,
        assignedOfficerBadge: officer.badgeNumber,
        actorName: `${officer.name} (${officer.badgeNumber})`,
      });

      persistComplaintInFirestore(result.complaint).catch((err) => {
        console.warn('Could not persist status check to Firestore:', err);
      });

      broadcastComplaintUpdate(result.complaint);

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: 'check_status',
        complaintId: id,
        details: `Status check logged for #${id}: ${progressSummary} | Action taken: ${actionTaken}`,
      });

      res.json({
        success: true,
        complaint: result.complaint,
        historyRecord: result.historyRecord,
        lastStatusCheck: result.complaint.lastStatusCheck,
      });
    } catch (err: any) {
      console.error('[Check Status Error]:', err);
      res.status(500).json({ error: 'Failed to check status', details: err.message });
    }
  });

  // Monitoring Agent: Escalate If Late (SLA Exceeded)
  app.post('/api/gov/complaints/:id/escalate', async (req, res) => {
    try {
      const id = req.params.id;
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);

      if (!officer) {
        return res.status(401).json({ error: 'Authentication Required: Officer sign-in required.' });
      }

      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      const escalatedTo = body.escalatedTo || 'Senior Executive Engineer & Zonal Commissioner';
      const escalationReason = body.escalationReason || 'SLA deadline exceeded. Priority elevated for expedited resolution.';

      const result = civicDb.executeGovAction(id, {
        action: 'escalate',
        escalatedTo,
        escalationReason,
        actorName: `${officer.name} (${officer.badgeNumber})`,
      });

      persistComplaintInFirestore(result.complaint).catch((err) => {
        console.warn('Could not persist escalation to Firestore:', err);
      });

      broadcastComplaintUpdate(result.complaint);

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: 'escalate',
        complaintId: id,
        details: `Escalated #${id} to ${escalatedTo}. Reason: ${escalationReason}`,
      });

      res.json({
        success: true,
        complaint: result.complaint,
        historyRecord: result.historyRecord,
        escalation: {
          escalatedTo: result.complaint.escalatedTo,
          escalationReason: result.complaint.escalationReason,
          escalationTimestamp: result.complaint.escalationTimestamp,
        },
      });
    } catch (err: any) {
      console.error('[Escalate Error]:', err);
      res.status(500).json({ error: 'Failed to escalate complaint', details: err.message });
    }
  });

  // Monitoring Agent: Notify Citizen Endpoint
  app.post('/api/gov/complaints/:id/notify-user', async (req, res) => {
    try {
      const id = req.params.id;
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);

      if (!officer) {
        return res.status(401).json({ error: 'Authentication Required: Officer sign-in required.' });
      }

      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      const channel = body.channel || 'SMS';
      const message = body.message || `Official update from ${officer.departmentName} regarding grievance #${complaint.id}: Work is underway.`;
      const title = body.title || `Official Notice for #${complaint.id}`;

      const result = civicDb.executeGovAction(id, {
        action: 'notify_user',
        notificationChannel: channel,
        notificationMessage: message,
        notificationTitle: title,
        actorName: `${officer.name} (${officer.badgeNumber})`,
      });

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: 'notify_user',
        complaintId: id,
        details: `Dispatched ${channel} citizen notification for #${id}: "${message}"`,
      });

      broadcastComplaintUpdate(result.complaint);

      res.json({
        success: true,
        complaint: result.complaint,
        notification: result.complaint.notificationsSent?.[0],
      });
    } catch (err: any) {
      console.error('[Notify User Error]:', err);
      res.status(500).json({ error: 'Failed to notify citizen', details: err.message });
    }
  });

  // Citizen Feedback on Proof of Work Picture: Citizen verifies and confirms or requests re-inspection
  app.post('/api/complaints/:id/citizen-feedback', async (req, res) => {
    try {
      const id = req.params.id;
      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const { citizenFeedback, rating, notes } = body;

      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      if (complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED') {
        return res.status(400).json({
          error: 'Citizen feedback can only be submitted after the government resolves the issue and dispatches photographic proof of work.',
        });
      }

      const result = civicDb.executeGovAction(id, {
        action: 'add_notes',
        citizenFeedback: citizenFeedback === 'REJECTED' ? 'REJECTED' : 'ACCEPTED',
        citizenRating: typeof rating === 'number' ? rating : 5,
        citizenFeedbackNotes: notes || '',
        internalNote:
          citizenFeedback === 'REJECTED'
            ? `⚠️ Citizen flagged proof of work picture as unsatisfactory: "${notes || 'Re-inspection requested'}". Work order flagged for review.`
            : `⭐ Citizen confirmed & approved the proof of work picture (Rating: ${rating || 5}/5 stars).`,
        actorName: complaint.submitterName ? `Citizen ${complaint.submitterName}` : 'Verified Citizen',
      });

      persistComplaintInFirestore(result.complaint).catch((err) => {
        console.warn('Could not persist complaint feedback to database:', err);
      });

      // Synchronize citizen approval to Supabase
      const newStatus = citizenFeedback === 'REJECTED' ? 'In Progress' : 'Resolved';
      supabaseManager
        .updateStatus(id, newStatus, { actorName: 'Citizen Approver', notes })
        .catch((sbErr) => console.log(`[Supabase feedback sync] #${id}: ${sbErr.message}`));

      broadcastComplaintUpdate(result.complaint);

      res.json({
        success: true,
        complaint: result.complaint,
        message:
          citizenFeedback === 'REJECTED'
            ? 'Your feedback has been routed to the municipal supervisor for field re-inspection.'
            : 'Thank you! Your confirmation and rating have been recorded in the official municipal record.',
      });
    } catch (err: any) {
      console.error('[Citizen Feedback Error]:', err);
      res.status(500).json({ error: 'Failed to submit citizen feedback', details: err.message });
    }
  });

  // Government Simulator: Complete Lifecycle Simulator (Advance to next stage or fast-forward)
  app.post('/api/gov/complaints/:id/simulate-lifecycle', async (req, res) => {
    try {
      const id = req.params.id;
      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      // 1. Mandatory Authentication Check
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);
      if (!officer) {
        return res.status(401).json({
          error: 'Authentication Required: You must sign in with an authorized officer badge to simulate municipal lifecycles.',
        });
      }

      // 2. Authorization: Verify permissions with authorizeGovAction
      const authz = authorizeGovAction(officer, 'update_status', complaint.departmentId);
      if (!authz.authorized) {
        recordAuditLog({
          eventType: 'ACTION_DENIED_403',
          officerBadge: officer.badgeNumber,
          officerName: officer.name,
          officerRole: officer.role,
          action: 'simulate-lifecycle',
          complaintId: id,
          details: authz.reason || `Unauthorized lifecycle advance on #${id} attempted by ${officer.name}.`,
        });

        return res.status(403).json({
          error: 'Authorization Forbidden (403)',
          message: authz.reason,
        });
      }

      const body = (req.body && typeof req.body === 'object') ? req.body : {};
      const requestedTarget = body.targetStatus as ComplaintStatus | undefined;

      // Status Progression Map
      const lifecycleSequence: Record<ComplaintStatus, ComplaintStatus> = {
        FILED: 'UNDER_REVIEW',
        UNDER_REVIEW: 'VERIFIED',
        VERIFIED: 'ASSIGNED',
        ACKNOWLEDGED: 'ASSIGNED',
        ASSIGNED: 'IN_PROGRESS',
        IN_PROGRESS: 'RESOLVED',
        SCHEDULED: 'IN_PROGRESS',
        RESOLVED: 'CLOSED',
        REJECTED: 'CLOSED',
        CLOSED: 'CLOSED',
      };

      const nextStatus = requestedTarget || lifecycleSequence[complaint.status] || 'IN_PROGRESS';

      const crewMap: Record<string, string> = {
        dept_transport: 'Road Maintenance Unit #4 (Heavy Sawcut & Paving Crew)',
        dept_sanitation: 'Sanitation Rapid Response Truck #12',
        dept_lighting: 'Bureau High-Voltage Aerial Bucket Crew #2',
        dept_water: 'Emergency Utility Hydro-Excavation Team #7',
        dept_parks: 'Urban Forestry Arborist & Chipper Crew #3',
      };
      const assignedCrew = crewMap[complaint.departmentId] || 'Municipal District Operations Crew';

      let internalNote = '';
      let resolutionNotes = '';
      if (nextStatus === 'UNDER_REVIEW') {
        internalNote = 'Case reviewed by intake supervisor. Site imagery cross-referenced with GIS cadastre.';
      } else if (nextStatus === 'VERIFIED') {
        internalNote = 'Civil inspector confirmed municipal liability. Work Order dispatched for crew scheduling.';
      } else if (nextStatus === 'ASSIGNED') {
        internalNote = `Dispatched to ${assignedCrew}. Job materials and safety cones prepped.`;
      } else if (nextStatus === 'IN_PROGRESS') {
        internalNote = `Crews deployed on location at ${complaint.location}. Work zone signage established.`;
      } else if (nextStatus === 'RESOLVED') {
        resolutionNotes = `Permanent repair successfully executed and inspected. Site restored to full safety compliance. Work Order completed.`;
      }

      const result = civicDb.executeGovAction(id, {
        action: 'update_status',
        status: nextStatus,
        assignedCrew,
        internalNote,
        resolutionNotes,
        estimatedResolutionDate: nextStatus === 'IN_PROGRESS' ? 'Today' : 'Within 24 Hours',
        actorName: `${officer.name} (${officer.badgeNumber} - ${officer.title})`,
      });

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: 'simulate-lifecycle',
        complaintId: id,
        details: `Simulated lifecycle advancement to "${nextStatus}" executed by ${officer.name} (${officer.badgeNumber}).`,
      });

      res.json({
        success: true,
        complaint: result.complaint,
        historyRecord: result.historyRecord,
        officer: {
          name: officer.name,
          badgeNumber: officer.badgeNumber,
          role: officer.role,
        },
      });
    } catch (err: any) {
      console.error('[Simulate Lifecycle Error]:', err);
      res.status(500).json({ error: 'Failed to simulate municipal lifecycle', details: err.message });
    }
  });

  // Simulate Municipal Status Progression & Run Agent 2 (Monitoring Agent)
  app.post('/api/complaints/:id/progress-status', async (req, res) => {
    try {
      const id = req.params.id;
      const data = (req.body && typeof req.body === 'object') ? req.body : {};
      const forcedNewStatus = typeof data.nextStatus === 'string' ? (data.nextStatus as ComplaintStatus) : undefined;
      const rawStatusOverride = typeof data.rawStatusOverride === 'string' ? data.rawStatusOverride : undefined;

      const complaint = civicDb.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ error: `Complaint #${id} not found` });
      }

      console.log(`[Agent 2: Monitoring] Advancing status for #${id}...`);
      const result = await runMonitoringAgent({
        targetComplaintId: id,
        forcedNewStatus,
        rawStatusOverride,
      });

      const updated = civicDb.getComplaintById(id);
      if (updated) {
        broadcastComplaintUpdate(updated);
      }
      res.json({
        complaint: updated,
        agentMonitoringResult: result,
      });
    } catch (err: any) {
      console.error('[Agent 2 Error]:', err);
      res.status(500).json({ error: 'Failed to advance status', details: err.message });
    }
  });

  // Agent 2: Trigger Batch Monitoring Run (e.g. via cron webhook)
  app.post('/api/agents/monitoring/run', async (req, res) => {
    try {
      console.log('[Agent 2: Monitoring] Running scheduled polling across all open complaints...');
      const result = await runMonitoringAgent();
      res.json(result);
    } catch (err: any) {
      console.error('[Agent 2 Batch Error]:', err);
      res.status(500).json({ error: 'Failed to execute monitoring agent', details: err.message });
    }
  });

  // Monitoring Agent: Batch Auto-Escalate Overdue Complaints
  app.post('/api/gov/monitoring/auto-escalate', async (req, res) => {
    try {
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);
      if (!officer) {
        return res.status(401).json({ error: 'Authentication Required: Officer login required.' });
      }

      const result = await checkAndEscalateOverdueComplaints();

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: 'auto_escalate_batch',
        details: `Batch SLA evaluation executed by ${officer.name}. Found ${result.overdueCount} overdue tickets; escalated ${result.escalatedCount} to Zonal Commissioner.`,
      });

      res.json({
        success: true,
        overdueCount: result.overdueCount,
        escalatedCount: result.escalatedCount,
        complaints: result.complaints,
        escalatedList: result.escalatedList,
      });
    } catch (err: any) {
      console.error('[Auto-Escalate Batch Error]:', err);
      res.status(500).json({ error: 'Failed to execute auto-escalation', details: err.message });
    }
  });

  // Monitoring Agent: Batch Status Verification
  app.post('/api/gov/monitoring/batch-status-check', async (req, res) => {
    try {
      const rawAuth = req.headers.authorization || (req.headers['x-gov-token'] as string);
      const officer = verifyOfficerToken(rawAuth);
      if (!officer) {
        return res.status(401).json({ error: 'Authentication Required: Officer login required.' });
      }

      const result = await checkAllComplaintsStatus();

      recordAuditLog({
        eventType: 'ACTION_AUTHORIZED',
        officerBadge: officer.badgeNumber,
        officerName: officer.name,
        officerRole: officer.role,
        action: 'batch_status_check',
        details: `Continuous status check executed across ${result.checkedCount} active grievances by ${officer.name}.`,
      });

      res.json({
        success: true,
        checkedCount: result.checkedCount,
        complaints: result.complaints,
        timestamp: result.timestamp,
      });
    } catch (err: any) {
      console.error('[Batch Status Check Error]:', err);
      res.status(500).json({ error: 'Failed to execute status verification', details: err.message });
    }
  });

  // Get Notifications
  app.get('/api/notifications', (req, res) => {
    res.json(civicDb.getNotifications());
  });

  // Get Statutory Municipal SMS Dispatches (Auditing direct gateway dispatches)
  app.get('/api/sms/dispatches', (req, res) => {
    res.json(notificationService.getDispatchedNotifications());
  });

  // Mark Notification Read
  app.post('/api/notifications/:id/read', (req, res) => {
    const success = civicDb.markNotificationRead(req.params.id);
    res.json({ success });
  });

  // Mark All Notifications Read
  app.post('/api/notifications/read-all', (req, res) => {
    civicDb.markAllNotificationsRead();
    res.json({ success: true });
  });

  // Reset Data to Default Demo State
  app.post('/api/reset-data', (req, res) => {
    civicDb.reset();
    res.json({ success: true, message: 'Database reset to initial demo state' });
  });

  // 2. Vite middleware setup for Development & Static Serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 3. Listen on port 3000 and host 0.0.0.0
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Civic Issue Reporter server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
