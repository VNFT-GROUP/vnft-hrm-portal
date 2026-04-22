import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapIdToName(
  id: string | null | undefined,
  list: Array<{ id: string; name: string }> | undefined,
  fallback = "-",
): string {
  if (!id) return fallback;
  if (!list || list.length === 0) return id;
  const item = list.find((i) => i.id === id);
  return item ? item.name : id;
}

export function getEmployeeStatusColor(status: string) {
  switch (status) {
    case "Đang làm":
      return "bg-[#10b981] hover:bg-[#10b981]/90 shadow-[#10b981]/20 text-white";
    case "Nghỉ sinh":
      return "bg-pink-500 hover:bg-pink-500/90 shadow-pink-500/20 text-white";
    case "Tạm hoãn":
      return "bg-amber-500 hover:bg-amber-500/90 shadow-amber-500/20 text-white";
    case "Đã nghỉ việc":
      return "bg-slate-300 hover:bg-slate-400 text-foreground shadow-none border-0";
    default:
      return "bg-muted text-muted-foreground border-0";
  }
}

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

export function getErrorMessage(
  error: unknown,
  defaultMessage?: string,
): string {
  const err = error as Error & { response?: { data?: { message?: string } } };
  return (
    err?.response?.data?.message ||
    err?.message ||
    defaultMessage ||
    "Lỗi không xác định"
  );
}

export const getWorkingDaysInMonth = (month: number, year: number): number => {
  const start = new Date(year, month - 2, 25);
  const end = new Date(year, month - 1, 24);
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

// -- Common Formatting Utilities --

/** Formats a number to Vietnamese standard without currency symbol (e.g. 10.000) */
export function formatCurrency(
  amount: number | string | null | undefined,
): string {
  if (amount === null || amount === undefined) return "0";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}

/** Formats a number to Vietnamese standard with currency symbol (e.g. 10.000 ₫) */
export function formatVND(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "0 ₫";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (isNaN(num)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

/** Formats a date string to DD/MM/YYYY */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (_) {
    return "—";
  }
}

/** Formats a date string to DD/MM/YYYY HH:mm */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return "—";
  }
}
