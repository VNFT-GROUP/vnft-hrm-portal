import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Shield, BookOpen, Briefcase, MapPin, Plus, Trash2, Users, Camera, Check, ChevronsUpDown, Info } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { currentUserProfileService } from "@/services/user/currentUserProfileService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { UpdateCurrentUserProfileRequest } from '@/types/user/UpdateCurrentUserProfileRequest';
import {
  ALL_COUNTRIES_SORTED as PROFILE_ALL_COUNTRIES_SORTED,
  ETHNICITIES_VN as PROFILE_ETHNICITIES_VN,
  GLOBAL_ETHNICITIES as PROFILE_GLOBAL_ETHNICITIES,
  getCountryNameForLocale,
  WORLD_RELIGIONS as PROFILE_WORLD_RELIGIONS,
} from "@/lib/profile-options";

type ProfileFormData = Partial<UpdateCurrentUserProfileRequest> & {
  fullName?: string;
  englishName?: string;
  attendanceCode?: string;
  employeeCode?: string;
};
function SearchableSelect({ options, value, onChange, placeholder, getTranslation }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string, getTranslation?: (val: string) => string }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  
  const displayValue = value ? (getTranslation ? getTranslation(value) : value) : t(placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger 
        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-sm text-foreground shadow-sm hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
      >
        <span className="truncate">{displayValue}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-xl w-[calc(100vw-2rem)] sm:w-[350px] md:w-[450px]" align="start">
        <Command>
          <CommandInput placeholder={t("editProfile.searchableSelect.searchPlaceholder", { defaultValue: "TÃ¬m kiáº¿m..." })} />
          <CommandList className="max-h-[350px]">
            <CommandEmpty>{t("editProfile.searchableSelect.noResults", { defaultValue: "KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£." })}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === opt ? "opacity-100" : "opacity-0"}`}
                  />
                  {getTranslation ? getTranslation(opt) : opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function EditProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [activeTab, setActiveTab] = useState("basic");

  const getCountryTranslation = (viName: string) => {
    return getCountryNameForLocale(viName, i18n.language);
  };

  // Common select styles matching Shadcn Input
  const selectClassName = "flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-card";

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState<ProfileFormData>({
     fullName: session?.fullName || "",
     englishName: session?.englishName || "",
     attendanceCode: "",
     employeeCode: session?.username || "", // Typically mapped to code
     phoneNumber: "",
     gender: session?.gender || "MALE",
     dateOfBirth: "",
     maritalStatus: "SINGLE",
     placeOfBirth: "",
     placeOfOrigin: "",
     nationality: "Viá»‡t Nam",
     religion: "KhÃ´ng",
     ethnicity: "Kinh",
     permanentAddress: "",
     permanentCity: "",
     currentAddress: "",
     currentCity: "",
     citizenIdNumber: "",
     citizenIdIssueDate: "",
     citizenIdIssuePlace: "",
     bankInformations: [{ bankAccountNumber: "", bankAccountName: "", bankName: "", bankBranch: "" }],
     dependents: [{ dependentRelationship: "", dependentFullName: "", dependentDateOfBirth: "", dependentPhoneNumber: "", dependentIdentityNumber: "", dependentTaxCode: "" }],
     educationRecords: [{ trainingMode: "", fromDate: "", toDate: "", major: "", educationLevel: "", institutionName: "" }],
     workExperiences: [{ fromMonth: "", toMonth: "", companyName: "", position: "", referencePerson: "", phoneNumber: "", jobDescription: "" }]
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const res = await currentUserProfileService.getCurrentUserProfile();
        if (res.data) {
           const d = res.data;
           setFormData((prev) => ({
             ...prev,
             fullName: d.fullName || prev.fullName,
             englishName: d.englishName || prev.englishName,
             attendanceCode: d.attendanceCode || "",
             employeeCode: d.employeeCode || prev.employeeCode,
             phoneNumber: d.phoneNumber || "",
             gender: d.gender || prev.gender,
             dateOfBirth: d.dateOfBirth?.substring(0, 10) || "",
             maritalStatus: d.maritalStatus || "SINGLE",
             placeOfBirth: d.placeOfBirth || "",
             placeOfOrigin: d.placeOfOrigin || "",
             nationality: d.nationality || "Viá»‡t Nam",
             religion: d.religion || "KhÃ´ng",
             ethnicity: d.ethnicity || "Kinh",
             permanentAddress: d.permanentAddress || "",
             permanentCity: d.permanentCity || "",
             currentAddress: d.currentAddress || "",
             currentCity: d.currentCity || "",
             citizenIdNumber: d.citizenIdNumber || "",
             citizenIdIssueDate: d.citizenIdIssueDate?.substring(0, 10) || "",
             citizenIdIssuePlace: d.citizenIdIssuePlace || "",
             citizenIdFrontImageUrl: d.citizenIdFrontImageUrl || "",
             citizenIdBackImageUrl: d.citizenIdBackImageUrl || "",
             bankInformations: d.bankInformations?.length ? d.bankInformations : prev.bankInformations,
             dependents: d.dependents?.length ? d.dependents : prev.dependents,
             educationRecords: d.educationRecords?.length ? d.educationRecords : prev.educationRecords,
             workExperiences: d.workExperiences?.length ? d.workExperiences : prev.workExperiences,
           }));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleTextChange = <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mandatory field validation
    if (!formData.employeeCode?.trim() || !formData.fullName?.trim() || !formData.dateOfBirth?.trim() || !formData.maritalStatus || !formData.phoneNumber?.trim() || !formData.currentAddress?.trim() || !formData.currentCity?.trim() || !formData.citizenIdNumber?.trim() || !formData.citizenIdIssueDate?.trim() || !formData.citizenIdIssuePlace?.trim()) {
      toast.error(t("editProfile.validation.missingInfoTitle", { defaultValue: "Thiáº¿u thÃ´ng tin báº¯t buá»™c" }), {
        description: t("editProfile.validation.missingInfoDesc", { defaultValue: "Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ thÃ´ng tin cho cÃ¡c trÆ°á»ng cÃ³ Ä‘Ã¡nh dáº¥u (*)." })
      });
      return;
    }

    // Auto-filter out empty template rows before submitting
    const payload = { ...formData };
    
    // Remove read-only UI tracking fields from the request payload
    delete payload.fullName;
    delete payload.englishName;
    delete payload.attendanceCode;
    delete payload.employeeCode;
    
    // Convert dates back to Instant-compatible format for Java backend
    if (payload.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(payload.dateOfBirth)) {
      payload.dateOfBirth = `${payload.dateOfBirth}T00:00:00Z`;
    }
    if (payload.citizenIdIssueDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.citizenIdIssueDate)) {
      payload.citizenIdIssueDate = `${payload.citizenIdIssueDate}T00:00:00Z`;
    }
    
    payload.bankInformations = payload.bankInformations?.filter(b => b.bankAccountNumber?.trim() || b.bankName?.trim());
    payload.dependents = payload.dependents?.filter(d => d.dependentFullName?.trim() || d.dependentRelationship?.trim());
    payload.educationRecords = payload.educationRecords?.filter(ed => ed.institutionName?.trim() || ed.major?.trim());
    payload.workExperiences = payload.workExperiences?.filter(w => w.companyName?.trim() || w.position?.trim());

    console.log("Submitting payload:", payload);
    setLoading(true);
    try {
      await currentUserProfileService.upsertCurrentUserProfile(payload as UpdateCurrentUserProfileRequest);
      toast.success(t("profile.updateSuccess", { defaultValue: "Cáº­p nháº­t há»“ sÆ¡ thÃ nh cÃ´ng" }), {
        description: t("editProfile.validation.updateSuccessDesc", { defaultValue: "ToÃ n bá»™ thÃ´ng tin cÃ¡ nhÃ¢n vÃ  lÃ½ lá»‹ch Ä‘Ã£ Ä‘Æ°á»£c lÆ°u trá»¯ an toÃ n." })
      });
      navigate("/app/profile");
    } catch (error) {
      console.error(error);
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(t("editProfile.validation.updateFailed", { defaultValue: "Cáº­p nháº­t tháº¥t báº¡i" }), {
        description: err?.response?.data?.message || err?.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi lÆ°u thÃ´ng tin"
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: t("editProfile.tabs.basic", { defaultValue: "ThÃ´ng tin cÆ¡ báº£n" }), icon: <User size={16} /> },
    { id: "contact", label: t("editProfile.tabs.contact", { defaultValue: "CÆ° trÃº & LiÃªn há»‡" }), icon: <MapPin size={16} /> },
    { id: "identity", label: t("editProfile.tabs.identity", { defaultValue: "CCCD & NgÃ¢n hÃ ng" }), icon: <Shield size={16} /> },
    { id: "education", label: t("editProfile.tabs.education", { defaultValue: "Há»c váº¥n" }), icon: <BookOpen size={16} /> },
    { id: "experience", label: t("editProfile.tabs.experience", { defaultValue: "Kinh nghiá»‡m" }), icon: <Briefcase size={16} /> },
    { id: "dependents", label: t("editProfile.tabs.dependents", { defaultValue: "NgÆ°á»i phá»¥ thuá»™c" }), icon: <Users size={16} /> },
  ];

  return (
    <div className="p-4 md:p-6 w-full min-h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate("/app/profile")}
            className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center bg-card border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("editProfile.header.title", { defaultValue: "Cáº­p nháº­t há»“ sÆ¡" })}</h1>
            <p className="text-sm text-muted-foreground">{t("editProfile.header.subtitle", { defaultValue: "Chá»‰nh sá»­a toÃ n bá»™ thÃ´ng tin cÃ¡ nhÃ¢n thuá»™c há»‡ thá»‘ng quáº£n trá»‹" })}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={loading || isFetching}
          className="rounded-xl bg-[#F7941D] hover:bg-[#D87D12] text-white shadow-md shadow-[#F7941D]/20 hover:shadow-[#F7941D]/40 transition-all gap-2 h-11 px-7 font-semibold"
        >
          <Save size={18} className={loading ? "opacity-50" : ""} /> 
          {loading ? t("editProfile.header.savingBtn", { defaultValue: "Äang lÆ°u..." }) : t("editProfile.header.saveBtn", { defaultValue: "LÆ°u thay Ä‘á»•i há»“ sÆ¡" })}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-[260px] shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap md:whitespace-normal text-left ${
                  isActive
                    ? "bg-[#2E3192] text-white shadow-md shadow-[#2E3192]/20 translate-x-0 md:translate-x-1"
                    : "bg-card text-muted-foreground border border-transparent hover:border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-background shadow-sm border border-border text-foreground'}`}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm p-6 lg:p-8 min-h-[600px]">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* THÃ”NG TIN CÆ  Báº¢N */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.basicInfo.title", { defaultValue: "ThÃ´ng tin cÆ¡ báº£n" })}</h2>
                  <p className="text-sm text-muted-foreground">{t("editProfile.basicInfo.desc", { defaultValue: "CÃ¡c thÃ´ng tin cÃ¡ nhÃ¢n vÃ  Ä‘á»‹nh danh cÆ¡ báº£n." })}</p>
                </div>
                
                {/* AVATAR UPLOAD */}
                <div className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-center gap-6 mb-8 bg-muted/20 p-5 rounded-2xl border border-border">
                  <div className="relative group cursor-pointer">
                     <div className="w-28 h-28 rounded-full bg-card border-4 border-background shadow-md overflow-hidden flex items-center justify-center shrink-0 text-muted-foreground group-hover:opacity-80 transition-opacity">
                        {session?.username ? (
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Ethan`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="opacity-20" />
                        )}
                     </div>
                     <button type="button" className="absolute bottom-1 right-1 p-2 bg-[#F7941D] hover:bg-[#E88915] text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-background">
                       <Camera size={14} />
                     </button>
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                     <h3 className="font-semibold text-foreground">{t("editProfile.basicInfo.avatarTitle", { defaultValue: "áº¢nh chÃ¢n dung" })}</h3>
                     <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">{t("editProfile.basicInfo.avatarHint", { defaultValue: "Äá»‹nh dáº¡ng há»— trá»£: JPEG, PNG, WEBP. KÃ­ch thÆ°á»›c tá»· lá»‡ 1:1, dung lÆ°á»£ng tá»‘i Ä‘a 5MB." })}</p>
                     <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl text-xs font-medium bg-card hover:bg-[#2E3192]/5 hover:text-[#2E3192] hover:border-[#2E3192]/30 transition-colors">
                        {t("editProfile.basicInfo.uploadAvatarBtn", { defaultValue: "Chá»n tá»‡p táº£i lÃªn" })}
                     </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.attendanceCode", { defaultValue: "MÃ£ cháº¥m cÃ´ng" })}</Label>
                    <Input
                      value={formData.attendanceCode || ""}
                      placeholder={t("editProfile.basicInfo.attendanceCodePlaceholder", { defaultValue: "Nháº­p mÃ£ cháº¥m cÃ´ng" })}
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.employeeCode", { defaultValue: "MÃ£ nhÃ¢n viÃªn (Báº¯t buá»™c)" })}</Label>
                    <Input 
                      value={formData.employeeCode}
                      onChange={(e) => handleTextChange("employeeCode", e.target.value)}
                      placeholder={t("editProfile.basicInfo.employeeCodePlaceholder", { defaultValue: "VD: VNSGN001" })}
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.englishName", { defaultValue: "TÃªn tiáº¿ng Anh (English Name)" })}</Label>
                    <Input 
                      value={formData.englishName}
                      onChange={(e) => handleTextChange("englishName", e.target.value)}
                      placeholder={t("editProfile.basicInfo.englishNamePlaceholder", { defaultValue: "Nháº­p tÃªn Tiáº¿ng Anh" })} 
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.fullName", { defaultValue: "Há» vÃ  TÃªn" })} <span className="text-destructive">*</span></Label>
                    <Input 
                      value={formData.fullName}
                      onChange={(e) => handleTextChange("fullName", e.target.value)}
                      placeholder={t("editProfile.basicInfo.fullNamePlaceholder", { defaultValue: "Nháº­p há» vÃ  tÃªn Ä‘áº§y Ä‘á»§" })} 
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.phoneNumber", { defaultValue: "Sá»‘ Ä‘iá»‡n thoáº¡i" })} <span className="text-destructive">*</span></Label>
                    <Input 
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleTextChange("phoneNumber", e.target.value)}
                      placeholder={t("editProfile.basicInfo.phoneNumberPlaceholder", { defaultValue: "VD: 09xxxxxxxx" })} 
                      className="h-11 rounded-xl bg-muted/40 border-transparent hover:border-border hover:bg-muted/60 focus:bg-card focus:border-ring transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                     <Label>{t("editProfile.basicInfo.dob", { defaultValue: "NgÃ y sinh (Date of Birth)" })} <span className="text-destructive">*</span></Label>
                     <Input 
                       type="date"
                       value={formData.dateOfBirth} 
                       onChange={(e) => handleTextChange("dateOfBirth", e.target.value)}
                       className="h-11 rounded-xl" 
                     />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.gender", { defaultValue: "Giá»›i tÃ­nh" })}</Label>
                    <select 
                      className={selectClassName} 
                      value={formData.gender} 
                      onChange={(e) => handleTextChange("gender", e.target.value as ProfileFormData['gender'])}
                    >
                       <option value="MALE">{t("editProfile.basicInfo.genderMale", { defaultValue: "Nam" })}</option>
                       <option value="FEMALE">{t("editProfile.basicInfo.genderFemale", { defaultValue: "Ná»¯" })}</option>
                       <option value="OTHER">{t("editProfile.basicInfo.genderOther", { defaultValue: "Há»‡ khÃ¡c" })}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.maritalStatus", { defaultValue: "TÃ¬nh tráº¡ng hÃ´n nhÃ¢n" })} <span className="text-destructive">*</span></Label>
                    <select 
                      className={selectClassName} 
                      value={formData.maritalStatus} 
                      onChange={(e) => handleTextChange("maritalStatus", e.target.value as ProfileFormData['maritalStatus'])}
                    >
                       <option value="SINGLE">{t("editProfile.basicInfo.statusSingle", { defaultValue: "Äá»™c thÃ¢n" })}</option>
                       <option value="MARRIED">{t("editProfile.basicInfo.statusMarried", { defaultValue: "ÄÃ£ káº¿t hÃ´n" })}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.placeOfBirth", { defaultValue: "NÆ¡i sinh" })}</Label>
                    <Input value={formData.placeOfBirth} onChange={(e) => handleTextChange("placeOfBirth", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.hometown", { defaultValue: "QuÃª quÃ¡n" })}</Label>
                    <Input value={formData.placeOfOrigin} onChange={(e) => handleTextChange("placeOfOrigin", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:col-span-2">
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.nationality", { defaultValue: "Quá»‘c tá»‹ch" })}</Label>
                       <SearchableSelect 
                         options={PROFILE_ALL_COUNTRIES_SORTED} 
                         value={formData.nationality || "Viá»‡t Nam"} 
                         onChange={(v) => handleTextChange("nationality", v)} 
                         placeholder={t("editProfile.basicInfo.nationalityPlaceholder", { defaultValue: "Chá»n Quá»‘c tá»‹ch..." })} 
                         getTranslation={getCountryTranslation}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.ethnicity", { defaultValue: "DÃ¢n tá»™c" })}</Label>
                       <SearchableSelect 
                         options={[...PROFILE_ETHNICITIES_VN, ...PROFILE_GLOBAL_ETHNICITIES, "KhÃ¡c"]} 
                         value={formData.ethnicity || "Kinh"} 
                         onChange={(v) => handleTextChange("ethnicity", v)} 
                         placeholder={t("editProfile.basicInfo.ethnicityPlaceholder", { defaultValue: "Chá»n DÃ¢n tá»™c..." })} 
                         getTranslation={(opt) => t(`dropdowns.ethnicity.${opt}`, { defaultValue: opt })}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.religion", { defaultValue: "TÃ´n giÃ¡o" })}</Label>
                       <SearchableSelect 
                         options={PROFILE_WORLD_RELIGIONS} 
                         value={formData.religion || "KhÃ´ng"} 
                         onChange={(v) => handleTextChange("religion", v)} 
                         placeholder={t("editProfile.basicInfo.religionPlaceholder", { defaultValue: "Chá»n TÃ´n giÃ¡o..." })} 
                         getTranslation={(opt) => t(`dropdowns.religion.${opt}`, { defaultValue: opt })}
                       />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* CÆ¯ TRÃš VÃ€ LIÃŠN Há»† */}
            {activeTab === "basic" && (
              <div className="mt-6 flex items-start gap-2.5 bg-[#F7941D]/10 border border-[#F7941D]/20 p-3.5 rounded-xl text-sm text-foreground/80 shadow-sm">
                <Info size={18} className="text-[#F7941D] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t("editProfile.basicInfo.storageNotice", {
                    defaultValue:
                      "Dá»¯ liá»‡u Quá»‘c tá»‹ch, DÃ¢n tá»™c vÃ  TÃ´n giÃ¡o sáº½ Ä‘Æ°á»£c lÆ°u vÃ o cÆ¡ sá»Ÿ dá»¯ liá»‡u theo tiáº¿ng Viá»‡t, khÃ´ng phá»¥ thuá»™c vÃ o ngÃ´n ngá»¯ ngÆ°á»i dÃ¹ng.",
                  })}
                </p>
              </div>
            )}
            {activeTab === "contact" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.contact.title", { defaultValue: "LiÃªn há»‡ vÃ  BÃ¡o tin" })}</h2>
                  <p className="text-sm text-muted-foreground">{t("editProfile.contact.desc", { defaultValue: "Äá»‹a chá»‰ thÆ°á»ng trÃº vÃ  Ä‘á»‹a chá»‰ cÆ° trÃº hiá»‡n táº¡i." })}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> {t("editProfile.contact.permanentAddressSection", { defaultValue: "Há»™ kháº©u thÆ°á»ng trÃº" })}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.province", { defaultValue: "Tá»‰nh/ThÃ nh phá»‘" })}</Label>
                          <Input value={formData.permanentCity} onChange={(e) => handleTextChange("permanentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.detailedAddress", { defaultValue: "Äá»‹a chá»‰ chi tiáº¿t (Sá»‘ nhÃ , Ä‘Æ°á»ng)" })}</Label>
                          <Input value={formData.permanentAddress} onChange={(e) => handleTextChange("permanentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> {t("editProfile.contact.currentAddressSection", { defaultValue: "Chá»— á»Ÿ hiá»‡n táº¡i" })}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.currentProvince", { defaultValue: "Tá»‰nh/ThÃ nh phá»‘ hiá»‡n táº¡i" })} <span className="text-destructive">*</span></Label>
                          <Input value={formData.currentCity || ''} onChange={(e) => handleTextChange("currentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.currentDetailedAddress", { defaultValue: "Äá»‹a chá»‰ hiá»‡n táº¡i" })} <span className="text-destructive">*</span></Label>
                          <Input value={formData.currentAddress} onChange={(e) => handleTextChange("currentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* CCCD VÃ€ NGÃ‚N HÃ€NG */}
            {activeTab === "identity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.identity.title", { defaultValue: "Äá»‹nh danh CCCD" })}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <Label>{t("editProfile.identity.idNumber", { defaultValue: "Sá»‘ CCCD" })} <span className="text-destructive">*</span></Label>
                    <Input value={formData.citizenIdNumber} onChange={(e) => handleTextChange("citizenIdNumber", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.identity.issueDate", { defaultValue: "NgÃ y cáº¥p" })} <span className="text-destructive">*</span></Label>
                    <Input type="date" value={formData.citizenIdIssueDate} onChange={(e) => handleTextChange("citizenIdIssueDate", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.identity.issuePlace", { defaultValue: "NÆ¡i cáº¥p" })} <span className="text-destructive">*</span></Label>
                    <Input value={formData.citizenIdIssuePlace} onChange={(e) => handleTextChange("citizenIdIssuePlace", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                </div>

                {/* CCCD IMAGES UPLOAD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">{t("editProfile.identity.frontImg", { defaultValue: "áº¢nh máº·t trÆ°á»›c CCCD" })}</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/50 hover:border-[#2E3192]/40 transition-colors cursor-pointer overflow-hidden">
                         <span className="p-3 bg-card rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-muted-foreground group-hover:text-[#2E3192] transition-colors" /></span>
                         <span className="font-medium text-sm text-foreground">{t("editProfile.identity.uploadFrontImg", { defaultValue: "Táº£i áº£nh máº·t trÆ°á»›c lÃªn" })}</span>
                         <span className="text-xs opacity-70 mt-1">{t("editProfile.identity.imgHint", { defaultValue: "Äá»‹nh dáº¡ng JPEG, PNG, max 5MB" })}</span>
                      </div>
                   </div>
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">{t("editProfile.identity.backImg", { defaultValue: "áº¢nh máº·t sau CCCD" })}</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/50 hover:border-[#2E3192]/40 transition-colors cursor-pointer overflow-hidden">
                         <span className="p-3 bg-card rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-muted-foreground group-hover:text-[#2E3192] transition-colors" /></span>
                         <span className="font-medium text-sm text-foreground">{t("editProfile.identity.uploadBackImg", { defaultValue: "Táº£i áº£nh máº·t sau lÃªn" })}</span>
                         <span className="text-xs opacity-70 mt-1">{t("editProfile.identity.imgHint", { defaultValue: "Äá»‹nh dáº¡ng JPEG, PNG, max 5MB" })}</span>
                      </div>
                   </div>
                </div>

                <div className="border-b border-border pb-4 mb-6 mt-10">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.bank.title", { defaultValue: "TÃ i khoáº£n NgÃ¢n hÃ ng (Nháº­n lÆ°Æ¡ng)" })}</h2>
                </div>

                <div className="space-y-4">
                  {formData.bankInformations?.map((bank, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                          <div className="space-y-1">
                            <Label className="text-xs">{t("editProfile.bank.bankName", { defaultValue: "NgÃ¢n hÃ ng" })}</Label>
                            <Input placeholder={t("editProfile.bank.bankNamePlaceholder", { defaultValue: "VD: Vietcombank" })} value={bank.bankName} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.branch", { defaultValue: "Chi nhÃ¡nh" })}</Label>
                             <Input placeholder={t("editProfile.bank.branchPlaceholder", { defaultValue: "VD: HCM" })} value={bank.bankBranch} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankBranch = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.accountName", { defaultValue: "TÃªn chá»§ tÃ i khoáº£n" })}</Label>
                             <Input placeholder={t("editProfile.bank.accountNamePlaceholder", { defaultValue: "Nháº­p tÃªn chá»§ tÃ i khoáº£n" })} value={bank.bankAccountName || ''} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankAccountName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }}/>
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.accountNumber", { defaultValue: "Sá»‘ tÃ i khoáº£n" })}</Label>
                             <Input placeholder={t("editProfile.bank.accountNumberPlaceholder", { defaultValue: "VD: 99120xxxxx" })} value={bank.bankAccountNumber||''} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankAccountNumber = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }}/>
                          </div>
                       </div>
                       <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => {
                          handleTextChange("bankInformations", formData.bankInformations!.filter((_, i) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={() => {
                     handleTextChange("bankInformations", [...(formData.bankInformations||[]), { bankName: '', bankBranch: '', bankAccountName: '', bankAccountNumber: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"><Plus size={16}/> {t("editProfile.bank.addBtn", { defaultValue: "ThÃªm TÃ i khoáº£n NgÃ¢n hÃ ng" })}</Button>
                </div>
              </div>
            )}

            {/* Há»ŒC Váº¤N */}
            {activeTab === "education" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.education.title", { defaultValue: "Há»c váº¥n & Báº±ng cáº¥p" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.educationRecords?.map((edu, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.education.fromDate", { defaultValue: "Tá»« ngÃ y" })}</Label>
                                <Input type="date" value={edu.fromDate || ''} onChange={(e) => {
                                   const arr = [...formData.educationRecords!]; arr[index].fromDate = e.target.value; handleTextChange("educationRecords", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.education.toDate", { defaultValue: "Äáº¿n ngÃ y" })}</Label>
                                <Input type="date" value={edu.toDate || ''} onChange={(e) => {
                                   const arr = [...formData.educationRecords!]; arr[index].toDate = e.target.value; handleTextChange("educationRecords", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.education.institutionName", { defaultValue: "CÆ¡ sá»Ÿ Ä‘Ã o táº¡o (TrÆ°á»ng há»c / Trung tÃ¢m)" })}</Label>
                             <Input placeholder={t("editProfile.education.institutionNamePlaceholder", { defaultValue: "VD: Äáº¡i há»c Khoa há»c Tá»± nhiÃªn" })} value={edu.institutionName || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].institutionName = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.education.trainingMode", { defaultValue: "HÃ¬nh thá»©c Ä‘Ã o táº¡o" })}</Label>
                             <Input placeholder={t("editProfile.education.trainingModePlaceholder", { defaultValue: "VD: ChÃ­nh quy, Tá»« xa, Vá»«a lÃ m vá»«a há»c" })} value={edu.trainingMode || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].trainingMode = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.education.educationLevel", { defaultValue: "TrÃ¬nh Ä‘á»™ há»c váº¥n" })}</Label>
                             <Input placeholder={t("editProfile.education.educationLevelPlaceholder", { defaultValue: "VD: Cá»­ nhÃ¢n, Tháº¡c sÄ©, Cao Ä‘áº³ng" })} value={edu.educationLevel || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].educationLevel = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.education.major", { defaultValue: "ChuyÃªn ngÃ nh" })}</Label>
                             <Input placeholder={t("editProfile.education.majorPlaceholder", { defaultValue: "VD: CÃ´ng nghá»‡ ThÃ´ng tin" })} value={edu.major || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].major = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                       </div>
                       <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => {
                          handleTextChange("educationRecords", formData.educationRecords!.filter((_, i) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={() => {
                     handleTextChange("educationRecords", [...(formData.educationRecords||[]), { trainingMode: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.education.addBtn", { defaultValue: "ThÃªm Báº±ng cáº¥p/Há»c váº¥n" })}</Button>
                </div>
              </div>
            )}

            {/* KINH NGHIá»†M */}
            {activeTab === "experience" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.experience.title", { defaultValue: "Kinh nghiá»‡m lÃ m viá»‡c" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.workExperiences?.map((work, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.experience.fromMonth", { defaultValue: "Tá»« thÃ¡ng" })}</Label>
                                <Input type="month" value={work.fromMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].fromMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.experience.toMonth", { defaultValue: "Äáº¿n thÃ¡ng" })}</Label>
                                <Input type="month" value={work.toMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].toMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.companyName", { defaultValue: "TÃªn CÃ´ng ty / ÄÆ¡n vá»‹" })}</Label>
                             <Input placeholder={t("editProfile.experience.companyNamePlaceholder", { defaultValue: "VD: CÃ´ng ty cÃ´ng nghá»‡ VNFT" })} value={work.companyName || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].companyName = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.position", { defaultValue: "Vá»‹ trÃ­ cÃ´ng tÃ¡c" })}</Label>
                             <Input placeholder={t("editProfile.experience.positionPlaceholder", { defaultValue: "VD: NhÃ¢n viÃªn PhÃ¡t triá»ƒn pháº§n má»m" })} value={work.position || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].position = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.experience.referencePerson", { defaultValue: "NgÆ°á»i tham chiáº¿u" })}</Label>
                             <Input placeholder={t("editProfile.experience.referencePersonPlaceholder", { defaultValue: "VD: TÃªn ngÆ°á»i quáº£n lÃ½ / TrÆ°á»Ÿng phÃ²ng" })} value={work.referencePerson || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].referencePerson = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.experience.phoneNumber", { defaultValue: "SÄT ngÆ°á»i tham chiáº¿u" })}</Label>
                             <Input placeholder={t("editProfile.experience.phoneNumberPlaceholder", { defaultValue: "VD: 09xxxxxxxx" })} value={work.phoneNumber || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].phoneNumber = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.jobDesc", { defaultValue: "MÃ´ táº£ cÃ´ng viá»‡c" })}</Label>
                             <Textarea placeholder={t("editProfile.experience.jobDescPlaceholder", { defaultValue: "Liá»‡t kÃª ngáº¯n gá»n vai trÃ² vÃ  cÃ¡c cÃ´ng viá»‡c chuyÃªn mÃ´n báº¡n Ä‘Ã£ Ä‘áº£m nháº­n táº¡i Ä‘Æ¡n vá»‹ nÃ y..." })} rows={4} value={work.jobDescription || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].jobDescription = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="rounded-xl resize-none" />
                          </div>
                       </div>
                       <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => {
                          handleTextChange("workExperiences", formData.workExperiences!.filter((_, i) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={() => {
                     handleTextChange("workExperiences", [...(formData.workExperiences||[]), { companyName: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.experience.addBtn", { defaultValue: "ThÃªm Kinh nghiá»‡m" })}</Button>
                </div>
              </div>
            )}

            {/* NGÆ¯á»œI PHá»¤ THUá»˜C */}
            {activeTab === "dependents" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.dependents.title", { defaultValue: "NgÆ°á»i phá»¥ thuá»™c" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.dependents?.map((dep, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <Input placeholder={t("editProfile.dependents.fullNamePlaceholder", { defaultValue: "Há» vÃ  TÃªn" })} value={dep.dependentFullName || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentFullName = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.relationshipPlaceholder", { defaultValue: "Má»‘i quan há»‡" })} value={dep.dependentRelationship || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentRelationship = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input type="date" placeholder={t("editProfile.dependents.dobPlaceholder", { defaultValue: "NgÃ y sinh" })} value={dep.dependentDateOfBirth || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentDateOfBirth = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.phonePlaceholder", { defaultValue: "SÄT liÃªn há»‡" })} value={dep.dependentPhoneNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentPhoneNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.identityNumberPlaceholder", { defaultValue: "Sá»‘ CMT/CCCD" })} value={dep.dependentIdentityNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentIdentityNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.taxCodePlaceholder", { defaultValue: "MÃ£ sá»‘ thuáº¿" })} value={dep.dependentTaxCode || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentTaxCode = e.target.value; handleTextChange("dependents", arr);
                          }} />
                       </div>
                       <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => {
                          handleTextChange("dependents", formData.dependents!.filter((_, i) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={() => {
                     handleTextChange("dependents", [...(formData.dependents||[]), { dependentFullName: '', dependentRelationship: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.dependents.addBtn", { defaultValue: "ThÃªm Khai bÃ¡o NPT" })}</Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
