// Simplified UserSessionResponse for gateway
// Only contains fields needed for auth handoff

export interface UserSessionResponse {
  id: string;
  username: string;
  passwordChangedAt?: string;
  fullName?: string;
  englishName?: string;
  avatarUrl?: string;
  groupName?: string;
  departmentName?: string;
  positionName?: string;
  jobTitleName?: string;
  [key: string]: unknown; // Allow passthrough of additional fields
}

export interface AuthResponse {
  user: UserSessionResponse;
  accessToken: string;
}


export interface ApiResponse<T> {
  data: T;
  errorCode?: number;
  errorMessage?: string;
}
