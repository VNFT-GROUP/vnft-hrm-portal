import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { 
  RequestFormStatus, 
  RequestFormType 
} from "@/types/requestform/RequestFormEnums";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import type { RequestFormStatisticPeriod } from "@/types/requestform/RequestFormEnums";
import type { RequestFormStatisticsResponse } from "@/types/requestform/RequestFormStatisticsResponse";

export const requestFormApprovalService = {
  getRequestFormsForApproval: async (status?: RequestFormStatus, type?: RequestFormType): Promise<ApiResponse<RequestFormResponse[]>> => {
    const response = await apiClient.get("/request-forms/approval", {
      params: { status, type }
    });
    return response.data;
  },

  getRequestFormStatistics: async (
    period: RequestFormStatisticPeriod = "THIS_MONTH",
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<RequestFormStatisticsResponse>> => {
    const response = await apiClient.get("/request-forms/approval/statistics", {
      params: { period, startDate, endDate },
    });
    return response.data;
  },

  getApprovalRequestFormById: async (id: string): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.get(`/request-forms/approval/${id}`);
    return response.data;
  },

  approveRequestForm: async (id: string): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.patch(`/request-forms/approval/${id}/approve`);
    return response.data;
  },

  rejectRequestForm: async (id: string): Promise<ApiResponse<RequestFormResponse>> => {
    const response = await apiClient.patch(`/request-forms/approval/${id}/reject`);
    return response.data;
  }
};
