import type { BusinessTripReasonType } from "./RequestFormEnums";

export interface CreateBusinessTripRequest {
  description?: string | null;
  startDate: string;            // YYYY-MM-DD
  endDate: string;              // YYYY-MM-DD
  tripMode: string;             // required, hình thức công tác
  location?: string | null;     // optional, địa điểm
  address?: string | null;      // optional, địa chỉ
  reasonType: BusinessTripReasonType;
}
