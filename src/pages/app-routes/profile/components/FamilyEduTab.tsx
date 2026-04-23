import { GraduationCap, Users } from "lucide-react";
import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { useTranslation } from "react-i18next";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold text-foreground wrap-break-word">{children || "—"}</div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
    <div className="p-1.5 bg-[#F7941D]/10 text-[#F7941D] rounded group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-base font-bold text-[#1E2062]">{title}</h3>
  </div>
);

export default function FamilyEduTab() {
  const { t } = useTranslation();
  const { profile } = useContext(ProfileContext);

  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      
      {/* Trình độ học vấn */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1 lg:col-span-2">
        <SectionHeader icon={<GraduationCap size={18} />} title={t("profile.fields.education", { defaultValue: "Trình độ học vấn" })} />
        <div className="space-y-6">
          {profile.educationRecords && profile.educationRecords.length > 0 ? (
             profile.educationRecords.map((edu, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div><Label>{t("profile.fields.eduLevel", { defaultValue: "Trình độ" })}</Label><Value>{edu.educationLevel}</Value></div>
                  <div><Label>{t("profile.fields.institutionName", { defaultValue: "Nơi đào tạo" })}</Label><Value>{edu.institutionName}</Value></div>
                  <div><Label>{t("profile.fields.major", { defaultValue: "Chuyên ngành" })}</Label><Value>{edu.major}</Value></div>
                  <div><Label>{t("profile.fields.eduTime", { defaultValue: "Thời gian" })}</Label><Value>{edu.fromDate ? `${edu.fromDate} - ${edu.toDate || t("profile.salaryTab.present")}` : '—'}</Value></div>
                </div>
             ))
          ) : (
             <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium text-sm">Chưa có dữ liệu học vấn</p>
             </div>
          )}
        </div>
      </div>

      {/* Thông tin gia đình */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1 lg:col-span-2">
        <SectionHeader icon={<Users size={18} />} title={t("profile.fields.dependentsInfo", { defaultValue: "Thông tin người phụ thuộc / Gia đình" })} />
        <div className="space-y-6 mt-4">
          {profile.dependents && profile.dependents.length > 0 ? (
             profile.dependents.map((dep, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-y-4 gap-x-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div><Label>Họ và tên</Label><Value>{dep.dependentFullName}</Value></div>
                  <div><Label>Mối quan hệ</Label><Value>{dep.dependentRelationship}</Value></div>
                  <div><Label>Ngày sinh</Label><Value>{dep.dependentDateOfBirth}</Value></div>
                  <div><Label>Số ĐT</Label><Value>{dep.dependentPhoneNumber}</Value></div>
                  <div><Label>Căn cước</Label><Value>{dep.dependentIdentityNumber}</Value></div>
                </div>
             ))
          ) : (
             <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-xl border border-dashed border-border">
                <Users size={32} className="text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground font-medium text-sm">Chưa có người phụ thuộc</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
