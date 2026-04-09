import { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import EmployeeCodeTable from './components/EmployeeCodeTable';
import EmployeeCodeFormSheet from './components/EmployeeCodeFormSheet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeCodeService } from '@/services/employeeCode';
import { toast } from 'sonner';
import type { UpsertEmployeeCodeRequest } from '@/types/request/user/UpsertEmployeeCodeRequest';
import type { EmployeeCodeResponse } from '@/types/response/user/EmployeeCodeResponse';

export default function EmployeeCodesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<{prefix: string, description: string, active: boolean}>({ 
    prefix: '', description: '', active: true
  });

  const { data: qData } = useQuery({
    queryKey: ['employee-codes'],
    queryFn: () => employeeCodeService.getEmployeeCodes(),
  });

  const codes: EmployeeCodeResponse[] = qData?.data || [];
  const filtered = codes.filter(c => c.prefix.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = () => {
    setFormData({ prefix: '', description: '', active: true });
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

  const handleSave = () => {
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
    <div className='p-4 md:p-8 w-full max-w-6xl mx-auto min-h-full flex flex-col gap-6 md:gap-8'>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col gap-2'>
        <h1 className='text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3'>
          <span className='p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl'><FileText size={28} /></span>
          Quản lý Mã nhân viên
        </h1>
        <p className='text-muted-foreground text-base md:text-lg ml-1'>Thiết lập cấu hình tiền tố mã nhân viên (Prefix)</p>
      </motion.div>

      <motion.div className='bg-card p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='relative w-full md:w-96'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground' size={20} />
          <Input placeholder='Tìm kiếm prefix...' className='pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] hover:bg-card transition-colors' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button onClick={() => handleOpenForm()} className='w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300'>
          <Plus size={20} className='mr-2' /> Tạo mới
        </Button>
      </motion.div>

      <motion.div className='bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex-1 group hover:shadow-md transition-shadow duration-300'>
        <EmployeeCodeTable data={filtered} onToggleActive={handleToggleActive} />
      </motion.div>

      <EmployeeCodeFormSheet isOpen={isOpen} onOpenChange={setIsOpen} formData={formData} setFormData={setFormData} onSave={handleSave} />
    </div>
  );
}
