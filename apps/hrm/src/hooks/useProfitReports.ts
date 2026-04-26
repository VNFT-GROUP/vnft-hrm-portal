import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profitReportService } from "@/services/profit-report/profitReportService";
import type {
  DeleteProfitReportParams,
  GetProfitReportsParams,
  ImportProfitReportPayload,
} from "@/types/profit-report/ProfitReportResponse";

export const profitReportKeys = {
  all: ["profit-reports"] as const,
  list: (params: GetProfitReportsParams) =>
    [
      ...profitReportKeys.all,
      params.year,
      params.month,
      params.currency,
      params.salesman || "",
      params.matchStatus || "",
    ] as const,
};

export function useProfitReports(params: GetProfitReportsParams) {
  return useQuery({
    queryKey: profitReportKeys.list(params),
    queryFn: () => profitReportService.getProfitReports(params),
    enabled: !!params.year && !!params.month && !!params.currency,
  });
}

export function useImportProfitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportProfitReportPayload) =>
      profitReportService.importProfitReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profitReportKeys.all });
    },
  });
}

export function useDeleteProfitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteProfitReportParams) =>
      profitReportService.deleteProfitReport(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profitReportKeys.all });
    },
  });
}
