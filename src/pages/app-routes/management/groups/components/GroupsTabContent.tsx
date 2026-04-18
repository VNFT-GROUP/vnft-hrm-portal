import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m  } from 'framer-motion';
import GroupTable from "./GroupTable";
import GroupFormSheet from "./GroupFormSheet";
import type { GroupResponse } from '@/types/group/GroupResponse';
import type { UpsertGroupRequest } from '@/types/group/UpsertGroupRequest';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group/groupService";
import { groupPermissionService } from "@/services/group/groupPermissionService";
import { toast } from "sonner";
import CustomPagination from "@/components/custom/CustomPagination";

export default function GroupsTabContent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    active: boolean;
    groupPermissionIds: string[];
  }>({
    name: "",
    description: "",
    active: true,
    groupPermissionIds: [],
  });

  const { data: permissionsData } = useQuery({
    queryKey: ["group-permissions-all"],
    queryFn: () => groupPermissionService.getGroupPermissions(""),
  });
  const availablePermissions = permissionsData?.data || [];

  const { data: groupsData, isLoading } = useQuery({
    queryKey: ["groups", searchTerm],
    queryFn: () => groupService.getGroups(searchTerm),
  });

  const groups = groupsData?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totalPages = Math.ceil(groups.length / pageSize) || 1;
  const paginatedData = groups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenForm = (group?: GroupResponse) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        description: group.description || "",
        active: group.active ?? true,
        groupPermissionIds: group.groupPermissions?.map(p => p.id) || [],
      });
    } else {
      setEditingGroup(null);
      setFormData({ name: "", description: "", active: true, groupPermissionIds: [] });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertGroupRequest) => groupService.createGroup(data),
    onSuccess: () => {
      toast.success(t("management.createGroupSuccess", "Thêm nhóm người dùng thành công!"));
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error(t("management.createGroupError", "Thêm nhóm người dùng thất bại!"));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertGroupRequest }) =>
      groupService.updateGroup(id, data),
    onSuccess: () => {
      toast.success(t("management.updateGroupSuccess", "Cập nhật nhóm người dùng thành công!"));
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error(t("management.updateGroupError", "Cập nhật nhóm người dùng thất bại!"));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupService.deleteGroup(id),
    onSuccess: () => {
      toast.success(t("management.deleteGroupSuccess", "Xóa/Tạm ngưng nhóm người dùng thành công!"));
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => {
      toast.error(t("management.deleteGroupError", "Xóa nhóm người dùng thất bại!"));
    }
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;
    const payload: UpsertGroupRequest = {
      name: formData.name,
      description: formData.description || undefined,
      groupPermissionIds: formData.groupPermissionIds,
      active: formData.active,
    };
    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder={t('management.searchGroupPlaceholder', { defaultValue: 'Tìm kiếm nhóm theo tên...' })}
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card transition-colors"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <Plus size={20} className="mr-2" /> {t('management.addGroup', { defaultValue: 'Thêm nhóm người dùng' })}
        </Button>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden md:min-h-[400px] flex-1 flex flex-col group hover:shadow-md transition-shadow duration-300"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground h-64">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#2E3192]" />
            <p className="animate-pulse">{t("management.fetchingGroups", "Đang tải danh sách nhóm người dùng...")}</p>
          </div>
        ) : (
          <>
            <GroupTable groups={paginatedData} onEdit={handleOpenForm} onDelete={(id) => deleteMutation.mutate(id)} />
            {groups.length > 0 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className="p-4 border-t border-border mt-auto"
              />
            )}
          </>
        )}
      </m.div>

      <GroupFormSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingGroup}
        onSave={handleSave}
        availablePermissions={availablePermissions}
      />
    </div>
  );
}
