# Browser-Use TypeScript Library Architecture

This document provides an overview of the browser-use TypeScript library architecture, explaining its components, their responsibilities, and how they interact.

## Overview

Browser-use is a TypeScript library that enables large language models (LLMs) to interact with web browsers, performing tasks like navigation, clicking elements, filling forms, extracting data, and more. It bridges the gap between LLMs and web automation, allowing LLMs to autonomously complete tasks in web applications.

## Key Components

### Agent Module (`src/agent`)

The heart of the system that orchestrates browser automation using LLMs:

- **Agent Service**: Coordinates tasks, manages the state, and handles the step-based execution flow
- **Message Manager**: Maintains conversation history between Agent and LLM
- **Prompts**: Contains system prompts and templates for LLM interactions
- **Views**: Defines data models for agent state and outputs

### Controller Module (`src/controller`)

Executes browser actions based on commands from the Agent:

- **Controller Service**: Implements browser actions (click, input, navigate, etc.)
- **Registry**: Manages the registration and discovery of available actions
- **Views**: Contains parameter models for actions

### DOM Module (`src/dom`)

Analyzes and represents the browser's document object model:

- **DOM Service**: Extracts and represents interactive elements from web pages
- **History Tree Processor**: Tracks elements across page changes
- **DOM Views**: Data models for DOM elements and structures

### Browser Module (`src/browser`)

Interfaces with the actual browser:

- **Browser Service**: Manages browser instances and capabilities
- **Context**: Encapsulates browser state and provides interface methods
- **Views**: Data models for browser state

## Data Flow

1. **Task Initiation**:

   - The `Agent` is initialized with a task and LLM
   - Initial browser state is captured

2. **Step Execution**:

   - Browser state is captured via `BrowserContext` and `DOM Service`
   - `MessageManager` formats state and history for the LLM
   - LLM receives the state and returns `AgentOutput` with actions
   - `Controller` executes the actions using the `Registry`
   - Results are recorded and added to history

3. **State Management**:

   - `Agent` maintains state including history, steps, and results
   - `HistoryTreeProcessor` tracks elements across page changes
   - `MessageManager` ensures token limits are respected

4. **Action Execution**:
   - Actions are registered in the `Registry`
   - `Controller` validates and executes actions
   - Browser interactions are performed through `BrowserContext`
   - Results are formatted as `ActionResult` objects

## Key Concepts

### Agent Step Loop

The Agent operates in steps, following this process for each step:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Get Browser   │     │  Format State   │     │   Query LLM     │
│      State      │────▶│  for LLM Input  │────▶│  for Actions    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                                               │
         │                                               ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Update State  │     │ Process Results │     │ Execute Actions │
│   and History   │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Registry Pattern

Actions are registered with the Controller using a registry pattern:

```typescript
registry.action("Description of the action", ParameterModel)(
  this, "action_name", {
    value: async function(params, context) { ... }
  }
)
```

This allows for dynamic discovery and execution of available actions.

### DOM Element Tracking

Elements are tracked across page changes using multiple identifiers:

- XPath
- CSS Selectors
- Element attributes
- Parent branch paths
- Hash-based fingerprinting

This enables stable references to elements even as the page changes.

## Extension Points

Browser-use is designed to be extensible:

1. **New Actions**: Add new actions by registering them with the Controller Registry
2. **Custom LLMs**: Swap out the LLM implementation with any compatible model
3. **Browser Integration**: The browser module can be extended to support additional browser features
4. **Data Extraction**: Customize extraction logic for specific use cases

## Technical Requirements

- TypeScript/JavaScript environment
- LangChain.js compatible LLM
- Playwright or compatible browser automation library
- Node.js runtime

## Usage Example

```typescript
// Initialize LLM
const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0,
});

// Create agent
const agent = new Agent(
  "Navigate to example.com and click the first button",
  llm
);

// Run the agent
const result = await agent.run(10); // Run for up to 10 steps
```

## Design Principles

1. **Modularity**: Components are separated by responsibility
2. **Extensibility**: Easy to add new actions and integrations
3. **Robustness**: Handles errors and unexpected page changes
4. **Token Efficiency**: Manages LLM token usage effectively
5. **Stateful**: Maintains comprehensive history and state
