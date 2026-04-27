import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowDownUp,
  Trash2,
  XCircle,
  UserCheck,
  UserX,
  HelpCircle,
} from "lucide-react";
import type { ProfitReportImportResponse } from "@/types/profit-report/ProfitReportResponse";
import { formatCurrency } from "@/lib/utils";

interface ProfitReportImportSummaryProps {
  summary: ProfitReportImportResponse;
  onDismiss?: () => void;
}

const MAX_ERRORS_DISPLAY = 20;

export default function ProfitReportImportSummary({ summary, onDismiss }: ProfitReportImportSummaryProps) {
  const hasErrors = summary.errors.length > 0;
  const isPartialSuccess = summary.importedRows > 0 && hasErrors;
  const isFullSuccess = summary.importedRows > 0 && !hasErrors;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all ${
        isFullSuccess
          ? "bg-emerald-50/80 border-emerald-200"
          : isPartialSuccess
          ? "bg-amber-50/80 border-amber-200"
          : hasErrors
          ? "bg-rose-50/80 border-rose-200"
          : "bg-card border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isFullSuccess ? (
            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </span>
          ) : hasErrors ? (
            <span className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle size={20} />
            </span>
          ) : (
            <span className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <CheckCircle2 size={20} />
            </span>
          )}
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Kết quả Import — Tháng {summary.month}/{summary.year}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {summary.currency} • Layout: {summary.sourceLayout}
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Đóng"
          >
            ✕
          </button>
        )}
      </div>

      {/* Stats Grid — Row & Match stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
        <StatCard
          icon={<FileText size={16} />}
          label="Tổng dòng"
          value={summary.totalRows}
          color="text-slate-700"
          bg="bg-slate-100"
        />
        <StatCard
          icon={<ArrowDownUp size={16} />}
          label="Đã import"
          value={summary.importedRows}
          color="text-emerald-700"
          bg="bg-emerald-100"
        />
        <StatCard
          icon={<Trash2 size={16} />}
          label="Đã xóa (cũ)"
          value={summary.deletedRows}
          color="text-amber-700"
          bg="bg-amber-100"
        />
        <StatCard
          icon={<XCircle size={16} />}
          label="Lỗi"
          value={summary.failedRows}
          color={summary.failedRows > 0 ? "text-rose-700" : "text-slate-500"}
          bg={summary.failedRows > 0 ? "bg-rose-100" : "bg-slate-100"}
        />
        <StatCard
          icon={<UserCheck size={16} />}
          label="Đã khớp NV"
          value={summary.matchedRows}
          color="text-teal-700"
          bg="bg-teal-100"
        />
        <StatCard
          icon={<UserX size={16} />}
          label="Chưa khớp"
          value={summary.unmatchedRows}
          color={summary.unmatchedRows > 0 ? "text-orange-700" : "text-slate-500"}
          bg={summary.unmatchedRows > 0 ? "bg-orange-100" : "bg-slate-100"}
        />
        <StatCard
          icon={<HelpCircle size={16} />}
          label="Khớp mơ hồ"
          value={summary.ambiguousRows}
          color={summary.ambiguousRows > 0 ? "text-violet-700" : "text-slate-500"}
          bg={summary.ambiguousRows > 0 ? "bg-violet-100" : "bg-slate-100"}
        />
      </div>

      {/* Error list */}
      {hasErrors && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle size={12} />
            Chi tiết lỗi ({summary.errors.length} dòng)
          </p>
          <ul className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {summary.errors.slice(0, MAX_ERRORS_DISPLAY).map((err, idx) => (
              <li
                key={idx}
                className="text-xs text-rose-700 bg-rose-100/60 px-3 py-1.5 rounded-lg font-mono"
              >
                {err}
              </li>
            ))}
            {summary.errors.length > MAX_ERRORS_DISPLAY && (
              <li className="text-xs text-muted-foreground italic px-3 py-1.5">
                … và {summary.errors.length - MAX_ERRORS_DISPLAY} lỗi khác
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${bg}`}>
      <span className={`${color} opacity-80`}>{icon}</span>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{formatCurrency(value)}</p>
      </div>
    </div>
  );
}
