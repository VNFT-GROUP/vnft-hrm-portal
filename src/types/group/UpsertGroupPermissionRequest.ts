export interface UpsertGroupPermissionRequest {
  code: string;
  name: string;
  featureGroup?: string;
  description?: string;
  active?: boolean;
}
