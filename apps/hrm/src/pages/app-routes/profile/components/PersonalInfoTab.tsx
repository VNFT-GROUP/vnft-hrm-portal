import { User, FileText, Home, Map } from "lucide-react";
import { m, type Variants  } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold text-foreground wrap-break-word">{children || "—"}</div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
    <div className="p-1.5 bg-primary/10 text-primary rounded group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-base font-bold text-card-foreground">{title}</h3>
  </div>
);

export default function PersonalInfoTab() {
  const { t } = useTranslation();
  const { profile } = useContext(ProfileContext);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!profile) return null;

  return (
    <m.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Thông tin cơ bản */}
      <m.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<User size={18} />} title={t("profile.fields.basicInfo", { defaultValue: "Thông tin cơ bản" })} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div><Label>{t("profile.fields.fullName", { defaultValue: "Họ và tên" })}</Label><Value>{profile.fullName}</Value></div>
          <div><Label>{t("profile.fields.engName", { defaultValue: "Tên tiếng Anh" })}</Label><Value>{profile.englishName}</Value></div>
          <div><Label>{t("profile.fields.empId", { defaultValue: "Mã nhân viên" })}</Label><Value>{profile.employeeCode}</Value></div>
          <div><Label>{t("profile.fields.gender", { defaultValue: "Giới tính" })}</Label><Value>{profile.gender === 'MALE' ? t('profile.values.male') : profile.gender === 'FEMALE' ? t('profile.values.female') : t('profile.values.other')}</Value></div>
          <div><Label>{t("profile.fields.dob", { defaultValue: "Ngày sinh" })}</Label><Value>{profile.dateOfBirth?.substring(0,10)}</Value></div>
          <div><Label>{t("profile.fields.maritalStatus", { defaultValue: "Hôn nhân" })}</Label><Value>{profile.maritalStatus === 'MARRIED' ? t('profile.values.married') : t('profile.values.single')}</Value></div>
          <div><Label>{t("profile.fields.birthPlace", { defaultValue: "Nơi sinh" })}</Label><Value>{profile.placeOfBirth}</Value></div>
          <div><Label>{t("profile.fields.hometown", { defaultValue: "Quê quán" })}</Label><Value>{profile.placeOfOrigin}</Value></div>
          <div><Label>{t("profile.fields.nationality", { defaultValue: "Quốc tịch" })}</Label><Value>{profile.nationality}</Value></div>
          <div><Label>{t("profile.fields.religion", { defaultValue: "Tôn giáo" })}</Label><Value>{profile.religion}</Value></div>
          <div><Label>{t("profile.fields.ethnicity", { defaultValue: "Dân tộc" })}</Label><Value>{profile.ethnicity}</Value></div>
        </div>
      </m.div>

      {/* Giấy tờ tùy thân */}
      <m.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<FileText size={18} />} title={t("profile.fields.idDocs", { defaultValue: "Giấy tờ tùy thân" })} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>{t("profile.fields.idNumber", { defaultValue: "Số CCCD" })}</Label><Value>{profile.citizenIdNumber}</Value></div>
          <div><Label>{t("profile.fields.issueDate", { defaultValue: "Ngày cấp" })}</Label><Value>{profile.citizenIdIssueDate}</Value></div>
          <div className="col-span-2"><Label>{t("profile.fields.issuePlace", { defaultValue: "Nơi cấp" })}</Label><Value>{profile.citizenIdIssuePlace}</Value></div>
        </div>
      </m.div>

      {/* Địa chỉ thường trú */}
      <m.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Home size={18} />} title={t("profile.fields.permanentAddress", { defaultValue: "Địa chỉ thường trú" })} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>{t("profile.fields.street", { defaultValue: "Số nhà/Đường" })}</Label><Value>{profile.permanentAddress}</Value></div>
          <div className="col-span-2"><Label>{t("profile.fields.province", { defaultValue: "Tỉnh/Thành phố" })}</Label><Value>{profile.permanentCity}</Value></div>
        </div>
      </m.div>

      {/* Chỗ ở hiện nay */}
      <m.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Map size={18} />} title={t("profile.fields.currentAddress", { defaultValue: "Chỗ ở hiện tại" })} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>{t("profile.fields.street", { defaultValue: "Số nhà/Đường" })}</Label><Value>{profile.currentAddress}</Value></div>
          <div className="col-span-2"><Label>{t("profile.fields.province", { defaultValue: "Tỉnh/Thành phố" })}</Label><Value>{profile.currentCity}</Value></div>
        </div>
      </m.div>

      {/* CV / Hồ sơ năng lực */}
      <m.div variants={itemVariants} className="col-span-1 lg:col-span-2 bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<FileText size={18} />} title={t("profile.fields.cv", { defaultValue: "CV / Hồ sơ năng lực (PDF)" })} />
        <div className="w-full">
            {profile.cvUrl ? (
               <div className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-sm border border-border bg-muted/20">
                  <iframe 
                    src={`${profile.cvUrl}#toolbar=0`} 
                    title="CV / Hồ sơ năng lực" 
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 bg-white shadow-sm border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                      <FileText size={14} /> Mở tab mới
                    </a>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/50 rounded-xl border border-dashed border-border h-[200px]">
                 <FileText size={32} className="text-slate-300 mb-2" />
                 <p className="text-muted-foreground font-medium text-sm">Chưa có CV đính kèm</p>
               </div>
            )}
        </div>
      </m.div>
    </m.div>
  );
}
