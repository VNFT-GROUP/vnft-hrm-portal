import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Shield, BookOpen, Briefcase, MapPin, Plus, Trash2, Users, Camera, Check, ChevronsUpDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { UpdateCurrentUserProfileRequest } from '@/types/user/UpdateCurrentUserProfileRequest';

type ProfileFormData = Partial<UpdateCurrentUserProfileRequest> & {
  fullName?: string;
  englishName?: string;
  employeeCode?: string;
};
import countries from "i18n-iso-countries";
import viLocale from "i18n-iso-countries/langs/vi.json";
import enLocale from "i18n-iso-countries/langs/en.json";
import zhLocale from "i18n-iso-countries/langs/zh.json";

countries.registerLocale(viLocale);
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);
const COUNTRIES_VI = Object.values(countries.getNames("vi"));
const ALL_COUNTRIES_SORTED = [
  "Việt Nam", 
  ...COUNTRIES_VI.filter(c => c !== "Việt Nam").sort((a, b) => a.localeCompare(b, 'vi'))
];

const WORLD_RELIGIONS = [
  "Không",
  "Phật giáo",
  "Công giáo (Thiên chúa / Tin Lành)",
  "Đạo Cao Đài",
  "Phật giáo Hòa Hảo",
  "Hồi giáo",
  "Ấn Độ giáo (Hindu)",
  "Tín ngưỡng dân gian",
  "Thần đạo (Shinto)",
  "Đạo giáo",
  "Tôn giáo Yoruba",
  "Voodoo",
  "Đạo Sikh",
  "Ahmadiyya",
  "Do Thái giáo",
  "Thông linh học",
  "Đạo Mu (Mu-ism)",
  "Giáo hội Thống nhất",
  "Ayyavazhi",
  "Đạo Baháʼí",
  "Nho giáo",
  "Sarna giáo",
  "Kỳ Na giáo (Jainism)",
  "Thiên đạo giáo (Cheondoism)",
  "Hội thánh Đức Chúa Trời",
  "Iglesia ni Cristo",
  "Ravidassia",
  "Thiên Lý giáo (Tenriism)",
  "Druze",
  "Đạo Tengri",
  "Rastafari",
  "Yarsanism",
  "Wicca",
  "Yazidi giáo",
  "Assian giáo",
  "Donyi-Polo",
  "Giáo hội truyền thống Châu Mỹ",
  "Sanamahi giáo",
  "Bái hỏa giáo (Zoroastrianism)",
  "Mandae giáo",
  "Khoa học Hạnh phúc",
  "Tu nghiệm đạo (Shugendō)",
  "Samaritan giáo",
  "Khác"
];

const ETHNICITIES_VN = [
  "Kinh", "Tày", "Thái", "Hoa", "Khơ-me", "Mường", "Nùng", "HMông", "Dao", "Gia-rai",
  "Ngái", "Ê-đê", "Ba na", "Xơ-Đăng", "Sán Chay", "Cơ-ho", "Chăm", "Sán Dìu", "Hrê", 
  "Mnông", "Ra-glai", "Xtiêng", "Bru-Vân Kiều", "Thổ", "Giáy", "Cơ-tu", "Gié Triêng", 
  "Mạ", "Khơ-mú", "Co", "Tà-ôi", "Chơ-ro", "Kháng", "Xinh-mun", "Hà Nhì", "Chu ru", 
  "Lào", "La Chí", "La Ha", "Phù Lá", "La Hủ", "Lự", "Lô Lô", "Chứt", "Mảng", 
  "Pà Thẻn", "Co Lao", "Cống", "Bố Y", "Si La", "Pu Péo", "Brâu", "Ơ Đu", "Rơ măm"
];

const GLOBAL_ETHNICITIES = [
  "Asian or Asian British",
  "Indian",
  "Pakistani",
  "Bangladeshi",
  "Chinese",
  "Any other Asian background",
  "Black, Black British, Caribbean or African",
  "Caribbean",
  "African",
  "Any other Black, Black British, or Caribbean background",
  "Mixed or multiple ethnic groups",
  "White and Black Caribbean",
  "White and Black African",
  "White and Asian",
  "Any other Mixed or multiple ethnic background",
  "White",
  "English, Welsh, Scottish, Northern Irish or British",
  "Irish",
  "Gypsy or Irish Traveller",
  "Roma",
  "Any other White background",
  "Arab",
  "Any other ethnic group"
];

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
          <CommandInput placeholder={t("editProfile.searchableSelect.searchPlaceholder", { defaultValue: "Tìm kiếm..." })} />
          <CommandList className="max-h-[350px]">
            <CommandEmpty>{t("editProfile.searchableSelect.noResults", { defaultValue: "Không tìm thấy kết quả." })}</CommandEmpty>
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
    if (i18n.language === 'vi') return viName;
    const viNames = countries.getNames("vi");
    const code = Object.keys(viNames).find(k => viNames[k] === viName);
    if (code) {
      return countries.getName(code, i18n.language === 'zh' ? 'zh' : 'en') || viName;
    }
    return viName;
  };

  // Common select styles matching Shadcn Input
  const selectClassName = "flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-card";

  const [formData, setFormData] = useState<ProfileFormData>({
     fullName: session?.fullName || "",
     englishName: session?.englishName || "",
     employeeCode: session?.username || "", // Typically mapped to code
     phoneNumber: "",
     gender: session?.gender || "MALE",
     dateOfBirth: "",
     maritalStatus: "SINGLE",
     placeOfBirth: "",
     placeOfOrigin: "",
     nationality: "Việt Nam",
     religion: "Không",
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

  const handleTextChange = <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mandatory field validation
    if (!formData.employeeCode?.trim() || !formData.fullName?.trim() || !formData.dateOfBirth?.trim() || !formData.maritalStatus || !formData.phoneNumber?.trim() || !formData.currentAddress?.trim() || !formData.currentCity?.trim() || !formData.citizenIdNumber?.trim() || !formData.citizenIdIssueDate?.trim() || !formData.citizenIdIssuePlace?.trim()) {
      toast.error(t("editProfile.validation.missingInfoTitle", { defaultValue: "Thiếu thông tin bắt buộc" }), {
        description: t("editProfile.validation.missingInfoDesc", { defaultValue: "Vui lòng điền đầy đủ thông tin cho các trường có đánh dấu (*)." })
      });
      return;
    }

    // Auto-filter out empty template rows before submitting
    const payload = { ...formData };
    
    payload.bankInformations = payload.bankInformations?.filter(b => b.bankAccountNumber?.trim() || b.bankName?.trim());
    payload.dependents = payload.dependents?.filter(d => d.dependentFullName?.trim() || d.dependentRelationship?.trim());
    payload.educationRecords = payload.educationRecords?.filter(ed => ed.institutionName?.trim() || ed.major?.trim());
    payload.workExperiences = payload.workExperiences?.filter(w => w.companyName?.trim() || w.position?.trim());

    console.log("Submitting payload:", payload);
    
    // Simulate updating API request
    toast.success(t("profile.updateSuccess", { defaultValue: "Cập nhật hồ sơ thành công" }), {
      description: t("editProfile.validation.updateSuccessDesc", { defaultValue: "Toàn bộ thông tin cá nhân và lý lịch đã được đối soát." })
    });
    navigate("/app/profile");
  };

  const tabs = [
    { id: "basic", label: t("editProfile.tabs.basic", { defaultValue: "Thông tin cơ bản" }), icon: <User size={16} /> },
    { id: "contact", label: t("editProfile.tabs.contact", { defaultValue: "Cư trú & Liên hệ" }), icon: <MapPin size={16} /> },
    { id: "identity", label: t("editProfile.tabs.identity", { defaultValue: "CCCD & Ngân hàng" }), icon: <Shield size={16} /> },
    { id: "education", label: t("editProfile.tabs.education", { defaultValue: "Học vấn" }), icon: <BookOpen size={16} /> },
    { id: "experience", label: t("editProfile.tabs.experience", { defaultValue: "Kinh nghiệm" }), icon: <Briefcase size={16} /> },
    { id: "dependents", label: t("editProfile.tabs.dependents", { defaultValue: "Người phụ thuộc" }), icon: <Users size={16} /> },
  ];

  return (
    <div className="p-4 md:p-6 w-full max-w-[1250px] mx-auto min-h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
            <h1 className="text-2xl font-bold text-foreground">{t("editProfile.header.title", { defaultValue: "Cập nhật hồ sơ" })}</h1>
            <p className="text-sm text-muted-foreground">{t("editProfile.header.subtitle", { defaultValue: "Chỉnh sửa toàn bộ thông tin cá nhân thuộc hệ thống quản trị" })}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          className="rounded-xl bg-[#F7941D] hover:bg-[#D87D12] text-white shadow-md shadow-[#F7941D]/20 hover:shadow-[#F7941D]/40 transition-all gap-2 h-11 px-7 font-semibold"
        >
          <Save size={18} /> 
          {t("editProfile.header.saveBtn", { defaultValue: "Lưu thay đổi hồ sơ" })}
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
            
            {/* THÔNG TIN CƠ BẢN */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.basicInfo.title", { defaultValue: "Thông tin cơ bản" })}</h2>
                  <p className="text-sm text-muted-foreground">{t("editProfile.basicInfo.desc", { defaultValue: "Các thông tin cá nhân và định danh cơ bản." })}</p>
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
                     <h3 className="font-semibold text-foreground">{t("editProfile.basicInfo.avatarTitle", { defaultValue: "Ảnh chân dung" })}</h3>
                     <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">{t("editProfile.basicInfo.avatarHint", { defaultValue: "Định dạng hỗ trợ: JPEG, PNG, WEBP. Kích thước tỷ lệ 1:1, dung lượng tối đa 5MB." })}</p>
                     <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl text-xs font-medium bg-card hover:bg-[#2E3192]/5 hover:text-[#2E3192] hover:border-[#2E3192]/30 transition-colors">
                        {t("editProfile.basicInfo.uploadAvatarBtn", { defaultValue: "Chọn tệp tải lên" })}
                     </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.employeeCode", { defaultValue: "Mã nhân viên (Bắt buộc)" })}</Label>
                    <Input 
                      value={formData.employeeCode}
                      onChange={(e) => handleTextChange("employeeCode", e.target.value)}
                      placeholder={t("editProfile.basicInfo.employeeCodePlaceholder", { defaultValue: "VD: VNSGN090" })}
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.englishName", { defaultValue: "Tên tiếng Anh (English Name)" })}</Label>
                    <Input 
                      value={formData.englishName}
                      onChange={(e) => handleTextChange("englishName", e.target.value)}
                      placeholder={t("editProfile.basicInfo.englishNamePlaceholder", { defaultValue: "VD: Ethan Truong" })} 
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.fullName", { defaultValue: "Họ và Tên" })} <span className="text-destructive">*</span></Label>
                    <Input 
                      value={formData.fullName}
                      onChange={(e) => handleTextChange("fullName", e.target.value)}
                      placeholder={t("editProfile.basicInfo.fullNamePlaceholder", { defaultValue: "VD: Trương Thành Nhân" })} 
                      className="h-11 rounded-xl bg-muted/40 border-transparent hover:border-border hover:bg-muted/60 focus:bg-card focus:border-ring transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.phoneNumber", { defaultValue: "Số điện thoại" })} <span className="text-destructive">*</span></Label>
                    <Input 
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleTextChange("phoneNumber", e.target.value)}
                      placeholder={t("editProfile.basicInfo.phoneNumberPlaceholder", { defaultValue: "VD: 0987654321" })} 
                      className="h-11 rounded-xl bg-muted/40 border-transparent hover:border-border hover:bg-muted/60 focus:bg-card focus:border-ring transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                     <Label>{t("editProfile.basicInfo.dob", { defaultValue: "Ngày sinh (Date of Birth)" })} <span className="text-destructive">*</span></Label>
                     <Input 
                       type="date"
                       value={formData.dateOfBirth} 
                       onChange={(e) => handleTextChange("dateOfBirth", e.target.value)}
                       className="h-11 rounded-xl" 
                     />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.gender", { defaultValue: "Giới tính" })}</Label>
                    <select 
                      className={selectClassName} 
                      value={formData.gender} 
                      onChange={(e) => handleTextChange("gender", e.target.value as ProfileFormData['gender'])}
                    >
                       <option value="MALE">{t("editProfile.basicInfo.genderMale", { defaultValue: "Nam" })}</option>
                       <option value="FEMALE">{t("editProfile.basicInfo.genderFemale", { defaultValue: "Nữ" })}</option>
                       <option value="OTHER">{t("editProfile.basicInfo.genderOther", { defaultValue: "Hệ khác" })}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.maritalStatus", { defaultValue: "Tình trạng hôn nhân" })} <span className="text-destructive">*</span></Label>
                    <select 
                      className={selectClassName} 
                      value={formData.maritalStatus} 
                      onChange={(e) => handleTextChange("maritalStatus", e.target.value as ProfileFormData['maritalStatus'])}
                    >
                       <option value="SINGLE">{t("editProfile.basicInfo.statusSingle", { defaultValue: "Độc thân" })}</option>
                       <option value="MARRIED">{t("editProfile.basicInfo.statusMarried", { defaultValue: "Đã kết hôn" })}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.placeOfBirth", { defaultValue: "Nơi sinh" })}</Label>
                    <Input value={formData.placeOfBirth} onChange={(e) => handleTextChange("placeOfBirth", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.hometown", { defaultValue: "Quê quán" })}</Label>
                    <Input value={formData.placeOfOrigin} onChange={(e) => handleTextChange("placeOfOrigin", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:col-span-2">
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.nationality", { defaultValue: "Quốc tịch" })}</Label>
                       <SearchableSelect 
                         options={ALL_COUNTRIES_SORTED} 
                         value={formData.nationality || "Việt Nam"} 
                         onChange={(v) => handleTextChange("nationality", v)} 
                         placeholder={t("editProfile.basicInfo.nationalityPlaceholder", { defaultValue: "Chọn Quốc tịch..." })} 
                         getTranslation={getCountryTranslation}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.ethnicity", { defaultValue: "Dân tộc" })}</Label>
                       <SearchableSelect 
                         options={[...ETHNICITIES_VN, ...GLOBAL_ETHNICITIES, "Khác"]} 
                         value={formData.ethnicity || "Kinh"} 
                         onChange={(v) => handleTextChange("ethnicity", v)} 
                         placeholder={t("editProfile.basicInfo.ethnicityPlaceholder", { defaultValue: "Chọn Dân tộc..." })} 
                         getTranslation={(opt) => t(`dropdowns.ethnicity.${opt}`, { defaultValue: opt })}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.religion", { defaultValue: "Tôn giáo" })}</Label>
                       <SearchableSelect 
                         options={WORLD_RELIGIONS} 
                         value={formData.religion || "Không"} 
                         onChange={(v) => handleTextChange("religion", v)} 
                         placeholder={t("editProfile.basicInfo.religionPlaceholder", { defaultValue: "Chọn Tôn giáo..." })} 
                         getTranslation={(opt) => t(`dropdowns.religion.${opt}`, { defaultValue: opt })}
                       />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* CƯ TRÚ VÀ LIÊN HỆ */}
            {activeTab === "contact" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.contact.title", { defaultValue: "Liên hệ và Báo tin" })}</h2>
                  <p className="text-sm text-muted-foreground">{t("editProfile.contact.desc", { defaultValue: "Địa chỉ thường trú và địa chỉ cư trú hiện tại." })}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> {t("editProfile.contact.permanentAddressSection", { defaultValue: "Hộ khẩu thường trú" })}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.province", { defaultValue: "Tỉnh/Thành phố" })}</Label>
                          <Input value={formData.permanentCity} onChange={(e) => handleTextChange("permanentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.detailedAddress", { defaultValue: "Địa chỉ chi tiết (Số nhà, đường)" })}</Label>
                          <Input value={formData.permanentAddress} onChange={(e) => handleTextChange("permanentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> {t("editProfile.contact.currentAddressSection", { defaultValue: "Chỗ ở hiện tại" })}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.currentProvince", { defaultValue: "Tỉnh/Thành phố hiện tại" })} <span className="text-destructive">*</span></Label>
                          <Input value={formData.currentCity || ''} onChange={(e) => handleTextChange("currentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.currentDetailedAddress", { defaultValue: "Địa chỉ hiện tại" })} <span className="text-destructive">*</span></Label>
                          <Input value={formData.currentAddress} onChange={(e) => handleTextChange("currentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* CCCD VÀ NGÂN HÀNG */}
            {activeTab === "identity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.identity.title", { defaultValue: "Định danh CCCD" })}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <Label>{t("editProfile.identity.idNumber", { defaultValue: "Số CCCD" })} <span className="text-destructive">*</span></Label>
                    <Input value={formData.citizenIdNumber} onChange={(e) => handleTextChange("citizenIdNumber", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.identity.issueDate", { defaultValue: "Ngày cấp" })} <span className="text-destructive">*</span></Label>
                    <Input type="date" value={formData.citizenIdIssueDate} onChange={(e) => handleTextChange("citizenIdIssueDate", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.identity.issuePlace", { defaultValue: "Nơi cấp" })} <span className="text-destructive">*</span></Label>
                    <Input value={formData.citizenIdIssuePlace} onChange={(e) => handleTextChange("citizenIdIssuePlace", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                </div>

                {/* CCCD IMAGES UPLOAD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">{t("editProfile.identity.frontImg", { defaultValue: "Ảnh mặt trước CCCD" })}</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/50 hover:border-[#2E3192]/40 transition-colors cursor-pointer overflow-hidden">
                         <span className="p-3 bg-card rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-muted-foreground group-hover:text-[#2E3192] transition-colors" /></span>
                         <span className="font-medium text-sm text-foreground">{t("editProfile.identity.uploadFrontImg", { defaultValue: "Tải ảnh mặt trước lên" })}</span>
                         <span className="text-xs opacity-70 mt-1">{t("editProfile.identity.imgHint", { defaultValue: "Định dạng JPEG, PNG, max 5MB" })}</span>
                      </div>
                   </div>
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">{t("editProfile.identity.backImg", { defaultValue: "Ảnh mặt sau CCCD" })}</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/50 hover:border-[#2E3192]/40 transition-colors cursor-pointer overflow-hidden">
                         <span className="p-3 bg-card rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-muted-foreground group-hover:text-[#2E3192] transition-colors" /></span>
                         <span className="font-medium text-sm text-foreground">{t("editProfile.identity.uploadBackImg", { defaultValue: "Tải ảnh mặt sau lên" })}</span>
                         <span className="text-xs opacity-70 mt-1">{t("editProfile.identity.imgHint", { defaultValue: "Định dạng JPEG, PNG, max 5MB" })}</span>
                      </div>
                   </div>
                </div>

                <div className="border-b border-border pb-4 mb-6 mt-10">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.bank.title", { defaultValue: "Tài khoản Ngân hàng (Nhận lương)" })}</h2>
                </div>

                <div className="space-y-4">
                  {formData.bankInformations?.map((bank, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                          <div className="space-y-1">
                            <Label className="text-xs">{t("editProfile.bank.bankName", { defaultValue: "Ngân hàng" })}</Label>
                            <Input placeholder={t("editProfile.bank.bankNamePlaceholder", { defaultValue: "VD: Vietcombank" })} value={bank.bankName} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.branch", { defaultValue: "Chi nhánh" })}</Label>
                             <Input placeholder={t("editProfile.bank.branchPlaceholder", { defaultValue: "VD: HCM" })} value={bank.bankBranch} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankBranch = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.accountName", { defaultValue: "Tên chủ tài khoản" })}</Label>
                             <Input placeholder={t("editProfile.bank.accountNamePlaceholder", { defaultValue: "VD: TRUONG THANH NHAN" })} value={bank.bankAccountName || ''} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankAccountName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }}/>
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.accountNumber", { defaultValue: "Số tài khoản" })}</Label>
                             <Input placeholder={t("editProfile.bank.accountNumberPlaceholder", { defaultValue: "VD: 99120..." })} value={bank.bankAccountNumber||''} onChange={e => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"><Plus size={16}/> {t("editProfile.bank.addBtn", { defaultValue: "Thêm Tài khoản Ngân hàng" })}</Button>
                </div>
              </div>
            )}

            {/* HỌC VẤN */}
            {activeTab === "education" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.education.title", { defaultValue: "Học vấn & Bằng cấp" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.educationRecords?.map((edu, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.education.fromDate", { defaultValue: "Từ ngày" })}</Label>
                                <Input type="date" value={edu.fromDate || ''} onChange={(e) => {
                                   const arr = [...formData.educationRecords!]; arr[index].fromDate = e.target.value; handleTextChange("educationRecords", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.education.toDate", { defaultValue: "Đến ngày" })}</Label>
                                <Input type="date" value={edu.toDate || ''} onChange={(e) => {
                                   const arr = [...formData.educationRecords!]; arr[index].toDate = e.target.value; handleTextChange("educationRecords", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.education.institutionName", { defaultValue: "Cơ sở đào tạo (Trường học / Trung tâm)" })}</Label>
                             <Input placeholder={t("editProfile.education.institutionNamePlaceholder", { defaultValue: "VD: Đại học Khoa học Tự nhiên" })} value={edu.institutionName || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].institutionName = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.education.trainingMode", { defaultValue: "Hình thức đào tạo" })}</Label>
                             <Input placeholder={t("editProfile.education.trainingModePlaceholder", { defaultValue: "VD: Chính quy, Từ xa, Vừa làm vừa học" })} value={edu.trainingMode || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].trainingMode = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.education.educationLevel", { defaultValue: "Trình độ học vấn" })}</Label>
                             <Input placeholder={t("editProfile.education.educationLevelPlaceholder", { defaultValue: "VD: Cử nhân, Thạc sĩ, Cao đẳng" })} value={edu.educationLevel || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].educationLevel = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.education.major", { defaultValue: "Chuyên ngành" })}</Label>
                             <Input placeholder={t("editProfile.education.majorPlaceholder", { defaultValue: "VD: Công nghệ Thông tin" })} value={edu.major || ''} onChange={(e) => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.education.addBtn", { defaultValue: "Thêm Bằng cấp/Học vấn" })}</Button>
                </div>
              </div>
            )}

            {/* KINH NGHIỆM */}
            {activeTab === "experience" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.experience.title", { defaultValue: "Kinh nghiệm làm việc" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.workExperiences?.map((work, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.experience.fromMonth", { defaultValue: "Từ tháng" })}</Label>
                                <Input type="month" value={work.fromMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].fromMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.experience.toMonth", { defaultValue: "Đến tháng" })}</Label>
                                <Input type="month" value={work.toMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].toMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.companyName", { defaultValue: "Tên Công ty / Đơn vị" })}</Label>
                             <Input placeholder={t("editProfile.experience.companyNamePlaceholder", { defaultValue: "VD: Công ty công nghệ VNFT" })} value={work.companyName || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].companyName = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.position", { defaultValue: "Vị trí công tác" })}</Label>
                             <Input placeholder={t("editProfile.experience.positionPlaceholder", { defaultValue: "VD: Nhân viên Phát triển phần mềm" })} value={work.position || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].position = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.experience.referencePerson", { defaultValue: "Người tham chiếu" })}</Label>
                             <Input placeholder={t("editProfile.experience.referencePersonPlaceholder", { defaultValue: "VD: Nguyễn Văn B (Trưởng phòng)" })} value={work.referencePerson || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].referencePerson = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.experience.phoneNumber", { defaultValue: "SĐT người tham chiếu" })}</Label>
                             <Input placeholder={t("editProfile.experience.phoneNumberPlaceholder", { defaultValue: "VD: 0912345678" })} value={work.phoneNumber || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].phoneNumber = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.jobDesc", { defaultValue: "Mô tả công việc" })}</Label>
                             <Textarea placeholder={t("editProfile.experience.jobDescPlaceholder", { defaultValue: "Liệt kê ngắn gọn vai trò và các công việc chuyên môn bạn đã đảm nhận tại đơn vị này..." })} rows={4} value={work.jobDescription || ''} onChange={(e) => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.experience.addBtn", { defaultValue: "Thêm Kinh nghiệm" })}</Button>
                </div>
              </div>
            )}

            {/* NGƯỜI PHỤ THUỘC */}
            {activeTab === "dependents" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.dependents.title", { defaultValue: "Người phụ thuộc" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.dependents?.map((dep, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <Input placeholder={t("editProfile.dependents.fullNamePlaceholder", { defaultValue: "Họ và Tên" })} value={dep.dependentFullName || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentFullName = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.relationshipPlaceholder", { defaultValue: "Mối quan hệ" })} value={dep.dependentRelationship || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentRelationship = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input type="date" placeholder={t("editProfile.dependents.dobPlaceholder", { defaultValue: "Ngày sinh" })} value={dep.dependentDateOfBirth || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentDateOfBirth = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.phonePlaceholder", { defaultValue: "SĐT liên hệ" })} value={dep.dependentPhoneNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentPhoneNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.identityNumberPlaceholder", { defaultValue: "Số CMT/CCCD" })} value={dep.dependentIdentityNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentIdentityNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder={t("editProfile.dependents.taxCodePlaceholder", { defaultValue: "Mã số thuế" })} value={dep.dependentTaxCode || ''} onChange={(e) => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.dependents.addBtn", { defaultValue: "Thêm Khai báo NPT" })}</Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
