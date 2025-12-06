# **App Name**: LeadPilot AI

## Core Features:

- CSV Lead Upload: Upload leads from CSV files (LinkedIn, Upwork, Facebook, Emails), and normalize them into a unified schema.
- Lead Scoring Engine: Score leads based on recency, source, interaction count, and purchase history. Assign a category (Hot/Warm/Cold) with an explanation. Provide /api/leads/score and /api/leads/score-batch endpoints.
- Upsell Opportunity Detection: Recommend complementary products, upgrades, or retention offers based on purchase history and inactivity. Expose /api/leads/:id/upsell with recommended product, reason, and confidence.
- AI Message Generation: Generate personalized outbound messages for leads using an LLM tool. Tone should be friendly and professional, consider email and WhatsApp, returning a JSON.
- Lead Table: Display leads in a filterable table with sorting by source, score, last activity and tags.
- Lead Detail View: Show lead details including score, explanation, upsell suggestions, and messaging options.
- Direct Email Sending: Enable sending emails directly from the system using SMTP details.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to convey professionalism and trust.
- Background color: Very light lavender (#F0F2FA).
- Accent color: A vibrant purple (#7E57C2) to highlight important actions and sections.
- Body and headline font: 'Inter', a grotesque sans-serif font, to provide a modern, neutral look that is suitable for both headlines and body text.
- Use modern, outline-style icons to represent different lead sources, scores, and actions.
- Clean, dashboard-based layout with clear sections for lead aggregation, scoring, and messaging.
- Subtle animations for loading indicators and transitions to enhance user experience.