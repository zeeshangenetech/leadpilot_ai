export type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  avatar: string;
  source: 'LinkedIn' | 'Upwork' | 'Facebook' | 'Email';
  score: number;
  scoreCategory: 'Hot' | 'Warm' | 'Cold';
  scoreExplanation: string;
  lastActivity: Date;
  tags: string[];
  interactionCount: number;
  purchaseHistory: { productId: string; productName: string; date: Date }[];
  linkedinProfile?: string;
  website?: string;
  recentActivity: string;
  raw_data?: Record<string, any>; // To store original data for scoring
};

export type UpsellSuggestion = {
  id?: string;
  productName: string;
  reason: string;
  confidence: number; // 0-1
};
