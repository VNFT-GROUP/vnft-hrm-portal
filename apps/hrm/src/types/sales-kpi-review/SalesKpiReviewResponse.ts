import type { UserFunctionType } from "@/types/user/UserFunctionType";

export interface SalesKpiReviewResponse {
  id: string | null;
  userId: string | null;
  userProfileId: string | null;
  username: string | null;
  employeeCode: string | null;
  fullName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  positionId: string | null;
  positionName: string | null;
  jobTitleId: string | null;
  jobTitleName: string | null;
  functionType: UserFunctionType | null;

  reviewYear: number | null;
  reviewMonth: number | null;
  sourceProfitYear: number | null;
  sourceProfitMonth: number | null;

  targetAmount: number;
  revenueAmount: number;
  profitAmount: number;
  profitMarginPercent: number;
  targetAchievementPercent: number;
  salesScore: number;

  newCustomerCount: number;
  reportScore: number;
  customerMeetingScore: number;
  kpiScore: number;

  ratingCode: string | null;
  ratingName: string | null;
  note: string | null;

  hasReview: boolean | null;
  active: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface GetSalesKpiReviewsParams {
  reviewYear: number;
  reviewMonth: number;
  departmentId?: string;
  functionType?: UserFunctionType;
  status?: string;
  page?: number;
  size?: number;
}

export interface UpsertSalesKpiReviewRequest {
  userId: string;
  reviewYear: number;
  reviewMonth: number;
  newCustomerCount?: number;
  reportScore?: number;
  customerMeetingScore?: number;
  note?: string;
}
