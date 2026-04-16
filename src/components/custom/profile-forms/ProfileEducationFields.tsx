import React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { EducationRecordRequest } from "@/types/user/EducationRecord/EducationRecordRequest";

interface ProfileEducationFieldsProps {
  data: EducationRecordRequest[] | undefined;
  onChange: (data: EducationRecordRequest[]) => void;
  disabled: boolean;
}

export function ProfileEducationFields({ data, onChange, disabled }: ProfileEducationFieldsProps) {
  const { t } = useTranslation();
  const eduList = data || [];

  return (
    <div className="space-y-4">
      {eduList.map((edu, index) => (
        <div key={index} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("editProfile.education.fromDate", { defaultValue: "Từ ngày" })}</Label>
                  <Input 
                    disabled={disabled} type="date" value={edu.fromDate || ''} 
                    onChange={e => { const arr = [...eduList]; arr[index].fromDate = e.target.value; onChange(arr); }} 
                    className="h-11 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("editProfile.education.toDate", { defaultValue: "Đến ngày" })}</Label>
                  <Input 
                    disabled={disabled} type="date" value={edu.toDate || ''} 
                    onChange={e => { const arr = [...eduList]; arr[index].toDate = e.target.value; onChange(arr); }} 
                    className="h-11 rounded-xl" 
                  />
                </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">{t("editProfile.education.institutionName", { defaultValue: "Cơ sở đào tạo (Trường học / Trung tâm)" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.education.institutionNamePlaceholder", { defaultValue: "VD: Đại học Khoa học Tự nhiên" })} 
                  value={edu.institutionName || ''} 
                  onChange={e => { const arr = [...eduList]; arr[index].institutionName = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs">{t("editProfile.education.trainingMode", { defaultValue: "Hình thức đào tạo" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.education.trainingModePlaceholder", { defaultValue: "VD: Chính quy, Từ xa, Vừa làm vừa học" })} 
                  value={edu.trainingMode || ''} 
                  onChange={e => { const arr = [...eduList]; arr[index].trainingMode = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs">{t("editProfile.education.educationLevel", { defaultValue: "Trình độ học vấn" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.education.educationLevelPlaceholder", { defaultValue: "VD: Cử nhân, Thạc sĩ, Cao đẳng" })} 
                  value={edu.educationLevel || ''} 
                  onChange={e => { const arr = [...eduList]; arr[index].educationLevel = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">{t("editProfile.education.major", { defaultValue: "Chuyên ngành" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.education.majorPlaceholder", { defaultValue: "VD: Công nghệ Thông tin" })} 
                  value={edu.major || ''} 
                  onChange={e => { const arr = [...eduList]; arr[index].major = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
          </div>
          <Button 
            disabled={disabled} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" 
            onClick={() => onChange(eduList.filter((_, i) => i !== index))}
          >
            <Trash2 size={16}/>
          </Button>
        </div>
      ))}
      
      <Button 
        type="button" variant="outline" disabled={disabled} 
        onClick={() => onChange([...eduList, { trainingMode: '' }])} 
        className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"
      >
        <Plus size={16}/> {t("editProfile.education.addBtn", { defaultValue: "Thêm Bằng cấp/Học vấn" })}
      </Button>
    </div>
  );
}
