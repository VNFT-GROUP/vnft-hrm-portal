
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { DependentRequest } from "@/types/user/Dependent/DependentRequest";

interface ProfileDependentFieldsProps {
  data: DependentRequest[] | undefined;
  onChange: (data: DependentRequest[]) => void;
  disabled: boolean;
}

export function ProfileDependentFields({ data, onChange, disabled }: ProfileDependentFieldsProps) {
  const { t } = useTranslation();
  const depList = data || [];

  return (
    <div className="space-y-4">
      {depList.map((dep, index) => (
        <div key={index} className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <Input 
              disabled={disabled} placeholder={t("editProfile.dependents.fullNamePlaceholder", { defaultValue: "Họ và Tên" })} 
              value={dep.dependentFullName || ''} 
              onChange={e => { const arr = [...depList]; arr[index].dependentFullName = e.target.value; onChange(arr); }} 
            />
            <Input 
              disabled={disabled} placeholder={t("editProfile.dependents.relationshipPlaceholder", { defaultValue: "Mối quan hệ" })} 
              value={dep.dependentRelationship || ''} 
              onChange={e => { const arr = [...depList]; arr[index].dependentRelationship = e.target.value; onChange(arr); }} 
            />
            <Input 
              disabled={disabled} type="date" placeholder={t("editProfile.dependents.dobPlaceholder", { defaultValue: "Ngày sinh" })} 
              value={dep.dependentDateOfBirth || ''} 
              onChange={e => { const arr = [...depList]; arr[index].dependentDateOfBirth = e.target.value; onChange(arr); }} 
            />
            <Input 
              disabled={disabled} placeholder={t("editProfile.dependents.phonePlaceholder", { defaultValue: "SĐT liên hệ" })} 
              value={dep.dependentPhoneNumber || ''} 
              onChange={e => { const arr = [...depList]; arr[index].dependentPhoneNumber = e.target.value; onChange(arr); }} 
            />
            <Input 
              disabled={disabled} placeholder={t("editProfile.dependents.identityNumberPlaceholder", { defaultValue: "Số CMT/CCCD" })} 
              value={dep.dependentIdentityNumber || ''} 
              onChange={e => { const arr = [...depList]; arr[index].dependentIdentityNumber = e.target.value; onChange(arr); }} 
            />
            <Input 
              disabled={disabled} placeholder={t("editProfile.dependents.taxCodePlaceholder", { defaultValue: "Mã số thuế" })} 
              value={dep.dependentTaxCode || ''} 
              onChange={e => { const arr = [...depList]; arr[index].dependentTaxCode = e.target.value; onChange(arr); }} 
            />
          </div>
          <Button 
            disabled={disabled} type="button" variant="destructive" size="icon" className="shrink-0 rounded-xl" 
            onClick={() => onChange(depList.filter((_, i) => i !== index))}
          >
            <Trash2 size={16}/>
          </Button>
        </div>
      ))}
      
      <Button 
        type="button" variant="outline" disabled={disabled} 
        onClick={() => onChange([...depList, { dependentFullName: '', dependentRelationship: '' }])} 
        className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"
      >
        <Plus size={16}/> {t("editProfile.dependents.addBtn", { defaultValue: "Thêm Khai báo NPT" })}
      </Button>
    </div>
  );
}
