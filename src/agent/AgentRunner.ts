import type { Model } from "./FakeModel.js";
import type { ToolRegistry } from "../tools/ToolRegistry.js";
import { TraceCollector } from "../trace/TraceCollector.js";
import type { AgentContext, AgentRunResult, Evidence } from "../types/agent.js";

export class AgentRunner {
  constructor(
    private readonly model: Model,
    private readonly tools: ToolRegistry,
    private readonly maxSteps: number,
  ) {}

  async run(objective: string): Promise<AgentRunResult> {
    const trace = new TraceCollector();

    trace.add({
      type: "objective",
      timestamp: new Date().toISOString(),
      message: objective,
    });

    const context: AgentContext = {
      objective,
      evidence: [],
      toolErrors: [],
      stepCount: 0,
    };
    while (context.stepCount < this.maxSteps) {
      context.stepCount++;

      const decision = await this.model.decide(context);

      if (decision.type === "final") {
        trace.add({
          type: "final",
          timestamp: new Date().toISOString(),
          response: decision.response,
        });

        return {
          status: "completed",
          response: decision.response,
          trace: trace.getAll(),
          steps: context.stepCount,
        };
      }

      trace.add({
        type: "model_decision",
        timestamp: new Date().toISOString(),
        summary: decision.summary,
        toolName: decision.toolName,
      });

      try {
        const tool = this.tools.get(decision.toolName);

        const parsedInput = tool.inputSchema.parse(decision.input);

        trace.add({
          type: "tool_call",
          timestamp: new Date().toISOString(),
          toolName: decision.toolName,
          input: parsedInput,
        });

        const output = await tool.execute(parsedInput);

        trace.add({
          type: "tool_result",
          timestamp: new Date().toISOString(),
          toolName: decision.toolName,
          output,
        });

        const evidence: Evidence = {
          id: `${decision.toolName}-${context.stepCount}`,
          source: decision.toolName,
          data: output,
        };

        context.evidence.push(evidence);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown tool error";
        context.toolErrors.push(`${decision.toolName}: ${message}`);

        trace.add({
          type: "tool_error",
          timestamp: new Date().toISOString(),
          toolName: decision.toolName,
          error: message,
        });
      }
    }

    trace.add({
      type: "limit",
      timestamp: new Date().toISOString(),
      message: `Execution limit of ${this.maxSteps} steps reached.`,
    });

    return {
      status: "limit_reached",
      trace: trace.getAll(),
      steps: context.stepCount,
    };
  }
}
