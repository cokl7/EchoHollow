import { User, DiaryEntry, TreeholePost, EmotionAnalysis, MediationSuggestion, PartnerInsight } from './types';

export const users: User[] = [
  {
    id: '1',
    email: 'demo@echohollow.com',
    passwordHash: 'demo123',
    name: '演示用户',
    inviteCode: 'DEMO123',
    subscriptionTier: 'free',
    createdAt: new Date().toISOString(),
  },
];

export const diaryEntries: DiaryEntry[] = [
  {
    id: '1',
    userId: '1',
    content: '今天和伴侣一起做了晚餐，感觉很温馨。虽然之前有过一些小矛盾，但今天的时光让我想起了我们刚在一起的时候。',
    mood: 'happy',
    tags: ['温馨', '晚餐'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    content: '今天因为工作的事情心情有点烦躁，回到家后忍不住对伴侣发了脾气。现在想想很后悔，应该更好地控制自己的情绪。',
    mood: 'sad',
    tags: ['情绪', '工作'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const treeholePosts: TreeholePost[] = [
  {
    id: '1',
    userId: '1',
    content: '有时候觉得感情真的需要很多耐心，希望能和伴侣一起越来越好。',
    isAnonymous: true,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export const emotionAnalyses: EmotionAnalysis[] = [];

export const mediationSuggestions: MediationSuggestion[] = [
  {
    id: '1',
    userId: '1',
    type: 'communication',
    content: '建议明天和伴侣一起做一件你们都喜欢的事情，比如看一部电影，然后分享彼此的感受。',
    priority: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    type: 'reflection',
    content: '当你感到烦躁时，试着先暂停3秒钟，深呼吸，然后再表达你的感受。',
    priority: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    type: 'exercise',
    content: '每天花10分钟写下3件你感激伴侣的事情，这会帮助你更多地关注积极的一面。',
    priority: 3,
    createdAt: new Date().toISOString(),
  },
];

export const partnerInsights: PartnerInsight[] = [];

export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);
export const getUserByEmail = (email: string): User | undefined => users.find(u => u.email === email);
export const getUserByInviteCode = (code: string): User | undefined => users.find(u => u.inviteCode === code);
export const addUser = (user: User) => users.push(user);

export const getDiaryEntriesByUserId = (userId: string): DiaryEntry[] => 
  diaryEntries.filter(e => e.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const addDiaryEntry = (entry: DiaryEntry) => diaryEntries.push(entry);

export const getTreeholePosts = (): TreeholePost[] => 
  treeholePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
export const addTreeholePost = (post: TreeholePost) => treeholePosts.push(post);

export const getMediationSuggestionsByUserId = (userId: string): MediationSuggestion[] => 
  mediationSuggestions.filter(s => s.userId === userId).sort((a, b) => a.priority - b.priority);
export const addMediationSuggestion = (suggestion: MediationSuggestion) => mediationSuggestions.push(suggestion);
