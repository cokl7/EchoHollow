import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, DiaryEntry, TreeholePost, MediationSuggestion, DashboardData } from '../types';

interface AppState {
  user: User | null;
  token: string | null;
  diaryEntries: DiaryEntry[];
  treeholePosts: TreeholePost[];
  suggestions: MediationSuggestion[];
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setDiaryEntries: (entries: DiaryEntry[]) => void;
  addDiaryEntry: (entry: DiaryEntry) => void;
  setTreeholePosts: (posts: TreeholePost[]) => void;
  addTreeholePost: (post: TreeholePost) => void;
  setSuggestions: (suggestions: MediationSuggestion[]) => void;
  setDashboardData: (data: DashboardData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      diaryEntries: [],
      treeholePosts: [],
      suggestions: [],
      dashboardData: null,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setDiaryEntries: (entries) => set({ diaryEntries: entries }),
      addDiaryEntry: (entry) => set((state) => ({ 
        diaryEntries: [entry, ...state.diaryEntries] 
      })),
      setTreeholePosts: (posts) => set({ treeholePosts: posts }),
      addTreeholePost: (post) => set((state) => ({ 
        treeholePosts: [post, ...state.treeholePosts] 
      })),
      setSuggestions: (suggestions) => set({ suggestions }),
      setDashboardData: (data) => set({ dashboardData: data }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      logout: () => set({ 
        user: null, 
        token: null,
        diaryEntries: [],
        treeholePosts: [],
        suggestions: [],
        dashboardData: null
      }),
    }),
    {
      name: 'echohollow-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);
