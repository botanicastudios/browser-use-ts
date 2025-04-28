/**
 * TypeScript implementation of browser-use controller registry views
 */

/**
 * Model for a registered action
 */
export class RegisteredAction<T extends Record<string, any>> {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  function: Function;
  paramModel: new () => T;

  constructor(
    name: string,
    description: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    func: Function,
    paramModel: new () => T
  ) {
    this.name = name;
    this.description = description;
    this.function = func;
    this.paramModel = paramModel;
  }

  /**
   * Get a description of the action for the prompt
   */
  promptDescription(): string {
    const skipKeys = ["title"];
    let s = `${this.description}: \n`;
    s += "{" + this.name + ": ";

    // Get the schema from the parameter model class
    const schema = (this.paramModel as any).schema
      ? (this.paramModel as any).schema()
      : { properties: {} };
    const properties = schema.properties || {};

    // Format the properties for the prompt, matching Python implementation
    const formattedProperties: Record<string, Record<string, any>> = {};

    for (const [key, value] of Object.entries(properties)) {
      const valueObj = value as Record<string, any>;
      formattedProperties[key] = {};

      for (const [subKey, subValue] of Object.entries(valueObj)) {
        if (!skipKeys.includes(subKey)) {
          formattedProperties[key][subKey] = subValue;
        }
      }
    }

    // Format the properties for the prompt
    s += JSON.stringify(formattedProperties);
    s += "}";
    return s;
  }
}

/**
 * Base model for dynamically created action models
 */
export class ActionModel {
  // This will store action data like { click_element: { index: 5 } }
  [key: string]: any;

  constructor(data?: Record<string, any>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Get the index of the action
   */
  getIndex(): number | null {
    const params = Object.values(this.toJSON());
    if (!params.length) {
      return null;
    }

    for (const param of params) {
      if (param !== null && typeof param === "object" && "index" in param) {
        return param.index as number;
      }
    }

    return null;
  }

  /**
   * Set the index of the action
   */
  setIndex(index: number): void {
    const actionName = Object.keys(this.toJSON())[0];
    if (actionName) {
      const actionParams = this[actionName];
      if (actionParams && typeof actionParams === "object") {
        actionParams.index = index;
      }
    }
  }

  /**
   * Convert the model to a JSON object
   */
  toJSON(): Record<string, any> {
    const result: Record<string, any> = {};

    // Get all properties that are not functions or part of the prototype
    for (const key of Object.keys(this)) {
      const value = this[key];
      if (typeof value !== "function" && key !== "constructor") {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Static method to create an ActionModel from JSON
   */
  static fromJSON(json: Record<string, any>): ActionModel {
    return new ActionModel(json);
  }
}

/**
 * Model representing the action registry
 */
export class ActionRegistry {
  actions: Record<string, RegisteredAction<any>> = {};

  /**
   * Get a description of all actions for the prompt
   */
  getPromptDescription(): string {
    return Object.values(this.actions)
      .map((action) => action.promptDescription())
      .join("\n");
  }
}
