import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { salesKpiReviewService } from "@/services/salesKpiReviewService";
import type {
  GetSalesKpiReviewsParams,
  UpsertSalesKpiReviewRequest,
} from "@/types/sales-kpi-review/SalesKpiReviewResponse";

export const salesKpiKeys = {
  all: ["sales-kpi-reviews"] as const,
  list: (params: GetSalesKpiReviewsParams) => [...salesKpiKeys.all, "list", params] as const,
  detail: (id: string) => [...salesKpiKeys.all, "detail", id] as const,
};

export function useSalesKpiReviews(params: GetSalesKpiReviewsParams, enabled = true) {
  return useQuery({
    queryKey: salesKpiKeys.list(params),
    queryFn: () => salesKpiReviewService.getAll(params),
    enabled,
  });
}

export function useSalesKpiCandidates(params: Omit<GetSalesKpiReviewsParams, "status" | "page" | "size">, enabled = true) {
  return useQuery({
    queryKey: [...salesKpiKeys.all, "candidates", params],
    queryFn: () => salesKpiReviewService.getCandidates(params),
    enabled,
  });
}

export function useSalesKpiReviewDetail(id: string | null) {
  return useQuery({
    queryKey: salesKpiKeys.detail(id!),
    queryFn: () => salesKpiReviewService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateSalesKpiReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertSalesKpiReviewRequest) => salesKpiReviewService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesKpiKeys.all });
      qc.invalidateQueries({ queryKey: ["performance-employees"] });
    },
  });
}

export function useUpdateSalesKpiReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpsertSalesKpiReviewRequest }) =>
      salesKpiReviewService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesKpiKeys.all });
      qc.invalidateQueries({ queryKey: ["performance-employees"] });
    },
  });
}

export function useDeleteSalesKpiReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesKpiReviewService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesKpiKeys.all });
      qc.invalidateQueries({ queryKey: ["performance-employees"] });
    },
  });
}
