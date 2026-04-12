import { useState } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string | null;
}

export default function ChangePasswordDialog({ isOpen, onOpenChange, userId }: ChangePasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không trùng khớp.");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    updatePasswordMutation.mutate(password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 rounded-2xl border-none shadow-2xl">
        <div className="bg-gradient-to-br from-[#2E3192] to-[#1E2062] p-6 text-white pb-8">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10">
              <KeyRound size={24} className="text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-white">Đổi Mật Khẩu</DialogTitle>
            <DialogDescription className="text-center text-white/80 mt-2">
              Khởi tạo mật khẩu mới cho nhân viên để duy trì bảo mật tài khoản.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 pt-6 -mt-4 bg-background rounded-t-2xl relative z-10">
          <div className="space-y-4">
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

            <div className="space-y-2 relative">
              <Label className="text-sm font-semibold">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu..."
                  className="pr-10 h-11 rounded-xl"
                  disabled={updatePasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl h-11 border-border"
              disabled={updatePasswordMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-11 bg-[#2E3192] hover:bg-[#1E2062] px-8 text-white shadow-md transition-all"
              disabled={updatePasswordMutation.isPending}
            >
               {updatePasswordMutation.isPending ? "Đang xử lý..." : <><ShieldCheck size={18} className="mr-2" /> Xác nhận</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
