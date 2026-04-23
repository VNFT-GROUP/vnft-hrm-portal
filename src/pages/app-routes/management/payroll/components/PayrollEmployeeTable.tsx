import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { FileWarning } from "lucide-react";
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import type { PayrollEmployeeResponse } from "@/types/payroll/PayrollResponse";

/** Override map: userProfileId → field → value */
export type CellOverrides = Record<string, Record<string, number>>;

interface PayrollEmployeeTableProps {
  employees: PayrollEmployeeResponse[];
  isLoading: boolean;
  editable?: boolean;
  overrides?: CellOverrides;
  onCellChange?: (userProfileId: string, field: string, value: number) => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

const fmtWd = (v?: number | null) => {
  const r = v ?? 0;
  return Number.isInteger(r) ? r.toString() : r.toFixed(2).replace(/\.?0+$/, "");
};

// ---- Inline editable cell ----
function EditableCell({
  value,
  userProfileId,
  field,
  onCellChange,
}: {
  value: number;
  userProfileId: string;
  field: string;
  onCellChange: (uid: string, f: string, v: number) => void;
}) {
  const [localValue, setLocalValue] = useState(() =>
    value === 0 ? "" : value.toLocaleString("vi-VN")
  );

  const handleBlur = useCallback(() => {
    const numValue = Number(localValue.replace(/[^0-9.-]/g, "")) || 0;
    onCellChange(userProfileId, field, numValue);
    setLocalValue(numValue === 0 ? "" : numValue.toLocaleString("vi-VN"));
  }, [localValue, userProfileId, field, onCellChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
      placeholder="0"
      className="w-full min-w-[90px] h-7 px-2 text-sm font-mono bg-white border border-amber-200 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-colors"
    />
  );
}

// ---- Column meta ----
type ColRole = "info" | "editable" | "readonly";
interface ColMeta { role: ColRole }

const HEADER_STYLE: Record<ColRole, string> = {
  info: "bg-slate-100 text-slate-600",
  editable: "bg-amber-100/70 text-amber-900",
  readonly: "bg-slate-100/80 text-slate-500",
};

const CELL_STYLE: Record<ColRole, string> = {
  info: "",
  editable: "bg-amber-50/30",
  readonly: "",
};

function col(
  key: keyof PayrollEmployeeResponse,
  header: string,
  role: ColRole,
  highlight?: string,
): ColumnDef<PayrollEmployeeResponse> {
  return {
    accessorKey: key,
    header,
    meta: { role } as ColMeta,
    cell: (info) => {
      const val = fmt(info.getValue() as number);
      if (highlight) return <span className={highlight}>{val}</span>;
      return val;
    },
  };
}

export default function PayrollEmployeeTable({
  employees,
  isLoading,
  editable = false,
  overrides = {},
  onCellChange,
}: PayrollEmployeeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Merge overrides into employee data for display
  const displayData: PayrollEmployeeResponse[] = useMemo(() => {
    if (!editable || Object.keys(overrides).length === 0) return employees;
    return employees.map((emp) => {
      const empOverrides = overrides[emp.userProfileId];
      if (!empOverrides) return emp;
      return { ...emp, ...empOverrides } as PayrollEmployeeResponse;
    });
  }, [employees, overrides, editable]);

  // Build editable cell renderer
  const editableCell = useCallback(
    (key: string) =>
      (info: { row: { original: PayrollEmployeeResponse }; getValue: () => unknown }) => {
        if (!editable || !onCellChange) {
          const val = fmt(info.getValue() as number);
          return val;
        }
        const uid = info.row.original.userProfileId;
        const currentVal = (overrides[uid]?.[key] ?? info.getValue()) as number;
        return (
          <EditableCell
            key={`${uid}-${key}`}
            value={currentVal}
            userProfileId={uid}
            field={key}
            onCellChange={onCellChange}
          />
        );
      },
    [editable, onCellChange, overrides]
  );

  function editableCol(
    key: keyof PayrollEmployeeResponse,
    header: string,
    highlight?: string,
  ): ColumnDef<PayrollEmployeeResponse> {
    return {
      accessorKey: key,
      header,
      meta: { role: "editable" } as ColMeta,
      cell: editable && onCellChange
        ? editableCell(key)
        : (info) => {
            const val = fmt(info.getValue() as number);
            if (highlight) return <span className={highlight}>{val}</span>;
            return val;
          },
    };
  }

  // Columns in EXACT business order
  const columns: ColumnDef<PayrollEmployeeResponse>[] = useMemo(
    () => [
      // --- Thông tin nhân sự ---
      {
        accessorKey: "personnelCode",
        header: "Mã nhân sự",
        meta: { role: "info" } as ColMeta,
        cell: (info) => <span className="font-mono font-semibold text-[#1E2062]">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "personnelName",
        header: "Họ tên",
        meta: { role: "info" } as ColMeta,
        cell: (info) => {
          const name = info.getValue() as string;
          const avatarUrl = info.row.original.avatarUrl;
          return (
            <div className="flex items-center gap-2.5">
              <AvatarPlaceholder name={name} src={avatarUrl ?? undefined} className="w-7 h-7 text-[10px]" />
              <span className="font-medium text-slate-700">{name}</span>
            </div>
          );
        },
      },
      { accessorKey: "departmentName", header: "Tên phòng ban", meta: { role: "info" } as ColMeta },

      // --- Lương & phụ cấp ---
      col("basicSalary", "Lương cơ bản", "readonly"),
      editableCol("targetSalary", "Lương theo Target"),
      col("targetThreshold", "Target", "readonly"),
      editableCol("commission", "Hoa hồng"),
      col("parkingAllowance", "Gửi xe", "readonly"),
      col("fuelAllowance", "Xăng xe", "readonly"),
      col("phoneAllowance", "Điện thoại", "readonly"),
      editableCol("seniorityAllowance", "Phụ cấp thâm niên"),
      col("performanceAttitudeAllowance", "Phụ cấp hiệu suất & thái độ", "readonly"),
      col("punctualityDisciplineAllowance", "Phụ cấp giờ giấc & kỷ luật", "readonly"),
      editableCol("outstandingAllowance", "Phụ cấp vượt trội"),
      col("insuranceBalance", "Balance bảo hiểm", "readonly"),
      col("usaOfficeAllowance", "Phụ cấp VP USA", "readonly"),
      editableCol("hotBonus", "Thưởng nóng"),
      editableCol("monthlyBonus", "Tiền thưởng tháng"),
      col("managementAllowance", "Phụ cấp quản lý", "readonly"),
      editableCol("businessTripFee", "Công tác"),
      editableCol("mealAllowance", "Tiền ăn"),
      col("jobAllowance", "Phụ cấp công việc", "readonly"),
      editableCol("clientEntertainment", "Tiếp khách"),

      // --- Bảo hiểm ---
      col("socialInsuranceSalary", "Lương BHXH", "readonly"),
      col("companySocialInsurance", "BHXH công ty", "readonly"),
      col("companyHealthInsurance", "BHYT công ty", "readonly"),
      col("companyUnemploymentInsurance", "BHTN công ty", "readonly"),
      col("employeeSocialInsurance", "BHXH nhân viên", "readonly"),
      col("employeeHealthInsurance", "BHYT nhân viên", "readonly"),
      col("employeeUnemploymentInsurance", "BHTN nhân viên", "readonly"),

      // --- Thuế & thực lãnh ---
      col("workdaySalary", "Tổng lương", "readonly", "font-semibold text-emerald-600"),
      col("taxableIncome", "Thu nhập chịu thuế", "readonly"),
      col("personalDeduction", "Giảm trừ gia cảnh bản thân", "readonly"),
      { accessorKey: "dependentCount", header: "Số người phụ thuộc", meta: { role: "readonly" } as ColMeta },
      col("dependentTaxDeductionAmount", "Mức miễn giảm thuế với 1 NPT", "readonly"),
      col("dependentDeduction", "Miễn giảm thuế người phụ thuộc", "readonly"),
      col("assessableIncome", "Thu nhập tính thuế", "readonly"),
      editableCol("personalIncomeTax", "Thuế TNCN"),
      col("netSalary", "Thực lãnh", "readonly", "font-bold text-[#2E3192]"),
      editableCol("bankTransfer", "Chuyển khoản"),
      col("cashPayment", "Tiền mặt", "readonly"),

      // --- Ghi chú & công ---
      {
        accessorKey: "salaryNote",
        header: "Ghi chú",
        meta: { role: "info" } as ColMeta,
        cell: (info) => <span className="text-slate-500 text-xs max-w-[200px] truncate block">{(info.getValue() as string) || "—"}</span>,
      },
      {
        accessorKey: "standardWorkdays",
        header: "Số công chuẩn",
        meta: { role: "readonly" } as ColMeta,
        cell: (info) => fmtWd(info.getValue() as number),
      },
      {
        accessorKey: "actualWorkdays",
        header: "Công làm việc",
        meta: { role: "readonly" } as ColMeta,
        cell: (info) => fmtWd(info.getValue() as number),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editableCell]
  );

  const table = useReactTable({
    data: displayData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id || row.userProfileId,
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

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Legend */}
      <div className="flex items-center gap-5 px-4 py-2 border-b border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
          {editable ? "Nhập trực tiếp" : "Cho phép thay đổi"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /> Hệ thống
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const role = (header.column.columnDef.meta as ColMeta | undefined)?.role || "info";
                  return (
                    <th
                      key={header.id}
                      className={`px-3 py-2.5 font-semibold whitespace-nowrap cursor-pointer hover:brightness-95 transition-colors ${HEADER_STYLE[role]}`}
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
                  const role = (cell.column.columnDef.meta as ColMeta | undefined)?.role || "info";
                  return (
                    <td key={cell.id} className={`px-3 py-2 whitespace-nowrap ${CELL_STYLE[role]}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record count */}
      <div className="border-t border-border px-4 py-2.5 bg-white mt-auto">
        <span className="text-xs text-muted-foreground">
          Tổng: <span className="font-semibold text-foreground">{employees.length}</span> nhân sự
        </span>
      </div>
    </div>
  );
}
