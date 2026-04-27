import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Kết hợp nhiều class CSS hoặc các object class có điều kiện thành một chuỗi duy nhất.
 * Hàm này sử dụng `clsx` để kết hợp các class có điều kiện và `tailwind-merge` để giải quyết các xung đột của Tailwind.
 *
 * @param inputs - Mảng các ClassValue (có thể là chuỗi, object hoặc mảng các class).
 * @returns Một chuỗi class duy nhất đã được gộp.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Trích xuất tên (name) từ một danh sách các phần tử dựa trên ID.
 *
 * @param id - ID cần tìm.
 * @param list - Mảng các object chứa trường `id` và `name`.
 * @param fallback - Chuỗi dự phòng trả về nếu không tìm thấy ID (Mặc định là "-").
 * @returns Tên tương ứng với ID hoặc chuỗi dự phòng.
 */
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

/**
 * Trích xuất an toàn một thông báo lỗi dễ đọc từ một object lỗi không xác định (unknown error).
 * Rất hữu ích khi bắt lỗi API và hiển thị lên Toasts.
 *
 * @param error - Object lỗi bị bắt (có thể là bất cứ thứ gì).
 * @param defaultMessage - Thông báo dự phòng tùy chọn nếu lỗi không chứa thông báo cụ thể.
 * @returns Một chuỗi thông báo lỗi thân thiện với người dùng.
 */
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
