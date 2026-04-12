import { useState } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";

interface ChangePasswordSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string | null;
}

export default function ChangePasswordSheet({ isOpen, onOpenChange, userId }: ChangePasswordSheetProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const updatePasswordMutation = useMutation({
    mutationFn: (pwd: string) => userService.updatePassword(userId!, { password: pwd }),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      handleClose();
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi đổi mật khẩu.");
    },
  });

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu mới.");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    updatePasswordMutation.mutate(password);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="sm:max-w-[400px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full p-0">
        <div className="p-6 border-b border-border shrink-0 bg-muted/50">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
                <span className="p-1.5 bg-[#1E2062]/10 text-[#1E2062] rounded-md">
                  <KeyRound size={18} />
                </span>
                Đổi mật khẩu
              </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground">
               Khởi tạo mật khẩu mới cho nhân viên để duy trì bảo mật tài khoản.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2 relative">
              <Label className="text-sm font-semibold">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="pr-10 h-11 rounded-xl"
                  disabled={updatePasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border shrink-0 bg-card text-card-foreground flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl border-border text-muted-foreground hover:bg-muted w-32 transition-all"
              disabled={updatePasswordMutation.isPending}
            >
              Đóng
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#1E2062] hover:bg-[#1E2062]/90 px-6 text-white shadow-md transition-all"
              disabled={updatePasswordMutation.isPending}
            >
               {updatePasswordMutation.isPending ? "Đang xử lý..." : <><ShieldCheck size={18} className="mr-2" /> Lưu thay đổi</>}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
