
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AllowanceReportFilterProps {
  periodType: "MONTH" | "QUARTER";
  setPeriodType: (val: "MONTH" | "QUARTER") => void;
  year: number;
  setYear: (val: number) => void;
  month: number;
  setMonth: (val: number) => void;
  quarter: number;
  setQuarter: (val: number) => void;
  onExport: () => void;
  isExporting: boolean;
}

export function AllowanceReportFilter({
  periodType,
  setPeriodType,
  year,
  setYear,
  month,
  setMonth,
  quarter,
  setQuarter,
  onExport,
  isExporting,
}: AllowanceReportFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Toggle Period Type */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setPeriodType("MONTH")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              periodType === "MONTH"
                ? "bg-white text-[#2E3192] shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setPeriodType("QUARTER")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              periodType === "QUARTER"
                ? "bg-white text-[#2E3192] shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Theo Quý
          </button>
        </div>

        {/* Year Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase px-1">Năm</label>
          <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[120px] h-11 bg-slate-50 border-slate-200 focus:ring-[#2E3192] rounded-xl font-medium text-[#1E2062]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-slate-100 min-w-[120px]">
              {years.map(y => (
                <SelectItem key={y} value={y.toString()} className="font-medium cursor-pointer">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month / Quarter Dropdown */}
        {periodType === "MONTH" ? (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Tháng</label>
            <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger className="w-[140px] h-11 bg-slate-50 border-slate-200 focus:ring-[#2E3192] rounded-xl font-medium text-[#1E2062]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64 rounded-xl shadow-lg border-slate-100 min-w-[140px]">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <SelectItem key={m} value={m.toString()} className="font-medium cursor-pointer">
                    Tháng {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Quý</label>
            <Select value={quarter.toString()} onValueChange={(v) => setQuarter(Number(v))}>
              <SelectTrigger className="w-[140px] h-11 bg-slate-50 border-slate-200 focus:ring-[#2E3192] rounded-xl font-medium text-[#1E2062]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg border-slate-100 min-w-[140px]">
                {[1, 2, 3, 4].map(q => (
                  <SelectItem key={q} value={q.toString()} className="font-medium cursor-pointer">
                    Quý {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button
        onClick={onExport}
        disabled={isExporting}
        className="h-11 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold"
      >
        {isExporting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
        Tra cứu & Xuất Excel
      </Button>
    </div>
  );
}
