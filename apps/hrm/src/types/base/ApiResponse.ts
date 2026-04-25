export interface ApiResponse<T = unknown> {
  errorMessage?: string;
  errorCode?: number;
  data?: T;
}
