import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { m  } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfileHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useContext(ProfileContext);
  const session = useAuthStore(state => state.session);

  if (!profile) return null;

  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border mb-6 relative overflow-hidden group/header hover:shadow-md transition-all animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Floating Ambient Blobs */}
      <m.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-10 w-40 h-40 bg-[#2E3192] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"
      />
      <m.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-10 right-32 w-32 h-32 bg-[#F7941D] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar Placeholder */}
        <m.div 
          drag 
          dragConstraints={{ top: 0, left: 0, bottom: 0, right: 0 }}
          dragElastic={0.4}
          whileTap={{ cursor: "grabbing", scale: 0.95 }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted shadow-[0_0_0_4px_white,0_4px_20px_rgba(0,0,0,0.08)] shrink-0 flex items-center justify-center text-4xl relative z-10 cursor-grab group-hover/header:shadow-[0_0_0_4px_white,0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300"
        >
          <div className="w-full h-full overflow-hidden rounded-full pointer-events-none group-hover/header:scale-110 transition-transform duration-500">
            {profile.avatarUrl ? (
               <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-contain bg-muted" />
            ) : (
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.englishName || profile.fullName}`} alt={profile.fullName} className="w-full h-full object-contain bg-muted" />
            )}
          </div>
        </m.div>
        
        {/* Basic Info */}
        <div className="flex-1 pb-2 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{profile.fullName || "---"} {profile.englishName ? `(${profile.englishName})` : ""}</h1>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
              {profile.employeeCode || "---"}
            </span>
            {profile.active ? (
              <span className="px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-semibold">
                {t("profile.workingStatus.active", { defaultValue: "Đang làm việc" })}
              </span>
            ) : (
              <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold">
                {t("profile.workingStatus.inactive", { defaultValue: "Đã nghỉ việc" })}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Briefcase size={16} className="text-muted-foreground" />
              <span>{profile.positionName || "Chưa có vị trí"} - {profile.departmentName || "Phòng chưa xác định"}</span>
            </div>
            {profile.username && (
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail size={16} className="text-muted-foreground" />
              <span>{profile.username}</span>
            </div>
            )}
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone size={16} className="text-muted-foreground" />
              <span>{profile.phoneNumber || "---"}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MapPin size={16} className="text-muted-foreground" />
              <span>{profile.currentCity || "---"}</span>
            </div>
          </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-3 shrink-0">
            <m.button 
              onClick={() => navigate('/app/profile/edit')}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="group relative px-4 py-2 rounded-lg font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 z-10 flex items-center justify-center gap-2 w-full md:w-auto bg-[#2E3192] hover:bg-[#2E3192]/90 focus:ring-[#2E3192]"
            >
              {session?.requiredProfileCompleted === false && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-destructive border-2 border-background"></span>
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 20h9"/><path d="M16 4a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L16 4Z"/></svg>
              <span className="text-sm">
                {t("profile.editBtn", { defaultValue: "Cập nhật hồ sơ" })}
              </span>
            </m.button>
          </div>
        </div>
      </div>
    </div>
  );
}
