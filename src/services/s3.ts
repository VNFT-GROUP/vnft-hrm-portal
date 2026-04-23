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
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Upload to S3 failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.error("S3 Upload 'Failed to fetch'. Potential causes:\n1. CORS not configured on S3/MinIO bucket.\n2. Presigned URL uses internal domain inaccessible from client.\n3. Network disconnection or AdBlocker.\nURL:", presignedUrl);
        throw new Error("Lỗi kết nối khi upload file (Failed to fetch). Vui lòng kiểm tra Network tab hoặc CORS config.");
      }
      throw error;
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
