import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Shield, BookOpen, Briefcase, MapPin, Plus, Trash2, Users, Camera } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UpsertUserProfileRequest } from "@/types/request/user/UpsertUserProfileRequest";

export default function EditProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [activeTab, setActiveTab] = useState("basic");

  // Common select styles matching Shadcn Input
  const selectClassName = "flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-card";

  const [formData, setFormData] = useState<Partial<UpsertUserProfileRequest>>({
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

  const handleTextChange = <K extends keyof UpsertUserProfileRequest>(field: K, value: UpsertUserProfileRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-filter out empty template rows before submitting
    const payload = { ...formData };
    
    payload.bankInformations = payload.bankInformations?.filter(b => b.bankAccountNumber?.trim() || b.bankName?.trim());
    payload.dependents = payload.dependents?.filter(d => d.dependentFullName?.trim() || d.dependentRelationship?.trim());
    payload.educationRecords = payload.educationRecords?.filter(ed => ed.institutionName?.trim() || ed.major?.trim());
    payload.workExperiences = payload.workExperiences?.filter(w => w.companyName?.trim() || w.position?.trim());

    console.log("Submitting payload:", payload);
    
    // Simulate updating API request
    toast.success(t("profile.updateSuccess", { defaultValue: "Cập nhật hồ sơ thành công" }), {
      description: "Toàn bộ thông tin cá nhân và lý lịch đã được đối soát."
    });
    navigate("/app/profile");
  };

  const tabs = [
    { id: "basic", label: "Thông tin cơ bản", icon: <User size={16} /> },
    { id: "contact", label: "Cư trú & Liên hệ", icon: <MapPin size={16} /> },
    { id: "identity", label: "CCCD & Ngân hàng", icon: <Shield size={16} /> },
    { id: "education", label: "Học vấn", icon: <BookOpen size={16} /> },
    { id: "experience", label: "Kinh nghiệm", icon: <Briefcase size={16} /> },
    { id: "dependents", label: "Người phụ thuộc", icon: <Users size={16} /> },
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
            <h1 className="text-2xl font-bold text-foreground">Cập nhật hồ sơ</h1>
            <p className="text-sm text-muted-foreground">Chỉnh sửa toàn bộ thông tin cá nhân thuộc hệ thống quản trị</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          className="rounded-xl bg-[#F7941D] hover:bg-[#D87D12] text-white shadow-md shadow-[#F7941D]/20 hover:shadow-[#F7941D]/40 transition-all gap-2 h-11 px-7 font-semibold"
        >
          <Save size={18} /> 
          Lưu thay đổi hồ sơ
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
                  <h2 className="text-lg font-bold text-foreground">Thông tin cơ bản</h2>
                  <p className="text-sm text-muted-foreground">Các thông tin cá nhân và định danh cơ bản.</p>
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
                     <h3 className="font-semibold text-foreground">Ảnh chân dung</h3>
                     <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">Định dạng hỗ trợ: JPEG, PNG, WEBP. Kích thước tỷ lệ 1:1, dung lượng tối đa 5MB.</p>
                     <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl text-xs font-medium bg-card hover:bg-[#2E3192]/5 hover:text-[#2E3192] hover:border-[#2E3192]/30 transition-colors">
                        Chọn tệp tải lên
                     </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Mã nhân viên (Bắt buộc)</Label>
                    <Input 
                      value={formData.employeeCode}
                      onChange={(e) => handleTextChange("employeeCode", e.target.value)}
                      placeholder="VD: VNSGN090" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Họ và Tên <span className="text-destructive">*</span></Label>
                    <Input 
                      value={formData.fullName}
                      onChange={(e) => handleTextChange("fullName", e.target.value)}
                      placeholder="VD: Trương Thành Nhân" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tên tiếng Anh (English Name)</Label>
                    <Input 
                      value={formData.englishName}
                      onChange={(e) => handleTextChange("englishName", e.target.value)}
                      placeholder="VD: Ethan Truong" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input 
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleTextChange("phoneNumber", e.target.value)}
                      placeholder="VD: 0987654321" 
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                     <Label>Ngày sinh (Date of Birth)</Label>
                     <Input 
                       type="date"
                       value={formData.dateOfBirth} 
                       onChange={(e) => handleTextChange("dateOfBirth", e.target.value)}
                       className="h-11 rounded-xl" 
                     />
                  </div>
                  <div className="space-y-2">
                    <Label>Giới tính</Label>
                    <select 
                      className={selectClassName} 
                      value={formData.gender} 
                      onChange={(e) => handleTextChange("gender", e.target.value as UpsertUserProfileRequest['gender'])}
                    >
                       <option value="MALE">Nam</option>
                       <option value="FEMALE">Nữ</option>
                       <option value="OTHER">Hệ khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tình trạng hôn nhân</Label>
                    <select 
                      className={selectClassName} 
                      value={formData.maritalStatus} 
                      onChange={(e) => handleTextChange("maritalStatus", e.target.value as UpsertUserProfileRequest['maritalStatus'])}
                    >
                       <option value="SINGLE">Độc thân</option>
                       <option value="MARRIED">Đã kết hôn</option>
                       <option value="DIVORCED">Đã ly hôn</option>
                       <option value="WIDOWED">Góa</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nơi sinh</Label>
                    <Input value={formData.placeOfBirth} onChange={(e) => handleTextChange("placeOfBirth", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quê quán</Label>
                    <Input value={formData.placeOfOrigin} onChange={(e) => handleTextChange("placeOfOrigin", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:col-span-2">
                     <div className="space-y-2">
                       <Label>Quốc tịch</Label>
                       <Input value={formData.nationality} onChange={(e) => handleTextChange("nationality", e.target.value)} className="h-11 rounded-xl" />
                     </div>
                     <div className="space-y-2">
                       <Label>Dân tộc</Label>
                       <Input value={formData.ethnicity} onChange={(e) => handleTextChange("ethnicity", e.target.value)} className="h-11 rounded-xl" />
                     </div>
                     <div className="space-y-2">
                       <Label>Tôn giáo</Label>
                       <Input value={formData.religion} onChange={(e) => handleTextChange("religion", e.target.value)} className="h-11 rounded-xl" />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* CƯ TRÚ VÀ LIÊN HỆ */}
            {activeTab === "contact" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">Liên hệ và Báo tin</h2>
                  <p className="text-sm text-muted-foreground">Địa chỉ thường trú và địa chỉ cư trú hiện tại.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> Hộ khẩu thường trú</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tỉnh/Thành phố</Label>
                          <Input value={formData.permanentCity} onChange={(e) => handleTextChange("permanentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Địa chỉ chi tiết (Số nhà, đường)</Label>
                          <Input value={formData.permanentAddress} onChange={(e) => handleTextChange("permanentAddress", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
                     <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16}/> Chỗ ở hiện tại</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tỉnh/Thành phố hiện tại</Label>
                          <Input value={formData.currentCity} onChange={(e) => handleTextChange("currentCity", e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Địa chỉ hiện tại</Label>
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
                  <h2 className="text-lg font-bold text-foreground">Định danh CCCD</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <Label>Số CCCD</Label>
                    <Input value={formData.citizenIdNumber} onChange={(e) => handleTextChange("citizenIdNumber", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày cấp</Label>
                    <Input type="date" value={formData.citizenIdIssueDate} onChange={(e) => handleTextChange("citizenIdIssueDate", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nơi cấp</Label>
                    <Input value={formData.citizenIdIssuePlace} onChange={(e) => handleTextChange("citizenIdIssuePlace", e.target.value)} className="h-11 rounded-xl" />
                  </div>
                </div>

                {/* CCCD IMAGES UPLOAD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">Ảnh mặt trước CCCD</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/50 hover:border-[#2E3192]/40 transition-colors cursor-pointer overflow-hidden">
                         <span className="p-3 bg-card rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-muted-foreground group-hover:text-[#2E3192] transition-colors" /></span>
                         <span className="font-medium text-sm text-foreground">Tải ảnh mặt trước lên</span>
                         <span className="text-xs opacity-70 mt-1">Định dạng JPEG, PNG, max 5MB</span>
                      </div>
                   </div>
                   <div className="space-y-3 relative group">
                      <Label className="font-semibold block">Ảnh mặt sau CCCD</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/50 hover:border-[#2E3192]/40 transition-colors cursor-pointer overflow-hidden">
                         <span className="p-3 bg-card rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera size={24} className="text-muted-foreground group-hover:text-[#2E3192] transition-colors" /></span>
                         <span className="font-medium text-sm text-foreground">Tải ảnh mặt sau lên</span>
                         <span className="text-xs opacity-70 mt-1">Định dạng JPEG, PNG, max 5MB</span>
                      </div>
                   </div>
                </div>

                <div className="border-b border-border pb-4 mb-6 mt-10">
                  <h2 className="text-lg font-bold text-foreground">Tài khoản Ngân hàng (Nhận lương)</h2>
                </div>

                <div className="space-y-4">
                  {formData.bankInformations?.map((bank, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
                          <div className="space-y-1">
                            <Label className="text-xs">Ngân hàng</Label>
                            <Input placeholder="VD: Vietcombank" value={bank.bankName} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">Chi nhánh</Label>
                             <Input placeholder="VD: HCM" value={bank.bankBranch} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankBranch = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }} />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">Tên chủ tài khoản</Label>
                             <Input placeholder="VD: TRUONG THANH NHAN" value={bank.bankAccountName || ''} onChange={e => {
                               const newBanks = [...formData.bankInformations!];
                               newBanks[index].bankAccountName = e.target.value;
                               handleTextChange("bankInformations", newBanks);
                            }}/>
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs">Số tài khoản</Label>
                             <Input placeholder="VD: 99120..." value={bank.bankAccountNumber||''} onChange={e => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"><Plus size={16}/> Thêm Tài khoản Ngân hàng</Button>
                </div>
              </div>
            )}

            {/* HỌC VẤN */}
            {activeTab === "education" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">Học vấn & Bằng cấp</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.educationRecords?.map((edu, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <Input type="date" placeholder="Từ ngày" value={edu.fromDate || ''} onChange={(e) => {
                             const arr = [...formData.educationRecords!]; arr[index].fromDate = e.target.value; handleTextChange("educationRecords", arr);
                          }} />
                          <Input type="date" placeholder="Đến ngày" value={edu.toDate || ''} onChange={(e) => {
                             const arr = [...formData.educationRecords!]; arr[index].toDate = e.target.value; handleTextChange("educationRecords", arr);
                          }} />
                          <Input placeholder="Hình thức đào tạo" value={edu.trainingMode || ''} onChange={(e) => {
                             const arr = [...formData.educationRecords!]; arr[index].trainingMode = e.target.value; handleTextChange("educationRecords", arr);
                          }} />
                          <Input placeholder="Chuyên ngành" value={edu.major || ''} onChange={(e) => {
                             const arr = [...formData.educationRecords!]; arr[index].major = e.target.value; handleTextChange("educationRecords", arr);
                          }} />
                          <Input placeholder="Trình độ" value={edu.educationLevel || ''} onChange={(e) => {
                             const arr = [...formData.educationRecords!]; arr[index].educationLevel = e.target.value; handleTextChange("educationRecords", arr);
                          }} />
                          <Input placeholder="Cơ sở đào tạo (Trường)" value={edu.institutionName || ''} onChange={(e) => {
                             const arr = [...formData.educationRecords!]; arr[index].institutionName = e.target.value; handleTextChange("educationRecords", arr);
                          }} />
                       </div>
                       <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" onClick={() => {
                          handleTextChange("educationRecords", formData.educationRecords!.filter((_, i) => i !== index));
                       }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={() => {
                     handleTextChange("educationRecords", [...(formData.educationRecords||[]), { trainingMode: '' }]);
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> Thêm Bằng cấp/Học vấn</Button>
                </div>
              </div>
            )}

            {/* KINH NGHIỆM */}
            {activeTab === "experience" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">Kinh nghiệm làm việc</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.workExperiences?.map((work, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="grid grid-cols-2 gap-4 md:col-span-2">
                             <div className="space-y-1.5">
                                <Label className="text-xs">Từ tháng</Label>
                                <Input type="month" value={work.fromMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].fromMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">Đến tháng</Label>
                                <Input type="month" value={work.toMonth || ''} onChange={(e) => {
                                   const arr = [...formData.workExperiences!]; arr[index].toMonth = e.target.value; handleTextChange("workExperiences", arr);
                                }} className="h-11 rounded-xl" />
                             </div>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">Tên Công ty / Đơn vị</Label>
                             <Input placeholder="VD: Công ty công nghệ VNFT" value={work.companyName || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].companyName = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">Vị trí công tác</Label>
                             <Input placeholder="VD: Nhân viên Phát triển phần mềm" value={work.position || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].position = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">Người tham chiếu</Label>
                             <Input placeholder="VD: Nguyễn Văn B (Trưởng phòng)" value={work.referencePerson || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].referencePerson = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-xs">SĐT người tham chiếu</Label>
                             <Input placeholder="VD: 0912345678" value={work.phoneNumber || ''} onChange={(e) => {
                                const arr = [...formData.workExperiences!]; arr[index].phoneNumber = e.target.value; handleTextChange("workExperiences", arr);
                             }} className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                             <Label className="text-xs">Mô tả công việc</Label>
                             <Textarea placeholder="Liệt kê ngắn gọn vai trò và các công việc chuyên môn bạn đã đảm nhận tại đơn vị này..." rows={4} value={work.jobDescription || ''} onChange={(e) => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> Thêm Kinh nghiệm</Button>
                </div>
              </div>
            )}

            {/* NGƯỜI PHỤ THUỘC */}
            {activeTab === "dependents" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-border pb-4 mb-6">
                  <h2 className="text-lg font-bold text-foreground">Người phụ thuộc</h2>
                </div>
                
                <div className="space-y-4">
                  {formData.dependents?.map((dep, index) => (
                    <div key={index} className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <Input placeholder="Họ và Tên" value={dep.dependentFullName || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentFullName = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder="Mối quan hệ" value={dep.dependentRelationship || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentRelationship = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input type="date" placeholder="Ngày sinh" value={dep.dependentDateOfBirth || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentDateOfBirth = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder="SĐT liên hệ" value={dep.dependentPhoneNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentPhoneNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder="Số CMT/CCCD" value={dep.dependentIdentityNumber || ''} onChange={(e) => {
                             const arr = [...formData.dependents!]; arr[index].dependentIdentityNumber = e.target.value; handleTextChange("dependents", arr);
                          }} />
                          <Input placeholder="Mã số thuế" value={dep.dependentTaxCode || ''} onChange={(e) => {
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
                  }} className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground"><Plus size={16}/> Thêm Khai báo NPT</Button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
