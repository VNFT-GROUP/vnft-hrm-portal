import { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendance";
import { useTranslation } from "react-i18next";
import AttendanceTable, {
  AttendanceJsonDialog,
} from "./components/AttendanceTable";
import type { AttendanceRecordResponse } from "@/types/attendance/AttendanceRecordResponse";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function AttendancePage() {
  const { t } = useTranslation();

  // Basic States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  // JSON view state
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceRecordResponse | null>(null);

  // Example dates if we wanted a date picker, but here we just pass undefined to fetch all
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(e) => {
                e.preventDefault();
                setPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      // First page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={page === 1}
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={(e) => {
                e.preventDefault();
                setPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={page === totalPages}
            onClick={(e) => {
              e.preventDefault();
              setPage(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl shadow-sm border border-[#2E3192]/10">
            <CalendarIcon size={24} />
          </span>
          {t("attendance.title")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base ml-1">
          {t("attendance.subtitle")}
        </p>
      </motion.div>

      {/* 2. Toolbar Section */}
      <motion.div
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
      </motion.div>

      {/* 3. Main Data Section */}
      <motion.div
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
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-slate-50/50 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage((p) => p - 1);
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage((p) => p + 1);
                    }}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      {/* JSON View Overlay */}
      <AttendanceJsonDialog
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
