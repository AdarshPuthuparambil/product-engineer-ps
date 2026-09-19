import { describe, expect, test } from "vitest";

import { AgentRunner } from "../src/agent/AgentRunner";
import { FakeModel } from "../src/agent/FakeModel";

import { ToolRegistry } from "../src/tools/ToolRegistry";
import { searchLogsTool } from "../src/tools/searchLogs";
import { getMetricsTool } from "../src/tools/getMetrics";
import { getServiceStatusTool } from "../src/tools/getServiceStatus";
import { getFailingMetricsTool } from "../src/tools/getFailingMetrics";

describe("Tool failure handling", () => {
  test("records a tool error and recovers using another tool", async () => {
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
      "Investigate checkout failure"
    );

    expect(result.status).toBe("completed");

    expect(
      result.trace.some(
        (event) =>
          event.type === "tool_error" &&
          event.toolName === "get_metrics_failure_demo"
      )
    ).toBe(true);

    expect(
      result.trace.some(
        (event) =>
          event.type === "tool_call" &&
          event.toolName === "get_service_status"
      )
    ).toBe(true);

    expect(
      result.trace.some(
        (event) => event.type === "final"
      )
    ).toBe(true);
  });
});