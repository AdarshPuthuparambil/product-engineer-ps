import { z } from "zod";
import type { Tool } from "./Tool.js";

const inputSchema = z.object({
  service: z.string().min(1),
  metric: z.string().min(1)
});

type Input = z.infer<typeof inputSchema>;

export const getFailingMetricsTool: Tool<Input, unknown> = {
  name: "get_metrics_failure_demo",

  description:
    "Simulates a temporary metrics service failure.",

  inputSchema,

  async execute() {
    throw new Error("Metrics service temporarily unavailable");
  }
};