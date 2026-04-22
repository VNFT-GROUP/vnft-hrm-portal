import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportService } from "@/services/report/reportService";

export function useAllowanceReport() {
  const [periodType, setPeriodType] = useState<"MONTH" | "QUARTER">("MONTH");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState<number>(Math.floor(new Date().getMonth() / 3) + 1);
  const [isExporting, setIsExporting] = useState(false);

  // Auto layout query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["allowance-report", periodType, year, month, quarter],
    queryFn: () => 
      reportService.getAllowanceReport({
        periodType,
        year,
        ...(periodType === "MONTH" ? { month } : { quarter }),
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.loading("Đang xuất file Excel...", { id: "exporting-allowance-report" });
      await reportService.downloadAllowanceReport({
        periodType,
        year,
        ...(periodType === "MONTH" ? { month } : { quarter }),
      });
      toast.success("Xuất báo cáo thành công!", { id: "exporting-allowance-report" });
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Không thể xuất báo cáo. Vui lòng thử lại sau.", { id: "exporting-allowance-report" });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    periodType,
    setPeriodType,
    year,
    setYear,
    month,
    setMonth,
    quarter,
    setQuarter,
    data,
    isLoading,
    isError,
    error,
    refetch,
    isExporting,
    handleExport,
  };
}
