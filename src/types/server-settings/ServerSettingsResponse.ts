import type { AttendanceSettingsResponse } from "../attendance/AttendanceSettingsResponse";

export interface ServerSettingsResponse {
  timeZone: string;
  attendance: AttendanceSettingsResponse;
}
