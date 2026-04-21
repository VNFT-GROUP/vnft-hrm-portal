import { apiClient } from "@/lib/apiClient";
import type { PerformanceReviewResponse } from "@/types/performance/PerformanceReviewResponse";
import type { PerformanceReviewLevelResponse } from "@/types/performance/PerformanceReviewLevelResponse";
import type { PerformanceEmployeeResponse } from "@/types/performance/PerformanceEmployeeResponse";
import type { CreatePerformanceReviewRequest } from "@/types/performance/CreatePerformanceReviewRequest";
import type { UpdatePerformanceReviewRequest } from "@/types/performance/UpdatePerformanceReviewRequest";
import type { ApiResponse } from "@/types/base/ApiResponse";

export const performanceService = {
  getPerformanceReviewLevels: async (): Promise<ApiResponse<PerformanceReviewLevelResponse[]>> => {
    const response = await apiClient.get<ApiResponse<PerformanceReviewLevelResponse[]>>(`/performance-review-levels`);
    return response.data;
  },

  getPerformanceReviewEmployees: async (year: number, month: number): Promise<ApiResponse<PerformanceEmployeeResponse[]>> => {
    const response = await apiClient.get<ApiResponse<PerformanceEmployeeResponse[]>>(`/performance-reviews/employees?reviewYear=${year}&reviewMonth=${month}`);
    return response.data;
  },

  getPerformanceReviewByUserAndPeriod: async (userId: string, year: number, month: number): Promise<ApiResponse<PerformanceReviewResponse>> => {
    const response = await apiClient.get<ApiResponse<PerformanceReviewResponse>>(`/performance-reviews/user/${userId}/period/${year}/${month}`);
    return response.data;
  },

  checkReviewEligibility: async (userId: string): Promise<ApiResponse<{revieweeUserId: string, canReview: boolean, reason?: string}>> => {
    const response = await apiClient.get<ApiResponse<{revieweeUserId: string, canReview: boolean, reason?: string}>>(`/performance-reviews/can-review/${userId}`);
    return response.data;
  },

  getPerformanceReviewById: async (id: string): Promise<ApiResponse<PerformanceReviewResponse>> => {
    const response = await apiClient.get<ApiResponse<PerformanceReviewResponse>>(`/performance-reviews/${id}`);
    return response.data;
  },

  createPerformanceReview: async (data: CreatePerformanceReviewRequest): Promise<ApiResponse<PerformanceReviewResponse>> => {
    const response = await apiClient.post<ApiResponse<PerformanceReviewResponse>>("/performance-reviews", data);
    return response.data;
  },

  updatePerformanceReview: async (id: string, data: UpdatePerformanceReviewRequest): Promise<ApiResponse<PerformanceReviewResponse>> => {
    const response = await apiClient.put<ApiResponse<PerformanceReviewResponse>>(`/performance-reviews/${id}`, data);
    return response.data;
  },

  deletePerformanceReview: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/performance-reviews/${id}`);
    return response.data;
  }
};
