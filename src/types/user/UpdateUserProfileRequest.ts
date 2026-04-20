import type { BankInformationRequest } from './BankInformation/BankInformationRequest';
import type { DependentRequest } from './Dependent/DependentRequest';
import type { EducationRecordRequest } from './EducationRecord/EducationRecordRequest';
import type { WorkExperienceRequest } from './WorkExperience/WorkExperienceRequest';
import type { Gender } from './UserSessionResponse';

export type MaritalStatus = 'SINGLE' | 'MARRIED';

export interface UpdateUserProfileRequest {
  fullName?: string;
  englishName?: string;
  attendanceCode?: string;
  phoneNumber?: string;
  avatarTempKey?: string;
  gender?: Gender;
  dateOfBirth?: string;
  maritalStatus?: MaritalStatus;
  placeOfBirth?: string;
  placeOfOrigin?: string;
  nationality?: string;
  religion?: string;
  ethnicity?: string;
  permanentAddress?: string;
  permanentCity?: string;
  currentAddress?: string;
  currentCity?: string;
  citizenIdNumber?: string;
  citizenIdIssueDate?: string;
  citizenIdIssuePlace?: string;
  citizenIdFrontImageTempKey?: string;
  citizenIdBackImageTempKey?: string;
  bankInformations?: BankInformationRequest[];
  dependents?: DependentRequest[];
  educationRecords?: EducationRecordRequest[];
  workExperiences?: WorkExperienceRequest[];
}
