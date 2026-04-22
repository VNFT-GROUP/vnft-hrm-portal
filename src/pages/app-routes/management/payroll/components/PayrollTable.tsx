import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type CellContext,
  type ColumnDef,
  type Table,
  type Row,
  type OnChangeFn,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import type { PayrollEmployeeResponse } from "@/types/payroll/PayrollEmployeeResponse";

interface PayrollTableProps {
  employees: PayrollEmployeeResponse[];
  isLoading: boolean;
  isSelectionMode?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export default function PayrollTable({ employees, isLoading, isSelectionMode, rowSelection, onRowSelectionChange }: PayrollTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const formatWorkday = (value?: number | null) => {
    const resolved = value ?? 0;
    return Number.isInteger(resolved) ? resolved.toString() : resolved.toFixed(2).replace(/\.?0+$/, "");
  };

  const baseColumns: ColumnDef<PayrollEmployeeResponse>[] = useMemo(
    () => [
      {
        accessorKey: "personnelCode",
        header: t("payroll.col.personnelCode", { defaultValue: "Mã NV" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => <span className="font-medium text-[#1E2062]">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "personnelName",
        header: t("payroll.col.personnelName", { defaultValue: "Họ và Tên" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => {
          const name = info.getValue() as string;
          const avatarUrl = (info.row.original as unknown as Record<string, unknown>).avatarUrl as string | undefined;
          return (
            <div className="flex items-center gap-3">
              <AvatarPlaceholder name={name} src={avatarUrl} className="w-8 h-8 text-xs" />
              <span className="font-medium text-slate-700">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "departmentName",
        header: t("payroll.col.departmentName", { defaultValue: "Phòng ban" }),
      },
      {
        accessorKey: "basicSalary",
        header: t("payroll.col.basicSalary", { defaultValue: "Lương CB" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "targetSalary",
        header: t("payroll.col.targetSalary", { defaultValue: "Lương theo Target" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "targetThreshold",
        header: t("payroll.col.targetThreshold", { defaultValue: "Target" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "commission",
        header: t("payroll.col.commission", { defaultValue: "Hoa hồng" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "parkingAllowance",
        header: t("payroll.col.parkingAllowance", { defaultValue: "Gửi xe" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "fuelAllowance",
        header: t("payroll.col.fuelAllowance", { defaultValue: "Xăng xe" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "phoneAllowance",
        header: t("payroll.col.phoneAllowance", { defaultValue: "Điện thoại" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "seniorityAllowance",
        header: t("payroll.col.seniorityAllowance", { defaultValue: "PC Thâm niên" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "performanceAttitudeAllowance",
        header: t("payroll.col.performanceAttitudeAllowance", { defaultValue: "PC Hiệu suất & Thái độ" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "punctualityDisciplineAllowance",
        header: t("payroll.col.punctualityDisciplineAllowance", { defaultValue: "PC Giờ giấc & Kỷ luật" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "outstandingAllowance",
        header: t("payroll.col.outstandingAllowance", { defaultValue: "PC Vượt trội" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "insuranceBalance",
        header: t("payroll.col.insuranceBalance", { defaultValue: "Balance bảo hiểm" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "usaOfficeAllowance",
        header: t("payroll.col.usaOfficeAllowance", { defaultValue: "PC VP USA" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "hotBonus",
        header: t("payroll.col.hotBonus", { defaultValue: "Thưởng nóng" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "monthlyBonus",
        header: t("payroll.col.monthlyBonus", { defaultValue: "Thưởng tháng" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "managementAllowance",
        header: t("payroll.col.managementAllowance", { defaultValue: "PC Quản lý" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "businessTripFee",
        header: t("payroll.col.businessTripFee", { defaultValue: "Công tác phí" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "mealAllowance",
        header: t("payroll.col.mealAllowance", { defaultValue: "PC Cơm" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "jobAllowance",
        header: t("payroll.col.jobAllowance", { defaultValue: "PC Công việc" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "clientEntertainment",
        header: t("payroll.col.clientEntertainment", { defaultValue: "Tiếp khách" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "socialInsuranceSalary",
        header: t("payroll.col.socialInsuranceSalary", { defaultValue: "Lương BHXH" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "companySocialInsurance",
        header: t("payroll.col.companySocialInsurance", { defaultValue: "BHXH Cty" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "companyHealthInsurance",
        header: t("payroll.col.companyHealthInsurance", { defaultValue: "BHYT Cty" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "companyUnemploymentInsurance",
        header: t("payroll.col.companyUnemploymentInsurance", { defaultValue: "BHTN Cty" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "employeeSocialInsurance",
        header: t("payroll.col.employeeSocialInsurance", { defaultValue: "BHXH NV" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "employeeHealthInsurance",
        header: t("payroll.col.employeeHealthInsurance", { defaultValue: "BHYT NV" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "employeeUnemploymentInsurance",
        header: t("payroll.col.employeeUnemploymentInsurance", { defaultValue: "BHTN NV" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "workdaySalary",
        header: t("payroll.col.workdaySalary", { defaultValue: "Tổng lương" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => <span className="font-semibold text-emerald-600">{formatCurrency(info.getValue() as number)}</span>,
      },
      {
        accessorKey: "taxableIncome",
        header: t("payroll.col.taxableIncome", { defaultValue: "TN Chịu thuế" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "personalDeduction",
        header: t("payroll.col.personalDeduction", { defaultValue: "GTGC Bản thân" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "dependentCount",
        header: t("payroll.col.dependentCount", { defaultValue: "SL NPT" }),
      },
      {
        accessorKey: "dependentTaxDeductionAmount",
        header: t("payroll.col.dependentTaxDeductionAmount", { defaultValue: "Mức GT 1 NPT" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "dependentDeduction",
        header: t("payroll.col.dependentDeduction", { defaultValue: "GT NPT" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "assessableIncome",
        header: t("payroll.col.assessableIncome", { defaultValue: "TN Tính thuế" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "personalIncomeTax",
        header: t("payroll.col.personalIncomeTax", { defaultValue: "Thuế TNCN" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => <span className="text-rose-500">{formatCurrency(info.getValue() as number)}</span>,
      },
      {
        accessorKey: "netSalary",
        header: t("payroll.col.netSalary", { defaultValue: "Thực lãnh" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => <span className="font-bold text-[#2E3192]">{formatCurrency(info.getValue() as number)}</span>,
      },
      {
        accessorKey: "bankTransfer",
        header: t("payroll.col.bankTransfer", { defaultValue: "Chuyển khoản" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "cashPayment",
        header: t("payroll.col.cashPayment", { defaultValue: "Tiền mặt" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "salaryNote",
        header: t("payroll.col.salaryNote", { defaultValue: "Ghi chú" }),
      },
      {
        accessorKey: "standardWorkdays",
        header: t("payroll.col.standardWorkdays", { defaultValue: "Công chuẩn" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatWorkday(info.getValue() as number),
      },
      {
        accessorKey: "actualWorkdays",
        header: t("payroll.col.actualWorkdays", { defaultValue: "Công thực" }),
        cell: (info: CellContext<PayrollEmployeeResponse, unknown>) => formatWorkday(info.getValue() as number),
      },
    ],
    [t]
  );

  const columns: ColumnDef<PayrollEmployeeResponse>[] = useMemo(() => {
    if (isSelectionMode) {
      return [
        {
          id: 'select',
          header: ({ table }: { table: Table<PayrollEmployeeResponse> }) => (
            <div className="flex items-center justify-center px-2">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="w-4 h-4"
              />
            </div>
          ),
          cell: ({ row }: { row: Row<PayrollEmployeeResponse> }) => (
            <div className="flex items-center justify-center px-2">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="w-4 h-4"
              />
            </div>
          ),
        },
        ...baseColumns
      ];
    }
    return baseColumns;
  }, [baseColumns, isSelectionMode]);

  const table = useReactTable({
    data: employees,
    columns,
    state: { sorting, ...(isSelectionMode ? { rowSelection } : {}) },
    onSortingChange: setSorting,
    ...(isSelectionMode ? {
      enableRowSelection: true,
      onRowSelectionChange,
      getRowId: (row: PayrollEmployeeResponse) => row.userProfileId,
    } : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-[#2E3192] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">{t("common.loading", { defaultValue: "Đang tải dữ liệu..." })}</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <FileWarning size={48} className="text-muted-foreground/50" />
        <p>{t("payroll.noData", { defaultValue: "Không có nhân sự phù hợp để tạo bảng lương tháng này." })}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-muted/80 transition-colors" onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/50">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border p-4 flex items-center justify-between bg-card mt-auto">
        <span className="text-sm text-muted-foreground">
          {t("common.showing", { defaultValue: "Hiển thị" })}{" "}
          <span className="font-medium text-foreground">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{" "}
          -{" "}
          <span className="font-medium text-foreground">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              employees.length
            )}
          </span>{" "}
          {t("common.of", { defaultValue: "trong số" })}{" "}
          <span className="font-medium text-foreground">{employees.length}</span> {t("common.records", { defaultValue: "bản ghi" })}
        </span>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-lg"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm font-medium">{table.getState().pagination.pageIndex + 1}</span>
            <span className="text-sm text-muted-foreground">/ {table.getPageCount()}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-lg"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
