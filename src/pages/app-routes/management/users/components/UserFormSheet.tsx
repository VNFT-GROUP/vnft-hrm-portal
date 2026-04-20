import { useState, useEffect } from "react";
import { UserPlus, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { employeeCodeService } from "@/services/employeeCode";
import { roleService } from "@/services/role/roleService";
import { groupService } from "@/services/group/groupService";
import type { CreateUserRequest } from '@/types/user/CreateUserRequest';

interface UserFormSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: CreateUserRequest) => void;
  isPending?: boolean;
}

export default function UserFormSheet({
  isOpen,
  onOpenChange,
  onSave,
  isPending = false,
}: UserFormSheetProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    password: "",
    fullName: "",
    englishName: "",
    employeeCodeId: "",
    groupId: "",
    annualLeaveBalance: 12,
    wfhBalance: 6,
  });

  // Reset form khi mở Sheet
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setFormData({
          username: "",
          password: "",
          fullName: "",
          englishName: "",
          employeeCodeId: "",
          groupId: "",
          annualLeaveBalance: 12,
          wfhBalance: 6,
        });
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Lấy danh sách Employee Codes từ server
  const { data: codesData, isLoading: isLoadingCodes } = useQuery({
    queryKey: ["employee-codes"],
    queryFn: () => employeeCodeService.getEmployeeCodes(),
    enabled: isOpen, // Chỉ fetch khi form được mở
  });

  // Lấy danh sách Roles từ server
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => roleService.getRoles(),
    enabled: isOpen,
  });

  // Lấy danh sách Groups
  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.getGroups(),
    enabled: isOpen,
  });

  const employeeCodes = codesData?.data || [];
  // Lọc ra các mã đang active (nếu cần)
  const activeCodes = employeeCodes.filter((c) => c.active);

  const roles = rolesData?.data || [];
  const activeRoles = roles.filter((r) => r.active !== false);

  const groups = groupsData?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.password ||
      !formData.fullName ||
      !formData.englishName ||
      !formData.employeeCodeId ||
      !formData.groupId
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Mật khẩu phải từ 8 ký tự trở lên!");
      return;
    }
    onSave(formData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <UserPlus size={18} />
              </span>
              Tạo tài khoản hệ thống mới
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Điền các thông tin bảo mật để khởi tạo người dùng trong hệ thống
              VNFT.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Username <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        username: e.target.value.trim(),
                      })
                    }
                    placeholder="Nhập tên đăng nhập"
                    className="rounded-xl pl-9 border-border focus-visible:ring-[#2E3192]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Mật khẩu <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="•••••••• (Tối thiểu 8 ký tự)"
                    className="rounded-xl pl-9 border-border focus-visible:ring-[#2E3192]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Họ và tên <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Nhập họ và tên đầy đủ"
                  className="rounded-xl border-border focus-visible:ring-[#2E3192]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Tên Tiếng Anh <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={formData.englishName}
                  onChange={(e) =>
                    setFormData({ ...formData, englishName: e.target.value })
                  }
                  placeholder="Nhập tên Tiếng Anh"
                  className="rounded-xl border-border focus-visible:ring-[#2E3192]"
                />
              </div>

              <div className="space-y-2 pb-2">
                <Label className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span>
                    Mã Employee Code <span className="text-rose-500">*</span>
                  </span>
                  {isLoadingCodes && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Đang tải...
                    </span>
                  )}
                </Label>
                <Select
                  value={formData.employeeCodeId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, employeeCodeId: val || "" })
                  }
                  disabled={isLoadingCodes}
                >
                  <SelectTrigger className="rounded-xl border-border focus:ring-[#2E3192]">
                    <SelectValue placeholder="-- Chọn một mã Employee Code --" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCodes.map((code) => (
                      <SelectItem key={code.id} value={code.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1E2062]">
                            {code.prefix}
                          </span>
                          {code.description ? (
                            <span className="text-xs text-muted-foreground">
                              - {code.description}
                            </span>
                          ) : null}
                        </div>
                      </SelectItem>
                    ))}
                    {activeCodes.length === 0 && !isLoadingCodes && (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        Không có mã nào đang hoạt động
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Mã này sẽ được gắn cố định với Employee Code của cơ sở tương
                  ứng.
                </p>
              </div>

              <div className="space-y-2 pb-2">
                <Label className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span>
                    Nhóm / Phân quyền <span className="text-rose-500">*</span>
                  </span>
                  {isLoadingGroups && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Đang tải...
                    </span>
                  )}
                </Label>
                <Select
                  value={formData.groupId || ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, groupId: val || "" })
                  }
                  disabled={isLoadingGroups}
                >
                  <SelectTrigger className="rounded-xl border-border focus:ring-[#2E3192]">
                    <SelectValue placeholder="-- Chọn nhóm phân quyền --" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1E2062]">
                            {group.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    {groups.length === 0 && !isLoadingGroups && (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        Không có nhóm phân quyền nào
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pb-2">
                <Label className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span>
                    Chức vụ
                  </span>
                  {isLoadingRoles && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Đang tải...
                    </span>
                  )}
                </Label>
                <Select
                  value={formData.roleId || ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, roleId: val || undefined })
                  }
                  disabled={isLoadingRoles}
                >
                  <SelectTrigger className="rounded-xl border-border focus:ring-[#2E3192]">
                    <SelectValue placeholder="-- Chọn một chức vụ --" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1E2062]">
                            {role.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    {activeRoles.length === 0 && !isLoadingRoles && (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        Không có chức vụ nào
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-t border-slate-100 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Ngày phép năm (Annual Leave)
                  </Label>
                  <Input
                    type="number"
                    value={formData.annualLeaveBalance}
                    onChange={(e) =>
                      setFormData({ ...formData, annualLeaveBalance: Number(e.target.value) })
                    }
                    className="rounded-xl border-border focus-visible:ring-[#2E3192]"
                    min={0}
                  />
                  <p className="text-[11.5px] text-muted-foreground leading-tight">
                    Mặc định: 12 ngày. Đi trễ quá 2h từ lần thứ 3 trong tháng sẽ bị trừ 0.5 phép/lần.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Ngày làm từ xa (WFH)
                  </Label>
                  <Input
                    type="number"
                    value={formData.wfhBalance}
                    onChange={(e) =>
                      setFormData({ ...formData, wfhBalance: Number(e.target.value) })
                    }
                    className="rounded-xl border-border focus-visible:ring-[#2E3192]"
                    min={0}
                  />
                  <p className="text-[11.5px] text-muted-foreground leading-tight">
                    Mặc định: 6 ngày/năm (cho Back Office, Sales, MKT). Dùng lố trừ vào phép năm.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border shrink-0 bg-card flex justify-end gap-3 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border text-muted-foreground hover:bg-muted w-28 transition-all"
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white px-6 transition-all shadow-md shadow-[#2E3192]/20"
              disabled={
                isPending ||
                !formData.username ||
                !formData.password ||
                !formData.fullName ||
                !formData.englishName ||
                !formData.employeeCodeId ||
                !formData.groupId
              }
            >
              {isPending ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
