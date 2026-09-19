import { z } from "zod";

export interface Tool<TInput, TOutput> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;

  execute(input: TInput): Promise<TOutput>;
}