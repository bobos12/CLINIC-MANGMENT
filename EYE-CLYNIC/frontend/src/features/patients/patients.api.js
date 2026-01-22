/* Patients Feature API - Centralized API calls for patient-related operations */

import axios from "axios";

const API_URL = "http://localhost:5000/api";

/**
 * Fetch all patients with optional filtering
 */
export const fetchPatients = async (token, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/patients`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch patients");
  }
};

/**
 * Fetch single patient by ID
 */
export const fetchPatientById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch patient");
  }
};

/**
 * Create new patient
 */
export const createPatient = async (token, patientData) => {
  try {
    const response = await axios.post(`${API_URL}/patients`, patientData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create patient");
  }
};

/**
 * Update patient information
 */
export const updatePatient = async (token, id, patientData) => {
  try {
    const response = await axios.put(`${API_URL}/patients/${id}`, patientData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update patient");
  }
};

/**
 * Delete patient
 */
export const deletePatient = async (token, id) => {
  try {
    const response = await axios.delete(`${API_URL}/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete patient");
  }
};

/**
 * Search patients by name, phone, or ID
 */
export const searchPatients = async (token, searchQuery) => {
  try {
    const response = await axios.get(`${API_URL}/patients/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to search patients");
  }
};
