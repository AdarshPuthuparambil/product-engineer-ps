import { describe, expect, test } from "vitest";

import { ToolRegistry } from "../src/tools/ToolRegistry";
import { searchLogsTool } from "../src/tools/searchLogs";

describe("Tool Registry", () => {
  test("registers and retrieves a tool by name", () => {
    const registry = new ToolRegistry();

    registry.register(searchLogsTool);

    const tool = registry.get("search_logs");

    expect(tool).toBe(searchLogsTool);
    expect(tool.name).toBe("search_logs");
  });

  test("validates tool arguments", () => {
    const validInput = searchLogsTool.inputSchema.safeParse({
      service: "checkout",
      query: "timeout"
    });

    expect(validInput.success).toBe(true);

    const invalidInput = searchLogsTool.inputSchema.safeParse({
      service: "",
      query: ""
    });

    expect(invalidInput.success).toBe(false);
  });
});