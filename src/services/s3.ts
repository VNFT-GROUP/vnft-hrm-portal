import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/base/ApiResponse";
import type {
  S3PresignUploadRequest,
  S3PresignedUrlResponse,
} from "@/types/s3";

export const s3Service = {
  createPresignedUploadUrl: async (
    request: S3PresignUploadRequest,
  ): Promise<ApiResponse<S3PresignedUrlResponse>> => {
    const response = await apiClient.post("/s3/presign-upload", request);
    return response.data;
  },

  /**
   * Helper method to upload a file directly to S3 using the presigned URL.
   * This bypasses the backend and goes straight to S3.
   */
  uploadFileDirectlyToS3: async (
    presignedUrl: string,
    file: File,
  ): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Upload to S3 failed: ${response.statusText}`);
    }
  },

  /**
   * Tự động xin presigned URL và upload file thẳng lên S3.
   * Trả về chi tiết S3PresignedUrlResponse (có chứa objectKey).
   */
  uploadFile: async (
    file: File,
    key: string,
  ): Promise<S3PresignedUrlResponse> => {
    const presignRes = await s3Service.createPresignedUploadUrl({
      key,
      contentType: file.type || "application/octet-stream",
    });

    if (!presignRes.data) {
      throw new Error(
        presignRes.errorMessage ||
          "Failed to create presigned URL: No data returned",
      );
    }

    const { url } = presignRes.data;
    await s3Service.uploadFileDirectlyToS3(url, file);

    return presignRes.data;
  },
};
