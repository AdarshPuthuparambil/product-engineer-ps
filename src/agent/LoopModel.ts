import type { Model } from "./FakeModel.js";
import type { AgentContext, Decision } from "../types/agent.js";

export class LoopModel implements Model {
  async decide(_context: AgentContext): Promise<Decision> {
    return {
      type: "tool",
      toolName: "get_service_status",
      input: {
        service: "checkout"
      },
      summary: "Continue investigating service status."
    };
  }
}