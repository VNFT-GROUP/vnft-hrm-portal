import type { UserSessionResponse } from '../user/UserSessionResponse';

export interface AuthResponse {
  user: UserSessionResponse;
  accessToken: string;
}
