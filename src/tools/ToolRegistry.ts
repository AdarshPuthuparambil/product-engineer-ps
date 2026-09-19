import type { Tool } from "./Tool.js";

export class ToolRegistry {
  private readonly tools = new Map<string, Tool<any, any>>();

  register(tool: Tool<any, any>): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool already registered: ${tool.name}`);
    }

    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool<any, any> {
    const tool = this.tools.get(name);

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    return tool;
  }

  list(): string[] {
    return [...this.tools.keys()];
  }
}