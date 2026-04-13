export interface UpsertGroupRequest {
  name: string;
  description?: string;
  groupPermissionIds: string[];
  active?: boolean;
}
