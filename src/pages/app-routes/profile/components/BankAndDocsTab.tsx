import { CreditCard, FileImage, UploadCloud } from "lucide-react";

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      
      {/* Thông tin ngân hàng */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<CreditCard size={18} />} title="Thông tin ngân hàng" />
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white shadow-md relative overflow-hidden group/card hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 group-hover/card:opacity-20 transition-all duration-500">
              <CreditCard size={64} />
            </div>
            <div className="mb-6">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Số Tài Khoản</div>
              <div className="text-2xl font-mono tracking-widest">1380 306 330</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Tên Tài Khoản</div>
              <div className="text-lg tracking-widest uppercase">TRUONG THANH NHAN</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 px-2">
            <div><Label>Ngân hàng</Label><Value>BIDV (ĐT và PT VN)</Value></div>
            <div><Label>Chi nhánh</Label><Value>CN BEN NGHE PGD NGUYEN VAN CU</Value></div>
          </div>
        </div>
      </div>

      {/* Hồ sơ đính kèm */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<FileImage size={18} />} title="Hồ sơ cá nhân" />
        <div className="space-y-6">
          
          {/* CCCD Mặt trước */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">CCCD mặt trước</span>
              <button className="flex items-center gap-1.5 text-xs text-[#2E3192] font-semibold hover:bg-[#2E3192]/10 px-2 py-1 rounded transition-colors">
                <UploadCloud size={14} /> Upload
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-xl border border-dashed border-border h-[140px] hover:bg-muted hover:border-[#2E3192]/50 hover:shadow-inner transition-all duration-300 group/upload cursor-pointer">
              <FileImage size={24} className="text-slate-300 mb-2 group-hover/upload:scale-110 group-hover/upload:text-muted-foreground transition-transform duration-300" />
              <p className="text-muted-foreground font-medium text-sm group-hover/upload:text-[#2E3192] transition-colors duration-300">Chưa có ảnh</p>
            </div>
          </div>

          {/* CCCD Mặt sau */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">CCCD mặt sau</span>
              <button className="flex items-center gap-1.5 text-xs text-[#2E3192] font-semibold hover:bg-[#2E3192]/10 px-2 py-1 rounded transition-colors">
                <UploadCloud size={14} /> Upload
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-xl border border-dashed border-border h-[140px] hover:bg-muted hover:border-[#2E3192]/50 hover:shadow-inner transition-all duration-300 group/upload cursor-pointer">
              <FileImage size={24} className="text-slate-300 mb-2 group-hover/upload:scale-110 group-hover/upload:text-muted-foreground transition-transform duration-300" />
              <p className="text-muted-foreground font-medium text-sm group-hover/upload:text-[#2E3192] transition-colors duration-300">Chưa có ảnh</p>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
