import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, SearchX, Trash2 } from 'lucide-react';
import type { EmployeeCodeResponse } from '@/types/response/user/EmployeeCodeResponse';
import { useTranslation } from 'react-i18next';

export default function EmployeeCodeTable({ data, onEdit, onDelete }: { data: EmployeeCodeResponse[], onEdit: (i: EmployeeCodeResponse) => void, onDelete: (id: string) => void }) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center gap-4'>
        <div className='w-20 h-20 bg-muted rounded-full flex items-center justify-center'><SearchX className='text-muted-foreground w-10 h-10' /></div>
        <h3 className='text-xl font-semibold text-foreground mt-2'>Không tìm thấy dữ liệu</h3>
      </div>
    );
  }

  return (
    <div className='w-full overflow-auto'>
      <Table>
        <TableHeader className='bg-muted/50'>
          <TableRow>
            <TableHead className='font-semibold text-[#1E2062]'>Prefix</TableHead>
            <TableHead className='font-semibold text-[#1E2062]'>Trạng thái</TableHead>
            <TableHead className='font-semibold text-[#1E2062]'>Mô tả</TableHead>
            <TableHead className='text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className='hover:bg-muted/30 transition-colors'>
              <TableCell className='font-medium text-foreground'>{item.prefix}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.active ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                </span>
              </TableCell>
              <TableCell className='text-muted-foreground'>{item.description || '-'}</TableCell>
              <TableCell className='text-right'>
                <div className='flex justify-end gap-2'>
                  <Button variant='ghost' size='icon' onClick={() => onEdit(item)} className='text-[#2E3192] hover:bg-[#2E3192]/10 rounded-full w-8 h-8'>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant='ghost' size='icon' onClick={() => { if(window.confirm('Bạn có chắc chắn?')) onDelete(item.id); }} className='text-rose-500 hover:bg-rose-50 rounded-full w-8 h-8'>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
