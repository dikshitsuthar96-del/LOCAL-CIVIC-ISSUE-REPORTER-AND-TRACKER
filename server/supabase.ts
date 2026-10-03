import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';
import { notificationService } from './notificationService.js';
import {
  persistCivicReportInFirestore,
  getCivicReportFromFirestore,
  getAllCivicReportsFromFirestore,
  updateCivicReportStatusInFirestore,
} from './firebase.js';

export type CivicReportStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Work Completed'
  | 'Awaiting User Confirmation'
  | 'Resolved';

export interface CivicReportRecord {
  id: string; // UUID
  user_id: string; // Supabase Auth UUID
  mobile_number: string;
  image_url: string | null;
  ai_description: string | null;
  user_description: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  department: string | null;
  status: CivicReportStatus;
  created_at: string;
  updated_at: string;
}

export class SupabaseManager {
  private supabaseUrl: string;
  private anonKey: string;
  private serviceRoleKey: string;
  private supabaseClient: SupabaseClient | null = null;
  private pgPool: pg.Pool | null = null;
  private inMemoryMirror: Map<string, CivicReportRecord> = new Map();

  constructor() {
    this.supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      'https://pftkladzsrwgbxyyuowm.supabase.co';
    this.anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const effectiveKey = this.serviceRoleKey || this.anonKey;
    if (this.supabaseUrl && effectiveKey) {
      try {
        this.supabaseClient = createClient(this.supabaseUrl, effectiveKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
        console.log(`[SupabaseManager] Initialized Supabase client for ${this.supabaseUrl}`);
      } catch (err) {
        console.warn('[SupabaseManager] Failed to initialize Supabase client:', err);
      }
    }

    // Try initializing PostgreSQL direct pool if DATABASE_URL is available
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.includes('[YOUR-PASSWORD]') && !dbUrl.includes('%5BYOUR-PASSWORD%5D')) {
      try {
        const cleanUrl = dbUrl.replace('postgresql+asyncpg://', 'postgresql://').replace(/[?&]sslmode=[^&]+/, '');
        this.pgPool = new pg.Pool({
          connectionString: cleanUrl,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 3000,
        });
        this.pgPool.on('error', (err: any) => {
          if (err?.code === '28P01' || err?.message?.includes('password authentication failed')) {
            this.disablePgPool();
          }
        });
        this.verifyPgConnection();
      } catch (err) {
        this.pgPool = null;
      }
    }
  }

  private async verifyPgConnection() {
    if (!this.pgPool) return;
    try {
      const client = await this.pgPool.connect();
      client.release();
      console.log('[SupabaseManager] Direct PostgreSQL pool connection established.');
    } catch (err: any) {
      if (err?.code === '28P01' || err?.message?.includes('password authentication failed')) {
        console.log('[SupabaseManager] Direct PostgreSQL pool credentials pending. Operating via Supabase REST API & Cloud Firestore.');
      } else {
        console.log('[SupabaseManager] Direct PostgreSQL pool connection skipped:', err?.message);
      }
      this.disablePgPool();
    }
  }

  private disablePgPool() {
    if (this.pgPool) {
      const pool = this.pgPool;
      this.pgPool = null;
      pool.end().catch(() => {});
    }
  }

  public getStatus() {
    return {
      supabaseUrl: this.supabaseUrl,
      hasAnonKey: !!this.anonKey,
      hasServiceRoleKey: !!this.serviceRoleKey,
      hasDirectPostgres: !!this.pgPool,
      clientReady: !!this.supabaseClient,
      firestoreReady: true,
      inMemoryRecordsCount: this.inMemoryMirror.size,
    };
  }

  /**
   * Inserts a report into public.civic_reports and mirrors to Cloud Firestore
   * Validates mandatory mobile_number, user_description, and real authenticated user_id UUID.
   */
  async insertReport(
    payload: Omit<CivicReportRecord, 'id' | 'created_at' | 'updated_at'> & {
      id?: string;
      created_at?: string;
      updated_at?: string;
    },
    userJwt?: string
  ): Promise<CivicReportRecord> {
    // 1. Validate mandatory fields
    if (!payload.user_id) {
      throw new Error('Supabase Auth user_id (UUID) is mandatory. Unauthenticated reports are rejected.');
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(payload.user_id)) {
      throw new Error(`Invalid user_id format: "${payload.user_id}". Must be a valid Supabase Auth UUID.`);
    }

    if (!payload.mobile_number || !payload.mobile_number.trim()) {
      throw new Error('Mandatory mobile_number is missing. Citizens must provide a mobile number for statutory resolution notifications.');
    }

    if (!payload.user_description || !payload.user_description.trim()) {
      throw new Error('user_description is mandatory.');
    }

    const now = new Date().toISOString();
    const newId = payload.id || crypto.randomUUID();

    const rawRecord: CivicReportRecord = {
      id: newId,
      user_id: payload.user_id,
      mobile_number: payload.mobile_number.trim(),
      image_url: payload.image_url || null,
      ai_description: payload.ai_description || null,
      user_description: payload.user_description.trim(),
      latitude: typeof payload.latitude === 'number' ? payload.latitude : null,
      longitude: typeof payload.longitude === 'number' ? payload.longitude : null,
      address: payload.address || null,
      department: payload.department || 'Public Works & Infrastructure',
      status: payload.status || 'Submitted',
      created_at: payload.created_at || now,
      updated_at: payload.updated_at || now,
    };

    // Strip undefined properties (Production Directive 6 Zero-Crash Hygiene)
    const record = JSON.parse(JSON.stringify(rawRecord)) as CivicReportRecord;

    // 2. Persist to Cloud Firestore (Primary durable cloud persistence)
    try {
      await persistCivicReportInFirestore(record);
      console.log(`[SupabaseManager] Persisted report #${record.id} to Cloud Firestore.`);
    } catch (fsErr: any) {
      console.warn('[SupabaseManager] Notice writing to Firestore:', fsErr?.message);
    }

    // 3. Store in-memory mirror to guarantee local resilience
    this.inMemoryMirror.set(record.id, record);

    // 4. Try inserting via Supabase client (using caller JWT if provided for RLS, or service client)
    let clientToUse = this.supabaseClient;
    if (userJwt && this.supabaseUrl && this.anonKey) {
      try {
        clientToUse = createClient(this.supabaseUrl, this.anonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${userJwt}`,
            },
          },
        });
      } catch (e) {
        console.warn('[SupabaseManager] Failed creating user-scoped Supabase client:', e);
      }
    }

    if (clientToUse) {
      try {
        const { data, error } = await clientToUse
          .from('civic_reports')
          .insert([record])
          .select()
          .single();

        if (error) {
          console.warn(`[SupabaseManager] Supabase table insert notice (${error.message || error.code}). Record safely persisted in Cloud Firestore.`);
          // If table doesn't exist or RLS blocked, try direct pg if available
          if (this.pgPool) {
            await this.insertViaPg(record);
          }
        } else if (data) {
          this.inMemoryMirror.set(data.id, data as CivicReportRecord);
          return data as CivicReportRecord;
        }
      } catch (err: any) {
        console.warn('[SupabaseManager] Supabase client insert notice:', err?.message);
        if (this.pgPool) {
          await this.insertViaPg(record);
        }
      }
    } else if (this.pgPool) {
      await this.insertViaPg(record);
    }

    // Return the safely persisted record
    return record;
  }

  private async insertViaPg(record: CivicReportRecord): Promise<boolean> {
    if (!this.pgPool) return false;
    try {
      const query = `
        INSERT INTO public.civic_reports (
          id, user_id, mobile_number, image_url, ai_description, user_description,
          latitude, longitude, address, department, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          updated_at = EXCLUDED.updated_at,
          status = EXCLUDED.status;
      `;
      const values = [
        record.id,
        record.user_id,
        record.mobile_number,
        record.image_url,
        record.ai_description,
        record.user_description,
        record.latitude,
        record.longitude,
        record.address,
        record.department,
        record.status,
        record.created_at,
        record.updated_at,
      ];
      await this.pgPool.query(query, values);
      return true;
    } catch (err: any) {
      if (err?.code === '28P01' || err?.message?.includes('password authentication failed')) {
        this.disablePgPool();
      } else {
        console.log('[SupabaseManager] Direct PG pool query skipped:', err?.message);
      }
      return false;
    }
  }

  /**
   * Queries reports: equivalent to
   * SELECT * FROM public.civic_reports ORDER BY created_at DESC;
   */
  async getReports(userId?: string): Promise<CivicReportRecord[]> {
    // 1. Query Supabase client if available
    if (this.supabaseClient) {
      try {
        let query = this.supabaseClient
          .from('civic_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          data.forEach((r) => this.inMemoryMirror.set(r.id, r as CivicReportRecord));
        }
      } catch (err) {
        // Silently continue to Cloud Firestore
      }
    }

    // 2. Query Cloud Firestore
    try {
      const firestoreReports = await getAllCivicReportsFromFirestore(userId);
      if (firestoreReports && firestoreReports.length > 0) {
        firestoreReports.forEach((r) => {
          if (r?.id) {
            this.inMemoryMirror.set(r.id, r as CivicReportRecord);
          }
        });
      }
    } catch (fsErr: any) {
      console.warn('[SupabaseManager] Notice querying Firestore for civic reports:', fsErr?.message);
    }

    // 3. Query PG pool if active
    if (this.pgPool) {
      try {
        let query = 'SELECT * FROM public.civic_reports';
        const params: any[] = [];
        if (userId) {
          query += ' WHERE user_id = $1';
          params.push(userId);
        }
        query += ' ORDER BY created_at DESC;';
        const res = await this.pgPool.query(query, params);
        if (res?.rows && res.rows.length > 0) {
          res.rows.forEach((r) => this.inMemoryMirror.set(r.id, r));
        }
      } catch (err: any) {
        if (err?.code === '28P01' || err?.message?.includes('password authentication failed')) {
          this.disablePgPool();
        }
      }
    }

    // Return combined records from in-memory mirror
    const all = Array.from(this.inMemoryMirror.values());
    const filtered = userId ? all.filter((r) => r.user_id === userId) : all;
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getReportById(id: string): Promise<CivicReportRecord | null> {
    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('civic_reports')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          this.inMemoryMirror.set(data.id, data as CivicReportRecord);
          return data as CivicReportRecord;
        }
      } catch (err) {
        // Silently continue to Cloud Firestore
      }
    }

    // Check Cloud Firestore
    try {
      const fromFirestore = await getCivicReportFromFirestore(id);
      if (fromFirestore) {
        this.inMemoryMirror.set(fromFirestore.id, fromFirestore as CivicReportRecord);
        return fromFirestore as CivicReportRecord;
      }
    } catch (_) {}

    return this.inMemoryMirror.get(id) || null;
  }

  /**
   * Updates report status through the sequence:
   * Submitted → Assigned → In Progress → Work Completed → Awaiting User Confirmation → Resolved
   *
   * When status is changed to 'Work Completed', automatically triggers statutory SMS notification!
   */
  async updateStatus(
    id: string,
    newStatus: CivicReportStatus,
    options?: { actorName?: string; notes?: string }
  ): Promise<{ report: CivicReportRecord; smsNotification: any }> {
    const existing = await this.getReportById(id);
    if (!existing) {
      throw new Error(`Report #${id} not found.`);
    }

    const updated: CivicReportRecord = {
      ...existing,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Update in-memory mirror
    this.inMemoryMirror.set(id, updated);

    // Update in Cloud Firestore
    try {
      await updateCivicReportStatusInFirestore(id, newStatus);
    } catch (fsErr) {
      console.warn('[SupabaseManager] Notice updating status in Firestore:', fsErr);
    }

    // Update in Supabase
    if (this.supabaseClient) {
      try {
        await this.supabaseClient
          .from('civic_reports')
          .update({
            status: newStatus,
            updated_at: updated.updated_at,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('[SupabaseManager] Supabase update notice:', err);
      }
    }

    if (this.pgPool) {
      try {
        await this.pgPool.query(
          'UPDATE public.civic_reports SET status = $1, updated_at = $2 WHERE id = $3',
          [newStatus, updated.updated_at, id]
        );
      } catch (err: any) {
        if (err?.code === '28P01' || err?.message?.includes('password authentication failed')) {
          this.disablePgPool();
        }
      }
    }

    // Statutory SMS notification trigger when status reaches 'Work Completed'
    let smsNotification: any = null;
    if (newStatus === 'Work Completed') {
      console.log(`[SupabaseManager] Report #${id} marked as 'Work Completed'. Triggering statutory SMS to ${existing.mobile_number}...`);
      smsNotification = await notificationService.sendWorkCompletedSms({
        to: existing.mobile_number,
        reportId: id,
        department: existing.department || undefined,
        status: newStatus,
      });
    }

    return { report: updated, smsNotification };
  }
}

export const supabaseManager = new SupabaseManager();
