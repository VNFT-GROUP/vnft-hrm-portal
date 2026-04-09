import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { UserResponse } from "@/types/response/user/UserResponse";
import type { CreateUserRequest } from "@/types/request/CreateUserRequest";

export const userService = {
  createUser: async (
    data: CreateUserRequest,
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },
};
