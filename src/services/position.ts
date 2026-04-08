import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { PageResponse } from '@/types/base/PageResponse';
import type { PositionResponse } from '@/types/response/position/PositionResponse';
import type { UpsertPositionRequest } from '@/types/request/position/UpsertPositionRequest';

export const positionService = {
  getAll: async (page = 1, size = 100, search = ''): Promise<ApiResponse<PageResponse<PositionResponse>>> => {
    const response = await apiClient.get('/positions', { params: { page, size, search } });
    return response.data;
  },
  create: async (data: UpsertPositionRequest): Promise<ApiResponse<PositionResponse>> => {
    const response = await apiClient.post('/positions', data);
    return response.data;
  },
  update: async (id: string, data: UpsertPositionRequest): Promise<ApiResponse<PositionResponse>> => {
    const response = await apiClient.put(`/positions/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/positions/${id}`);
    return response.data;
  }
};
