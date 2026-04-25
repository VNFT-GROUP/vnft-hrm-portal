export interface PageResponse<T = unknown> {
  content?: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
}
