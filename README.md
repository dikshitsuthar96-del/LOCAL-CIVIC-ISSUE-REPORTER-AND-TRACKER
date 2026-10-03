# Local Civic Issue Reporter and Tracker

## Technology Stack Specification

The system is architected strictly according to the municipal enterprise specification:

| Layer | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Language** | **Python 3.10+** | Modern typed asynchronous Python backend with Pydantic v2 data contracts |
| **Backend** | **FastAPI** | Asynchronous REST API with OpenAPI/Swagger docs, dependency injection, and CORS |
| **Agent Framework** | **LangGraph** | Multi-agent DAG (`StateGraph`) with typed state, conditional edges, and execution tracing |
| **LLM Engine** | **Google Gemini** | Powered exclusively via `GEMINI_API_KEY` using `gemini-3.8-flash` & `gemini-flash-latest` with structured JSON output parsing |
| **Database** | **PostgreSQL 16** | Relational schema with SQLAlchemy 2.0 Async, connection pooling (`asyncpg`), and foreign key cascades |
| **Frontend** | **React / Next.js** | Tailored municipal portal with TypeScript, Tailwind CSS, Lucide icons, and responsive desktop/mobile UI |

---

An enterprise-grade, full-stack municipal issue reporting and lifecycle tracking platform architected with two clearly separated applications sharing a unified civic data layer:

1. **Citizen Public Portal** (`metropolis.gov/report-issue`):
   - **Official Government Banner**: Displays standard federal/state municipal banner explaining official `.gov` and HTTPS verification.
   - **Photo Upload & Pre-Submission Inspection**: Citizens upload photos of potholes, streetlight outages, or civic defects and immediately view AI multimodal findings (detected problem, severity, suggested department, safety hazards).
   - **Review & Submission**: Citizens review the detected issue, customize description/location, and submit an official municipal complaint.
   - **Confirmation & Reference ID**: Citizens receive an official Complaint ID (`CIVIC-2026-XXXX`) and Work Order Reference Number (`WO-DOT-2026-XXXX`).
   - **Dedicated Status Tracking**: Citizens enter their Reference ID to track live repair milestones, assigned crews, target ETAs, and verified resolution certificates without exposure to internal government back-office complexity.

2. **Government Department Simulator** (`Metropolis Municipal Intranet & Dispatch Command`):
   - **Official Government Website UI**: Built with authentic public-sector design standards—deep navy municipal headers, official city seals, statutory confidentiality notices, and high-contrast structured dossiers.
   - **Authentication & Role-Based Access Control (RBAC)**: Secured gateway requiring Municipal Badge Number or City Email + PIN. Includes 1-click evaluator role switching across 4 distinct security tiers:
     - `CITY_ADMIN`: Universal executive authority across all municipal departments.
     - `DEPT_DISPATCHER`: Full administrative control bounded strictly to assigned department jurisdiction.
     - `FIELD_SUPERVISOR`: Can update field progress, dispatch units, and record resolution proof; prohibited from rejecting cases.
     - `AUDITOR`: Independent oversight account with strictly read-only access (mutation attempts return HTTP 403 Forbidden).
   - **Evidence & Dossier Inspection**: Dispatchers review high-res photo evidence, citizen statements, and multimodal vision findings.
   - **Triage & Decision**: Accept/verify complaints or reject them with documented statutory justification.
   - **Department Reassignment**: Transfer jurisdiction across city departments (Transportation, Sanitation, Street Lighting, Water & Sewer, Parks & Forestry).
   - **Lifecycle Status & Field Dispatch**: Update complaint status (`Submitted` &rarr; `Under Review` &rarr; `Verified` &rarr; `Assigned` &rarr; `In Progress` &rarr; `Resolved`), assign field crews, set target ETAs, record internal case logs, and certify physical resolution proof.
   - **Immediate Citizen Reflection**: Updates made in the Government Simulator immediately synchronize and reflect when a citizen checks their Reference ID in the Citizen Portal.
   - **1-Click Full Lifecycle Simulation**: Built-in fast-forward buttons allow evaluators to simulate the entire lifecycle from intake to resolution in seconds.

3. **Universal End-to-End Workflow Guide**:
   - Built-in interactive 7-stage architecture modal accessible from any screen with direct 1-click jumps to each stage of the lifecycle.

---

## 1. System Architecture & End-to-End Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Universal Application Switcher                  │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
       ┌─────────────────────────┐      ┌─────────────────────────┐
       │   Citizen Public Portal │      │  Government Simulator   │
       │   • Official .gov banner│      │  • Badge Auth & RBAC    │
       │   • Image Upload        │      │  • Incoming Queue & SLA │
       │   • AI Vision Inspection│      │  • Evidence Review      │
       │   • Complaint Intake    │      │  • Accept / Reject      │
       │   • Reference ID Receipt│      │  • Department Reassign  │
       │   • Live Status Tracker │      │  • Status Progression   │
       └────────────┬────────────┘      │  • Field Dispatch & ETA │
                    │                   │  • Resolution Proof     │
                    │                   └────────────┬────────────┘
                    │                                │
                    ▼                                ▼
   ┌───────────────────────────────────────────────────────────────────────┐
   │                       Unified Full-Stack Express Server               │
   │   ├─ POST /api/analyze-image          (Pre-Submission Vision Inspect) │
   │   ├─ POST /api/complaints/submit      (Agent 1 Intake Graph Pipeline) │
   │   ├─ GET  /api/complaints/:id         (Citizen Status Lookup API)     │
   │   ├─ POST /api/gov/auth/login         (Badge Authentication & JWT)    │
   │   ├─ GET  /api/gov/auth/demo-officers (Pre-Seeded RBAC Directory)     │
   │   ├─ POST /api/gov/complaints/:id/action (RBAC-Guarded Decision API)  │
   │   ├─ POST /api/gov/complaints/:id/simulate-lifecycle (Fast-Forward)   │
   │   └─ POST /api/agents/monitoring/run  (Agent 2 Background Monitor)    │
   └───────────────────────────────────┬───────────────────────────────────┘
                                       │
                       ┌───────────────┴───────────────┐
                       ▼                               ▼
            ┌──────────────────────┐        ┌─────────────────────────┐
            │ Gemini API Fallback  │        │ Civic Database Store    │
            │ Ladder               │        │ (In-memory mockable/    │
            │ • gemini-3.6-flash   │        │  PostgreSQL/Firestore   │
            │ • gemini-3.1-lite    │        │  ready adapter)         │
            │ • gemini-flash-latest│        └─────────────────────────┘
            │ • gemini-3.7-flash   │
            └──────────────────────┘
```

### 7-Stage End-to-End Municipal Lifecycle

1. **Citizen Photo Capture & Multimodal Vision Analysis**: Citizen uploads photo; Gemini extracts category, severity, and public safety hazards.
2. **Citizen Review & Formal Complaint Intake**: Citizen verifies AI findings, enters street location, and submits. Agent 1 runs the 6-node intake graph (`classify_image` &rarr; `validate_with_text` &rarr; `determine_department` &rarr; `draft_complaint` &rarr; `submit_complaint` &rarr; `notify_user`).
3. **Official Reference ID & Work Order Generation**: System generates Citizen Case ID (`CIVIC-2026-XXXX`) and Department Work Order (`WO-DOT-2026-XXXX`) with department SLA.
4. **Government Authentication & Role-Based Authorization (RBAC)**: Municipal officer authenticates via badge credentials; server verifies role and department scope before allowing mutations.
5. **Department Triage, Evidence Review & Jurisdiction**: Dispatcher inspects high-res photo and AI findings; accepts work order, transfers department jurisdiction, or issues statutory rejection.
6. **Field Crew Assignment & Resolution Proof**: Assigns maintenance crew (e.g. `Road Unit #4`), sets completion ETA, and logs certified physical repair notes.
7. **Autonomous Monitoring & Citizen Reflection**: Agent 2 detects status transitions, translates technical codes into plain language, and updates the public Citizen Portal in real time.

---

## 2. Agentic Threat Model & Security Controls

| Threat Zone | Identified Attack Vector | Countermeasure / Security Control |
| :--- | :--- | :--- |
| **1. Input Surfaces** | Malicious photo payloads, prompt injection in citizen description, badge credential brute forcing | Strict MIME type validation (`image/jpeg`, `image/png`, `image/webp`), 10MB payload size limits, text sanitization, and structured credential validation. |
| **2. Planning & Reasoning** | Adversarial jailbreaks attempting to hijack agent routing or alter municipal priority | Delimited system instructions treating citizen text strictly as untrusted observation data; deterministic fallback classification schema. |
| **3. Tool Execution & RBAC** | Privilege escalation by field staff or auditors trying to modify complaints outside their role or department | Strict server-side RBAC middleware (`govAuth.ts`): tokens cryptographically verified; Auditors receive HTTP 403 on mutations; Dispatchers locked to assigned department. |
| **4. Memory & State** | Cross-tenant data leaks, unauthorized status tampering | Validated endpoints; simulated status progression enforces valid finite-state machine transitions (`FILED` &rarr; `RESOLVED`). |
| **5. Inter-System Communication** | Gemini API key leakage, man-in-the-middle credential capture | Keys stored exclusively in server environment variables or Google Cloud Secret Manager; zero client-side exposure. |

---

## 3. Environment & Prerequisites

1. **Node.js**: v20.x or higher
2. **Google Cloud SDK (`gcloud`)**: Configured and authenticated
3. **Google Cloud Project**: With billing enabled
4. **Required GCP APIs**:
   ```bash
   gcloud services enable \
     run.googleapis.com \
     secretmanager.googleapis.com \
     firestore.googleapis.com
   ```

---

## 4. Secret Management Setup (Google Cloud Secret Manager)

Store your Gemini API key securely in Google Cloud Secret Manager:

```bash
# 1. Create the secret container
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# 2. Add your secret key version
echo -n "YOUR_ACTUAL_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 3. Grant Cloud Run compute service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 5. Database Security Configuration (Cloud Firestore)

When deploying with Google Cloud Firestore, deploy the following owner-bound security rules (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /complaints/{complaintId} {
      allow read: if true; // Public civic transparency feed
      allow create: if request.resource.data.description is string && request.resource.data.description.size() < 4000;
      allow update, delete: if false; // Municipal updates handled via authorized backend only
    }
  }
}
```

---

## 6. Local Development & Testing

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Set your GEMINI_API_KEY in .env

# 3. Start full-stack development server
npm run dev

# 4. Open application in browser
# Accessible at http://localhost:3000
```

---

## 7. Cloud Run Deployment

Deploy the containerized full-stack application directly to Google Cloud Run:

```bash
# 1. Build and deploy to Cloud Run
gcloud run deploy local-civic-tracker \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --port 3000

# 2. Apply Mandatory Campaign Verification Label
gcloud run services update local-civic-tracker \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 8. Functional Verification Walkthrough & Test Suite

The following walkthrough test cases verify all citizen-facing workflows, government back-office operations, role-based authentication, and real-time state synchronization:

### Test Case TC-01: Citizen Image Upload & Instant Multimodal AI Vision Inspection
1. In the top navigation bar, ensure **Citizen Portal** is selected.
2. Under **Report an Issue**, upload a photo or click a demo preset (e.g. **Severe Asphalt Pothole**).
3. **Expected Outcome**:
   - The photo attaches and immediately triggers the pre-submission vision inspection.
   - An **AI Detected Civic Issue** card appears displaying the identified defect, match confidence, suggested city department, assessed severity, and recognized public safety hazards.
   - The citizen can click **Adopt AI Assessment into Description** or freely edit their text before filing.

### Test Case TC-02: Citizen Complaint Submission & Official Reference ID Receipt
1. Complete the location (e.g. "450 Main St & 3rd Ave") and optional citizen contact info.
2. Click **Submit Official Complaint**.
3. **Expected Outcome**:
   - The system executes the intake graph, routes the ticket, and commits it to the database.
   - Displays the **Confirmation Screen** with an official Complaint ID (e.g. `CIVIC-2026-1042`), Work Order Reference ID (`WO-DOT-2026-8812`), and a **Track This Complaint Live** button.

### Test Case TC-03: Citizen Dedicated Status Tracking (Milestones & Department View)
1. Click **Track My Complaint** or paste a Reference ID into the search bar.
2. **Expected Outcome**:
   - Displays the public status timeline showing current stage (`Report Submitted`, `Under Review`, `Verified`, `Crew Assigned`, `In Progress`, or `Resolved`).
   - Displays the responsible city department, site location, submitted photo evidence, assigned crew, and expected ETA.
   - **Crucial Separation**: The citizen view contains *zero* internal administrative levers, forced progression triggers, or department triage controls.

### Test Case TC-04: Government Authentication & 1-Click Evaluator Role Switching
1. Click the **Government Simulator** button in the top bar.
2. If prompted, or by clicking **Switch Role**, observe the **Employee Authentication & Access Gateway**.
3. Select **Jane Vance (City Admin)**, **Marcus Sterling (Transportation Dispatcher)**, **Robert Diaz (Field Supervisor)**, or **Sarah Chen (Auditor)**.
4. **Expected Outcome**:
   - The officer's clearance level and badge details are displayed in the header.
   - A valid signed session token is stored in the browser session.

### Test Case TC-05: RBAC Enforcement Verification (Forbidden Mutation vs Authorized Access)
1. In the Government Simulator, click **Switch Role** and sign in as **Sarah Chen (Civic Auditor - AUDIT-901)**.
2. Notice the yellow banner: *"Auditor Credentials (Read-Only): Mutation controls are disabled for independent oversight."*
3. Attempt to click an action button: the system blocks unauthorized mutation and displays the statutory restriction.
4. Switch to **Jane Vance (City Administrator)**: full administrative controls are immediately unlocked.

### Test Case TC-06: Government Evidence Inspection & Triage (Accept or Reject)
1. In the Government Simulator, click the complaint in the incoming queue to open the workbench.
2. Inspect the submitted photo evidence, citizen statement, and AI classification dossier.
3. Click **Accept & Verify Work Order** (or click **Reject / Dismiss Report** to specify a formal rejection justification).
4. **Expected Outcome**:
   - Status updates to `VERIFIED` (or `REJECTED`).
   - An official audit log entry is recorded with actor signature and badge ID.

### Test Case TC-07: Government Department Reassignment
1. Under **Reassign Responsible Department**, select another department (e.g. `Department of Water & Sewer`).
2. Click **Confirm Transfer**.
3. **Expected Outcome**:
   - The complaint is reassigned to the selected department with updated jurisdiction notes.
   - The audit log records the departmental transfer.

### Test Case TC-08: Government Lifecycle Progression & Field Resolution Details
1. Under **Stage 3: Field Crew Dispatch & Status Progression**:
   - Select target status: `IN_PROGRESS` or `RESOLVED`.
   - Enter Assigned Crew: `Road Maintenance Unit #4`.
   - Enter Target ETA: `Today by 4:00 PM`.
   - If resolving, enter proof notes: `Hot-mix asphalt patch rolled to grade and certified safe by field supervisor.`
2. Click **Commit Municipal Update** (or use the **Evaluator Quick Lifecycle Demo** 1-click fast-forward buttons).
3. **Expected Outcome**:
   - The ticket status advances with field dispatch metadata.
   - A success toast confirms the update.

### Test Case TC-09: Real-Time Cross-App State Synchronization
1. Click **Switch to Citizen Portal** in the top navigation.
2. Under **Track My Complaint**, observe the complaint status.
3. **Expected Outcome**:
   - The citizen portal instantly reflects the updated status, assigned crew, target ETA, and resolution certification notes made in the Government Simulator!

---

## 7. Google Cloud Run Deployment & Production Configuration Guide

### 7.1 Environment & Prerequisites
Ensure the necessary Google Cloud APIs are enabled in your GCP project:
```bash
gcloud services enable run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com
```

### 7.2 Secret Management Setup
Store sensitive keys (such as `GEMINI_API_KEY`) securely in Google Cloud Secret Manager:
```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 7.3 Cloud Firestore Security Rules
Ensure owner-bound and RBAC security rules are configured:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User interactions & civic reports isolated per user
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /civic_reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

### 7.4 Cloud Run Deployment Flow
Deploy the application container directly to Cloud Run:
```bash
gcloud run deploy civic-reporter \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --port 3000
```

### 7.5 Verification Binding (Required Campaign Labeling)
Apply the mandatory resource label to register the service for automated challenge verification:
```bash
gcloud run services update civic-reporter \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```
