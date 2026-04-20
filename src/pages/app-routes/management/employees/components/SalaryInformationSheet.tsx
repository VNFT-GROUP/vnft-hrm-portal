import { useState, useEffect } from "react";
import { CircleDollarSign, Plus, Trash2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { UpdateUserSalaryComponentsRequest } from "@/types/user/salary/UpdateUserSalaryComponentsRequest";
import type { UserSalaryComponentRequest } from "@/types/user/salary/UserSalaryComponentRequest";
import type { SalaryComponentCode } from "@/types/user/salary/SalaryComponentCode";
import type { SalaryComponentCategory } from "@/types/user/salary/SalaryComponentCategory";
import { format } from "date-fns";

interface SalaryInformationSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string | null;
}

const DEFAULT_COMPONENTS = [
  { value: "BASIC_GROSS_SALARY", label: "Lương cơ bản (Gross)", category: "SALARY" },
  { value: "SOCIAL_INSURANCE_SALARY", label: "Lương đóng BHXH", category: "SALARY" },
  { value: "INSURANCE_BALANCE_ALLOWANCE", label: "Phụ cấp chênh lệch BHXH", category: "ALLOWANCE" },
  { value: "JOB_ALLOWANCE", label: "Phụ cấp công việc", category: "ALLOWANCE" },
  { value: "PARKING_ALLOWANCE", label: "Phụ cấp gửi xe", category: "ALLOWANCE" },
  { value: "MANAGEMENT_ALLOWANCE", label: "Phụ cấp quản lý", category: "ALLOWANCE" },
  { value: "MEAL_ALLOWANCE", label: "Phụ cấp ăn trưa", category: "ALLOWANCE" },
  { value: "PHONE_ALLOWANCE", label: "Phụ cấp điện thoại", category: "ALLOWANCE" },
  { value: "FUEL_ALLOWANCE", label: "Phụ cấp xăng xe", category: "ALLOWANCE" },
  { value: "CLIENT_ENTERTAINMENT_ALLOWANCE", label: "Phụ cấp tiếp khách", category: "ALLOWANCE" },
  { value: "TARGET_ALLOWANCE", label: "Phụ cấp KPI", category: "ALLOWANCE" },
];

export default function SalaryInformationSheet({ isOpen, onOpenChange, userId }: SalaryInformationSheetProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [formData, setFormData] = useState<UserSalaryComponentRequest[]>([]);

  const { data: salaryData, isFetching } = useQuery({
    queryKey: ['userSalaryComponents', userId],
    queryFn: () => userService.getSalaryComponents(userId!),
    enabled: isOpen && !!userId,
  });

  useEffect(() => {
    if (salaryData?.data && !isFetching) {
      setFormData(
        salaryData.data.map(config => ({
          effectiveFrom: config.effectiveFrom,
          note: config.note || "",
          salaryComponents: config.salaryComponents.map(item => ({
            code: item.code,
            name: item.name,
            category: item.category,
            amount: item.amount,
            note: item.note || ""
          }))
        }))
      );
    } else if (!salaryData?.data && !isFetching) {
      setFormData([]);
    }
  }, [salaryData, isFetching]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditingMode(false);
    }
    onOpenChange(open);
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserSalaryComponentsRequest) => userService.updateSalaryComponents(userId!, data),
    onSuccess: () => {
      toast.success(t('management.updateSalarySuccess', { defaultValue: 'Cập nhật thông tin lương thành công!' }));
      queryClient.invalidateQueries({ queryKey: ["userSalaryComponents", userId] });
      setIsEditingMode(false);
    },
    onError: () => {
      toast.error(t('management.updateSalaryError', { defaultValue: 'Đã có lỗi xảy ra khi cập nhật thông tin lương.' }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    updateMutation.mutate({ userSalaryComponents: formData });
  };

  const handleAddComponentConfig = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setFormData([
      ...formData,
      { effectiveFrom: today, note: "", salaryComponents: [] }
    ]);
  };

  const handleRemoveComponentConfig = (idx: number) => {
    const newForm = [...formData];
    newForm.splice(idx, 1);
    setFormData(newForm);
  };

  const handleAddDetailItem = (configIdx: number) => {
    const newForm = [...formData];
    newForm[configIdx].salaryComponents.push({
      code: "BASIC_GROSS_SALARY",
      name: "Lương cơ bản (Gross)",
      category: "SALARY",
      amount: 0,
      note: ""
    });
    setFormData(newForm);
  };

  const handleRemoveDetailItem = (configIdx: number, itemIdx: number) => {
    const newForm = [...formData];
    newForm[configIdx].salaryComponents.splice(itemIdx, 1);
    setFormData(newForm);
  };

  const handleItemChange = (configIdx: number, itemIdx: number, field: string, val: any) => {
    const newForm = [...formData];
    const item: any = newForm[configIdx].salaryComponents[itemIdx];
    if (field === 'code') {
      const def = DEFAULT_COMPONENTS.find(c => c.value === val);
      if (def) {
        item.code = def.value as SalaryComponentCode;
        item.name = def.label;
        item.category = def.category as SalaryComponentCategory;
      }
    } else {
      item[field] = field === 'amount' ? Number(val) : val;
    }
    setFormData(newForm);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[700px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-md">
                  <CircleDollarSign size={18} />
                </span>
                Thông tin lương & Phụ cấp
              </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground">
              Xem và cấu hình các khoản lương, phụ cấp của nhân viên.
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isFetching ? (
            <div className="flex items-center justify-center h-32">
               <span className="animate-pulse text-muted-foreground">Đang tải thông tin...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Chế độ chỉnh sửa</Label>
                  <p className="text-xs text-muted-foreground">Bật để thêm mới hoặc sửa đổi cấu hình lương</p>
                </div>
                <Switch 
                  checked={isEditingMode}
                  onCheckedChange={setIsEditingMode}
                  className="data-[state=unchecked]:bg-slate-300 data-[state=checked]:bg-emerald-600 shadow-inner border border-black/5"
                />
              </div>

              {formData.length === 0 && !isEditingMode ? (
                <div className="text-center p-8 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
                  Nhân viên này chưa có cấu hình lương.
                </div>
              ) : null}

              <div className="space-y-6">
                {formData.map((config, configIdx) => (
                  <div key={configIdx} className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
                    <div className="bg-muted/40 p-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-muted-foreground" />
                        <span className="font-semibold text-sm">Cấu hình {configIdx + 1}</span>
                      </div>
                      {isEditingMode && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2"
                          onClick={() => handleRemoveComponentConfig(configIdx)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Ngày hiệu lực</Label>
                          {isEditingMode ? (
                            <Input
                              type="date"
                              value={config.effectiveFrom}
                              onChange={e => {
                                const newForm = [...formData];
                                newForm[configIdx].effectiveFrom = e.target.value;
                                setFormData(newForm);
                              }}
                              className="bg-background"
                              required
                            />
                          ) : (
                            <div className="text-sm p-2.5 bg-muted/40 rounded-lg">{config.effectiveFrom}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Ghi chú chung</Label>
                          {isEditingMode ? (
                            <Input
                              type="text"
                              value={config.note}
                              onChange={e => {
                                const newForm = [...formData];
                                newForm[configIdx].note = e.target.value;
                                setFormData(newForm);
                              }}
                              placeholder="Ghi chú cấu hình..."
                              className="bg-background"
                            />
                          ) : (
                            <div className="text-sm p-2.5 bg-muted/40 rounded-lg">{config.note || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Danh sách khoản mục</Label>
                          {isEditingMode && (
                            <Button
                              type="button"
                              onClick={() => handleAddDetailItem(configIdx)}
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs flex items-center gap-1 border-dashed"
                            >
                              <Plus size={14} /> Thêm khoản
                            </Button>
                          )}
                        </div>
                        
                        {config.salaryComponents.length > 0 ? (
                          <div className="border border-border rounded-lg overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-muted text-muted-foreground text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2">Loại khoản</th>
                                  <th className="px-3 py-2 w-[180px]">Số tiền (VNĐ)</th>
                                  <th className="px-3 py-2">Ghi chú</th>
                                  {isEditingMode && <th className="px-3 py-2 w-[50px]"></th>}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {config.salaryComponents.map((item, itemIdx) => (
                                  <tr key={itemIdx}>
                                    <td className="px-3 py-2">
                                      {isEditingMode ? (
                                        <select
                                          className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2E3192]"
                                          value={item.code}
                                          onChange={e => handleItemChange(configIdx, itemIdx, 'code', e.target.value)}
                                        >
                                          {DEFAULT_COMPONENTS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <div className="font-medium text-[#1E2062]">{item.name}</div>
                                      )}
                                    </td>
                                    <td className="px-3 py-2">
                                      {isEditingMode ? (
                                        <Input
                                          type="number"
                                          className="h-9"
                                          min={0}
                                          value={item.amount}
                                          onChange={e => handleItemChange(configIdx, itemIdx, 'amount', e.target.value)}
                                          required
                                        />
                                      ) : (
                                        <div className="font-semibold">
                                          {new Intl.NumberFormat('vi-VN').format(item.amount)}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-3 py-2">
                                      {isEditingMode ? (
                                        <Input
                                          type="text"
                                          className="h-9"
                                          placeholder="Ghi chú..."
                                          value={item.note || ""}
                                          onChange={e => handleItemChange(configIdx, itemIdx, 'note', e.target.value)}
                                        />
                                      ) : (
                                        <div className="text-muted-foreground">{item.note || "-"}</div>
                                      )}
                                    </td>
                                    {isEditingMode && (
                                      <td className="px-3 py-2 text-center">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                          onClick={() => handleRemoveDetailItem(configIdx, itemIdx)}
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-sm italic text-muted-foreground p-3 bg-muted/20 rounded-lg text-center">
                            Chưa có khoản mục nào
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isEditingMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddComponentConfig}
                    className="w-full gap-2 border-dashed h-12 text-[#2E3192] hover:bg-[#2E3192]/5 hover:text-[#2E3192]"
                  >
                    <Plus size={18} /> Thêm cấu hình mới
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
            Đóng
          </Button>
          {isEditingMode && (
             <Button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white w-auto px-6 transition-all shadow-md shadow-emerald-500/20" disabled={updateMutation.isPending || isFetching}>
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}
        </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
