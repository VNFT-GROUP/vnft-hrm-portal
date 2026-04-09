import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export default function EmployeeCodeFormSheet({
  isOpen, onOpenChange, formData, setFormData, isEditing, onSave
}: any) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto sm:max-w-md w-full bg-card border-none shadow-2xl rounded-l-3xl z-50 flex flex-col h-full right-0 p-0'>
        <div className='px-6 py-5 border-b border-border bg-gradient-to-b from-muted/50 to-transparent'>
          <SheetHeader><SheetTitle className='text-2xl font-bold text-[#1E2062]'>{isEditing ? 'Cập nhật' : 'Tạo mới'} Prefix</SheetTitle></SheetHeader>
        </div>
        <div className='px-6 py-6 flex flex-col gap-6 flex-1'>
          <div className='space-y-2'>
            <Label>Prefix <span className='text-rose-500'>*</span></Label>
            <Input value={formData.prefix} onChange={(e) => setFormData({...formData, prefix: e.target.value})} placeholder='VD: VN, SGN' className='h-12 rounded-xl focus-visible:ring-[#2E3192]' />
          </div>
          <div className='space-y-2'>
            <Label>Mô tả</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder='Nhập mô tả' className='rounded-xl focus-visible:ring-[#2E3192] min-h-[120px]' />
          </div>
          <div className='flex items-center space-x-2 pt-2'>
            <Checkbox id='active' checked={formData.active} onCheckedChange={(c) => setFormData({...formData, active: !!c})} />
            <Label htmlFor='active'>Cho phép hoạt động</Label>
          </div>
        </div>
        <div className='px-6 py-5 border-t border-border mt-auto bg-card'>
          <SheetFooter className='flex-col-reverse sm:flex-row gap-3'>
            <Button variant='outline' onClick={() => onOpenChange(false)} className='h-12 w-full rounded-xl border-border hover:bg-muted text-foreground'>Hủy</Button>
            <Button onClick={onSave} className='h-12 w-full rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white'>{isEditing ? 'Cập nhật' : 'Tạo mới'}</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
