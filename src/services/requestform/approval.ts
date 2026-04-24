import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type {
  RequestFormStatus,
  RequestFormType,
  RequestFormStatisticPeriod,
} from "@/types/requestform/RequestFormEnums";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import type { RequestFormStatisticsResponse } from "@/types/requestform/RequestFormStatisticsResponse";
import type { DepartmentResponse } from "@/types/department/DepartmentResponse";

export const requestFormApprovalService = {
  getRequestFormsForApproval: async (
    status?: RequestFormStatus,
    type?: RequestFormType,
    departmentId?: string
  ): Promise<ApiResponse<RequestFormResponse[]>> => {
    const response = await apiClient.get("/request-forms/approval", {
      params: { status, type, departmentId },
    });
    return response.data;
  },

  getApprovableDepartments: async (): Promise<ApiResponse<DepartmentResponse[]>> => {
    const response = await apiClient.get("/request-forms/approval/departments");
    return response.data;
  },

  getRequestFormStatistics: async (
    period: RequestFormStatisticPeriod = "THIS_MONTH",
    startDate?: string,
    endDate?: string,
    departmentId?: string
  ): Promise<ApiResponse<RequestFormStatisticsResponse>> => {
    const response = await apiClient.get("/request-forms/approval/statistics", {
      params: { period, startDate, endDate, departmentId },
    });
    return response.data;
  },

  getApprovalRequestFormById: async (
    id: string
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.get(`/request-forms/approval/${id}`);
    return response.data;
  },

  approveRequestForm: async (
    id: string
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.patch(`/request-forms/approval/${id}/approve`);
    return response.data;
  },

  rejectRequestForm: async (
    id: string
  ): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.patch(`/request-forms/approval/${id}/reject`);
    return response.data;
  },
};
