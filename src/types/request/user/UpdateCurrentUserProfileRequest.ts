import type { BankInformationRequest } from './BankInformationRequest';
import type { DependentRequest } from './DependentRequest';
import type { EducationRecordRequest } from './EducationRecordRequest';
import type { WorkExperienceRequest } from './WorkExperienceRequest';
import type { Gender } from '../../response/user/UserSessionResponse';

export type MaritalStatus = 'SINGLE' | 'MARRIED';

export interface UpdateCurrentUserProfileRequest {
  phoneNumber: string;
  gender?: Gender;
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  placeOfBirth?: string;
  placeOfOrigin?: string;
  nationality?: string;
  religion?: string;
  ethnicity?: string;
  permanentAddress?: string;
  permanentCity?: string;
  currentAddress: string;
  currentCity: string;
  citizenIdNumber: string;
  citizenIdIssueDate: string;
  citizenIdIssuePlace: string;
  citizenIdFrontImageUrl?: string;
  citizenIdBackImageUrl?: string;
  bankInformations?: BankInformationRequest[];
  dependents?: DependentRequest[];
  educationRecords?: EducationRecordRequest[];
  workExperiences?: WorkExperienceRequest[];
}
