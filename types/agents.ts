export type AgentId =
  | "research"
  | "finance"
  | "strategy"
  | "legal"
  | "writer"
  | "critic";

export type AgentStatus = "idle" | "running" | "complete" | "error";

export interface AgentOutput {
  agentId: AgentId;
  status: AgentStatus;
  content: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface RunInput {
  domain: string;
  task: string;
}

export interface Run {
  id: string;
  domain: string;
  task: string;
  status: "pending" | "running" | "complete" | "partial" | "error";
  agent_outputs: Record<AgentId, AgentOutput>;
  final_output: string | null;
  created_at: string;
  completed_at: string | null;
}

/** SSE event types sent from the orchestrator */
export type SSEEventType =
  | "run_started"
  | "agent_started"
  | "agent_chunk"
  | "agent_complete"
  | "agent_error"
  | "phase_complete"
  | "run_complete"
  | "run_error";

export interface SSEEvent {
  type: SSEEventType;
  agentId?: AgentId;
  content?: string;
  phase?: number;
  run?: Run;
  error?: string;
  timestamp: string;
}

export const AGENT_META: Record<
  AgentId,
  { label: string; description: string; phase: number }
> = {
  research: {
    label: "Research Agent",
    description: "Market analysis, competitors, and industry trends",
    phase: 1,
  },
  finance: {
    label: "Finance Agent",
    description: "Financial modeling, projections, and risk analysis",
    phase: 1,
  },
  strategy: {
    label: "Strategy Agent",
    description: "Strategic recommendations and action plans",
    phase: 2,
  },
  legal: {
    label: "Legal Agent",
    description: "Regulatory considerations and compliance review",
    phase: 2,
  },
  writer: {
    label: "Writer Agent",
    description: "Synthesizes all findings into a cohesive deliverable",
    phase: 3,
  },
  critic: {
    label: "Critic Agent",
    description: "Identifies gaps, objections, and areas for improvement",
    phase: 4,
  },
};

export const AGENT_PROMPTS: Record<AgentId, string> = {
  research: `You are a senior market research analyst. Given a domain and task, provide comprehensive market research including:
- Industry overview and market size
- Key competitors and their positioning
- Market trends and emerging opportunities
- Target audience analysis
- SWOT analysis for the given context
Be specific with data points and cite plausible industry benchmarks. Format with clear headers and bullet points.`,

  finance: `You are a senior financial analyst. Given a domain and task, provide detailed financial analysis including:
- Revenue model assessment and projections
- Cost structure analysis
- Unit economics breakdown
- Funding/investment considerations
- Key financial risks and mitigation strategies
Use realistic numbers and industry-standard metrics. Format with clear headers and bullet points.`,

  strategy: `You are a senior strategy consultant. Given a domain, task, and prior research/finance findings, provide strategic recommendations including:
- Go-to-market strategy
- Competitive positioning
- Key partnerships and channels
- Growth levers and scaling plan
- 90-day, 6-month, and 12-month milestones
Build directly on the research and financial findings provided. Format with clear headers and bullet points.`,

  legal: `You are a senior legal and compliance advisor. Given a domain, task, and prior research/finance findings, provide legal considerations including:
- Regulatory landscape overview
- Compliance requirements (industry-specific)
- Intellectual property considerations
- Key legal risks and mitigation
- Recommended legal structure and protections
Build directly on the research and financial findings provided. Format with clear headers and bullet points.`,

  writer: `You are an expert business writer and synthesizer. Given all prior agent outputs (research, finance, strategy, legal), produce a comprehensive, executive-ready deliverable that:
- Opens with an executive summary (2-3 paragraphs)
- Integrates all findings into a cohesive narrative
- Highlights key opportunities and risks
- Concludes with prioritized next steps
- Uses professional tone suitable for C-suite or investors
Synthesize — do not just concatenate. Create a unified document with smooth transitions.`,

  critic: `You are a senior critical analyst and devil's advocate. Given the full synthesized deliverable and all agent outputs, provide:
- 3-5 specific gaps or blind spots in the analysis
- Potential objections a skeptical investor or board member would raise
- Assumptions that need validation
- Missing data points or analyses
- Recommended follow-up actions to strengthen the deliverable
Be constructive but rigorous. Your goal is to make the final output bulletproof.`,
};
