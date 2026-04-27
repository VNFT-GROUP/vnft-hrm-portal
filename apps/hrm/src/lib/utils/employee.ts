/**
 * Trả về các class của TailwindCSS để tạo kiểu (styling) cho một huy hiệu (badge)
 * dựa trên trạng thái làm việc của nhân viên.
 *
 * @param status - Chuỗi đại diện cho trạng thái hiện tại của nhân viên (Ví dụ: "Đang làm", "Nghỉ sinh").
 * @returns Các class utility của TailwindCSS tương ứng.
 */
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
