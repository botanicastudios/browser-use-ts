/**
 * Browser Interfaces Module
 *
 * This module defines extended interfaces for the BrowserContext component, providing
 * type definitions for additional capabilities required by the Controller. These
 * interfaces ensure type safety and proper integration between the Browser and
 * Controller components in the browser-use architecture.
 *
 * Key components:
 * - ExtendedBrowserContext: Extends the BrowserContext with additional methods required
 *   for DOM interaction, tab management, and navigation used by the Controller
 *
 * The Browser service (in service.ts) implements these interfaces to provide:
 * - Comprehensive browser automation capabilities to the Controller
 * - Type-safe interactions between components
 * - Clear contract definition for browser context implementations
 *
 * This module bridges the gap between the core browser functionality and the
 * higher-level actions required by the Controller component.
 */
import { BrowserContext } from "./context";

/**
 * Extended interface for BrowserContext with additional methods
 * needed for controller actions
 */
export interface ExtendedBrowserContext extends BrowserContext {
  // Navigation methods
  goBack(): Promise<void>;

  // Session methods
  getSession(): Promise<any>;

  // DOM interaction methods
  getSelectorMap(): Promise<any>;
  getDomElementByIndex(index: number | string): Promise<any>;
  getElementByIndex(index: number | string): Promise<any>;
  getLocateElement(element: any): Promise<any>;
  isFileUploader(element: any): Promise<boolean>;
  _clickElementNode(element: any): Promise<string | null>;
  _inputTextElementNode(element: any, text: string): Promise<void>;

  // Tab management methods
  switchToTab(pageId: number): Promise<void>;
  createNewTab(url?: string): Promise<void>;
}
