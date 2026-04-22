import { apiClient } from "@/lib/apiClient";
import type { PerformanceReviewResponse } from "@/types/performance/PerformanceReviewResponse";
import type { PerformanceReviewLevelResponse } from "@/types/performance/PerformanceReviewLevelResponse";
import type { PerformanceEmployeeResponse } from "@/types/performance/PerformanceEmployeeResponse";
import type { CreatePerformanceReviewRequest } from "@/types/performance/CreatePerformanceReviewRequest";
import type { UpdatePerformanceReviewRequest } from "@/types/performance/UpdatePerformanceReviewRequest";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";

import type { DepartmentResponse } from "@/types/department/DepartmentResponse";

export const performanceService = {
  getPerformanceReviewLevels: async (): Promise<ApiResponse<PerformanceReviewLevelResponse[]>> => {
    const response = await apiClient.get<ApiResponse<PerformanceReviewLevelResponse[]>>(`/performance-review-levels`);
    return response.data;
  },

  getReviewableDepartments: async (): Promise<ApiResponse<DepartmentResponse[]>> => {
    const response = await apiClient.get<ApiResponse<DepartmentResponse[]>>(`/performance-reviews/departments`);
    return response.data;
  },

  getPerformanceReviewEmployees: async (page: number = 1, size: number = 10, year?: number, month?: number, departmentId?: string, status?: string): Promise<ApiResponse<PageResponse<PerformanceEmployeeResponse>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PerformanceEmployeeResponse>>>(`/performance-reviews/employees`, {
      params: {
        page,
        size,
        reviewYear: year,
        reviewMonth: month,
        ...(departmentId && { departmentId }),
        ...(status && { status }),
      }
    });
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
