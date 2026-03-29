import { createAgentRoute } from "@/lib/agentRoute";

export const POST = createAgentRoute({
  agentId: "critic",
  maxTokens: 2000,
  mode: "domain-task",
});
