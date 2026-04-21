export interface PerformanceEmployeeResponse {
  userId: string;
  profileId?: string;
  employeeCode?: string;
  fullName?: string;
  departmentName?: string;
  positionName?: string;
  jobTitleName?: string;
  canReview: boolean;
  hasReview: boolean;
  reviewId?: string;
  overallScore?: number;
  overallScoreName?: string;
}
