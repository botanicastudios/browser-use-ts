/**
 * Controller Types Module
 *
 * This module defines the core type definitions used throughout the Controller component
 * of the browser-use architecture. The Controller is responsible for executing browser
 * actions based on commands from the Agent.
 *
 * Key components:
 * - Context: Interface for the execution context of actions
 * - ActionParams: Interface for parameters passed to actions
 * - ActionResponse: Interface for structured responses from actions
 * - ActionResult: Class representing the result of executing an action
 *
 * The Controller service (in service.ts) uses these types to:
 * - Define a consistent interface for all actions
 * - Process and validate action parameters
 * - Format action results in a standardized way
 * - Provide structured feedback to the Agent about action execution
 *
 * These types create a consistent contract between the Agent and Controller components,
 * enabling structured communication about actions and their results.
 */

export interface Context {
  // Define properties that would be in a context object
  // This is a placeholder that should be filled with actual context properties
  [key: string]: any;
}

export interface ActionParams {
  [key: string]: any;
}

export interface ActionResponse {
  success: boolean;
  result?: any;
  error?: string;
}

export interface ActionResultParams {
  isDone?: boolean;
  success?: boolean;
  extractedContent?: string;
  includeInMemory?: boolean;
  error?: string;
}

export class ActionResult {
  isDone: boolean;
  success: boolean;
  extractedContent: string;
  includeInMemory: boolean;
  error?: string;

  constructor(
    params: ActionResultParams = {
      isDone: false,
      success: false,
      extractedContent: "",
      includeInMemory: false,
    }
  ) {
    this.isDone = params.isDone !== undefined ? params.isDone : false;
    this.success = params.success !== undefined ? params.success : false;
    this.extractedContent =
      params.extractedContent !== undefined ? params.extractedContent : "";
    this.includeInMemory =
      params.includeInMemory !== undefined ? params.includeInMemory : false;
    // Only set error if it exists in params
    if (params.error !== undefined) {
      this.error = params.error;
    }
  }
}
