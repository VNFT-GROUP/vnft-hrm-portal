/**
 * Định dạng một số theo chuẩn Việt Nam mà không có ký hiệu tiền tệ (Ví dụ: 10.000).
 *
 * @param amount - Số hoặc chuỗi cần định dạng.
 * @returns Chuỗi định dạng theo ngôn ngữ. Trả về "0" nếu đầu vào không hợp lệ.
 */
export function formatCurrency(
  amount: number | string | null | undefined,
): string {
  if (amount === null || amount === undefined) return "0";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}

/**
 * Định dạng một số theo chuẩn tiền tệ Việt Nam kèm ký hiệu (Ví dụ: 10.000 ₫).
 *
 * @param amount - Số hoặc chuỗi cần định dạng.
 * @returns Chuỗi định dạng tiền tệ. Trả về "0 ₫" nếu đầu vào không hợp lệ.
 */
export function formatVND(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "0 ₫";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (isNaN(num)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

/**
 * Định dạng một số với số lượng chữ số thập phân cụ thể (mặc định từ 0 đến 2).
 * Phù hợp cho việc hiển thị điểm số, hệ số, hoặc tỷ lệ.
 *
 * @param val - Giá trị số hoặc chuỗi cần định dạng.
 * @param minDecimals - Số lượng chữ số thập phân tối thiểu (mặc định là 0).
 * @param maxDecimals - Số lượng chữ số thập phân tối đa (mặc định là 2).
 * @param fallback - Chuỗi trả về nếu đầu vào là null hoặc không hợp lệ (mặc định là "—").
 * @returns Chuỗi số đã được định dạng theo chuẩn.
 */
export function formatNumber(
  val: number | string | null | undefined,
  minDecimals = 0,
  maxDecimals = 2,
  fallback = "—"
): string {
  if (val === null || val === undefined) return fallback;
  const num = typeof val === "string" ? Number(val) : val;
  if (isNaN(num)) return fallback;
  return num.toLocaleString("vi-VN", {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Định dạng số ngày công bằng cách loại bỏ các số 0 thừa ở phần thập phân.
 * Ví dụ: 20.50 -> 20.5, 20.00 -> 20.
 *
 * @param v - Giá trị ngày công.
 * @returns Một chuỗi định dạng ngày công rút gọn.
 */
export function formatWorkday(v?: number | string | null): string {
  const r = typeof v === "string" ? Number(v) : (v ?? 0);
  if (isNaN(r)) return "0";
  return Number.isInteger(r) ? r.toString() : r.toFixed(2).replace(/\.?0+$/, "");
}
