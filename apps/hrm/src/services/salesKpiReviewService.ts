import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type {
  SalesKpiReviewResponse,
  GetSalesKpiReviewsParams,
  UpsertSalesKpiReviewRequest,
} from "@/types/sales-kpi-review/SalesKpiReviewResponse";

import type { PageResponse } from "@/types/base/PageResponse";

export const salesKpiReviewService = {
  getAll: async (params: GetSalesKpiReviewsParams): Promise<SalesKpiReviewResponse[]> => {
    const { data } = await apiClient.get<ApiResponse<PageResponse<SalesKpiReviewResponse>>>(
      "/sales-kpi-reviews",
      { params },
    );
    return data.data?.content ?? [];
  },

  getById: async (id: string): Promise<SalesKpiReviewResponse> => {
    const { data } = await apiClient.get<ApiResponse<SalesKpiReviewResponse>>(
      `/sales-kpi-reviews/${id}`,
    );
    return data.data!;
  },

  getCandidates: async (params: Omit<GetSalesKpiReviewsParams, "status" | "page" | "size">): Promise<SalesKpiReviewResponse[]> => {
    const { data } = await apiClient.get<ApiResponse<SalesKpiReviewResponse[]>>(
      "/sales-kpi-reviews/candidates",
      { params },
    );
    return data.data ?? [];
  },

  create: async (payload: UpsertSalesKpiReviewRequest): Promise<SalesKpiReviewResponse> => {
    const { data } = await apiClient.post<ApiResponse<SalesKpiReviewResponse>>(
      "/sales-kpi-reviews",
      payload,
    );
    return data.data!;
  },

  update: async (id: string, payload: UpsertSalesKpiReviewRequest): Promise<SalesKpiReviewResponse> => {
    const { data } = await apiClient.put<ApiResponse<SalesKpiReviewResponse>>(
      `/sales-kpi-reviews/${id}`,
      payload,
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/sales-kpi-reviews/${id}`);
  },
};
