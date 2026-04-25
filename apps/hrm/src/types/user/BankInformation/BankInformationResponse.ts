import type { BankInformationRequest } from './BankInformationRequest';

export interface BankInformationResponse extends BankInformationRequest {
  id?: string;
}
