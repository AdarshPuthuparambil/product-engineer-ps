# Caygnus Observable Agent Loop

A small TypeScript implementation of an **observable AI agent loop** for incident investigation.

The agent receives an investigation objective, selects appropriate tools, executes them with validated structured inputs, collects evidence, handles tool failures, enforces an execution limit, and produces a final response grounded in the collected evidence.

This project was built for the **Caygnus Product Engineering Challenge – Problem 4: Observable Agent Loop**.

---

## Overview

The agent investigates an incident using synthetic operational data from multiple tools.

Example objective:

> Why did the checkout service become slow?

The agent can:

1. Receive an investigation objective
2. Select an appropriate tool
3. Validate structured tool arguments
4. Execute the tool
5. Store the returned result as evidence
6. Continue with another tool when additional evidence is required
7. Recover from a tool failure
8. Stop when the configured execution limit is reached
9. Produce a final response separating evidence from conclusion
10. Record an ordered operational execution trace

---

## Available Tools

### `search_logs`

Searches synthetic application logs for a service and query.

Example input:

```json
{
  "service": "checkout",
  "query": "timeout"
}