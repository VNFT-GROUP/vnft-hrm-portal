import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { ProfitReportCurrency } from "@/types/profit-report/ProfitReportResponse";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  month: number;
  year: number;
  currency: ProfitReportCurrency;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  month,
  year,
  currency,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <AlertTriangle size={20} />
            </span>
            <DialogTitle>Xác nhận xóa dữ liệu</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Bạn sắp xóa <strong>toàn bộ</strong> dữ liệu Profit Report của kỳ{" "}
            <strong>Tháng {month}/{year}</strong> — <strong>{currency}</strong>.
            <br />
            Thao tác này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Hủy
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Xóa dữ liệu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
