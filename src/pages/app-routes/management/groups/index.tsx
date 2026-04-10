import { useState } from "react";
import { Plus, Search, ShieldCheck, Edit2, Trash2, Loader2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";

import GroupTable from "./components/GroupTable";
import GroupFormSheet from "./components/GroupFormSheet";
import type { GroupResponse } from "@/types/response/group/GroupResponse";
import type { UpsertGroupRequest } from "@/types/request/group/UpsertGroupRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group/groupService";
import { toast } from "sonner";

export default function GroupsPage() {
  const showRoleLegend = useLayoutStore((state) => state.showRoleLegend);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  const { data: groupsData, isLoading } = useQuery({
    queryKey: ["groups", searchTerm],
    queryFn: () => groupService.getGroups(searchTerm),
  });

  const groups = groupsData?.data || [];

  const handleOpenForm = (group?: GroupResponse) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        description: group.description || "",
        active: group.active ?? true,
      });
    } else {
      setEditingGroup(null);
      setFormData({ name: "", description: "", active: true });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertGroupRequest) =>
      groupService.createGroup(data),
    onSuccess: () => {
      toast.success("Thêm nhóm thành công!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Thêm nhóm thất bại!");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertGroupRequest }) =>
      groupService.updateGroup(id, data),
    onSuccess: () => {
      toast.success("Cập nhật nhóm thành công!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Cập nhật nhóm thất bại!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupService.deleteGroup(id),
    onSuccess: () => {
      toast.success("Xóa/Tạm ngưng nhóm thành công!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => {
      toast.error("Xóa nhóm thất bại!");
    }
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const payload: UpsertGroupRequest = {
      name: formData.name,
      description: formData.description || undefined,
      active: formData.active,
    };

    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <ShieldCheck size={28} />
          </span>
          Danh Sách Nhóm
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          Quản lý danh sách các nhóm quyền của người dùng trong hệ thống.
        </p>
      </motion.div>

      {/* 1.5 Legend Section */}
      {showRoleLegend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3 text-sm text-muted-foreground w-full shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
            <span className="font-semibold text-[#1E2062] mr-2">
              Chú thích thao tác:
            </span>
            <div className="flex items-center gap-2">
              <Edit2 size={16} className="text-[#2E3192]" />
              <span>Chỉnh sửa thông tin</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              <span>Xóa / Hủy kích hoạt</span>
            </div>
            <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
              Nhấn <span className="mx-1 font-mono text-[10px] font-semibold bg-background py-0.5 px-1.5 rounded border border-border shadow-sm">Alt + S</span> để bật tắt mục này.
            </div>
          </div>
          <div className="w-full h-px bg-border/50 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[#2E3192]">
            <MousePointerClick size={16} />
            <span className="italic">Mẹo: Click chuột phải vào dòng dữ liệu để thao tác nhanh.</span>
          </div>
        </motion.div>
      )}

      {/* 2 & 3. Toolbar Section (Tìm Kiếm + Nút tạo) */}
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
            placeholder="Tìm kiếm nhóm theo tên..."
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <Plus size={20} className="mr-2" /> Thêm Nhóm
        </Button>
      </motion.div>

      {/* 4. Main Table Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground h-64">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#2E3192]" />
            <p className="animate-pulse">Đang tải danh sách nhóm...</p>
          </div>
        ) : (
          <GroupTable
            groups={groups}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      {/* Side Form (Sheet) */}
      <GroupFormSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingGroup}
        onSave={handleSave}
      />
    </div>
  );
}
