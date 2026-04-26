import { useState, useCallback } from "react";
import { m } from "framer-motion";
import { toast } from "sonner";
import { Link2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useSalesmanMappings,
  useDeleteSalesmanMapping,
} from "@/hooks/useSalesmanMappings";
import type { ProfitReportSalesmanMappingResponse } from "@/types/profit-report/SalesmanMappingResponse";

import SalesmanMappingFormModal from "../components/SalesmanMappingFormModal";
import SalesmanMappingTable from "./components/SalesmanMappingTable";

export default function SalesmanMappingPage() {  // ---- Filter state ----
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // ---- Modal state ----
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProfitReportSalesmanMappingResponse | null>(null);

  // ---- Query & Mutations ----
  const { data: mappings = [], isLoading } = useSalesmanMappings({
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteSalesmanMapping();

  // ---- Handlers ----
  const handleCreate = useCallback(() => {
    setEditing(null);
    setFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: ProfitReportSalesmanMappingResponse) => {
    setEditing(item);
    setFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((item: ProfitReportSalesmanMappingResponse) => {
    toast.promise(
      deleteMutation.mutateAsync(item.id),
      {
        loading: `Đang xóa mapping "${item.salesmanName}"…`,
        success: `Đã xóa mapping "${item.salesmanName}"`,
        error: (err: unknown) => getErrorMessage(err, "Lỗi khi xóa mapping"),
      },
    );
  }, [deleteMutation]);

  return (
    <div className="p-4 md:p-6 w-full min-h-full flex flex-col gap-6">
      {/* ===== HEADER ===== */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
            <span className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <Link2 size={28} />
            </span>
            Đối chiếu nhân viên
          </h1>
        </div>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          Quản lý alias salesman để Profit Report map đúng nhân viên — đây là nguồn duy nhất để matching
        </p>
      </m.div>

      {/* ===== TOOLBAR ===== */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-4 md:p-5 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="relative flex-1 min-w-[250px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm theo tên salesman…"
            className="pl-10 h-10 rounded-xl bg-muted border-none focus-visible:ring-1 focus-visible:ring-[#2E3192]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          onClick={handleCreate}
          className="h-10 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md transition-all font-semibold"
        >
          <Plus size={16} className="mr-2" />
          Tạo Mapping
        </Button>
      </m.div>

      {/* ===== TABLE ===== */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col relative min-h-[400px] flex-1"
      >
        <SalesmanMappingTable
          data={mappings}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </m.div>

      {/* ===== FORM MODAL ===== */}
      <SalesmanMappingFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        editing={editing}
      />
    </div>
  );
}
