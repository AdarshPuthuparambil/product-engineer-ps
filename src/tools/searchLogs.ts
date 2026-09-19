import { z } from "zod";
import type { Tool } from "./Tool.js";
import { logs } from "../data/fixtures.js";

const inputSchema = z.object({
  service: z.string().min(1),
  query: z.string().min(1)
});

type Input = z.infer<typeof inputSchema>;

interface Output {
  matches: number;
  events: typeof logs;
}

export const searchLogsTool: Tool<Input, Output> = {
  name: "search_logs",

  description:
    "Search application logs for a service and query text.",

  inputSchema,

  async execute(input: Input) {
    const serviceLogs = logs.filter(
      (log: (typeof logs)[number]) =>
        log.service === input.service &&
        log.message.toLowerCase().includes(input.query.toLowerCase())
    );

    return {
      matches: serviceLogs.length,
      events: serviceLogs
    };
  }
};