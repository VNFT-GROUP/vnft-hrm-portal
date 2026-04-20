import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";
import { Loader2, Download, FileUp, AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

interface ImportEmployeeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportEmployeeModal({ isOpen, onOpenChange }: ImportEmployeeModalProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const importMutation = useMutation({
    mutationFn: (f: File) => userService.importUsers(f),
    onSuccess: (res) => {
      const data = res.data;
      if (data) {
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-bold">Import thành công!</span>
            <span className="text-sm">Tổng cộng: {data.totalRows} dòng</span>
            <span className="text-sm">Tạo mới: {data.createdUsers} TK, {data.createdProfiles} HS</span>
            <span className="text-sm">Cập nhật: {data.updatedProfiles} HS</span>
            {data.skippedNoEmail > 0 && <span className="text-sm text-yellow-500">Bỏ qua (thiếu email): {data.skippedNoEmail} dòng</span>}
          </div>
        );
      } else {
        toast.success("Import thành công!");
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
      setFile(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Có lỗi xảy ra khi import file."));
    }
  });

  const handleDownloadTemplate = () => {
    // Controller Java backend không có sẵn endpoint export template
    // Nên lấy trực tiếp từ file tĩnh trên folder public của Frontend
    const link = document.createElement("a");
    link.href = "/user_import_template.xlsx";
    link.download = "user_import_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đang tải file mẫu về máy...");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    importMutation.mutate(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!importMutation.isPending) {
            onOpenChange(open);
            if (!open) setFile(null);
        }
    }}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-900 border-b pb-3 mb-2">
            <FileUp className="w-5 h-5 text-indigo-600" />
            Import nhân viên hàng loạt
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Tải lên file Excel (.xlsx) để import danh sách nhân viên vào hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">1. Chuẩn bị dữ liệu</span>
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
              <div className="flex flex-col gap-1 leading-relaxed">
                <span>Vui lòng tải file mẫu, sau đó điền thông tin nhân sự. Các cột như <strong>Email</strong> và <strong>Tên</strong> là bắt buộc.</span>
                <span>Hệ thống sẽ cập nhật thông tin nếu thấy Email đã tồn tại.</span>
              </div>
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
        </div>

        <DialogFooter className="border-t pt-4 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importMutation.isPending} className="border-slate-200">
            Hủy bỏ
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[130px] font-medium shadow-sm shadow-indigo-200"
            onClick={handleSubmit} 
            disabled={!file || importMutation.isPending}
          >
            {importMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang Import...</>
            ) : (
              <><FileUp className="w-4 h-4 mr-2" /> Bắt đầu Import</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
