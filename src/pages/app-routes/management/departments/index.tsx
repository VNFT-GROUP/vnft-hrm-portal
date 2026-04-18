import { useState } from "react";
import { Plus, Search, Building2, Edit2, Trash2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m  } from 'framer-motion';
import { useLayoutStore } from "@/store/useLayoutStore";

import DepartmentTable, { type Department } from "./components/DepartmentTable";
import DepartmentFormSheet from "./components/DepartmentFormSheet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/department";
import { toast } from "sonner";
import type { UpsertDepartmentRequest } from '@/types/department/UpsertDepartmentRequest';
import { useTranslation } from "react-i18next";
import CustomPagination from "@/components/custom/CustomPagination";

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const showDepartmentLegend = useLayoutStore(state => state.showDepartmentLegend);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [formData, setFormData] = useState<{name: string, description: string, active: boolean}>({ 
    name: "", description: "", active: true
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments", searchTerm],
    queryFn: () => departmentService.getDepartments(searchTerm),
  });

  const departments: Department[] = departmentsData?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totalPages = Math.ceil(departments.length / pageSize) || 1;
  const paginatedData = departments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenForm = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({ 
        name: dept.name, 
        description: dept.description || "", 
        active: dept.active ?? false
      });
    } else {
      setEditingDept(null);
      setFormData({ name: "", description: "", active: true });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertDepartmentRequest) => departmentService.createDepartment(data),
    onSuccess: () => {
      toast.success(t("department.createdSuccess"));
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertDepartmentRequest }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: () => {
      toast.success(t("department.updatedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      toast.success(t("department.deletedSuccess"));
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const payload: UpsertDepartmentRequest = {
      name: formData.name,
      description: formData.description,
      active: formData.active,
    };

    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, data: payload });
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
            <Building2 size={28} />
          </span>
          {t("department.title")}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t("department.subtitle")}
        </p>
      </m.div>

      {/* 1.5 Legend Section */}
      {showDepartmentLegend && (
        <m.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3 text-sm text-muted-foreground w-full shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
            <span className="font-semibold text-[#1E2062] mr-2">{t("department.legendTitle")}</span>
            <div className="flex items-center gap-2">
              <Edit2 size={16} className="text-[#2E3192]" />
              <span>{t("department.legendEdit")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              <span>{t("department.legendDelete")}</span>
            </div>
            <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
              {t("department.legendHidePrefix")}<span className="ml-1 font-mono text-[10px] font-semibold bg-background py-0.5 px-1.5 rounded border border-border shadow-sm">Alt + S</span>{t("department.legendHideSuffix")}
            </div>
          </div>
          <div className="w-full h-px bg-border/50 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[#2E3192]">
            <MousePointerClick size={16} />
            <span className="italic">Mẹo: Click chuột phải vào dòng dữ liệu để thao tác nhanh.</span>
          </div>
        </m.div>
      )}

      {/* 2 & 3. Toolbar Section (Tìm Kiếm + Nút tạo) */}
      <m.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder={t("department.searchPlaceholder")} 
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card text-card-foreground transition-colors"
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
          <Plus size={20} className="mr-2" /> {t("department.addBtn")}
        </Button>
      </m.div>

      {/* 4. Main Table Card Section */}
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col"
      >
        <DepartmentTable 
          departments={paginatedData} 
          onEdit={handleOpenForm} 
          onDelete={handleDelete} 
        />
        {departments.length > 0 && (
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
      </m.div>

      {/* Side Form (Sheet) */}
      <DepartmentFormSheet 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingDept}
        onSave={handleSave}
      />
    </div>
  );
}
