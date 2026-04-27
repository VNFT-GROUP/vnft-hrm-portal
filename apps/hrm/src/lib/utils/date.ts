/**
 * Định dạng một chuỗi ngày tháng sang chuẩn Việt Nam: DD/MM/YYYY.
 *
 * @param dateString - Chuỗi ngày tháng hoặc timestamp hợp lệ.
 * @returns Chuỗi ngày tháng đã được định dạng, hoặc "—" nếu đầu vào không hợp lệ.
 */
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
  } catch {
    return "—";
  }
}

/**
 * Định dạng một chuỗi ngày tháng sang chuẩn ngày giờ Việt Nam: DD/MM/YYYY HH:mm.
 *
 * @param dateString - Chuỗi ngày tháng hoặc timestamp hợp lệ.
 * @returns Chuỗi ngày giờ đã được định dạng, hoặc "—" nếu đầu vào không hợp lệ.
 */
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
  } catch {
    return "—";
  }
}

/**
 * Tính toán tổng số ngày công chuẩn trong một chu kỳ tháng chấm công.
 * Chu kỳ bắt đầu từ ngày 25 của 2 tháng trước và kết thúc vào ngày 24 của tháng trước.
 * Hàm này tính tổng các ngày ngoại trừ Chủ Nhật (0) và Thứ Bảy (6).
 *
 * @param month - Tháng của chu kỳ.
 * @param year - Năm của chu kỳ.
 * @returns Tổng số ngày làm việc.
 */
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
