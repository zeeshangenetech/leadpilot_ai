'use server';

import {
  generatePersonalizedOutboundMessage,
  type GeneratePersonalizedOutboundMessageInput,
} from '@/ai/flows/generate-personalized-outbound-messages';

export async function generateMessageAction(
  input: GeneratePersonalizedOutboundMessageInput
) {
  try {
    const result = await generatePersonalizedOutboundMessage(input);
    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error generating message:', error);
    return {
      success: false,
      error:
        'Failed to generate message. Please check the AI service configuration.',
    };
  }
}
