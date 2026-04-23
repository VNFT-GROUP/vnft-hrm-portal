import { useState } from "react";
import { Search, Calculator, Upload, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/hooks/useDebounce";

import { payrollService } from "@/services/payroll/payroll.service";
import PayrollTable from "./components/PayrollTable";

import type { CalculatePayrollRequest, CreatePayrollRequest, PayrollImportRequest } from "@/types/payroll/CalculatePayrollRequest";
import PayrollImportSheet from "./components/PayrollImportSheet";

export default function PayrollPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Fetch Payroll for selected month/year
  const { data: payrollData, isLoading: isLoadingPayroll } = useQuery({
    queryKey: ["payrolls", selectedYear, selectedMonth],
    queryFn: () => payrollService.getPayrolls({ year: selectedYear, month: selectedMonth }),
  });

  const payroll = payrollData?.content?.[0] || null;

  // Fetch Employees for the payroll if it exists
  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["payroll-employees", payroll?.id],
    queryFn: () => payrollService.getPayrollEmployees(payroll!.id),
    enabled: !!payroll?.id,
  });

  const employees = employeesData || [];

  // Fetch Candidates for new payroll creation
  const { data: candidatesData, refetch: fetchCandidates, isFetching: isFetchingCandidates } = useQuery({
    queryKey: ["payroll-candidates", selectedYear, selectedMonth],
    queryFn: () => payrollService.getPayrollCandidates(selectedYear, selectedMonth),
    enabled: false,
  });

  const candidates = candidatesData || [];

  const createMutation = useMutation({
    mutationFn: (data: CreatePayrollRequest) => payrollService.createPayroll(data),
    onSuccess: () => {
      toast.success(t("payroll.createSuccess", { defaultValue: "Tạo bảng lương thành công!" }));
      setRowSelection({});
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || "Lỗi khi tạo bảng lương";
      toast.error(msg);
    }
  });

  const calculateMutation = useMutation({
    mutationFn: (data: CalculatePayrollRequest) => payrollService.calculatePayroll(data),
    onSuccess: () => {
      toast.success(t("payroll.calculateSuccess", { defaultValue: "Tính lương thành công!" }));
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["payroll-employees"] });
      setIsImportSheetOpen(false);
    },
    onError: () => {
      toast.error(t("payroll.calculateError", { defaultValue: "Lỗi khi tính lương" }));
    }
  });

  const handleCalculate = (imports: PayrollImportRequest[]) => {
    calculateMutation.mutate({
      year: selectedYear,
      month: selectedMonth,
      name: `Bảng lương tháng ${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`,
      imports: imports
    });
  };

  const handleCreatePayroll = () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
    if (selectedIds.length === 0) return;
    
    createMutation.mutate({
      year: selectedYear,
      month: selectedMonth,
      name: `Bảng lương tháng ${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`,
      userProfileIds: selectedIds
    });
  };

  const isCreateMode = !isLoadingPayroll && !payroll;
  const currentData = isCreateMode ? candidates : employees;
  const isLoadingData = isLoadingPayroll || isLoadingEmployees || isFetchingCandidates;

  // Filter local data
  const filteredData = currentData.filter(emp => 
    emp.personnelName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    emp.personnelCode?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    emp.departmentName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const selectedCount = Object.keys(rowSelection).filter(k => rowSelection[k]).length;

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
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

      {/* 2. Toolbar Section */}
      <m.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Month/Year Filter */}
          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
            <div className="flex items-center px-3 gap-2">
              <CalendarIcon size={18} className="text-muted-foreground" />
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent border-none outline-none text-sm font-medium focus:ring-0"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{t("payroll.month", { defaultValue: "Tháng" })} {m}</option>
                ))}
              </select>
            </div>
            <div className="w-px h-6 bg-border mx-1"></div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent border-none outline-none text-sm font-medium px-3 focus:ring-0"
            >
              {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map(y => (
                <option key={y} value={y}>{t("payroll.year", { defaultValue: "Năm" })} {y}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 md:min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder={t("payroll.searchPlaceholder", { defaultValue: "Tìm theo tên, mã NV..." })} 
              className="pl-10 h-10 rounded-xl bg-muted border-none focus-visible:ring-1 focus-visible:ring-[#2E3192]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isCreateMode ? (
            <>
              <Button 
                variant="outline"
                onClick={() => fetchCandidates()}
                disabled={isFetchingCandidates}
                className="w-full md:w-auto h-10 px-4 rounded-xl text-slate-700"
              >
                {t("payroll.fetchCandidates", { defaultValue: "Lấy danh sách nhân sự" })}
              </Button>
              <Button 
                onClick={handleCreatePayroll} 
                disabled={createMutation.isPending || selectedCount === 0 || candidates.length === 0}
                className="w-full md:w-auto h-10 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md transition-all font-semibold"
              >
                {createMutation.isPending ? t("payroll.creating", { defaultValue: "Đang tạo..." }) : t("payroll.createBtn", { defaultValue: "Tạo bảng lương" })}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={() => setIsImportSheetOpen(true)} 
                className="w-full md:w-auto h-10 px-4 rounded-xl border-[#2E3192]/20 text-[#2E3192] hover:bg-[#2E3192]/5 transition-all"
              >
                <Upload size={18} className="mr-2" /> 
                {t("payroll.importData", { defaultValue: "Nhập số liệu" })}
              </Button>
              
              <Button 
                onClick={() => {
                  if (employees.length === 0 && !isImportSheetOpen) {
                    setIsImportSheetOpen(true);
                    toast.info(t("payroll.requireImportData", { defaultValue: "Vui lòng nhập số liệu trước khi tính lương" }));
                  } else {
                    handleCalculate([]);
                  }
                }} 
                disabled={calculateMutation.isPending}
                className="w-full md:w-auto h-10 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all font-semibold"
              >
                <Calculator size={18} className="mr-2" /> 
                {calculateMutation.isPending ? t("payroll.calculating", { defaultValue: "Đang tính..." }) : t("payroll.calculateBtn", { defaultValue: "Tính lại" })}
              </Button>
            </>
          )}
        </div>
      </m.div>

      {/* 3. Main Table Section */}
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden flex-1 flex flex-col relative"
      >
        {isCreateMode && candidates.length > 0 && (
          <div className="absolute top-4 left-4 z-20 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-indigo-100 shadow-sm">
            {t("payroll.selectedCount", { count: selectedCount, defaultValue: `Đã chọn: ${selectedCount} nhân sự` })}
          </div>
        )}
        <PayrollTable 
          employees={filteredData} 
          isLoading={isLoadingData} 
          isSelectionMode={isCreateMode && candidates.length > 0}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </m.div>

      {/* Import & Calculate Sheet */}
      <PayrollImportSheet 
        isOpen={isImportSheetOpen}
        onOpenChange={setIsImportSheetOpen}
        onCalculate={handleCalculate}
        isCalculating={calculateMutation.isPending}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
}
