import { useState, useCallback, useMemo } from "react";
import { Search, Calculator, Plus, Calendar as CalendarIcon, FileText, Clock, CheckCircle2, Lock, Ban, FileCheck, FilePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import { getErrorMessage } from "@/lib/utils";

import { payrollService } from "@/services/payroll/payroll.service";
import type { PayrollResponse, PayrollStatus } from "@/types/payroll/PayrollResponse";
import type { CreatePayrollRequest, PayrollCalculateRequest, PayrollEmployeeImportRequest } from "@/types/payroll/CalculatePayrollRequest";

import CreatePayrollModal from "./components/CreatePayrollModal";
import PayrollSummary from "./components/PayrollSummary";
import PayrollEmployeeTable, { type CellOverrides } from "./components/PayrollEmployeeTable";

// ---- Status utilities ----
const STATUS_CONFIG: Record<PayrollStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  DRAFT: { label: "Nháp", color: "text-slate-600", bg: "bg-slate-100 border-slate-200", icon: <FilePen size={14} /> },
  CALCULATED: { label: "Đã tính", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: <Calculator size={14} /> },
  FINALIZED: { label: "Đã chốt", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: <FileCheck size={14} /> },
  APPROVED: { label: "Đã duyệt", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle2 size={14} /> },
  LOCKED: { label: "Đã khóa", color: "text-rose-700", bg: "bg-rose-50 border-rose-200", icon: <Lock size={14} /> },
  CANCELED: { label: "Đã hủy", color: "text-slate-500", bg: "bg-slate-50 border-slate-200", icon: <Ban size={14} /> },
};

const LOCKED_STATUSES: PayrollStatus[] = ["FINALIZED", "APPROVED", "LOCKED"];

function StatusBadge({ status }: { status: PayrollStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${cfg.bg} ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function fmtDatetime(d?: string | null) {
  if (!d) return "—";
  try { return format(new Date(d), "dd/MM/yyyy HH:mm"); } catch { return d; }
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  try { return format(new Date(d), "dd/MM/yyyy"); } catch { return d; }
}

export default function PayrollPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(() => currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => currentDate.getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ---- Inline editing overrides ----
  const [overrides, setOverrides] = useState<CellOverrides>({});

  // ---- Fetch payroll ----
  const { data: payroll, isLoading: isLoadingPayroll } = useQuery<PayrollResponse | null>({
    queryKey: ["payroll", selectedYear, selectedMonth],
    queryFn: () => payrollService.getPayrollByYearMonth(selectedYear, selectedMonth),
  });

  const employees = useMemo(() => payroll?.employees ?? [], [payroll?.employees]);
  const isLocked = payroll ? LOCKED_STATUSES.includes(payroll.status) : false;
  const canEdit = payroll && !isLocked;

  // Filter employees locally
  const filteredEmployees = employees.filter((emp) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      emp.personnelName?.toLowerCase().includes(q) ||
      emp.personnelCode?.toLowerCase().includes(q) ||
      emp.departmentName?.toLowerCase().includes(q)
    );
  });

  // ---- Create payroll ----
  const createMutation = useMutation({
    mutationFn: (data: CreatePayrollRequest) => payrollService.createPayroll(data),
    onSuccess: () => {
      toast.success("Tạo bảng lương thành công!");
      setIsCreateModalOpen(false);
      setOverrides({});
      queryClient.invalidateQueries({ queryKey: ["payroll", selectedYear, selectedMonth] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Lỗi khi tạo bảng lương"));
    },
  });

  const calculateMutation = useMutation({
    mutationFn: (data: PayrollCalculateRequest) => payrollService.calculatePayroll(data),
    onSuccess: (result) => {
      setOverrides({});
      queryClient.setQueryData(["payroll", selectedYear, selectedMonth], result);
    },
  });

  const handleCellChange = useCallback((userProfileId: string, field: string, value: number) => {
    // 1. Check if actually changed
    const emp = employees.find(e => e.userProfileId === userProfileId);
    if (!emp || (emp as unknown as Record<string, unknown>)[field] === value) return; // No change

    // 2. Compute new overrides immediately
    const newOverrides = {
      ...overrides,
      [userProfileId]: { ...(overrides[userProfileId] || {}), [field]: value },
    };

    setOverrides(newOverrides);

    // 3. Trigger save with accumulated changes
    const imports: PayrollEmployeeImportRequest[] = employees.map((e) => {
      const empOverrides = newOverrides[e.userProfileId] || {};
      return {
        userProfileId: e.userProfileId,
        targetSalary: empOverrides.targetSalary ?? e.targetSalary,
        commission: empOverrides.commission ?? e.commission,
        seniorityAllowance: empOverrides.seniorityAllowance ?? e.seniorityAllowance,
        outstandingAllowance: empOverrides.outstandingAllowance ?? e.outstandingAllowance,
        hotBonus: empOverrides.hotBonus ?? e.hotBonus,
        monthlyBonus: empOverrides.monthlyBonus ?? e.monthlyBonus,
        businessTripFee: empOverrides.businessTripFee ?? e.businessTripFee,
        mealAllowance: empOverrides.mealAllowance ?? e.mealAllowance,
        clientEntertainment: empOverrides.clientEntertainment ?? e.clientEntertainment,
        personalIncomeTax: empOverrides.personalIncomeTax ?? e.personalIncomeTax,
        bankTransfer: empOverrides.bankTransfer ?? e.bankTransfer,
      };
    });

    toast.promise(
      calculateMutation.mutateAsync({
        year: selectedYear,
        month: selectedMonth,
        name: payroll?.name || `Bảng lương tháng ${selectedMonth.toString().padStart(2, "0")}/${selectedYear}`,
        imports,
      }),
      {
        loading: "Đang lưu thay đổi...",
        success: "Đã lưu thay đổi",
        error: "Lỗi khi lưu bảng lương",
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, overrides, selectedYear, selectedMonth, payroll?.name, calculateMutation]);

  return (
    <div className="p-4 md:p-6 w-full min-h-full flex flex-col gap-6">
      {/* ===== HEADER ===== */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <FileText size={28} />
          </span>
          {t("payroll.title", { defaultValue: "Bảng Lương" })}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t("payroll.subtitle", { defaultValue: "Quản lý và tính toán bảng lương nhân sự theo tháng" })}
        </p>
      </m.div>

      {/* ===== TOOLBAR ===== */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-4 md:p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Month/Year Filter */}
          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
            <div className="flex items-center px-3 gap-2">
              <CalendarIcon size={18} className="text-muted-foreground" />
              <select
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(Number(e.target.value)); setOverrides({}); }}
                className="bg-transparent border-none outline-none text-sm font-medium focus:ring-0"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
            <div className="w-px h-6 bg-border mx-1" />
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(Number(e.target.value)); setOverrides({}); }}
              className="bg-transparent border-none outline-none text-sm font-medium px-3 focus:ring-0"
            >
              {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {payroll && (
            <div className="relative flex-1 md:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Tìm theo tên, mã NV..."
                className="pl-10 h-10 rounded-xl bg-muted border-none focus-visible:ring-1 focus-visible:ring-[#2E3192]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {!payroll && !isLoadingPayroll ? (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full md:w-auto h-10 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md transition-all font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Tạo bảng lương
            </Button>
          ) : null}
        </div>
      </m.div>

      {/* ===== PAYROLL DETAIL ===== */}
      {payroll && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Header info bar */}
          <div className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-[#1E2062]">{payroll.name}</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Kỳ: {fmtDate(payroll.periodStartDate)} — {fmtDate(payroll.periodEndDate)}
                </p>
              </div>
              <StatusBadge status={payroll.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</span>
                <StatusBadge status={payroll.status} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={11} /> Snapshot
                </span>
                <span className="font-medium text-slate-700">{fmtDatetime(payroll.snapshotAt)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calculator size={11} /> Đã tính lúc
                </span>
                <span className="font-medium text-slate-700">{fmtDatetime(payroll.calculatedAt)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Số nhân sự</span>
                <span className="font-bold text-[#2E3192] text-lg">{payroll.totals?.employeeCount ?? employees.length}</span>
              </div>
            </div>

            {payroll.note && (
              <div className="mt-4 pt-3 border-t border-border text-sm text-slate-500 italic">
                📝 {payroll.note}
              </div>
            )}
          </div>

          {/* Totals */}
          {payroll.totals && <PayrollSummary totals={payroll.totals} />}
        </m.div>
      )}

      {/* ===== EMPLOYEE TABLE ===== */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col relative h-[70vh] min-h-[500px]"
      >
        <PayrollEmployeeTable
          employees={filteredEmployees}
          isLoading={isLoadingPayroll}
          editable={!!canEdit}
          overrides={overrides}
          onCellChange={handleCellChange}
        />
      </m.div>

      {/* ===== MODALS ===== */}
      <CreatePayrollModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isPending={createMutation.isPending}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />
    </div>
  );
}
