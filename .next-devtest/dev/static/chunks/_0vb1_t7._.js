(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/types/agents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AccountSetupWizard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountSetupWizard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
const PLATFORMS = [
    {
        id: "google-business",
        label: "Google Business Profile",
        color: "#4285F4",
        signupUrl: "https://business.google.com",
        canAutoCreate: true,
        supportsGoogleSignIn: true,
        iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
    },
    {
        id: "youtube",
        label: "YouTube",
        color: "#FF0000",
        signupUrl: "https://www.youtube.com/create_channel",
        canAutoCreate: true,
        supportsGoogleSignIn: true,
        iconPath: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    },
    {
        id: "instagram",
        label: "Instagram",
        color: "#E4405F",
        signupUrl: "https://www.instagram.com/accounts/emailsignup/",
        canAutoCreate: false,
        supportsGoogleSignIn: false,
        iconPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
    },
    {
        id: "facebook",
        label: "Facebook Page",
        color: "#1877F2",
        signupUrl: "https://www.facebook.com/pages/create",
        canAutoCreate: false,
        supportsGoogleSignIn: false,
        iconPath: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },
    {
        id: "twitter",
        label: "X / Twitter",
        color: "#000000",
        signupUrl: "https://twitter.com/i/flow/signup",
        canAutoCreate: false,
        supportsGoogleSignIn: true,
        iconPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },
    {
        id: "tiktok",
        label: "TikTok",
        color: "#000000",
        signupUrl: "https://www.tiktok.com/signup",
        canAutoCreate: false,
        supportsGoogleSignIn: false,
        iconPath: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    },
    {
        id: "linkedin",
        label: "LinkedIn Page",
        color: "#0A66C2",
        signupUrl: "https://www.linkedin.com/company/setup/new/",
        canAutoCreate: false,
        supportsGoogleSignIn: false,
        iconPath: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    }
];
function generateUsername(businessName) {
    return businessName.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "").slice(0, 20);
}
function CopyButton({ text, label }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: ()=>{
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        },
        className: "flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shrink-0",
        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "#10b981",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M20 6L9 17l-5-5"
                    }, void 0, false, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 121,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/AccountSetupWizard.tsx",
                    lineNumber: 120,
                    columnNumber: 11
                }, this),
                "Copied"
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: "9",
                            y: "9",
                            width: "13",
                            height: "13",
                            rx: "2",
                            ry: "2"
                        }, void 0, false, {
                            fileName: "[project]/components/AccountSetupWizard.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                        }, void 0, false, {
                            fileName: "[project]/components/AccountSetupWizard.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AccountSetupWizard.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this),
                label
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/components/AccountSetupWizard.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(CopyButton, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c = CopyButton;
function PlatformCard({ platform, account, fields, googleConnected, onStatusChange, onAutoCreate, creating }) {
    _s1();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const statusColors = {
        "not-started": "bg-zinc-100 text-zinc-500",
        "in-progress": "bg-amber-100 text-amber-700",
        created: "bg-emerald-100 text-emerald-700",
        skipped: "bg-zinc-100 text-zinc-400"
    };
    const statusLabels = {
        "not-started": "Not started",
        "in-progress": "In progress",
        created: "Created",
        skipped: "Skipped"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl border transition-all ${account.status === "created" ? "border-emerald-200 bg-emerald-50/30" : account.status === "skipped" ? "border-zinc-100 bg-zinc-50/50 opacity-60" : "border-zinc-200 bg-white"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        style: {
                            backgroundColor: `${platform.color}12`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 24 24",
                            fill: platform.color,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: platform.iconPath
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AccountSetupWizard.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-semibold text-zinc-900",
                                children: platform.label
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            account.status === "created" && account.username && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-emerald-600",
                                children: [
                                    "@",
                                    account.username
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 198,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[account.status]}`,
                        children: statusLabels[account.status]
                    }, void 0, false, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setExpanded((v)=>!v),
                        className: "text-zinc-400 hover:text-zinc-700 p-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            className: `transition-transform ${expanded ? "rotate-180" : ""}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M6 9l6 6 6-6"
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AccountSetupWizard.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AccountSetupWizard.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-zinc-100 px-4 py-4 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-400 mb-0.5",
                                                children: "Display Name"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 232,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-zinc-800 font-medium truncate",
                                                children: fields.displayName
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 233,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyButton, {
                                        text: fields.displayName,
                                        label: "Copy"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-400 mb-0.5",
                                                children: "Username"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 239,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-zinc-800 font-mono truncate",
                                                children: [
                                                    "@",
                                                    fields.username
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 238,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyButton, {
                                        text: fields.username,
                                        label: "Copy"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 242,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-400 mb-0.5",
                                                children: "Bio"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-zinc-700 leading-snug line-clamp-3",
                                                children: fields.bio
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 247,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyButton, {
                                        text: fields.bio,
                                        label: "Copy"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 249,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 pt-1",
                        children: [
                            platform.canAutoCreate && googleConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onAutoCreate,
                                disabled: creating || account.status === "created",
                                className: "flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors",
                                children: creating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-3.5 w-3.5 animate-spin",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                                                strokeLinecap: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 265,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                            lineNumber: 264,
                                            columnNumber: 21
                                        }, this),
                                        "Creating..."
                                    ]
                                }, void 0, true) : account.status === "created" ? "Created" : "Auto-Create"
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 256,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    // Copy all fields to clipboard first
                                    const clipText = `Display Name: ${fields.displayName}\nUsername: ${fields.username}\nBio: ${fields.bio}`;
                                    navigator.clipboard.writeText(clipText);
                                    // Open signup in a popup window so user stays on SoloFirm
                                    const w = 600, h = 700;
                                    const left = window.screenX + (window.outerWidth - w) / 2;
                                    const top = window.screenY + (window.outerHeight - h) / 2;
                                    window.open(platform.signupUrl, `${platform.id}_signup`, `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`);
                                    onStatusChange("in-progress");
                                },
                                disabled: account.status === "created",
                                className: "flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "12",
                                        height: "12",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 297,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M15 3h6v6"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 298,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M10 14L21 3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 299,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 296,
                                        columnNumber: 17
                                    }, this),
                                    "Copy Info & Open Signup"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this),
                            platform.supportsGoogleSignIn && !platform.canAutoCreate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 text-xs text-zinc-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "12",
                                        height: "12",
                                        viewBox: "0 0 24 24",
                                        fill: "#4285F4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 308,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                                fill: "#34A853"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 309,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                                fill: "#FBBC05"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 310,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                                fill: "#EA4335"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                                lineNumber: 311,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 307,
                                        columnNumber: 17
                                    }, this),
                                    'Supports "Sign in with Google"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 306,
                                columnNumber: 15
                            }, this),
                            account.status !== "created" && account.status !== "skipped" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>onStatusChange("created"),
                                        className: "rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors",
                                        children: "Mark as Created"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>onStatusChange("skipped"),
                                        className: "rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors",
                                        children: "Skip"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 326,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AccountSetupWizard.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AccountSetupWizard.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_s1(PlatformCard, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c1 = PlatformCard;
function AccountSetupWizard({ presentation, businessLocation }) {
    _s2();
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const googleConnected = !!session?.user;
    const [accounts, setAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AccountSetupWizard.useState": ()=>{
            const init = {};
            for (const p of PLATFORMS){
                init[p.id] = {
                    platformId: p.id,
                    status: "not-started"
                };
            }
            return init;
        }
    }["AccountSetupWizard.useState"]);
    const [creatingGBP, setCreatingGBP] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [creatingYT, setCreatingYT] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const businessName = presentation.businessName;
    const username = generateUsername(businessName);
    const tagline = presentation.tagline;
    const updateAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AccountSetupWizard.useCallback[updateAccount]": (platformId, update)=>{
            setAccounts({
                "AccountSetupWizard.useCallback[updateAccount]": (prev)=>({
                        ...prev,
                        [platformId]: {
                            ...prev[platformId],
                            ...update
                        }
                    })
            }["AccountSetupWizard.useCallback[updateAccount]"]);
        }
    }["AccountSetupWizard.useCallback[updateAccount]"], []);
    const handleAutoCreateGBP = async ()=>{
        setCreatingGBP(true);
        try {
            const res = await fetch("/api/accounts/google-business", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    businessName,
                    description: tagline,
                    address: businessLocation ? {
                        state: businessLocation
                    } : undefined
                })
            });
            const data = await res.json();
            if (data.ok) {
                updateAccount("google-business", {
                    status: "created",
                    url: `https://business.google.com`
                });
            } else {
                // If auto-create fails, fall back to manual
                window.open("https://business.google.com", "_blank");
                updateAccount("google-business", {
                    status: "in-progress"
                });
            }
        } catch  {
            window.open("https://business.google.com", "_blank");
            updateAccount("google-business", {
                status: "in-progress"
            });
        }
        setCreatingGBP(false);
    };
    const handleAutoCreateYT = async ()=>{
        setCreatingYT(true);
        try {
            const res = await fetch("/api/accounts/youtube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    channelName: businessName,
                    description: tagline
                })
            });
            const data = await res.json();
            if (data.ok) {
                updateAccount("youtube", {
                    status: "created",
                    url: data.url
                });
            } else if (data.createUrl) {
                // Channel doesn't exist yet — open creation page in popup
                const w = 600, h = 700;
                const left = window.screenX + (window.outerWidth - w) / 2;
                const top = window.screenY + (window.outerHeight - h) / 2;
                window.open(data.createUrl, "youtube_create", `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`);
                updateAccount("youtube", {
                    status: "in-progress"
                });
            }
        } catch  {
            const w = 600, h = 700;
            const left = window.screenX + (window.outerWidth - w) / 2;
            const top = window.screenY + (window.outerHeight - h) / 2;
            window.open("https://www.youtube.com/create_channel", "youtube_create", `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`);
            updateAccount("youtube", {
                status: "in-progress"
            });
        }
        setCreatingYT(false);
    };
    const completedCount = Object.values(accounts).filter((a)=>a.status === "created" || a.status === "skipped").length;
    const progress = Math.round(completedCount / PLATFORMS.length * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-zinc-900",
                                children: "Set Up Your Accounts"
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 466,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-zinc-500 mt-0.5",
                                children: "We've pre-filled everything. Open each platform, paste your info, and you're live."
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 467,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 w-24 rounded-full bg-zinc-100 overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full bg-emerald-500 transition-all",
                                    style: {
                                        width: `${progress}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/AccountSetupWizard.tsx",
                                    lineNumber: 473,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 472,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-zinc-400",
                                children: [
                                    completedCount,
                                    "/",
                                    PLATFORMS.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 471,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AccountSetupWizard.tsx",
                lineNumber: 464,
                columnNumber: 7
            }, this),
            !googleConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "20",
                                height: "20",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
                                        fill: "#4285F4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 490,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                        fill: "#34A853"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 491,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                        fill: "#FBBC05"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 492,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                        fill: "#EA4335"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AccountSetupWizard.tsx",
                                        lineNumber: 493,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 489,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AccountSetupWizard.tsx",
                            lineNumber: 488,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-zinc-900",
                                    children: "Connect your Google account"
                                }, void 0, false, {
                                    fileName: "[project]/components/AccountSetupWizard.tsx",
                                    lineNumber: 497,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-xs text-zinc-500",
                                    children: [
                                        "Create a new Google account for your business (e.g., ",
                                        username,
                                        '.hq@gmail.com) then connect it here. This unlocks auto-creation for Google Business Profile and enables "Sign in with Google" for other platforms.'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AccountSetupWizard.tsx",
                                    lineNumber: 498,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 flex flex-wrap gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                const w = 600, h = 700;
                                                const left = window.screenX + (window.outerWidth - w) / 2;
                                                const top = window.screenY + (window.outerHeight - h) / 2;
                                                window.open("https://accounts.google.com/signup", "google_signup", `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`);
                                            },
                                            className: "rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors",
                                            children: "1. Create Google Account"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                            lineNumber: 503,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signIn"])("google"),
                                            className: "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "14",
                                                    height: "14",
                                                    viewBox: "0 0 24 24",
                                                    fill: "white",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                                            lineNumber: 525,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                                            lineNumber: 526,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                                            lineNumber: 527,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                                            lineNumber: 528,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AccountSetupWizard.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 19
                                                }, this),
                                                "2. Connect Google Account"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AccountSetupWizard.tsx",
                                            lineNumber: 519,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AccountSetupWizard.tsx",
                                    lineNumber: 502,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AccountSetupWizard.tsx",
                            lineNumber: 496,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AccountSetupWizard.tsx",
                    lineNumber: 487,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AccountSetupWizard.tsx",
                lineNumber: 486,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "#10b981",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M22 11.08V12a10 10 0 11-5.93-9.14"
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 539,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M22 4L12 14.01l-3-3"
                            }, void 0, false, {
                                fileName: "[project]/components/AccountSetupWizard.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 538,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-emerald-800 font-medium",
                        children: [
                            "Connected as ",
                            session.user?.email
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 542,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AccountSetupWizard.tsx",
                lineNumber: 537,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: PLATFORMS.map((platform)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlatformCard, {
                        platform: platform,
                        account: accounts[platform.id],
                        fields: {
                            displayName: businessName,
                            username,
                            bio: `${tagline} | ${businessLocation ?? ""}`.trim().replace(/\|$/, "").trim()
                        },
                        googleConnected: googleConnected,
                        onStatusChange: (status)=>updateAccount(platform.id, {
                                status,
                                username
                            }),
                        onAutoCreate: platform.id === "google-business" ? handleAutoCreateGBP : platform.id === "youtube" ? handleAutoCreateYT : ()=>{},
                        creating: platform.id === "google-business" ? creatingGBP : platform.id === "youtube" ? creatingYT : false
                    }, platform.id, false, {
                        fileName: "[project]/components/AccountSetupWizard.tsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/AccountSetupWizard.tsx",
                lineNumber: 549,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AccountSetupWizard.tsx",
        lineNumber: 462,
        columnNumber: 5
    }, this);
}
_s2(AccountSetupWizard, "T0PhQYlLj8QMS4E3+HnsoOV5z7Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c2 = AccountSetupWizard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CopyButton");
__turbopack_context__.k.register(_c1, "PlatformCard");
__turbopack_context__.k.register(_c2, "AccountSetupWizard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/RoadmapTimeline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RoadmapTimeline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/agents.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Group steps by phase
function groupByPhase(steps) {
    const groups = [];
    for (const step of steps){
        const last = groups[groups.length - 1];
        if (last && last.phase === step.phase) {
            last.steps.push(step);
        } else {
            groups.push({
                phase: step.phase,
                steps: [
                    step
                ]
            });
        }
    }
    return groups;
}
function RoadmapTimeline({ steps, accentColor = "#10b981", onViewAgent, selectedBusinessStructure, onBusinessStructureChange, businessStructureOptions }) {
    _s();
    // Track which steps the user has checked off (persisted to localStorage)
    const [completed, setCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "RoadmapTimeline.useState": ()=>{
            try {
                const saved = localStorage.getItem("solofirm_roadmap_progress");
                return saved ? new Set(JSON.parse(saved)) : new Set();
            } catch  {
                return new Set();
            }
        }
    }["RoadmapTimeline.useState"]);
    const [expandedStep, setExpandedStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const toggleComplete = (id)=>{
        setCompleted((prev)=>{
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            try {
                localStorage.setItem("solofirm_roadmap_progress", JSON.stringify([
                    ...next
                ]));
            } catch  {}
            return next;
        });
    };
    const getStatus = (step, index)=>{
        if (completed.has(step.id)) return "complete";
        // First uncompleted step is "current"
        const firstUncompleted = steps.findIndex((s)=>!completed.has(s.id));
        if (index === firstUncompleted) return "current";
        return "upcoming";
    };
    const completedCount = steps.filter((s)=>completed.has(s.id)).length;
    const progress = steps.length > 0 ? Math.round(completedCount / steps.length * 100) : 0;
    const phaseGroups = groupByPhase(steps);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold text-zinc-900",
                                children: "Your Launch Roadmap"
                            }, void 0, false, {
                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-500 mt-0.5",
                                children: [
                                    completedCount,
                                    " of ",
                                    steps.length,
                                    " steps complete"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RoadmapTimeline.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 w-32 rounded-full bg-zinc-100 overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full transition-all duration-500",
                                    style: {
                                        width: `${progress}%`,
                                        backgroundColor: accentColor
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold",
                                style: {
                                    color: accentColor
                                },
                                children: [
                                    progress,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RoadmapTimeline.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/RoadmapTimeline.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            phaseGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-px flex-1",
                                    style: {
                                        backgroundColor: `${accentColor}30`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold uppercase tracking-widest px-2",
                                    style: {
                                        color: accentColor
                                    },
                                    children: group.phase
                                }, void 0, false, {
                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-px flex-1",
                                    style: {
                                        backgroundColor: `${accentColor}30`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RoadmapTimeline.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute left-[15px] top-0 bottom-0 w-px",
                                    style: {
                                        backgroundColor: `${accentColor}20`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: group.steps.map((step)=>{
                                        const globalIndex = steps.indexOf(step);
                                        const status = getStatus(step, globalIndex);
                                        const isExpanded = expandedStep === step.id;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative pl-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute left-0 top-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>toggleComplete(step.id),
                                                        className: `flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 transition-all ${status === "complete" ? "border-transparent text-white" : status === "current" ? "border-transparent text-white shadow-md" : "border-zinc-200 bg-white text-zinc-300 hover:border-zinc-300"}`,
                                                        style: status === "complete" ? {
                                                            backgroundColor: accentColor
                                                        } : status === "current" ? {
                                                            backgroundColor: accentColor,
                                                            boxShadow: `0 0 0 4px ${accentColor}20`
                                                        } : undefined,
                                                        children: status === "complete" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "14",
                                                            height: "14",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "3",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M20 6L9 17l-5-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                lineNumber: 155,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                            lineNumber: 154,
                                                            columnNumber: 27
                                                        }, this) : status === "current" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "10",
                                                            height: "10",
                                                            viewBox: "0 0 24 24",
                                                            fill: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M5 3l14 9-14 9V3z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "h-2 w-2 rounded-full bg-zinc-200"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RoadmapTimeline.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `rounded-xl border transition-all ${status === "complete" ? "border-zinc-100 bg-zinc-50/50" : status === "current" ? "border-zinc-200 bg-white shadow-sm" : "border-zinc-100 bg-white"}`,
                                                    style: status === "current" ? {
                                                        boxShadow: `0 0 0 1px ${accentColor}30, 0 1px 3px rgba(0,0,0,0.05)`
                                                    } : undefined,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setExpandedStep(isExpanded ? null : step.id),
                                                            className: "flex w-full items-center gap-3 px-4 py-3 text-left",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-sm font-semibold ${status === "complete" ? "text-zinc-400 line-through" : "text-zinc-900"}`,
                                                                                children: step.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                lineNumber: 190,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 189,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3 mt-0.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-zinc-400",
                                                                                    children: step.week
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                    lineNumber: 199,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                step.estimatedTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-zinc-400",
                                                                                    children: step.estimatedTime
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                    lineNumber: 201,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                step.cost && step.cost !== "Free" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-zinc-400",
                                                                                    children: step.cost
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                    lineNumber: 204,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                step.cost === "Free" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium",
                                                                                    style: {
                                                                                        color: accentColor
                                                                                    },
                                                                                    children: "Free"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                    lineNumber: 207,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 198,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 188,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    width: "14",
                                                                    height: "14",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    className: `shrink-0 text-zinc-300 transition-transform ${isExpanded ? "rotate-180" : ""}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M6 9l6 6 6-6"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                        lineNumber: 222,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 211,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                            lineNumber: 183,
                                                            columnNumber: 23
                                                        }, this),
                                                        isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border-t border-zinc-100 px-4 py-4 space-y-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1",
                                                                            children: "Why this matters"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 231,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-zinc-700 leading-relaxed",
                                                                            children: step.why
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 234,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 230,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-lg px-3 py-2.5",
                                                                    style: {
                                                                        backgroundColor: `${accentColor}08`
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-wide mb-1",
                                                                            style: {
                                                                                color: accentColor
                                                                            },
                                                                            children: "Already prepared for you"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 242,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-zinc-700 leading-relaxed",
                                                                            children: step.prepared
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 245,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        step.agentId && onViewAgent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>onViewAgent(step.agentId),
                                                                            className: "mt-1.5 text-xs font-medium hover:underline",
                                                                            style: {
                                                                                color: accentColor
                                                                            },
                                                                            children: [
                                                                                "View ",
                                                                                __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_META"][step.agentId].label,
                                                                                " output →"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 247,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 238,
                                                                    columnNumber: 27
                                                                }, this),
                                                                (step.id === "choose-entity" || /business structure/i.test(step.title)) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1",
                                                                            children: "Choose your business structure"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: selectedBusinessStructure ?? "",
                                                                            onChange: (e)=>onBusinessStructureChange?.(e.target.value),
                                                                            className: "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none",
                                                                            children: (businessStructureOptions?.length ? businessStructureOptions : [
                                                                                "LLC",
                                                                                "S-Corp",
                                                                                "C-Corp",
                                                                                "Sole Proprietorship",
                                                                                "Not sure"
                                                                            ]).map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: option,
                                                                                    children: option
                                                                                }, option, false, {
                                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                    lineNumber: 273,
                                                                                    columnNumber: 35
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 264,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1",
                                                                            children: "Your next action"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 283,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-zinc-800 font-medium leading-relaxed",
                                                                            children: step.action
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 286,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 282,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-2 pt-1",
                                                                    children: [
                                                                        step.actionUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                            href: step.actionUrl,
                                                                            target: "_blank",
                                                                            rel: "noopener noreferrer",
                                                                            className: "flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors",
                                                                            style: {
                                                                                backgroundColor: accentColor
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                    width: "12",
                                                                                    height: "12",
                                                                                    viewBox: "0 0 24 24",
                                                                                    fill: "none",
                                                                                    stroke: "currentColor",
                                                                                    strokeWidth: "2",
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            d: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                            lineNumber: 300,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            d: "M15 3h6v6"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                            lineNumber: 301,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            d: "M10 14L21 3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                            lineNumber: 302,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                    lineNumber: 299,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                "Go to site"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 292,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>toggleComplete(step.id),
                                                                            className: `flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${status === "complete" ? "border-zinc-200 text-zinc-500 hover:text-zinc-700" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`,
                                                                            children: status === "complete" ? "Undo" : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                        width: "12",
                                                                                        height: "12",
                                                                                        viewBox: "0 0 24 24",
                                                                                        fill: "none",
                                                                                        stroke: "currentColor",
                                                                                        strokeWidth: "2.5",
                                                                                        strokeLinecap: "round",
                                                                                        strokeLinejoin: "round",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                            d: "M20 6L9 17l-5-5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                            lineNumber: 321,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                                        lineNumber: 320,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    "Mark complete"
                                                                                ]
                                                                            }, void 0, true)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                            lineNumber: 307,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                                    lineNumber: 290,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                                            lineNumber: 228,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, step.id, true, {
                                            fileName: "[project]/components/RoadmapTimeline.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/RoadmapTimeline.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RoadmapTimeline.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this)
                    ]
                }, group.phase, true, {
                    fileName: "[project]/components/RoadmapTimeline.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/RoadmapTimeline.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(RoadmapTimeline, "4j7IPHmYLE6NnwdeK43Cr6huoPM=");
_c = RoadmapTimeline;
var _c;
__turbopack_context__.k.register(_c, "RoadmapTimeline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/OutputPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarkdownBody",
    ()=>MarkdownBody,
    "PackagingPanel",
    ()=>PackagingPanel,
    "ResultsPresentation",
    ()=>ResultsPresentation,
    "default",
    ()=>OutputPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AgentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AgentCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AccountSetupWizard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AccountSetupWizard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RoadmapTimeline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RoadmapTimeline.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const SECTIONS = [
    {
        id: "roadmap",
        label: "90-Day Plan",
        marker: "## 90-Day Launch Roadmap"
    },
    {
        id: "market",
        label: "Market Intel",
        marker: "## Market Intelligence"
    },
    {
        id: "legal",
        label: "Legal",
        marker: "## Legal Documents & Compliance"
    },
    {
        id: "finance",
        label: "Financial",
        marker: "## Financial Setup Guide"
    },
    {
        id: "brand",
        label: "Brand",
        marker: "## Brand Package"
    },
    {
        id: "social",
        label: "Social Media",
        marker: "## Social Media Launch Kit"
    },
    {
        id: "review",
        label: "Review",
        marker: "## Launch Readiness Review"
    }
];
function splitSections(output) {
    const result = {};
    for(let i = 0; i < SECTIONS.length; i++){
        const section = SECTIONS[i];
        const startIndex = output.indexOf(section.marker);
        if (startIndex === -1) continue;
        let endIndex = output.length;
        for(let j = i + 1; j < SECTIONS.length; j++){
            const nextIdx = output.indexOf(SECTIONS[j].marker);
            if (nextIdx > startIndex) {
                const separatorIdx = output.lastIndexOf("---", nextIdx);
                endIndex = separatorIdx > startIndex ? separatorIdx : nextIdx;
                break;
            }
        }
        result[section.id] = output.slice(startIndex, endIndex).trim();
    }
    return result;
}
function OutputPanel({ finalOutput, isComplete }) {
    _s();
    const firstAvailableTab = SECTIONS[0].id;
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(firstAvailableTab);
    if (!finalOutput && !isComplete) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-zinc-400",
                children: "Your business launch package will appear here once all agents complete."
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/OutputPanel.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this);
    }
    if (!finalOutput) return null;
    const sections = splitSections(finalOutput);
    const hasAnySections = Object.keys(sections).length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between border-b border-zinc-100 px-6 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-zinc-900",
                                children: "Your Business Launch Package"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-xs text-zinc-500",
                                children: "Complete package from 6 specialized AI agents"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    isComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700",
                        children: "Complete"
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            hasAnySections && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-zinc-100 px-4 overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-1 min-w-max",
                    children: SECTIONS.map((section)=>sections[section.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab(section.id),
                            className: `px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === section.id ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"}`,
                            children: section.label
                        }, section.id, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 93,
                            columnNumber: 17
                        }, this) : null)
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 md:p-8",
                children: hasAnySections && sections[activeTab] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarkdownBody, {
                    content: sections[activeTab]
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarkdownBody, {
                    content: finalOutput
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 115,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OutputPanel.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(OutputPanel, "ewlRpwhJH3BczmAjmCp3sXVdFBY=");
_c = OutputPanel;
// ── Branded packaging panel (the new "reveal" experience) ──
const AGENT_IDS = [
    "planner",
    "research",
    "legal",
    "finance",
    "brand",
    "social",
    "critic"
];
function titleCase(value) {
    return value.toLowerCase().split(/\s+/).filter(Boolean).map((w)=>w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function deriveNameSuggestions(presentation, brandContent) {
    const candidates = new Set();
    for (const name of presentation.nameSuggestions ?? []){
        if (name?.trim()) candidates.add(titleCase(name.trim()));
    }
    if (presentation.businessName?.trim()) {
        candidates.add(titleCase(presentation.businessName.trim()));
    }
    const quoted = Array.from(brandContent.matchAll(/["“]([A-Za-z0-9&'\-\s]{3,40})["”]/g)).map((m)=>titleCase(m[1].trim())).filter((name)=>name.split(" ").length <= 4);
    for (const name of quoted)candidates.add(name);
    const seed = titleCase((presentation.businessName || "Nova Launch").split(" ").slice(0, 2).join(" "));
    const generated = [
        `${seed} Labs`,
        `${seed} Studio`,
        `${seed} Works`,
        `${seed} Collective`,
        `${seed} Co.`
    ];
    for (const name of generated)candidates.add(name);
    return Array.from(candidates).filter(Boolean).slice(0, 8);
}
function buildFallbackLogoSvg(presentation) {
    const safeName = (presentation.businessName || "SoloFirm").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeTagline = (presentation.tagline || "Launch your business in one run").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const { primaryColor, secondaryColor, accentColor } = presentation.brandTheme;
    return `<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sf" x1="24" y1="24" x2="296" y2="296"><stop offset="0" stop-color="${secondaryColor}"/><stop offset="1" stop-color="${accentColor}"/></linearGradient></defs><rect x="24" y="24" width="272" height="272" rx="56" fill="url(#sf)"/><path d="M95 188c18 20 36 30 61 30 25 0 40-10 40-25 0-13-8-20-29-24l-31-6c-42-8-62-30-62-64 0-37 31-62 77-62 31 0 59 11 78 31" stroke="white" stroke-width="20" stroke-linecap="round"/><text x="338" y="168" fill="${primaryColor}" font-family="Inter, Arial, sans-serif" font-size="108" font-weight="800">${safeName}</text><text x="342" y="216" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="34">${safeTagline}</text></svg>`;
}
function withLegalSelections(content, presentation) {
    const lines = [
        "## Selected Filing Details",
        `- Business Name: **${presentation.businessName}**`,
        `- Entity Structure: **${presentation.selectedBusinessStructure ?? "Not selected yet"}**`,
        "",
        "---",
        ""
    ];
    return `${lines.join("\n")}${content}`;
}
function PackagingPanel({ presentation, outputs, onPresentationChange, onViewAgent, onFinalize, runId, saving, businessLocation }) {
    _s1();
    const { brandTheme } = presentation;
    const [logoLoading, setLogoLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [logoError, setLogoError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [logoModalOpen, setLogoModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const nameSuggestions = deriveNameSuggestions(presentation, outputs.brand?.content ?? "");
    const currentLogoSvg = presentation.brandTemplate?.logoSvg ?? "";
    const logoDownloadUrl = currentLogoSvg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(currentLogoSvg)}` : "";
    const generateLogo = async ()=>{
        setLogoLoading(true);
        setLogoError(null);
        try {
            const res = await fetch("/api/brand/logo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    businessName: presentation.businessName,
                    tagline: presentation.tagline,
                    brandTheme: presentation.brandTheme,
                    logoPrompt: presentation.brandTemplate?.logoPrompt
                })
            });
            if (!res.ok) {
                const body = await res.json().catch(()=>({}));
                throw new Error(body?.error || "Logo generation failed");
            }
            const data = await res.json();
            if (data?.svg) {
                onPresentationChange({
                    ...presentation,
                    brandTemplate: {
                        ...presentation.brandTemplate ?? {},
                        logoSvg: data.svg
                    }
                });
                setLogoModalOpen(true);
            } else {
                throw new Error("No SVG was returned by the logo service");
            }
        } catch (err) {
            const fallbackSvg = buildFallbackLogoSvg(presentation);
            onPresentationChange({
                ...presentation,
                brandTemplate: {
                    ...presentation.brandTemplate ?? {},
                    logoSvg: fallbackSvg
                }
            });
            setLogoError(err instanceof Error ? err.message : "Could not generate logo from API; fallback logo created.");
            setLogoModalOpen(true);
        } finally{
            setLogoLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm",
                style: {
                    background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-8 sm:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3",
                            children: "Your Business"
                        }, void 0, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: presentation.businessName,
                            onChange: (e)=>onPresentationChange({
                                    ...presentation,
                                    businessName: e.target.value
                                }),
                            className: "block w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-900 border-none outline-none placeholder:text-zinc-300 focus:ring-0 p-0",
                            placeholder: "Business Name"
                        }, void 0, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: presentation.tagline,
                            onChange: (e)=>onPresentationChange({
                                    ...presentation,
                                    tagline: e.target.value
                                }),
                            className: "mt-2 block w-full bg-transparent text-lg text-zinc-500 border-none outline-none placeholder:text-zinc-300 focus:ring-0 p-0",
                            placeholder: "Your tagline"
                        }, void 0, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 flex flex-wrap items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-zinc-400 mr-1",
                                    children: "Theme:"
                                }, void 0, false, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this),
                                [
                                    "primaryColor",
                                    "secondaryColor",
                                    "accentColor"
                                ].map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "group relative cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-7 w-7 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover:scale-110",
                                                style: {
                                                    backgroundColor: brandTheme[key]
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/OutputPanel.tsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "color",
                                                value: brandTheme[key],
                                                onChange: (e)=>onPresentationChange({
                                                        ...presentation,
                                                        brandTheme: {
                                                            ...brandTheme,
                                                            [key]: e.target.value
                                                        }
                                                    }),
                                                className: "absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OutputPanel.tsx",
                                                lineNumber: 305,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: brandTheme.fontFamily,
                                    onChange: (e)=>onPresentationChange({
                                            ...presentation,
                                            brandTheme: {
                                                ...brandTheme,
                                                fontFamily: e.target.value
                                            }
                                        }),
                                    className: "ml-2 rounded-lg border border-zinc-200 bg-white/80 px-3 py-1 text-xs text-zinc-600 w-28 focus:border-zinc-400 focus:outline-none",
                                    placeholder: "Font family"
                                }, void 0, false, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 297,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 271,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            nameSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-zinc-800",
                        children: "Pick your business name"
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 337,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-zinc-500",
                        children: "Choose one option below, or keep editing the custom name above. Your selection will be reflected in your legal package."
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 grid gap-2 sm:grid-cols-2",
                        children: nameSuggestions.map((name)=>{
                            const selected = presentation.businessName === name;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onPresentationChange({
                                        ...presentation,
                                        businessName: name
                                    }),
                                className: `rounded-lg border px-3 py-2 text-left text-sm transition-colors ${selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"}`,
                                children: name
                            }, name, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 345,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 341,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 336,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-zinc-800",
                                        children: "Brand template"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 367,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-500 mt-1",
                                        children: "Generated by the Brand Agent and editable through your final package choices."
                                    }, void 0, false, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 368,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: generateLogo,
                                disabled: logoLoading,
                                className: "rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50",
                                children: logoLoading ? "Generating logo..." : "Generate AI Logo"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 370,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, this),
                    logoError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-amber-700",
                        children: logoError
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this),
                    presentation.brandTemplate?.voice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm text-zinc-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: "Voice:"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 387,
                                columnNumber: 53
                            }, this),
                            " ",
                            presentation.brandTemplate.voice
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 387,
                        columnNumber: 11
                    }, this),
                    presentation.brandTemplate?.pillars?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1",
                                children: "Messaging pillars"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 392,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list-disc ml-4 space-y-1 text-sm text-zinc-700",
                                children: presentation.brandTemplate.pillars.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: p
                                    }, i, false, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 394,
                                        columnNumber: 65
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 393,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 391,
                        columnNumber: 11
                    }, this) : null,
                    presentation.brandTemplate?.logoSvg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-wide text-zinc-500",
                                        children: "AI logo preview"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 402,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setLogoModalOpen(true),
                                                className: "rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900",
                                                children: "Open"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OutputPanel.tsx",
                                                lineNumber: 404,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: logoDownloadUrl,
                                                download: `${presentation.businessName || "solofirm"}-logo.svg`,
                                                className: "rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900",
                                                children: "Download"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OutputPanel.tsx",
                                                lineNumber: 411,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 403,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "[&>svg]:h-24 [&>svg]:w-auto",
                                dangerouslySetInnerHTML: {
                                    __html: presentation.brandTemplate.logoSvg
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 400,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 364,
                columnNumber: 7
            }, this),
            presentation.roadmap && presentation.roadmap.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RoadmapTimeline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    steps: presentation.roadmap,
                    accentColor: brandTheme.accentColor,
                    onViewAgent: onViewAgent,
                    selectedBusinessStructure: presentation.selectedBusinessStructure,
                    onBusinessStructureChange: (value)=>onPresentationChange({
                            ...presentation,
                            selectedBusinessStructure: value
                        }),
                    businessStructureOptions: [
                        "LLC",
                        "S-Corp",
                        "C-Corp",
                        "Sole Proprietorship",
                        "Not sure"
                    ]
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 431,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 430,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-3 text-sm font-medium text-zinc-700",
                        children: "Your Launch Package"
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 446,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 sm:grid-cols-2",
                        children: AGENT_IDS.map((id)=>{
                            const summary = presentation.agentSummaries.find((s)=>s.agentId === id);
                            if (!summary || !outputs[id]?.content) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AgentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SummaryCard"], {
                                agentId: id,
                                summary: summary,
                                content: id === "legal" ? withLegalSelections(outputs[id].content, presentation) : outputs[id].content,
                                brandTheme: brandTheme
                            }, id, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 452,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 447,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AccountSetupWizard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    presentation: presentation,
                    businessLocation: businessLocation
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 466,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 465,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-zinc-700",
                                children: "Happy with your package?"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-zinc-400",
                                children: "Edit the name, tagline, or colors above, then finalize."
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            runId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>navigator.clipboard.writeText(`${window.location.origin}/results/${runId}`),
                                className: "rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors",
                                children: "Copy link"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 480,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onFinalize,
                                disabled: saving,
                                className: "rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50",
                                children: saving ? "Saving..." : "Finalize & Save"
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 478,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 473,
                columnNumber: 7
            }, this),
            logoModalOpen && currentLogoSvg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
                onClick: ()=>setLogoModalOpen(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between border-b border-zinc-100 px-5 py-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-zinc-900",
                                            children: "Generated Logo"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OutputPanel.tsx",
                                            lineNumber: 511,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-zinc-500",
                                            children: "Preview and download for immediate use"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OutputPanel.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 510,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setLogoModalOpen(false),
                                    className: "rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 514,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 509,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 bg-zinc-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-zinc-200 bg-white p-6 [&>svg]:w-full [&>svg]:h-auto",
                                dangerouslySetInnerHTML: {
                                    __html: currentLogoSvg
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/OutputPanel.tsx",
                                lineNumber: 523,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 522,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2 border-t border-zinc-100 px-5 py-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setLogoModalOpen(false),
                                    className: "rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 529,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: logoDownloadUrl,
                                    download: `${presentation.businessName || "solofirm"}-logo.svg`,
                                    className: "rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700",
                                    children: "Download SVG"
                                }, void 0, false, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 536,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 528,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 505,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 501,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OutputPanel.tsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
_s1(PackagingPanel, "LappB4xWXC+bXYxYYwhvNnw1hLQ=");
_c1 = PackagingPanel;
function ResultsPresentation({ presentation, outputs }) {
    const { brandTheme } = presentation;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm",
                style: {
                    background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-8 sm:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl sm:text-4xl font-bold text-zinc-900",
                            children: presentation.businessName
                        }, void 0, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 571,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-lg text-zinc-500",
                            children: presentation.tagline
                        }, void 0, false, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 572,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-5 flex items-center gap-2",
                            children: [
                                [
                                    "primaryColor",
                                    "secondaryColor",
                                    "accentColor"
                                ].map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-5 w-5 rounded-full ring-2 ring-white shadow-sm",
                                        style: {
                                            backgroundColor: brandTheme[key]
                                        }
                                    }, key, false, {
                                        fileName: "[project]/components/OutputPanel.tsx",
                                        lineNumber: 575,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 text-xs text-zinc-400",
                                    children: brandTheme.fontFamily
                                }, void 0, false, {
                                    fileName: "[project]/components/OutputPanel.tsx",
                                    lineNumber: 581,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OutputPanel.tsx",
                            lineNumber: 573,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 570,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 564,
                columnNumber: 7
            }, this),
            presentation.roadmap && presentation.roadmap.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RoadmapTimeline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    steps: presentation.roadmap,
                    accentColor: brandTheme.accentColor
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 589,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 588,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2",
                children: AGENT_IDS.map((id)=>{
                    const summary = presentation.agentSummaries.find((s)=>s.agentId === id);
                    if (!summary || !outputs[id]?.content) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AgentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SummaryCard"], {
                        agentId: id,
                        summary: summary,
                        content: id === "legal" ? withLegalSelections(outputs[id].content, presentation) : outputs[id].content,
                        brandTheme: brandTheme
                    }, id, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 602,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/OutputPanel.tsx",
                lineNumber: 597,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OutputPanel.tsx",
        lineNumber: 562,
        columnNumber: 5
    }, this);
}
_c2 = ResultsPresentation;
function MarkdownBody({ content }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
        remarkPlugins: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        ],
        components: {
            h1: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mt-8 mb-3 text-2xl font-bold text-zinc-900 first:mt-0",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 622,
                    columnNumber: 11
                }, this),
            h2: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mt-7 mb-2 text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-1.5 first:mt-0",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 625,
                    columnNumber: 11
                }, this),
            h3: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "mt-5 mb-2 text-base font-semibold text-zinc-800",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 628,
                    columnNumber: 11
                }, this),
            h4: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: "mt-4 mb-1 text-sm font-semibold text-zinc-700 uppercase tracking-wide",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 631,
                    columnNumber: 11
                }, this),
            p: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-3 text-sm leading-relaxed text-zinc-700",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 634,
                    columnNumber: 11
                }, this),
            ul: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "mb-4 ml-4 space-y-1 list-disc text-zinc-700",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 637,
                    columnNumber: 11
                }, this),
            ol: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    className: "mb-4 ml-4 space-y-1 list-decimal text-zinc-700",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 640,
                    columnNumber: 11
                }, this),
            li: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "text-sm leading-relaxed text-zinc-700 pl-1",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 643,
                    columnNumber: 11
                }, this),
            table: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "my-4 overflow-x-auto rounded-lg border border-zinc-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full border-collapse text-sm",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 647,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 646,
                    columnNumber: 11
                }, this),
            thead: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "bg-zinc-50",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 651,
                    columnNumber: 11
                }, this),
            th: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                    className: "border-b border-zinc-200 px-4 py-2.5 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wide",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 654,
                    columnNumber: 11
                }, this),
            td: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    className: "border-b border-zinc-100 px-4 py-2.5 text-sm text-zinc-700",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 659,
                    columnNumber: 11
                }, this),
            tr: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                    className: "hover:bg-zinc-50 transition-colors",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 664,
                    columnNumber: 11
                }, this),
            strong: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                    className: "font-semibold text-zinc-900",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 667,
                    columnNumber: 11
                }, this),
            em: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                    className: "italic text-zinc-600",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 670,
                    columnNumber: 11
                }, this),
            hr: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                    className: "my-8 border-zinc-200"
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 673,
                    columnNumber: 11
                }, this),
            blockquote: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                    className: "my-4 border-l-4 border-blue-200 bg-blue-50 pl-4 pr-3 py-2 rounded-r-lg text-zinc-700 italic",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 676,
                    columnNumber: 11
                }, this),
            code: ({ children, className })=>{
                const isBlock = className?.includes("language-");
                return isBlock ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                    className: "block my-3 rounded-lg bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 683,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                    className: "rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-800",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 687,
                    columnNumber: 13
                }, this);
            },
            a: ({ children, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: href,
                    className: "text-blue-600 hover:underline",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/OutputPanel.tsx",
                    lineNumber: 693,
                    columnNumber: 11
                }, this),
            input: ({ type, checked })=>{
                if (type === "checkbox") {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: checked ?? false,
                        readOnly: true,
                        className: "mr-2 rounded accent-emerald-600"
                    }, void 0, false, {
                        fileName: "[project]/components/OutputPanel.tsx",
                        lineNumber: 700,
                        columnNumber: 15
                    }, this);
                }
                return null;
            }
        },
        children: content
    }, void 0, false, {
        fileName: "[project]/components/OutputPanel.tsx",
        lineNumber: 618,
        columnNumber: 5
    }, this);
}
_c3 = MarkdownBody;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "OutputPanel");
__turbopack_context__.k.register(_c1, "PackagingPanel");
__turbopack_context__.k.register(_c2, "ResultsPresentation");
__turbopack_context__.k.register(_c3, "MarkdownBody");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AgentCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SummaryCard",
    ()=>SummaryCard,
    "default",
    ()=>AgentCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/agents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OutputPanel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const statusStyles = {
    idle: {
        bg: "bg-zinc-50",
        ring: "ring-zinc-200",
        text: "text-zinc-400",
        dot: "bg-zinc-300",
        label: "Waiting"
    },
    running: {
        bg: "bg-blue-50",
        ring: "ring-blue-300",
        text: "text-blue-700",
        dot: "bg-blue-500 animate-pulse",
        label: "Running"
    },
    complete: {
        bg: "bg-emerald-50",
        ring: "ring-emerald-300",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Done"
    },
    error: {
        bg: "bg-red-50",
        ring: "ring-red-300",
        text: "text-red-700",
        dot: "bg-red-500",
        label: "Error"
    }
};
const AGENT_ICONS = {
    planner: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    research: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    legal: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    finance: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    brand: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    social: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
    critic: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
};
function AgentCard({ agentId, status, content, expanded, onToggle }) {
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_META"][agentId];
    const style = statusStyles[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl ring-1 transition-all ${style.bg} ${style.ring}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onToggle,
                className: "w-full text-left p-4 hover:opacity-80 transition-opacity",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 47,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-zinc-900",
                                                children: meta.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/AgentCard.tsx",
                                                lineNumber: 49,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-0.5 text-xs text-zinc-500",
                                                children: meta.deliverable
                                            }, void 0, false, {
                                                fileName: "[project]/components/AgentCard.tsx",
                                                lineNumber: 50,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xs font-medium ${style.text}`,
                                        children: style.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-zinc-300 text-xs",
                                        children: expanded ? "\u25B2" : "\u25BC"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 56,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentCard.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    status === "running" && content && !expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-zinc-500 line-clamp-2 leading-relaxed",
                        children: content.slice(-200)
                    }, void 0, false, {
                        fileName: "[project]/components/AgentCard.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentCard.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            expanded && content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-white/60 mx-4 mb-4 pt-3 max-h-96 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkdownBody"], {
                    content: content
                }, void 0, false, {
                    fileName: "[project]/components/AgentCard.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AgentCard.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AgentCard.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = AgentCard;
function SummaryCard({ agentId, summary, content, brandTheme }) {
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_META"][agentId];
    const iconPath = AGENT_ICONS[agentId];
    const accentColor = brandTheme?.accentColor ?? "#10b981";
    const primaryColor = brandTheme?.primaryColor ?? "#18181b";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pt-5 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                style: {
                                    backgroundColor: `${accentColor}15`
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: accentColor,
                                    strokeWidth: "1.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: iconPath
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentCard.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium text-zinc-400 uppercase tracking-wide",
                                        children: meta.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-sm font-semibold text-zinc-900 leading-snug",
                                        children: summary.headline
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentCard.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-3 space-y-1.5",
                        children: summary.bullets.map((bullet, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-start gap-2 text-sm text-zinc-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                                        style: {
                                            backgroundColor: accentColor
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "leading-snug",
                                        children: bullet
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentCard.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/AgentCard.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentCard.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-zinc-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setExpanded((v)=>!v),
                        className: "flex w-full items-center justify-between px-5 py-3 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: expanded ? "Hide full analysis" : "View full analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "14",
                                height: "14",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: `transition-transform ${expanded ? "rotate-180" : ""}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6 9l6 6 6-6"
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentCard.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AgentCard.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentCard.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-zinc-100 px-5 py-4 max-h-[500px] overflow-y-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkdownBody"], {
                            content: content
                        }, void 0, false, {
                            fileName: "[project]/components/AgentCard.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AgentCard.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentCard.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AgentCard.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(SummaryCard, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c1 = SummaryCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "AgentCard");
__turbopack_context__.k.register(_c1, "SummaryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AutomationPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AutomationPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const PLATFORMS = [
    "gmail",
    "instagram",
    "facebook",
    "twitter",
    "tiktok",
    "linkedin",
    "youtube"
];
const PLATFORM_LABELS = {
    gmail: "Gmail",
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "X / Twitter",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    youtube: "YouTube"
};
const STATUS_MESSAGES = {
    idle: "Ready to start",
    running: "Working…",
    paused_phone: "Enter your phone number to continue",
    paused_sms: "Enter the verification code sent to your phone",
    paused_captcha: "Complete the step in the browser window, then click Continue",
    complete: "All accounts created!",
    error: "Something went wrong"
};
function AutomationPanel({ businessName }) {
    _s();
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [latestScreenshot, setLatestScreenshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [log, setLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [logOpen, setLogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [credentials, setCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [shownCredentials, setShownCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [completedPlatforms, setCompletedPlatforms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentPlatform, setCurrentPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("gmail");
    const [starting, setStarting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [serverOnline, setServerOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // null = checking
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Check sidecar health on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutomationPanel.useEffect": ()=>{
            fetch("/api/automation/health").then({
                "AutomationPanel.useEffect": (r)=>setServerOnline(r.ok)
            }["AutomationPanel.useEffect"]).catch({
                "AutomationPanel.useEffect": ()=>setServerOnline(false)
            }["AutomationPanel.useEffect"]);
        }
    }["AutomationPanel.useEffect"], []);
    // Focus input when paused
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutomationPanel.useEffect": ()=>{
            if (status === "paused_phone" || status === "paused_sms") {
                inputRef.current?.focus();
            }
        }
    }["AutomationPanel.useEffect"], [
        status
    ]);
    // Track current platform from log messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutomationPanel.useEffect": ()=>{
            const last = [
                ...log
            ].reverse().find({
                "AutomationPanel.useEffect.last": (e)=>e.type === "log" && e.message?.toLowerCase().includes("instagram")
            }["AutomationPanel.useEffect.last"]);
            if (last) setCurrentPlatform("instagram");
        }
    }["AutomationPanel.useEffect"], [
        log
    ]);
    // Track completed platforms from credentials
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutomationPanel.useEffect": ()=>{
            setCompletedPlatforms(Object.keys(credentials));
        }
    }["AutomationPanel.useEffect"], [
        credentials
    ]);
    async function startSession() {
        setStarting(true);
        try {
            const res = await fetch("/api/automation/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    businessName,
                    platforms: [
                        "gmail",
                        "instagram"
                    ]
                })
            });
            if (!res.ok) {
                const body = await res.json().catch(()=>({}));
                throw new Error(body?.error ?? `Server returned ${res.status}`);
            }
            const { sessionId: sid } = await res.json();
            setSessionId(sid);
            connectSSE(sid);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            const isOffline = msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("502") || msg.includes("503");
            if (isOffline) setServerOnline(false);
            setStatus("error");
            setLog((prev)=>[
                    ...prev,
                    {
                        type: "error",
                        message: msg,
                        timestamp: new Date().toISOString()
                    }
                ]);
        } finally{
            setStarting(false);
        }
    }
    function connectSSE(sid) {
        const es = new EventSource(`/api/automation/sessions/${sid}/events`);
        es.onmessage = (e)=>{
            try {
                const entry = JSON.parse(e.data);
                if (entry.type === "screenshot" && entry.screenshotDataUrl) {
                    setLatestScreenshot(entry.screenshotDataUrl);
                } else if (entry.type === "status" && entry.status) {
                    setStatus(entry.status);
                    if (entry.status === "complete") es.close();
                    if (entry.status === "error") es.close();
                } else if (entry.type === "credential" && entry.platform && entry.credentials) {
                    setCredentials((prev)=>({
                            ...prev,
                            [entry.platform]: entry.credentials
                        }));
                } else {
                    setLog((prev)=>[
                            ...prev,
                            entry
                        ]);
                }
            } catch  {}
        };
        es.onerror = ()=>{
            es.close();
            setStatus((s)=>s === "complete" ? s : "error");
        };
    }
    async function submitResume() {
        if (!sessionId || !inputValue.trim()) return;
        const value = inputValue.trim();
        setInputValue("");
        setStatus("running");
        await fetch(`/api/automation/sessions/${sessionId}/resume`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(status === "paused_phone" ? {
                phone: value
            } : {
                code: value
            })
        });
    }
    async function resumeCaptcha() {
        if (!sessionId) return;
        setStatus("running");
        await fetch(`/api/automation/sessions/${sessionId}/resume`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: "continue"
            })
        });
    }
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(()=>{});
    }
    const isPaused = status === "paused_phone" || status === "paused_sms" || status === "paused_captcha";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white px-6 py-5 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-zinc-900",
                        children: "Account Setup"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-sm text-zinc-500",
                        children: "A browser will open and create your Gmail and Instagram accounts automatically. You'll only need to verify your phone number."
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-4 shadow-sm",
                children: PLATFORMS.map((p)=>{
                    const done = completedPlatforms.includes(p);
                    const active = !done && p === currentPlatform && status !== "idle" && status !== "complete";
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${done ? "bg-emerald-500 text-white" : active ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-400"}`,
                                children: done ? "✓" : PLATFORM_LABELS[p][0]
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm font-medium ${done ? "text-emerald-700" : active ? "text-blue-700" : "text-zinc-400"}`,
                                children: PLATFORM_LABELS[p]
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 175,
                                columnNumber: 15
                            }, this),
                            p !== PLATFORMS[PLATFORMS.length - 1] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 text-zinc-200",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 179,
                                columnNumber: 17
                            }, this)
                        ]
                    }, p, true, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 169,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aspect-video w-full relative bg-zinc-100 flex items-center justify-center",
                        children: [
                            latestScreenshot ? // eslint-disable-next-line @next/next/no-img-element
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: latestScreenshot,
                                alt: "Browser preview",
                                className: "h-full w-full object-contain"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "20",
                                            height: "20",
                                            viewBox: "0 0 20 20",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: "2",
                                                    y: "4",
                                                    width: "16",
                                                    height: "13",
                                                    rx: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AutomationPanel.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M2 8h16"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AutomationPanel.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "5",
                                                    cy: "6",
                                                    r: "0.5",
                                                    fill: "currentColor"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AutomationPanel.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "7.5",
                                                    cy: "6",
                                                    r: "0.5",
                                                    fill: "currentColor"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AutomationPanel.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "10",
                                                    cy: "6",
                                                    r: "0.5",
                                                    fill: "currentColor"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AutomationPanel.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AutomationPanel.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-400",
                                        children: "Browser window will appear here"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            status === "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this),
                                    "Live"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center gap-2 px-4 py-3 text-sm ${status === "error" ? "bg-red-50 text-red-700" : status === "complete" ? "bg-emerald-50 text-emerald-700" : isPaused ? "bg-amber-50 text-amber-800" : "bg-white text-zinc-600"}`,
                        children: [
                            status === "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-3.5 w-3.5 animate-spin shrink-0",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/components/AutomationPanel.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: STATUS_MESSAGES[status] ?? status
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            serverOnline === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-amber-900 mb-1",
                        children: "Automation server is not running"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3 text-sm text-amber-700",
                        children: "Open a second terminal in your project folder and run:"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "mb-3 overflow-x-auto rounded-lg bg-amber-100 px-4 py-3 text-xs font-mono text-amber-900 whitespace-pre-wrap",
                        children: `GEMINI_API_KEY=your_key \\\nAUTOMATION_SECRET=dev-secret \\\nnpx ts-node --esm automation-server/index.ts`
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setServerOnline(null);
                            fetch("/api/automation/health").then((r)=>setServerOnline(r.ok)).catch(()=>setServerOnline(false));
                        },
                        className: "rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50",
                        children: "Check again"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 240,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this),
            status === "idle" && serverOnline !== false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: startSession,
                disabled: starting || serverOnline === null,
                className: "flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50",
                children: starting || serverOnline === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-4 w-4 animate-spin",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 264,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AutomationPanel.tsx",
                            lineNumber: 263,
                            columnNumber: 15
                        }, this),
                        serverOnline === null ? "Checking server…" : "Starting…"
                    ]
                }, void 0, true) : "Start Guided Setup →"
            }, void 0, false, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 256,
                columnNumber: 9
            }, this),
            (status === "paused_phone" || status === "paused_sms") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3 text-sm font-medium text-amber-900",
                        children: status === "paused_phone" ? "Enter your phone number" : "Enter the 6-digit code"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: inputRef,
                                type: status === "paused_phone" ? "tel" : "text",
                                value: inputValue,
                                onChange: (e)=>setInputValue(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") submitResume();
                                },
                                placeholder: status === "paused_phone" ? "+1 555 000 0000" : "123456",
                                maxLength: status === "paused_sms" ? 8 : undefined,
                                className: "flex-1 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: submitResume,
                                disabled: !inputValue.trim(),
                                className: "rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-40",
                                children: status === "paused_phone" ? "Send Code" : "Verify"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, this),
            status === "paused_captcha" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3 text-sm font-medium text-amber-900",
                        children: "Complete the step in the browser window, then click Continue."
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: resumeCaptcha,
                        className: "rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700",
                        children: "Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this),
            status === "complete" && Object.keys(credentials).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-zinc-900",
                                children: "Accounts created"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: Object.entries(credentials).map(([platform, creds])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-zinc-100 bg-zinc-50 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                        children: PLATFORM_LABELS[platform]
                                    }, void 0, false, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1.5 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 shrink-0",
                                                        children: "Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-zinc-800 text-xs truncate",
                                                        children: creds.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>copyToClipboard(creds.email),
                                                        className: "shrink-0 text-xs text-zinc-400 hover:text-zinc-700",
                                                        children: "[copy]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AutomationPanel.tsx",
                                                lineNumber: 327,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 shrink-0",
                                                        children: "Username"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-zinc-800 text-xs truncate",
                                                        children: [
                                                            "@",
                                                            creds.username
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>copyToClipboard(creds.username),
                                                        className: "shrink-0 text-xs text-zinc-400 hover:text-zinc-700",
                                                        children: "[copy]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AutomationPanel.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500 shrink-0",
                                                        children: "Password"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-zinc-800 text-xs truncate",
                                                        children: shownCredentials[platform] ? creds.password : "••••••••••••"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex shrink-0 gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setShownCredentials((prev)=>({
                                                                            ...prev,
                                                                            [platform]: !prev[platform]
                                                                        })),
                                                                className: "text-xs text-zinc-400 hover:text-zinc-700",
                                                                children: shownCredentials[platform] ? "hide" : "show"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AutomationPanel.tsx",
                                                                lineNumber: 343,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>copyToClipboard(creds.password),
                                                                className: "text-xs text-zinc-400 hover:text-zinc-700",
                                                                children: "[copy]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AutomationPanel.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/AutomationPanel.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AutomationPanel.tsx",
                                                lineNumber: 337,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 326,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, platform, true, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 324,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 322,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-xs text-amber-600",
                        children: "⚠ Save these credentials now — they are not stored anywhere."
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 356,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 317,
                columnNumber: 9
            }, this),
            status === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-red-200 bg-red-50 p-5 text-center shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-red-700 mb-1",
                        children: "Automation encountered an error"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 365,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-red-500 mb-4",
                        children: "Check the log below for details."
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 366,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setStatus("idle");
                            setSessionId(null);
                            setLatestScreenshot(null);
                            setLog([]);
                            setCredentials({});
                            setCompletedPlatforms([]);
                        },
                        className: "rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-700 hover:bg-red-50",
                        children: "Try Again"
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 367,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 364,
                columnNumber: 9
            }, this),
            log.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setLogOpen((o)=>!o),
                        className: "flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Activity log (",
                                    log.filter((e)=>e.type === "log" || e.type === "error").length,
                                    " entries)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 383,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-zinc-400",
                                children: logOpen ? "▲" : "▼"
                            }, void 0, false, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 384,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this),
                    logOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-48 overflow-y-auto border-t border-zinc-100 px-5 py-3 space-y-1",
                        children: log.filter((e)=>e.type === "log" || e.type === "error").map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex gap-2 text-xs ${entry.type === "error" ? "text-red-600" : "text-zinc-500"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-zinc-300",
                                        children: new Date(entry.timestamp).toLocaleTimeString()
                                    }, void 0, false, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 390,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: entry.message
                                    }, void 0, false, {
                                        fileName: "[project]/components/AutomationPanel.tsx",
                                        lineNumber: 391,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/components/AutomationPanel.tsx",
                                lineNumber: 389,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/AutomationPanel.tsx",
                        lineNumber: 387,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AutomationPanel.tsx",
                lineNumber: 378,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AutomationPanel.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_s(AutomationPanel, "xF3eugs6rNFGirmt6XWMVdKqV+8=");
_c = AutomationPanel;
var _c;
__turbopack_context__.k.register(_c, "AutomationPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/AgentOrchestrator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgentOrchestrator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AgentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AgentCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OutputPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutomationPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AutomationPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/agents.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const AGENT_IDS = [
    "planner",
    "research",
    "legal",
    "finance",
    "brand",
    "social",
    "critic"
];
const STAGES = [
    {
        value: "Solo",
        label: "Solo founder"
    },
    {
        value: "2-3 co-founders",
        label: "2-3 co-founders"
    },
    {
        value: "Small team (4-10)",
        label: "Small team (4-10)"
    }
];
const BUDGETS = [
    {
        value: "$0 - $1,000",
        label: "$0 – $1,000 (bootstrapping)"
    },
    {
        value: "$1,000 - $5,000",
        label: "$1,000 – $5,000"
    },
    {
        value: "$5,000 - $25,000",
        label: "$5,000 – $25,000"
    },
    {
        value: "$25,000+",
        label: "$25,000+"
    }
];
const ENTITIES = [
    {
        value: "LLC",
        label: "LLC"
    },
    {
        value: "S-Corp",
        label: "S-Corp"
    },
    {
        value: "C-Corp",
        label: "C-Corp"
    },
    {
        value: "Sole Proprietorship",
        label: "Sole Proprietorship"
    },
    {
        value: "Not sure",
        label: "Not sure yet"
    }
];
const US_STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];
function makeInitialOutputs() {
    const out = {};
    for (const id of AGENT_IDS){
        out[id] = {
            agentId: id,
            status: "idle",
            content: ""
        };
    }
    return out;
}
const OPTION_LETTERS = [
    "A",
    "B",
    "C",
    "D",
    "E"
];
function QuestionCard({ index, roundIndex, question, selected, otherValue, onToggle, onOtherChange }) {
    const displayNum = roundIndex + index + 1;
    const options = [
        ...question.options,
        "Other — tell me more",
        "I don't know"
    ];
    const isOtherSelected = selected.includes("__other__");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1 text-sm font-medium text-zinc-500",
                children: [
                    "Question ",
                    displayNum
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1 text-base font-semibold text-zinc-900 leading-snug",
                children: question.question
            }, void 0, false, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-4 text-xs text-zinc-400",
                children: "Select all that apply"
            }, void 0, false, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
                children: options.map((opt, j)=>{
                    const key = j === 3 ? "__other__" : opt;
                    const isSelected = selected.includes(key);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onToggle(key),
                        className: `group flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${isSelected ? "border-blue-500 bg-blue-50 text-blue-900" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold transition-colors ${isSelected ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"}`,
                                children: isSelected ? "✓" : OPTION_LETTERS[j]
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "leading-snug",
                                children: opt
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 122,
                                columnNumber: 15
                            }, this)
                        ]
                    }, j, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 103,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            isOtherSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: otherValue,
                    onChange: (e)=>{
                        onOtherChange(e.target.value);
                    },
                    onBlur: ()=>{
                        if (!otherValue.trim()) onToggle("__other__");
                    },
                    placeholder: "Describe your situation…",
                    autoFocus: true,
                    className: "w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                }, void 0, false, {
                    fileName: "[project]/components/AgentOrchestrator.tsx",
                    lineNumber: 130,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AgentOrchestrator.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c = QuestionCard;
function AgentOrchestrator() {
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("intake");
    // Intake form
    const [intake, setIntake] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        businessIdea: "",
        location: "",
        budgetRange: "$1,000 - $5,000",
        entityPreference: "Not sure",
        teamSize: "Solo"
    });
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Q&A state
    const [qaRound, setQaRound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [qaQuestions, setQaQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [qaAnswers, setQaAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [qaOtherValues, setQaOtherValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [qaHistory, setQaHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [qaLoading, setQaLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [qaReadyMessage, setQaReadyMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [planSummary, setPlanSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Agent execution state
    const [outputs, setOutputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(makeInitialOutputs);
    const [finalOutput, setFinalOutput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [runId, setRunId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expandedAgent, setExpandedAgent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentPhase, setCurrentPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Packaging state
    const [presentation, setPresentation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [packagingReady, setPackagingReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ── Persist state across OAuth redirects ──
    const STORAGE_KEY = "solofirm_run_state";
    // Save state to sessionStorage whenever we're in packaging/complete
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentOrchestrator.useEffect": ()=>{
            if ((step === "packaging" || step === "complete") && presentation) {
                const state = {
                    step,
                    intake,
                    outputs,
                    finalOutput,
                    runId,
                    presentation,
                    currentPhase
                };
                try {
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                } catch  {}
            }
        }
    }["AgentOrchestrator.useEffect"], [
        step,
        intake,
        outputs,
        finalOutput,
        runId,
        presentation,
        currentPhase
    ]);
    // Restore state on mount if available
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentOrchestrator.useEffect": ()=>{
            try {
                const saved = sessionStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const state = JSON.parse(saved);
                    if (state.step === "packaging" || state.step === "complete") {
                        setStep(state.step);
                        setIntake(state.intake);
                        setOutputs(state.outputs);
                        setFinalOutput(state.finalOutput);
                        setRunId(state.runId);
                        setPresentation(state.presentation);
                        setCurrentPhase(state.currentPhase);
                    }
                }
            } catch  {}
        }
    }["AgentOrchestrator.useEffect"], []); // eslint-disable-line react-hooks/exhaustive-deps
    const updateAgent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AgentOrchestrator.useCallback[updateAgent]": (agentId, update)=>{
            setOutputs({
                "AgentOrchestrator.useCallback[updateAgent]": (prev)=>({
                        ...prev,
                        [agentId]: {
                            ...prev[agentId],
                            ...update
                        }
                    })
            }["AgentOrchestrator.useCallback[updateAgent]"]);
        }
    }["AgentOrchestrator.useCallback[updateAgent]"], []);
    const handleFileChange = (e)=>{
        const selected = Array.from(e.target.files ?? []);
        setFiles((prev)=>{
            const names = new Set(prev.map((f)=>f.name));
            return [
                ...prev,
                ...selected.filter((f)=>!names.has(f.name))
            ];
        });
    };
    // Resolve the display value for an answer — joins multi-select choices
    const resolveAnswer = (qIndex)=>{
        const selections = qaAnswers[qIndex] ?? [];
        return selections.map((s)=>s === "__other__" ? qaOtherValues[qIndex]?.trim() ?? "" : s).filter(Boolean).join("; ");
    };
    // All current questions have at least one non-empty selection
    const allAnswered = qaQuestions.length > 0 && qaQuestions.every((_, i)=>resolveAnswer(i).trim() !== "");
    // ── Finalize: get plan summary ───────────────────────────────────────────
    const finalizePlan = async (history)=>{
        setQaLoading(true);
        try {
            const res = await fetch("/api/qa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    intake,
                    history,
                    finalize: true
                })
            });
            if (res.ok) {
                const { plan } = await res.json();
                if (plan) setPlanSummary(plan);
            }
        } catch  {} finally{
            setQaLoading(false);
        }
    };
    // ── Retry Q&A after empty result ─────────────────────────────────────────
    const retryQa = async ()=>{
        setQaLoading(true);
        try {
            const res = await fetch("/api/qa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    intake,
                    round: 1,
                    history: []
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.ready) {
                    setQaReadyMessage(data.message ?? "");
                    await finalizePlan([]);
                } else {
                    setQaQuestions(data.questions ?? []);
                    setQaRound(1);
                }
            }
        } catch  {} finally{
            setQaLoading(false);
        }
    };
    // ── Step 1: Submit intake → get round 1 questions ───────────────────────
    const handleIntakeSubmit = async (e)=>{
        e.preventDefault();
        if (!intake.businessIdea.trim() || !intake.location.trim()) return;
        setQaLoading(true);
        // Parse uploaded documents
        let documents = "";
        if (files.length > 0) {
            try {
                const form = new FormData();
                files.forEach((f)=>form.append("files", f));
                const res = await fetch("/api/parse-documents", {
                    method: "POST",
                    body: form
                });
                if (res.ok) {
                    const { text } = await res.json();
                    documents = text ?? "";
                }
            } catch  {}
        }
        const updatedIntake = {
            ...intake,
            documents
        };
        setIntake(updatedIntake);
        try {
            const res = await fetch("/api/qa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    intake: updatedIntake,
                    round: 1,
                    history: []
                })
            });
            if (res.ok) {
                const data = await res.json();
                // If the API returned ready:true immediately (edge case), skip to finalize
                if (data.ready) {
                    setQaReadyMessage(data.message ?? "");
                    setStep("qa");
                    await finalizePlan([]);
                } else {
                    setQaQuestions(data.questions ?? []);
                    setQaRound(1);
                    setStep("qa");
                }
            } else {
                throw new Error("Q&A unavailable");
            }
        } catch  {
            // Skip Q&A entirely on failure
            setStep("running");
            startOrchestration(updatedIntake, "", "");
        } finally{
            setQaLoading(false);
        }
    };
    // ── Step 2: Submit answers → round 2 or finalize ────────────────────────
    const handleQaSubmit = async ()=>{
        if (!allAnswered || qaLoading) return;
        // Build history from current round's answers
        const currentHistory = [
            ...qaHistory,
            ...qaQuestions.map((q, i)=>({
                    question: q.question,
                    answer: resolveAnswer(i)
                }))
        ];
        setQaLoading(true);
        if (qaRound === 2) {
            // Always finalize after round 2
            setQaHistory(currentHistory);
            setQaAnswers({});
            setQaOtherValues({});
            setQaQuestions([]);
            await finalizePlan(currentHistory);
            return;
        }
        // Round 1 done → ask AI if more questions needed
        try {
            const res = await fetch("/api/qa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    intake,
                    round: 2,
                    history: currentHistory
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.ready || !data.questions?.length) {
                    // AI has enough info → auto-finalize
                    setQaReadyMessage(data.message ?? "");
                    setQaHistory(currentHistory);
                    setQaAnswers({});
                    setQaOtherValues({});
                    setQaQuestions([]);
                    await finalizePlan(currentHistory);
                } else {
                    // Show round 2 questions
                    setQaHistory(currentHistory);
                    setQaAnswers({});
                    setQaOtherValues({});
                    setQaQuestions(data.questions);
                    setQaRound(2);
                    setQaLoading(false);
                }
            }
        } catch  {
            // Fallback: finalize anyway
            setQaHistory(currentHistory);
            await finalizePlan(currentHistory);
        }
    };
    // ── Step 3: Launch agents ───────────────────────────────────────────────
    const handleLaunchAgents = ()=>{
        const clarifyingAnswers = qaHistory.map((h)=>`Q: ${h.question}\nA: ${h.answer}`).join("\n\n");
        setStep("running");
        startOrchestration(intake, clarifyingAnswers, planSummary);
    };
    const startOrchestration = async (intakeData, clarifyingAnswers, plan)=>{
        setOutputs(makeInitialOutputs());
        setFinalOutput(null);
        setRunId(null);
        setCurrentPhase(0);
        setExpandedAgent(null);
        abortRef.current = new AbortController();
        try {
            const res = await fetch("/api/orchestrate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...intakeData,
                    clarifyingAnswers,
                    planSummary: plan
                }),
                signal: abortRef.current.signal
            });
            if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, {
                    stream: true
                });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() ?? "";
                for (const line of lines){
                    const match = line.match(/^data: ([\s\S]+)$/);
                    if (!match) continue;
                    try {
                        const event = JSON.parse(match[1]);
                        switch(event.type){
                            case "run_started":
                                setRunId(event.run?.id ?? null);
                                break;
                            case "agent_started":
                                if (event.agentId) {
                                    updateAgent(event.agentId, {
                                        status: "running"
                                    });
                                }
                                break;
                            case "agent_chunk":
                                if (event.agentId && event.content) {
                                    setOutputs((prev)=>({
                                            ...prev,
                                            [event.agentId]: {
                                                ...prev[event.agentId],
                                                content: prev[event.agentId].content + event.content
                                            }
                                        }));
                                }
                                break;
                            case "agent_complete":
                                if (event.agentId) {
                                    updateAgent(event.agentId, {
                                        status: "complete"
                                    });
                                }
                                break;
                            case "agent_error":
                                if (event.agentId) {
                                    updateAgent(event.agentId, {
                                        status: "error",
                                        error: event.error
                                    });
                                }
                                break;
                            case "phase_complete":
                                setCurrentPhase(event.phase ?? 0);
                                break;
                            case "synthesis_complete":
                                if (event.presentation) {
                                    setPresentation(event.presentation);
                                }
                                break;
                            case "run_complete":
                                setFinalOutput(event.run?.final_output ?? null);
                                setRunId(event.run?.id ?? null);
                                if (event.run?.presentation) {
                                    setPresentation(event.run.presentation);
                                }
                                setPackagingReady(true);
                                setStep("packaging");
                                break;
                        }
                    } catch  {}
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
                console.error("Orchestration failed:", err);
            }
        }
    };
    const handleStartOver = ()=>{
        setStep("intake");
        setIntake({
            businessIdea: "",
            location: "",
            budgetRange: "$1,000 - $5,000",
            entityPreference: "Not sure",
            teamSize: "Solo"
        });
        setFiles([]);
        setQaRound(1);
        setQaQuestions([]);
        setQaAnswers({});
        setQaOtherValues({});
        setQaHistory([]);
        setQaLoading(false);
        setQaReadyMessage("");
        setPlanSummary("");
        setOutputs(makeInitialOutputs());
        setFinalOutput(null);
        setRunId(null);
        setCurrentPhase(0);
        setExpandedAgent(null);
        setPresentation(null);
        setPackagingReady(false);
        setSaving(false);
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch  {}
    };
    const handleFinalize = async ()=>{
        if (!runId || !presentation) return;
        setSaving(true);
        try {
            // Persist updated presentation to Supabase via a lightweight API call
            await fetch("/api/finalize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    runId,
                    presentation
                })
            });
        } catch  {}
        setSaving(false);
        setStep("complete");
    };
    const phaseLabels = [
        "Waiting",
        "Planning",
        "Research · Legal · Finance",
        "Brand",
        "Social Media",
        "Review"
    ];
    const getAgentDisplayContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AgentOrchestrator.useCallback[getAgentDisplayContent]": (agentId)=>{
            const base = outputs[agentId]?.content ?? "";
            if (agentId !== "legal") return base;
            if (!presentation) return base;
            return `## Selected Filing Details\n- Business Name: **${presentation.businessName}**\n- Entity Structure: **${presentation.selectedBusinessStructure ?? "Not selected yet"}**\n\n---\n\n${base}`;
        }
    }["AgentOrchestrator.useCallback[getAgentDisplayContent]"], [
        outputs,
        presentation
    ]);
    // ── RENDER ────────────────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-3xl space-y-6 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-xs",
                children: [
                    {
                        key: "intake",
                        label: "Your Business"
                    },
                    {
                        key: "qa",
                        label: "Quick Questions"
                    },
                    {
                        key: "running",
                        label: "Agents Working"
                    },
                    {
                        key: "packaging",
                        label: "Your Brand"
                    },
                    {
                        key: "complete",
                        label: "Launch Package"
                    }
                ].map((s, i, arr)=>{
                    const stepOrder = [
                        "intake",
                        "qa",
                        "running",
                        "packaging",
                        "complete"
                    ];
                    const currentIdx = stepOrder.indexOf(step);
                    const thisIdx = stepOrder.indexOf(s.key);
                    const isDone = currentIdx > thisIdx;
                    const isCurrent = step === s.key;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"}`,
                                        children: isDone ? "✓" : i + 1
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 598,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `font-medium ${isCurrent ? "text-zinc-900" : isDone ? "text-emerald-600" : "text-zinc-400"}`,
                                        children: s.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 609,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 597,
                                columnNumber: 15
                            }, this),
                            i < arr.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `h-px w-6 ${isDone ? "bg-emerald-300" : "bg-zinc-200"}`
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 614,
                                columnNumber: 17
                            }, this)
                        ]
                    }, s.key, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 596,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 581,
                columnNumber: 7
            }, this),
            step === "intake" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleIntakeSubmit,
                className: "space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-zinc-900",
                                children: "Launch Your Business"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 627,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-zinc-500",
                                children: "Describe your idea and our AI team will produce your complete launch package — legal docs, financials, brand, social media, and a 90-day plan."
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 626,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "businessIdea",
                                className: "mb-1.5 block text-sm font-medium text-zinc-700",
                                children: "What's your business idea?"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 634,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                id: "businessIdea",
                                value: intake.businessIdea,
                                onChange: (e)=>setIntake((p)=>({
                                            ...p,
                                            businessIdea: e.target.value
                                        })),
                                placeholder: "e.g., A personal training business in Austin where I offer 1-on-1 coaching for busy professionals who want to get fit without spending hours at the gym.",
                                rows: 4,
                                className: "w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 637,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-zinc-400",
                                children: "The more specific you are, the better your package will be."
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 646,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 633,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "location",
                                        className: "mb-1.5 block text-sm font-medium text-zinc-700",
                                        children: "Where will this operate?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 651,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "location",
                                        value: intake.location,
                                        onChange: (e)=>setIntake((p)=>({
                                                    ...p,
                                                    location: e.target.value
                                                })),
                                        className: "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select a state"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 659,
                                                columnNumber: 17
                                            }, this),
                                            US_STATES.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: s,
                                                    children: s
                                                }, s, false, {
                                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                                    lineNumber: 660,
                                                    columnNumber: 39
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 652,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 650,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "entity",
                                        className: "mb-1.5 block text-sm font-medium text-zinc-700",
                                        children: "Entity type preference"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 664,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "entity",
                                        value: intake.entityPreference,
                                        onChange: (e)=>setIntake((p)=>({
                                                    ...p,
                                                    entityPreference: e.target.value
                                                })),
                                        className: "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                        children: ENTITIES.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: e.value,
                                                children: e.label
                                            }, e.value, false, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 671,
                                                columnNumber: 38
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 665,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 663,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 649,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "budget",
                                        className: "mb-1.5 block text-sm font-medium text-zinc-700",
                                        children: "Starting budget"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 678,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "budget",
                                        value: intake.budgetRange,
                                        onChange: (e)=>setIntake((p)=>({
                                                    ...p,
                                                    budgetRange: e.target.value
                                                })),
                                        className: "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                        children: BUDGETS.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: b.value,
                                                children: b.label
                                            }, b.value, false, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 685,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 679,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 677,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "team",
                                        className: "mb-1.5 block text-sm font-medium text-zinc-700",
                                        children: "Team size"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 689,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "team",
                                        value: intake.teamSize,
                                        onChange: (e)=>setIntake((p)=>({
                                                    ...p,
                                                    teamSize: e.target.value
                                                })),
                                        className: "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                                        children: STAGES.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: s.value,
                                                children: s.label
                                            }, s.value, false, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 696,
                                                columnNumber: 36
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 690,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 688,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 676,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1.5 block text-sm font-medium text-zinc-700",
                                children: [
                                    "Upload documents ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-normal text-zinc-400",
                                        children: "(optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 704,
                                        columnNumber: 32
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 703,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "cursor-pointer rounded-xl border-2 border-dashed border-zinc-200 px-4 py-5 text-center transition-colors hover:border-zinc-300 hover:bg-zinc-50",
                                onClick: ()=>fileInputRef.current?.click(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: fileInputRef,
                                        type: "file",
                                        multiple: true,
                                        accept: ".pdf,.docx,.txt,.md,.csv",
                                        onChange: handleFileChange,
                                        className: "hidden"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 710,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-zinc-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-zinc-700",
                                                children: "Click to upload"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 712,
                                                columnNumber: 17
                                            }, this),
                                            " — pitch deck, business plan, or research"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 711,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs text-zinc-400",
                                        children: "PDF, DOCX, TXT, CSV"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 714,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 706,
                                columnNumber: 13
                            }, this),
                            files.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-2 space-y-1",
                                children: files.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-zinc-700",
                                                children: [
                                                    f.name,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-zinc-400",
                                                        children: [
                                                            "(",
                                                            (f.size / 1024).toFixed(0),
                                                            " KB)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 70
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 720,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setFiles((p)=>p.filter((x)=>x.name !== f.name)),
                                                className: "text-xs text-zinc-400 hover:text-red-500",
                                                children: "✕"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                                lineNumber: 721,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, f.name, true, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 719,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 717,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 702,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: qaLoading || !intake.businessIdea.trim() || !intake.location,
                        className: "flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50",
                        children: qaLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-4 w-4 animate-spin",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 736,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 735,
                                    columnNumber: 17
                                }, this),
                                "Preparing your consultant…"
                            ]
                        }, void 0, true) : "Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 728,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 625,
                columnNumber: 9
            }, this),
            step === "qa" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-zinc-200 bg-white px-6 py-5 shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-semibold text-zinc-900",
                                            children: planSummary ? "Plan ready!" : qaLoading && qaQuestions.length === 0 ? "Reviewing your idea…" : qaRound === 1 ? "A few quick questions" : "One more thing…"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 754,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5 text-sm text-zinc-500",
                                            children: planSummary ? "Your plan summary is ready. Launch the agents to build the full package." : qaLoading && qaQuestions.length === 0 ? "Our AI consultant is reviewing your business idea…" : qaRound === 1 ? "Click the options that best describe your situation. Choose D to write your own answer." : "A couple more questions to sharpen your plan."
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 763,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this),
                                !planSummary && qaQuestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600",
                                    children: [
                                        "Round ",
                                        qaRound,
                                        " of 2"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 774,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AgentOrchestrator.tsx",
                            lineNumber: 752,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 751,
                        columnNumber: 11
                    }, this),
                    qaLoading && qaQuestions.length === 0 && !planSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-12 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5 animate-spin text-zinc-400",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 785,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 784,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-zinc-500",
                                children: qaRound === 1 ? "Reading your idea and preparing questions…" : "Processing your answers…"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 787,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 783,
                        columnNumber: 13
                    }, this),
                    !qaLoading && qaQuestions.length === 0 && !planSummary && !qaReadyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 20 20",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "10",
                                            cy: "10",
                                            r: "8"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 798,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M10 6v5M10 14h.01",
                                            strokeLinecap: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 799,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 797,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 796,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-zinc-700 mb-1",
                                children: "Couldn't load questions"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 802,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-zinc-400 mb-5",
                                children: "There was a problem reaching the AI. You can retry or skip straight to the agents."
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 803,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: retryQa,
                                        className: "rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50",
                                        children: "Retry"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 805,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setStep("running");
                                            startOrchestration(intake, "", "");
                                        },
                                        className: "rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700",
                                        children: "Skip to agents →"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 811,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 804,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 795,
                        columnNumber: 13
                    }, this),
                    qaReadyMessage && !planSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-emerald-800",
                                children: qaReadyMessage
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 824,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-emerald-600",
                                children: "Building your plan summary…"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 825,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 823,
                        columnNumber: 13
                    }, this),
                    qaQuestions.length > 0 && !planSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            qaQuestions.map((q, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionCard, {
                                    index: i,
                                    roundIndex: qaRound === 2 ? qaHistory.length : 0,
                                    question: q,
                                    selected: qaAnswers[i] ?? [],
                                    otherValue: qaOtherValues[i] ?? "",
                                    onToggle: (answer)=>setQaAnswers((prev)=>{
                                            const current = prev[i] ?? [];
                                            const next = current.includes(answer) ? current.filter((a)=>a !== answer) : [
                                                ...current,
                                                answer
                                            ];
                                            return {
                                                ...prev,
                                                [i]: next
                                            };
                                        }),
                                    onOtherChange: (val)=>{
                                        setQaOtherValues((prev)=>({
                                                ...prev,
                                                [i]: val
                                            }));
                                        setQaAnswers((prev)=>{
                                            const current = prev[i] ?? [];
                                            if (!current.includes("__other__")) return {
                                                ...prev,
                                                [i]: [
                                                    ...current,
                                                    "__other__"
                                                ]
                                            };
                                            return prev;
                                        });
                                    }
                                }, `${qaRound}-${i}`, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 833,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleQaSubmit,
                                        disabled: !allAnswered || qaLoading,
                                        className: "flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40",
                                        children: qaLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-4 w-4 animate-spin",
                                                    viewBox: "0 0 24 24",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
                                                        strokeLinecap: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                                    lineNumber: 869,
                                                    columnNumber: 23
                                                }, this),
                                                "Processing…"
                                            ]
                                        }, void 0, true) : qaRound === 2 ? "Build my plan →" : "Continue →"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 862,
                                        columnNumber: 17
                                    }, this),
                                    !allAnswered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-400",
                                        children: "Answer all questions to continue"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 881,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 861,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    planSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 16 16",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M3 8l3.5 3.5L13 4.5",
                                            stroke: "#10b981",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 893,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 892,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 891,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-zinc-900",
                                            children: "Plan summary ready"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 897,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-zinc-500",
                                            children: "Your AI team is ready to build the full package — legal docs, financials, brand identity, social media kit, and your 90-day roadmap."
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 898,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleLaunchAgents,
                                            className: "mt-4 flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700",
                                            children: "Launch 7 Agents →"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 901,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 896,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AgentOrchestrator.tsx",
                            lineNumber: 890,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 889,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 749,
                columnNumber: 9
            }, this),
            step === "running" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: phaseLabels.map((label, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-full px-3 py-1 text-xs font-medium transition-all ${currentPhase > i ? "bg-emerald-100 text-emerald-700" : currentPhase === i ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300" : "bg-zinc-100 text-zinc-400"}`,
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 923,
                                        columnNumber: 17
                                    }, this),
                                    i < phaseLabels.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-px w-4 shrink-0 ${currentPhase > i ? "bg-emerald-300" : "bg-zinc-200"}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 933,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, label, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 922,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 920,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-medium text-zinc-700",
                                        children: "Agents"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 942,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-400",
                                        children: "Click any card to view full output"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 943,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 941,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                                children: AGENT_IDS.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AgentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        agentId: id,
                                        status: outputs[id].status,
                                        content: outputs[id].content,
                                        expanded: false,
                                        onToggle: ()=>outputs[id].content ? setExpandedAgent(id) : undefined
                                    }, id, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 947,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 945,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 940,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            step === "packaging" && presentation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-6 py-8 text-center shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "28",
                                    height: "28",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "#10b981",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M22 11.08V12a10 10 0 11-5.93-9.14"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 970,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M22 4L12 14.01l-3-3"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 971,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 969,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 968,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-zinc-900",
                                children: "Your business is ready"
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 974,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-zinc-500 max-w-md mx-auto",
                                children: "7 AI agents have built your complete launch package. Review your brand, tweak anything you want, then finalize."
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 975,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 967,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PackagingPanel"], {
                        presentation: presentation,
                        outputs: outputs,
                        onPresentationChange: setPresentation,
                        onViewAgent: (agentId)=>setExpandedAgent(agentId),
                        onFinalize: handleFinalize,
                        runId: runId,
                        saving: saving,
                        businessLocation: intake.location
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 980,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            step === "complete" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    presentation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PackagingPanel"], {
                        presentation: presentation,
                        outputs: outputs,
                        onPresentationChange: setPresentation,
                        onViewAgent: (agentId)=>setExpandedAgent(agentId),
                        onFinalize: handleFinalize,
                        runId: runId,
                        saving: saving
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 999,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        finalOutput: finalOutput,
                        isComplete: true
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 1009,
                        columnNumber: 13
                    }, this),
                    runId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-600",
                                children: [
                                    "Shareable link:",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `/results/${runId}`,
                                        className: "font-medium text-blue-600 hover:underline",
                                        children: [
                                            "/results/",
                                            runId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 1014,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>navigator.clipboard.writeText(`${window.location.origin}/results/${runId}`),
                                        className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900",
                                        children: "Copy link"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 1021,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleStartOver,
                                        className: "rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900",
                                        children: "New analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 1020,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 1013,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg",
                                    children: "🚀"
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1042,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-zinc-900",
                                            children: "Create your accounts automatically"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 1044,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-zinc-500",
                                            children: "Your Social Media launch kit is ready. Let an AI agent open Gmail and Instagram, fill in your details, and set up your accounts — you only need to verify your phone."
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 1045,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setStep("automation"),
                                            className: "mt-3 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700",
                                            children: "Start Guided Setup →"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 1048,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1043,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AgentOrchestrator.tsx",
                            lineNumber: 1041,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 1040,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            step === "automation" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setStep("complete"),
                        className: "flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 mb-2",
                        children: "← Back to results"
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 1065,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutomationPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        businessName: intake.businessIdea.split(" ").slice(0, 3).join(" ")
                    }, void 0, false, {
                        fileName: "[project]/components/AgentOrchestrator.tsx",
                        lineNumber: 1071,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 1064,
                columnNumber: 9
            }, this),
            expandedAgent && outputs[expandedAgent]?.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
                onClick: ()=>setExpandedAgent(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-semibold text-zinc-900",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_META"][expandedAgent].label
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 1087,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-zinc-500",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGENT_META"][expandedAgent].deliverable
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 1088,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1086,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setExpandedAgent(null),
                                    className: "rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 16 16",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12.207 3.793a1 1 0 0 1 0 1.414L9.414 8l2.793 2.793a1 1 0 0 1-1.414 1.414L8 9.414l-2.793 2.793a1 1 0 0 1-1.414-1.414L6.586 8 3.793 5.207a1 1 0 0 1 1.414-1.414L8 6.586l2.793-2.793a1 1 0 0 1 1.414 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AgentOrchestrator.tsx",
                                            lineNumber: 1095,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AgentOrchestrator.tsx",
                                        lineNumber: 1094,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1090,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AgentOrchestrator.tsx",
                            lineNumber: 1085,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-y-auto px-6 py-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OutputPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkdownBody"], {
                                content: getAgentDisplayContent(expandedAgent)
                            }, void 0, false, {
                                fileName: "[project]/components/AgentOrchestrator.tsx",
                                lineNumber: 1100,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AgentOrchestrator.tsx",
                            lineNumber: 1099,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center justify-between border-t border-zinc-100 px-6 py-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const idx = AGENT_IDS.indexOf(expandedAgent);
                                        const prev = AGENT_IDS[idx - 1];
                                        if (prev && outputs[prev]?.content) setExpandedAgent(prev);
                                    },
                                    disabled: AGENT_IDS.indexOf(expandedAgent) === 0 || !outputs[AGENT_IDS[AGENT_IDS.indexOf(expandedAgent) - 1]]?.content,
                                    className: "text-xs text-zinc-500 hover:text-zinc-900 disabled:opacity-30",
                                    children: "← Previous"
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1103,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-zinc-400",
                                    children: [
                                        AGENT_IDS.indexOf(expandedAgent) + 1,
                                        " / ",
                                        AGENT_IDS.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1114,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const idx = AGENT_IDS.indexOf(expandedAgent);
                                        const next = AGENT_IDS[idx + 1];
                                        if (next && outputs[next]?.content) setExpandedAgent(next);
                                    },
                                    disabled: AGENT_IDS.indexOf(expandedAgent) === AGENT_IDS.length - 1 || !outputs[AGENT_IDS[AGENT_IDS.indexOf(expandedAgent) + 1]]?.content,
                                    className: "text-xs text-zinc-500 hover:text-zinc-900 disabled:opacity-30",
                                    children: "Next →"
                                }, void 0, false, {
                                    fileName: "[project]/components/AgentOrchestrator.tsx",
                                    lineNumber: 1115,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AgentOrchestrator.tsx",
                            lineNumber: 1102,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AgentOrchestrator.tsx",
                    lineNumber: 1081,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AgentOrchestrator.tsx",
                lineNumber: 1077,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AgentOrchestrator.tsx",
        lineNumber: 578,
        columnNumber: 5
    }, this);
}
_s(AgentOrchestrator, "WOcDYqDBjJteNF3qQObchXgDVcE=");
_c1 = AgentOrchestrator;
var _c, _c1;
__turbopack_context__.k.register(_c, "QuestionCard");
__turbopack_context__.k.register(_c1, "AgentOrchestrator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0vb1_t7._.js.map