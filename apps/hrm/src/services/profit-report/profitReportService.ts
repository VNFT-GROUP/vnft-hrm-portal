import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type {
  DeleteProfitReportParams,
  GetProfitReportsParams,
  ImportProfitReportPayload,
  ProfitReportDeleteResponse,
  ProfitReportImportResponse,
  ProfitReportResponse,
} from "@/types/profit-report/ProfitReportResponse";

export const profitReportService = {
  getProfitReports: async (params: GetProfitReportsParams): Promise<ProfitReportResponse[]> => {
    const { data } = await apiClient.get<ApiResponse<ProfitReportResponse[]>>("/profit-reports", { params });
    return data.data ?? [];
  },

  importProfitReport: async (payload: ImportProfitReportPayload): Promise<ProfitReportImportResponse> => {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("currency", payload.currency);

    const { data } = await apiClient.post<ApiResponse<ProfitReportImportResponse>>(
      "/profit-reports/import",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data!;
  },

  deleteProfitReport: async (params: DeleteProfitReportParams): Promise<ProfitReportDeleteResponse> => {
    const { data } = await apiClient.delete<ApiResponse<ProfitReportDeleteResponse>>("/profit-reports", { params });
    return data.data!;
  },
};
