import { useState } from "react";
import { Plus, Search, Layers, Edit2, Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m  } from 'framer-motion';
import { useLayoutStore } from "@/store/useLayoutStore";

import RoleTable from "./components/RoleTable";
import RoleFormSheet from "./components/RoleFormSheet";
import type { RoleResponse } from '@/types/role/RoleResponse';
import type { UpsertRoleRequest } from '@/types/role/UpsertRoleRequest';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/role/roleService";
import { toast } from "sonner";
import CustomPagination from "@/components/custom/CustomPagination";

export default function RolesPage() {
  const { t } = useTranslation();
  const showRoleLegend = useLayoutStore((state) => state.showRoleLegend);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["roles", searchTerm],
    queryFn: () => roleService.getRoles(searchTerm),
  });

  const roles = rolesData?.data || [];
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totalPages = Math.ceil(roles.length / pageSize) || 1;
  const paginatedData = roles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenForm = (role?: RoleResponse) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || "",
        active: role.active ?? true,
      });
    } else {
      setEditingRole(null);
      setFormData({ name: "", description: "", active: true });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertRoleRequest) =>
      roleService.createRole(data),
    onSuccess: () => {
      toast.success(t('management.createRoleSuccess', { defaultValue: 'Thêm chức vụ thành công!' }));
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error(t('management.createRoleError', { defaultValue: 'Thêm chức vụ thất bại!' }));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertRoleRequest }) =>
      roleService.updateRole(id, data),
    onSuccess: () => {
      toast.success(t('management.updateRoleSuccess', { defaultValue: 'Cập nhật chức vụ thành công!' }));
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error(t('management.updateRoleError', { defaultValue: 'Cập nhật chức vụ thất bại!' }));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      toast.success(t('management.deleteRoleSuccess', { defaultValue: 'Xóa/Tạm ngưng chức vụ thành công!' }));
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      toast.error(t('management.deleteRoleError', { defaultValue: 'Xóa chức vụ thất bại!' }));
    }
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const payload: UpsertRoleRequest = {
      name: formData.name,
      description: formData.description || undefined,
      active: formData.active,
    };

    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

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
            <Layers size={28} />
          </span>
          {t('management.rolesTitle', { defaultValue: 'Danh Sách Chức Vụ' })}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t('management.rolesDesc', { defaultValue: 'Quản lý danh sách master data các chức vụ trong hệ thống.' })}
        </p>
      </m.div>

      {/* 1.5 Legend Section */}
      {showRoleLegend && (
        <m.div
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
          </div>
        </m.div>
      )}

      {/* 2 & 3. Toolbar Section */}
      <m.div
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
            placeholder={t('management.searchRolePlaceholder', { defaultValue: 'Tìm kiếm chức vụ theo tên...' })}
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
          <Plus size={20} className="mr-2" /> {t('management.addRole', { defaultValue: 'Thêm Chức Vụ' })}
        </Button>
      </m.div>

      {/* 4. Main Table Card Section */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground h-64">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#2E3192]" />
            <p className="animate-pulse">Đang tải danh sách chức vụ...</p>
          </div>
        ) : (
          <>
            <RoleTable
              roles={paginatedData}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
            />
            {roles.length > 0 && (
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

      {/* Side Form (Sheet) */}
      <RoleFormSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingRole}
        onSave={handleSave}
      />
    </div>
  );
}
