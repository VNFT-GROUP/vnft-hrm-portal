import { useState } from "react";
import { Plus, Search, Briefcase, Edit2, Trash2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";

import PositionTable from "./components/PositionTable";
import PositionFormSheet from "./components/PositionFormSheet";
import type { PositionResponse } from '@/types/position/PositionResponse';
import type { UpsertPositionRequest } from '@/types/position/UpsertPositionRequest';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { positionService } from "@/services/position";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function PositionsPage() {
  const { t } = useTranslation();
  const showPositionLegend = useLayoutStore((state) => state.showRoleLegend);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PositionResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    manager: false,
  });

  const { data: positionsData } = useQuery({
    queryKey: ["positions", searchTerm],
    queryFn: () => positionService.getPositions(searchTerm),
  });

  const positions = positionsData?.data || [];

  const handleOpenForm = (role?: PositionResponse) => {
    if (role) {
      setEditingPosition(role);
      setFormData({
        name: role.name,
        description: role.description || "",
        active: role.active ?? false,
        manager: role.manager ?? false,
      });
    } else {
      setEditingPosition(null);
      setFormData({ name: "", description: "", active: true, manager: false });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertPositionRequest) =>
      positionService.createPosition(data),
    onSuccess: () => {
      toast.success(t("position.createdSuccess"));
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertPositionRequest }) =>
      positionService.updatePosition(id, data),
    onSuccess: () => {
      toast.success(t("position.updatedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => positionService.deletePosition(id),
    onSuccess: () => {
      toast.success(t("position.deletedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;

    // Convert về UpsertPositionRequest
    const payload: UpsertPositionRequest = {
      name: formData.name,
      description: formData.description,
      active: formData.active,
      manager: formData.manager,
    };

    if (editingPosition) {
      updateMutation.mutate({ id: editingPosition.id, data: payload });
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <Briefcase size={28} />
          </span>
          {t("position.title")}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t("position.subtitle")}
        </p>
      </motion.div>

      {/* 1.5 Legend Section */}
      {showPositionLegend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3 text-sm text-muted-foreground w-full shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
            <span className="font-semibold text-[#1E2062] mr-2">
              {t("position.legendTitle")}
            </span>
            <div className="flex items-center gap-2">
              <Edit2 size={16} className="text-[#2E3192]" />
              <span>{t("position.legendEdit")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              <span>{t("position.legendDelete")}</span>
            </div>
            <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
              {t("position.legendHidePrefix")}
              <span className="ml-1 font-mono text-[10px] font-semibold bg-background py-0.5 px-1.5 rounded border border-border shadow-sm">
                Alt + S
              </span>
              {t("position.legendHideSuffix")}
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
            placeholder={t("position.searchPlaceholder")}
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
        >
          <Plus size={20} className="mr-2" /> {t("position.addBtn")}
        </Button>
      </motion.div>

      {/* 4. Main Table Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1"
      >
        <PositionTable
          positions={positions}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Side Form (Sheet) */}
      <PositionFormSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingPosition}
        onSave={handleSave}
      />
    </div>
  );
}
