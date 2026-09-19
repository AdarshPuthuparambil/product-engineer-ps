import readline from "node:readline";

import { AgentRunner } from "./agent/AgentRunner.js";
import { FakeModel } from "./agent/FakeModel.js";
import { LoopModel } from "./agent/LoopModel.js";

import { ToolRegistry } from "./tools/ToolRegistry.js";
import { searchLogsTool } from "./tools/searchLogs.js";
import { getMetricsTool } from "./tools/getMetrics.js";
import { getServiceStatusTool } from "./tools/getServiceStatus.js";
import { getFailingMetricsTool } from "./tools/getFailingMetrics.js";

import { printTrace } from "./trace/formatTrace.js";

const registry = new ToolRegistry();

function registerTools(): void {
  registry.register(searchLogsTool);
  registry.register(getMetricsTool);
  registry.register(getServiceStatusTool);
  registry.register(getFailingMetricsTool);
}

function printHeader(): void {
  console.log("\n========================================");
  console.log("       CAYGNUS OBSERVABLE AGENT");
  console.log("========================================");
}

function printAvailableTools(): void {
  console.log("\nAvailable tools:");

  for (const tool of registry.list()) {
    console.log(`- ${tool}`);
  }
}

async function runNormalInvestigation(): Promise<void> {
  console.log("\n========================================");
  console.log("       NORMAL INVESTIGATION");
  console.log("========================================");

  const agent = new AgentRunner(
    new FakeModel(),
    registry,
    5
  );

  const result = await agent.run(
    "Why did the checkout service become slow?"
  );

  printTrace(result.trace);

  console.log("========== RUN STATUS ==========");
  console.log(`Status: ${result.status}`);
  console.log(`Steps: ${result.steps}`);
}

async function runFailureRecovery(): Promise<void> {
  console.log("\n========================================");
  console.log("     TOOL FAILURE + RECOVERY");
  console.log("========================================");

  const agent = new AgentRunner(
    new FakeModel(),
    registry,
    5
  );

  const result = await agent.run(
    "Investigate checkout failure"
  );

  printTrace(result.trace);

  console.log("========== RUN STATUS ==========");
  console.log(`Status: ${result.status}`);
  console.log(`Steps: ${result.steps}`);
}

async function runExecutionLimit(): Promise<void> {
  console.log("\n========================================");
  console.log("        EXECUTION LIMIT");
  console.log("========================================");

  const maxSteps = 3;

  console.log(`Configured maximum steps: ${maxSteps}`);

  const agent = new AgentRunner(
    new LoopModel(),
    registry,
    maxSteps
  );

  const result = await agent.run(
    "Demonstrate execution limit"
  );

  printTrace(result.trace);

  console.log("========== RUN STATUS ==========");
  console.log(`Status: ${result.status}`);
  console.log(`Steps: ${result.steps}`);
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function ask(
  rl: readline.Interface,
  question: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main(): Promise<void> {
  registerTools();

  printHeader();
  printAvailableTools();

  const rl = createInterface();

  try {
    let running = true;

    while (running) {
      console.log("\n========================================");
      console.log("             SELECT SCENARIO");
      console.log("========================================");
      console.log("1. Normal investigation");
      console.log("2. Tool failure + recovery");
      console.log("3. Execution limit");
      console.log("4. List available tools");
      console.log("5. Exit");

      const choice = (
        await ask(rl, "\nEnter choice: ")
      ).trim();

      switch (choice) {
        case "1":
          await runNormalInvestigation();
          break;

        case "2":
          await runFailureRecovery();
          break;

        case "3":
          await runExecutionLimit();
          break;

        case "4":
          printAvailableTools();
          break;

        case "5":
          running = false;
          console.log("\nGoodbye.");
          break;

        default:
          console.log(
            "\nInvalid choice. Please select 1-5."
          );
      }
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error("\nApplication error:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});