import { createAgentRoute } from "@/lib/agentRoute";

export const POST = createAgentRoute({
  agentId: "research",
  maxTokens: 2000,
  mode: "domain-task",
});
