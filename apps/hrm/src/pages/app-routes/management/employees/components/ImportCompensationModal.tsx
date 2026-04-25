import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";
import { Loader2, Download, FileUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

interface ImportCompensationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

import type { ImportCompensationResponse } from "@/types/user/salary/ImportCompensationResponse";

export default function ImportCompensationModal({ isOpen, onOpenChange }: ImportCompensationModalProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportCompensationResponse | null>(null);

  const importMutation = useMutation({
    mutationFn: (f: File) => userService.importCompensations(f),
    onSuccess: (res) => {
      const data = res.data;
      if (data) {
        setImportResult(data);
        toast.success("Import lương/phụ cấp thành công!");
      } else {
        toast.success("Import thành công!");
        onOpenChange(false);
      }
      queryClient.invalidateQueries({ queryKey: ["userCompensations"] });
      setFile(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Có lỗi xảy ra khi import file."));
    }
  });

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/template/compensation_import_template.xlsx";
    link.download = "compensation_import_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đang tải file mẫu về máy...");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImportResult(null);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    setImportResult(null);
    importMutation.mutate(file);
  };

  const handleClose = () => {
    onOpenChange(false);
    setFile(null);
    setImportResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!importMutation.isPending) {
            if (!open) handleClose();
            else onOpenChange(open);
        }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-900 border-b pb-3 mb-2">
            <FileUp className="w-5 h-5 text-indigo-600" />
            Import Cấu Hình Lương/Phụ Cấp
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Tải lên file Excel (.xlsx) để import cấu hình lương/phụ cấp cho nhân viên.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {importResult ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">Import thành công!</span>
                  <span className="text-sm opacity-90">Hệ thống đã xử lý xong file dữ liệu.</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Tổng số dòng đã đọc</span>
                  <span className="text-lg font-bold text-slate-700">{importResult.totalRows || 0}</span>
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Số cấu hình Import</span>
                  <span className="text-lg font-bold text-slate-700">{importResult.importedCompensations || 0}</span>
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Cấu hình tạo mới</span>
                  <span className="text-lg font-bold text-emerald-600">{importResult.createdCompensations || 0}</span>
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-md border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Cấu hình cập nhật</span>
                  <span className="text-lg font-bold text-indigo-600">{importResult.updatedCompensations || 0}</span>
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-md border border-slate-200 col-span-2">
                  <span className="text-xs text-slate-500 font-medium">Tổng số khoản mục con (lương/phụ cấp) đã import</span>
                  <span className="text-lg font-bold text-slate-700">{importResult.importedItems || 0}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">1. Hướng dẫn & Template</span>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-indigo-600 hover:text-indigo-700 text-sm gap-1.5 font-medium"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="w-4 h-4" />
                    Tải file mẫu
                  </Button>
                </div>
                <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-md border border-slate-200 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                  <ul className="flex flex-col gap-1.5 leading-relaxed list-disc pl-4 marker:text-slate-400">
                    <li>Mỗi dòng là một bộ lương/phụ cấp cho một <strong>employeeCode</strong> áp dụng từ <strong>effectiveFrom</strong>.</li>
                    <li>Cột <strong>effectiveFrom</strong> dùng định dạng <strong>YYYY-MM-DD</strong>.</li>
                    <li>Để trống những cột khoản mục nếu nhân viên không có.</li>
                    <li>Hệ thống sẽ <strong>Upsert</strong> (thêm mới hoặc cập nhật) nếu trùng `employeeCode + effectiveFrom`.</li>
                    <li>Cột <strong>Phí ADMIN</strong> cho phép nhập số âm.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">2. Chọn file Upload</span>
                <div className="group border border-slate-200 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 rounded-lg overflow-hidden transition-all">
                    <Input 
                        type="file" 
                        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                        onChange={handleFileChange}
                        disabled={importMutation.isPending}
                        className="cursor-pointer file:text-indigo-600 file:font-semibold file:bg-indigo-50 file:border-0 file:rounded-md file:px-4 file:py-1.5 file:mr-3 hover:file:bg-indigo-100 border-0 shadow-none focus-visible:ring-0 p-1.5 h-auto text-sm"
                    />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-2">
          {importResult ? (
            <Button onClick={handleClose} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white">
              Đóng
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={importMutation.isPending} className="border-slate-200">
                Hủy bỏ
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[130px] font-medium shadow-sm shadow-indigo-200"
                onClick={handleSubmit} 
                disabled={!file || importMutation.isPending}
              >
                {importMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</>
                ) : (
                  <><FileUp className="w-4 h-4 mr-2" /> Bắt đầu Import</>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
