import type { UserFunctionType } from "@/types/user/UserFunctionType";

export interface PerformanceEmployeeResponse {
  userId: string;
  profileId?: string;
  employeeCode?: string;
  fullName?: string;
  functionType?: UserFunctionType | null;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  jobTitleId?: string;
  jobTitleName?: string;
  canReview: boolean;
  hasReview: boolean;
  reviewId?: string;
  overallScore?: number;
  overallScoreName?: string;
}
