export interface S3PresignedUrlResponse {
  objectKey: string;
  url: string;
  expiresAt: string;
}
