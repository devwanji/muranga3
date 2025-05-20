// API utility functions for static site deployment

// Base URL for API - defaults to current origin in browser, can be changed for production
const API_BASE_URL = '';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

// Generic fetch function with error handling
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    console.error('API request error:', error);
    return { error: 'Network error, please try again later' };
  }
}

// Auth API
export const authApi = {
  register: (username: string, password: string, userType: string) => 
    fetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, userType }),
    }),
  
  login: (username: string, password: string) => 
    fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  logout: () => 
    fetchApi('/api/auth/logout', { method: 'POST' }),
  
  getCurrentUser: () => 
    fetchApi('/api/auth/me')
};

// Business API
export const businessApi = {
  getAll: () => fetchApi('/api/businesses'),
  getById: (id: number) => fetchApi(`/api/businesses/${id}`),
  create: (data: any) => fetchApi('/api/businesses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => fetchApi(`/api/businesses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
};

// Service Request API
export const serviceRequestApi = {
  getAll: () => fetchApi('/api/service-requests'),
  create: (data: any) => fetchApi('/api/service-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => fetchApi(`/api/service-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
};

// Notification API
export const notificationApi = {
  getAll: () => fetchApi('/api/notifications'),
  markAsRead: (id: number) => fetchApi(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  })
};