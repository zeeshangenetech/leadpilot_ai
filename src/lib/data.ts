import type { Lead, UpsellSuggestion } from './types';

export const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    company: 'Innovate Inc.',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    source: 'LinkedIn',
    score: 92,
    scoreCategory: 'Hot',
    scoreExplanation: 'High engagement and recent purchase history.',
    lastActivity: new Date(2024, 6, 20),
    tags: ['enterprise', 'saas'],
    interactionCount: 15,
    purchaseHistory: [{ productId: 'prod_1', productName: 'Pro Plan', date: new Date(2024, 5, 1) }],
    linkedinProfile: 'https://linkedin.com/in/alicejohnson',
    website: 'https://innovateinc.com',
    recentActivity: 'Downloaded "Advanced Analytics" whitepaper.',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@workforce.io',
    company: 'Workforce.io',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    source: 'Upwork',
    score: 78,
    scoreCategory: 'Warm',
    scoreExplanation: 'Consistent interaction, potential for upsell.',
    lastActivity: new Date(2024, 6, 15),
    tags: ['smb', 'hiring'],
    interactionCount: 8,
    purchaseHistory: [{ productId: 'prod_2', productName: 'Basic Plan', date: new Date(2024, 3, 10) }],
    linkedinProfile: 'https://linkedin.com/in/bobsmith',
    website: 'https://workforce.io',
    recentActivity: 'Attended "Future of Work" webinar.',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@creative.co',
    company: 'Creative Co.',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    source: 'Facebook',
    score: 45,
    scoreCategory: 'Cold',
    scoreExplanation: 'Low interaction and no recent activity.',
    lastActivity: new Date(2024, 2, 5),
    tags: ['design', 'freelance'],
    interactionCount: 2,
    purchaseHistory: [],
    linkedinProfile: 'https://linkedin.com/in/charliebrown',
    website: 'https://creative.co',
    recentActivity: 'Visited pricing page.',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@justice.org',
    company: 'Justice League',
    avatar: 'https://picsum.photos/seed/avatar4/100/100',
    source: 'Email',
    score: 85,
    scoreCategory: 'Hot',
    scoreExplanation: 'Responded to recent email campaign.',
    lastActivity: new Date(2024, 6, 22),
    tags: ['non-profit', 'global'],
    interactionCount: 12,
    purchaseHistory: [{ productId: 'prod_1', productName: 'Pro Plan', date: new Date(2023, 11, 15) }],
    website: 'https://justice.org',
    recentActivity: 'Clicked on "Get a Demo" link.',
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan@imf.gov',
    company: 'IMF',
    avatar: 'https://picsum.photos/seed/avatar5/100/100',
    source: 'LinkedIn',
    score: 65,
    scoreCategory: 'Warm',
    scoreExplanation: 'Viewed profile and product pages multiple times.',
    lastActivity: new Date(2024, 5, 30),
    tags: ['security', 'government'],
    interactionCount: 5,
    purchaseHistory: [],
    linkedinProfile: 'https://linkedin.com/in/ethanhunt',
    recentActivity: 'Viewed "Enterprise Security" case study.',
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    email: 'fiona.g@spy.net',
    company: 'Independent Contractor',
    avatar: 'https://picsum.photos/seed/avatar6/100/100',
    source: 'Upwork',
    score: 30,
    scoreCategory: 'Cold',
    scoreExplanation: 'Initial contact, no follow-up.',
    lastActivity: new Date(2024, 1, 1),
    tags: ['security', 'freelance'],
    interactionCount: 1,
    purchaseHistory: [],
    recentActivity: 'Sent initial inquiry message.',
  },
];

const upsellSuggestions: UpsellSuggestion[] = [
    {
        id: 'up_1',
        productName: 'Enterprise Plan',
        reason: 'Client has reached 90% of their Pro Plan API limit.',
        confidence: 0.85
    },
    {
        id: 'up_2',
        productName: 'Analytics Add-on',
        reason: 'Frequently visits analytics-related documentation.',
        confidence: 0.78
    },
    {
        id: 'up_3',
        productName: 'Priority Support',
        reason: 'Inactivity for 60 days, retention offer.',
        confidence: 0.60
    }
];

// This is now imported from leads-service
// export function getLeads() {
//   return leads;
// }

// This is now imported from leads-service
// export function getLeadById(id: string): Lead | undefined {
//   return leads.find((lead) => lead.id === id);
// }
import { getLeadById } from './leads-service';

export function getUpsellSuggestionsByLeadId(leadId: string): UpsellSuggestion[] {
    // In a real app, this would be a dynamic lookup based on the lead's data.
    // Here we'll return a static list for demonstration.
    const lead = getLeadById(leadId);
    if (!lead) return [];

    if (lead.scoreCategory === 'Hot') {
        return [upsellSuggestions[0], upsellSuggestions[1]];
    }
    if (lead.scoreCategory === 'Warm') {
        return [upsellSuggestions[1]];
    }
    return [];
}
