export type ProfitReportCurrency = 'VND' | 'USD' | 'EFREIGHT';

export type ProfitReportSourceLayout = 'FAST' | 'EFREIGHT';

export type ProfitReportMatchStatus = 'MATCHED' | 'UNMATCHED' | 'AMBIGUOUS';

export interface ProfitReportResponse {
  id: string;
  rowNo: number | null;
  fileNo: string | null;
  salesman: string;
  month: number;
  year: number;
  revenue: number;
  costing: number;
  profit: number;
  currency: ProfitReportCurrency;
  sourceLayout: ProfitReportSourceLayout;

  // Match enrichment fields
  matchStatus: ProfitReportMatchStatus;
  matchedUserId: string | null;
  matchedUserProfileId: string | null;
  matchedEmployeeCode: string | null;
  matchedUsername: string | null;
  matchedFullName: string | null;
  matchedDepartmentName: string | null;
  matchNote: string | null;
}

export interface ProfitReportImportResponse {
  month: number;
  year: number;
  currency: ProfitReportCurrency;
  sourceLayout: ProfitReportSourceLayout;
  totalRows: number;
  importedRows: number;
  deletedRows: number;
  matchedRows: number;
  unmatchedRows: number;
  ambiguousRows: number;
  failedRows: number;
  errors: string[];
}

export interface ProfitReportDeleteResponse {
  year: number;
  month: number;
  currency: ProfitReportCurrency;
  deletedRows: number;
}

export interface GetProfitReportsParams {
  year: number;
  month: number;
  currency: ProfitReportCurrency;
  salesman?: string;
  matchStatus?: ProfitReportMatchStatus;
}

export interface ImportProfitReportPayload {
  file: File;
  currency: ProfitReportCurrency;
}

export interface DeleteProfitReportParams {
  year: number;
  month: number;
  currency: ProfitReportCurrency;
}
