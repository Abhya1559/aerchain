import { HumanMessage } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import "dotenv/config";

const RFP_SCHEMA = z
  .object({
    quantity: z.number().describe("The total number of units required."),
    item_description: z
      .string()
      .describe("The item being requested, e.g., 'laptop'."),
    total_budget: z
      .number()
      .describe("The maximum budget allocated for this request."),
    specifications: z
      .object({
        ram: z.string().describe("Required RAM specification."),
        storage: z
          .string()
          .describe("Required storage specification (e.g., SSD or HDD)."),
        graphics: z.string().describe("Required graphics card specification."),
      })
      .describe("Detailed technical specifications for the item."),
    order_summary: z
      .string()
      .describe("A concise natural language summary of the complete order."),
  })
  .describe("A structured procurement request for proposal (RFP).");

const config = {
  api: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.1,
  maxOutputTokens: 1000,
};

const model = new ChatGoogleGenerativeAI(config);

const structuredModel = model.withStructuredOutput(RFP_SCHEMA, {
  name: "RFP_Schema",
});

export async function runRfpAgent(promptText) {
  // const prompt = new HumanMessage(
  //   "I need 15 laptop, I have a budget of 1200000. Specifications required are that all laptops have 16GB RAM, 512GB SSD, and an inbuilt graphic card."
  // );
  // console.log("-------------Invoking structure RFP model--------------------");

  // console.log("--- Structured Output (Type Checked) ---");
  // console.log(result);
  // console.log("\n--- JSON String Output ---");
  // console.log(JSON.stringify(result, null, 2));
  const prompt = new HumanMessage(promptText);
  const result = await structuredModel.invoke([prompt]);
  return result;
}

// runRfpAgent();
