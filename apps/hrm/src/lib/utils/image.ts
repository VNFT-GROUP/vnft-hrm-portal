/**
 * Tiện ích hỗ trợ xoay file ảnh bất đồng bộ một góc nhất định sử dụng HTML Canvas.
 * Thường được dùng trước khi upload ảnh nếu ảnh chụp có chiều định dạng bị sai (ví dụ: bị xoay ngang).
 *
 * @param fileOrUrl - File object gốc hoặc một chuỗi URL trỏ đến ảnh.
 * @param angle - Góc xoay theo độ (mặc định là 90 độ).
 * @param defaultName - Tên file mặc định muốn dùng cho object File sau khi xoay.
 * @returns Một Promise trả về object File mới đã được xoay.
 */
export const rotateImageFile = async (
  fileOrUrl: File | string,
  angle: number = 90,
  defaultName: string = "rotated_image.jpeg",
): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      let imageSrc = "";
      let originalType = "image/jpeg";

      if (typeof fileOrUrl === "string") {
        imageSrc = fileOrUrl;
      } else {
        originalType = fileOrUrl.type || originalType;
        defaultName = fileOrUrl.name;
        imageSrc = URL.createObjectURL(fileOrUrl);
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("No 2d context"));

        if (angle % 180 === 90) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas is empty"));
            const newFile = new File([blob], defaultName, {
              type: originalType,
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          originalType,
          0.95,
        );
      };
      img.onerror = () =>
        reject(
          new Error("Lỗi tải ảnh để xoay, có thể do định dạng hoặc lỗi CORS"),
        );
      img.src = imageSrc;
    } catch (err) {
      reject(err);
    }
  });
};
