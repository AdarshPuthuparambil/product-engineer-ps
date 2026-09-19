import { z } from "zod";
import type { Tool } from "./Tool.js";
import { metrics } from "../data/fixtures.js";

const inputSchema = z.object({
  service: z.string().min(1),
  metric: z.string().min(1)
});

type Input = z.infer<typeof inputSchema>;

export const getMetricsTool: Tool<Input, unknown> = {
  name: "get_metrics",

  description:
    "Retrieve a metric for a service.",

  inputSchema,

  async execute(input: Input) {
    const result = metrics.find(
      (item: (typeof metrics)[number]) =>
        item.service === input.service &&
        item.metric === input.metric
    );

    if (!result) {
      throw new Error(
        `Metric '${input.metric}' not found for service '${input.service}'`
      );
    }

    return result;
  }
};