import { User, FileText, Home, Map } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold text-foreground break-words">{children || "—"}</div>
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Thông tin cơ bản */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<User size={18} />} title={t("profile.fields.basicInfo")} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div><Label>{t("profile.fields.fullName")}</Label><Value>Trương Thành Nhân</Value></div>
          <div><Label>{t("profile.fields.engName")}</Label><Value>Ethan</Value></div>
          <div><Label>{t("profile.fields.empId")}</Label><Value>VNSGN090</Value></div>
          <div><Label>{t("profile.fields.gender")}</Label><Value>Nam</Value></div>
          <div><Label>{t("profile.fields.dob")}</Label><Value>2003-03-19</Value></div>
          <div><Label>{t("profile.fields.maritalStatus")}</Label><Value>Độc thân</Value></div>
          <div><Label>{t("profile.fields.birthPlace")}</Label><Value>Hồ Chí Minh, VN</Value></div>
          <div><Label>{t("profile.fields.hometown")}</Label><Value>—</Value></div>
          <div><Label>{t("profile.fields.nationality")}</Label><Value>Việt Nam</Value></div>
          <div><Label>{t("profile.fields.religion")}</Label><Value>Phật giáo</Value></div>
          <div><Label>{t("profile.fields.ethnicity")}</Label><Value>Kinh</Value></div>
        </div>
      </motion.div>

      {/* Giấy tờ tùy thân */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<FileText size={18} />} title={t("profile.fields.idDocs")} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>{t("profile.fields.idNumber")}</Label><Value>079203000285</Value></div>
          <div><Label>{t("profile.fields.issueDate")}</Label><Value>2021-12-20</Value></div>
          <div className="col-span-2"><Label>{t("profile.fields.issuePlace")}</Label><Value>Cục cảnh sát quản lý hành chính về trật tự xã hội</Value></div>
        </div>
      </motion.div>

      {/* Địa chỉ thường trú */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Home size={18} />} title={t("profile.fields.permanentAddress")} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>{t("profile.fields.street")}</Label><Value>165/75K Tôn Thất Thuyết</Value></div>
          <div><Label>{t("profile.fields.ward")}</Label><Value>Phường 15</Value></div>
          <div><Label>{t("profile.fields.district")}</Label><Value>Quận 4</Value></div>
          <div className="col-span-2"><Label>{t("profile.fields.province")}</Label><Value>Thành phố Hồ Chí Minh</Value></div>
        </div>
      </motion.div>

      {/* Chỗ ở hiện nay */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Map size={18} />} title={t("profile.fields.currentAddress")} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>{t("profile.fields.street")}</Label><Value>165/75K Tôn Thất Thuyết</Value></div>
          <div><Label>{t("profile.fields.ward")}</Label><Value>Phường 15</Value></div>
          <div><Label>{t("profile.fields.district")}</Label><Value>Quận 4</Value></div>
          <div className="col-span-2"><Label>{t("profile.fields.province")}</Label><Value>Thành phố Hồ Chí Minh</Value></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
