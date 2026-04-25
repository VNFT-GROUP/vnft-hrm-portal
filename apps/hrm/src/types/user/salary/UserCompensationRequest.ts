import type { UserCompensationItemRequest } from './UserCompensationItemRequest';

export interface UserCompensationRequest {
  effectiveFrom: string;
  note?: string;
  compensationItems: UserCompensationItemRequest[];
}
