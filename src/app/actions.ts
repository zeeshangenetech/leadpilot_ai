'use server';
import 'server-only';
import {
  generatePersonalizedOutboundMessage,
  type GeneratePersonalizedOutboundMessageInput,
  type GeneratePersonalizedOutboundMessageOutput,
} from '@/ai/flows/generate-personalized-outbound-messages';
import type { SmtpSettings } from '@/lib/settings-service';
import nodemailer from 'nodemailer';
import { generateUpsellSuggestions, type GenerateUpsellSuggestionsInput, type GenerateUpsellSuggestionsOutput } from '@/ai/flows/generate-upsell-suggestions';

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

export type SendEmailInput = {
    smtpSettings: SmtpSettings;
    to: string;
    subject: string;
    body: string;
}

export async function sendEmailAction(input: SendEmailInput): Promise<{ success: boolean; error?: string }> {
    const { smtpSettings, to, subject, body } = input;
    
    if (!smtpSettings || !smtpSettings.host || !smtpSettings.port || !smtpSettings.user || !smtpSettings.pass) {
        return { success: false, error: "SMTP settings are not configured. Please configure them in the settings page." };
    }

    const transporter = nodemailer.createTransport({
        host: smtpSettings.host,
        port: smtpSettings.port,
        secure: smtpSettings.port === 465, // true for 465, false for other ports
        auth: {
            user: smtpSettings.user,
            pass: smtpSettings.pass,
        },
    });

    try {
        await transporter.verify();
    } catch (error) {
        console.error('Error verifying SMTP transporter:', error);
        return { success: false, error: 'Failed to connect to SMTP server. Please check your credentials.' };
    }

    try {
        await transporter.sendMail({
            from: `"${smtpSettings.from.split('@')[0]}" <${smtpSettings.from}>`,
            to: to,
            subject: subject,
            html: body.replace(/\n/g, '<br />'),
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email.' };
    }
}

export async function generateUpsellSuggestionsAction(
  input: GenerateUpsellSuggestionsInput
): Promise<{ success: true; data: GenerateUpsellSuggestionsOutput } | { success: false; error: string }> {
  try {
    const result = await generateUpsellSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating upsell suggestions:', error);
    return {
      success: false,
      error:
        'Failed to generate upsell suggestions. Please check the AI service configuration.',
    };
  }
}
