import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type { PageResponse } from "@/types/base/PageResponse";
import type { AttendanceRecordResponse } from "@/types/attendance/AttendanceRecordResponse";

export const attendanceService = {
  getAttendanceRecords: async (
    startDate?: string,
    endDate?: string,
    nameQuery?: string,
    page: number = 1,
    size: number = 10,
  ): Promise<ApiResponse<PageResponse<AttendanceRecordResponse>>> => {
    const response = await apiClient.get("/attendance", {
      params: { startDate, endDate, nameQuery, page, size },
    });
    return response.data;
  },
};
