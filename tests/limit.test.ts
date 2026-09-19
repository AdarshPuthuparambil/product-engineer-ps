import { describe, expect, test } from "vitest";

import { AgentRunner } from "../src/agent/AgentRunner";
import { LoopModel } from "../src/agent/LoopModel";

import { ToolRegistry } from "../src/tools/ToolRegistry";
import { getServiceStatusTool } from "../src/tools/getServiceStatus";

describe("Execution limit", () => {
  test("stops exactly at the configured step limit", async () => {
    const registry = new ToolRegistry();

    registry.register(getServiceStatusTool);

    const agent = new AgentRunner(
      new LoopModel(),
      registry,
      3
    );

    const result = await agent.run(
      "Demonstrate execution limit"
    );

    expect(result.status).toBe("limit_reached");

    expect(result.steps).toBe(3);

    const toolCalls = result.trace.filter(
      (event) => event.type === "tool_call"
    );

    expect(toolCalls).toHaveLength(3);

    expect(
      result.trace.some(
        (event) => event.type === "limit"
      )
    ).toBe(true);
  });
});