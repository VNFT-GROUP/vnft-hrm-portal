import { useEffect, useState } from "react";
import { Briefcase, Building2, Layers, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/department";
import { positionService } from "@/services/position";
import { roleService } from "@/services/role/roleService";
import { userService } from "@/services/user/userService";
import { SearchableSelect } from "@/components/custom/SearchableSelect";
import { toast } from "sonner";
import type { UpdateUserWorkInformationRequest } from "@/types/user/UpdateUserWorkInformationRequest";

interface WorkInformationSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string | null;
}

export default function WorkInformationSheet({ isOpen, onOpenChange, userId }: WorkInformationSheetProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateUserWorkInformationRequest>({
    departmentId: "",
    positionId: "",
    roleId: "",
  });

  // Query: Get Work Information
  const { data: workInfo, isFetching: isFetchingWorkInfo } = useQuery({
    queryKey: ['workInfo', userId],
    queryFn: () => userService.getWorkInformation(userId!),
    enabled: isOpen && !!userId,
  });

  // Populate form when data arrives
  useEffect(() => {
    if (workInfo?.data) {
      setFormData({
        departmentId: workInfo.data.departmentId || "",
        positionId: workInfo.data.positionId || "",
        roleId: workInfo.data.roleId || "",
      });
    } else if (!isOpen) {
      setFormData({
        departmentId: "",
        positionId: "",
        roleId: "",
      });
    }
  }, [workInfo, isOpen]);

  // Master Data Queries
  const { data: deptsData, refetch: refetchDepts, isFetching: isFetchingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
    enabled: isOpen,
  });

  const { data: posData, refetch: refetchPositions, isFetching: isFetchingPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => positionService.getPositions(),
    enabled: isOpen,
  });

  const { data: rolesData, refetch: refetchRoles, isFetching: isFetchingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
    enabled: isOpen,
  });

  const departments = deptsData?.data?.map(d => ({ value: d.id, label: d.name })) || [];
  const positions = posData?.data?.map(p => ({ value: p.id, label: p.name })) || [];
  const roles = rolesData?.data?.filter(r => r.active !== false).map(r => ({ value: r.id, label: r.name })) || [];

  // Mutation: Update Work Information
  const updateWorkInfoMutation = useMutation({
    mutationFn: (data: UpdateUserWorkInformationRequest) => userService.updateWorkInformation(userId!, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin công việc thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["workInfo", userId] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi cập nhật thông tin công việc.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    updateWorkInfoMutation.mutate({
      departmentId: formData.departmentId || undefined,
      positionId: formData.positionId || undefined,
      roleId: formData.roleId || undefined,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
              <span className="p-1.5 bg-[#2E3192]/10 text-[#2E3192] rounded-md">
                <Briefcase size={18} />
              </span>
              Tùy chỉnh thông tin công việc
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Cập nhật phòng ban, vị trí và chức vụ hệ thống hiện tại của nhân viên.
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isFetchingWorkInfo ? (
            <div className="flex items-center justify-center h-32">
              <span className="animate-pulse text-muted-foreground">Đang tải thông tin...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Building2 size={14} className="text-muted-foreground"/> Phòng ban</Label>
                <SearchableSelect 
                  options={departments}
                  value={formData.departmentId || ""}
                  onChange={(val) => setFormData({...formData, departmentId: val})}
                  placeholder="-- Chọn phòng ban --"
                  onRefresh={() => refetchDepts()}
                  isLoading={isFetchingDepts}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><MapPin size={14} className="text-muted-foreground"/> Vị trí</Label>
                <SearchableSelect 
                  options={positions}
                  value={formData.positionId || ""}
                  onChange={(val) => setFormData({...formData, positionId: val})}
                  placeholder="-- Chọn vị trí --"
                  onRefresh={() => refetchPositions()}
                  isLoading={isFetchingPositions}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Layers size={14} className="text-muted-foreground"/> Chức vụ hệ thống (Phân quyền)</Label>
                <SearchableSelect 
                  options={roles}
                  value={formData.roleId || ""}
                  onChange={(val) => setFormData({...formData, roleId: val})}
                  placeholder="-- Chọn chức vụ (role) --"
                  onRefresh={() => refetchRoles()}
                  isLoading={isFetchingRoles}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
           <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
             Hủy
           </Button>
           <Button type="submit" className="rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white w-auto px-6 transition-all shadow-md shadow-[#2E3192]/20" disabled={updateWorkInfoMutation.isPending || isFetchingWorkInfo}>
             {updateWorkInfoMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
           </Button>
        </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
