import type { AgentContext, Decision, Evidence } from "../types/agent.js";

export interface Model {
  decide(context: AgentContext): Promise<Decision>;
}

export class FakeModel implements Model {
  async decide(context: AgentContext): Promise<Decision> {
    const failureScenario = context.objective.toLowerCase().includes("failure");

    const hasLogs = context.evidence.some(
      (e: Evidence) => e.source === "search_logs",
    );

    const hasMetrics =
      context.evidence.some((e: Evidence) => e.source === "get_metrics") ||
      context.toolErrors.some((error: string) =>
        error.startsWith("get_metrics_failure_demo"),
      );

    const hasStatus = context.evidence.some(
      (e: Evidence) => e.source === "get_service_status",
    );

    // Normal scenario
    if (!failureScenario) {
      if (!hasLogs) {
        return {
          type: "tool",
          toolName: "search_logs",
          input: {
            service: "checkout",
            query: "timeout",
          },
          summary: "Search checkout logs for timeout errors.",
        };
      }

      if (!hasMetrics) {
        return {
          type: "tool",
          toolName: "get_metrics",
          input: {
            service: "checkout",
            metric: "latency",
          },
          summary: "Check checkout latency metrics.",
        };
      }

      return {
        type: "final",
        response: {
          evidence: context.evidence,
          conclusion:
            "The available evidence indicates that the checkout service became slow during a period of database timeout errors and elevated latency.",
        },
      };
    }

    // Failure scenario - first search logs
    if (!hasLogs) {
      return {
        type: "tool",
        toolName: "search_logs",
        input: {
          service: "checkout",
          query: "timeout",
        },
        summary: "Search checkout logs for timeout errors.",
      };
    }

    // Failure scenario - deliberately fail metrics tool
    if (
      !context.toolErrors.some((error: string) =>
        error.startsWith("get_metrics_failure_demo"),
      )
    ) {
      return {
        type: "tool",
        toolName: "get_metrics_failure_demo",
        input: {
          service: "checkout",
          metric: "latency",
        },
        summary: "Attempt to retrieve checkout latency metrics.",
      };
    }

    // Recover using service status
    if (!hasStatus) {
      return {
        type: "tool",
        toolName: "get_service_status",
        input: {
          service: "checkout",
        },
        summary: "Check checkout service status after the metrics failure.",
      };
    }

    return {
      type: "final",
      response: {
        evidence: context.evidence,
        conclusion:
          "The available evidence indicates that checkout latency was elevated while database timeout errors were occurring. The available synthetic data supports a correlation, but does not establish causation.",
      },
    };
  }
}
