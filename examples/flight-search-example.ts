/**
 * Example of using the browser-use Agent with OpenAI to execute a shopping task
 */
import {
  Agent,
  Browser,
  BrowserContext,
  BrowserContextConfig,
  BrowserConfig,
} from "../src"; // browser-use-ts
// Import LangChain components
import { ChatOpenAI } from "@langchain/openai";
// For loading environment variables, matching Python's dotenv
import * as dotenv from "dotenv";
import { AgentHistoryList } from "../src/agent/views"; // Import AgentHistoryList correctly

// Load environment variables from .env file - exact match with Python
dotenv.config();

// Shopping task example
const task = `
### Prompt for Flight Search Agent – kayak.com

**Objective:**
Find the absolute cheapest return flight option from Toulouse (TLS) to Bangkok (BKK) departing "next week" and returning approximately one week later, using kayak.com.

**Context:**
*   **User Request:** Find the cheapest return flight from Toulouse to Bangkok next week on kayak.com
*   **Current Time:** 2025-04-29 06:18:04 UTC (Tuesday)
*   **Origin:** Toulouse, France (TLS)
*   **Destination:** Bangkok, Thailand (BKK - likely Suvarnabhumi Airport)
*   **Trip Type:** Return / Round-trip

**Date Calculation:**
*   "Next week" relative to 2025-04-29 starts Monday, May 5th, 2025 and ends Sunday, May 11th, 2025.
*   Target a departure within this range (May 5-11).
*   Target a return date approximately 7 days after the chosen departure date (e.g., if departing May 7th, target return around May 14th).

**Steps:**

1.  **Navigate** to kayak.com (or the relevant regional version if necessary, e.g., kayak.fr).
2.  **Locate** the flight search form.
3.  **Input Origin:** "Toulouse" or "TLS".
4.  **Input Destination:** "Bangkok" or "BKK".
5.  **Select Trip Type:** Ensure "Return" or "Round-trip" is selected.
6.  **Input Dates:**
    *   **Departure Date:** Aim for the middle of the target week, e.g., Wednesday, May 7th, 2025.
    *   **Return Date:** Aim for approx. 7 days later, e.g., Wednesday, May 14th, 2025.
    *   **Utilize Flexibility:** If kayak offers flexible date options (e.g., "+/- 3 days", "whole week", "nearby dates"), use them to search the entire departure window (May 5-11) and a corresponding return window (approx. May 12-18) to find the cheapest combination. If specific dates are required, start with the target dates (May 7 / May 14) and note if significantly cheaper options exist on adjacent days within the target ranges.
7.  **Initiate Search:** Execute the flight search.
8.  **Analyze Results:**
    *   Wait for results to load. kayak often sorts by "Cheapest" by default; ensure this is the case or sort accordingly.
    *   Identify the flight option with the lowest total price displayed.
    *   Verify it is a *return* flight matching the origin and destination.
9.  **Extract Details** for the cheapest valid option:
    *   Total Price (including currency symbol, e.g., €, $, £).
    *   Airline(s) operating the flights.
    *   Departure Date & Time from Toulouse (TLS).
    *   Arrival Date & Time in Bangkok (BKK).
    *   Return Departure Date & Time from Bangkok (BKK).
    *   Return Arrival Date & Time in Toulouse (TLS).
    *   Total trip duration (outbound and return, if available separately).
    *   Number of stops (outbound and return).

10. **Summarize Findings:** Report the extracted details clearly. Specify the exact dates found for the cheapest flight and mention if flexible date search was used or if nearby dates were checked.

**Example Summary Structure:**

*   **Cheapest Flight Found:** [Total Price with Currency]
*   **Airline(s):** [Airline Name(s)]
*   **Outbound:**
    *   Depart TLS: [Date], [Time]
    *   Arrive BKK: [Date], [Time]
    *   Duration: [Duration]
    *   Stops: [Number]
*   **Return:**
    *   Depart BKK: [Date], [Time]
    *   Arrive TLS: [Date], [Time]
    *   Duration: [Duration]
    *   Stops: [Number]
*   **Search Basis:** [e.g., "Based on flexible dates May 5-11 (Dep) / May 12-18 (Ret)", or "Based on specific dates May 7 / May 14, checked +/- 1 day"]
`;

// Create Browser instance first
const browserInstance = new Browser(
  new BrowserConfig({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
  })
);

// Configure BrowserContext
const browserContextConfig = new BrowserContextConfig({
  // Set a user agent to mimic a real browser, which might help avoid bot detection
  /*userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",*/
  // Increase viewport size for potentially complex pages
  viewport: { width: 1280, height: 768 },
});
// Pass the created Browser instance to BrowserContext
const browserContext = new BrowserContext(
  browserInstance,
  browserContextConfig
);

// Create the agent with vision turned off
const agent = new Agent(
  task,
  new ChatOpenAI({
    openAIApiKey: process.env["OPENAI_API_KEY"] || "",
    modelName: "gpt-4o",
  }),
  // All other positional arguments moved to options
  {
    // Pass the pre-configured browserContext via options
    browserContext: browserContext,
    pageExtractionLlm: new ChatOpenAI({
      openAIApiKey: process.env["OPENAI_API_KEY"] || "",
      modelName: "gpt-4o-mini",
    }),
    screenshotFormat: "jpeg",
    // Other options can be added here if needed, e.g.:
    // useVision: true,
    // maxFailures: 5
  } // Options object
);

// Main function to run the agent
async function main() {
  try {
    // Run the agent
    const history: AgentHistoryList = await agent.run(15); // Increased max steps for shopping task

    // Print the final result from the last history item
    console.log("\nFinal Result:");
    if (history && history.history.length > 0) {
      const lastStep = history.history[history.history.length - 1];
      // The result is an array of ActionResult, check the last one for done status/content
      if (lastStep && lastStep.result && lastStep.result.length > 0) {
        const lastActionResult = lastStep.result[lastStep.result.length - 1];
        console.log(JSON.stringify(lastActionResult, null, 2));
      } else {
        console.log("Last step result not found.");
      }
    } else {
      console.log("No history found.");
    }
  } catch (error) {
    console.error("Error during agent execution:", error);
  } finally {
    // Close the browser context (which should close the underlying browser instance)
    await browserContext.close();
  }
}

// Run the example
main().catch(console.error);
