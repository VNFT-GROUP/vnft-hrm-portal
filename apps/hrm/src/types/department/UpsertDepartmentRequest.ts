export interface UpsertDepartmentRequest {
  name: string;
  description?: string | null;
  parentDepartmentId?: string | null;
  active?: boolean;
}
