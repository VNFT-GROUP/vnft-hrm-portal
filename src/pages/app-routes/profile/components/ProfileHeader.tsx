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
            {profile.citizenIdFrontImageUrl ? (
               <img src={profile.citizenIdFrontImageUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
               <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.englishName || profile.fullName}`} alt={profile.fullName} className="w-full h-full object-cover" />
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
              <span className="px-3 py-1 bg-[#F7941D]/10 text-[#F7941D] rounded-full text-xs font-semibold">
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
              <span>{profile.username}@vnftgroup.com</span>
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
          
          <div className="flex flex-col items-end gap-2">
            <m.button 
              onClick={() => navigate('/app/profile/edit')}
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              className={`group relative overflow-hidden px-5 py-2.5 rounded-full font-semibold text-white shadow-md border transition-all self-start flex items-center justify-center bg-size-[200%_auto] hover:bg-position-[100%_0] duration-500 ease-out z-10 ${
                session?.requiredProfileCompleted === false
                ? "bg-linear-to-r from-red-600 via-rose-500 to-red-600 border-red-400 shadow-red-500/50 animate-[pulse_2s_ease-in-out_infinite]"
                : "bg-linear-to-r from-[#2E3192] via-[#4d51d8] to-[#2E3192] border-white/10 shadow-[#2E3192]/20"
              }`}
            >
              {/* Gleam Shimmer Effect */}
              <span className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out ${
                 session?.requiredProfileCompleted === false ? "bg-linear-to-r from-transparent via-white/50 to-transparent" : "bg-linear-to-r from-transparent via-white/25 to-transparent"
              }`}></span>

              <span className="relative flex items-center gap-2 text-sm tracking-wide">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16 4a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L16 4Z"/></svg>
                {t("profile.editBtn", { defaultValue: "Cập nhật hồ sơ" })}
              </span>
            </m.button>
            {session?.requiredProfileCompleted === false && (
              <span className="text-xs font-bold text-red-500 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full animate-bounce">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {t("profile.requiredUpdateHint", { defaultValue: "Bắt buộc điền đầy đủ!" })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
