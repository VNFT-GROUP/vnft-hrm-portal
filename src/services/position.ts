import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { PositionResponse } from '@/types/response/position/PositionResponse';
import type { UpsertPositionRequest } from '@/types/request/position/UpsertPositionRequest';

export const positionService = {
  getPositions: async (search?: string): Promise<ApiResponse<PositionResponse[]>> => {
    const response = await apiClient.get('/positions', { params: { search } });
    return response.data;
  },
  getPositionById: async (id: string): Promise<ApiResponse<PositionResponse>> => {
    const response = await apiClient.get(`/positions/${id}`);
    return response.data;
  },
  createPosition: async (data: UpsertPositionRequest): Promise<ApiResponse<PositionResponse>> => {
    const response = await apiClient.post('/positions', data);
    return response.data;
  },
  updatePosition: async (id: string, data: UpsertPositionRequest): Promise<ApiResponse<PositionResponse>> => {
    const response = await apiClient.put(`/positions/${id}`, data);
    return response.data;
  },
  deletePosition: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/positions/${id}`);
    return response.data;
  }
};
