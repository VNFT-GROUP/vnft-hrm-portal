export interface DependentRequest {
  dependentRelationship: string;
  dependentFullName: string;
  dependentDateOfBirth?: string;
  dependentPhoneNumber?: string;
  dependentIdentityNumber?: string;
  identityIssueDate?: string;
  identityIssuePlace?: string;
  dependencyStartDate?: string;
  dependencyEndDate?: string;
  dependentTaxCode?: string;
  note?: string;
}
