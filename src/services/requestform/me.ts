import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import type { CreateLeaveRequest } from "@/types/requestform/CreateLeaveRequest";
import type { CreateWfhRequest } from "@/types/requestform/CreateWfhRequest";
import type { CreateAbsenceRequest } from "@/types/requestform/CreateAbsenceRequest";
import type { CreateBusinessTripRequest } from "@/types/requestform/CreateBusinessTripRequest";
import type { CreateResignationRequest } from "@/types/requestform/CreateResignationRequest";
import type { CreateAttendanceAdjustmentRequest } from "@/types/requestform/CreateAttendanceAdjustmentRequest";

export const requestFormMeService = {
  getCurrentUserRequestForms: async (): Promise<ApiResponse<RequestFormResponse[]>> => {
    const response = await apiClient.get("/request-forms/me");
    return response.data;
  },

  getCurrentUserRequestFormById: async (id: string): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.get(`/request-forms/me/${id}`);
    return response.data;
  },

  cancelCurrentUserRequestForm: async (id: string): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.patch(`/request-forms/me/${id}/cancel`);
    return response.data;
  },

  createCurrentUserLeaveForm: async (request: CreateLeaveRequest): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/leaves", request);
    return response.data;
  },

  createCurrentUserWfhForm: async (request: CreateWfhRequest): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/wfh", request);
    return response.data;
  },

  createCurrentUserAbsenceForm: async (request: CreateAbsenceRequest): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/absences", request);
    return response.data;
  },

  createCurrentUserBusinessTripForm: async (request: CreateBusinessTripRequest): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/business-trips", request);
    return response.data;
  },

  createCurrentUserResignationForm: async (request: CreateResignationRequest): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/resignations", request);
    return response.data;
  },

  createCurrentUserAttendanceAdjustmentForm: async (request: CreateAttendanceAdjustmentRequest): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.post("/request-forms/me/attendance-adjustments", request);
    return response.data;
  },
};
