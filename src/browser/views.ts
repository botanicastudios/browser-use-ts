/**
 * Browser Views Module
 *
 * This module defines the data models and structures that represent browser state
 * within the browser-use architecture. These models are used to capture, store, and
 * communicate the current state of the browser to other components, especially the Agent.
 *
 * Key components:
 * - BrowserState: Represents the complete state of a browser session including URL, title,
 *   tabs, screenshots, and DOM state
 * - BrowserStateHistory: Tracks the history of browser states for context and debugging
 * - TabInfo: Represents information about browser tabs
 * - BrowserError: Error classes for browser-related exceptions
 *
 * The Browser service (in service.ts) uses these models to:
 * - Capture the current state of the browser at each step
 * - Provide the Agent with a structured representation of the current page
 * - Track the history of browser states for context
 * - Communicate errors and exceptions in a structured way
 *
 * These models serve as a critical interface between the Browser component and
 * the Agent, allowing the Agent to make informed decisions based on browser state.
 */

import {
  DOMState,
  DOMHistoryElement,
  DOMElementNode,
  SelectorMap,
} from "../dom/views";

/**
 * Represents information about a browser tab
 */
export interface TabInfo {
  pageId: number;
  url: string;
  title: string;
}

/**
 * Represents the state of the browser
 * This matches the original Python implementation
 */
export class BrowserState extends DOMState {
  url: string;
  title: string;
  tabs: TabInfo[];
  screenshot: string | undefined;
  pixelsAbove = 0;
  pixelsBelow = 0;
  browserErrors: string[] = [];
  // elementTree is inherited from DOMState

  constructor(
    url: string,
    title: string,
    tabs: TabInfo[],
    screenshot?: string,
    pixelsAbove = 0,
    pixelsBelow = 0,
    browserErrors: string[] = [],
    elementTree?: DOMElementNode,
    rootElement?: DOMElementNode,
    selectorMap?: SelectorMap
  ) {
    // Initialize with empty DOM elements if not provided
    super(rootElement || ({} as DOMElementNode), selectorMap || {});
    this.url = url;
    this.title = title;
    this.tabs = tabs;
    this.screenshot = screenshot;
    this.pixelsAbove = pixelsAbove;
    this.pixelsBelow = pixelsBelow;
    this.browserErrors = browserErrors;
    if (elementTree !== undefined) {
      this.elementTree = elementTree;
    }
  }
}

/**
 * Represents the history of browser states
 */
export class BrowserStateHistory {
  url: string;
  title: string;
  tabs: TabInfo[];
  interactedElement: (DOMHistoryElement | null)[];
  screenshot: string | undefined;

  constructor(
    url: string,
    title: string,
    tabs: TabInfo[],
    interactedElement: (DOMHistoryElement | null)[],
    screenshot?: string
  ) {
    this.url = url;
    this.title = title;
    this.tabs = tabs;
    this.interactedElement = interactedElement;
    this.screenshot = screenshot;
  }

  toDict(): Record<string, any> {
    const data: Record<string, any> = {};
    data["tabs"] = this.tabs;
    data["screenshot"] = this.screenshot;
    data["interactedElement"] = this.interactedElement.map((el) =>
      el ? el.toDict() : null
    );
    data["url"] = this.url;
    data["title"] = this.title;
    return data;
  }
}

/**
 * Base class for all browser errors
 */
export class BrowserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BrowserError";
  }
}

/**
 * Error raised when a URL is not allowed
 */
export class URLNotAllowedError extends BrowserError {
  constructor(message: string) {
    super(message);
    this.name = "URLNotAllowedError";
  }
}
