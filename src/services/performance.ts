import { apiClient } from "@/lib/apiClient";
import type { PerformanceReviewResponse } from "@/types/performance/PerformanceReviewResponse";
import type { PerformanceReviewLevelResponse } from "@/types/performance/PerformanceReviewLevelResponse";
import type { CreatePerformanceReviewRequest } from "@/types/performance/CreatePerformanceReviewRequest";
import type { UpdatePerformanceReviewRequest } from "@/types/performance/UpdatePerformanceReviewRequest";
import type { ApiResponse } from "@/types/base/ApiResponse";

export const performanceService = {
  getPerformanceReviews: async (filters?: { revieweeUserId?: string, reviewYear?: number, reviewMonth?: number }): Promise<ApiResponse<PerformanceReviewResponse[]>> => {
    const params = new URLSearchParams();
    if (filters?.revieweeUserId) params.append("revieweeUserId", filters.revieweeUserId);
    if (filters?.reviewYear) params.append("reviewYear", filters.reviewYear.toString());
    if (filters?.reviewMonth) params.append("reviewMonth", filters.reviewMonth.toString());
    
    // Convert to string, ensuring we only include the query if params exist
    const queryString = params.toString();
    const url = `/performance-reviews${queryString ? `?${queryString}` : ""}`;
    const response = await apiClient.get<ApiResponse<PerformanceReviewResponse[]>>(url);
    return response.data;
  },

  getPerformanceReviewLevels: async (): Promise<ApiResponse<PerformanceReviewLevelResponse[]>> => {
    const response = await apiClient.get<ApiResponse<PerformanceReviewLevelResponse[]>>(`/performance-review-levels`);
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
