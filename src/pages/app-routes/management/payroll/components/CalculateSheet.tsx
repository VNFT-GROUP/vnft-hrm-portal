import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Upload, Loader2 } from "lucide-react";
import type { PayrollEmployeeResponse } from "@/types/payroll/PayrollResponse";
import type { PayrollEmployeeImportRequest } from "@/types/payroll/CalculatePayrollRequest";

/** Fields the user can edit */
const EDITABLE_FIELDS: { key: keyof PayrollEmployeeImportRequest; label: string }[] = [
  { key: "targetSalary", label: "Lương Target" },
  { key: "commission", label: "Hoa hồng" },
  { key: "seniorityAllowance", label: "PC Thâm niên" },
  { key: "outstandingAllowance", label: "PC Vượt trội" },
  { key: "hotBonus", label: "Thưởng nóng" },
  { key: "monthlyBonus", label: "Thưởng tháng" },
  { key: "businessTripFee", label: "Công tác phí" },
  { key: "mealAllowance", label: "Tiền ăn" },
  { key: "clientEntertainment", label: "Tiếp khách" },
  { key: "personalIncomeTax", label: "Thuế TNCN" },
  { key: "bankTransfer", label: "Chuyển khoản" },
];

interface CalculateSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employees: PayrollEmployeeResponse[];
  onCalculate: (imports: PayrollEmployeeImportRequest[]) => void;
  isCalculating: boolean;
}

interface EditableRow {
  userProfileId: string;
  personnelCode: string;
  personnelName: string;
  [key: string]: string | number | null | undefined;
}

function buildEditableRows(employees: PayrollEmployeeResponse[]): EditableRow[] {
  return employees.map((emp) => ({
    userProfileId: emp.userProfileId,
    personnelCode: emp.personnelCode || "",
    personnelName: emp.personnelName || "",
    targetSalary: emp.targetSalary,
    commission: emp.commission,
    seniorityAllowance: emp.seniorityAllowance,
    outstandingAllowance: emp.outstandingAllowance,
    hotBonus: emp.hotBonus,
    monthlyBonus: emp.monthlyBonus,
    businessTripFee: emp.businessTripFee,
    mealAllowance: emp.mealAllowance,
    clientEntertainment: emp.clientEntertainment,
    personalIncomeTax: emp.personalIncomeTax,
    bankTransfer: emp.bankTransfer,
  }));
}

export default function CalculateSheet({
  isOpen,
  onOpenChange,
  employees,
  onCalculate,
  isCalculating,
}: CalculateSheetProps) {
  // Derive base rows from employees (re-derived when employees change)
  const baseRows = useMemo(() => buildEditableRows(employees), [employees]);

  // User overrides: keyed by userProfileId → field → value
  const [overrides, setOverrides] = useState<Record<string, Record<string, number>>>({});

  // Merge base rows with user overrides
  const editableRows: EditableRow[] = useMemo(
    () =>
      baseRows.map((row) => ({
        ...row,
        ...(overrides[row.userProfileId] || {}),
      })),
    [baseRows, overrides]
  );

  const handleChange = (userProfileId: string, field: string, rawValue: string) => {
    const numValue = Number(rawValue.replace(/[^0-9.-]/g, "")) || 0;
    setOverrides((prev) => ({
      ...prev,
      [userProfileId]: { ...(prev[userProfileId] || {}), [field]: numValue },
    }));
  };

  const handleSubmit = () => {
    const imports: PayrollEmployeeImportRequest[] = editableRows.map((row) => ({
      userProfileId: row.userProfileId,
      targetSalary: (row.targetSalary as number) || 0,
      commission: (row.commission as number) || 0,
      seniorityAllowance: (row.seniorityAllowance as number) || 0,
      outstandingAllowance: (row.outstandingAllowance as number) || 0,
      hotBonus: (row.hotBonus as number) || 0,
      monthlyBonus: (row.monthlyBonus as number) || 0,
      businessTripFee: (row.businessTripFee as number) || 0,
      mealAllowance: (row.mealAllowance as number) || 0,
      clientEntertainment: (row.clientEntertainment as number) || 0,
      personalIncomeTax: (row.personalIncomeTax as number) || 0,
      bankTransfer: (row.bankTransfer as number) || 0,
      // NOT sending performanceAttitudeAllowance
      // NOT sending punctualityDisciplineAllowance
    }));
    onCalculate(imports);
  };

  const formatDisplay = (v: unknown) => {
    const n = Number(v) || 0;
    return n === 0 ? "" : n.toLocaleString("vi-VN");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl max-h-screen overflow-hidden flex flex-col p-0 bg-background border-l border-border">
        <SheetHeader className="p-6 border-b border-border bg-card shrink-0">
          <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
            <Upload size={22} className="text-[#2E3192]" />
            Nhập số liệu & Tính lương
          </SheetTitle>
          <SheetDescription>
            Chỉnh sửa các khoản nhập tay cho từng nhân sự, sau đó bấm "Tính lương" để backend tính toán.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          {editableRows.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center gap-3">
              <Calculator size={48} className="text-muted-foreground/30" />
              <p>Chưa có nhân sự. Vui lòng tạo bảng lương trước.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {editableRows.map((row) => (
                <div key={row.userProfileId} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                    <span className="font-mono text-sm font-semibold text-[#2E3192]">{row.personnelCode}</span>
                    <span className="text-sm font-medium text-slate-700">{row.personnelName}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
                    {EDITABLE_FIELDS.map((field) => (
                      <div key={field.key} className="flex flex-col gap-1">
                        <span className="text-[11px] text-slate-500 font-medium">{field.label}</span>
                        <Input
                          type="text"
                          value={formatDisplay(row[field.key])}
                          onChange={(e) => handleChange(row.userProfileId, field.key, e.target.value)}
                          placeholder="0"
                          className="h-8 text-sm px-2 font-mono bg-slate-50/50 border-slate-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="p-5 border-t border-border bg-card mt-auto flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCalculating || editableRows.length === 0}
            className="bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md px-6"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calculator size={18} /> Tính lương
              </span>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
