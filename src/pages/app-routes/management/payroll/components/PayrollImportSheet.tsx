import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Search, Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { useDebounce } from "@/hooks/useDebounce";
import type { PayrollImportRequest } from "@/types/payroll/CalculatePayrollRequest";
import type { UserResponse } from "@/types/user/UserResponse";

interface PayrollImportSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCalculate: (imports: PayrollImportRequest[]) => void;
  isCalculating: boolean;
  selectedMonth: number;
  selectedYear: number;
}

export default function PayrollImportSheet({
  isOpen,
  onOpenChange,
  onCalculate,
  isCalculating,
  selectedMonth,
  selectedYear
}: PayrollImportSheetProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: usersData } = useQuery({
    queryKey: ["users-for-payroll", debouncedSearchTerm],
    queryFn: () => userService.getUsers(1, 50, debouncedSearchTerm),
    enabled: isOpen,
  });

  const users = usersData?.data?.content || [];

  const [imports, setImports] = useState<(PayrollImportRequest & { personnelName?: string })[]>([]);

  const addImportRow = (user: UserResponse) => {
    if (imports.find(i => i.employeeCode === user.employeeCode)) return;
    setImports([
      ...imports,
      {
        employeeCode: user.employeeCode,
        personnelName: user.fullName,
        targetSalary: 0,
        commission: 0,
        seniorityAllowance: 0,
        performanceAttitudeAllowance: 0,
        punctualityDisciplineAllowance: 0,
        outstandingAllowance: 0,
        hotBonus: 0,
        monthlyBonus: 0,
        businessTripFee: 0,
        mealAllowance: 0,
        clientEntertainment: 0,
        personalIncomeTax: 0,
        bankTransfer: 0
      }
    ]);
  };

  const removeImportRow = (index: number) => {
    const newImports = [...imports];
    newImports.splice(index, 1);
    setImports(newImports);
  };

  const handleInputChange = (index: number, field: keyof PayrollImportRequest, value: string) => {
    const numValue = Number(value.replace(/[^0-9]/g, "")) || 0;
    const newImports = [...imports];
    newImports[index] = {
      ...newImports[index],
      [field]: numValue
    };
    setImports(newImports);
  };

  const handleCalculate = () => {
    onCalculate(imports.map(item => {
      const { personnelName: _personnelName, ...rest } = item;
      return rest;
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl max-h-screen overflow-hidden flex flex-col p-0 bg-background border-l border-border">
        <SheetHeader className="p-6 border-b border-border bg-card">
          <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
            <Calculator size={24} className="text-[#2E3192]" />
            {t("payroll.import.title", { defaultValue: `Nhập số liệu & Tính lương (Tháng ${selectedMonth}/${selectedYear})` })}
          </SheetTitle>
          <SheetDescription>
            {t("payroll.import.desc", { defaultValue: "Tìm nhân sự và nhập các khoản phụ cấp, khấu trừ trước khi hệ thống tính toán." })}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold">{t("payroll.import.searchEmployee", { defaultValue: "Thêm nhân sự" })}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder={t("payroll.import.searchPlaceholder", { defaultValue: "Nhập mã hoặc tên NV..." })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {users.length > 0 && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
                  {users.map(user => (
                    <button
                      key={user.id}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex justify-between items-center"
                      onClick={() => {
                        addImportRow(user);
                        setSearchTerm("");
                      }}
                    >
                      <span>{user.employeeCode} - {user.fullName}</span>
                      <Plus size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-sm">Danh sách nhân sự đã chọn ({imports.length})</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {imports.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <Calculator size={48} className="text-muted-foreground/30 mb-4" />
                  <p>Chưa chọn nhân sự nào.</p>
                  <p className="text-sm">Bạn vẫn có thể nhấn "Tính lương", hệ thống sẽ lấy dữ liệu công chuẩn để tính toán cho tất cả nhân sự (nếu chưa có dữ liệu import).</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {imports.map((item, index) => (
                    <div key={item.employeeCode} className="border border-border rounded-lg p-4 bg-background relative shadow-sm">
                      <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                        <span className="font-semibold text-[#1E2062]">{item.employeeCode} - {item.personnelName}</span>
                        <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 w-8" onClick={() => removeImportRow(index)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { key: 'targetSalary', label: 'Lương Target' },
                          { key: 'commission', label: 'Hoa hồng' },
                          { key: 'seniorityAllowance', label: 'PC Thâm niên' },
                          { key: 'performanceAttitudeAllowance', label: 'PC Thái độ' },
                          { key: 'punctualityDisciplineAllowance', label: 'PC Kỷ luật' },
                          { key: 'outstandingAllowance', label: 'PC Xuất sắc' },
                          { key: 'hotBonus', label: 'Thưởng nóng' },
                          { key: 'monthlyBonus', label: 'Thưởng tháng' },
                          { key: 'businessTripFee', label: 'Công tác phí' },
                          { key: 'mealAllowance', label: 'PC Cơm' },
                          { key: 'clientEntertainment', label: 'Tiếp khách' },
                          { key: 'personalIncomeTax', label: 'Thuế TNCN' },
                          { key: 'bankTransfer', label: 'Chuyển khoản' },
                        ].map(field => (
                          <div key={field.key} className="flex flex-col gap-1.5">
                            <label className="text-xs text-muted-foreground">{field.label}</label>
                            <Input
                              type="text"
                              value={item[field.key as keyof PayrollImportRequest] === 0 ? '' : (item[field.key as keyof PayrollImportRequest] as number).toLocaleString('vi-VN')}
                              onChange={(e) => handleInputChange(index, field.key as keyof PayrollImportRequest, e.target.value)}
                              placeholder="0"
                              className="h-8 text-sm px-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 border-t border-border bg-card mt-auto flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel", { defaultValue: "Hủy" })}
          </Button>
          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating}
            className="bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </span>
            ) : (
               <span className="flex items-center gap-2"><Calculator size={18} /> {t("payroll.calculate", { defaultValue: "Lưu & Tính lương" })}</span>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
