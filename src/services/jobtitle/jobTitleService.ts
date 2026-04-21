import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from '@/types/base/ApiResponse';
import type { JobTitleResponse } from '@/types/jobtitle/JobTitleResponse';
import type { UpsertJobTitleRequest } from '@/types/jobtitle/UpsertJobTitleRequest';

const ENDPOINT = '/job-titles';

export const jobTitleService = {
  createJobTitle: async (data: UpsertJobTitleRequest): Promise<ApiResponse<JobTitleResponse>> => {
    const response = await apiClient.post<ApiResponse<JobTitleResponse>>(ENDPOINT, data);
    return response.data;
  },

  getRoleById: async (id: string): Promise<ApiResponse<JobTitleResponse>> => {
    const response = await apiClient.get<ApiResponse<JobTitleResponse>>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  getJobTitles: async (search?: string): Promise<ApiResponse<JobTitleResponse[]>> => {
    const response = await apiClient.get<ApiResponse<JobTitleResponse[]>>(ENDPOINT, {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  updateJobTitle: async (id: string, data: UpsertJobTitleRequest): Promise<ApiResponse<JobTitleResponse>> => {
    const response = await apiClient.put<ApiResponse<JobTitleResponse>>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  deleteJobTitle: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`${ENDPOINT}/${id}`);
    return response.data;
  }
};
