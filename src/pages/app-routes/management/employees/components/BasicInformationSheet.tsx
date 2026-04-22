import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, User, Shield, BookOpen, Briefcase, MapPin, Plus, Trash2, Users, Camera, Info } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/user/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateUserProfileRequest } from '@/types/user/UpdateUserProfileRequest';
import { s3Service } from "@/services/s3";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils";
import {
  ALL_COUNTRIES_SORTED as PROFILE_ALL_COUNTRIES_SORTED,
  ETHNICITIES_VN as PROFILE_ETHNICITIES_VN,
  GLOBAL_ETHNICITIES as PROFILE_GLOBAL_ETHNICITIES,
  getCountryNameForLocale,
  WORLD_RELIGIONS as PROFILE_WORLD_RELIGIONS,
} from "@/constants/profile-options";


type ProfileFormData = Partial<UpdateUserProfileRequest> & {
  username?: string;
  fullName?: string;
  englishName?: string;
  employeeCode?: string;
};

import { ProfileSearchableSelect } from "@/components/custom/ProfileSearchableSelect";
// from "@/components/custom/ProfileSearchableSelect";

export default function BasicInformationSheet({ isOpen, onOpenChange, userId }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, userId: string | null }) {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("basic");

  const getCountryTranslation = (viName: string) => {
    const translated = getCountryNameForLocale(viName, i18n.language);
    return translated && translated !== viName ? `${viName} (${translated})` : viName;
  };

  const selectClassName = "flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-card";

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // File Upload Storage States
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const frontInputRef = React.useRef<HTMLInputElement>(null);
  const backInputRef = React.useRef<HTMLInputElement>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [citizenIdFrontFile, setCitizenIdFrontFile] = useState<File | null>(null);
  const [citizenIdBackFile, setCitizenIdBackFile] = useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [citizenIdFrontPreview, setCitizenIdFrontPreview] = useState<string | null>(null);
  const [citizenIdBackPreview, setCitizenIdBackPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>, previewSetter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const [formData, setFormData] = useState<ProfileFormData>({
     username: "",
     fullName: "",
     englishName: "",
     attendanceCode: "",
     employeeCode: "",
     phoneNumber: "",
     gender: "MALE",
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

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!isOpen || !userId) return;
      setIsEditingMode(false);
      let profileData = null;
      try {
        setIsFetching(true);
        const res = await userService.getProfile(userId);
        if (res.data) {
          profileData = res.data;
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setIsFetching(false);
      }
      setIsFetching(false);

      if (profileData) {
        const d = profileData;
        setAvatarPreview(d.avatarUrl || null);
        setCitizenIdFrontPreview(d.citizenIdFrontImageUrl || null);
        setCitizenIdBackPreview(d.citizenIdBackImageUrl || null);

        setFormData((prev) => ({
          ...prev,
          username: d.username || prev.username,
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
          nationality: d.nationality || "Việt Nam",
          religion: d.religion || "Không",
          ethnicity: d.ethnicity || "Kinh",
          permanentAddress: d.permanentAddress || "",
          permanentCity: d.permanentCity || "",
          currentAddress: d.currentAddress || "",
          currentCity: d.currentCity || "",
          citizenIdNumber: d.citizenIdNumber || "",
          citizenIdIssueDate: d.citizenIdIssueDate?.substring(0, 10) || "",
          citizenIdIssuePlace: d.citizenIdIssuePlace || "",
          bankInformations: d.bankInformations?.length ? d.bankInformations : prev.bankInformations,
          dependents: d.dependents?.length ? d.dependents : prev.dependents,
          educationRecords: d.educationRecords?.length ? d.educationRecords : prev.educationRecords,
          workExperiences: d.workExperiences?.length ? d.workExperiences : prev.workExperiences,
        }));
      }
    };
    fetchProfile();
  }, [isOpen, userId]);

  const handleTextChange = <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    


    const payload = { ...formData };
    
    delete payload.username;
    delete payload.employeeCode;
    
    if (payload.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(payload.dateOfBirth)) {
      payload.dateOfBirth = `${payload.dateOfBirth}T00:00:00Z`;
    }
    if (payload.citizenIdIssueDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.citizenIdIssueDate)) {
      payload.citizenIdIssueDate = `${payload.citizenIdIssueDate}T00:00:00Z`;
    }
    
    payload.bankInformations = payload.bankInformations?.filter((b) => b.bankAccountNumber?.trim() || b.bankName?.trim());
    payload.dependents = payload.dependents?.filter((d) => d.dependentFullName?.trim() || d.dependentRelationship?.trim());
    payload.educationRecords = payload.educationRecords?.filter((ed) => ed.institutionName?.trim() || ed.major?.trim());
    payload.workExperiences = payload.workExperiences?.filter((w) => w.companyName?.trim() || w.position?.trim());

    setLoading(true);

    try {
      if (avatarFile) {
        const res = await s3Service.uploadFile(avatarFile, `avatars/${userId}/${Date.now()}_${avatarFile.name}`);
        payload.avatarTempKey = res.objectKey;
      }
      if (citizenIdFrontFile) {
        const res = await s3Service.uploadFile(citizenIdFrontFile, `citizen-ids/${userId}/front_${Date.now()}_${citizenIdFrontFile.name}`);
        payload.citizenIdFrontImageTempKey = res.objectKey;
      }
      if (citizenIdBackFile) {
        const res = await s3Service.uploadFile(citizenIdBackFile, `citizen-ids/${userId}/back_${Date.now()}_${citizenIdBackFile.name}`);
        payload.citizenIdBackImageTempKey = res.objectKey;
      }
    } catch (uploadError: unknown) {
      setLoading(false);
      const err = uploadError as Error;
      toast.error(t("editProfile.uploadFailed", { defaultValue: "Lỗi tải ảnh lên hệ thống" }), {
        description: err.message || "Vui lòng kiểm tra lại ảnh và thử lại."
      });
      return;
    }

    console.log("Submitting payload:", payload);
    let success = false;
    let errorMessage = "Lỗi không xác định khi lưu thông tin";
    
    try {
      await userService.updateProfile(userId!, payload as UpdateUserProfileRequest);
      success = true;
    } catch (error) {
      console.error(error);
      errorMessage = getErrorMessage(error, errorMessage);
      setLoading(false);
    }
    setLoading(false);

    if (success) {
      toast.success(t("profile.updateSuccess", { defaultValue: "Cập nhật hồ sơ thành công" }), {
        description: t("editProfile.validation.updateSuccessDesc", { defaultValue: "Toàn bộ thông tin cá nhân và lý lịch đã được lưu trữ an toàn." })
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    } else {
      toast.error(t("editProfile.validation.updateFailed", { defaultValue: "Cập nhật thất bại" }), {
        description: errorMessage
      });
    }
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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[700px] md:max-w-[900px] xl:max-w-[1100px] w-full border-l-slate-200 shadow-2xl flex flex-col h-full bg-background p-0">
      <div className="flex-none p-6 border-b border-border bg-card">
      <SheetHeader className="mb-0 px-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <SheetTitle className="text-2xl font-bold text-foreground">{t("editProfile.header.title", { defaultValue: "Cập nhật hồ sơ" })}</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">{t("editProfile.header.subtitle", { defaultValue: "Xem và chỉnh sửa toàn bộ thông tin cá nhân thuộc hệ thống quản trị" })}</SheetDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 mr-4 bg-muted/50 p-1.5 rounded-lg border border-border">
                    <Switch checked={isEditingMode} onCheckedChange={setIsEditingMode} id="edit-mode" />
                    <Label htmlFor="edit-mode" className="cursor-pointer text-xs font-semibold uppercase tracking-wider">{t("management.editMode", { defaultValue: "Chỉnh sửa" })}</Label>
                  </div>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-border text-muted-foreground w-24">
                    {t("management.btnClose", { defaultValue: "Đóng" })}
                  </Button>
                  {isEditingMode && (
                    <Button 
                      type="submit"
                      form="profile-form"
                      disabled={loading || isFetching}
                      className="rounded-xl bg-[#F7941D] hover:bg-[#D87D12] text-white shadow-md transition-all gap-2 px-5 font-semibold"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                      {t("editProfile.header.saveBtn", { defaultValue: "Lưu thay đổi" })}
                    </Button>
                  )}
                </div>
              </div>
            </SheetHeader>
      </div>
  
      <div className="flex-1 flex flex-col md:flex-row gap-6 lg:gap-8 overflow-hidden p-6">
        <div className="w-full md:w-[260px] shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-none">
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

        <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm p-6 lg:p-8 overflow-y-auto relative scrollbar-thin">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
            
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.basicInfo.title", { defaultValue: "Thông tin cơ bản" })}</h2>
                  <p className="text-sm text-muted-foreground">{t("editProfile.basicInfo.desc", { defaultValue: "Các thông tin cá nhân và định danh cơ bản." })}</p>
                </div>
                
                <div className="flex flex-col items-center justify-center sm:justify-start sm:flex-row sm:items-center gap-6 mb-8 bg-muted/20 p-5 rounded-2xl border border-border">
                  <input type="file" ref={avatarInputRef} disabled={!isEditingMode} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileChange(e, setAvatarFile, setAvatarPreview)} />
                  <div className="relative group cursor-pointer" onClick={() => isEditingMode && avatarInputRef.current?.click()}>
                     <div className="w-28 h-28 rounded-full bg-card border-4 border-background shadow-md overflow-hidden flex items-center justify-center shrink-0 text-muted-foreground group-hover:opacity-80 transition-opacity">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : formData.englishName || formData.fullName ? (
                           <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${formData.englishName || formData.fullName}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="opacity-20" />
                        )}
                     </div>
                     {isEditingMode && (
                     <button type="button" className="absolute bottom-1 right-1 p-2 bg-[#F7941D] hover:bg-[#E88915] text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-background">
                       <Camera size={14} />
                     </button>
                     )}
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                     <h3 className="font-semibold text-foreground">{t("editProfile.basicInfo.avatarTitle", { defaultValue: "Ảnh chân dung" })}</h3>
                     <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">{t("editProfile.basicInfo.avatarHint", { defaultValue: "Định dạng hỗ trợ: JPEG, PNG, WEBP. Kích thước tỷ lệ 1:1, dung lượng tối đa 5MB." })}</p>
                     {isEditingMode && (
                     <Button type="button" onClick={() => avatarInputRef.current?.click()} variant="outline" size="sm" className="mt-3 rounded-xl text-xs font-medium bg-card hover:bg-[#2E3192]/5 hover:text-[#2E3192] hover:border-[#2E3192]/30 transition-colors">
                        {t("editProfile.basicInfo.uploadAvatarBtn", { defaultValue: "Chọn tệp tải lên" })}
                     </Button>
                     )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.username", { defaultValue: "Tên đăng nhập" })}</Label>
                    <Input
                      disabled
                      value={formData.username || ""}
                      placeholder={t("editProfile.basicInfo.usernamePlaceholder", { defaultValue: "Tên đăng nhập hệ thống" })}
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.attendanceCode", { defaultValue: "Mã chấm công" })}</Label>
                    <Input
                      disabled={!isEditingMode || loading}
                      value={formData.attendanceCode || ""}
                      onChange={(e) => handleTextChange("attendanceCode", e.target.value)}
                      placeholder={t("editProfile.basicInfo.attendanceCodePlaceholder", { defaultValue: "Nhập mã chấm công" })}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.employeeCode", { defaultValue: "Mã nhân viên (Bắt buộc)" })}</Label>
                    <Input disabled={true} 
                      value={formData.employeeCode}
                      className="h-11 rounded-xl bg-[#2E3192]/5 border-[#2E3192]/20 text-[#2E3192] font-semibold opacity-100 pointer-events-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.englishName", { defaultValue: "Tên tiếng Anh (English Name)" })}</Label>
                    <Input disabled={!isEditingMode || loading} 
                      value={formData.englishName}
                      onChange={(e) => handleTextChange("englishName", e.target.value)}
                      placeholder={t("editProfile.basicInfo.englishNamePlaceholder", { defaultValue: "Nhập tên Tiếng Anh" })} 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.fullName", { defaultValue: "Họ và Tên" })}</Label>
                    <Input disabled={!isEditingMode || loading} 
                      value={formData.fullName}
                      onChange={(e) => handleTextChange("fullName", e.target.value)}
                      placeholder={t("editProfile.basicInfo.fullNamePlaceholder", { defaultValue: "Nhập họ và tên đầy đủ" })} 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.phoneNumber", { defaultValue: "Số điện thoại" })}</Label>
                    <Input disabled={!isEditingMode || loading} 
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleTextChange("phoneNumber", e.target.value)}
                      placeholder={t("editProfile.basicInfo.phoneNumberPlaceholder", { defaultValue: "VD: 09xxxxxxxx" })} 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                     <Label>{t("editProfile.basicInfo.dob", { defaultValue: "Ngày sinh (Date of Birth)" })}</Label>
                     <Input disabled={!isEditingMode || loading} 
                       type="date"
                       value={formData.dateOfBirth} 
                       onChange={(e) => handleTextChange("dateOfBirth", e.target.value)}
                       className="h-11 rounded-xl" 
                     />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.gender", { defaultValue: "Giới tính" })}</Label>
                    <select disabled={!isEditingMode || loading} 
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
                    <Label>{t("editProfile.basicInfo.maritalStatus", { defaultValue: "Tình trạng hôn nhân" })}</Label>
                    <select disabled={!isEditingMode || loading} 
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
                    <Input disabled={!isEditingMode || loading} value={formData.placeOfBirth} onChange={(e) => handleTextChange("placeOfBirth", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.basicInfo.hometown", { defaultValue: "Quê quán" })}</Label>
                    <Input disabled={!isEditingMode || loading} value={formData.placeOfOrigin} onChange={(e) => handleTextChange("placeOfOrigin", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:col-span-2">
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.nationality", { defaultValue: "Quốc tịch" })}</Label>
                       <ProfileSearchableSelect disabled={!isEditingMode || loading} 
                         options={PROFILE_ALL_COUNTRIES_SORTED} 
                         value={formData.nationality || "Việt Nam"} 
                         onChange={(v) => handleTextChange("nationality", v)} 
                         placeholder={t("editProfile.basicInfo.nationalityPlaceholder", { defaultValue: "Chọn Quốc tịch..." })} 
                         getTranslation={getCountryTranslation}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.ethnicity", { defaultValue: "Dân tộc" })}</Label>
                       <ProfileSearchableSelect disabled={!isEditingMode || loading} 
                         options={[...PROFILE_ETHNICITIES_VN, ...PROFILE_GLOBAL_ETHNICITIES, "Khác"]} 
                         value={formData.ethnicity || "Kinh"} 
                         onChange={(v) => handleTextChange("ethnicity", v)} 
                         placeholder={t("editProfile.basicInfo.ethnicityPlaceholder", { defaultValue: "Chọn Dân tộc..." })} 
                         getTranslation={(opt) => {
                           const translated = t(`dropdowns.ethnicity.${opt}`, { defaultValue: opt });
                           return translated && translated !== opt ? `${opt} (${translated})` : opt;
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>{t("editProfile.basicInfo.religion", { defaultValue: "Tôn giáo" })}</Label>
                       <ProfileSearchableSelect disabled={!isEditingMode || loading} 
                         options={PROFILE_WORLD_RELIGIONS} 
                         value={formData.religion || "Không"} 
                         onChange={(v) => handleTextChange("religion", v)} 
                         placeholder={t("editProfile.basicInfo.religionPlaceholder", { defaultValue: "Chọn Tôn giáo..." })} 
                         getTranslation={(opt) => {
                           const translated = t(`dropdowns.religion.${opt}`, { defaultValue: opt });
                           return translated && translated !== opt ? `${opt} (${translated})` : opt;
                         }}
                       />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "basic" && (
              <div className="mt-6 flex items-start gap-2.5 bg-[#F7941D]/10 border border-[#F7941D]/20 p-3.5 rounded-xl text-sm text-foreground/80 shadow-sm">
                <Info size={18} className="text-[#F7941D] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t("editProfile.basicInfo.storageNotice", {
                    defaultValue:
                      "Dữ liệu Quốc tịch, Dân tộc và Tôn giáo sẽ được lưu vào cơ sở dữ liệu theo tiếng Việt, không phụ thuộc vào ngôn ngữ người dùng.",
                  })}
                </p>
              </div>
            )}
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
                          <Input disabled={!isEditingMode || loading} value={formData.permanentCity} onChange={(e) => handleTextChange("permanentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.detailedAddress", { defaultValue: "Địa chỉ chi tiết (Số nhà, đường)" })}</Label>
                          <Input disabled={!isEditingMode || loading} value={formData.permanentAddress} onChange={(e) => handleTextChange("permanentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> {t("editProfile.contact.currentAddressSection", { defaultValue: "Chỗ ở hiện tại" })}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.currentProvince", { defaultValue: "Tỉnh/Thành phố hiện tại" })}</Label>
                          <Input disabled={!isEditingMode || loading} value={formData.currentCity || ''} onChange={(e) => handleTextChange("currentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("editProfile.contact.currentDetailedAddress", { defaultValue: "Địa chỉ hiện tại" })}</Label>
                          <Input disabled={!isEditingMode || loading} value={formData.currentAddress} onChange={(e) => handleTextChange("currentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "identity" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.identity.title", { defaultValue: "Định danh CCCD" })}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <Label>{t("editProfile.identity.idNumber", { defaultValue: "Số CCCD" })}</Label>
                    <Input disabled={!isEditingMode || loading} value={formData.citizenIdNumber} onChange={(e) => handleTextChange("citizenIdNumber", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.identity.issueDate", { defaultValue: "Ngày cấp" })}</Label>
                    <Input disabled={!isEditingMode || loading} type="date" value={formData.citizenIdIssueDate} onChange={(e) => handleTextChange("citizenIdIssueDate", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("editProfile.identity.issuePlace", { defaultValue: "Nơi cấp" })}</Label>
                    <Input disabled={!isEditingMode || loading} value={formData.citizenIdIssuePlace} onChange={(e) => handleTextChange("citizenIdIssuePlace", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">{t("editProfile.identity.frontImg", { defaultValue: "Ảnh mặt trước CCCD" })}</Label>
                      <input type="file" ref={frontInputRef} disabled={!isEditingMode} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileChange(e, setCitizenIdFrontFile, setCitizenIdFrontPreview)} />
                      <div onClick={() => isEditingMode && frontInputRef.current?.click()} className={`relative border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 transition-colors overflow-hidden ${isEditingMode ? 'hover:bg-muted/50 hover:border-[#2E3192]/40 cursor-pointer' : ''}`}>
                         {citizenIdFrontPreview ? (
                            <img src={citizenIdFrontPreview} alt="Front ID" className="w-full h-full object-cover" />
                         ) : (
                           <>
                             <span className={`p-3 bg-card rounded-full shadow-sm mb-3 transition-transform ${isEditingMode ? 'group-hover:scale-110' : ''}`}><Camera size={24} className={`text-muted-foreground transition-colors ${isEditingMode ? 'group-hover:text-[#2E3192]' : ''}`} /></span>
                             <span className="font-medium text-sm text-foreground">{t("editProfile.identity.uploadFrontImg", { defaultValue: "Tải ảnh mặt trước lên" })}</span>
                             <span className="text-xs opacity-70 mt-1">{t("editProfile.identity.imgHint", { defaultValue: "Định dạng JPEG, PNG, max 5MB" })}</span>
                           </>
                         )}
                      </div>
                   </div>
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">{t("editProfile.identity.backImg", { defaultValue: "Ảnh mặt sau CCCD" })}</Label>
                      <input type="file" ref={backInputRef} disabled={!isEditingMode} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileChange(e, setCitizenIdBackFile, setCitizenIdBackPreview)} />
                      <div onClick={() => isEditingMode && backInputRef.current?.click()} className={`relative border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 transition-colors overflow-hidden ${isEditingMode ? 'hover:bg-muted/50 hover:border-[#2E3192]/40 cursor-pointer' : ''}`}>
                         {citizenIdBackPreview ? (
                            <img src={citizenIdBackPreview} alt="Back ID" className="w-full h-full object-cover" />
                         ) : (
                           <>
                             <span className={`p-3 bg-card rounded-full shadow-sm mb-3 transition-transform ${isEditingMode ? 'group-hover:scale-110' : ''}`}><Camera size={24} className={`text-muted-foreground transition-colors ${isEditingMode ? 'group-hover:text-[#2E3192]' : ''}`} /></span>
                             <span className="font-medium text-sm text-foreground">{t("editProfile.identity.uploadBackImg", { defaultValue: "Tải ảnh mặt sau lên" })}</span>
                             <span className="text-xs opacity-70 mt-1">{t("editProfile.identity.imgHint", { defaultValue: "Định dạng JPEG, PNG, max 5MB" })}</span>
                           </>
                         )}
                      </div>
                   </div>
                </div>

                <div className="border-b border-border pb-4 mb-6 mt-10">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.bank.title", { defaultValue: "Tài khoản Ngân hàng (Nhận lương)" })}</h2>
                </div>

                <div className="space-y-4">
                  {formData.bankInformations?.map((bank, index) => {
                    const keyStr = bank.bankAccountNumber ? `bank-${bank.bankAccountNumber}` : `bank-new-${index}`;
                    return (
                    <div key={keyStr} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                          <div className="space-y-1">
                            <Label className="text-xs">{t("editProfile.bank.bankName", { defaultValue: "Ngân hàng" })}</Label>
                            <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.bank.bankNamePlaceholder", { defaultValue: "VD: Vietcombank" })} value={bank.bankName} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.branch", { defaultValue: "Chi nhánh" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.bank.branchPlaceholder", { defaultValue: "VD: HCM" })} value={bank.bankBranch} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankBranch = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.accountName", { defaultValue: "Tên chủ tài khoản" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.bank.accountNamePlaceholder", { defaultValue: "Nhập tên chủ tài khoản" })} value={bank.bankAccountName || ''} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankAccountName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }}/>
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">{t("editProfile.bank.accountNumber", { defaultValue: "Số tài khoản" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.bank.accountNumberPlaceholder", { defaultValue: "VD: 99120xxxxx" })} value={bank.bankAccountNumber||''} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankAccountNumber = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }}/>
                          </div>
                       </div>
                       <Button disabled={!isEditingMode || loading} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => { handleTextChange("bankInformations", formData.bankInformations!.filter((_, i: number) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                    );
                  })}
                  
                  <Button type="button" variant="outline" disabled={!isEditingMode || loading} onClick={() => { handleTextChange("bankInformations", [...(formData.bankInformations||[]), { bankName: '', bankBranch: '', bankAccountName: '', bankAccountNumber: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"><Plus size={16}/> {t("editProfile.bank.addBtn", { defaultValue: "Thêm Tài khoản Ngân hàng" })}</Button>
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.education.title", { defaultValue: "Học vấn & Bằng cấp" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.educationRecords?.map((edu, index) => {
                    const keyStr = edu.institutionName ? `edu-${edu.institutionName}-${index}` : `edu-new-${index}`;
                    return (
                    <div key={keyStr} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.education.fromDate", { defaultValue: "Từ ngày" })}</Label>
                                <Input disabled={!isEditingMode || loading} type="date" value={edu.fromDate || ''} onChange={(e) => {
                                   const arr = [...formData.educationRecords!]; arr[index].fromDate = e.target.value; handleTextChange("educationRecords", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.education.toDate", { defaultValue: "Đến ngày" })}</Label>
                                <Input disabled={!isEditingMode || loading} type="date" value={edu.toDate || ''} onChange={(e) => {
                                   const arr = [...formData.educationRecords!]; arr[index].toDate = e.target.value; handleTextChange("educationRecords", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.education.institutionName", { defaultValue: "Cơ sở đào tạo (Trường học / Trung tâm)" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.education.institutionNamePlaceholder", { defaultValue: "VD: Đại học Khoa học Tự nhiên" })} value={edu.institutionName || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].institutionName = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.education.trainingMode", { defaultValue: "Hình thức đào tạo" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.education.trainingModePlaceholder", { defaultValue: "VD: Chính quy, Từ xa, Vừa làm vừa học" })} value={edu.trainingMode || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].trainingMode = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.education.educationLevel", { defaultValue: "Trình độ học vấn" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.education.educationLevelPlaceholder", { defaultValue: "VD: Cử nhân, Thạc sĩ, Cao đẳng" })} value={edu.educationLevel || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].educationLevel = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.education.major", { defaultValue: "Chuyên ngành" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.education.majorPlaceholder", { defaultValue: "VD: Công nghệ Thông tin" })} value={edu.major || ''} onChange={(e) => {
                                const arr = [...formData.educationRecords!]; arr[index].major = e.target.value; handleTextChange("educationRecords", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                       </div>
                       <Button disabled={!isEditingMode || loading} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => { handleTextChange("educationRecords", formData.educationRecords!.filter((_, i: number) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                    );
                  })}
                  
                  <Button type="button" variant="outline" disabled={!isEditingMode || loading} onClick={() => { handleTextChange("educationRecords", [...(formData.educationRecords||[]), { trainingMode: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.education.addBtn", { defaultValue: "Thêm Bằng cấp/Học vấn" })}</Button>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.experience.title", { defaultValue: "Kinh nghiệm làm việc" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.workExperiences?.map((work, index) => {
                    const keyStr = work.companyName ? `exp-${work.companyName}-${index}` : `exp-new-${index}`;
                    return (
                    <div key={keyStr} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.experience.fromMonth", { defaultValue: "Từ tháng" })}</Label>
                                <Input disabled={!isEditingMode || loading} type="month" value={work.fromMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].fromMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">{t("editProfile.experience.toMonth", { defaultValue: "Đến tháng" })}</Label>
                                <Input disabled={!isEditingMode || loading} type="month" value={work.toMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].toMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.companyName", { defaultValue: "Tên Công ty / Đơn vị" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.experience.companyNamePlaceholder", { defaultValue: "VD: Công ty công nghệ VNFT" })} value={work.companyName || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].companyName = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.position", { defaultValue: "Vị trí công tác" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.experience.positionPlaceholder", { defaultValue: "VD: Nhân viên Phát triển phần mềm" })} value={work.position || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].position = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.experience.referencePerson", { defaultValue: "Người tham chiếu" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.experience.referencePersonPlaceholder", { defaultValue: "VD: Tên người quản lý / Trưởng phòng" })} value={work.referencePerson || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].referencePerson = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">{t("editProfile.experience.phoneNumber", { defaultValue: "SĐT người tham chiếu" })}</Label>
                             <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.experience.phoneNumberPlaceholder", { defaultValue: "VD: 09xxxxxxxx" })} value={work.phoneNumber || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].phoneNumber = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">{t("editProfile.experience.jobDesc", { defaultValue: "Mô tả công việc" })}</Label>
                             <Textarea disabled={!isEditingMode || loading} placeholder={t("editProfile.experience.jobDescPlaceholder", { defaultValue: "Liệt kê ngắn gọn vai trò và các công việc chuyên môn bạn đã đảm nhận tại đơn vị này..." })} rows={4} value={work.jobDescription || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].jobDescription = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="rounded-xl resize-none" />
                          </div>
                       </div>
                       <Button disabled={!isEditingMode || loading} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => { handleTextChange("workExperiences", formData.workExperiences!.filter((_, i: number) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                    );
                  })}
                  
                  <Button type="button" variant="outline" disabled={!isEditingMode || loading} onClick={() => { handleTextChange("workExperiences", [...(formData.workExperiences||[]), { companyName: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.experience.addBtn", { defaultValue: "Thêm Kinh nghiệm" })}</Button>
                </div>
              </div>
            )}

            {activeTab === "dependents" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">{t("editProfile.dependents.title", { defaultValue: "Người phụ thuộc" })}</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.dependents?.map((dep, index) => {
                    const keyStr = dep.dependentFullName ? `dep-${dep.dependentFullName}-${index}` : `dep-new-${index}`;
                    return (
                    <div key={keyStr} className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.dependents.fullNamePlaceholder", { defaultValue: "Họ và Tên" })} value={dep.dependentFullName || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentFullName = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.dependents.relationshipPlaceholder", { defaultValue: "Mối quan hệ" })} value={dep.dependentRelationship || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentRelationship = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input disabled={!isEditingMode || loading} type="date" placeholder={t("editProfile.dependents.dobPlaceholder", { defaultValue: "Ngày sinh" })} value={dep.dependentDateOfBirth || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentDateOfBirth = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.dependents.phonePlaceholder", { defaultValue: "SĐT liên hệ" })} value={dep.dependentPhoneNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentPhoneNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.dependents.identityNumberPlaceholder", { defaultValue: "Số CMT/CCCD" })} value={dep.dependentIdentityNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentIdentityNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input disabled={!isEditingMode || loading} placeholder={t("editProfile.dependents.taxCodePlaceholder", { defaultValue: "Mã số thuế" })} value={dep.dependentTaxCode || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentTaxCode = e.target.value; handleTextChange("dependents", arr);
                          }} />
                       </div>
                       <Button disabled={!isEditingMode || loading} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => { handleTextChange("dependents", formData.dependents!.filter((_, i: number) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                    );
                  })}
                  
                  <Button type="button" variant="outline" disabled={!isEditingMode || loading} onClick={() => { handleTextChange("dependents", [...(formData.dependents||[]), { dependentFullName: '', dependentRelationship: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> {t("editProfile.dependents.addBtn", { defaultValue: "Thêm Khai báo NPT" })}</Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
      </SheetContent>
    </Sheet>
  );
}
