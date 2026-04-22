export interface DepartmentResponse {
  id: string;
  name: string;
  description?: string | null;
  parentDepartmentId?: string | null;
  parentDepartmentName?: string | null;
  level: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
