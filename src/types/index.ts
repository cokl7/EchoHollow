export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  partnerId?: string;
  inviteCode?: string;
  subscriptionTier: 'free' | 'premium' | 'family';
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiaryRequest {
  content: string;
  mood: string;
  tags?: string[];
}

export interface TreeholePost {
  id: string;
  userId: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface EmotionAnalysis {
  id: string;
  userId: string;
  entryId: string;
  emotions: {
    anger: number;
    sadness: number;
    anxiety: number;
    joy: number;
  };
  summary: string;
  createdAt: string;
}

export interface MediationSuggestion {
  id: string;
  userId: string;
  type: 'communication' | 'reflection' | 'exercise';
  content: string;
  priority: number;
  createdAt: string;
}

export interface PartnerInsight {
  id: string;
  forUserId: string;
  fromUserId: string;
  content: string;
  isAuthorized: boolean;
  createdAt: string;
}

export interface DashboardData {
  relationshipHealth: number;
  emotionTrend: Array<{ date: string; score: number }>;
  positiveRatio: number;
  recentSuggestions: MediationSuggestion[];
}
