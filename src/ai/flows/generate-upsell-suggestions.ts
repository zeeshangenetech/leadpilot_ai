'use server';
/**
 * @fileOverview Generates intelligent upsell suggestions for a given lead.
 *
 * This file defines a Genkit AI flow that acts as a sales strategist. It analyzes
 * a lead's profile against a list of available software services to recommend
 * relevant upsell opportunities.
 *
 * - `generateUpsellSuggestions`: The main entry point to the AI flow.
 * - `GenerateUpsellSuggestionsInput`: Zod schema for the flow's input.
 * - `GenerateUpsellSuggestionsOutput`: Zod schema for the flow's output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AVAILABLE_SERVICES = [
  'Custom Web App Development',
  'AI/Chatbot Integration',
  'SaaS Platform Development',
  'Payment Gateway Integration (e.g., Stripe)',
  'Ongoing Maintenance & Support Plans',
  'Website Performance & Speed Optimization',
  'HIPAA Compliance Consulting for Healthcare Apps',
  'Cloud Migration & Management (Azure/AWS)',
  'Data Visualization Dashboards',
  'Legacy System Modernization',
  'Dedicated Developer Subscription',
];

const GenerateUpsellSuggestionsInputSchema = z.object({
  company: z.string().describe("The lead's company name."),
  recentActivity: z
    .string()
    .describe(
      "The lead's most recent activity, post, or message snippet."
    ),
  existingServices: z
    .array(z.string())
    .describe('A list of services the lead is already using.'),
});
export type GenerateUpsellSuggestionsInput = z.infer<
  typeof GenerateUpsellSuggestionsInputSchema
>;

const UpsellSuggestionSchema = z.object({
    productName: z.string().describe('The name of the suggested product or service.'),
    reason: z.string().describe('A concise reason why this suggestion is relevant to the lead.'),
    confidence: z.number().min(0).max(1).describe('A confidence score (0.0 to 1.0) for the suggestion.'),
});

const GenerateUpsellSuggestionsOutputSchema = z.object({
  suggestions: z.array(UpsellSuggestionSchema),
});
export type GenerateUpsellSuggestionsOutput = z.infer<
  typeof GenerateUpsellSuggestionsOutputSchema
>;

/**
 * Executes the AI flow to generate upsell suggestions for a given lead.
 * @param input The lead's information.
 * @returns A promise that resolves to a list of upsell suggestions.
 */
export async function generateUpsellSuggestions(
  input: GenerateUpsellSuggestionsInput
): Promise<GenerateUpsellSuggestionsOutput> {
  return generateUpsellSuggestionsFlow(input);
}

const generateUpsellSuggestionsPrompt = ai.definePrompt({
  name: 'generateUpsellSuggestionsPrompt',
  input: { schema: GenerateUpsellSuggestionsInputSchema },
  output: { schema: GenerateUpsellSuggestionsOutputSchema },
  prompt: `You are an expert sales strategist for "The Syntax Squad", a premium software development agency.

Your task is to analyze a lead's profile and suggest 1-2 highly relevant upsell or cross-sell opportunities.

Here is the list of services we offer:
${AVAILABLE_SERVICES.map((s) => `- ${s}`).join('\n')}

Here is the lead's information:
- Company: {{company}}
- Recent Activity / Description: "{{recentActivity}}"
- Existing Services: {{#if existingServices.length}}{{join existingServices ", "}}{{else}}None{{/if}}

Your analysis should:
1.  Carefully read the lead's "Recent Activity" to understand their immediate needs, pain points, or project goals.
2.  Consider the services they already have to avoid redundant suggestions and identify logical next steps.
3.  Suggest services from the provided list that are a perfect fit. For example, if they mention "chatbot", suggest "AI/Chatbot Integration". If they talk about payments, suggest "Payment Gateway Integration". If they are building an app, "Ongoing Maintenance & Support Plans" is a great cross-sell.
4.  For each suggestion, provide a brief, compelling reason and a confidence score (0.0 to 1.0) based on how strong the match is.
5.  If no strong upsell opportunity exists, return an empty array for the suggestions. Do not force a recommendation.

Return your response in the specified JSON format.
`,
});

const generateUpsellSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateUpsellSuggestionsFlow',
    inputSchema: GenerateUpsellSuggestionsInputSchema,
    outputSchema: GenerateUpsellSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateUpsellSuggestionsPrompt(input);
    return output!;
  }
);
