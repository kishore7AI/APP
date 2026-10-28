const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('nxtlearnn_token');

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.detail || response.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const authApi = {
  signup: (payload) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    apiRequest('/auth/me', {
      method: 'GET',
    }),
};

export const coursesApi = {
  getAll: () => apiRequest('/courses'),
  getBySlug: (slug) => apiRequest(`/courses/${slug}`),
};

export const adminApi = {
  getStats: () => apiRequest('/admin/stats'),
  getCourses: () => apiRequest('/admin/courses'),
  getCourse: (id) => apiRequest(`/admin/courses/${id}`),
  createCourse: (payload) =>
    apiRequest('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCourse: (id, payload) =>
    apiRequest(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteCourse: (id) =>
    apiRequest(`/admin/courses/${id}`, {
      method: 'DELETE',
    }),
  addSection: (courseId, payload) =>
    apiRequest(`/admin/courses/${courseId}/sections`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteSection: (sectionId) =>
    apiRequest(`/admin/sections/${sectionId}`, {
      method: 'DELETE',
    }),
  addLesson: (sectionId, payload) =>
    apiRequest(`/admin/sections/${sectionId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getLesson: (lessonId) => apiRequest(`/admin/lessons/${lessonId}`),
  updateLesson: (lessonId, payload) =>
    apiRequest(`/admin/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteLesson: (lessonId) =>
    apiRequest(`/admin/lessons/${lessonId}`, {
      method: 'DELETE',
    }),
  uploadMedia: (file, folder = 'courses/thumbnails') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return apiRequest('/admin/imagekit/upload', {
      method: 'POST',
      body: formData,
    });
  },
  getImagekitAuth: () => apiRequest('/admin/imagekit/auth'),
};

