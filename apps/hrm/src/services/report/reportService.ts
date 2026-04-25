import { apiClient } from "@/lib/apiClient";
import type { AllowanceReportResponse } from "@/types/report/AllowanceReportItem";
import type { AttendanceDisciplineReportResponse } from "@/types/report/AttendanceDisciplineReportItem";

export const reportService = {
  getAllowanceReport: async (params: {
    periodType: "MONTH" | "QUARTER";
    year: number;
    month?: number;
    quarter?: number;
  }): Promise<AllowanceReportResponse> => {
    const response = await apiClient.get<AllowanceReportResponse>("/reports/employee-allowances", {
      params,
    });
    return response.data;
  },

  downloadAllowanceReport: async (params: {
    periodType: "MONTH" | "QUARTER";
    year: number;
    month?: number;
    quarter?: number;
  }): Promise<void> => {
    const response = await apiClient.get("/reports/employee-allowances/export", {
      params,
      responseType: "blob",
    });
    
    // Create a blob and trigger download
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Formulate a file name
    const timeFragment = params.periodType === 'MONTH' ? `Thang_${params.month}` : `Quy_${params.quarter}`;
    link.setAttribute("download", `Bang_Tinh_Phu_Cap_Nhan_Vien_${timeFragment}_${params.year}.xlsx`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  },

  getAttendanceDisciplineReport: async (params: {
    periodType: "MONTH" | "QUARTER";
    year: number;
    month?: number;
    quarter?: number;
  }): Promise<AttendanceDisciplineReportResponse> => {
    const response = await apiClient.get<AttendanceDisciplineReportResponse>("/reports/attendance-discipline", {
      params,
    });
    return response.data;
  },

  downloadAttendanceDisciplineReport: async (params: {
    periodType: "MONTH" | "QUARTER";
    year: number;
    month?: number;
    quarter?: number;
  }): Promise<void> => {
    const response = await apiClient.get("/reports/attendance-discipline/export", {
      params,
      responseType: "blob",
    });
    
    // Create a blob and trigger download
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Formulate a file name
    const timeFragment = params.periodType === 'MONTH' ? `Thang_${params.month}` : `Quy_${params.quarter}`;
    link.setAttribute("download", `Bao_Cao_Chuyen_Can_${timeFragment}_${params.year}.xlsx`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
};
