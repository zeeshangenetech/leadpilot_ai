// Define types and generate personalized outbound messages for leads.
'use server';

/**
 * @fileOverview Generates personalized outbound messages for leads.
 *
 * This file defines a Genkit AI flow that uses the Gemini model to craft personalized
 * messages for sales leads.
 *
 * - `generatePersonalizedOutboundMessage`: An exported function that serves as the entry point to the AI flow.
 * - `GeneratePersonalizedOutboundMessageInput`: The Zod schema defining the input data structure for the flow.
 * - `GeneratePersonalizedOutboundMessageOutput`: The Zod schema defining the output data structure from the flow.
 * - `generatePersonalizedOutboundMessagePrompt`: The Genkit prompt that instructs the Gemini model on how to generate the message.
 * - `generatePersonalizedOutboundMessageFlow`: The main Genkit flow that orchestrates the call to the AI model.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Defines the input structure for our AI flow using a Zod schema.
// This ensures that the data passed to the flow is well-structured.
const GeneratePersonalizedOutboundMessageInputSchema = z.object({
  name: z.string().describe('The name of the lead.'),
  company: z.string().describe('The company of the lead.'),
  activity: z.string().describe('The recent activity of the lead.'),
  score: z.number().describe('The lead score.'),
  category: z.string().describe('The lead score category (Hot, Warm, Cold).'),
  product: z.string().describe('The recommended product or service.'),
  reason: z.string().describe('The reason for the product recommendation.'),
  upsell: z.string().optional().describe('Optional upsell opportunity.'),
  tone: z
    .enum(['friendly', 'professional'])
    .describe('The desired tone of the message.'),
  channel: z.enum(['email', 'WhatsApp']).describe('The desired channel.'),
});
export type GeneratePersonalizedOutboundMessageInput = z.infer<
  typeof GeneratePersonalizedOutboundMessageInputSchema
>;

// Defines the expected JSON output structure from the AI model.
// This helps the model to return data in a consistent format.
const GeneratePersonalizedOutboundMessageOutputSchema = z.object({
  subject: z.string().describe('Personalized subject line for email.'),
  body: z
    .string()
    .describe('Main message body including the upsell suggestion.'),
  variant_2: z
    .string()
    .describe('Alternate message body with different wording or approach.'),
  suggested_channel: z
    .enum(['email', 'whatsapp'])
    .describe('The suggested channel for the message.'),
});
export type GeneratePersonalizedOutboundMessageOutput = z.infer<
  typeof GeneratePersonalizedOutboundMessageOutputSchema
>;

/**
 * Executes the AI flow to generate a personalized message for a given lead.
 * This is the function that our application server action will call.
 * @param input The lead information.
 * @returns A promise that resolves to the generated message object.
 */
export async function generatePersonalizedOutboundMessage(
  input: GeneratePersonalizedOutboundMessageInput
): Promise<GeneratePersonalizedOutboundMessageOutput> {
  return generatePersonalizedOutboundMessageFlow(input);
}

// Defines the prompt for the Gemini model using Genkit's `ai.definePrompt`.
// This is where we provide the instructions, context, and input placeholders.
const generatePersonalizedOutboundMessagePrompt = ai.definePrompt({
  name: 'generatePersonalizedOutboundMessagePrompt',
  input: {schema: GeneratePersonalizedOutboundMessageInputSchema},
  output: {schema: GeneratePersonalizedOutboundMessageOutputSchema},
  // The core prompt string that guides the AI's response.
  // It uses Handlebars syntax (e.g., {{name}}) to insert the lead's data.
  prompt: `You are an expert sales assistant for a software company. Your task is to generate a **personalized outbound message** for a lead, including a friendly upsell suggestion for our software services.

Lead Details:
- Name: {{name}}
- Company: {{company}}
- Recent activity: {{activity}}
- Lead score: {{score}} ({{category}})
- Recommended product/service: {{product}} (reason: {{reason}})
- Upsell opportunity: {{upsell}} (optional; additional software services that could benefit the client)

Requirements:
- Tone: {{tone}}
- Channel: {{channel}}
- Message length: 2–4 sentences
- Include the upsell naturally, highlighting value or complementary benefits
- Provide at least **2 variants** for A/B testing

Return JSON in this format:
{
  "subject": "Personalized subject line for email",
  "body": "Main message body including the upsell suggestion",
  "variant_2": "Alternate message body with different wording or approach",
  "suggested_channel": "email|whatsapp"
}
  `,
});

// Defines the main Genkit flow.
// This flow takes the input, calls the defined prompt with that input, and returns the AI's output.
const generatePersonalizedOutboundMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOutboundMessageFlow',
    inputSchema: GeneratePersonalizedOutboundMessageInputSchema,
    outputSchema: GeneratePersonalizedOutboundMessageOutputSchema,
  },
  async input => {
    // Execute the prompt and wait for the response from the Gemini model.
    const {output} = await generatePersonalizedOutboundMessagePrompt(input);
    // Return the structured JSON output from the model.
    return output!;
  }
);
