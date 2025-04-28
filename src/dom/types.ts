/**
 * DOM Types Module
 *
 * This module defines the core type definitions for the DOM component of the browser-use
 * architecture. The DOM component is responsible for analyzing and representing the
 * browser's document object model in a structured format suitable for the Agent.
 *
 * Key types:
 * - ElementHash: Provides hash-based fingerprinting for DOM elements
 * - DOMElementNode: Represents a single element node in the DOM with its properties
 * - DOMTreeOptions: Configuration options for DOM tree processing
 *
 * The DOM service (in service.ts) uses these types to:
 * - Extract and process DOM elements from web pages
 * - Create a structured representation of the page's interactive elements
 * - Identify and track elements across page changes
 * - Filter and highlight elements for the Agent's use
 *
 * These types provide the foundation for the DOM processing system, enabling
 * the Agent to understand and interact with web page elements effectively.
 */

export interface ElementHash {
  branchPathHash: string;
  // Add other hash properties as needed
}

export interface DOMElementNode {
  tag: string;
  id?: string;
  className?: string;
  textContent?: string;
  attributes?: Record<string, string>;
  children?: DOMElementNode[];
  index?: number;
  parent?: DOMElementNode;
  isVisible?: boolean;
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  xpath?: string;
  selector?: string;
  hash?: ElementHash;
}

export interface DOMTreeOptions {
  includeAttributes?: string[];
  useHighlights?: boolean;
  includeScreenshot?: boolean;
  viewport?: {
    width: number;
    height: number;
  };
}
