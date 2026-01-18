const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
};

export const authService = {
  connectGmail: () => api.get('/auth/gmail/connect'),
};

export const goalService = {
  getGoals: (userId: string) => api.get(`/goals?userId=${userId}`),
  addGoal: (goal: any) => api.post('/goals', goal),
};

export const emailService = {
  fetchEmails: (userId: string) => api.get(`/emails/fetch?userId=${userId}`),
};

export const agentService = {
  submitFeedback: (feedback: any) => api.post('/agent/feedback', feedback),
  getPerformance: (userId: string) => api.get(`/analytics/agent-performance?userId=${userId}`),
};
