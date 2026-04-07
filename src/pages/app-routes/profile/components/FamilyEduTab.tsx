import { GraduationCap, Users, UserPlus } from "lucide-react";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold text-slate-800 break-words">{children || "—"}</div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
    <div className="p-1.5 bg-[#F7941D]/10 text-[#F7941D] rounded group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-base font-bold text-[#1E2062]">{title}</h3>
  </div>
);

export default function FamilyEduTab() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      
      {/* Trình độ học vấn */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 lg:col-span-2">
        <SectionHeader icon={<GraduationCap size={18} />} title="Trình độ học vấn" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
          <div><Label>Trình độ học vấn</Label><Value>Trung cấp nghề</Value></div>
          <div><Label>Nơi đào tạo</Label><Value>—</Value></div>
          <div><Label>Chuyên ngành</Label><Value>—</Value></div>
        </div>
      </div>

      {/* Thông tin gia đình */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Users size={18} />} title="Thông tin gia đình" />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div><Label>Số người phụ thuộc</Label><Value>0</Value></div>
          <div><Label>Tình trạng con cái</Label><Value>Chưa có dữ liệu</Value></div>
        </div>
      </div>

      {/* Chi tiết thành viên gia đình */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
        <SectionHeader icon={<UserPlus size={18} />} title="Chi tiết thành viên gia đình" />
        
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 h-[150px]">
          <Users size={32} className="text-slate-300 mb-2" />
          <p className="text-slate-500 font-medium text-sm">Chưa có dữ liệu</p>
        </div>
      </div>

    </div>
  );
}
