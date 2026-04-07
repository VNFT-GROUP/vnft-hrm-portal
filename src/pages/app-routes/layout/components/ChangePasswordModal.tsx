import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // States for passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful password change
    alert("Cập nhật mật khẩu thành công!");
    onClose();
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div 
        className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2E3192] to-[#1E2062] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-card text-card-foreground/20 p-2 rounded-lg">
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Đổi mật khẩu</h2>
              <p className="text-indigo-200 text-xs mt-0.5">Cập nhật mật khẩu an toàn mới</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-card text-card-foreground/10 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Mật khẩu hiện tại */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Mật khẩu hiện tại <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showCurrent ? "text" : "password"} 
                className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2E3192]/20 focus:border-[#2E3192] transition-all"
                placeholder="Nhập mật khẩu đang dùng"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-muted my-1"></div>

          {/* Mật khẩu mới */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Mật khẩu mới <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2E3192]/20 focus:border-[#2E3192] transition-all"
                placeholder="Nhập mật khẩu an toàn mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mật khẩu nên dài ít nhất 8 ký tự, bao gồm số và chữ cái.</p>
          </div>

          {/* Nhập lại mật khẩu mới */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-foreground">Nhập lại mật khẩu mới <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2E3192]/20 focus:border-[#2E3192] transition-all"
                placeholder="Xác nhận lại mật khẩu vừa nhập"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Mật khẩu nhập lại không khớp!</p>
            )}
            {confirmPassword && newPassword === confirmPassword && currentPassword && (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={12}/> Hợp lệ</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#F7941D] hover:bg-[#D4780F] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 transition-all"
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
