
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { BankInformationRequest } from "@/types/user/BankInformation/BankInformationRequest";

interface ProfileBankFieldsProps {
  data: BankInformationRequest[] | undefined;
  onChange: (data: BankInformationRequest[]) => void;
  disabled: boolean;
}

export function ProfileBankFields({ data, onChange, disabled }: ProfileBankFieldsProps) {
  const { t } = useTranslation();
  const bankList = data || [];

  return (
    <div className="space-y-4">
      {bankList.map((bank, index) => {
        const keyStr = bank.bankAccountNumber ? `bank-${bank.bankAccountNumber}` : `bank-new-${index}`;
        return (
        <div key={keyStr} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
            <div className="space-y-1">
              <Label className="text-xs">{t("editProfile.bank.bankName", { defaultValue: "Ngân hàng" })}</Label>
              <Input 
                disabled={disabled} 
                placeholder={t("editProfile.bank.bankNamePlaceholder", { defaultValue: "VD: Vietcombank" })} 
                value={bank.bankName || ''} 
                onChange={e => {
                  const newBanks = [...bankList];
                  newBanks[index].bankName = e.target.value;
                  onChange(newBanks);
                }} 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("editProfile.bank.branch", { defaultValue: "Chi nhánh" })}</Label>
              <Input 
                disabled={disabled} 
                placeholder={t("editProfile.bank.branchPlaceholder", { defaultValue: "VD: HCM" })} 
                value={bank.bankBranch || ''} 
                onChange={e => {
                  const newBanks = [...bankList];
                  newBanks[index].bankBranch = e.target.value;
                  onChange(newBanks);
                }} 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("editProfile.bank.accountName", { defaultValue: "Tên chủ tài khoản" })}</Label>
              <Input 
                disabled={disabled} 
                placeholder={t("editProfile.bank.accountNamePlaceholder", { defaultValue: "Nhập tên chủ tài khoản" })} 
                value={bank.bankAccountName || ''} 
                onChange={e => {
                  const newBanks = [...bankList];
                  newBanks[index].bankAccountName = e.target.value;
                  onChange(newBanks);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("editProfile.bank.accountNumber", { defaultValue: "Số tài khoản" })}</Label>
              <Input 
                disabled={disabled} 
                placeholder={t("editProfile.bank.accountNumberPlaceholder", { defaultValue: "VD: 99120xxxxx" })} 
                value={bank.bankAccountNumber || ''} 
                onChange={e => {
                  const newBanks = [...bankList];
                  newBanks[index].bankAccountNumber = e.target.value;
                  onChange(newBanks);
                }}
              />
            </div>
          </div>
          <Button 
            disabled={disabled} 
            type="button" 
            variant="destructive" 
            size="icon" 
            className="shrink-0 rounded-xl" 
            onClick={() => onChange(bankList.filter((_, i) => i !== index))}
          >
            <Trash2 size={16}/>
          </Button>
        </div>
        );
      })}
      
      <Button 
        type="button" 
        variant="outline" 
        disabled={disabled} 
        onClick={() => onChange([...bankList, { bankName: '', bankBranch: '', bankAccountName: '', bankAccountNumber: '' }])}
        className="border-dashed border-2 gap-2 w-full h-12 rounded-xl text-muted-foreground hover:text-primary"
      >
        <Plus size={16}/> {t("editProfile.bank.addBtn", { defaultValue: "Thêm Tài khoản Ngân hàng" })}
      </Button>
    </div>
  );
}
