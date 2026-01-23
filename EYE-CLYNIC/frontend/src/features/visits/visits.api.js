/* Visits Feature API - Centralized API calls for visit-related operations */

import apiClient from "../../services/apiClient";

/**
 * Fetch all visits with optional filtering
 */
export const fetchVisits = async (token, filters = {}) => {
  try {
    const response = await apiClient.get("/visits", {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch visits");
  }
};

/**
 * Fetch single visit by ID
 */
export const fetchVisitById = async (token, id) => {
  try {
    const response = await apiClient.get(`/visits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch visit");
  }
};

/**
 * Create new visit
 */
export const createVisit = async (token, visitData) => {
  try {
    const response = await apiClient.post("/visits", visitData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to create visit");
  }
};

/**
 * Update visit information
 */
export const updateVisit = async (token, id, visitData) => {
  try {
    const response = await apiClient.put(`/visits/${id}`, visitData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to update visit");
  }
};

/**
 * Delete visit
 */
export const deleteVisit = async (token, id) => {
  try {
    const response = await apiClient.delete(`/visits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to delete visit");
  }
};

/**
 * Fetch visits for a specific patient
 */
export const fetchPatientVisits = async (token, patientId) => {
  try {
    const response = await apiClient.get(`/patients/${patientId}/visits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch patient visits");
  }
};
