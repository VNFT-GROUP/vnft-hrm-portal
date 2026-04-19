import { useState } from 'react';
import { SearchX, Edit2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { format } from "date-fns";
import { m, AnimatePresence  } from 'framer-motion';
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
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 w-[250px]">{t('management.colPrefix', { defaultValue: 'Prefix' })}</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 min-w-[200px]">{t('management.colDesc', { defaultValue: 'Mô tả' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t('management.colStatus', { defaultValue: 'Trạng thái' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t('management.colAction', { defaultValue: 'Thao tác' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <AnimatePresence>
                {data.map((item) => (
                  <m.tr 
                    key={item.id}
                    layout 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 transition-colors duration-200"
                    onContextMenu={() => setRightClickedId(item.id)}
                  >
                    <td className="px-4 py-3 font-bold text-[#2E3192] border-x border-slate-200 align-middle">
                      {item.prefix}
                    </td>
                    <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[300px]">
                      <div className="line-clamp-2" title={item.description}>
                        {item.description || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Switch 
                          checked={item.active} 
                          onCheckedChange={() => onToggleActive(item.id)} 
                        />
                        <span className={`text-xs font-medium ${item.active ? 'text-[#10b981]' : 'text-slate-500'}`}>
                          {item.active ? t('management.statusActive', { defaultValue: 'Hoạt động' }) : t('management.statusInactive', { defaultValue: 'Tạm ngưng' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                      {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                      {item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </m.tr>
                ))}
              </AnimatePresence>
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="h-40 text-center border-x border-slate-200">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <SearchX size={32} className="mb-2 opacity-50" />
                      <p>{t('management.emptyData', { defaultValue: 'Không tìm thấy dữ liệu' })}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
