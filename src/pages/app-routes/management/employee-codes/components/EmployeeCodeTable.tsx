import { useState } from 'react';
import { SearchX, Edit2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { format } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import type { EmployeeCodeResponse } from '@/types/user/EmployeeCodeResponse';

export default function EmployeeCodeTable({ data, onToggleActive, onEdit }: { data: EmployeeCodeResponse[], onToggleActive: (id: string) => void, onEdit: (i: EmployeeCodeResponse) => void }) {
  const { t } = useTranslation();
  const [rightClickedId, setRightClickedId] = useState<string | null>(null);
  const activeItem = data.find(d => d.id === rightClickedId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
      <Table className="border-collapse">
            <TableHeader className="bg-muted/80">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground w-[250px] border-r border-border text-center align-middle px-6">{t('management.colPrefix', { defaultValue: 'Prefix' })}</TableHead>
                <TableHead className="font-semibold text-foreground border-r border-border text-center align-middle px-6 min-w-[200px]">{t('management.colDesc', { defaultValue: 'Mô tả' })}</TableHead>
                <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">{t('management.colStatus', { defaultValue: 'Trạng thái' })}</TableHead>
                <TableHead className="font-semibold text-foreground w-[160px] border-r border-border text-center align-middle px-4">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</TableHead>
                <TableHead className="font-semibold text-foreground w-[180px] border-r border-border text-center align-middle px-4">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</TableHead>
                <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">{t('management.colAction', { defaultValue: 'Thao tác' })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {data.map((item) => (
                  <motion.tr 
                    key={item.id}
                    layout 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                    onContextMenu={() => setRightClickedId(item.id)}
                  >
                    <TableCell className="font-bold text-[#1E2062] py-4 border-r border-border text-left align-middle px-6">
                      {item.prefix}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 border-r border-border text-left align-middle px-6 truncate max-w-[300px]" title={item.description}>
                      {item.description || "—"}
                    </TableCell>
                    <TableCell className="py-4 border-r border-border text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Switch 
                          checked={item.active} 
                          onCheckedChange={() => onToggleActive(item.id)} 
                        />
                        <span className={`text-xs font-medium ${item.active ? 'text-[#10b981]' : 'text-muted-foreground'}`}>
                          {item.active ? t('management.statusActive', { defaultValue: 'Hoạt động' }) : t('management.statusInactive', { defaultValue: 'Tạm ngưng' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                      {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                      {item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy") : "—"}
                    </TableCell>
                    <TableCell className="py-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <SearchX size={32} className="mb-2 opacity-50" />
                      <p>{t('management.emptyData', { defaultValue: 'Không tìm thấy dữ liệu' })}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ContextMenuTrigger>

        {activeItem && (
          <ContextMenuContent className="w-56 z-100">
            <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activeItem)}>
              <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
              <span>{t('management.legendEdit', { defaultValue: 'Chỉnh sửa' })}</span>
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
