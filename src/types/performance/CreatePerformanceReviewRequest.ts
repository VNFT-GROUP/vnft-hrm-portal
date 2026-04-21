export interface CreatePerformanceReviewRequest {
  revieweeUserId: string;
  reviewYear: number;
  reviewMonth: number;
  overallScore: number;
  reviewedAt: string;
  summary?: string;
  strengths?: string;
  improvementAreas?: string;
  developmentPlan?: string;
  performanceDescriptions?: Record<string, number[]>;
  performanceImprovementNote?: string;
}
