export type AgentStatus =
  | "running"
  | "completed"
  | "limit_reached"
  | "failed";

export type Decision =
  | {
      type: "tool";
      toolName: string;
      input: unknown;
      summary: string;
    }
  | {
      type: "final";
      response: FinalResponse;
    };

export interface Evidence {
  id: string;
  source: string;
  data: unknown;
}

export interface FinalResponse {
  evidence: Evidence[];
  conclusion: string;
}

export interface AgentContext {
  objective: string;
  evidence: Evidence[];
  toolErrors: string[];
  stepCount: number;
}

export interface AgentRunResult {
  status: AgentStatus;
  response?: FinalResponse;
  trace: TraceEvent[];
  steps: number;
}

export type TraceEvent =
  | {
      type: "objective";
      timestamp: string;
      message: string;
    }
  | {
      type: "model_decision";
      timestamp: string;
      summary: string;
      toolName?: string;
    }
  | {
      type: "tool_call";
      timestamp: string;
      toolName: string;
      input: unknown;
    }
  | {
      type: "tool_result";
      timestamp: string;
      toolName: string;
      output: unknown;
    }
  | {
      type: "tool_error";
      timestamp: string;
      toolName: string;
      error: string;
    }
  | {
      type: "limit";
      timestamp: string;
      message: string;
    }
  | {
      type: "final";
      timestamp: string;
      response: FinalResponse;
    };