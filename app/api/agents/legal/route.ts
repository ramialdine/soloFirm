import { createAgentRoute } from "@/lib/agentRoute";

export const POST = createAgentRoute({
  agentId: "legal",
  maxTokens: 2000,
  mode: "domain-task",
});
