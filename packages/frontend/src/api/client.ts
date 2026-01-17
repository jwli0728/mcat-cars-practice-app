import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  CreateSessionRequest,
  SubmitAnswerRequest,
  PassageWithQuestions,
  UserProgress,
} from '@mcat-app/shared';

const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Request failed',
        message: response.statusText,
      }));
      throw new Error(error.message || error.error);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(data: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: { id: number; email: string; name: string } }>(
      '/auth/me'
    );
  }

  // Passage endpoints
  async getPassages() {
    return this.request<{ passages: any[] }>('/passages');
  }

  async getPassage(id: number) {
    return this.request<{ passage: PassageWithQuestions }>(`/passages/${id}`);
  }

  // Session endpoints
  async createSession(data: CreateSessionRequest) {
    return this.request<{ session: any; passage: PassageWithQuestions }>(
      '/sessions',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getSession(sessionId: number) {
    return this.request<any>(`/sessions/${sessionId}`);
  }

  async submitAnswer(sessionId: number, data: SubmitAnswerRequest) {
    return this.request<{ answer: any }>(`/sessions/${sessionId}/answer`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async completeSession(sessionId: number, timeSpent?: number) {
    return this.request<{ session: any; score: number; totalQuestions: number }>(
      `/sessions/${sessionId}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({ timeSpent }),
      }
    );
  }

  async getSessionResults(sessionId: number) {
    return this.request<any>(`/sessions/${sessionId}/results`);
  }

  // Progress endpoints
  async getProgress() {
    return this.request<{ progress: UserProgress }>('/progress');
  }
}

export const apiClient = new ApiClient();
