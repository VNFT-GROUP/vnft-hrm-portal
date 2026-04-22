export interface GroupPermissionResponse {
  id: string;
  code: string;
  name: string;
  featureGroup?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
