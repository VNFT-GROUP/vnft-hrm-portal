import type { DependentRequest } from './DependentRequest';

export interface DependentResponse extends DependentRequest {
  id?: string;
}
