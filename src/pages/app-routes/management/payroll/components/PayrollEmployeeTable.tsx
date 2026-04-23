import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import type { PayrollEmployeeResponse } from "@/types/payroll/PayrollResponse";

interface PayrollEmployeeTableProps {
  employees: PayrollEmployeeResponse[];
  isLoading: boolean;
}

const fmt = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

const fmtWd = (v?: number | null) => {
  const r = v ?? 0;
  return Number.isInteger(r) ? r.toString() : r.toFixed(2).replace(/\.?0+$/, "");
};

type ColMeta = { group: "info" | "system" | "manual" | "calculated" };

function currCol(key: keyof PayrollEmployeeResponse, header: string, group: ColMeta["group"], highlight?: string): ColumnDef<PayrollEmployeeResponse> {
  return {
    accessorKey: key,
    header,
    meta: { group } as ColMeta,
    cell: (info) => {
      const val = fmt(info.getValue() as number);
      if (highlight) return <span className={highlight}>{val}</span>;
      return val;
    },
  };
}

export default function PayrollEmployeeTable({ employees, isLoading }: PayrollEmployeeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<PayrollEmployeeResponse>[] = useMemo(
    () => [
      // ===== INFO =====
      {
        accessorKey: "personnelCode",
        header: "Mã NV",
        meta: { group: "info" } as ColMeta,
        cell: (info) => <span className="font-medium text-[#1E2062]">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "personnelName",
        header: "Họ và Tên",
        meta: { group: "info" } as ColMeta,
        cell: (info) => {
          const name = info.getValue() as string;
          return (
            <div className="flex items-center gap-2.5">
              <AvatarPlaceholder name={name} className="w-7 h-7 text-[10px]" />
              <span className="font-medium text-slate-700">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "departmentName",
        header: "Phòng ban",
        meta: { group: "info" } as ColMeta,
      },

      // ===== MANUAL EDITABLE (displayed, editable via import sheet) =====
      currCol("targetSalary", "Lương Target", "manual"),
      currCol("commission", "Hoa hồng", "manual"),
      currCol("seniorityAllowance", "PC Thâm niên", "manual"),
      currCol("outstandingAllowance", "PC Vượt trội", "manual"),
      currCol("hotBonus", "Thưởng nóng", "manual"),
      currCol("monthlyBonus", "Thưởng tháng", "manual"),
      currCol("businessTripFee", "Công tác phí", "manual"),
      currCol("mealAllowance", "Tiền ăn", "manual"),
      currCol("clientEntertainment", "Tiếp khách", "manual"),
      currCol("personalIncomeTax", "Thuế TNCN", "manual", "text-rose-500"),
      currCol("bankTransfer", "Chuyển khoản", "manual"),

      // ===== SYSTEM / READONLY =====
      currCol("basicSalary", "Lương CB", "system"),
      currCol("targetThreshold", "Target", "system"),
      currCol("parkingAllowance", "Gửi xe", "system"),
      currCol("fuelAllowance", "Xăng xe", "system"),
      currCol("phoneAllowance", "Điện thoại", "system"),
      currCol("insuranceBalance", "Balance BH", "system"),
      currCol("usaOfficeAllowance", "VP USA", "system"),
      currCol("managementAllowance", "PC Quản lý", "system"),
      currCol("jobAllowance", "PC Công việc", "system"),
      currCol("socialInsuranceSalary", "Lương BHXH", "system"),
      {
        accessorKey: "standardWorkdays",
        header: "Công chuẩn",
        meta: { group: "system" } as ColMeta,
        cell: (info) => fmtWd(info.getValue() as number),
      },
      {
        accessorKey: "actualWorkdays",
        header: "Công thực",
        meta: { group: "system" } as ColMeta,
        cell: (info) => fmtWd(info.getValue() as number),
      },
      {
        accessorKey: "dependentCount",
        header: "SL NPT",
        meta: { group: "system" } as ColMeta,
      },
      currCol("dependentTaxDeductionAmount", "MG 1 NPT", "system"),
      currCol("performanceAttitudeAllowance", "PC Hiệu suất", "system"),
      currCol("punctualityDisciplineAllowance", "PC Kỷ luật", "system"),

      // ===== AUTO CALCULATED =====
      currCol("companySocialInsurance", "BHXH Cty", "calculated"),
      currCol("companyHealthInsurance", "BHYT Cty", "calculated"),
      currCol("companyUnemploymentInsurance", "BHTN Cty", "calculated"),
      currCol("employeeSocialInsurance", "BHXH NV", "calculated"),
      currCol("employeeHealthInsurance", "BHYT NV", "calculated"),
      currCol("employeeUnemploymentInsurance", "BHTN NV", "calculated"),
      currCol("workdaySalary", "Lương theo công", "calculated", "font-semibold text-emerald-600"),
      currCol("taxableIncome", "TN Chịu thuế", "calculated"),
      currCol("personalDeduction", "GTGC Bản thân", "calculated"),
      currCol("dependentDeduction", "GT NPT", "calculated"),
      currCol("assessableIncome", "TN Tính thuế", "calculated"),
      currCol("netSalary", "Thực lãnh", "calculated", "font-bold text-[#2E3192]"),
      currCol("cashPayment", "Tiền mặt", "calculated"),
    ],
    []
  );

  const table = useReactTable({
    data: employees,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id || row.userProfileId,
    initialState: { pagination: { pageSize: 15 } },
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-[#2E3192] border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <FileWarning size={48} className="text-muted-foreground/50" />
        <p>Chưa có nhân sự trong bảng lương này.</p>
      </div>
    );
  }

  const groupColorMap: Record<string, string> = {
    info: "",
    manual: "bg-amber-50/30",
    system: "bg-slate-50/50",
    calculated: "bg-indigo-50/20",
  };

  const headerColorMap: Record<string, string> = {
    info: "bg-slate-100",
    manual: "bg-amber-100/60 text-amber-900",
    system: "bg-slate-100/80 text-slate-600",
    calculated: "bg-indigo-100/60 text-indigo-900",
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Group legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-300" /> Nhập tay</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /> Hệ thống</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-300" /> Tự tính</span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const group = (header.column.columnDef.meta as ColMeta | undefined)?.group || "info";
                  return (
                    <th
                      key={header.id}
                      className={`px-3 py-2.5 font-semibold whitespace-nowrap cursor-pointer hover:bg-opacity-80 transition-colors ${headerColorMap[group]}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/40">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                {row.getVisibleCells().map((cell) => {
                  const group = (cell.column.columnDef.meta as ColMeta | undefined)?.group || "info";
                  return (
                    <td key={cell.id} className={`px-3 py-2.5 whitespace-nowrap ${groupColorMap[group]}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-border p-3 flex items-center justify-between bg-white mt-auto">
        <span className="text-xs text-muted-foreground">
          Hiển thị{" "}
          <span className="font-medium text-foreground">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>
          –
          <span className="font-medium text-foreground">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              employees.length
            )}
          </span>{" "}
          / <span className="font-medium text-foreground">{employees.length}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft size={14} />
          </Button>
          <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft size={14} />
          </Button>
          <div className="flex items-center gap-1 px-2 text-xs font-medium">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight size={14} />
          </Button>
          <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <ChevronsRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
