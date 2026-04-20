import { useState } from "react";
import { Search, Calendar as CalendarIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { m  } from 'framer-motion';
import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance";
import { useTranslation } from "react-i18next";
import CustomPagination from "@/components/custom/CustomPagination";
import AttendanceTable, {
  AttendanceJsonDialog,
} from "./components/AttendanceTable";
import type { AttendanceRecordResponse } from "@/types/attendance/AttendanceRecordResponse";
import { useDebounce } from "@/hooks/useDebounce";

export default function AttendancePage() {
  const { t } = useTranslation();

  // Basic States
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  // JSON view state
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceRecordResponse | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["attendance", page, size, debouncedSearch, startDate, endDate],
    queryFn: () =>
      attendanceService.getAttendanceRecords(
        startDate || undefined,
        endDate || undefined,
        debouncedSearch || undefined,
        page,
        size,
      ),
  });

  const records = attendanceData?.data?.content || [];
  const totalPages = attendanceData?.data?.totalPages || 1;

  const handleOpenJson = (record: AttendanceRecordResponse) => {
    setSelectedRecord(record);
    setIsJsonOpen(true);
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl shadow-sm border border-[#2E3192]/10">
            <CalendarIcon size={24} />
          </span>
          {t("attendance.title")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base ml-1">
          {t("attendance.subtitle")}
        </p>

        <div className="flex items-start gap-4 bg-amber-50 p-4 md:p-5 rounded-2xl border border-amber-200/60 shadow-sm mt-2">
           <div className="bg-amber-100 p-2 rounded-full shrink-0">
             <Info className="w-6 h-6 text-amber-600" />
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[15px] font-bold text-amber-900">{t("attendance.infoTitle")}</span>
             <span className="text-[13.5px] text-amber-700/90 leading-relaxed">
               <strong>{t("attendance.infoNotice")}</strong> {t("attendance.infoDesc")}
             </span>
           </div>
        </div>
      </m.div>

      {/* 2. Toolbar Section */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:flex-1 max-w-sm flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder={t("attendance.searchPlaceholder")}
              className="pl-11 h-11 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-sm hover:bg-card text-card-foreground transition-colors w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-11 w-auto rounded-xl bg-muted border-border cursor-pointer focus-visible:ring-[#2E3192]"
            title={t("attendance.startDate")}
          />
          <span className="text-muted-foreground hidden md:inline">-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-11 w-auto rounded-xl bg-muted border-border cursor-pointer focus-visible:ring-[#2E3192]"
            title={t("attendance.endDate")}
          />
        </div>
      </m.div>

      {/* 3. Main Data Section */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border flex-1 flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-auto bg-white min-h-[400px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center min-h-[300px]">
              <div className="w-6 h-6 border-2 border-[#2E3192] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-muted-foreground text-sm">
                {t("attendance.loadingData")}
              </span>
            </div>
          ) : (
            <AttendanceTable records={records} onViewJson={handleOpenJson} />
          )}
        </div>

        {/* 4. Pagination */}
        {records.length > 0 && (
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={size}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setSize(newSize);
              setPage(1);
            }}
            className="p-4 border-t border-border mt-auto"
          />
        )}
      </m.div>

      {/* JSON View Overlay */}
      <AttendanceJsonDialog
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
