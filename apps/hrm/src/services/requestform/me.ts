import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import type { CreateLeaveRequest } from "@/types/requestform/CreateLeaveRequest";
import type { CreateWfhRequest } from "@/types/requestform/CreateWfhRequest";
import type { CreateAbsenceRequest } from "@/types/requestform/CreateAbsenceRequest";
import type { CreateBusinessTripRequest } from "@/types/requestform/CreateBusinessTripRequest";
import type { CreateAttendanceAdjustmentRequest } from "@/types/requestform/CreateAttendanceAdjustmentRequest";

export const requestFormMeService = {
  // ── Generic self-service ──

  getCurrentUserRequestForms: async (
    page: number = 1,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<RequestFormResponse>>> => {
    const response = await apiClient.get("/request-forms/me", { params: { page, size } });
    return response.data;
  },

  getCurrentUserRequestFormById: async (
    id: string
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.get(`/request-forms/me/${id}`);
    return response.data;
  },

  cancelCurrentUserRequestForm: async (
    id: string
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.patch(`/request-forms/me/${id}/cancel`);
    return response.data;
  },

  // ── Leave ──

  createLeave: async (
    request: CreateLeaveRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/leaves", request);
    return response.data;
  },

  updateLeave: async (
    id: string,
    request: CreateLeaveRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.put(`/request-forms/me/leaves/${id}`, request);
    return response.data;
  },

  // ── Absence ──

  createAbsence: async (
    request: CreateAbsenceRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/absences", request);
    return response.data;
  },

  updateAbsence: async (
    id: string,
    request: CreateAbsenceRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.put(`/request-forms/me/absences/${id}`, request);
    return response.data;
  },

  // ── Attendance Adjustment ──

  createAttendanceAdjustment: async (
    request: CreateAttendanceAdjustmentRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/attendance-adjustments", request);
    return response.data;
  },

  updateAttendanceAdjustment: async (
    id: string,
    request: CreateAttendanceAdjustmentRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.put(`/request-forms/me/attendance-adjustments/${id}`, request);
    return response.data;
  },

  // ── Business Trip ──

  createBusinessTrip: async (
    request: CreateBusinessTripRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/business-trips", request);
    return response.data;
  },

  updateBusinessTrip: async (
    id: string,
    request: CreateBusinessTripRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.put(`/request-forms/me/business-trips/${id}`, request);
    return response.data;
  },

  // ── WFH ──

  createWfh: async (
    request: CreateWfhRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/wfh", request);
    return response.data;
  },

  updateWfh: async (
    id: string,
    request: CreateWfhRequest
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.put(`/request-forms/me/wfh/${id}`, request);
    return response.data;
  },
};
