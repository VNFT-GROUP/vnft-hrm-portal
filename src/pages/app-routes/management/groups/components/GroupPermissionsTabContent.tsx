import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m  } from 'framer-motion';
import GroupPermissionTable from "./GroupPermissionTable";
import GroupPermissionFormSheet from "./GroupPermissionFormSheet";
import type { GroupPermissionResponse } from '@/types/group/GroupPermissionResponse';
import type { UpsertGroupPermissionRequest } from '@/types/group/UpsertGroupPermissionRequest';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupPermissionService } from "@/services/group/groupPermissionService";
import { toast } from "sonner";
import CustomPagination from "@/components/custom/CustomPagination";

export default function GroupPermissionsTabContent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroupPermissionResponse | null>(null);

  const [formData, setFormData] = useState<{
    code: string;
    category?: string;
    description: string;
    active: boolean;
  }>({
    code: "",
    category: "",
    description: "",
    active: true,
  });

  const { data: qData, isLoading } = useQuery({
    queryKey: ["group-permissions", searchTerm],
    queryFn: () => groupPermissionService.getGroupPermissions(searchTerm),
  });

  const items = qData?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const paginatedData = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenForm = (item?: GroupPermissionResponse) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code: item.code,
        category: item.category || "",
        description: item.description || "",
        active: item.active ?? true,
      });
    } else {
      setEditingItem(null);
      setFormData({ code: "", category: "", description: "", active: true });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertGroupPermissionRequest) =>
      groupPermissionService.createGroupPermission(data),
    onSuccess: () => {
      toast.success("Thêm mã quyền thành công!");
      queryClient.invalidateQueries({ queryKey: ["group-permissions"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Thêm mã quyền thất bại!");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertGroupPermissionRequest }) =>
      groupPermissionService.updateGroupPermission(id, data),
    onSuccess: () => {
      toast.success("Cập nhật mã quyền thành công!");
      queryClient.invalidateQueries({ queryKey: ["group-permissions"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Cập nhật mã quyền thất bại!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupPermissionService.deleteGroupPermission(id),
    onSuccess: () => {
      toast.success("Xóa/Tạm ngưng mã quyền thành công!");
      queryClient.invalidateQueries({ queryKey: ["group-permissions"] });
    },
    onError: () => {
      toast.error("Xóa mã quyền thất bại!");
    }
  });

  const handleSave = () => {
    if (!formData.code.trim()) return;
    const payload: UpsertGroupPermissionRequest = {
      code: formData.code,
      category: formData.category || undefined,
      description: formData.description || undefined,
      active: formData.active,
    };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
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
            placeholder={t('management.searchPermPlaceholder', { defaultValue: 'Tìm kiếm mã quyền...' })}
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
          <Plus size={20} className="mr-2" /> {t('management.addPerm', { defaultValue: 'Thêm Mã Quyền' })}
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
            <p className="animate-pulse">Đang tải danh sách phân quyền...</p>
          </div>
        ) : (
          <>
            <GroupPermissionTable items={paginatedData} onEdit={handleOpenForm} onDelete={(id) => deleteMutation.mutate(id)} />
            {items.length > 0 && (
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

      <GroupPermissionFormSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingItem}
        onSave={handleSave}
      />
    </div>
  );
}
