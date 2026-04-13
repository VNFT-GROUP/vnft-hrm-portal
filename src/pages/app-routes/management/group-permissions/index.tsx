import { useState } from "react";
import { Plus, Search, Shield, Edit2, Trash2, Loader2, MousePointerClick } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";

import GroupPermissionTable from "./components/GroupPermissionTable";
import GroupPermissionFormSheet from "./components/GroupPermissionFormSheet";
import type { GroupPermissionResponse } from '@/types/group/GroupPermissionResponse';
import type { UpsertGroupPermissionRequest } from '@/types/group/UpsertGroupPermissionRequest';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupPermissionService } from "@/services/group/groupPermissionService";
import { toast } from "sonner";

export default function GroupPermissionsPage() {
  const { t } = useTranslation();
  const showRoleLegend = useLayoutStore((state) => state.showRoleLegend);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroupPermissionResponse | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    active: true,
  });

  const { data: qData, isLoading } = useQuery({
    queryKey: ["group-permissions", searchTerm],
    queryFn: () => groupPermissionService.getGroupPermissions(searchTerm),
  });

  const items = qData?.data || [];

  const handleOpenForm = (item?: GroupPermissionResponse) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code: item.code,
        description: item.description || "",
        active: item.active ?? true,
      });
    } else {
      setEditingItem(null);
      setFormData({ code: "", description: "", active: true });
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
      description: formData.description || undefined,
      active: formData.active,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto min-h-full flex flex-col gap-6 md:gap-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <Shield size={28} />
          </span>
          {t('management.groupPermsTitle', { defaultValue: 'Danh Sách Mã Quyền' })}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t('management.groupPermsDesc', { defaultValue: 'Quản lý danh sách các mã quyền chi tiết của hệ thống.' })}
        </p>
      </motion.div>

      {/* Legend Section */}
      {showRoleLegend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3 text-sm text-muted-foreground w-full shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
            <span className="font-semibold text-[#1E2062] mr-2">
              {t('management.actionLegend', { defaultValue: 'Chú thích thao tác:' })}
            </span>
            <div className="flex items-center gap-2">
              <Edit2 size={16} className="text-[#2E3192]" />
              <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              <span>{t('management.deleteLegend', { defaultValue: 'Xóa / Hủy kích hoạt' })}</span>
            </div>
            <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
              {t('management.hideLegendHint', { defaultValue: 'Nhấn Alt + S để bật tắt mục này' })}
            </div>
          </div>
          <div className="w-full h-px bg-border/50 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[#2E3192]">
            <MousePointerClick size={16} />
            <span className="italic">{t('management.actionTooltip', { defaultValue: 'Mẹo: Click chuột phải vào dòng dữ liệu để thao tác nhanh.' })}</span>
          </div>
        </motion.div>
      )}

      {/* Toolbar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder={t('management.searchPermPlaceholder', { defaultValue: 'Tìm kiếm mã quyền...' })}
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <Plus size={20} className="mr-2" /> {t('management.addPerm', { defaultValue: 'Thêm Mã Quyền' })}
        </Button>
      </motion.div>

      {/* Main Table Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden md:min-h-[400px] flex-1 flex flex-col group hover:shadow-md transition-shadow duration-300"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground h-64">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#2E3192]" />
            <p className="animate-pulse">Đang tải danh sách phân quyền...</p>
          </div>
        ) : (
          <GroupPermissionTable
            items={items}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      {/* Side Form (Sheet) */}
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
