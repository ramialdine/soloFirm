import { createAgentRoute } from "@/lib/agentRoute";

export const POST = createAgentRoute({
  agentId: "finance",
  maxTokens: 2000,
  mode: "domain-task",
});
