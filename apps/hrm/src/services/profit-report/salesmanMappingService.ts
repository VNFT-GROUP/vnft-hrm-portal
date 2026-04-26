import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type {
  GetProfitReportSalesmanMappingsParams,
  ProfitReportSalesmanMappingResponse,
  UpsertProfitReportSalesmanMappingRequest,
} from "@/types/profit-report/SalesmanMappingResponse";

export const salesmanMappingService = {
  getAll: async (
    params: GetProfitReportSalesmanMappingsParams,
  ): Promise<ProfitReportSalesmanMappingResponse[]> => {
    const { data } = await apiClient.get<ApiResponse<ProfitReportSalesmanMappingResponse[]>>(
      "/profit-report-salesman-mappings",
      { params },
    );
    return data.data ?? [];
  },

  getById: async (id: string): Promise<ProfitReportSalesmanMappingResponse> => {
    const { data } = await apiClient.get<ApiResponse<ProfitReportSalesmanMappingResponse>>(
      `/profit-report-salesman-mappings/${id}`,
    );
    return data.data!;
  },

  create: async (
    payload: UpsertProfitReportSalesmanMappingRequest,
  ): Promise<ProfitReportSalesmanMappingResponse> => {
    const { data } = await apiClient.post<ApiResponse<ProfitReportSalesmanMappingResponse>>(
      "/profit-report-salesman-mappings",
      payload,
    );
    return data.data!;
  },

  update: async (
    id: string,
    payload: UpsertProfitReportSalesmanMappingRequest,
  ): Promise<ProfitReportSalesmanMappingResponse> => {
    const { data } = await apiClient.put<ApiResponse<ProfitReportSalesmanMappingResponse>>(
      `/profit-report-salesman-mappings/${id}`,
      payload,
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/profit-report-salesman-mappings/${id}`);
  },
};
