import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, CheckCircle2, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { currentUserProfileService } from '@/services/user/currentUserProfileService';
import { useAuthStore } from '@/store/useAuthStore';
import './FirstTimePasswordModal.css';

interface FirstTimePasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export default function FirstTimePasswordModal({ isOpen, onSuccess }: FirstTimePasswordModalProps) {
  const { t } = useTranslation();
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // States for passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const queryClient = useQueryClient();

  const changePasswordMutation = useMutation({
    mutationFn: currentUserProfileService.changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Thay đổi mật khẩu thành công!", {
        description: "Mật khẩu của bạn đã được cập nhật an toàn.",
      });
      // Force update the auth store to mark the password as changed
      useAuthStore.getState().updateSession({ passwordChangedAt: new Date().toISOString() });
      onSuccess();
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

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  };

  const handleOpenChange = () => {
     // Component strictly prevents closing. So we do nothing.
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="w-[95%]! max-w-[95%]! lg:w-1/2! lg:max-w-1/2! md:w-[70%]! md:max-w-[70%]! p-0 border-none bg-transparent shadow-none max-h-[90vh] flex flex-col ftpm-dialog-content">
        {/* Animated Background Effects */}
        <div className="ftpm-glow-orange" />
        <div className="ftpm-glow-blue" />
        
        {/* Real wrapper card */}
        <div className="bg-card shadow-2xl border border-border ftpm-inner-wrapper flex flex-col overflow-hidden">
          
          {/* Scrollable Container for Image and Form */}
          <div className="overflow-y-auto flex-1 w-full custom-scrollbar flex flex-col relative bg-card/50 backdrop-blur-sm">
            
            {/* Top Illustration */}
            <div className="w-full bg-[#F0F4F8] flex items-center justify-center p-4 relative overflow-hidden shrink-0">
               <div className="absolute top-0 -left-10 w-40 h-40 bg-[#2E3192]/10 rounded-full blur-2xl"></div>
               <div className="absolute top-0 -right-10 w-40 h-40 bg-[#F7941D]/10 rounded-full blur-2xl"></div>
               
               <img 
                src="/common/first-time-password-illustration.webp" 
                alt="Welcome to PingMe" 
                className="w-full max-h-[250px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out z-10"
              />
            </div>

        {/* Welcome Text */}
        <div className="px-6 pt-5 pb-1 text-center flex flex-col items-center">
          <div className="bg-[#2E3192]/10 p-2.5 rounded-full mb-2">
             <Lock size={18} className="text-[#2E3192]" />
          </div>
          <DialogTitle className="text-[#1E2062] font-bold text-xl sm:text-2xl leading-tight mb-2">
            Chào mừng bạn đến với hệ thống! ✨
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm max-w-[90%]">
            Rất vui được đồng hành cùng bạn. Để bảo mật thông tin và bắt đầu công việc, xin vui lòng tạo lại một mật khẩu mới cho riêng mình nhé.
          </DialogDescription>
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
          <div className="mt-2 pt-5 border-t border-border/50 flex flex-col gap-3">
            <Button 
              type="submit"
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8 || changePasswordMutation.isPending}
              className="w-full h-11 bg-[#F7941D] hover:bg-[#D4780F] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all font-bold text-sm lg:text-base rounded-xl"
            >
              {changePasswordMutation.isPending ? "Đang xử lý..." : "Khởi tạo & Bắt đầu trải nghiệm"}
            </Button>

            <div className="flex items-center w-full gap-3 mt-1 mb-1">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Hoặc</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <Button 
              type="button"
              onClick={handleLogout}
              variant="ghost"
              className="w-full h-11 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 font-semibold rounded-xl gap-2 transition-all"
            >
              <LogOut size={16} /> Đăng xuất
            </Button>
          </div>
        </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
