/**
 * Controller Views Module
 *
 * This module defines the parameter models for all browser actions supported by the
 * Controller component in the browser-use architecture. These models provide
 * structure and validation for the parameters passed to browser automation actions.
 *
 * Key action models include:
 * - Navigation: GoToUrlAction, SearchGoogleAction
 * - Element Interaction: ClickElementAction, InputTextAction, SelectDropdownOptionAction
 * - Page Control: ScrollAction, WaitAction, ExtractPageContentAction
 * - Tab Management: SwitchTabAction, OpenTabAction
 * - Task Completion: DoneAction
 *
 * The Controller service (in service.ts) uses these models to:
 * - Validate parameters received from the Agent
 * - Provide schema information for LLM prompt generation
 * - Define the structure of all available actions
 * - Enable type safety for action execution
 *
 * These models form the foundation of the action execution system, defining
 * the contract between the Agent's commands and the Controller's execution.
 */

// Action Input Models
export class SearchGoogleAction {
  query = "";

  static schema() {
    return {
      properties: {
        query: { type: "string" },
      },
    };
  }
}

export class GoToUrlAction {
  url = "";

  static schema() {
    return {
      properties: {
        url: { type: "string" },
      },
    };
  }
}

export class ClickElementAction {
  index = 0;
  xpath?: string;

  static schema() {
    return {
      properties: {
        index: { type: "integer" },
        xpath: { type: "string", optional: true },
      },
    };
  }
}

export class InputTextAction {
  index = 0;
  text = "";
  xpath?: string;

  static schema() {
    return {
      properties: {
        index: { type: "integer" },
        text: { type: "string" },
        xpath: { type: "string", optional: true },
      },
    };
  }
}

/**
 * Action to complete a task
 */
// Direct port of Python's DoneAction class
// In Python: class DoneAction(BaseModel):
//   text: str
//   success: bool
export class DoneAction {
  text: string;
  success: boolean;

  constructor(params: { text: string; success: boolean }) {
    this.text = params.text;
    this.success = params.success;
  }

  static schema() {
    return {
      properties: {
        text: { type: "string" },
        success: { type: "boolean" },
      },
    };
  }
}

export class SwitchTabAction {
  pageId = 0;

  static schema() {
    return {
      properties: {
        pageId: { type: "integer" },
      },
    };
  }
}

export class OpenTabAction {
  url = "";

  static schema() {
    return {
      properties: {
        url: { type: "string" },
      },
    };
  }
}

export class ScrollAction {
  amount?: number;

  static schema() {
    return {
      properties: {
        amount: { type: "integer", optional: true },
      },
    };
  }
}

export class SendKeysAction {
  keys = "";

  static schema() {
    return {
      properties: {
        keys: { type: "string" },
      },
    };
  }
}

export class ExtractPageContentAction {
  value = "";

  static schema() {
    return {
      properties: {
        value: { type: "string" },
      },
    };
  }
}

/**
 * Accepts absolutely anything in the incoming data
 * and discards it, so the final parsed model is empty.
 */
export class NoParamsAction {
  constructor(_?: any) {
    // Ignore all inputs
    // This is equivalent to Python's @model_validator(mode='before')
    // def ignore_all_inputs(cls, values):
    //   # No matter what the user sends, discard it and return empty.
    //   return {}
  }

  static schema() {
    return {
      properties: {},
    };
  }
}

/**
 * Action to select an option from a dropdown by text
 */
export class SelectDropdownOptionAction {
  index = 0;
  text = "";

  static schema() {
    return {
      properties: {
        index: { type: "integer" },
        text: { type: "string" },
      },
    };
  }
}

/**
 * Action to wait for a specified number of seconds
 */
export class WaitAction {
  seconds = 3;

  static schema() {
    return {
      properties: {
        seconds: { type: "integer", optional: true },
      },
    };
  }
}

/**
 * Action to scroll to text on the page
 */
export class ScrollToTextAction {
  text = "";

  static schema() {
    return {
      properties: {
        text: { type: "string" },
      },
    };
  }
}

/**
 * Action to get dropdown options
 */
export class GetDropdownOptionsAction {
  index = 0;

  static schema() {
    return {
      properties: {
        index: { type: "integer" },
      },
    };
  }
}
