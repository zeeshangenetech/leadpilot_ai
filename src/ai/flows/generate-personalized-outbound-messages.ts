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

export async function generatePersonalizedOutboundMessage(
  input: GeneratePersonalizedOutboundMessageInput
): Promise<GeneratePersonalizedOutboundMessageOutput> {
  return generatePersonalizedOutboundMessageFlow(input);
}

const generatePersonalizedOutboundMessagePrompt = ai.definePrompt({
  name: 'generatePersonalizedOutboundMessagePrompt',
  input: {schema: GeneratePersonalizedOutboundMessageInputSchema},
  output: {schema: GeneratePersonalizedOutboundMessageOutputSchema},
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
```