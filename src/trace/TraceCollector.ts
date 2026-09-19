import type { TraceEvent } from "../types/agent.js";

export class TraceCollector {
  private events: TraceEvent[] = [];

  add(event: TraceEvent): void {
    this.events.push(event);
  }

  getAll(): TraceEvent[] {
    return [...this.events];
  }
}