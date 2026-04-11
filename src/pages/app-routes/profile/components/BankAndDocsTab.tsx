import { CreditCard, FileImage } from "lucide-react";
import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { useTranslation } from "react-i18next";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold text-foreground break-words">{children || "—"}</div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
    <div className="p-1.5 bg-[#10b981]/10 text-[#10b981] rounded group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-base font-bold text-[#1E2062]">{title}</h3>
  </div>
);

export default function BankAndDocsTab() {
  const { t } = useTranslation();
  const { profile } = useContext(ProfileContext);

  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      
      {/* Thông tin ngân hàng */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<CreditCard size={18} />} title={t("profile.fields.bankInfo", { defaultValue: "Thông tin ngân hàng" })} />
        <div className="flex flex-col gap-6">
          {profile.bankInformations && profile.bankInformations.length > 0 ? (
            profile.bankInformations.map((bank, idx) => (
               <div key={idx} className="flex flex-col gap-6 border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="p-4 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl text-white shadow-md relative overflow-hidden group/card hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 group-hover/card:opacity-20 transition-all duration-500">
                      <CreditCard size={64} />
                    </div>
                    <div className="mb-6">
                      <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Số Tài Khoản</div>
                      <div className="text-2xl font-mono tracking-widest">{bank.bankAccountNumber || "—"}</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Tên Tài Khoản</div>
                      <div className="text-lg tracking-widest uppercase">{bank.bankAccountName || "—"}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 px-2">
                    <div><Label>Ngân hàng</Label><Value>{bank.bankName}</Value></div>
                    <div><Label>Chi nhánh</Label><Value>{bank.bankBranch}</Value></div>
                  </div>
               </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-xl border border-dashed border-border h-[200px]">
              <CreditCard size={32} className="text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground font-medium text-sm">Chưa có tài khoản nhận lương</p>
            </div>
          )}
        </div>
      </div>

      {/* Hồ sơ đính kèm */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<FileImage size={18} />} title={t("profile.fields.documents", { defaultValue: "Hồ sơ cá nhân" })} />
        <div className="space-y-6">
          
          {/* CCCD Mặt trước */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">CCCD mặt trước</span>
            </div>
            {profile.citizenIdFrontImageUrl ? (
               <div className="w-full h-[180px] rounded-xl overflow-hidden shadow-sm border border-border">
                  <img src={profile.citizenIdFrontImageUrl} alt="CCCD Mặt trước" className="w-full h-full object-cover" />
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-xl border border-dashed border-border h-[140px]">
                 <FileImage size={24} className="text-slate-300 mb-2" />
                 <p className="text-muted-foreground font-medium text-sm">Chưa cập nhật ảnh</p>
               </div>
            )}
          </div>

          {/* CCCD Mặt sau */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">CCCD mặt sau</span>
            </div>
            {profile.citizenIdBackImageUrl ? (
               <div className="w-full h-[180px] rounded-xl overflow-hidden shadow-sm border border-border">
                  <img src={profile.citizenIdBackImageUrl} alt="CCCD Mặt sau" className="w-full h-full object-cover" />
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-xl border border-dashed border-border h-[140px]">
                 <FileImage size={24} className="text-slate-300 mb-2" />
                 <p className="text-muted-foreground font-medium text-sm">Chưa cập nhật ảnh</p>
               </div>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}
