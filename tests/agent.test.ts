import { describe, expect, test } from "vitest";

import { AgentRunner } from "../src/agent/AgentRunner";
import { FakeModel } from "../src/agent/FakeModel";

import { ToolRegistry } from "../src/tools/ToolRegistry";
import { searchLogsTool } from "../src/tools/searchLogs";
import { getMetricsTool } from "../src/tools/getMetrics";
import { getServiceStatusTool } from "../src/tools/getServiceStatus";
import { getFailingMetricsTool } from "../src/tools/getFailingMetrics";

describe("Agent loop", () => {
  test("runs a multi-step investigation and produces a final response", async () => {
    const registry = new ToolRegistry();

    registry.register(searchLogsTool);
    registry.register(getMetricsTool);
    registry.register(getServiceStatusTool);
    registry.register(getFailingMetricsTool);

    const agent = new AgentRunner(
      new FakeModel(),
      registry,
      5
    );

    const result = await agent.run(
      "Why did the checkout service become slow?"
    );

    expect(result.status).toBe("completed");

    expect(result.response).toBeDefined();

    expect(
      result.trace.some(
        (event) =>
          event.type === "tool_call" &&
          event.toolName === "search_logs"
      )
    ).toBe(true);

    expect(
      result.trace.some(
        (event) =>
          event.type === "tool_call" &&
          event.toolName === "get_metrics"
      )
    ).toBe(true);

    expect(
      result.trace.some(
        (event) => event.type === "final"
      )
    ).toBe(true);
  });
});