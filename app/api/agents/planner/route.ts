import { createAgentRoute } from "@/lib/agentRoute";

export const POST = createAgentRoute({
  agentId: "planner",
  maxTokens: 4000,
  mode: "context",
});
