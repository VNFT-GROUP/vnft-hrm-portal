import type { AbsenceReasonType } from "./RequestFormEnums";

export interface CreateAbsenceRequest {
  description?: string | null;
  absenceDate: string;          // YYYY-MM-DD
  fromTime: string;             // HH:mm or HH:mm:ss
  toTime: string;               // HH:mm or HH:mm:ss
  reasonType: AbsenceReasonType;
}
