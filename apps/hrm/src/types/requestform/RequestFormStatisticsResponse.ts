import type { RequestFormStatisticPeriod, RequestFormType } from "./RequestFormEnums";

export interface RequestFormTypeStatisticsResponse {
  type: RequestFormType;
  total: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  canceledCount: number;
}

export interface RequestFormStatisticsResponse {
  period: RequestFormStatisticPeriod;
  startDate: string; // ISO Date "YYYY-MM-DD"
  endDate: string; // ISO Date "YYYY-MM-DD"
  total: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  canceledCount: number;
  typeStatistics: RequestFormTypeStatisticsResponse[];
}
