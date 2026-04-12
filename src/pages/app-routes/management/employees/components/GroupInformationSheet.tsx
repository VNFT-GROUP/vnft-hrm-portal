import { useState } from "react";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group/groupService";
import { userService } from "@/services/user/userService";
import { SearchableSelect } from "@/components/custom/SearchableSelect";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { UpdateUserGroupRequest } from "@/types/user/UpdateUserGroupRequest";

interface GroupInformationSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string | null;
}

export default function GroupInformationSheet({ isOpen, onOpenChange, userId }: GroupInformationSheetProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<UpdateUserGroupRequest>>({});
  const [isEditingMode, setIsEditingMode] = useState(false);

  // Query: Get Group Information
  const { data: groupInfo, isFetching: isFetchingGroupInfo } = useQuery({
    queryKey: ['userGroupInfo', userId],
    queryFn: () => userService.getGroup(userId!),
    enabled: isOpen && !!userId,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditingMode(false);
      setFormData({});
    }
    onOpenChange(open);
  };

  // Master Data Query
  const { data: groupsData, refetch: refetchGroups, isFetching: isFetchingGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getGroups(),
    enabled: isOpen,
  });

  const groups = groupsData?.data?.map(g => ({ value: g.id, label: g.name })) || [];

  // Mutation: Update Group Information
  const updateGroupMutation = useMutation({
    mutationFn: (data: UpdateUserGroupRequest) => userService.updateGroup(userId!, data),
    onSuccess: () => {
      toast.success(t('management.groupUpdateSuccess'));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userGroupInfo", userId] });
      setIsEditingMode(false);
    },
    onError: () => {
      toast.error(t('management.groupUpdateError'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !groupInfo?.data) return;
    updateGroupMutation.mutate({
      groupId: formData.groupId ?? groupInfo.data.groupId ?? undefined,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[400px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
                <span className="p-1.5 bg-[#1E2062]/10 text-[#1E2062] rounded-md">
                  <Shield size={18} />
                </span>
                {t('management.groupSheetTitle')}
              </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground">
              {t('management.groupSheetDesc')}
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isFetchingGroupInfo ? (
            <div className="flex items-center justify-center h-32">
               <span className="animate-pulse text-muted-foreground">Đang tải thông tin...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">{t('management.editMode')}</Label>
                  <p className="text-xs text-muted-foreground">{t('management.editModeDescGroup')}</p>
                </div>
                <Switch 
                  checked={isEditingMode}
                  onCheckedChange={setIsEditingMode}
                  className="data-[state=unchecked]:bg-slate-300 data-[state=checked]:bg-[#1E2062] shadow-inner border border-black/5"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Users size={14} className="text-muted-foreground"/> {t('management.groupFunctionLabel')}</Label>
                {isEditingMode ? (
                  <SearchableSelect 
                    options={groups}
                    value={formData.groupId ?? groupInfo?.data?.groupId ?? ""}
                    onChange={(val) => setFormData({...formData, groupId: val})}
                    placeholder={t('management.groupPlaceholder')}
                    onRefresh={() => refetchGroups()}
                    isLoading={isFetchingGroups}
                  />
                ) : (
                  <div className="p-3 bg-muted/40 rounded-xl border border-border text-sm font-medium text-foreground min-h-[44px] flex items-center">
                     {groupInfo?.data?.groupName || <span className="text-muted-foreground italic">{t('management.unassignedGroup')}</span>}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all">
            {t('management.btnClose')}
          </Button>
          {isEditingMode && (
            <Button type="submit" className="rounded-xl bg-[#1E2062] hover:bg-[#1E2062]/90 text-white w-auto px-6 transition-all shadow-md" disabled={updateGroupMutation.isPending || isFetchingGroupInfo}>
              {updateGroupMutation.isPending ? t('management.btnSaving') : t('management.btnSave')}
            </Button>
          )}
        </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
