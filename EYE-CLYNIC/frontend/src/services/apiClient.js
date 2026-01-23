/**
 * API Client - Centralized API service for EYE-CLYNIC Frontend
 * 
 * This file provides a ready-to-use API client with:
 * - Automatic token injection
 * - Error handling
 * - Token expiration handling
 * - Type-safe request methods
 */

import axios from 'axios';

// Base API URL - Update this based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL;


// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get token from storage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Clear auth data
 */
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login if in browser
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      clearAuth();
    }
    
    // Extract error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// ============================================
// AUTHENTICATION API
// ============================================

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const { token, ...userData } = response.data;
  
  // Store token and user data
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  return { token, user: userData };
};

/**
 * Get current authenticated user
 * @returns {Promise<object>}
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Register new user (Admin only)
 * @param {object} userData - { name, email, password, role }
 * @returns {Promise<object>}
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// ============================================
// USERS API
// ============================================

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>}
 */
export const getUserById = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {object} userData - User data to update
 * @returns {Promise<object>}
 */
export const updateUser = async (userId, userData) => {
  const response = await apiClient.put(`/users/${userId}`, userData);
  return response.data;
};

/**
 * Delete user (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<object>}
 */
export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};

// ============================================
// PATIENTS API
// ============================================

/**
 * Get all patients
 * @returns {Promise<Array>}
 */
export const getAllPatients = async () => {
  const response = await apiClient.get('/patients');
  return response.data;
};

/**
 * Get patient by ID
 * @param {string} patientId - Patient ID
 * @returns {Promise<object>}
 */
export const getPatientById = async (patientId) => {
  const response = await apiClient.get(`/patients/${patientId}`);
  return response.data;
};

/**
 * Search patients by name
 * @param {string} name - Patient name (partial match)
 * @returns {Promise<{count: number, patients: Array}>}
 */
export const searchPatientsByName = async (name) => {
  const response = await apiClient.get(`/patients/search/${encodeURIComponent(name)}`);
  return response.data;
};

/**
 * Get patient with all visits
 * @param {string} patientId - Patient ID
 * @returns {Promise<{patient: object, visits: Array, visitCount: number}>}
 */
export const getPatientWithVisits = async (patientId) => {
  const response = await apiClient.get(`/patients/${patientId}/visits`);
  return response.data;
};

/**
 * Create new patient
 * @param {object} patientData - { name, phone, age, gender? }
 * @returns {Promise<object>}
 */
export const createPatient = async (patientData) => {
  const response = await apiClient.post('/patients', patientData);
  return response.data.patient;
};

/**
 * Update patient
 * @param {string} patientId - Patient ID
 * @param {object} patientData - Patient data to update
 * @returns {Promise<object>}
 */
export const updatePatient = async (patientId, patientData) => {
  const response = await apiClient.put(`/patients/${patientId}`, patientData);
  return response.data.patient;
};

/**
 * Delete patient (Admin only)
 * @param {string} patientId - Patient ID
 * @returns {Promise<object>}
 */
export const deletePatient = async (patientId) => {
  const response = await apiClient.delete(`/patients/${patientId}`);
  return response.data;
};

// ============================================
// VISITS API
// ============================================

/**
 * Get all visits
 * @returns {Promise<Array>}
 */
export const getAllVisits = async () => {
  const response = await apiClient.get('/visits');
  return response.data;
};

/**
 * Get visit by ID
 * @param {string} visitId - Visit ID
 * @returns {Promise<object>}
 */
export const getVisitById = async (visitId) => {
  const response = await apiClient.get(`/visits/${visitId}`);
  return response.data;
};

/**
 * Create new visit
 * @param {object} visitData - Visit data (see API docs for structure)
 * @returns {Promise<object>}
 */
export const createVisit = async (visitData) => {
  const response = await apiClient.post('/visits', visitData);
  return response.data.visit;
};

/**
 * Update visit
 * @param {string} visitId - Visit ID
 * @param {object} visitData - Visit data to update
 * @returns {Promise<object>}
 */
export const updateVisit = async (visitId, visitData) => {
  const response = await apiClient.put(`/visits/${visitId}`, visitData);
  return response.data.visit;
};

/**
 * Delete visit (Admin only)
 * @param {string} visitId - Visit ID
 * @returns {Promise<object>}
 */
export const deleteVisit = async (visitId) => {
  const response = await apiClient.delete(`/visits/${visitId}`);
  return response.data;
};

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Health check endpoint
 * @returns {Promise<object>}
 */
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

// Export the axios instance for custom requests
export default apiClient;
