import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { currentUserProfileService } from '@/services/user/currentUserProfileService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isForced?: boolean;
}

export default function ChangePasswordModal({ isOpen, onClose, isForced = false }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // States for passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const changePasswordMutation = useMutation({
    mutationFn: currentUserProfileService.changePassword,
    onSuccess: () => {
      toast.success(t('profile.passwordForm.success') || "Thành công", {
        description: "Mật khẩu của bạn đã được cập nhật.",
      });
      onClose();
      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error) => {
      let message = "Không thể thay đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.";
      if (isAxiosError(error) && error.response?.data?.message) {
        message = typeof error.response.data.message === 'string' 
          ? error.response.data.message 
          : String(error.response.data.message);
      }
      toast.error("Có lỗi xảy ra", {
        description: message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    });
  };

  const handleOpenChange = (open: boolean) => {
     if (isForced) return; // Prevent closing if forced
     if (!open) {
         onClose();
         // Reset fields on close
         setCurrentPassword('');
         setNewPassword('');
         setConfirmPassword('');
     }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden border-border bg-card shadow-2xl">
        {/* Header - Keeps the premium gradient look but adapted for the Dialog */}
        <div className="relative bg-linear-to-r from-[#2E3192] to-[#1E2062] px-6 py-5 flex items-center gap-4">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm shadow-inner hidden sm:block">
            <Lock size={24} className="text-white" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold text-xl leading-tight text-left">
              {t('profile.passwordForm.title')}
            </DialogTitle>
            <DialogDescription className="text-indigo-200 text-[13px] mt-1 text-left">
              {isForced ? "Đây là lần đầu bạn đăng nhập, vui lòng đổi mật khẩu để tiếp tục." : t('profile.passwordForm.subtitle')}
            </DialogDescription>
          </div>
          {!isForced && (
            <button 
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          
          {/* Mật khẩu hiện tại */}
          <div className="flex flex-col gap-2">
            <Label className="text-[13px] font-semibold text-foreground">
              {t('profile.passwordForm.currentPassword')} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input 
                type={showCurrent ? "text" : "password"} 
                className="pr-10 h-10"
                placeholder={t('profile.passwordForm.currentPasswordPlaceholder')}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-border/60 my-1 rounded-full"></div>

          {/* Mật khẩu mới */}
          <div className="flex flex-col gap-2">
            <Label className="text-[13px] font-semibold text-foreground">
              {t('profile.passwordForm.newPassword')} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input 
                type={showNew ? "text" : "password"} 
                className="pr-10 h-10"
                placeholder={t('profile.passwordForm.newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('profile.passwordForm.newPasswordHint')}
            </p>
          </div>

          {/* Nhập lại mật khẩu mới */}
          <div className="flex flex-col gap-2">
            <Label className="text-[13px] font-semibold text-foreground">
              {t('profile.passwordForm.confirmPassword')} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input 
                type={showConfirm ? "text" : "password"} 
                className={`pr-10 h-10 ${confirmPassword && newPassword !== confirmPassword ? 'border-destructive focus-visible:ring-destructive/20' : ''} ${confirmPassword && newPassword === confirmPassword ? 'border-emerald-500/50 focus-visible:ring-emerald-500/20' : ''}`}
                placeholder={t('profile.passwordForm.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Validation Feedback */}
            <div className="h-5 flex items-center">
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                  {t('profile.passwordForm.passwordsDoNotMatch')}
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && currentPassword && (
                <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-500"/> {t('profile.passwordForm.valid')}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-4 pt-4 border-t border-border/50 gap-2 sm:gap-3">
            {!isForced && (
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto h-10"
              >
                {t('profile.passwordForm.cancel')}
              </Button>
            )}
            <Button 
              type="submit"
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8 || changePasswordMutation.isPending}
              className="w-full sm:w-auto h-10 bg-[#F7941D] hover:bg-[#D4780F] text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all font-semibold"
            >
              {changePasswordMutation.isPending ? "Đang xử lý..." : t('profile.passwordForm.update')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
