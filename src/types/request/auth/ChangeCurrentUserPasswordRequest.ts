export interface ChangeCurrentUserPasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
