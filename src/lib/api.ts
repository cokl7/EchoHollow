import type { 
  AuthCredentials, 
  AuthResponse, 
  User, 
  DiaryEntry, 
  CreateDiaryRequest, 
  TreeholePost, 
  EmotionAnalysis, 
  MediationSuggestion, 
  PartnerInsight, 
  DashboardData 
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      const headersObj = options.headers as Record<string, string>;
      Object.assign(headers, headersObj);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.message || '请求失败');
    }

    return response.json();
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: AuthCredentials & { name: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getDiaryEntries(): Promise<DiaryEntry[]> {
    return this.request<DiaryEntry[]>('/diary');
  }

  async createDiaryEntry(data: CreateDiaryRequest): Promise<DiaryEntry> {
    return this.request<DiaryEntry>('/diary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTreeholePosts(): Promise<TreeholePost[]> {
    return this.request<TreeholePost[]>('/treehole');
  }

  async createTreeholePost(data: { content: string; isAnonymous: boolean }): Promise<TreeholePost> {
    return this.request<TreeholePost>('/treehole', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmotionAnalysis(entryId: string): Promise<EmotionAnalysis> {
    return this.request<EmotionAnalysis>(`/analysis/${entryId}`);
  }

  async getMediationSuggestions(): Promise<MediationSuggestion[]> {
    return this.request<MediationSuggestion[]>('/analysis/suggestions');
  }

  async getPartnerInsights(): Promise<PartnerInsight[]> {
    return this.request<PartnerInsight[]>('/partnership/insights');
  }

  async invitePartner(email: string): Promise<void> {
    return this.request<void>('/partnership/invite', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async acceptInvite(inviteCode: string): Promise<User> {
    return this.request<User>('/partnership/accept', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  }

  async getDashboardData(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }
}

export const api = new ApiClient();
