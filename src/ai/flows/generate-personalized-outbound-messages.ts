// Define types and generate personalized outbound messages for leads.
'use server';

/**
 * @fileOverview Generates personalized outbound messages for leads.
 *
 * - generatePersonalizedOutboundMessage - A function that generates personalized outbound messages for a lead.
 * - GeneratePersonalizedOutboundMessageInput - The input type for the generatePersonalizedOutboundMessage function.
 * - GeneratePersonalizedOutboundMessageOutput - The return type for the generatePersonalizedOutboundMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedOutboundMessageInputSchema = z.object({
  leadDetails: z
    .string()
    .describe('Details about the lead, including name, company, and recent activity.'),
  productDetails: z
    .string()
    .describe('Details about the product or service to promote.'),
  tone: z
    .enum(['friendly', 'professional'])
    .describe('The desired tone of the message.'),
  channel: z.enum(['email', 'WhatsApp']).describe('The desired channel.'),
});
export type GeneratePersonalizedOutboundMessageInput = z.infer<
  typeof GeneratePersonalizedOutboundMessageInputSchema
>;

const GeneratePersonalizedOutboundMessageOutputSchema = z.object({
  message: z.string().describe('The generated personalized outbound message.'),
});
export type GeneratePersonalizedOutboundMessageOutput = z.infer<
  typeof GeneratePersonalizedOutboundMessageOutputSchema
>;

export async function generatePersonalizedOutboundMessage(
  input: GeneratePersonalizedOutboundMessageInput
): Promise<GeneratePersonalizedOutboundMessageOutput> {
  return generatePersonalizedOutboundMessageFlow(input);
}

const generatePersonalizedOutboundMessagePrompt = ai.definePrompt({
  name: 'generatePersonalizedOutboundMessagePrompt',
  input: {schema: GeneratePersonalizedOutboundMessageInputSchema},
  output: {schema: GeneratePersonalizedOutboundMessageOutputSchema},
  prompt: `You are an AI assistant designed to generate personalized outbound messages for leads.

  Based on the following lead details:
  {{leadDetails}}

  And the following product details:
  {{productDetails}}

  Generate a personalized outbound message with a {{tone}} tone for {{channel}}.
  Return the message as a JSON object with a single 'message' field.
  Make the message engaging and tailored to the lead's specific interests and needs.
  The message should be concise and direct.
  `,
});

const generatePersonalizedOutboundMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOutboundMessageFlow',
    inputSchema: GeneratePersonalizedOutboundMessageInputSchema,
    outputSchema: GeneratePersonalizedOutboundMessageOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedOutboundMessagePrompt(input);
    return output!;
  }
);
