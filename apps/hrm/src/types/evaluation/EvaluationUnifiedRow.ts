import type { UserFunctionType } from "@/types/user/UserFunctionType";

/**
 * Unified row for the combined evaluation table.
 * Merges performance review + sales KPI data per employee.
 */
export interface EvaluationUnifiedRow {
  userId: string | null;
  profileId: string | null;
  employeeCode: string | null;
  fullName: string | null;
  functionType: UserFunctionType | null;
  departmentId: string | null;
  departmentName: string | null;
  positionId: string | null;
  positionName: string | null;
  jobTitleId: string | null;
  jobTitleName: string | null;

  /** Attendance score — from backend, not calculated by FE */
  attendanceScore: number | null;
  attendanceScoreLabel?: string | null;

  /** Performance review (BACK_OFFICE only) */
  performanceReviewId: string | null;
  performanceScore: number | null;
  performanceScoreLabel: string | null;
  performanceHasReview: boolean;

  /** Sales KPI review (SALES / MARKETING only) */
  salesKpiReviewId: string | null;
  salesKpiScore: number | null;
  salesKpiRatingName: string | null;
  salesKpiHasReview: boolean;

  canReview: boolean;
}
