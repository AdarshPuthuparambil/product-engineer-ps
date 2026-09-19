````markdown
# Product Engineering Challenge Submission

## Candidate

- **Name:** Adarsh P A
- **Email:** adarshputhuparambil324@gmail.com
- **GitHub:** https://github.com/AdarshPuthuparambil
- **Selected problem:** Problem 4: Observable Agent Loop
- **Demo video:** https://drive.google.com/file/d/14xgIfRdC5KzjYR2bhTYpUycYyUZYg5Wo/view?usp=drive_link

## Run the project

### Prerequisites

- Node.js
- npm

No external API key or secret is required for this prototype.

### Install dependencies

```bash
npm install
````

### Run the project

```bash
npm run dev
```

The project demonstrates an observable agent loop using deterministic models and synthetic tool data.

The demonstration includes:

1. Normal multi-step investigation
2. Tool failure and recovery
3. Execution limit handling

### Successful scenario

Run:

```bash
npm run dev
```

The normal scenario demonstrates an investigation of the checkout service.

The agent:

1. Receives an investigation objective.
2. Searches application logs.
3. Finds database timeout errors.
4. Requests checkout latency metrics.
5. Uses the returned metrics as additional evidence.
6. Produces a final evidence-grounded response.

The trace records the objective, model decisions, tool calls, tool results, and final response.

### Failure and recovery scenario

The project includes an intentional metrics failure demonstration.

The `get_metrics_failure_demo` tool returns:

```text
Metrics service temporarily unavailable
```

The agent does not stop immediately.

Instead, it continues the investigation using the `get_service_status` tool.

The service status tool returns that the checkout service is degraded.

The final response uses the evidence that is available and clearly indicates that the metrics service was unavailable.

### Execution limit scenario

The project also demonstrates an execution-limit scenario.

The model continues requesting another tool call while the `AgentRunner` enforces a maximum number of execution steps.

When the maximum number of steps is reached, the runner stops execution cleanly.

The final state is:

```text
limit_reached
```

This prevents the agent from running indefinitely.

## Run the tests

Install dependencies:

```bash
npm install
```

Run the automated tests:

```bash
npm test
```

The test suite covers:

* Tool registration and validation
* Multi-step agent execution
* Tool failure and recovery
* Execution limit handling

The current test suite contains four test files and five tests.

## Acceptance scenarios and verification

The following Problem 4 scenarios are implemented.

### 1. Tool registration and validation

The project contains a `ToolRegistry` for managing available tools.

The registered tools include:

* `search_logs`
* `get_metrics`
* `get_service_status`
* `get_metrics_failure_demo`

Tool inputs are validated before execution and tools return structured results.

### 2. Multi-step agent loop

The agent performs multiple tool calls during a single investigation.

The normal flow is:

```text
Investigation objective
        |
        v
   AgentRunner
        |
        v
      Model
        |
        v
   search_logs
        |
        v
   Log evidence
        |
        v
      Model
        |
        v
    get_metrics
        |
        v
 Metrics evidence
        |
        v
 Final response
```

### 3. Failure and recovery

The failure scenario intentionally makes the metrics tool fail.

The flow is:

```text
search_logs
     |
     v
Log evidence
     |
     v
get_metrics_failure_demo
     |
     v
Tool failure
     |
     v
get_service_status
     |
     v
Service status evidence
     |
     v
Final response
```

The agent continues after the tool failure instead of terminating the entire investigation.

### 4. Execution limit

The `AgentRunner` enforces a maximum number of execution steps.

The limit scenario uses a model that continues requesting tool calls.

When the configured limit is reached, the runner stops the loop and records an execution-limit event.

The final state is:

```text
limit_reached
```

### Problem-specific verification

Run the automated verification with:

```bash
npm test
```

Run the demonstration scenarios with:

```bash
npm run dev
```

The automated tests cover the core behaviours required for the agent loop:

* Tool registration and validation
* Multi-step execution
* Failure handling and recovery
* Execution limits

### Observed result

The test suite was observed to complete with:

```text
Test Files  4 passed
Tests       5 passed
```

The development demonstration produces observable trace events including:

* Objective
* Model decision
* Tool call
* Tool result
* Tool failure
* Execution limit
* Final response

### Failure and recovery demonstrated in the video

The video demonstrates an intentional metrics-service failure.

The `get_metrics_failure_demo` tool returns:

```text
Metrics service temporarily unavailable
```

The agent then uses `get_service_status` to continue the investigation.

The service status result reports the checkout service as degraded.

The final response uses the available evidence and identifies the unavailable metrics information.

A reviewer can reproduce the demonstration by running:

```bash
npm run dev
```

## Architecture and data flow

The main components are:

### AgentRunner

`AgentRunner` controls the agent execution loop.

Responsibilities include:

* Receiving the investigation objective
* Maintaining agent state
* Requesting decisions from the model
* Validating tool calls
* Executing tools
* Recording tool results and failures
* Enforcing the maximum number of execution steps
* Producing the final run result

### Model

The model decides which action should happen next.

The project uses deterministic model implementations so the scenarios are reproducible and easy to test.

### ToolRegistry

`ToolRegistry` manages the available tools.

It provides a controlled interface for registering, finding, validating, and executing tools.

### Tools

The project includes tools that simulate engineering systems:

* Application log search
* Service metrics
* Service status
* Intentional metrics failure

The tools use synthetic data so the demonstration does not depend on external services.

### TraceCollector

`TraceCollector` records important execution events.

This provides visibility into the agent's execution flow.

### Data flow

```text
User Objective
      |
      v
 AgentRunner
      |
      v
    Model
      |
      v
Tool Selection
      |
      v
 ToolRegistry
      |
      v
    Tool
      |
      v
Structured Result
      |
      v
Agent State + Evidence
      |
      v
    Model
      |
      +--------------------+
      |                    |
      v                    v
  Next Tool          Final Response
      |
      v
TraceCollector
```

The trace allows the reviewer to see what the agent decided, which tools were called, what results were returned, and where failures or execution limits occurred.

## Technology choices

The project uses:

* TypeScript
* Node.js
* npm
* Vitest

### TypeScript

TypeScript was selected because the agent loop passes structured state, tool inputs, tool outputs, evidence, and model decisions between multiple components.

Static typing helps make these interfaces explicit.

### Node.js

Node.js provides a simple runtime for demonstrating the agent loop without requiring additional infrastructure.

### Vitest

Vitest provides a lightweight testing framework suitable for testing the deterministic agent behaviour.

### Alternatives and trade-offs

A production implementation could use a real LLM provider and external observability or workflow infrastructure.

For this challenge, a deterministic model was used instead.

This provides:

* Reproducible behaviour
* Deterministic tests
* Reliable failure demonstrations
* No external API credentials
* Simple local execution

The trade-off is that the model behaviour does not represent the variability of a production LLM.

## Important decisions

### 1. Deterministic model

A deterministic model was used so that the demonstration and automated tests produce predictable results.

This is especially useful for demonstrating failure recovery and execution limits.

### 2. Explicit tool registry

Tools are managed through a `ToolRegistry` rather than being called directly from the agent.

This separates tool management from the agent loop and makes additional tools easier to add.

### 3. Observable trace

A dedicated `TraceCollector` records important execution events.

This makes the agent's decisions and tool execution visible instead of treating the agent as a black box.

### 4. Execution limit

The `AgentRunner` has an explicit maximum step count.

This provides a clean termination mechanism and prevents an agent loop from running indefinitely.

## Assumptions and limitations

### Assumptions

* Tool data is synthetic.
* The model is deterministic.
* Tool results are structured.
* The application runs locally.
* External production systems are not required.
* The scenarios are designed to demonstrate the required agent-loop behaviours.

### Limitations

* The tools do not connect to real production logs or monitoring systems.
* The model is deterministic and is not a live LLM.
* Trace data is collected during the local execution.
* Distributed execution is not implemented.
* Authentication and authorization for tools are not implemented.
* There is no production job queue.
* Persistent storage for agent runs is not implemented.

These limitations are intentional for this prototype and challenge submission.

## Production and scale

The submitted implementation is a local prototype.

For a production system, I would first introduce durable execution state and separate agent execution from the local process.

A possible production architecture would be:

```text
API / Job Request
       |
       v
   Job Queue
       |
       v
 Agent Worker
       |
       v
 Tool Gateway
       |
       v
External Services
       |
       v
Persistent State
       |
       v
Observability Platform
```

### Durable state

Agent state and execution traces should be persisted so that execution can survive process restarts.

### Tool isolation

Production tools should use:

* Authentication
* Authorization
* Input validation
* Timeouts
* Rate limits
* Audit logging

### Observability

A production system should expose metrics such as:

* Agent execution duration
* Tool latency
* Tool failure rate
* Number of execution steps
* Retry count
* Final execution state
* Token usage when using an LLM

### Reliability

Production execution could include:

* Retry policies
* Timeouts
* Circuit breakers
* Idempotency
* Durable job state

### Security

Secrets should be stored using a secret-management system rather than committed to source control.

The submitted prototype does not implement these production features.

## AI usage

AI tools were used during development.

I used ChatGPT and Cursor to assist with:

* Project structure and implementation ideas
* TypeScript code generation and refinement
* Debugging TypeScript and build issues
* Test implementation and refinement
* Documentation
* Demo-video scripting
* Reviewing implementation approaches

AI-generated suggestions were reviewed and adapted to the actual implementation.

The implementation was tested locally using the project's automated tests and demonstration scenarios.

AI assistance was used as a development aid; the final code, integration, testing, debugging, and submission preparation were reviewed by me.

## Credibility note

### Previously shipped system: PAM (Postal Address Mapping) Mobile Application

### The problem it solved

PAM is a mobile application focused on postal/address mapping and address-related workflows.

### My personal contribution

I worked on the application using React Native and TypeScript.

My contributions included:

* Developing React Native screens and components
* Implementing application flows
* Working with maps and location-related functionality
* Integrating APIs
* Working with TypeScript
* Implementing UI and application behaviour
* Debugging application issues
* Working with Android and iOS build and deployment processes

### Scale or operational complexity

The application involved cross-platform mobile development and address/mapping functionality.

The work required maintaining consistent behaviour across Android and iOS environments and handling mobile-specific build and deployment requirements.

### One difficult engineering or product decision

One important engineering consideration was implementing the mapping and address-related flows in a way that provided a consistent experience while handling platform-specific mobile behaviour.

### Public link or evidence

Public evidence can be provided where permitted.

Company-confidential information and internal implementation details have not been included in this submission.

## Final notes

This submission demonstrates an observable agent loop with:

* Structured tool registration and validation
* Multiple tool calls
* State and evidence handling
* Tool failure handling
* Recovery using another tool
* Execution limits
* Observable execution traces
* Automated tests
* Evidence-grounded final responses

The implementation uses deterministic models and synthetic data so the reviewer can reproduce the scenarios locally.

````

**One important correction before you commit:** only keep the line

```text
Test Files  4 passed
Tests       5 passed
````

if that is the result you actually see when you run `npm test`. Also, don't claim `npm run build` passes unless you have confirmed it.
