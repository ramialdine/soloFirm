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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
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
"[project]/lib/orchestrator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "orchestrate",
    ()=>orchestrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/agents.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/openai.ts [app-route] (ecmascript)");
;
;
;
const AGENT_TIMEOUT_MS = 60_000;
const TEST_MODE = process.env.TEST_MODE === "true";
function now() {
    return new Date().toISOString();
}
function toTitleCase(value) {
    return value.toLowerCase().split(/\s+/).filter(Boolean).map((w)=>w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function buildNameSuggestions(primary, idea) {
    const cleanPrimary = toTitleCase(primary || "Your Business");
    const words = idea.replace(/[^a-zA-Z0-9\s]/g, " ").split(/\s+/).filter((w)=>w.length > 2).slice(0, 3).map((w)=>toTitleCase(w));
    const stem = words.join(" ") || cleanPrimary;
    const options = [
        cleanPrimary,
        `${stem} Labs`,
        `${stem} Studio`,
        `${stem} Works`,
        `${stem} Collective`,
        `${stem} Co.`
    ];
    return Array.from(new Set(options)).slice(0, 6);
}
function makeEmptyOutputs() {
    const ids = [
        "planner",
        "research",
        "legal",
        "finance",
        "brand",
        "social",
        "critic"
    ];
    const out = {};
    for (const id of ids){
        out[id] = {
            agentId: id,
            status: "idle",
            content: ""
        };
    }
    return out;
}
function buildBusinessContext(intake) {
    const lines = [
        `Business Idea: ${intake.businessIdea}`,
        `Location: ${intake.location}`,
        `Budget: ${intake.budgetRange}`,
        `Entity Preference: ${intake.entityPreference}`,
        `Team: ${intake.teamSize}`
    ];
    if (intake.clarifyingAnswers?.trim()) {
        lines.push("", "--- Founder's Clarifying Answers ---", intake.clarifyingAnswers.trim());
    }
    if (intake.planSummary?.trim()) {
        lines.push("", "--- Business Direction Summary ---", intake.planSummary.trim());
    }
    if (intake.documents?.trim()) {
        lines.push("", "--- Uploaded Documents ---", intake.documents.trim(), "--- End Documents ---");
    }
    return lines.join("\n");
}
async function callAgent(agentId, systemPrompt, userMessage, emit) {
    emit({
        type: "agent_started",
        agentId,
        timestamp: now()
    });
    if (TEST_MODE) {
        const mockContent = {
            planner: `### Week 1-2\n- Validate offer with 10 customer interviews\n- Choose business structure and register entity\n- Apply for EIN and open business checking account\n\n### Week 3-6\n- Build MVP landing page and onboarding flow\n- Finalize pricing and pilot terms\n\n### Week 7-12\n- Launch outreach campaign and track conversion KPIs`,
            research: `### Market Snapshot\n- Primary customer segment identified with urgent pain\n- 5 local and online competitors analyzed\n- Pricing opportunity: premium-lite positioning with faster turnaround`,
            legal: `### Entity + Compliance\n- Recommended: LLC (convert to S-Corp later if tax-efficient)\n- Draft filing checklist and operating agreement outline\n- Required compliance steps listed by state and timeline`,
            finance: `### Financial Setup\n- Business bank + bookkeeping stack recommended\n- 12-month simple cashflow model and breakeven target\n- Weekly KPI dashboard: leads, close rate, CAC, cash runway`,
            brand: `### Brand Package\n- Name candidates, tagline options, voice attributes\n- Color palette + typography pairings\n- Logo concept directions and visual style`,
            social: `### Social Launch Kit\n- Platform prioritization and posting cadence\n- Bio/copy templates and 30-day content prompts\n- Launch-week campaign with CTA and tracking links`,
            critic: `### Critical Review\n- Biggest risk: inconsistent execution cadence\n- Mitigation: weekly operating rhythm and KPI checkpoints\n- Fastest win: targeted offer + direct outreach loop`
        };
        const content = mockContent[agentId];
        emit({
            type: "agent_chunk",
            agentId,
            content,
            timestamp: now()
        });
        emit({
            type: "agent_complete",
            agentId,
            content,
            timestamp: now()
        });
        return content;
    }
    const openai = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOpenAI"])();
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), AGENT_TIMEOUT_MS);
    try {
        const stream = await openai.chat.completions.create({
            model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAT_MODEL"],
            stream: true,
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
            max_tokens: 4000
        }, {
            signal: controller.signal
        });
        let fullContent = "";
        for await (const chunk of stream){
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
                fullContent += delta;
                emit({
                    type: "agent_chunk",
                    agentId,
                    content: delta,
                    timestamp: now()
                });
            }
        }
        clearTimeout(timeout);
        emit({
            type: "agent_complete",
            agentId,
            content: fullContent,
            timestamp: now()
        });
        return fullContent;
    } catch (err) {
        clearTimeout(timeout);
        const isTimeout = err instanceof Error && err.name === "AbortError";
        const fallback = isTimeout ? `[${agentId} timed out after ${AGENT_TIMEOUT_MS / 1000}s — partial results unavailable]` : `[${agentId} encountered an error: ${err instanceof Error ? err.message : "Unknown error"}]`;
        emit({
            type: "agent_error",
            agentId,
            error: fallback,
            timestamp: now()
        });
        return fallback;
    }
}
function isError(content) {
    return content.startsWith("[") && content.includes("error");
}
const SYNTHESIS_PROMPT = `You are a brand synthesis engine. Given a complete business launch package from 7 specialist agents, extract a cohesive presentation layer AND a structured roadmap.

CRITICAL: Return ONLY a valid JSON object — no markdown, no explanation, no preamble.

{
  "businessName": "The best business name from the Brand Agent output (or generate one if none exists)",
  "nameSuggestions": ["Name option 1", "Name option 2", "Name option 3", "Name option 4", "Name option 5"],
  "tagline": "The best tagline from the Brand Agent output",
  "selectedBusinessStructure": "One of: LLC, S-Corp, C-Corp, Sole Proprietorship",
  "brandTheme": {
    "primaryColor": "#hex from brand package color palette",
    "secondaryColor": "#hex from brand package",
    "accentColor": "#hex from brand package",
    "fontFamily": "The heading font recommendation from brand package"
  },
  "brandTemplate": {
    "voice": "2-3 words that define brand voice",
    "pillars": ["pillar 1", "pillar 2", "pillar 3"],
    "taglineVariants": ["variant 1", "variant 2", "variant 3"],
    "visualDirection": "1-2 sentences describing visual style",
    "logoPrompt": "A production-ready prompt for an AI image/logo model"
  },
  "agentSummaries": [
    {
      "agentId": "planner",
      "headline": "One punchy sentence summarizing the planner's key output",
      "bullets": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"]
    },
    { "agentId": "research", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "legal", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "finance", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "brand", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "social", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "critic", "headline": "...", "bullets": ["...", "...", "..."] }
  ],
  "roadmap": [
    {
      "id": "choose-entity",
      "title": "Choose Your Business Structure",
      "week": "Week 1",
      "phase": "Foundation",
      "why": "One sentence on why this matters — specific to THIS business",
      "prepared": "What the launch package already provides (e.g., 'LLC vs S-Corp comparison table in your Legal Package')",
      "action": "Exact next step with specifics (e.g., 'File Articles of Organization at sos.texas.gov — $300 filing fee')",
      "actionUrl": "https://direct-link-if-applicable.gov",
      "agentId": "legal",
      "estimatedTime": "30 minutes",
      "cost": "$300"
    }
  ]
}

Rules for agentSummaries:
- businessName: Use the brand agent's top name recommendation. If none, invent a memorable one.
- nameSuggestions: Provide 4-6 strong options the founder can choose from. Include businessName as one option.
- tagline: Use the brand agent's top tagline pick.
- selectedBusinessStructure: Pick the best recommendation based on Legal + Finance outputs.
- brandTheme colors: Extract exact hex codes from brand package. If unavailable, pick professional defaults.
- fontFamily: Use the heading font from the brand package.
- brandTemplate: Keep it concise and practical (voice, 3 pillars, 3 tagline variants, visual direction, and a detailed logoPrompt for AI generation).
- Each headline should be exciting and specific — NOT generic. Reference the actual business.
- Each bullet: a concrete fact or deliverable, max 15 words.
- Include ALL 7 agents in order: planner, research, legal, finance, brand, social, critic.

Rules for roadmap (VERY IMPORTANT — this is the user's step-by-step journey):
- Extract 12-18 discrete action steps from the Planner, Legal, Finance, Brand, and Social agents.
- Steps must be in chronological order (Week 1 first, Week 12 last).
- Each step must be a SINGLE concrete action, not a category. "Register LLC in Texas" not "Handle legal stuff".
- "why" must be specific to this business — not generic advice.
- "prepared" must reference what's already in their launch package. E.g., "Your Legal Package includes a draft Articles of Organization template" or "See Financial Setup Guide for bank comparison table".
- "action" must be the EXACT next physical step. Include specific websites, costs, timelines.
- "actionUrl" should be the direct URL where they can take action (government websites, signup pages, etc.). Omit if no direct URL.
- "agentId" links to which agent's deliverable is most relevant for this step.
- "estimatedTime" — how long this step takes (e.g., "15 minutes", "1-3 business days").
- "cost" — what it costs, if anything. Use "Free" for free steps.
- Cover these phases in order: Foundation (entity, EIN, bank), Legal & Compliance (licenses, insurance), Product & Brand (website, brand assets), Marketing & Launch (social, content, soft launch), Growth (first customers, metrics).
- The first 3-4 steps should be things they can do TODAY.`;
async function synthesizePresentation(outputs, intake, emit) {
    if (TEST_MODE) {
        const mock = {
            businessName: "SoloSpark",
            nameSuggestions: [
                "SoloSpark",
                "LaunchFoundry",
                "FounderLift",
                "PilotGrid",
                "Northline Studio"
            ],
            tagline: "From idea to launch in one run",
            selectedBusinessStructure: intake.entityPreference || "LLC",
            brandTheme: {
                primaryColor: "#18181b",
                secondaryColor: "#2563eb",
                accentColor: "#10b981",
                fontFamily: "Inter"
            },
            brandTemplate: {
                voice: "Confident, practical, founder-first",
                pillars: [
                    "Clarity",
                    "Execution",
                    "Momentum"
                ],
                taglineVariants: [
                    "Launch faster, smarter",
                    "Build with momentum",
                    "Strategy that ships"
                ],
                visualDirection: "Clean geometric forms, high contrast typography, modern startup aesthetic.",
                logoPrompt: "Create a modern geometric startup logo with icon + wordmark for SoloSpark using deep charcoal, electric blue, and emerald accent."
            },
            agentSummaries: [
                {
                    agentId: "planner",
                    headline: "Your 90-day launch roadmap is set",
                    bullets: [
                        "Priorities sequenced week-by-week",
                        "Critical path is clearly defined",
                        "Immediate actions identified"
                    ]
                },
                {
                    agentId: "research",
                    headline: "Your market opportunity is validated",
                    bullets: [
                        "Customer segment is specific",
                        "Competitive whitespace identified",
                        "Pricing direction established"
                    ]
                },
                {
                    agentId: "legal",
                    headline: "Your legal structure is ready to execute",
                    bullets: [
                        "Entity recommendation prepared",
                        "Compliance checklist provided",
                        "Filing sequence clarified"
                    ]
                },
                {
                    agentId: "finance",
                    headline: "Your financial baseline is investor-ready",
                    bullets: [
                        "Cashflow model established",
                        "Key KPIs selected",
                        "Breakeven target defined"
                    ]
                },
                {
                    agentId: "brand",
                    headline: "Your brand identity is now cohesive",
                    bullets: [
                        "Name options generated",
                        "Voice and messaging aligned",
                        "Visual direction documented"
                    ]
                },
                {
                    agentId: "social",
                    headline: "Your launch content system is ready",
                    bullets: [
                        "Platform strategy prioritized",
                        "30-day content plan included",
                        "CTAs and hooks prepared"
                    ]
                },
                {
                    agentId: "critic",
                    headline: "Your execution risks are now controlled",
                    bullets: [
                        "Top risks surfaced",
                        "Mitigations mapped",
                        "Fastest path to traction identified"
                    ]
                }
            ],
            roadmap: [
                {
                    id: "choose-entity",
                    title: "Choose Your Business Structure",
                    week: "Week 1",
                    phase: "Foundation",
                    why: "This determines liability and tax treatment for your launch.",
                    prepared: "See your Legal Package for entity comparison and recommendation.",
                    action: "Select LLC or S-Corp and confirm with your filing plan.",
                    agentId: "legal",
                    estimatedTime: "15 minutes",
                    cost: "Free"
                },
                {
                    id: "register-entity",
                    title: "Register Your Business",
                    week: "Week 1",
                    phase: "Foundation",
                    why: "Registration unlocks EIN, banking, and contracts.",
                    prepared: "Legal checklist and filing order are prepared for you.",
                    action: "File your entity with the state portal.",
                    agentId: "legal",
                    estimatedTime: "30 minutes",
                    cost: "Varies by state"
                },
                {
                    id: "apply-ein",
                    title: "Apply for EIN",
                    week: "Week 1",
                    phase: "Foundation",
                    why: "You need EIN for banking and taxes.",
                    prepared: "Financial setup guide includes required fields.",
                    action: "Submit EIN application via IRS online portal.",
                    actionUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
                    agentId: "finance",
                    estimatedTime: "10 minutes",
                    cost: "Free"
                }
            ]
        };
        emit({
            type: "synthesis_complete",
            presentation: mock,
            timestamp: now()
        });
        return mock;
    }
    const agentIds = [
        "planner",
        "research",
        "legal",
        "finance",
        "brand",
        "social",
        "critic"
    ];
    const summaryInput = agentIds.map((id)=>`--- ${__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_META"][id].label} Output ---\n${outputs[id].content.slice(0, 2000)}`).join("\n\n");
    try {
        const openai = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOpenAI"])();
        const response = await openai.chat.completions.create({
            model: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAT_MODEL"],
            messages: [
                {
                    role: "system",
                    content: SYNTHESIS_PROMPT
                },
                {
                    role: "user",
                    content: summaryInput
                }
            ],
            max_tokens: 4000
        });
        const raw = response.choices?.[0]?.message?.content ?? "";
        // Parse JSON from response (try direct, then strip markdown)
        let parsed = null;
        try {
            parsed = JSON.parse(raw);
        } catch  {
            const match = raw.match(/\{[\s\S]*\}/);
            if (match) parsed = JSON.parse(match[0]);
        }
        if (parsed && parsed.businessName && parsed.agentSummaries) {
            emit({
                type: "synthesis_complete",
                presentation: parsed,
                timestamp: now()
            });
            return parsed;
        }
    } catch (err) {
        console.error("Synthesis failed:", err);
    }
    // Fallback: build a minimal presentation from raw outputs
    const fallback = {
        businessName: "Your Business",
        nameSuggestions: [
            "Your Business Co.",
            "Summit Launch Studio",
            "Northstar Ventures",
            "Catalyst Collective",
            "Foundry Works"
        ],
        tagline: "Ready to launch",
        selectedBusinessStructure: intake.entityPreference || "Not sure",
        brandTheme: {
            primaryColor: "#18181b",
            secondaryColor: "#3b82f6",
            accentColor: "#10b981",
            fontFamily: "Inter"
        },
        brandTemplate: {
            voice: "Clear, trustworthy, modern",
            pillars: [
                "Credibility",
                "Simplicity",
                "Execution"
            ],
            taglineVariants: [
                "Built to launch",
                "From idea to revenue",
                "Launch in one run"
            ],
            visualDirection: "Minimal modern typography, strong contrast, geometric iconography.",
            logoPrompt: "Design a modern startup logo for 'Your Business' using bold geometric forms, clean sans-serif typography, and a blue/green palette with transparent background."
        },
        agentSummaries: agentIds.map((id)=>({
                agentId: id,
                headline: `${__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_META"][id].deliverable} complete`,
                bullets: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_META"][id].description
                ]
            })),
        roadmap: [
            {
                id: "choose-entity",
                title: "Choose Your Business Structure",
                week: "Week 1",
                phase: "Foundation",
                why: "Your liability protection and tax treatment depend on this decision.",
                prepared: "See your Legal Package for an entity comparison table.",
                action: "Review the Legal Agent's recommendation and decide on LLC vs S-Corp.",
                agentId: "legal",
                estimatedTime: "15 minutes",
                cost: "Free"
            },
            {
                id: "register-entity",
                title: "Register Your Business",
                week: "Week 1",
                phase: "Foundation",
                why: "You can't open a bank account or get an EIN without this.",
                prepared: "Your Legal Package includes a draft Articles of Organization.",
                action: "File with your state's Secretary of State office.",
                agentId: "legal",
                estimatedTime: "30 minutes",
                cost: "Varies by state"
            },
            {
                id: "apply-ein",
                title: "Apply for an EIN",
                week: "Week 1",
                phase: "Foundation",
                why: "Required for business banking, hiring, and tax filing.",
                prepared: "Your Financial Setup Guide has step-by-step EIN instructions.",
                action: "Apply online at irs.gov — instant approval.",
                actionUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
                agentId: "finance",
                estimatedTime: "10 minutes",
                cost: "Free"
            },
            {
                id: "open-bank",
                title: "Open a Business Bank Account",
                week: "Week 2",
                phase: "Foundation",
                why: "Separates personal and business finances from day one.",
                prepared: "Your Financial Setup Guide compares 5 banks with pricing.",
                action: "Pick a bank from the comparison table and apply online.",
                agentId: "finance",
                estimatedTime: "20 minutes",
                cost: "Free"
            },
            {
                id: "setup-brand",
                title: "Finalize Brand Identity",
                week: "Week 3-4",
                phase: "Brand",
                why: "Consistent branding builds trust before you have customers.",
                prepared: "Your Brand Package has colors, fonts, logo concepts, and messaging.",
                action: "Hand the Brand Package to a designer or use Canva to build assets.",
                agentId: "brand",
                estimatedTime: "2-3 hours",
                cost: "Free-$200"
            },
            {
                id: "launch-social",
                title: "Set Up Social Media Accounts",
                week: "Week 4-5",
                phase: "Marketing",
                why: "Your audience needs to find you before launch day.",
                prepared: "Your Social Media Kit has bios, content pillars, and a 30-day calendar.",
                action: "Create accounts using the Account Setup Wizard above.",
                agentId: "social",
                estimatedTime: "1 hour",
                cost: "Free"
            }
        ]
    };
    emit({
        type: "synthesis_complete",
        presentation: fallback,
        timestamp: now()
    });
    return fallback;
}
async function orchestrate(intake, emit) {
    const runId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
    const outputs = makeEmptyOutputs();
    const baseContext = buildBusinessContext(intake);
    const run = {
        id: runId,
        domain: intake.businessIdea,
        task: intake.planSummary ?? intake.businessIdea,
        status: "running",
        agent_outputs: outputs,
        final_output: null,
        presentation: null,
        created_at: now(),
        completed_at: null
    };
    emit({
        type: "run_started",
        run,
        timestamp: now()
    });
    // ── Phase 1: Planner (solo — creates the roadmap everything else references) ──
    const plannerResult = await callAgent("planner", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].planner, baseContext, emit);
    outputs.planner = {
        agentId: "planner",
        status: isError(plannerResult) ? "error" : "complete",
        content: plannerResult,
        completedAt: now()
    };
    emit({
        type: "phase_complete",
        phase: 1,
        timestamp: now()
    });
    // ── Phase 2: Research + Legal + Finance (parallel, gated on Planner) ──
    const phase2Context = `${baseContext}

--- Launch Roadmap (from Planner Agent) ---
${plannerResult}`;
    const [researchResult, legalResult, financeResult] = await Promise.all([
        callAgent("research", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].research, phase2Context, emit),
        callAgent("legal", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].legal, phase2Context, emit),
        callAgent("finance", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].finance, phase2Context, emit)
    ]);
    outputs.research = {
        agentId: "research",
        status: isError(researchResult) ? "error" : "complete",
        content: researchResult,
        completedAt: now()
    };
    outputs.legal = {
        agentId: "legal",
        status: isError(legalResult) ? "error" : "complete",
        content: legalResult,
        completedAt: now()
    };
    outputs.finance = {
        agentId: "finance",
        status: isError(financeResult) ? "error" : "complete",
        content: financeResult,
        completedAt: now()
    };
    emit({
        type: "phase_complete",
        phase: 2,
        timestamp: now()
    });
    // ── Phase 3: Brand (solo, needs Research for competitive context) ──
    const brandContext = `${phase2Context}

--- Market Intelligence (from Research Agent) ---
${researchResult}`;
    const brandResult = await callAgent("brand", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].brand, brandContext, emit);
    outputs.brand = {
        agentId: "brand",
        status: isError(brandResult) ? "error" : "complete",
        content: brandResult,
        completedAt: now()
    };
    emit({
        type: "phase_complete",
        phase: 3,
        timestamp: now()
    });
    // ── Phase 4: Social Media (needs brand for identity context) ──
    const socialContext = `${brandContext}

--- Brand Package (Brand) ---
${brandResult}`;
    const socialResult = await callAgent("social", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].social, socialContext, emit);
    outputs.social = {
        agentId: "social",
        status: isError(socialResult) ? "error" : "complete",
        content: socialResult,
        completedAt: now()
    };
    emit({
        type: "phase_complete",
        phase: 4,
        timestamp: now()
    });
    // ── Phase 5: Critic (reviews everything) ──
    const criticContext = `${baseContext}

--- Launch Roadmap (Planner) ---
${plannerResult}

--- Market Intelligence (Research) ---
${researchResult}

--- Legal Package (Legal) ---
${legalResult}

--- Financial Setup Guide (Finance) ---
${financeResult}

--- Brand Package (Brand) ---
${brandResult}

--- Social Media Launch Kit (Social) ---
${socialResult}`;
    const criticResult = await callAgent("critic", __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AGENT_PROMPTS"].critic, criticContext, emit);
    outputs.critic = {
        agentId: "critic",
        status: isError(criticResult) ? "error" : "complete",
        content: criticResult,
        completedAt: now()
    };
    emit({
        type: "phase_complete",
        phase: 5,
        timestamp: now()
    });
    // ── Synthesis: derive presentation metadata ──
    const presentation = await synthesizePresentation(outputs, intake, emit);
    if (presentation && !presentation.selectedBusinessStructure) {
        presentation.selectedBusinessStructure = intake.entityPreference || "Not sure";
    }
    if (presentation) {
        const generated = buildNameSuggestions(presentation.businessName, intake.businessIdea);
        const merged = Array.from(new Set([
            ...presentation.nameSuggestions ?? [],
            ...generated
        ]));
        presentation.nameSuggestions = merged.slice(0, 6);
    }
    // ── Finalize ──
    const hasErrors = Object.values(outputs).some((o)=>o.status === "error");
    run.agent_outputs = outputs;
    run.presentation = presentation;
    run.final_output = `# Your Business Launch Package

## 90-Day Launch Roadmap
${plannerResult}

---

## Market Intelligence
${researchResult}

---

## Legal Documents & Compliance
${legalResult}

---

## Financial Setup Guide
${financeResult}

---

## Brand Package
${brandResult}

---

## Social Media Launch Kit
${socialResult}

---

## Launch Readiness Review
${criticResult}`;
    run.status = hasErrors ? "partial" : "complete";
    run.completed_at = now();
    emit({
        type: "run_complete",
        run,
        timestamp: now()
    });
    return run;
}
}),
"[project]/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getServiceSupabase",
    ()=>getServiceSupabase,
    "getSupabase",
    ()=>getSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
let _publicClient = null;
function getSupabase() {
    if (!_publicClient) {
        const url = ("TURBOPACK compile-time value", "https://vmrujhyhebidddpuxpxq.supabase.co");
        const key = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcnVqaHloZWJpZGRkcHV4cHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjA3ODgsImV4cCI6MjA5MDI5Njc4OH0.Vi4ZT7fjvY9FS0cgwKVeF0ci9VepdE0rAHfs2-CUppk");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        _publicClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key);
    }
    return _publicClient;
}
let _serviceClient = null;
function getServiceSupabase() {
    if (!_serviceClient) {
        const url = ("TURBOPACK compile-time value", "https://vmrujhyhebidddpuxpxq.supabase.co");
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) throw new Error("Supabase URL and service role key are required");
        _serviceClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key);
    }
    return _serviceClient;
}
}),
"[project]/app/api/orchestrate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$orchestrator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/orchestrator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
;
const maxDuration = 300;
async function POST(req) {
    try {
        const body = await req.json();
        const { businessIdea, location, budgetRange, entityPreference, teamSize, documents, clarifyingAnswers, planSummary } = body;
        if (!businessIdea) {
            return new Response(JSON.stringify({
                error: "businessIdea is required"
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start (controller) {
                const emit = (event)=>{
                    const data = `data: ${JSON.stringify(event)}\n\n`;
                    controller.enqueue(encoder.encode(data));
                };
                try {
                    const run = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$orchestrator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orchestrate"])({
                        businessIdea,
                        location: location || "United States",
                        budgetRange: budgetRange || "Not specified",
                        entityPreference: entityPreference || "Not sure",
                        teamSize: teamSize || "Solo",
                        documents,
                        clarifyingAnswers,
                        planSummary
                    }, emit);
                    // Persist to Supabase (best-effort)
                    try {
                        const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServiceSupabase"])();
                        await sb.from("runs").upsert({
                            id: run.id,
                            domain: run.domain,
                            task: run.task,
                            status: run.status,
                            agent_outputs: run.agent_outputs,
                            final_output: run.final_output,
                            presentation: run.presentation,
                            created_at: run.created_at,
                            completed_at: run.completed_at
                        });
                    } catch  {
                    // best-effort
                    }
                    controller.close();
                } catch (err) {
                    emit({
                        type: "run_error",
                        error: err instanceof Error ? err.message : "Unknown error",
                        timestamp: new Date().toISOString()
                    });
                    controller.close();
                }
            }
        });
        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive"
            }
        });
    } catch  {
        return new Response(JSON.stringify({
            error: "Invalid request body"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0s4nd_x._.js.map