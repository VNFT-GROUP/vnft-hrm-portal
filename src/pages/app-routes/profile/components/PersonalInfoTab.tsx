import { User, FileText, Home, Map } from "lucide-react";
import { motion, type Variants } from "framer-motion";

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
        <SectionHeader icon={<User size={18} />} title="Thông tin cơ bản" />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div><Label>Họ Tên</Label><Value>Trương Thành Nhân</Value></div>
          <div><Label>Tên Tiếng Anh</Label><Value>Ethan</Value></div>
          <div><Label>Mã NV</Label><Value>VNSGN090</Value></div>
          <div><Label>Giới tính</Label><Value>Nam</Value></div>
          <div><Label>Ngày sinh</Label><Value>2003-03-19</Value></div>
          <div><Label>Hôn nhân</Label><Value>Độc thân</Value></div>
          <div><Label>Nơi sinh</Label><Value>Hồ Chí Minh, VN</Value></div>
          <div><Label>Nguyên quán</Label><Value>—</Value></div>
          <div><Label>Quốc tịch</Label><Value>Việt Nam</Value></div>
          <div><Label>Tôn giáo</Label><Value>Phật giáo</Value></div>
          <div><Label>Dân tộc</Label><Value>Kinh</Value></div>
        </div>
      </motion.div>

      {/* Giấy tờ tùy thân */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<FileText size={18} />} title="Giấy tờ tùy thân" />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>Số CCCD</Label><Value>079203000285</Value></div>
          <div><Label>Ngày cấp</Label><Value>2021-12-20</Value></div>
          <div className="col-span-2"><Label>Nơi cấp</Label><Value>Cục cảnh sát quản lý hành chính về trật tự xã hội</Value></div>
        </div>
      </motion.div>

      {/* Địa chỉ thường trú */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Home size={18} />} title="Địa chỉ thường trú" />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>Số nhà, đường</Label><Value>165/75K Tôn Thất Thuyết</Value></div>
          <div><Label>Phường / Xã</Label><Value>Phường 15</Value></div>
          <div><Label>Quận / Huyện</Label><Value>Quận 4</Value></div>
          <div className="col-span-2"><Label>Tỉnh / Thành</Label><Value>Thành phố Hồ Chí Minh</Value></div>
        </div>
      </motion.div>

      {/* Chỗ ở hiện nay */}
      <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
        <SectionHeader icon={<Map size={18} />} title="Chỗ ở hiện nay" />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="col-span-2"><Label>Số nhà, đường</Label><Value>165/75K Tôn Thất Thuyết</Value></div>
          <div><Label>Phường / Xã</Label><Value>Phường 15</Value></div>
          <div><Label>Quận / Huyện</Label><Value>Quận 4</Value></div>
          <div className="col-span-2"><Label>Tỉnh / Thành</Label><Value>Thành phố Hồ Chí Minh</Value></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
