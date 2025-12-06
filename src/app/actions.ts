'use server';

import {
  generatePersonalizedOutboundMessage,
  type GeneratePersonalizedOutboundMessageInput,
  type GeneratePersonalizedOutboundMessageOutput,
} from '@/ai/flows/generate-personalized-outbound-messages';

export async function generateMessageAction(
  input: GeneratePersonalizedOutboundMessageInput
): Promise<{ success: true; data: GeneratePersonalizedOutboundMessageOutput } | { success: false; error: string }> {
  try {
    const result = await generatePersonalizedOutboundMessage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating message:', error);
    return {
      success: false,
      error:
        'Failed to generate message. Please check the AI service configuration.',
    };
  }
}
```