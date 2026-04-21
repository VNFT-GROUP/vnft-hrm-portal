export interface PerformanceReviewLevelResponse {
  id: string;
  score: number;
  name: string;
  allowance: number;
  criteria: string[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
