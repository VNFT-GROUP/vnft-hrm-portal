import type { PerformanceEmployeeResponse } from "@/types/performance/PerformanceEmployeeResponse";
import type { SalesKpiReviewResponse } from "@/types/sales-kpi-review/SalesKpiReviewResponse";
import type { EvaluationUnifiedRow } from "@/types/evaluation/EvaluationUnifiedRow";
import type { UserFunctionType } from "@/types/user/UserFunctionType";

interface MergeParams {
  performanceEmployees: PerformanceEmployeeResponse[];
  salesKpiRows: SalesKpiReviewResponse[];
  functionTypeFilter?: UserFunctionType | "";
}

/**
 * Merge performance employees (base list) with sales KPI review data
 * into a unified row set for the evaluation table.
 */
export function mergeEvaluationRows({
  performanceEmployees,
  salesKpiRows,
  functionTypeFilter,
}: MergeParams): EvaluationUnifiedRow[] {
  // Index KPI rows by userId for O(1) lookup
  const kpiByUserId = new Map<string, SalesKpiReviewResponse>();
  for (const kpi of salesKpiRows) {
    if (kpi.userId) kpiByUserId.set(kpi.userId, kpi);
  }

  // Track which userIds we've already processed
  const processedUserIds = new Set<string>();

  const rows: EvaluationUnifiedRow[] = [];

  // 1. Build from performance employees (base list)
  for (const emp of performanceEmployees) {
    processedUserIds.add(emp.userId);
    const kpi = kpiByUserId.get(emp.userId);
    const ft = emp.functionType ?? null;

    rows.push({
      userId: emp.userId,
      profileId: emp.profileId ?? null,
      employeeCode: emp.employeeCode ?? null,
      fullName: emp.fullName ?? null,
      functionType: ft,
      departmentId: emp.departmentId ?? null,
      departmentName: emp.departmentName ?? null,
      positionId: emp.positionId ?? null,
      positionName: emp.positionName ?? null,
      jobTitleId: emp.jobTitleId ?? null,
      jobTitleName: emp.jobTitleName ?? null,

      attendanceScore: null,
      attendanceScoreLabel: null,

      performanceReviewId: emp.reviewId ?? null,
      performanceScore: emp.overallScore ?? null,
      performanceScoreLabel: emp.overallScoreName ?? null,
      performanceHasReview: emp.hasReview,

      salesKpiReviewId: kpi?.id ?? null,
      salesKpiScore: kpi?.kpiScore ?? null,
      salesKpiRatingName: kpi?.ratingName ?? null,
      salesKpiHasReview: kpi?.hasReview ?? false,

      canReview: emp.canReview,
    });
  }

  // 2. Add KPI-only employees not in performance list
  for (const kpi of salesKpiRows) {
    if (!kpi.userId || processedUserIds.has(kpi.userId)) continue;
    rows.push({
      userId: kpi.userId,
      profileId: kpi.userProfileId ?? null,
      employeeCode: kpi.employeeCode ?? null,
      fullName: kpi.fullName ?? null,
      functionType: kpi.functionType ?? null,
      departmentId: kpi.departmentId ?? null,
      departmentName: kpi.departmentName ?? null,
      positionId: kpi.positionId ?? null,
      positionName: kpi.positionName ?? null,
      jobTitleId: kpi.jobTitleId ?? null,
      jobTitleName: kpi.jobTitleName ?? null,

      attendanceScore: null,
      attendanceScoreLabel: null,

      performanceReviewId: null,
      performanceScore: null,
      performanceScoreLabel: null,
      performanceHasReview: false,

      salesKpiReviewId: kpi.id,
      salesKpiScore: kpi.kpiScore ?? null,
      salesKpiRatingName: kpi.ratingName ?? null,
      salesKpiHasReview: kpi.hasReview ?? false,

      canReview: true,
    });
  }

  // 3. Apply functionType filter
  let filtered = rows;
  if (functionTypeFilter) {
    filtered = rows.filter((r) => r.functionType === functionTypeFilter);
  }

  // 4. Sort by fullName asc, then userId asc
  filtered.sort((a, b) => {
    const nameA = (a.fullName ?? "").toLowerCase();
    const nameB = (b.fullName ?? "").toLowerCase();
    if (nameA !== nameB) return nameA < nameB ? -1 : 1;
    return (a.userId ?? "") < (b.userId ?? "") ? -1 : 1;
  });

  return filtered;
}
