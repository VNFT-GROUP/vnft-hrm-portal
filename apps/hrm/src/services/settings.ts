import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { ServerSettingsResponse } from "@/types/server-settings/ServerSettingsResponse";

export const settingsService = {
  getServerSettings: async (): Promise<ApiResponse<ServerSettingsResponse>> => {
    const response = await apiClient.get("/settings/server");
    return response.data;
  },
  updateServerSettings: async (settings: Partial<ServerSettingsResponse>): Promise<ApiResponse<ServerSettingsResponse>> => {
    const response = await apiClient.patch("/settings/server", settings);
    return response.data;
  },
};
