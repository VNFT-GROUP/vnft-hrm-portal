
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { WorkExperienceRequest } from "@/types/user/WorkExperience/WorkExperienceRequest";

interface ProfileExperienceFieldsProps {
  data: WorkExperienceRequest[] | undefined;
  onChange: (data: WorkExperienceRequest[]) => void;
  disabled: boolean;
}

export function ProfileExperienceFields({ data, onChange, disabled }: ProfileExperienceFieldsProps) {
  const { t } = useTranslation();
  const workList = data || [];

  return (
    <div className="space-y-4">
      {workList.map((work, index) => {
        const keyStr = work.companyName ? `exp-${work.companyName}-${index}` : `exp-new-${index}`;
        return (
        <div key={keyStr} className="flex gap-4 items-start bg-muted/30 p-5 rounded-2xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("editProfile.experience.fromMonth", { defaultValue: "Từ tháng" })}</Label>
                  <Input 
                    disabled={disabled} type="month" value={work.fromMonth || ''} 
                    onChange={e => { const arr = [...workList]; arr[index].fromMonth = e.target.value; onChange(arr); }} 
                    className="h-11 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("editProfile.experience.toMonth", { defaultValue: "Đến tháng" })}</Label>
                  <Input 
                    disabled={disabled} type="month" value={work.toMonth || ''} 
                    onChange={e => { const arr = [...workList]; arr[index].toMonth = e.target.value; onChange(arr); }} 
                    className="h-11 rounded-xl" 
                  />
                </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">{t("editProfile.experience.companyName", { defaultValue: "Tên Công ty / Đơn vị" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.experience.companyNamePlaceholder", { defaultValue: "VD: Công ty công nghệ VNFT" })} 
                  value={work.companyName || ''} 
                  onChange={e => { const arr = [...workList]; arr[index].companyName = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">{t("editProfile.experience.position", { defaultValue: "Vị trí công tác" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.experience.positionPlaceholder", { defaultValue: "VD: Nhân viên Phát triển phần mềm" })} 
                  value={work.position || ''} 
                  onChange={e => { const arr = [...workList]; arr[index].position = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs">{t("editProfile.experience.referencePerson", { defaultValue: "Người tham chiếu" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.experience.referencePersonPlaceholder", { defaultValue: "VD: Tên người quản lý / Trưởng phòng" })} 
                  value={work.referencePerson || ''} 
                  onChange={e => { const arr = [...workList]; arr[index].referencePerson = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs">{t("editProfile.experience.phoneNumber", { defaultValue: "SĐT người tham chiếu" })}</Label>
                <Input 
                  disabled={disabled} placeholder={t("editProfile.experience.phoneNumberPlaceholder", { defaultValue: "VD: 09xxxxxxxx" })} 
                  value={work.phoneNumber || ''} 
                  onChange={e => { const arr = [...workList]; arr[index].phoneNumber = e.target.value; onChange(arr); }} 
                  className="h-11 rounded-xl" 
                />
            </div>
            <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">{t("editProfile.experience.jobDesc", { defaultValue: "Mô tả công việc" })}</Label>
                <Textarea 
                  disabled={disabled} placeholder={t("editProfile.experience.jobDescPlaceholder", { defaultValue: "Liệt kê ngắn gọn vai trò và các công việc chuyên môn bạn đã đảm nhận tại đơn vị này..." })} 
                  rows={4} value={work.jobDescription || ''} 
                  onChange={e => { const arr = [...workList]; arr[index].jobDescription = e.target.value; onChange(arr); }} 
                  className="rounded-xl resize-none" 
                />
            </div>
          </div>
          <Button 
            disabled={disabled} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" 
            onClick={() => onChange(workList.filter((_, i) => i !== index))}
          >
            <Trash2 size={16}/>
          </Button>
        </div>
        );
      })}
      
      <Button 
        type="button" variant="outline" disabled={disabled} 
        onClick={() => onChange([...workList, { companyName: '' }])} 
        className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"
      >
        <Plus size={16}/> {t("editProfile.experience.addBtn", { defaultValue: "Thêm Kinh nghiệm" })}
      </Button>
    </div>
  );
}
