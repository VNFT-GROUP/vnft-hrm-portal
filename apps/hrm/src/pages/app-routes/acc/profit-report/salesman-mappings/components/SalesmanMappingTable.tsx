import { Link2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { ProfitReportSalesmanMappingResponse } from "@/types/profit-report/SalesmanMappingResponse";

interface SalesmanMappingTableProps {
  data: ProfitReportSalesmanMappingResponse[];
  loading?: boolean;
  onEdit?: (item: ProfitReportSalesmanMappingResponse) => void;
  onDelete?: (item: ProfitReportSalesmanMappingResponse) => void;
}

export default function SalesmanMappingTable({
  data,
  loading,
  onEdit,
  onDelete,
}: SalesmanMappingTableProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2E3192] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Đang tải dữ liệu…</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="p-4 bg-muted rounded-2xl">
            <Link2 size={32} className="text-muted-foreground" />
          </span>
          <p className="text-muted-foreground text-sm font-medium">
            Chưa có Salesman Mapping nào
          </p>
          <p className="text-xs text-muted-foreground/60">
            Tạo mapping để liên kết tên salesman trong Profit Report với nhân viên
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto flex-1">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-muted/90 backdrop-blur-sm border-b border-border">
            <Th align="left" width="min-w-[180px]">Salesman Alias</Th>
            <Th align="center" width="w-28">Mã NV</Th>
            <Th align="left" width="min-w-[160px]">Họ tên</Th>
            <Th align="left" width="w-32">Username</Th>
            <Th align="left" width="min-w-[130px]">Phòng ban</Th>
            <Th align="left" width="min-w-[140px]">Ghi chú</Th>
            <Th align="center" width="w-28">Trạng thái</Th>
            <Th align="center" width="w-36">Cập nhật</Th>
            <Th align="center" width="w-28">Thao tác</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id}
              className={`border-b border-border/50 transition-colors hover:bg-muted/40 ${
                idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
              }`}
            >
              <td className="px-3 py-2.5 text-left font-semibold text-foreground">
                {row.salesmanName}
              </td>
              <td className="px-3 py-2.5 text-center font-mono text-xs text-muted-foreground">
                {row.employeeCode ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-left text-sm">
                {row.fullName ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-left text-xs text-muted-foreground font-mono">
                {row.username ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-left text-xs text-muted-foreground">
                {row.departmentName ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-left text-xs text-muted-foreground italic max-w-[200px] truncate" title={row.note ?? undefined}>
                {row.note ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                  row.active !== false
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>
                  {row.active !== false ? "Đang dùng" : "Ngưng dùng"}
                </span>
              </td>
              <td className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                {formatDateTime(row.updatedAt)}
              </td>
              <td className="px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-indigo-600"
                      title="Sửa"
                    >
                      <Pencil size={14} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row)}
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-rose-600"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sticky bottom-0 bg-muted/90 backdrop-blur-sm border-t border-border px-4 py-2.5 text-xs text-muted-foreground font-medium">
        Tổng: {data.length} mapping
      </div>
    </div>
  );
}

function Th({
  children,
  align,
  width,
}: {
  children: React.ReactNode;
  align: "left" | "center" | "right";
  width?: string;
}) {
  return (
    <th className={`px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground text-${align} ${width ?? ""} whitespace-nowrap`}>
      {children}
    </th>
  );
}
