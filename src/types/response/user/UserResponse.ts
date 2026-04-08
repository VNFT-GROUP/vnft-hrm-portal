export interface UserResponse {
  id: number;
  username: string;
  passwordChangedAt?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
