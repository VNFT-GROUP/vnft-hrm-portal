import { useState } from "react";
import { CircleDollarSign, Plus, Trash2, ChevronDown, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { UpdateUserCompensationsRequest } from "@/types/user/salary/UpdateUserCompensationsRequest";
import type { UserCompensationRequest } from "@/types/user/salary/UserCompensationRequest";
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
  const [formData, setFormData] = useState<UserCompensationRequest[]>([]);
  const [expandedConfigs, setExpandedConfigs] = useState<number[]>([]);

  const { data: salaryData, isFetching } = useQuery({
    queryKey: ['userCompensations', userId],
    queryFn: () => userService.getCompensations(userId!),
    enabled: isOpen && !!userId,
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const currentDataString = salaryData?.data ? JSON.stringify(salaryData.data) : '';
  const [prevDataString, setPrevDataString] = useState<string>('');
  const [prevSortOrder, setPrevSortOrder] = useState<'asc' | 'desc'>('asc');

  if ((currentDataString !== prevDataString || sortOrder !== prevSortOrder) && !isFetching) {
    setPrevDataString(currentDataString);
    setPrevSortOrder(sortOrder);
    if (salaryData?.data) {
      const sortedData = [...salaryData.data].sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });

      setFormData(
        sortedData.map(config => ({
          effectiveFrom: config.effectiveFrom,
          note: config.note || "",
          compensationItems: config.compensationItems.map(item => ({
            code: item.code,
            name: item.name,
            category: item.category,
            amount: item.amount,
            note: item.note || ""
          }))
        }))
      );
    } else {
      setFormData([]);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditingMode(false);
    }
    onOpenChange(open);
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserCompensationsRequest) => userService.updateCompensations(userId!, data),
    onSuccess: () => {
      toast.success(t('management.updateSalarySuccess', { defaultValue: 'Cập nhật thông tin lương thành công!' }));
      queryClient.invalidateQueries({ queryKey: ["userCompensations", userId] });
      setIsEditingMode(false);
    },
    onError: () => {
      toast.error(t('management.updateSalaryError', { defaultValue: 'Đã có lỗi xảy ra khi cập nhật thông tin lương.' }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    updateMutation.mutate({ compensations: formData });
  };

  const handleAddComponentConfig = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setFormData([
      ...formData,
      { effectiveFrom: today, note: "", compensationItems: [] }
    ]);
    setExpandedConfigs(prev => [...prev, formData.length]);
  };

  const handleRemoveComponentConfig = (idx: number) => {
    const newForm = [...formData];
    newForm.splice(idx, 1);
    setFormData(newForm);
  };

  const handleAddDetailItem = (configIdx: number) => {
    const newForm = [...formData];
    newForm[configIdx].compensationItems.push({
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
    newForm[configIdx].compensationItems.splice(itemIdx, 1);
    setFormData(newForm);
  };

  const handleItemChange = (configIdx: number, itemIdx: number, field: string, val: string | number) => {
    const newForm = [...formData];
    const item = newForm[configIdx].compensationItems[itemIdx];
    if (field === 'code') {
      const def = DEFAULT_COMPONENTS.find(c => c.value === val);
      if (def) {
        item.code = def.value as SalaryComponentCode;
        item.name = def.label;
        item.category = def.category as SalaryComponentCategory;
      }
    } else if (field === 'amount') {
      item.amount = Number(val);
    } else if (field === 'note') {
      item.note = String(val);
    }
    setFormData(newForm);
  };

  const toggleConfig = (idx: number) => {
    setExpandedConfigs(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Chế độ chỉnh sửa</Label>
                    <p className="text-xs text-muted-foreground">Bật để thêm mới hoặc sửa đổi cấu hình lương</p>
                  </div>
                  <Switch 
                    checked={isEditingMode}
                    onCheckedChange={setIsEditingMode}
                    className="data-[state=unchecked]:bg-slate-300 data-[state=checked]:bg-emerald-600 shadow-inner border border-black/5 mr-4"
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="h-8 gap-2 text-xs"
                  disabled={isEditingMode}
                >
                  <ArrowUpDown size={14} />
                  Sắp xếp: {sortOrder === 'asc' ? 'Cũ nhất' : 'Mới nhất'}
                </Button>
              </div>

              {formData.length === 0 && !isEditingMode ? (
                <div className="text-center p-8 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
                  Nhân viên này chưa có cấu hình lương.
                </div>
              ) : null}

              <div className="space-y-6">
                {formData.map((config, configIdx) => {
                  const isExpanded = expandedConfigs.includes(configIdx);
                  return (
                  <div key={configIdx} className="bg-card border border-border shadow-sm rounded-xl overflow-hidden p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
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
                      
                      {isEditingMode && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 mt-[26px] p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                          onClick={() => handleRemoveComponentConfig(configIdx)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>

                    <div 
                      className="flex items-center justify-between py-3 mt-4 border-t border-border cursor-pointer text-[#2E3192] hover:text-[#1E2062] transition-colors"
                      onClick={() => toggleConfig(configIdx)}
                    >
                      <span className="text-sm font-semibold">Danh sách khoản mục ({config.compensationItems.length})</span>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex items-center justify-between mb-3">
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
                        
                        {config.compensationItems.length > 0 ? (
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
                                {config.compensationItems.map((item, itemIdx) => (
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
                                          type="text"
                                          className="h-9"
                                          value={item.amount ? new Intl.NumberFormat('vi-VN').format(Number(item.amount)) : ""}
                                          onChange={e => {
                                            const rawValue = e.target.value.replace(/\D/g, '');
                                            handleItemChange(configIdx, itemIdx, 'amount', rawValue ? parseInt(rawValue, 10) : 0);
                                          }}
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
                    )}
                  </div>
                );
              })}
                
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
