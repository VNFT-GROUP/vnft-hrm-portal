
import { format } from "date-fns";
import { Copy, FileJson, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import type { AttendanceRecordResponse } from "@/types/attendance/AttendanceRecordResponse";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AttendanceTableProps {
  records: AttendanceRecordResponse[];
  onViewJson: (record: AttendanceRecordResponse) => void;
}

export default function AttendanceTable({ records, onViewJson }: AttendanceTableProps) {
  const { t } = useTranslation();

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground w-full bg-white rounded-xl border border-border">
        <FileJson size={48} className="mb-4 text-muted-foreground/30" strokeWidth={1} />
        <h3 className="text-xl font-medium text-[#1E2062] mb-1">
          {t("attendance.noData")}
        </h3>
        <p className="text-sm">
          {t("attendance.noDataDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-t-xl bg-white">
      <div className="overflow-x-auto w-full select-text!">
        <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
          <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t("attendance.date")}</th>
              <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[100px]">{t("attendance.employeeCode")}</th>
              <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">{t("attendance.employeeName")}</th>
              <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[100px]">{t("attendance.attendanceCode")}</th>
              <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t("attendance.checkIn")}</th>
              <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t("attendance.checkOut")}</th>
              <th className="px-4 py-3 font-semibold text-right border-x border-slate-200 w-[80px]">JSON</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
          {records.map((record) => (
            <tr 
              key={record.id}
              className="hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
              onDoubleClick={() => onViewJson(record)}
            >
              <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap border-x border-slate-200 align-middle text-center">
                {record.attendanceDate ? format(new Date(record.attendanceDate), "dd/MM/yyyy") : "-"}
              </td>
              <td className="px-4 py-3 text-center font-medium border-x border-slate-200 align-middle">
                {record.employeeCode || "-"}
              </td>
              <td className="px-4 py-3 border-x border-slate-200 align-middle">
                <div className="font-medium text-[#1E2062]">
                  {record.employeeName || "-"}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500 text-center border-x border-slate-200 align-middle">
                {record.attendanceCode || "-"}
              </td>
              <td className="px-4 py-3 text-center border-x border-slate-200 align-middle text-medium text-slate-700">
                {record.checkInTime || "-"}
              </td>
              <td className="px-4 py-3 text-center border-x border-slate-200 align-middle text-medium text-slate-700">
                {record.checkOutTime || "-"}
              </td>
              <td className="px-4 py-3 text-right border-x border-slate-200 align-middle">
                <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => onViewJson(record)}
                   className="h-8 w-8 text-sky-500 hover:text-sky-600 hover:bg-sky-50 focus-visible:ring-1"
                   title={t("attendance.viewJson")}
                >
                  <FileJson size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export function AttendanceJsonDialog({ 
  record, 
  isOpen, 
  onClose 
}: { 
  record: AttendanceRecordResponse | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const { t } = useTranslation();

  let displayData: unknown = record;
  if (record?.rawPayload) {
    try {
      displayData = JSON.parse(record.rawPayload);
    } catch {
      displayData = { rawPayload: record.rawPayload, note: t("attendance.invalidJson") };
    }
  }

  const jsonString = displayData ? JSON.stringify(displayData, null, 2) : "No data";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col gap-0 border-slate-200">
        <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="flex justify-between items-center text-[#1E2062] text-lg">
             <div className="flex items-center gap-2">
                <FileJson size={22} className="text-[#2E3192]" />
                {t("attendance.jsonDetails")}
             </div>
             <DialogClose className="flex items-center justify-center p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors">
               <X strokeWidth={2.5} size={18} />
             </DialogClose>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative flex-1 bg-slate-900 border-t border-slate-200 p-0 overflow-hidden">
           {record && (
              <Button
                 variant="outline"
                 size="icon"
                 className="absolute top-4 right-6 z-10 h-8 w-8 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-md"
                 onClick={() => {
                    navigator.clipboard.writeText(jsonString);
                    toast.success(t("attendance.copyJsonSuccess"));
                 }}
              >
                 <Copy size={14} />
              </Button>
           )}
           <ScrollArea className="h-full w-full max-h-[60vh]">
              <pre className="p-6 text-sm text-green-400 font-mono min-h-[300px]">
                {jsonString}
              </pre>
           </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
