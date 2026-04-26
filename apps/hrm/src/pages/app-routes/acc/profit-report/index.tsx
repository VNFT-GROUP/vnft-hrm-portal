import { useState, useCallback } from "react";
import { m } from "framer-motion";
import { toast } from "sonner";
import { TrendingUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useProfitReports,
  useImportProfitReport,
  useDeleteProfitReport,
} from "@/hooks/useProfitReports";
import type {
  ProfitReportCurrency,
  ProfitReportMatchStatus,
  ProfitReportImportResponse,
  ProfitReportDeleteResponse,
} from "@/types/profit-report/ProfitReportResponse";

import ProfitReportImportPanel from "./components/ProfitReportImportPanel";
import ProfitReportImportSummary from "./components/ProfitReportImportSummary";
import ProfitReportTable from "./components/ProfitReportTable";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import SalesmanMappingFormModal from "./components/SalesmanMappingFormModal";

const now = new Date();

export default function ProfitReportPage() {
  const navigate = useNavigate();

  // ---- Filter state ----
  const [month, setMonth] = useState(() => now.getMonth() + 1);
  const [year, setYear] = useState(() => now.getFullYear());
  const [currency, setCurrency] = useState<ProfitReportCurrency>("VND");
  const [salesman, setSalesman] = useState("");
  const [matchStatus, setMatchStatus] = useState<ProfitReportMatchStatus | undefined>(undefined);
  const debouncedSalesman = useDebounce(salesman, 500);

  // ---- File state ----
  const [file, setFile] = useState<File | null>(null);

  // ---- Import summary ----
  const [lastImportSummary, setLastImportSummary] = useState<ProfitReportImportResponse | null>(null);

  // ---- Delete confirm ----
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ---- Mapping modal ----
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [mappingPrefillSalesman, setMappingPrefillSalesman] = useState("");

  // ---- Query & Mutations ----
  const queryParams = {
    year,
    month,
    currency,
    salesman: debouncedSalesman || undefined,
    matchStatus,
  };
  const { data: reports = [], isLoading, refetch } = useProfitReports(queryParams);
  const importMutation = useImportProfitReport();
  const deleteMutation = useDeleteProfitReport();

  // ---- Handlers ----
  const handleImport = useCallback(() => {
    if (!file) return;

    toast.promise(
      importMutation.mutateAsync({ file, currency }).then((result) => {
        setLastImportSummary(result);

        if (result.month !== month || result.year !== year) {
          setMonth(result.month);
          setYear(result.year);
        }
        if (result.currency !== currency) {
          setCurrency(result.currency);
        }

        setFile(null);
        return result;
      }),
      {
        loading: "Đang import Profit Report…",
        success: (result: ProfitReportImportResponse) =>
          `Import thành công: ${result.importedRows}/${result.totalRows} dòng (${result.matchedRows} đã khớp NV)`,
        error: (err: unknown) => getErrorMessage(err, "Lỗi khi import Profit Report"),
      },
    );
  }, [file, currency, month, year, importMutation]);

  const handleRefresh = useCallback(() => {
    refetch();
    toast.info("Đã tải lại dữ liệu");
  }, [refetch]);

  const handleDeleteConfirm = useCallback(() => {
    setDeleteDialogOpen(false);

    toast.promise(
      deleteMutation.mutateAsync({ year, month, currency }),
      {
        loading: `Đang xóa dữ liệu Tháng ${month}/${year} — ${currency}…`,
        success: (result: ProfitReportDeleteResponse) => {
          setLastImportSummary(null);
          return `Đã xóa ${result.deletedRows} dòng (Tháng ${result.month}/${result.year} — ${result.currency})`;
        },
        error: (err: unknown) => getErrorMessage(err, "Lỗi khi xóa Profit Report"),
      },
    );
  }, [year, month, currency, deleteMutation]);

  const handleCreateMapping = useCallback((salesmanName: string) => {
    setMappingPrefillSalesman(salesmanName);
    setMappingModalOpen(true);
  }, []);

  return (
    <div className="p-4 md:p-6 w-full min-h-full flex flex-col gap-6">
      {/* ===== HEADER ===== */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
            <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
              <TrendingUp size={28} />
            </span>
            Profit Report
          </h1>
          <p className="text-muted-foreground text-base md:text-lg ml-1">
            Import dữ liệu Profit Report và đối soát salesman bằng mapping tay
          </p>
        </div>

        {/* Link to Salesman Mapping page */}
        <button
          onClick={() => navigate("/app/acc/profit-report/salesman-mappings")}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer shrink-0"
        >
          <ExternalLink size={16} />
          Quản lý Salesman Mapping
        </button>
      </m.div>

      {/* ===== TOOLBAR / IMPORT PANEL ===== */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <ProfitReportImportPanel
          month={month}
          year={year}
          currency={currency}
          salesman={salesman}
          matchStatus={matchStatus}
          file={file}
          importing={importMutation.isPending}
          deleting={deleteMutation.isPending}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onCurrencyChange={setCurrency}
          onSalesmanChange={setSalesman}
          onMatchStatusChange={setMatchStatus}
          onFileChange={setFile}
          onImport={handleImport}
          onRefresh={handleRefresh}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      </m.div>

      {/* ===== IMPORT SUMMARY ===== */}
      {lastImportSummary && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ProfitReportImportSummary
            summary={lastImportSummary}
            onDismiss={() => setLastImportSummary(null)}
          />
        </m.div>
      )}

      {/* ===== DATA TABLE ===== */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col relative min-h-[400px] flex-1"
      >
        <ProfitReportTable
          data={reports}
          loading={isLoading}
          onCreateMapping={handleCreateMapping}
        />
      </m.div>

      {/* ===== DELETE CONFIRM DIALOG ===== */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        month={month}
        year={year}
        currency={currency}
      />

      {/* ===== CREATE MAPPING MODAL ===== */}
      <SalesmanMappingFormModal
        open={mappingModalOpen}
        onOpenChange={setMappingModalOpen}
        prefillSalesmanName={mappingPrefillSalesman}
      />
    </div>
  );
}
