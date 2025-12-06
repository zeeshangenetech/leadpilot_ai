
import type { Lead } from './types';

type ScoringResult = {
  score: number;
  scoreCategory: 'Hot' | 'Warm' | 'Cold';
  scoreExplanation: string;
};

// Helper function to check for keywords
const containsKeywords = (text: string, keywords: string[]): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};

// --- Source-Specific Scoring Functions ---

function scoreLinkedInLead(lead: Lead): ScoringResult {
  let score = 50;
  const explanations: string[] = ['Base score for LinkedIn lead.'];

  const snippet = lead.recentActivity || '';
  const urgentKeywords = ['asap', 'urgent', 'immediately', 'quick turnaround'];
  const highValueKeywords = ['ai', 'chatbot', 'saas', 'custom web app', 'integration'];

  if (containsKeywords(snippet, urgentKeywords)) {
    score += 25;
    explanations.push('Urgent keywords found in post.');
  }
  if (containsKeywords(snippet, highValueKeywords)) {
    score += 15;
    explanations.push('High-value project keywords mentioned.');
  }
  
  // Example using raw_data if available
  if (lead.raw_data) {
    const funding = lead.raw_data['company_profile/funding_status'] as string;
    if (funding && funding.toLowerCase().includes('series')) {
        score += 10;
        explanations.push('Company is well-funded.');
    }
  }

  return categorizeScore(score, explanations);
}

function scoreUpworkLead(lead: Lead): ScoringResult {
  let score = 40;
  const explanations: string[] = ['Base score for Upwork lead.'];
  
  const snippet = lead.recentActivity || '';
  const urgentKeywords = ['urgent', 'immediate start', 'tight deadline'];
  
  if (containsKeywords(snippet, urgentKeywords)) {
    score += 20;
    explanations.push('Urgency indicated in job description.');
  }

  if (lead.raw_data) {
    const experienceLevel = lead.raw_data['project_details/experience_level'] as string;
    if (experienceLevel?.toLowerCase() === 'expert') {
        score += 15;
        explanations.push('Expert-level project commands a higher budget.');
    }
    const totalSpent = Number(lead.raw_data['client_engagement/total_spent'] || 0);
    if (totalSpent > 10000) {
        score += 20;
        explanations.push('Client has a high lifetime spend on the platform.');
    }
  }

  return categorizeScore(score, explanations);
}

function scoreFreelancerLead(lead: Lead): ScoringResult {
    let score = 35;
    const explanations: string[] = ['Base score for Freelancer lead.'];

    const snippet = lead.recentActivity || '';
    if (containsKeywords(snippet, ['ongoing', 'long-term'])) {
        score += 20;
        explanations.push('Potential for a long-term engagement.');
    }

    if (lead.raw_data) {
        const bidsCount = Number(lead.raw_data['bids_count'] || 0);
        if (bidsCount < 15) {
            score += 10;
            explanations.push('Low number of competing bids.');
        }
    }
    
    return categorizeScore(score, explanations);
}

function scoreEmailLead(lead: Lead): ScoringResult {
    let score = 45;
    const explanations: string[] = ['Base score for direct Email lead.'];

    const message = lead.recentActivity || '';
    if (containsKeywords(message, ['quote', 'proposal', 'long-term'])) {
        score += 30;
        explanations.push('Lead is actively seeking a quote or long-term partnership.');
    }

    return categorizeScore(score, explanations);
}


// --- Main Dispatch and Categorization ---

/**
 * Scores a lead based on its source and data.
 * @param lead The lead object to score.
 * @returns A ScoringResult object.
 */
export function scoreLead(lead: Lead): ScoringResult {
  switch (lead.source) {
    case 'LinkedIn':
      return scoreLinkedInLead(lead);
    case 'Upwork':
      // This will handle both 'Upwork' and 'Freelancer' as per normalization logic
      if (lead.id.startsWith('FR_')) {
        return scoreFreelancerLead(lead);
      }
      return scoreUpworkLead(lead);
    case 'Email':
      return scoreEmailLead(lead);
    case 'Facebook': // Placeholder for now
    default:
      return {
        score: Math.floor(Math.random() * 30) + 20,
        scoreCategory: 'Cold',
        scoreExplanation: 'Score based on generic data.',
      };
  }
}

/**
 * Categorizes a numerical score into Hot, Warm, or Cold.
 * @param score The numerical score.
 * @param explanations An array of reasons for the score.
 * @returns A ScoringResult object.
 */
function categorizeScore(score: number, explanations: string[]): ScoringResult {
  const finalScore = Math.min(Math.max(score, 0), 100); // Clamp score between 0 and 100
  let category: 'Hot' | 'Warm' | 'Cold';

  if (finalScore >= 80) {
    category = 'Hot';
  } else if (finalScore >= 50) {
    category = 'Warm';
  } else {
    category = 'Cold';
  }

  return {
    score: finalScore,
    scoreCategory: category,
    scoreExplanation: explanations.join(' '),
  };
}
