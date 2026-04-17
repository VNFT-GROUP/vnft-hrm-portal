
import { format } from "date-fns";
import { Copy, FileJson, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Table className="border-collapse">
        <TableHeader className="bg-slate-50 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] font-semibold text-[#1E2062] border border-slate-200">
              {t("attendance.date")}
            </TableHead>
            <TableHead className="font-semibold text-[#1E2062] text-center w-[100px] border border-slate-200">
               {t("attendance.employeeCode")}
            </TableHead>
            <TableHead className="font-semibold text-[#1E2062] border border-slate-200">
              {t("attendance.employeeName")}
            </TableHead>
            <TableHead className="font-semibold text-[#1E2062] text-center w-[100px] border border-slate-200">
              {t("attendance.attendanceCode")}
            </TableHead>
            <TableHead className="font-semibold text-[#1E2062] text-center border border-slate-200">
              {t("attendance.checkIn")}
            </TableHead>
            <TableHead className="font-semibold text-[#1E2062] text-center border border-slate-200">
              {t("attendance.checkOut")}
            </TableHead>
            <TableHead className="w-[80px] text-right font-semibold text-[#1E2062] border border-slate-200">
              JSON
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow 
              key={record.id}
              className="group transition-colors ui-state-active:bg-muted/30"
              onDoubleClick={() => onViewJson(record)}
            >
              <TableCell className="font-medium text-slate-700 whitespace-nowrap border border-slate-200">
                {record.attendanceDate ? format(new Date(record.attendanceDate), "dd/MM/yyyy") : "-"}
              </TableCell>
              <TableCell className="text-center font-medium border border-slate-200">
                {record.employeeCode || "-"}
              </TableCell>
              <TableCell className="border border-slate-200">
                <div className="font-medium text-[#1E2062]">
                  {record.employeeName || "-"}
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-center border border-slate-200">
                {record.attendanceCode || "-"}
              </TableCell>
              <TableCell className="text-center border border-slate-200">
                {record.checkInTime || "-"}
              </TableCell>
              <TableCell className="text-center border border-slate-200">
                {record.checkOutTime || "-"}
              </TableCell>
              <TableCell className="text-right border border-slate-200">
                <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => onViewJson(record)}
                   className="text-slate-400 hover:text-[#2E3192] hover:bg-muted focus-visible:ring-1"
                   title={t("attendance.viewJson")}
                >
                  <FileJson size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
