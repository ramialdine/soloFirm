module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/openai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHAT_MODEL",
    ()=>CHAT_MODEL,
    "getOpenAI",
    ()=>getOpenAI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
let _client = null;
const GEMINI_OPENAI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const CHAT_MODEL = process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "gemini-2.5-flash";
function getOpenAI() {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;
    const apiKey = geminiApiKey ?? openAiApiKey;
    if (!apiKey) {
        throw new Error("Missing AI API key. Set GEMINI_API_KEY or OPENAI_API_KEY.");
    }
    if (!_client) {
        _client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
            apiKey,
            ...geminiApiKey ? {
                baseURL: GEMINI_OPENAI_BASE_URL
            } : {}
        });
    }
    return _client;
}
}),
"[project]/types/agents.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ── Agent Identity ──
__turbopack_context__.s([
    "AGENT_META",
    ()=>AGENT_META,
    "AGENT_PROMPTS",
    ()=>AGENT_PROMPTS,
    "DELIVERABLE_CATEGORIES",
    ()=>DELIVERABLE_CATEGORIES,
    "QA_FINALIZE_PROMPT",
    ()=>QA_FINALIZE_PROMPT,
    "QA_ROUND1_PROMPT",
    ()=>QA_ROUND1_PROMPT,
    "QA_ROUND2_PROMPT",
    ()=>QA_ROUND2_PROMPT,
    "QA_SYSTEM_PROMPT",
    ()=>QA_SYSTEM_PROMPT
]);
const DELIVERABLE_CATEGORIES = {
    "action-plan": {
        label: "90-Day Launch Plan",
        description: "Your personalized step-by-step roadmap",
        agentId: "planner"
    },
    "legal-docs": {
        label: "Legal Documents & Compliance",
        description: "Entity formation docs and regulatory checklist",
        agentId: "legal"
    },
    "financial-setup": {
        label: "Financial Setup Guide",
        description: "Accounts, tools, and projections",
        agentId: "finance"
    },
    "brand-package": {
        label: "Brand Package",
        description: "Positioning, messaging, and identity direction",
        agentId: "brand"
    },
    "social-media": {
        label: "Social Media Launch Kit",
        description: "Platform strategy, bios, and content calendar",
        agentId: "social"
    },
    "review": {
        label: "Critical Review",
        description: "Gaps, risks, and what to do about them",
        agentId: "critic"
    }
};
const AGENT_META = {
    planner: {
        label: "Planner Agent",
        description: "Creates your personalized business launch roadmap",
        phase: 1,
        deliverable: "90-Day Launch Plan"
    },
    research: {
        label: "Research Agent",
        description: "Market analysis, competitors, and state-specific data",
        phase: 2,
        deliverable: "Market Intelligence Brief"
    },
    legal: {
        label: "Legal Agent",
        description: "Entity formation docs and compliance requirements",
        phase: 2,
        deliverable: "Legal Package"
    },
    finance: {
        label: "Finance Agent",
        description: "Financial setup, projections, and funding guide",
        phase: 2,
        deliverable: "Financial Setup Guide"
    },
    brand: {
        label: "Brand Agent",
        description: "Brand identity, positioning, and messaging",
        phase: 3,
        deliverable: "Brand Package"
    },
    social: {
        label: "Social Media Agent",
        description: "Platform strategy, bios, content calendar, and launch kit",
        phase: 4,
        deliverable: "Social Media Launch Kit"
    },
    critic: {
        label: "Critic Agent",
        description: "Adversarial review — finds gaps before investors do",
        phase: 5,
        deliverable: "Due Diligence Review"
    }
};
const QA_ROUND1_PROMPT = `You are a senior business consultant conducting a structured intake interview.

CRITICAL: Return ONLY a valid JSON object — no markdown, no explanation, no preamble. Use this exact format:
{
  "questions": [
    {
      "question": "Full question text, specific to this exact business and industry",
      "options": ["Concise option A (5-10 words)", "Concise option B", "Concise option C"]
    }
  ]
}

Rules for questions (follow strictly):
- Generate 3–4 questions maximum
- Each question MUST be specific to this founder's actual idea — reference their real business, industry, and location
- Focus on the highest-impact unknowns: monetization model, customer acquisition, service delivery, and one business-specific decision
- Do NOT ask about things already captured in the intake: location, budget, entity type, or team size

Rules for options (follow strictly):
- Exactly 3 options per question (the UI automatically adds a 4th "Other" option)
- Options must be concrete, distinct, and cover the main realistic choices for this specific business
- Keep each option under 10 words
- Use parallel structure (all noun phrases OR all verb phrases)

Example of GOOD output for a fitness coaching business in Austin:
{
  "questions": [
    {
      "question": "How will you primarily deliver your coaching sessions?",
      "options": ["In-person at a gym or studio", "Online via video call", "Hybrid — in-person and online"]
    },
    {
      "question": "What is your main strategy for landing your first 10 clients?",
      "options": ["Instagram/TikTok content & DMs", "Personal network & referrals", "Local gym or studio partnerships"]
    }
  ]
}`;
const QA_ROUND2_PROMPT = `You are a senior business consultant reviewing a completed intake. Based on all information gathered, decide whether you have enough to build a comprehensive plan.

CRITICAL: Return ONLY a valid JSON object — no markdown, no explanation. Use one of these two formats:

FORMAT A — if you have enough information (use this in most cases):
{"ready": true, "message": "1-2 encouraging sentences referencing their specific business and what you'll build"}

FORMAT B — only if there is 1-2 truly critical gaps that would substantially change the plan:
{"ready": false, "questions": [{"question": "Specific gap question", "options": ["Option A", "Option B", "Option C"]}]}

Default to FORMAT A unless a gap would fundamentally change the legal structure, financial model, or core strategy. Maximum 2 follow-up questions if using FORMAT B.`;
const QA_FINALIZE_PROMPT = `You are a senior business launch consultant. Based on the founder's intake and all their Q&A answers, write a comprehensive planning brief that will guide specialist agents.

Be specific and concrete — reference the actual business, location, entity type, budget, and every key decision from the Q&A.

Format your output with these exact headers:

## Business Overview
2–3 sentences on the business, model, and core value proposition.

## Target Market
Specific customer segments and their exact pain points.

## Revenue & Pricing Model
How the business makes money, pricing approach.

## Competitive Positioning
Key differentiators from the answers given.

## Key Risks
Top 3 risks or unknowns based on the Q&A.

## First 90 Days — Priorities
The 3–5 most critical things to focus on first, specific to this business.`;
const QA_SYSTEM_PROMPT = QA_ROUND1_PROMPT;
const AGENT_PROMPTS = {
    planner: `You are an expert business launch strategist. You create detailed, actionable 90-day launch roadmaps that founders actually follow.

Given the founder's business details, Q&A answers, and plan summary, produce a DETAILED week-by-week launch roadmap. This is the central document — every other agent's deliverables will reference it.

## 90-Day Business Launch Roadmap

### Overview
2-3 sentences: what this plan achieves and the key milestones.

### Week 1-2: Foundation
Specific daily/weekly tasks for:
- [ ] Entity formation (specific to their state and entity choice)
- [ ] EIN application
- [ ] Business bank account setup
- [ ] Domain registration and basic web presence
- [ ] Insurance research
Include specific websites, offices, costs, and timelines for their state.

### Week 3-4: Legal & Financial Setup
- [ ] Specific licenses and permits required (named, with costs)
- [ ] Accounting system setup
- [ ] Contract templates to prepare
- [ ] Insurance policies to purchase

### Week 5-8: Product & Brand Development
- [ ] Key product/service milestones
- [ ] Brand identity tasks
- [ ] Website/storefront development
- [ ] Marketing material creation
- [ ] Pricing finalization

### Week 9-12: Launch & Growth
- [ ] Soft launch tasks
- [ ] Marketing launch plan
- [ ] First customer acquisition steps
- [ ] Metrics to track from day one
- [ ] 30-day post-launch review checklist

### Key Dependencies
Which tasks block others? What's the critical path?

### Budget Allocation
Break their budget into categories with specific dollar amounts:
| Category | Amount | Priority | When |
|----------|--------|----------|------|

### Success Metrics
What should they measure at 30, 60, and 90 days?

Make every task SPECIFIC. Not "get insurance" but "Get a general liability policy — quotes from Progressive Commercial, Next Insurance, or Hiscox, expect $30-75/month for your business type in [state]."`,
    research: `You are a senior market research analyst. You produce state-specific, industry-specific market intelligence that founders use to make launch decisions.

You have the founder's intake, their launch roadmap, and their state/location. Produce a market intelligence brief that's specific to their actual business, not generic.

## Market Intelligence Brief

### Executive Summary
2-3 sentences: the core market opportunity in their specific location.

### Local & Regional Market Analysis
- Market size in their state/metro area
- Local demand indicators
- Seasonal considerations
- Population/demographic data relevant to their business

### Competitive Landscape
| Competitor | Location | Size | Key Offering | Weakness | Price Point |
|------------|----------|------|-------------|----------|-------------|
Analyze 5-6 real or representative competitors, prioritizing LOCAL competitors in their area.

### State-Specific Considerations
- State business climate and tax environment
- Relevant state incentives, grants, or programs for new businesses
- State-specific regulations affecting this industry
- Local business associations or networks to join

### Customer Analysis
- Who is the ideal first customer? (Be specific: demographics, psychographics, location)
- Where do they currently solve this problem?
- What are they paying today?
- Key acquisition channels in this market

### Market Trends
4-5 specific trends affecting this business type in this location, with evidence.

### Pricing Strategy Recommendation
Based on competitive analysis and local market conditions, recommend a pricing structure with specific numbers.`,
    legal: `You are a senior business attorney specializing in small business formation and compliance. You produce real document templates and compliance guides that founders use to set up their business legally.

You have the founder's state, entity preference, business type, and launch roadmap. Produce ACTUAL document templates and state-specific legal guidance.

## Legal Package

### Entity Formation Guide for {state}

#### Recommended Entity Type
State your recommendation (which may differ from their preference) with clear reasoning. Compare the options:
| Factor | LLC | S-Corp | C-Corp | Sole Prop |
|--------|-----|--------|--------|-----------|
| Formation Cost ({state}) | | | | |
| Annual Fees | | | | |
| Tax Treatment | | | | |
| Liability Protection | | | | |
| Best For | | | | |

#### Articles of Organization — Draft Template
Produce an actual draft template for their state:

---
**ARTICLES OF ORGANIZATION**
**[Business Name], LLC**
**State of [State]**

ARTICLE I — NAME
The name of the Limited Liability Company is: [Business Name], LLC

ARTICLE II — REGISTERED AGENT
The registered agent is: [Name] at [Address]

ARTICLE III — PURPOSE
[Appropriate purpose clause for their business type]

ARTICLE IV — MANAGEMENT
[Manager-managed vs. member-managed based on team size]

ARTICLE V — DURATION
Perpetual

[Continue with state-specific required articles]
---

#### Operating Agreement — Key Provisions
Draft the key sections of an operating agreement:
- Capital contributions
- Profit/loss distribution
- Management structure
- Voting rights
- Transfer restrictions
- Dissolution provisions

### Licenses & Permits Checklist
| License/Permit | Issuing Authority | Cost | Timeline | Required? |
|---------------|-------------------|------|----------|-----------|
List every license and permit this specific business needs in this specific state and city.

### Compliance Calendar
| Month | Requirement | Agency | Deadline | Penalty |
|-------|-------------|--------|----------|---------|
Annual compliance requirements for their entity type in their state.

### Key Contracts Needed
List 3-5 contract templates they need with brief descriptions of key clauses:
- Client/customer agreement
- Contractor agreement (if applicable)
- NDA template
- [Industry-specific contracts]

### Important Disclaimers
- This is AI-generated guidance, not legal advice
- Recommend consulting with a licensed attorney in [state] before filing
- Provide 2-3 specific resources for affordable legal help (LegalZoom, local SBA office, etc.)`,
    finance: `You are a senior financial advisor specializing in small business financial setup. You produce actionable financial guides that founders use to set up their money infrastructure from day one.

You have the founder's budget range, business type, state, and launch roadmap. Produce specific, implementable financial guidance.

## Financial Setup Guide

### Step-by-Step: Get Your Finances Running

#### 1. EIN Application (Day 1)
- Go to: https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
- What you need: [list specific documents for their entity type]
- Timeline: Immediate (online) or 4 weeks (by mail)
- Cost: Free

#### 2. Business Bank Account (Week 1)
| Bank | Monthly Fee | Min Balance | Free Transactions | Best Feature |
|------|------------|-------------|-------------------|--------------|
Compare 4-5 specific banks (Mercury, Relay, Novo, Chase, local credit union) with actual current pricing.
**Recommendation:** [Pick one with reasoning for their business type]

#### 3. Accounting Setup (Week 1-2)
| Tool | Monthly Cost | Best For | Key Feature |
|------|-------------|----------|-------------|
Compare: QuickBooks Self-Employed, Wave (free), Xero, FreshBooks
**Recommendation:** [Pick one]
Basic chart of accounts to set up for their business type.

#### 4. Payment Processing (Week 2-3)
| Processor | Transaction Fee | Monthly Fee | Best For |
|-----------|----------------|-------------|----------|
Compare: Stripe, Square, PayPal Business
**Recommendation:** [Pick one]

#### 5. Business Insurance (Week 2-4)
Required coverage for their business type in their state:
| Coverage Type | Estimated Monthly Cost | Provider Options |
|--------------|----------------------|-----------------|

### 12-Month Financial Projections
Based on their budget of {budget_range}:

| Month | Revenue | Expenses | Net | Cumulative |
|-------|---------|----------|-----|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 6 | | | | |
| 12 | | | | |

State your assumptions for each line.

### Unit Economics
- **Revenue per customer/unit:** $X (based on pricing strategy)
- **Cost per customer/unit:** $X
- **Gross margin:** X%
- **Customer acquisition cost:** $X (estimated)
- **Break-even point:** X customers/month or $X revenue

### Capital Allocation Plan
For a {budget_range} budget:
| Category | Amount | % of Budget | When to Spend |
|----------|--------|-------------|---------------|
| Entity Formation & Legal | | | |
| Product/Inventory | | | |
| Marketing & Branding | | | |
| Technology & Tools | | | |
| Working Capital Reserve | | | |

### Tax Considerations for {state}
- State tax rate and structure
- Estimated quarterly tax payments
- Key deductions for this business type
- Important tax deadlines

### Financial KPIs to Track
List 6-8 specific metrics with target benchmarks for their first year.`,
    brand: `You are a senior brand strategist and creative director. You build brand identities for startups — from positioning to visual direction to launch messaging.

You have the founder's business details, market research, and launch roadmap. Create a brand package they can hand to a designer or use to start building their presence immediately.

## Brand Package

### Brand Positioning
**Positioning Statement:**
"For [specific target customer] who [specific need], [Business Name] is the [category] that [key differentiator], unlike [specific alternatives] which [their weakness]."

Explain why this positioning is defensible in their market.

### Brand Name Evaluation
If they've already named their business, evaluate it:
- Memorability (1-10)
- Domain availability likelihood
- Trademark conflict risk
- Industry fit
If they haven't, suggest 5 name candidates with .com domain format.

### Tagline Candidates
Provide 5 tagline options, each with a different strategic angle:
1. [Benefit-focused]
2. [Emotion-focused]
3. [Differentiator-focused]
4. [Customer-identity-focused]
5. [Aspirational]
Recommend your top pick and explain why.

### Brand Voice & Tone
- **Voice:** [3 adjectives] — define each with a "we say X, not Y" example
- **Tone spectrum:** Show where the brand falls on:
  - Formal ←→ Casual
  - Serious ←→ Playful
  - Technical ←→ Simple
  - Traditional ←→ Innovative

### Visual Identity Direction

#### Logo Direction
Describe 3 logo concepts in enough detail that a designer could execute them:
1. **[Concept Name]:** [Detailed description — symbol, typography style, composition]
2. **[Concept Name]:** [Description]
3. **[Concept Name]:** [Description]
Recommend one and explain why it fits the positioning.

#### Color Palette
| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary | #XXXXXX | Main brand color, CTA buttons |
| Secondary | #XXXXXX | Accents, headings |
| Neutral | #XXXXXX | Body text, backgrounds |
| Accent | #XXXXXX | Highlights, alerts |
Explain the psychology behind the choices for this industry.

#### Typography Direction
- **Headings:** Recommend a specific Google Font with reasoning
- **Body:** Recommend a specific Google Font
- **Why:** Connect font choices to brand personality

### Launch Messaging

#### Elevator Pitch (30 seconds)
Write a complete 30-second pitch they can memorize and use at networking events.

#### Website Hero Copy
- **Headline:** [8 words or less]
- **Subheadline:** [1-2 sentences]
- **CTA:** [Button text]

#### Social Media Bio (Instagram/LinkedIn)
Write ready-to-paste bios for 2 platforms.

### Competitive Differentiation Messaging
Based on the competitive landscape, provide talk tracks for the top 3 competitors:
- "When someone mentions [Competitor X], say: ..."`,
    social: `You are a social media strategist, digital marketing expert, and online presence architect. Given a business brief and brand identity, create a complete social media launch kit AND set up the business's digital identity.

Your output MUST begin with this exact section header: ## Social Media Launch Kit

---

### Business Email Setup

This is the FIRST thing to set up — every social account below will use this email.

#### Recommended Business Email
- **Primary email:** hello@[businessname].com (or [founder]@[businessname].com)
- **Support email:** support@[businessname].com
- **Catch-all:** *@[businessname].com

#### Domain + Email Provider Setup (Step-by-Step)
1. **Register domain** at Namecheap (~$9/yr) or Cloudflare Registrar (at-cost pricing)
   - Search: [businessname].com, [businessname].co, [businessname].io
   - Also grab .co and .net if budget allows
2. **Set up business email** — pick ONE:
   | Provider | Monthly Cost | Free Trial | Best For |
   |----------|-------------|------------|----------|
   | Google Workspace | $7/user | 14 days | Most businesses — Gmail interface, Google Drive |
   | Zoho Mail | $1/user | Free tier (1 user) | Budget-conscious — full-featured |
   | iCloud+ Custom Domain | $1/month | None | Solo founders already in Apple ecosystem |
   | Fastmail | $5/user | 30 days | Privacy-focused businesses |
3. **DNS setup:** Add MX, SPF, DKIM, and DMARC records (provider gives exact values)
4. **Verify domain ownership** in provider dashboard

#### Email Signature Template
\`\`\`
[Founder Name]
[Title] | [Business Name]
[Phone] | hello@[businessname].com
[Website URL]
[LinkedIn] | [Instagram]
\`\`\`

#### Free Temporary Email (Start Today)
If the domain isn't ready yet, create a free Gmail account NOW so you can start setting up social accounts:
- **Format:** [businessname].official@gmail.com or [businessname].hq@gmail.com
- Go to: accounts.google.com → Create account → For work or my business
- Use this as your placeholder until the custom domain email is live
- All social accounts can be updated to the custom email later

---

### Social Media Account Setup

For each platform below, I provide the EXACT information needed to create and fully configure the account. Set up accounts in this order (each takes 3-5 minutes):

For each RELEVANT platform (include only where this target customer actually spends time; briefly justify each inclusion/exclusion):

#### [Platform Name]
- **Account setup link:** [direct signup URL]
- **Username:** @[recommended_handle] (check availability at namecheckr.com first)
- **Display name:** [Business Name] or [Business Name] | [Tagline snippet]
- **Bio** (include exact character count, keyword-optimized, ready to paste)
- **Profile photo spec:** [dimensions] — use logo or founder headshot
- **Cover/header image spec:** [dimensions]
- **Bio link:** Use linktr.ee/[businessname] or bio.site/[businessname] (free) to consolidate links
- **Category/Business type** to select during setup
- **Content pillars** (2–3 content types that perform on this platform for this business)
- **First 5 posts** with full caption copy and format notes
- **Posting schedule** — frequency and best times for this audience
- **Hashtags** — 8–12 curated hashtags

Platforms to assess: Instagram, Facebook, X/Twitter, TikTok, LinkedIn, Threads, YouTube Shorts

---

### Quick-Start Account Creation Checklist
A step-by-step checklist the founder can complete in one sitting:
- [ ] Create business email (Gmail placeholder or custom domain)
- [ ] Create link-in-bio page (Linktree or bio.site)
- [ ] Set up Instagram Business account
- [ ] Set up Facebook Business Page
- [ ] Set up LinkedIn Company Page
- [ ] Set up X/Twitter account
- [ ] Set up TikTok Business account (if relevant)
- [ ] Set up Google Business Profile (critical for local businesses)
- [ ] Verify email on all platforms
- [ ] Upload profile photos and cover images to all accounts
- [ ] Post first piece of content on primary platform

---

### Google Business Profile Setup (if applicable)
- Go to: business.google.com
- Business name, category, service area
- Operating hours, contact info, website
- Upload 5+ photos on day one (storefront, team, product/service)
- Request first review from a friend or early customer

---

### 30-Day Content Calendar
A day-by-day calendar for the first 30 days — platform, content type, topic/angle, time to post.

---

### Profile Photo & Visual Assets Needed
List all visual assets the founder needs to create before going live (dimensions and specs included).
- Free tools: Canva (templates), Remove.bg (background removal), Unsplash (stock photos)
- AI tools: Ideogram or Recraft for logo drafts, ChatGPT for copy variations`,
    critic: `You are a veteran venture capitalist and serial entrepreneur who has launched 12 businesses and reviewed thousands of business plans. You are conducting an adversarial review of this launch package.

Your job is to find what's wrong, what's missing, and what will cause this business to fail if not addressed. Be specific and constructive — every critique must include a concrete fix.

## Launch Readiness Review

### Overall Assessment
One paragraph: your honest take on the completeness and quality of this launch package. Would you fund this? Would you bet your own money?

### Critical Gaps
List 4-6 specific things missing from the launch package:
| Gap | Why It Matters | Impact if Ignored | Fix |
|-----|---------------|-------------------|-----|

### Riskiest Assumptions
| Assumption | Made In | What Happens if Wrong | How to Test Before Launch |
|------------|---------|----------------------|--------------------------|
List the 5-7 most dangerous assumptions across all deliverables.

### Competitive Vulnerabilities
- What could a well-funded competitor do to kill this business in month 3?
- What's the moat? Is it real?
- Name 1-2 specific scenarios that would be existential threats.

### Financial Reality Check
- Is the budget realistic for what's planned?
- Are the projections too optimistic? By how much?
- What's the real burn rate going to be?
- When do they actually run out of money if nothing goes right?

### Legal Blind Spots
- What legal risks did the Legal Agent miss or understate?
- Any regulatory surprises likely in the first year?

### Launch Readiness Checklist
Rate each area: Ready / Needs Work / Not Ready
| Area | Status | What's Missing |
|------|--------|---------------|
| Entity & Legal | | |
| Financial Infrastructure | | |
| Product/Service | | |
| Brand & Marketing | | |
| Customer Acquisition | | |
| Operations | | |

### The 3 Things to Do Before Anything Else
Numbered list of the 3 highest-priority actions based on everything in this package. These are the "if you do nothing else, do these" items.

### Verdict
One sentence: is this launch package ready for execution, or what needs to happen first?`
};
}),
"[project]/app/api/qa/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/openai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/agents.ts [app-route] (ecmascript)");
;
;
const maxDuration = 30;
const TEST_MODE = process.env.TEST_MODE === "true";
function buildIntakeContext(intake) {
    return `FOUNDER INTAKE:
- Business Idea: ${intake.businessIdea}
- Operating State: ${intake.location}
- Starting Budget: ${intake.budgetRange}
- Entity Preference: ${intake.entityPreference}
- Team Size: ${intake.teamSize}${intake.documents ? `\n- Uploaded Documents:\n${intake.documents}` : ""}`;
}
function buildContextWithHistory(intake, history) {
    const intakeCtx = buildIntakeContext(intake);
    if (!history.length) return intakeCtx;
    const qaCtx = history.map((h, i)=>`Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n\n");
    return `${intakeCtx}\n\nCLARIFYING Q&A:\n${qaCtx}`;
}
/** Try several strategies to extract JSON from a raw LLM response string. */ function extractJSON(raw) {
    if (!raw?.trim()) return null;
    // Strategy 1: direct parse
    try {
        return JSON.parse(raw.trim());
    } catch  {}
    // Strategy 2: strip markdown fences  ```json ... ```
    try {
        const fenced = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        return JSON.parse(fenced);
    } catch  {}
    // Strategy 3: find the first {...} block in the response
    try {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
    } catch  {}
    return null;
}
async function POST(req) {
    try {
        const body = await req.json();
        const { intake, round = 1, history = [], finalize = false } = body;
        if (!intake?.businessIdea) {
            return Response.json({
                error: "businessIdea is required"
            }, {
                status: 400
            });
        }
        if (TEST_MODE) {
            if (finalize) {
                return Response.json({
                    plan: `## Business Overview\n${intake.businessIdea} is positioned for a fast, low-friction launch in ${intake.location}.\n\n## Target Market\nEarly adopters with high urgency and clear willingness to pay.\n\n## Revenue & Pricing Model\nSimple starter package + premium upsell path.\n\n## Competitive Positioning\nFaster execution and clearer onboarding than local alternatives.\n\n## Key Risks\nExecution consistency, channel fit, and cash discipline.\n\n## First 90 Days — Priorities\n1) Validate demand, 2) Formalize entity + banking, 3) Launch offer and acquisition loop.`
                });
            }
            if (round === 1) {
                return Response.json({
                    questions: [
                        {
                            question: "Which business name direction do you prefer?",
                            options: [
                                "Professional and trust-based",
                                "Modern and bold",
                                "Friendly and local"
                            ]
                        },
                        {
                            question: "How should you deliver your core service first?",
                            options: [
                                "Hands-on local delivery",
                                "Fully online workflow",
                                "Hybrid model"
                            ]
                        },
                        {
                            question: "Which customer acquisition channel should lead launch?",
                            options: [
                                "Direct outreach",
                                "Social content",
                                "Referral partnerships"
                            ]
                        }
                    ]
                });
            }
            return Response.json({
                ready: true,
                message: "Great choices — we have enough data to build your launch package."
            });
        }
        const openai = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOpenAI"])();
        const context = buildContextWithHistory(intake, history);
        // ── Finalize: produce a structured plan summary ──────────────────────
        if (finalize) {
            const response = await openai.chat.completions.create({
                model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAT_MODEL"],
                messages: [
                    {
                        role: "system",
                        content: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QA_FINALIZE_PROMPT"]
                    },
                    {
                        role: "user",
                        content: context
                    }
                ],
                max_tokens: 2048
            });
            const plan = response.choices?.[0]?.message?.content ?? "";
            return Response.json({
                plan
            });
        }
        // ── Round 1 or 2: return structured questions ────────────────────────
        const systemPrompt = round === 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QA_ROUND1_PROMPT"] : __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QA_ROUND2_PROMPT"];
        // Append a reminder to the user message so models that ignore system prompts still output JSON
        const userMessage = `${context}\n\nIMPORTANT: Respond with ONLY a raw JSON object (no markdown, no backticks, no explanation). Follow the exact schema in your instructions.`;
        const response = await openai.chat.completions.create({
            model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAT_MODEL"],
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            max_tokens: 1024
        });
        const raw = response.choices?.[0]?.message?.content ?? "";
        const parsed = extractJSON(raw);
        if (!parsed) {
            console.error("Q&A: failed to parse JSON from model response:", raw.slice(0, 300));
            // Return a safe fallback instead of crashing
            return Response.json({
                questions: [
                    {
                        question: "How do you plan to primarily reach your first customers?",
                        options: [
                            "Social media & organic content",
                            "Personal network & word of mouth",
                            "Paid ads or local partnerships"
                        ]
                    },
                    {
                        question: "What's the core way your business makes money?",
                        options: [
                            "Recurring subscription or membership",
                            "Per-session, per-project, or one-time fee",
                            "Product sales or e-commerce"
                        ]
                    },
                    {
                        question: "How will you deliver your product or service?",
                        options: [
                            "In-person or locally",
                            "Fully online or remote",
                            "Hybrid — both in-person and online"
                        ]
                    }
                ]
            });
        }
        if (round === 2) {
            if (parsed.ready === true) {
                return Response.json({
                    ready: true,
                    message: parsed.message ?? "I have everything I need to build your plan!"
                });
            }
            const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
            if (questions.length === 0) {
                return Response.json({
                    ready: true,
                    message: "Perfect — building your plan now!"
                });
            }
            return Response.json({
                ready: false,
                questions: questions.slice(0, 2)
            });
        }
        // Round 1
        const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
        return Response.json({
            questions: questions.slice(0, 4)
        });
    } catch (err) {
        console.error("Q&A route error:", err);
        // Hard fallback — never leave the user stuck
        return Response.json({
            questions: [
                {
                    question: "How do you plan to primarily reach your first customers?",
                    options: [
                        "Social media & organic content",
                        "Personal network & word of mouth",
                        "Paid ads or local partnerships"
                    ]
                },
                {
                    question: "What's the core way your business makes money?",
                    options: [
                        "Recurring subscription or membership",
                        "Per-session, per-project, or one-time fee",
                        "Product sales or e-commerce"
                    ]
                }
            ]
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0bnaim9._.js.map