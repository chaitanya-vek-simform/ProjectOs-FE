# ProjectOS — AI-Powered Project Lifecycle Operating System

### Complete Product & Architecture Reference

---

## 1. Vision

ProjectOS is an AI-native operating system for software delivery — a single platform that ingests raw client intent and outputs a fully structured, staffed, tracked, and risk-monitored project. It replaces the fragmented stack of Confluence + Jira + Notion + spreadsheets with an intelligent agent layer built on GPT-4o and RAG.

**Core promise:** From requirement upload to running sprint plan in under 90 seconds.

---

## 2. Problem Statement

| Pain Point                          | Current Cost         |
| ----------------------------------- | -------------------- |
| Requirement → User Story conversion | 2–5 days per project |
| Proposal writing                    | 3–7 days per RFP     |
| Sprint planning                     | 4–8 hours per sprint |
| Meeting → action items              | 1–2 days lag         |
| Risk identification                 | Often post-incident  |
| Resource allocation                 | Manager gut feel     |

---

## 3. User Personas

### Alex — Solutions Architect

Goal: Win RFPs faster, build better proposals. Spends 40% of time on repetitive proposal boilerplate.
**Wins with:** Auto-generated technical proposals from raw RFPs.

### Priya — Delivery Manager

Goal: Predictable delivery, happy clients. Discovers fires in standup, not before.
**Wins with:** Risk prediction 3 days early, automated sprint health scoring.

### Marcus — Business Analyst

Goal: Convert client chaos into structured requirements fast. Hours transcribing meeting notes.
**Wins with:** Meeting transcript → structured user stories in 60 seconds.

### Sarah — Engineering Lead

Goal: Accurate capacity planning, balanced team load. Overloaded seniors, underutilized juniors.
**Wins with:** AI resource allocation with skill-gap detection and utilization heatmap.

---

## 4. Modules & Functional Requirements

### Module 1 — Requirement Intelligence

**Input:** PDF / DOCX / TXT requirement documents, RFPs, meeting notes
**Output:** Project summary, scope, functional/non-functional requirements, user stories, acceptance criteria, assumptions, risks, out-of-scope items

Key FRs:

- Accept PDF, DOCX, TXT upload
- Extract structured requirements via GPT-4o + RAG over indexed document
- Generate user stories in Gherkin format (Given/When/Then)
- Classify requirements: Functional / Non-functional / Assumption / Risk / Out-of-scope
- Allow inline human editing of all AI output before approval
- Export to PDF / JSON

### Module 2 — Proposal & Estimation Engine

**Input:** Approved requirements + user stories
**Output:** Technical proposal, suggested architecture (Mermaid diagram), team structure, timeline, effort estimate, cost breakdown, risks

Key FRs:

- Generate technical proposal narrative
- Suggest technology stack with justification
- Render Mermaid architecture diagrams
- Estimate effort in story points and person-days per role
- Calculate cost using configurable rate cards (per role, per day)
- Export proposal as PDF

### Module 3 — AI Project Planner

**Input:** Approved user stories
**Output:** Epics, features, tasks, sprint plan, Gantt timeline

Key FRs:

- Convert approved stories into concrete engineering tasks (2–16h each)
- Create sprint plan respecting 40-point/sprint capacity
- Suggest task dependencies and ordering
- Suggest assignee role per task
- Kanban board with drag-and-drop
- Gantt chart visualization

### Module 4 — Meeting Intelligence

**Input:** Raw meeting transcript (text)
**Output:** MOM (Minutes of Meeting), action items with owners/deadlines, decisions log

Key FRs:

- Accept transcript as paste or text upload
- Extract all action items (explicit and implicit)
- Link action items to existing tasks or create new ones
- Generate professional MOM in markdown
- Log decisions to project knowledge base

### Module 5 — Resource Allocation

**Input:** Project requirements + team profiles
**Output:** Team composition recommendation, utilization heatmap, over/under-allocation alerts

Key FRs:

- Maintain team member profiles (skills, experience, availability, rate)
- Suggest optimal team composition for a project
- Cross-project utilization heatmap
- Alert on overallocation (>100%) or underallocation (<60%)

### Module 6 — Project Health Dashboard

**Input:** Live task/sprint data
**Output:** Burndown chart, velocity trend, milestone status (RAG), delivery forecast

Key FRs:

- Real-time sprint burndown
- Velocity trend across N sprints
- Milestone tracking with Red/Amber/Green status
- Delivery forecast based on current velocity

### Module 7 — Risk Prediction Engine

**Input:** Sprint data, task statuses, team utilization
**Output:** Risk score (0–100), risk factor breakdown, LLM explanation, recommended actions

**Risk scoring formula:**

```
velocity_drop     (0–25 pts)  — velocity decline vs prior sprints
blocked_tasks     (0–20 pts)  — tasks blocked >48h
overallocation    (0–20 pts)  — sprint committed > capacity
milestone_drift   (0–20 pts)  — sprint end_date passed without completion
scope_creep       (0–15 pts)  — open change requests
──────────────────────────────
Total             0–100
```

Levels: 0–29=low | 30–54=medium | 55–74=high | 75–100=critical

---

## 5. High-Level Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Frontend                          │
│         React 18 + TypeScript + Tailwind + ShadCN   │
└───────────────────────┬──────────────────────────────┘
                        │ REST + WebSocket
┌───────────────────────▼──────────────────────────────┐
│              FastAPI Backend (Python 3.12)            │
│   api/v1/  →  services/  →  ai/chains/              │
│   JWT Auth │ PostgreSQL  │  ChromaDB  │  OpenAI      │
└──────┬──────────────┬────────────┬────────────────────┘
       │              │            │
  PostgreSQL     ChromaDB     OpenAI GPT-4o
  (relational)   (vectors)    + Embeddings
```

---

## 6. AI Pipeline

```
Document Upload
  → Text Extraction (PyMuPDF / python-docx)
  → Recursive Text Chunking (1000 chars, 200 overlap)
  → Embedding (text-embedding-3-small)
  → ChromaDB Index (per-project collection)

Generation Request
  → Semantic Search (top-8 chunks from ChromaDB)
  → Prompt Assembly (Jinja2 template + context)
  → GPT-4o (JSON mode, structured output)
  → JsonOutputParser → Pydantic validation
  → Database write-back
  → Frontend notification
```

All AI chains use LangChain LCEL pattern:

```python
chain = prompt | llm | JsonOutputParser()
result = await chain.ainvoke(inputs)
```

---

## 7. Database Schema (Summary)

| Table                   | Key Fields                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `organizations`         | id, name, slug, settings                                                           |
| `users`                 | id, org_id, email, role, skills[], hourly_rate                                     |
| `projects`              | id, org_id, name, status, client_name, budget_usd                                  |
| `requirement_documents` | id, project_id, filename, status, raw_content                                      |
| `requirements`          | id, project_id, type, title, description, priority, status                         |
| `user_stories`          | id, project_id, epic, feature, story, acceptance_criteria, story_points            |
| `proposals`             | id, project_id, architecture(JSON), cost_breakdown(JSON), total_cost_usd           |
| `sprints`               | id, project_id, sprint_number, capacity_points, committed_points, completed_points |
| `tasks`                 | id, sprint_id, assignee_id, title, status, priority, estimated_hours               |
| `meetings`              | id, project_id, raw_transcript, mom, action_items(JSON), decisions(JSON)           |
| `risk_snapshots`        | id, project_id, risk_score, risk_level, risk_factors(JSON), recommendations(JSON)  |

---

## 8. API Endpoints (v1)

```
# Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me

# Projects
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/{id}
PUT    /api/v1/projects/{id}
GET    /api/v1/projects/{id}/dashboard

# Requirement Intelligence
POST   /api/v1/projects/{id}/documents                     # Upload
GET    /api/v1/projects/{id}/documents
POST   /api/v1/projects/{id}/documents/{doc_id}/process    # Trigger AI
GET    /api/v1/projects/{id}/requirements
PUT    /api/v1/requirements/{id}
POST   /api/v1/projects/{id}/requirements/generate-stories
GET    /api/v1/projects/{id}/stories
PUT    /api/v1/stories/{id}

# Proposals
POST   /api/v1/projects/{id}/proposal/generate
GET    /api/v1/projects/{id}/proposal
PUT    /api/v1/projects/{id}/proposal

# Planner
POST   /api/v1/projects/{id}/sprints/generate
GET    /api/v1/projects/{id}/sprints
POST   /api/v1/projects/{id}/sprints
GET    /api/v1/projects/{id}/tasks
POST   /api/v1/projects/{id}/tasks
PUT    /api/v1/tasks/{id}

# Meeting Intelligence
POST   /api/v1/projects/{id}/meetings
GET    /api/v1/projects/{id}/meetings
GET    /api/v1/meetings/{id}
POST   /api/v1/meetings/{id}/process

# Risk
POST   /api/v1/projects/{id}/risk/compute
GET    /api/v1/projects/{id}/risk/latest
GET    /api/v1/projects/{id}/risk/history

# Resources
GET    /api/v1/resources/team
GET    /api/v1/resources/utilization
POST   /api/v1/projects/{id}/resources/suggest
```

---

## 9. Technology Stack

| Layer            | Technology                                           |
| ---------------- | ---------------------------------------------------- |
| Frontend         | React 18 + TypeScript + Vite + Tailwind CSS + ShadCN |
| State            | TanStack Query (server state) + Zustand (UI state)   |
| Charts           | Recharts                                             |
| Drag & Drop      | @dnd-kit/core                                        |
| Diagrams         | Mermaid                                              |
| Backend          | Python 3.12 + FastAPI                                |
| ORM              | SQLAlchemy 2.0 (async) + Alembic                     |
| Auth             | JWT (python-jose) + bcrypt (passlib)                 |
| AI               | LangChain LCEL + GPT-4o + text-embedding-3-small     |
| Vector DB        | ChromaDB                                             |
| Database         | PostgreSQL 16                                        |
| Document Parsing | PyMuPDF (PDF) + python-docx (DOCX)                   |
| Infrastructure   | Docker + Docker Compose                              |

---

## 10. Hackathon Strategy

### Priority order (build first = most demo impact)

1. Requirement Intelligence — **core wow moment**, sets up everything else
2. Proposal & Estimation — shows business value immediately
3. Project Planner — most-used PM feature, visual impact
4. Meeting Intelligence — fast to build, high drama in demo
5. Risk Dashboard — visual payoff, seeded data works fine
6. Resource Allocation — seeded data is sufficient for demo

### Real vs Mock decision table

| Feature                   | Build       | Reason                             |
| ------------------------- | ----------- | ---------------------------------- |
| AI Requirement Extraction | REAL        | Core demo moment                   |
| User Story Generation     | REAL        | Visible, impressive                |
| Proposal Generation       | REAL        | Shows business value               |
| Effort Estimation         | REAL        | Judges love cost breakdowns        |
| Sprint Plan Generation    | REAL        | Tangible artifact                  |
| Meeting → MOM             | REAL        | Easy build, high drama             |
| Risk Score (formula)      | REAL        | Dashboard wow                      |
| Resource Heatmap          | MOCK (seed) | Complex to build real              |
| Velocity Charts           | MOCK (seed) | Needs historical data              |
| PR/CI Metrics             | MOCK        | External integrations out of scope |
| Audio Transcription       | MOCK (text) | Whisper adds complexity            |

---

## 11. 24-Hour Implementation Roadmap

```
Hour 00–02  Foundation
            Docker Compose, DB migrations, JWT auth, project CRUD

Hour 02–05  Requirement Intelligence  (3 FE + 2 BE + 2 AI)
            Upload UI, text extraction, ChromaDB indexing,
            GPT-4o extraction chain, streaming response UI

Hour 05–08  Proposal & Estimation  (2 FE + 1 BE + 2 AI)
            Proposal generation chain, cost calculator,
            Mermaid architecture viewer, proposal review UI

Hour 08–11  Project Planner  (3 FE + 2 BE + 1 AI)
            Sprint plan chain, Kanban board, Gantt chart,
            task CRUD, sprint assignment UI

Hour 11–13  Meeting Intelligence  (1 FE + 1 BE + 1 AI)
            Transcript paste UI, MOM chain, action item display

Hour 13–16  Dashboards & Risk  (3 FE + 1 BE + 1 AI)
            Risk score service, LLM explanation chain,
            burndown/velocity charts, risk alert UI

Hour 16–18  Resource Allocation  (1 FE + 1 BE)
            Team profiles, utilization heatmap (seed data)

Hour 18–20  Integration & Polish
            Loading states, streaming effects, error handling

Hour 20–22  Demo Data & Testing
            Run seed script, end-to-end rehearsal, bug fixes

Hour 22–24  Demo Prep
            Slide deck, script rehearsal x3, backup recording
```

---

## 12. Demo Storyline (5 minutes)

### 00:00–00:30 — Hook

_"Software projects fail because intelligence is trapped in documents, emails, and people's heads. We built ProjectOS to change that."_

### 00:30–01:30 — Act 1: Upload & Understand

Drag-drop `TechFlow_Logistics_RFP.pdf` → streaming extraction → structured requirements appear in 30 seconds.
_"What took a BA 3 days. Done in 30 seconds."_

### 01:30–02:30 — Act 2: Requirements → Running Project

Click "Generate Proposal" → streaming proposal text + architecture diagram + cost table.
Click "Generate Sprint Plan" → Kanban board animates into view with 40+ tasks.
_"3 days of project setup. Done in 90 seconds."_

### 02:30–03:15 — Act 3: Meeting Intelligence

Paste Sprint 3 kickoff transcript → click Process → clean MOM appears with action items linked to sprint tasks.
_"The meeting is already in the system before you leave the room."_

### 03:15–04:00 — Act 4: Risk Prediction

Navigate to Risk Dashboard → Risk Score: 74/100 HIGH → show 3 signals (velocity drop, Sarah overallocated, blocked task) → recommended actions.
_"Without ProjectOS, Priya discovers this Friday. Sprint fails. With ProjectOS, she fixes it Tuesday."_

### 04:00–05:00 — Close & Vision

Show unified project timeline → summarize platform → future roadmap (Jira sync, voice updates, portfolio intelligence).

---

## 13. Judge Q&A

| Question                | Answer                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Why not just ChatGPT?   | ProjectOS is a system, not a chat. Context is preserved across the entire lifecycle. RAG means AI knows YOUR project, not generic knowledge. |
| Estimation accuracy?    | ±25% baseline, improves to ±10% as the system learns from completed projects through RAG-based historical comparison.                        |
| Different from Jira AI? | Jira AI helps you write one ticket. We generate 200 tickets from a document you uploaded 2 minutes ago. AI-first vs AI-added.                |
| Data security?          | Per-org isolation, JWT auth, local ChromaDB (vectors never leave your infra). Enterprise runs fully on-premise.                              |
| Business model?         | SaaS per-seat: $99/user/month for PM/BA roles. Target $50K ARR per mid-size services company.                                                |

---

## 14. Sample Demo Assets

### RFP Document (`TechFlow_Logistics_RFP.txt`)

TechFlow Logistics — 450 fleet vehicles, B2B/B2C last-mile delivery, $45M revenue.
Needs: GPS tracking, AI dispatch, driver app, client portal, analytics.
Budget: $400K–$600K. Timeline: 8 months.

### Meeting Transcript (`sprint3_kickoff.txt`)

Sprint 2: 34/42 points (8 spilled due to HERE Maps API breaking change).
Sprint 3 decisions: analytics descoped, Amy front-loading before leave, AWS budget increase needed.
Key risk: route optimization not started, 13 points, Sarah pairing with Raj Monday.

### Pre-seeded Project State

- 3 sprints (Sprint 3 active, 22/38 points completed midway)
- 8 tasks (1 blocked, 2 in-progress, 5 todo)
- Risk score: 74/100 HIGH (velocity drop 18, blocked task 14, Sarah overallocated 20)
- 1 processed meeting with 3 action items, 2 decisions
- Full proposal with $485K cost breakdown

---

## 15. Team Assignments (Hackathon)

| Role         | Count | Primary Modules                               |
| ------------ | ----- | --------------------------------------------- |
| Tech Lead    | 1     | Architecture, unblocking, PR review           |
| AI Lead      | 1     | LangChain chains, prompt tuning, RAG          |
| FE Lead      | 1     | Design system, streaming component, routing   |
| BE Lead      | 1     | API design, DB schema, auth                   |
| AI Engineers | 2–3   | Chain building, structured output schemas     |
| FE Engineers | 4–6   | Module UIs: kanban, charts, forms, dashboards |
| BE Engineers | 2–3   | Service endpoints, business logic, seed data  |
| DevOps       | 1     | Docker, env, deployment                       |
| QA / Demo    | 1     | Test data, demo script, rehearsal             |
