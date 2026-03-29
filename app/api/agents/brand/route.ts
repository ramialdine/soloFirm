import { createAgentRoute } from "@/lib/agentRoute";

export const POST = createAgentRoute({
  agentId: "brand",
  maxTokens: 4000,
  mode: "context",
});
