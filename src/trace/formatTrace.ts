import type { Evidence, TraceEvent } from "../types/agent.js";

export function printTrace(events: TraceEvent[]): void {
  console.log("\n========== EXECUTION TRACE ==========\n");

  events.forEach((event: TraceEvent, index: number) => {
    const step = index + 1;

    switch (event.type) {
      case "objective":
        console.log(`[${step}] OBJECTIVE`);
        console.log(`    ${event.message}`);
        break;

      case "model_decision":
        console.log(`[${step}] MODEL DECISION`);
        console.log(`    ${event.summary}`);

        if (event.toolName) {
          console.log(`    Tool: ${event.toolName}`);
        }
        break;

      case "tool_call":
        console.log(`[${step}] TOOL CALL`);
        console.log(`    Tool: ${event.toolName}`);
        console.log(`    Input:`);

        console.log(
          indentJson(event.input, 6)
        );
        break;

      case "tool_result":
        console.log(`[${step}] TOOL RESULT`);
        console.log(`    Tool: ${event.toolName}`);
        console.log(`    Output:`);

        console.log(
          indentJson(event.output, 6)
        );
        break;

      case "tool_error":
        console.log(`[${step}] TOOL ERROR`);
        console.log(`    Tool: ${event.toolName}`);
        console.log(`    Error: ${event.error}`);
        break;

      case "limit":
        console.log(`[${step}] EXECUTION LIMIT`);
        console.log(`    ${event.message}`);
        break;

      case "final":
        console.log(`[${step}] FINAL RESPONSE`);

        console.log("\n    Evidence:");

        event.response.evidence.forEach(
          (evidence: Evidence, evidenceIndex: number) => {
            console.log(
              `    ${evidenceIndex + 1}. ${evidence.source}`
            );

            console.log(
              indentJson(evidence.data, 8)
            );
          }
        );

        console.log("\n    Conclusion:");
        console.log(
          `    ${event.response.conclusion}`
        );

        break;
    }

    console.log();
  });
}

function indentJson(
  value: unknown,
  spaces: number
): string {
  const indentation = " ".repeat(spaces);

  return JSON.stringify(value, null, 2)
    .split("\n")
    .map((line) => `${indentation}${line}`)
    .join("\n");
}