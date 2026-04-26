import { useRef } from "react";
import {
  Upload,
  RefreshCw,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  DollarSign,
  Search,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ProfitReportCurrency,
  ProfitReportMatchStatus,
} from "@/types/profit-report/ProfitReportResponse";

interface ProfitReportImportPanelProps {
  month: number;
  year: number;
  currency: ProfitReportCurrency;
  salesman: string;
  matchStatus?: ProfitReportMatchStatus;
  file: File | null;
  importing?: boolean;
  deleting?: boolean;
  onMonthChange: (value: number) => void;
  onYearChange: (value: number) => void;
  onCurrencyChange: (value: ProfitReportCurrency) => void;
  onSalesmanChange: (value: string) => void;
  onMatchStatusChange: (value?: ProfitReportMatchStatus) => void;
  onFileChange: (file: File | null) => void;
  onImport: () => void;
  onRefresh: () => void;
  onDelete: () => void;
}

const CURRENCY_OPTIONS: { value: ProfitReportCurrency; label: string; hint: string }[] = [
  { value: "VND", label: "VND", hint: "FAST" },
  { value: "USD", label: "USD", hint: "FAST" },
  { value: "EFREIGHT", label: "E-Freight", hint: "E-Freight" },
];

const MATCH_STATUS_OPTIONS: { value: ProfitReportMatchStatus | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "MATCHED", label: "Đã khớp" },
  { value: "UNMATCHED", label: "Chưa khớp" },
  { value: "AMBIGUOUS", label: "Khớp mơ hồ" },
];

const currentYear = new Date().getFullYear();

export default function ProfitReportImportPanel({
  month,
  year,
  currency,
  salesman,
  matchStatus,
  file,
  importing,
  deleting,
  onMonthChange,
  onYearChange,
  onCurrencyChange,
  onSalesmanChange,
  onMatchStatusChange,
  onFileChange,
  onImport,
  onRefresh,
  onDelete,
}: ProfitReportImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const isBusy = importing || deleting;

  return (
    <div className="bg-card text-card-foreground p-4 md:p-5 rounded-2xl shadow-sm border border-border space-y-4">
      {/* Row 1: Period + Currency + Salesman + Match Status */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Month + Year */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <div className="flex items-center px-3 gap-2">
            <CalendarIcon size={18} className="text-muted-foreground" />
            <select
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="bg-transparent border-none outline-none text-sm font-medium focus:ring-0"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-6 bg-border mx-1" />
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-transparent border-none outline-none text-sm font-medium px-3 focus:ring-0"
          >
            {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <div className="flex items-center px-3 gap-2">
            <DollarSign size={18} className="text-muted-foreground" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as ProfitReportCurrency)}
              className="bg-transparent border-none outline-none text-sm font-medium focus:ring-0"
            >
              {CURRENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.hint}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Match Status */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <div className="flex items-center px-3 gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={matchStatus ?? ""}
              onChange={(e) =>
                onMatchStatusChange(
                  e.target.value ? (e.target.value as ProfitReportMatchStatus) : undefined,
                )
              }
              className="bg-transparent border-none outline-none text-sm font-medium focus:ring-0"
            >
              {MATCH_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Salesman Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Tìm salesman…"
            className="pl-10 h-10 rounded-xl bg-muted border-none focus-visible:ring-1 focus-visible:ring-[#2E3192]"
            value={salesman}
            onChange={(e) => onSalesmanChange(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2: File + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50">
        {/* File picker */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={handleBrowseClick}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-muted border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            {file ? (
              <span className="max-w-[200px] truncate">{file.name}</span>
            ) : (
              <span className="text-muted-foreground">Chọn file Excel…</span>
            )}
          </button>
          {file && (
            <button
              type="button"
              onClick={() => {
                onFileChange(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              title="Xóa file"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onImport}
            disabled={!file || isBusy}
            className="h-10 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            {importing ? "Đang import…" : "Import"}
          </Button>

          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isBusy}
            className="h-10 px-4 rounded-xl transition-all"
            title="Tải lại dữ liệu"
          >
            <RefreshCw size={16} />
          </Button>

          <Button
            variant="outline"
            onClick={onDelete}
            disabled={isBusy}
            className="h-10 px-4 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all"
            title="Xóa dữ liệu kỳ hiện tại"
          >
            {deleting ? (
              <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
