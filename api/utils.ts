import jwt from 'jsonwebtoken';
import { EmotionAnalysis, MediationSuggestion } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const hashPassword = async (password: string): Promise<string> => {
  return password;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return password === hash;
};

export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const analyzeEmotion = (content: string, userId: string, entryId: string): EmotionAnalysis => {
  const emotions = {
    anger: Math.random() * 0.3,
    sadness: Math.random() * 0.3,
    anxiety: Math.random() * 0.3,
    joy: Math.random() * 0.5 + 0.2,
  };

  const summaries = [
    '这篇日记表达了一些复杂的情绪，建议多关注自己内心的感受。',
    '看起来今天的心情有些起伏，试着和伴侣分享你的感受吧。',
    '日记中透露出一些积极的情绪，继续保持这样的心态！',
  ];

  return {
    id: Date.now().toString(),
    userId,
    entryId,
    emotions,
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    createdAt: new Date().toISOString(),
  };
};

export const generateMediationSuggestions = (userId: string, content: string): MediationSuggestion[] => {
  const suggestions: MediationSuggestion[] = [
    {
      id: Date.now().toString(),
      userId,
      type: 'communication',
      content: '找一个合适的时间，和伴侣坦诚地交流你的感受和需求。',
      priority: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: (Date.now() + 1).toString(),
      userId,
      type: 'reflection',
      content: '试着站在伴侣的角度思考问题，理解对方的立场和感受。',
      priority: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: (Date.now() + 2).toString(),
      userId,
      type: 'exercise',
      content: '每天给对方一个真诚的赞美，这能有效提升关系质量。',
      priority: 3,
      createdAt: new Date().toISOString(),
    },
  ];

  return suggestions;
};
