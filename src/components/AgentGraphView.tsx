import React, { useState } from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  Clock,
  ArrowDown,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldAlert,
  Send,
  FileText,
  AlertCircle,
  Database,
  Terminal,
  Code2,
  Server,
  Workflow,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { AgentTraceNode, MonitoringRunResult } from '../types.js';

interface AgentGraphViewProps {
  onRefreshData: () => void;
}

export const AgentGraphView: React.FC<AgentGraphViewProps> = ({ onRefreshData }) => {
  const [isTriggeringAgent2, setIsTriggeringAgent2] = useState(false);
  const [monitoringResult, setMonitoringResult] = useState<MonitoringRunResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeStackTab, setActiveStackTab] = useState<'langgraph' | 'fastapi' | 'postgres' | 'llm'>('langgraph');
  const [showStackInspector, setShowStackInspector] = useState(false);

  const handleRunMonitoringAgent = async () => {
    setIsTriggeringAgent2(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/agents/monitoring/run', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to execute monitoring agent');
      }
      const data: MonitoringRunResult = await res.json();
      setMonitoringResult(data);
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing monitoring agent');
    } finally {
      setIsTriggeringAgent2(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center space-x-2.5">
            <Cpu className="w-6 h-6 text-indigo-600" />
            <span>Autonomous Two-Agent LangGraph Architecture</span>
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Visual inspection of the real-time Civic Sahayak (Intake AI) and scheduled Nagrik Sandesh (Monitoring AI) pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setShowStackInspector(!showStackInspector)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{showStackInspector ? 'Hide Tech Stack Code' : 'View Tech Stack Spec'}</span>
          </button>

          <button
            id="run-scheduled-monitoring-btn"
            onClick={handleRunMonitoringAgent}
            disabled={isTriggeringAgent2}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isTriggeringAgent2 ? 'animate-spin' : ''}`} />
            <span>{isTriggeringAgent2 ? 'Nagrik Sandesh Polling...' : 'Trigger Nagrik Sandesh Polling'}</span>
          </button>
        </div>
      </div>

      {/* Strict Tech Stack Ribbon */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Architecture Stack
              </span>
              <span className="text-sm font-extrabold text-white">
                Python • FastAPI • LangGraph • Google Gemini • PostgreSQL • React
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Language</span>
              <span className="text-xs font-bold text-amber-400">Python 3.10+</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Backend</span>
              <span className="text-xs font-bold text-teal-400">FastAPI Async</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Agent Framework</span>
              <span className="text-xs font-bold text-indigo-400">LangGraph</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">LLM Provider</span>
              <span className="text-xs font-bold text-sky-400">Google Gemini</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Database</span>
              <span className="text-xs font-bold text-emerald-400">PostgreSQL</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Frontend</span>
              <span className="text-xs font-bold text-cyan-400">React / Next.js</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Code & Architecture Inspector */}
      {showStackInspector && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 p-5 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Full-Stack Tech Architecture Specification</h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'langgraph', label: 'LangGraph StateGraph', icon: Workflow },
                { id: 'fastapi', label: 'FastAPI Routers', icon: Server },
                { id: 'postgres', label: 'PostgreSQL Models', icon: Database },
                { id: 'llm', label: 'Google Gemini (GenAI)', icon: Bot },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveStackTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                      activeStackTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="font-mono text-[11px] leading-relaxed bg-slate-900/90 rounded-xl p-4 border border-slate-800 overflow-x-auto text-slate-300 max-h-80">
            {activeStackTab === 'langgraph' && (
              <pre>{`# backend/graph.py - LangGraph Multi-Agent Architecture
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any

class CivicIntakeState(TypedDict, total=False):
    citizen_description: str
    image_base64: str
    vision_findings: Dict[str, Any]
    semantic_match: bool
    department_id: str
    severity: str
    standardized_title: str
    official_complaint_id: str
    work_order_id: str
    execution_trace: List[Dict[str, Any]]

# Compile Agent 1 StateGraph
workflow = StateGraph(CivicIntakeState)
workflow.add_node("classify_image", node_classify_image)
workflow.add_node("validate_with_text", node_validate_with_text)
workflow.add_node("determine_department", node_determine_department)
workflow.add_node("evaluate_statutory_compliance", node_evaluate_statutory_compliance)
workflow.add_node("draft_complaint", node_draft_complaint)
workflow.add_node("notify_user", node_notify_user)

workflow.set_entry_point("classify_image")
workflow.add_edge("classify_image", "validate_with_text")
workflow.add_edge("validate_with_text", "determine_department")
workflow.add_edge("determine_department", "evaluate_statutory_compliance")
workflow.add_edge("evaluate_statutory_compliance", "draft_complaint")
workflow.add_edge("draft_complaint", "notify_user")
workflow.add_edge("notify_user", END)
intake_agent = workflow.compile()`}</pre>
            )}

            {activeStackTab === 'fastapi' && (
              <pre>{`# backend/main.py & backend/routers/
from fastapi import FastAPI, Depends, HTTPException, status
from .routers import complaints, gov, agents

app = FastAPI(title="Metropolis Civic Issue Tracker", version="2.0.0")

# Mounted FastAPI Endpoints:
# POST /api/analyze-image                (Multimodal Gemini / GPT Vision Inspection)
# POST /api/complaints/submit            (Executes LangGraph Intake Pipeline & commits to Postgres)
# GET  /api/complaints                   (List civic issues with status & department filters)
# GET  /api/complaints/{id}              (Status lookup by Complaint ID or Work Order ID)
# POST /api/gov/auth/login               (Officer badge authentication & token generation)
# POST /api/gov/complaints/{id}/action   (Strict RBAC triage, department reassignment, & dispatch)
# POST /api/agents/monitoring/run        (Agent 2 LangGraph Background Monitoring Cycle)`}</pre>
            )}

            {activeStackTab === 'postgres' && (
              <pre>{`-- PostgreSQL 16 Relational Database Schema (SQLAlchemy 2.0 Async)
CREATE TABLE complaints (
    id VARCHAR(64) PRIMARY KEY,              -- e.g. CIVIC-2026-1042
    work_order_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. WO-DOT-2026-8812
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    department_id VARCHAR(64) NOT NULL,       -- DOT, SANITATION, WATER, LIGHTING
    department_name VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED',
    assigned_crew VARCHAR(128),
    target_eta VARCHAR(64),
    statutory_compliance_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaint_status_history (
    id SERIAL PRIMARY KEY,
    complaint_id VARCHAR(64) REFERENCES complaints(id) ON DELETE CASCADE,
    old_status VARCHAR(32) NOT NULL,
    new_status VARCHAR(32) NOT NULL,
    plain_language_summary TEXT NOT NULL,
    actor VARCHAR(128) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}</pre>
            )}

            {activeStackTab === 'llm' && (
              <pre>{`# backend/llm.py - Google Gemini AI Integration (Powered by GEMINI_API_KEY)
import os
from google import genai
from google.genai import types

# Resilient Gemini Model Ladder: gemini-3.8-flash -> gemini-flash-latest -> gemini-3.1-flash-lite
GEMINI_MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"]

# Multimodal Vision Analysis (Inspecting photos for defects, severity, & department)
async def analyze_image_with_vision(image_base64: str, mime_type: str = "image/jpeg"):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    image_bytes = base64.b64decode(image_base64)

    for model_name in GEMINI_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    SYSTEM_INSPECTION_PROMPT,
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                ],
            )
            return json.loads(clean_json(response.text))
        except Exception:
            continue

# Plain-Language Citizen Translator (Translates technical work order transitions)
async def translate_status_to_plain_language(title, old_status, new_status, actor):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    res = client.models.generate_content(model="gemini-3.8-flash", contents=prompt)
    return res.text.strip()`}</pre>
            )}
          </div>
        </div>
      )}


      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Monitoring Run Output Toast */}
      {monitoringResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center space-x-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Nagrik Sandesh Monitoring Cycle Completed Successfully</span>
            </span>
            <span className="font-mono text-neutral-500">
              {new Date(monitoringResult.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p>
            Scanned <span className="font-bold">{monitoringResult.checkedCount}</span> active complaints.
            Updated status and delivered citizen plain-language notifications for{' '}
            <span className="font-bold">{monitoringResult.updatedCount}</span> tickets.
          </p>

          {monitoringResult.updatedComplaints.length > 0 && (
            <div className="pt-2 border-t border-emerald-200/60 space-y-1.5">
              <span className="font-semibold text-emerald-900 block">Status Transitions Handled:</span>
              {monitoringResult.updatedComplaints.map((item) => (
                <div key={item.id} className="p-2 rounded-lg bg-white border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">{item.id}</span>
                    <span className="text-[11px] font-semibold text-indigo-700">
                      {item.oldStatus} &rarr; {item.newStatus}
                    </span>
                  </div>
                  <p className="text-neutral-700 italic">"{item.plainLanguageUpdate}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Civic Sahayak Graph Blueprint */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                Civic Sahayak
              </span>
              <h2 className="text-base font-bold text-neutral-900">Intake Agent (Real-Time Multimodal Triage)</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Triggered immediately upon citizen submission. Integrates multimodal computer vision with semantic validation.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">6 Graph Nodes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: '1',
              node: 'classify_image',
              title: 'Visual Classification',
              desc: 'Multimodal vision model inspects photo to identify hazard, severity, and category.',
              icon: Eye,
            },
            {
              step: '2',
              node: 'validate_with_text',
              title: 'Semantic Cross-Check',
              desc: 'Compares vision analysis against submitter text description for mutual alignment.',
              icon: ShieldAlert,
            },
            {
              step: '3',
              node: 'determine_department',
              title: 'Municipal Routing',
              desc: 'Resolves appropriate municipal jurisdiction (DOT, Sanitation, Water, Lighting).',
              icon: Layers,
            },
            {
              step: '4',
              node: 'draft_complaint',
              title: 'Synthesize Ticket',
              desc: 'Drafts formal municipal work ticket, standardized title, and safety notes.',
              icon: FileText,
            },
            {
              step: '5',
              node: 'submit_complaint',
              title: 'Commit Registry',
              desc: 'Generates permanent complaint ID and official work order reference number.',
              icon: CheckCircle2,
            },
            {
              step: '6',
              node: 'notify_user',
              title: 'Instant Confirmation',
              desc: 'Dispatches receipt to citizen with tracking link and department contact info.',
              icon: Send,
            },
          ].map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.step}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px]">
                      {node.step}
                    </span>
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900">{node.title}</h4>
                  <p className="font-mono text-[10px] text-neutral-400 mb-1">({node.node})</p>
                  <p className="text-neutral-600 leading-snug text-[11px]">{node.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nagrik Sandesh Graph Blueprint */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Nagrik Sandesh
              </span>
              <h2 className="text-base font-bold text-neutral-900">Monitoring &amp; Notification Agent (Background Scheduled Watch)</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Polls municipal work orders, identifies status deltas, and translates cryptic government codes into plain, citizen-friendly language.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">6 Graph Nodes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: '1',
              node: 'fetch_open_complaints',
              title: 'Poll Open Registry',
              desc: 'Queries all active work orders that are not yet marked resolved or closed.',
            },
            {
              step: '2',
              node: 'check_status',
              title: 'Query Gov Source',
              desc: 'Retrieves raw status code updates from municipal dispatch or contractor feeds.',
            },
            {
              step: '3',
              node: 'detect_change',
              title: 'Delta Detection',
              desc: 'Compares previous stored status with newly retrieved government state.',
            },
            {
              step: '4',
              node: 'translate_plain',
              title: 'Plain-Language AI',
              desc: 'LLM translates raw municipal codes (e.g. WO_ASPH_PATCH) into warm citizen messages.',
            },
            {
              step: '5',
              node: 'notify_user',
              title: 'Dispatch Alerts',
              desc: 'Emits alert to citizen notification center with plain-language explanation.',
            },
            {
              step: '6',
              node: 'log_history',
              title: 'Immutable Audit Log',
              desc: 'Persists timestamped transition record with both raw and translated status.',
            },
          ].map((node) => (
            <div
              key={node.step}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                    {node.step}
                  </span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900">{node.title}</h4>
                <p className="font-mono text-[10px] text-neutral-400 mb-1">({node.node})</p>
                <p className="text-neutral-600 leading-snug text-[11px]">{node.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
