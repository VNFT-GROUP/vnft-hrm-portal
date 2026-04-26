export interface ProfitReportSalesmanMappingResponse {
  id: string;
  salesmanName: string;
  userId: string | null;
  userProfileId: string | null;
  employeeCode: string | null;
  username: string | null;
  fullName: string | null;
  departmentName: string | null;
  note: string | null;
  active: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface UpsertProfitReportSalesmanMappingRequest {
  salesmanName: string;
  userProfileId: string;
  note?: string | null;
  active?: boolean | null;
}

export interface GetProfitReportSalesmanMappingsParams {
  search?: string;
  userProfileId?: string;
}
