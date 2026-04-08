export interface PositionResponse {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  manager?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
