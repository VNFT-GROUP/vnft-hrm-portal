import type { UserSummaryResponse } from '../user/UserSummaryResponse';

export interface AuthResponse {
  user: UserSummaryResponse;
  accessToken: string;
}
