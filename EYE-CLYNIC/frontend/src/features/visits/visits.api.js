/* Visits Feature API - Centralized API calls for visit-related operations */

import axios from "axios";

const API_URL = "http://localhost:5000/api";

/**
 * Fetch all visits with optional filtering
 */
export const fetchVisits = async (token, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/visits`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch visits");
  }
};

/**
 * Fetch single visit by ID
 */
export const fetchVisitById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/visits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch visit");
  }
};

/**
 * Create new visit
 */
export const createVisit = async (token, visitData) => {
  try {
    const response = await axios.post(`${API_URL}/visits`, visitData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create visit");
  }
};

/**
 * Update visit information
 */
export const updateVisit = async (token, id, visitData) => {
  try {
    const response = await axios.put(`${API_URL}/visits/${id}`, visitData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update visit");
  }
};

/**
 * Delete visit
 */
export const deleteVisit = async (token, id) => {
  try {
    const response = await axios.delete(`${API_URL}/visits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete visit");
  }
};

/**
 * Fetch visits for a specific patient
 */
export const fetchPatientVisits = async (token, patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/patients/${patientId}/visits`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch patient visits"
    );
  }
};
