import { useState } from 'react';
import { Plus, Search, FileText, MousePointerClick, Edit2, Power } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useLayoutStore } from "@/store/useLayoutStore";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { m  } from 'framer-motion';
import EmployeeCodeTable from './components/EmployeeCodeTable';
import EmployeeCodeFormSheet from './components/EmployeeCodeFormSheet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeCodeService } from '@/services/employeeCode';
import { toast } from 'sonner';
import type { UpsertEmployeeCodeRequest } from '@/types/user/UpsertEmployeeCodeRequest';
import type { UpdateEmployeeCodeDescriptionRequest } from '@/types/user/UpdateEmployeeCodeDescriptionRequest';
import type { EmployeeCodeResponse } from '@/types/user/EmployeeCodeResponse';

export default function EmployeeCodesPage() {
  const { t } = useTranslation();
  const showRoleLegend = useLayoutStore((state) => state.showRoleLegend);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmployeeCodeResponse | null>(null);

  const [formData, setFormData] = useState<{prefix: string, description: string, active: boolean}>({ 
    prefix: '', description: '', active: true
  });

  const { data: qData } = useQuery({
    queryKey: ['employee-codes'],
    queryFn: () => employeeCodeService.getEmployeeCodes(),
  });

  const codes: EmployeeCodeResponse[] = qData?.data || [];
  const filtered = codes.filter(c => c.prefix.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (item?: EmployeeCodeResponse) => {
    if (item) {
      setEditingItem(item);
      setFormData({ 
        prefix: item.prefix, 
        description: item.description || '', 
        active: item.active ?? false
      });
    } else {
      setEditingItem(null);
      setFormData({ prefix: '', description: '', active: true });
    }
    setIsOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UpsertEmployeeCodeRequest) => employeeCodeService.createEmployeeCode(data),
    onSuccess: () => {
      toast.success('Tạo thành công');
      queryClient.invalidateQueries({ queryKey: ['employee-codes'] });
      setIsOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => employeeCodeService.toggleActiveEmployeeCode(id),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['employee-codes'] });
    },
  });

  const updateDescMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeCodeDescriptionRequest }) =>
      employeeCodeService.updateEmployeeCodeDescription(id, data),
    onSuccess: () => {
      toast.success('Cập nhật mô tả thành công');
      queryClient.invalidateQueries({ queryKey: ['employee-codes'] });
      setIsOpen(false);
    },
  });

  const handleSave = () => {
    if (editingItem) {
      updateDescMutation.mutate({ id: editingItem.id, data: { description: formData.description } });
      return;
    }

    if (!formData.prefix.trim()) return;

    const payload: UpsertEmployeeCodeRequest = {
      prefix: formData.prefix,
      description: formData.description,
      active: formData.active,
    };

    createMutation.mutate(payload);
  };

  const handleToggleActive = (id: string) => {
    toggleMutation.mutate(id);
  };


  return (
    <div className='p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8'>
      <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col gap-2'>
        <h1 className='text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3'>
          <span className='p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl'><FileText size={28} /></span>
          {t('management.employeeCodesTitle', { defaultValue: 'Quản lý Mã nhân viên' })}
        </h1>
        <p className='text-muted-foreground text-base md:text-lg ml-1'>
          {t('management.employeeCodesDesc', { defaultValue: 'Thiết lập cấu hình tiền tố mã nhân viên (Prefix)' })}
        </p>
      </m.div>

      {showRoleLegend && (
        <m.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className='bg-card p-4 rounded-xl border border-border flex flex-col gap-3 text-sm text-muted-foreground w-full shadow-sm'
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
            <span className="font-semibold text-[#1E2062] mr-2">
              {t('management.actionLegend', { defaultValue: 'Chú thích thao tác:' })}
            </span>
            <div className="flex items-center gap-2">
              <Edit2 size={16} className="text-[#2E3192]" />
              <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Power size={16} className="text-emerald-500" />
              <span>{t('management.toggleLegend', { defaultValue: 'Bật / Tắt hoạt động' })}</span>
            </div>
            <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
              {t('management.hideLegendHint', { defaultValue: 'Nhấn Alt + S để bật tắt mục này' })}
            </div>
          </div>
          <div className="w-full h-px bg-border/50 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[#2E3192]">
            <MousePointerClick size={16} />
            <span className="italic">{t('management.actionTooltip', { defaultValue: 'Mẹo: Click chuột phải vào dòng dữ liệu để thao tác nhanh.' })}</span>
          </div>
        </m.div>
      )}

      <m.div className='bg-card p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='relative w-full md:w-96'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground' size={20} />
          <Input placeholder={t('management.searchPrefixPlaceholder', { defaultValue: 'Tìm kiếm prefix...' })} className='pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] hover:bg-card transition-colors' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button onClick={() => handleOpenForm()} className='w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300'>
          <Plus size={20} className='mr-2' /> {t('management.addNew', { defaultValue: 'Tạo mới' })}
        </Button>
      </m.div>

      <m.div className='bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex-1 group hover:shadow-md transition-shadow duration-300'>
        <EmployeeCodeTable data={filtered} onToggleActive={handleToggleActive} onEdit={handleOpenForm} />
      </m.div>

      <EmployeeCodeFormSheet isOpen={isOpen} onOpenChange={setIsOpen} formData={formData} setFormData={setFormData} isEditing={!!editingItem} onSave={handleSave} />
    </div>
  );
}
