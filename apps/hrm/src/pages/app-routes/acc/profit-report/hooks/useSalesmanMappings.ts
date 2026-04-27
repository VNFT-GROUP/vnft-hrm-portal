import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { salesmanMappingService } from "@/services/profit-report/salesmanMappingService";
import { profitReportKeys } from "@/pages/app-routes/acc/profit-report/hooks/useProfitReports";
import type {
  GetProfitReportSalesmanMappingsParams,
  UpsertProfitReportSalesmanMappingRequest,
} from "@/types/profit-report/SalesmanMappingResponse";

export const salesmanMappingKeys = {
  all: ["profit-report-salesman-mappings"] as const,
  list: (params: GetProfitReportSalesmanMappingsParams) =>
    [...salesmanMappingKeys.all, params.search || "", params.userProfileId || ""] as const,
};

export function useSalesmanMappings(params: GetProfitReportSalesmanMappingsParams) {
  return useQuery({
    queryKey: salesmanMappingKeys.list(params),
    queryFn: () => salesmanMappingService.getAll(params),
  });
}

export function useCreateSalesmanMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertProfitReportSalesmanMappingRequest) =>
      salesmanMappingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesmanMappingKeys.all });
      queryClient.invalidateQueries({ queryKey: profitReportKeys.all });
    },
  });
}

export function useUpdateSalesmanMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpsertProfitReportSalesmanMappingRequest }) =>
      salesmanMappingService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesmanMappingKeys.all });
      queryClient.invalidateQueries({ queryKey: profitReportKeys.all });
    },
  });
}

export function useDeleteSalesmanMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salesmanMappingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesmanMappingKeys.all });
      queryClient.invalidateQueries({ queryKey: profitReportKeys.all });
    },
  });
}
