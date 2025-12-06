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
  CustomerName: z.string().describe('The name of the lead.'),
  CompanyName: z.string().describe('The company of the lead.'),
  LeadDescription: z.string().describe('The recent activity or description of the lead.'),
  Platform: z.string().describe('The source platform of the lead (e.g., LinkedIn, Upwork).'),
  Product: z.string().describe('The recommended product or service.'),
  Reason: z.string().describe('The reason for the product recommendation.'),
  Upsell: z.string().optional().describe('Optional upsell opportunity.'),
  CTA: z.string().describe('The desired call to action.'),
  EmailSignature: z.string().describe('The email signature to be used.'),
});
export type GeneratePersonalizedOutboundMessageInput = z.infer<
  typeof GeneratePersonalizedOutboundMessageInputSchema
>;

// Defines the expected JSON output structure from the AI model.
// This helps the model to return data in a consistent format.
const GeneratePersonalizedOutboundMessageOutputSchema = z.object({
  subject: z.string().describe('Personalized email subject line'),
  body: z.string().describe('Full email body ready to send, formatted with newline characters (\\n) for paragraphs.'),
  upsell_mention: z.string().describe('Text highlighting the upsell product/service'),
  cta: z.string().describe('Text for call-to-action'),
  suggested_channel: z.enum(['email']).describe('The suggested channel for the message.'),
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
  prompt: `You are an expert sales assistant for a software company called "The Syntax Squad". Your task is to generate a **personalized email** for a specific lead using the following template as guidance. The email should sound professional, friendly, and tailored to the lead’s business and requirements. Include an optional upsell suggestion based on their needs.

Lead Information:
- Name: {{CustomerName}}
- Company: {{CompanyName}}
- Lead description / notes: {{LeadDescription}}
- Source platform: {{Platform}} (e.g., LinkedIn, Upwork, Email)
- Recommended product/service: {{Product}} (reason: {{Reason}})
- Upsell opportunity: {{Upsell}} (optional; additional software services we can offer)
- Call to action: {{CTA}} (e.g., "Would you like to schedule a demo?", "Can we set up a quick call?", "Let us show you how it works?")

Requirements:
- Use the provided email template as a base:  

Hi {{CustomerName}},

I hope you’re doing well.

At The Syntax Squad, we’re always looking for ways to support businesses with solutions that create real impact. To understand your needs better, we’d love to know:

• What challenges or pain points are you currently facing?
• What kind of solution are you looking for to overcome them?

Your input helps us recommend the right approach and tailor a solution that truly fits your workflow.

If you’d like, our team can also walk you through how similar businesses have used our services to streamline operations, reduce manual work, and improve overall efficiency.

Looking forward to hearing from you!

Best regards,
{{EmailSignature}}

- Personalize the greeting, reference the lead description and platform, highlight the recommended product/service, suggest upsell services naturally, and include the CTA.  
- Keep it concise (2–4 short paragraphs).  
- Maintain a friendly professional tone.
- **IMPORTANT**: The generated 'body' of the email must be formatted with newline characters (\\n) to create paragraph breaks for proper HTML rendering.  

Output format (JSON):
{
"subject": "Personalized email subject line",
"body": "Full email body ready to send, with \\n for paragraphs.",
"upsell_mention": "Text highlighting the upsell product/service",
"cta": "Text for call-to-action",
"suggested_channel": "email"
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
