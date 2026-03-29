# SoloFirm Master Plan

**Version:** 1.0  
**Date:** 2026-03-28  
**Purpose:** Define the full business strategy, product architecture, and feature roadmap for an AI-native platform that can take a founder from idea to launch-ready business with high automation and low friction.

---

## 1) Executive Summary

SoloFirm is an **AI launchpad for new businesses**. A founder provides a business idea and context once, then the platform:

1. Runs a multi-agent planning pipeline.
2. Produces a complete launch package (strategy, legal, finance, branding, social, risk review).
3. Converts outputs into a polished business identity (name, tagline, theme, summaries).
4. Helps execute setup tasks through assisted and automated account creation workflows.

### Core Promise

> From idea to launch-ready operating plan in one guided flow, with automation that performs setup work and reduces founder overhead.

### Strategic Outcome

SoloFirm is not only a planning tool. It is an **execution system** that combines:
- **Thinking automation** (specialist AI agents)
- **Action automation** (guided and browser/API-based setup)

---

## 2) Problem Statement

Founders fail early for repeatable reasons:
- They do not know the highest-priority next steps.
- They spend weeks stitching together fragmented tools.
- They delay legal/financial setup and launch assets.
- They lose momentum during repetitive setup tasks.

Traditional startup guidance is either generic or expensive. Most “AI idea” tools stop at text output and do not help launch execution.

---

## 3) Product Vision and Positioning

### Vision

Build the default operating system for first-time founders: a platform that can **design, package, and start launching** a business with minimal manual work.

### Positioning

- **For:** early founders, solo operators, and side-hustle builders
- **Who need:** fast clarity + practical launch assets + setup automation
- **SoloFirm provides:** an integrated strategy-to-execution pipeline
- **Unlike:** static templates or single-agent chat tools, SoloFirm coordinates specialized agents and launch automation.

---

## 4) End-to-End Founder Journey

1. **Intake**
   - Founder submits idea, location, budget, entity preference, team size, and optional docs.

2. **Clarifying Q&A**
   - AI asks targeted questions to close critical gaps and improve plan quality.

3. **Multi-Agent Execution**
   - Specialized agents run in phased dependencies (planner first, then parallel specialists, then downstream agents).

4. **Business Packaging**
   - System synthesizes a business name, tagline, theme, and high-level character summaries per agent.
   - Founder can edit minor branding fields.

5. **Launch Assets Delivery**
   - Final package includes roadmap, legal checklist/docs guidance, finance setup, brand package, social launch plan, and critic review.

6. **Execution Automation**
   - Guided and automated setup workflows create critical launch accounts and bootstrap go-to-market presence.

7. **Persistence and Sharing**
   - Results saved with shareable links for collaborators, advisors, or investors.

---

## 5) Product Capability Map

## 5.1 Strategy Generation Engine (Implemented)

- Guided intake + optional document parsing
- Clarifying Q&A flow and plan summary creation
- 7-agent orchestration with streaming status updates
- Final package synthesis and persistent run history

### 7-Agent Model

1. **Planner** → 90-day launch roadmap
2. **Research** → market intelligence and competition
3. **Legal** → entity/compliance guidance
4. **Finance** → setup, projections, risk framing
5. **Brand** → naming, positioning, identity direction
6. **Social** → platform strategy and launch kit
7. **Critic** → adversarial gap/risk detection

## 5.2 Packaging Layer (Implemented + Evolving)

- Automated presentation synthesis:
  - business name
  - tagline
  - theme colors/font
  - concise per-agent summaries
- Founder can make light manual edits before finalizing output.

## 5.3 Launch Automation Layer (Implemented + Expansion Path)

- Guided account setup workflows
- Initial automation support for selected platform/account tasks
- API/OAuth-assisted account provisioning where possible
- Browser-based automation sidecar for workflows requiring UI interaction

---

## 6) Technical Architecture

### 6.1 Architecture Overview

SoloFirm uses a modular architecture:

- **Frontend (Next.js App Router + React):** orchestrated UX, status visualization, packaging, editing, and results viewing
- **API Routes (Next.js server runtime):** intake, Q&A, orchestration, finalization, automation proxy endpoints
- **AI Layer:** OpenAI-compatible client configured for Gemini or OpenAI model backends
- **Data Layer (Supabase):** runs, outputs, metadata, waitlist, and shareable records
- **Automation Sidecar:** process isolated service for browser/API task automation

### 6.2 Runtime Data Flow

1. User submits intake.
2. Q&A route enriches context.
3. Orchestrator executes phase graph and emits SSE events.
4. Client renders live progress/chunks.
5. Synthesis generates presentation metadata.
6. Persist full run (agent outputs + presentation + final package).
7. Optional automation flows execute and stream status.

### 6.3 Event Model

The system uses server-sent events for observability and UX smoothness:
- run start
- agent start/chunk/complete/error
- phase complete
- synthesis complete
- run complete/error

### 6.4 Reliability Patterns

- Agent-level timeouts
- Partial completion support
- Fallback synthesis output when parsing fails
- Structured status model (`running`, `complete`, `partial`, `error`)

---

## 7) Automation Strategy (Core Differentiator)

Automation is the key moat: SoloFirm should not stop at planning.

## 7.1 Automation Principles

1. **Human-in-the-loop by default** for trust and compliance.
2. **Automate repetitive setup first** (highest time savings).
3. **Escalate complexity gradually** (guided -> semi-auto -> full auto).
4. **Preserve auditability** (events, statuses, and action logs).

## 7.2 Automation Maturity Levels

### Level 1 — Assisted Launch (Now)
- Prefilled launch assets and checklists
- Guided account setup wizards
- Minimal friction handoff to external services

### Level 2 — Semi-Automated Launch (Near-Term)
- Browser/API automations for platform onboarding
- Credential/OAuth sessions for selected providers
- Recovery paths for captcha/verification interruptions

### Level 3 — Autonomous Launch Pipeline (Mid-Term)
- Multi-step workflows chaining legal/brand/social tasks
- Policy-aware automations by region and industry type
- Founder approval gates before sensitive submissions

### Level 4 — Continuous Launch Ops (Long-Term)
- Ongoing optimization loops (content cadence, profile updates, KPI nudges)
- Trigger-based growth suggestions and execution tasks

---

## 8) Business Plan

## 8.1 Target Customers

### Primary ICP
- First-time founders
- Solopreneurs
- Side-hustle builders transitioning to formal business

### Secondary ICP
- Freelancers/agencies launching sub-brands
- Advisors/incubators seeking repeatable startup workflows

## 8.2 Value Proposition

- **Speed:** compress months of startup prep into hours
- **Clarity:** coordinated specialist outputs instead of generic advice
- **Execution:** automation support for launch tasks, not just planning docs
- **Confidence:** critic agent catches gaps before external review

## 8.3 Monetization Model

### Recommended Pricing Structure
1. **Starter (one-time):** basic launch package generation
2. **Launch Pro (subscription):** packaging edits + account automation + reruns
3. **Operator (higher tier):** ongoing launch ops, monitoring, and team collaboration

### Revenue Expansion
- Paid add-ons for vertical-specific packs (e.g., local services, ecommerce)
- White-label/incubator partnerships
- Advanced automation bundles

## 8.4 Go-To-Market Strategy

1. Content-led acquisition (founder pain themes: “from idea to launch fast”)
2. Product-led conversion (instant value in first run)
3. Referral loop via shareable result pages
4. Partner channel with startup communities and advisors

---

## 9) Feature Plan

## 9.1 Implemented / In-Progress

- Intake + Q&A refinement
- Multi-agent phased orchestration with streaming
- Launch package generation and persistence
- Presentation synthesis (name/theme/summaries)
- Basic account setup workflows and automation hooks
- Waitlist capture and results sharing

## 9.2 Next Feature Milestones

### Milestone A — Launch Narrative UX
- Smooth completion reveal (“Your business is ready…”)
- Character-based summary cards with expandable details
- Better packaging polish and edit controls

### Milestone B — Automation Breadth
- Expand platform automations (social + business profiles)
- Improve fault handling and resume capabilities
- Add preflight checks before running automation

### Milestone C — Team and Collaboration
- Team workspaces
- Roles/permissions
- Commenting and approval workflow on final packages

### Milestone D — Outcome Optimization
- KPI dashboard per run
- Recommendations based on completion gaps
- Follow-up run suggestions by business stage

---

## 10) Data, Metrics, and AI-Graded Evidence

This plan is designed to be machine-evaluable. Every claim should map to measurable indicators.

## 10.1 Core Product KPIs

1. **Time to First Launch Plan** (minutes)
2. **Run Completion Rate** (`complete` + `partial`)
3. **Automation Success Rate** (attempted vs completed tasks)
4. **Founder Effort Saved** (self-reported + inferred time)
5. **Activation Rate** (intake -> completed run)
6. **Conversion Rate** (free -> paid)

## 10.2 Quality KPIs

1. **Plan Utility Score** (user rating)
2. **Agent Consistency Score** (critic/summary coherence checks)
3. **Edit Burden** (how much manual correction required)
4. **Re-run Improvement Delta** (quality gain between runs)

## 10.3 Automation KPIs

1. **Task Automation Coverage** (# tasks automated / total launch tasks)
2. **Median Automation Runtime**
3. **Interruption Recovery Rate**
4. **Human Override Frequency**

## 10.4 AI-Grading Readiness Checklist

- Clear problem, customer, and value proposition
- Coherent architecture tied to capabilities
- Concrete feature inventory and roadmap
- Quantified KPIs with definitions
- Risk and mitigation coverage
- Execution milestones with timelines

---

## 11) Security, Trust, and Compliance

1. **Data Minimization:** store only required run and setup metadata.
2. **Credential Safety:** prefer OAuth tokens and ephemeral handling over persistent secrets.
3. **Human Approval Gates:** required for high-risk automation actions.
4. **Audit Trail:** maintain action logs and statuses for automated operations.
5. **Legal Boundary:** generated legal/financial content is guidance; users confirm with professionals.

---

## 12) Risks and Mitigations

1. **Automation Fragility (UI changes/captchas)**
   - Mitigation: resilient selectors, retries, guided fallback, provider APIs where available.

2. **Output Quality Variance**
   - Mitigation: stronger prompts, critic gating, structured synthesis validation, rerun controls.

3. **Trust and Compliance Concerns**
   - Mitigation: transparent logs, approval checkpoints, clear disclaimers, secure token handling.

4. **Unit Economics Pressure**
   - Mitigation: tiered pricing, model routing optimization, caching/summarization for long contexts.

5. **Scope Creep**
   - Mitigation: milestone-driven delivery and KPI-based prioritization.

---

## 13) 12-Month Roadmap

## Phase 1 (0-90 Days): Launch Quality and Conversion
- Polish post-run reveal + packaging UX
- Improve synthesis reliability and editing flow
- Add baseline KPI instrumentation and funnel analytics
- Harden core automation reliability

## Phase 2 (90-180 Days): Automation Expansion
- Extend account/platform automation coverage
- Add reusable automation templates by business type
- Improve recovery/resume and exception handling

## Phase 3 (180-365 Days): Operating System Mode
- Team features and approvals
- Continuous launch ops recommendations
- Partner/white-label channels and enterprise readiness

---

## 14) Execution Workstreams and Ownership Model

1. **Core AI Workstream**
   - Agent quality, orchestration logic, synthesis validity

2. **Automation Workstream**
   - Browser/API automations, reliability, safety controls

3. **Product UX Workstream**
   - Founder journey, packaging UI, conversion points

4. **Platform Workstream**
   - Data model, observability, security, performance

5. **Growth Workstream**
   - ICP messaging, waitlist-to-paid conversion, partnerships

---

## 15) Definition of Success

SoloFirm succeeds when a founder can reliably complete this path:

1. Submit one idea.
2. Receive a complete launch package with clear next steps.
3. Accept an auto-generated business identity and edit minor details.
4. Execute key setup tasks via guided/automated workflows.
5. Move from “idea” to “operational launch” in days, not months.

**North Star:** SoloFirm becomes the fastest, safest way for a new founder to stand up a real business.
