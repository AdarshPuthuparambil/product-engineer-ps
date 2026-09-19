import { z } from "zod";
import type { Tool } from "./Tool.js";
import { serviceStatuses } from "../data/fixtures.js";

const inputSchema = z.object({
  service: z.string().min(1)
});

type Input = z.infer<typeof inputSchema>;

export const getServiceStatusTool: Tool<Input, unknown> = {
  name: "get_service_status",

  description:
    "Get the current service status.",

  inputSchema,

  async execute(input: Input) {
    const result = serviceStatuses.find(
      (item: (typeof serviceStatuses)[number]) => item.service === input.service
    );

    if (!result) {
      throw new Error(
        `Service '${input.service}' not found`
      );
    }

    return result;
  }
};