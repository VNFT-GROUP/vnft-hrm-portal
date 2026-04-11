import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { currentUserProfileService } from "@/services/user/currentUserProfileService";
import type { UserProfileResponse } from "@/types/user/UserProfileResponse";
import { ProfileContext } from "./contexts/ProfileContext";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoTab from "./components/PersonalInfoTab";
import FamilyEduTab from "./components/FamilyEduTab";
import BankAndDocsTab from "./components/BankAndDocsTab";
import SalaryTab from "./components/SalaryTab";
import { User, GraduationCap, FileText, Banknote, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await currentUserProfileService.getCurrentUserProfile();
        setProfile(res.data || null);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const tabs = [
    { id: "personal", label: t('profile.tabs.personal'), icon: <User size={16} /> },
    { id: "family-edu", label: t('profile.tabs.familyEdu'), icon: <GraduationCap size={16} /> },
    { id: "bank-docs", label: t('profile.tabs.bankDocs'), icon: <FileText size={16} /> },
    { id: "salary", label: t('profile.tabs.salary'), icon: <Banknote size={16} /> },
  ];

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      <div className="p-4 md:p-6 w-full max-w-[1400px] mx-auto min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Overview Header */}
        <ProfileHeader />

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 md:gap-4 mb-6 pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out whitespace-nowrap border active:scale-95 ${
                isActive
                  ? "bg-[#2E3192] text-white border-[#2E3192] shadow-md shadow-[#2E3192]/30 scale-100"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-border hover:scale-[1.02]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="w-full">
        {activeTab === "personal" && <PersonalInfoTab />}
        {activeTab === "family-edu" && <FamilyEduTab />}
        {activeTab === "bank-docs" && <BankAndDocsTab />}
        {activeTab === "salary" && <SalaryTab />}
      </div>
    </div>
  </ProfileContext.Provider>
  );
}
