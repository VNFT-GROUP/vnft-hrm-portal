import { FileSpreadsheet, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ProfitReportResponse, ProfitReportMatchStatus } from "@/types/profit-report/ProfitReportResponse";

interface ProfitReportTableProps {
  data: ProfitReportResponse[];
  loading?: boolean;
  onCreateMapping?: (salesman: string) => void;
}

const MATCH_STATUS_CONFIG: Record<ProfitReportMatchStatus, { label: string; cls: string }> = {
  MATCHED: { label: "Đã khớp", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  UNMATCHED: { label: "Chưa khớp", cls: "bg-rose-100 text-rose-700 border-rose-200" },
  AMBIGUOUS: { label: "Mơ hồ", cls: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function ProfitReportTable({ data, loading, onCreateMapping }: ProfitReportTableProps) {
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
            <FileSpreadsheet size={32} className="text-muted-foreground" />
          </span>
          <p className="text-muted-foreground text-sm font-medium">
            Chưa có dữ liệu Profit Report cho kỳ đã chọn
          </p>
          <p className="text-xs text-muted-foreground/60">
            Import file Excel để bắt đầu
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
            <Th align="center" width="w-16">Row No</Th>
            <Th align="center" width="w-20">File No</Th>
            <Th align="left" width="min-w-[160px]">Salesman</Th>
            <Th align="right" width="min-w-[120px]">Revenue</Th>
            <Th align="right" width="min-w-[120px]">Costing</Th>
            <Th align="right" width="min-w-[120px]">Profit</Th>
            <Th align="center" width="w-22">Currency</Th>
            <Th align="center" width="w-24">Layout</Th>
            <Th align="center" width="w-28">Match</Th>
            <Th align="center" width="w-24">Mã NV</Th>
            <Th align="left" width="min-w-[150px]">Họ tên</Th>
            <Th align="left" width="w-28">Username</Th>
            <Th align="left" width="min-w-[130px]">Phòng ban</Th>
            <Th align="left" width="min-w-[140px]">Ghi chú</Th>
            {onCreateMapping && <Th align="center" width="w-28">Thao tác</Th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const matchCfg = MATCH_STATUS_CONFIG[row.matchStatus];
            return (
              <tr
                key={row.id}
                className={`border-b border-border/50 transition-colors hover:bg-muted/40 ${
                  idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                }`}
              >
                <td className="px-3 py-2.5 text-center text-muted-foreground font-mono text-xs">
                  {row.rowNo ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-center text-muted-foreground font-mono text-xs">
                  {row.fileNo ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-left font-medium text-foreground">
                  {row.salesman}
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-emerald-700">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-amber-700">
                  {formatCurrency(row.costing)}
                </td>
                <td className={`px-3 py-2.5 text-right font-mono tabular-nums font-semibold ${
                  row.profit >= 0 ? "text-blue-700" : "text-rose-600"
                }`}>
                  {formatCurrency(row.profit)}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <CurrencyBadge currency={row.currency} />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    row.sourceLayout === "EFREIGHT"
                      ? "bg-violet-50 text-violet-600 border border-violet-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {row.sourceLayout}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${matchCfg.cls}`}>
                    {matchCfg.label}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-xs text-muted-foreground">
                  {row.matchedEmployeeCode ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-left text-sm">
                  {row.matchedFullName ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-left text-xs text-muted-foreground font-mono">
                  {row.matchedUsername ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-left text-xs text-muted-foreground">
                  {row.matchedDepartmentName ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-left text-xs text-muted-foreground italic max-w-[200px] truncate" title={row.matchNote ?? undefined}>
                  {row.matchNote ?? "—"}
                </td>
                {onCreateMapping && (
                  <td className="px-3 py-2.5 text-center">
                    {row.matchStatus !== "MATCHED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCreateMapping(row.salesman)}
                        className="h-7 px-2.5 rounded-lg text-xs font-medium text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        title={`Tạo mapping cho "${row.salesman}"`}
                      >
                        <Link2 size={12} className="mr-1" />
                        Map
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer row count */}
      <div className="sticky bottom-0 bg-muted/90 backdrop-blur-sm border-t border-border px-4 py-2.5 text-xs text-muted-foreground font-medium">
        Tổng: {data.length.toLocaleString("vi-VN")} dòng
      </div>
    </div>
  );
}

/** Reusable table header cell */
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

function CurrencyBadge({ currency }: { currency: string }) {
  const cls =
    currency === "EFREIGHT"
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : currency === "USD"
      ? "bg-sky-100 text-sky-700 border-sky-200"
      : "bg-indigo-100 text-indigo-700 border-indigo-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${cls}`}>
      {currency}
    </span>
  );
}
