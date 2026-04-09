import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ProfileHeader() {
  const { t } = useTranslation();
  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border mb-6 relative overflow-hidden group/header hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Floating Ambient Blobs */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-10 w-40 h-40 bg-[#2E3192] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-10 right-32 w-32 h-32 bg-[#F7941D] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar Placeholder */}
        <motion.div 
          drag 
          dragConstraints={{ top: 0, left: 0, bottom: 0, right: 0 }}
          dragElastic={0.4}
          whileTap={{ cursor: "grabbing", scale: 0.95 }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted shadow-[0_0_0_4px_white,0_4px_20px_rgba(0,0,0,0.08)] flex-shrink-0 flex items-center justify-center text-4xl relative z-10 cursor-grab group-hover/header:shadow-[0_0_0_4px_white,0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300"
        >
          <div className="w-full h-full overflow-hidden rounded-full pointer-events-none group-hover/header:scale-110 transition-transform duration-500">
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Ethan" 
              alt="Trương Thành Nhân" 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.div>
        
        {/* Basic Info */}
        <div className="flex-1 pb-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">Trương Thành Nhân</h1>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
              VNSGN090
            </span>
            <span className="px-3 py-1 bg-[#F7941D]/10 text-[#F7941D] rounded-full text-xs font-semibold">
              {t("profile.workingStatus.active")}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Briefcase size={16} className="text-muted-foreground" />
              <span>Phòng HR & ADM</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail size={16} className="text-muted-foreground" />
              <span>adm.it@vnftgroup.com</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone size={16} className="text-muted-foreground" />
              <span>0966724522</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MapPin size={16} className="text-muted-foreground" />
              <span>Hồ Chí Minh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
