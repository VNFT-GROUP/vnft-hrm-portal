import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { m, AnimatePresence  } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { AvatarPlaceholder } from '@/components/custom/AvatarPlaceholder';

import type { JobTitleResponse } from '@/types/jobtitle/JobTitleResponse';

interface JobTitleTableProps {
  jobTitles: JobTitleResponse[];
  onEdit: (jobTitle: JobTitleResponse) => void;
  onDelete: (id: string) => void;
}

export default function JobTitleTable({ jobTitles, onEdit, onDelete }: JobTitleTableProps) {
  const { t } = useTranslation();
  const [rightClickedId, setRightClickedId] = useState<string | null>(null);
  
  const activeItem = jobTitles.find(r => r.id === rightClickedId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left w-[250px]">{t('management.colRoleName', { defaultValue: 'Tên Chức Vụ' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left">{t('management.colDesc', { defaultValue: 'Mô tả' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colStatus', { defaultValue: 'Trạng thái' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colCreatedBy', { defaultValue: 'Người Tạo' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[120px]">{t('management.colAction', { defaultValue: 'Thao tác' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
          <AnimatePresence>
            {jobTitles.map((jobTitle) => (
              <m.tr 
                key={jobTitle.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-muted/30 transition-colors"
                onContextMenu={() => setRightClickedId(jobTitle.id)}
              >
                <td className="px-4 py-3 font-bold text-[#2E3192] align-middle">
                  {jobTitle.name}
                </td>
                <td className="px-4 py-3 text-slate-700 align-middle max-w-[300px]">
                  <div className="line-clamp-2" title={jobTitle.description}>{jobTitle.description || "—"}</div>
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <Badge 
                    variant={jobTitle.active ? "default" : "secondary"} 
                    className={jobTitle.active 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium border-0"
                    }
                  >
                    {jobTitle.active ? t('management.statusActive', { defaultValue: 'Hoạt động' }) : t('management.statusInactive', { defaultValue: 'Tạm ngưng' })}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-slate-600 align-middle">
                  {jobTitle.createdAt ? format(new Date(jobTitle.createdAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-center text-slate-600 align-middle">
                  {jobTitle.updatedAt ? format(new Date(jobTitle.updatedAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 align-middle text-center text-slate-500 whitespace-nowrap text-xs">
                  {jobTitle.createdBy ? (
                    <div className="flex items-center justify-center gap-2">
                      <AvatarPlaceholder name={jobTitle.createdBy} className="w-6 h-6 text-[10px]" />
                      <span>{jobTitle.createdBy}</span>
                    </div>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(jobTitle)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(jobTitle.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </m.tr>
            ))}
          </AnimatePresence>
          {jobTitles.length === 0 && (
            <tr>
              <td colSpan={7} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Layers size={32} className="mb-2 opacity-50" />
                  <p>{t('management.emptyJobTitle', { defaultValue: 'Không tìm thấy chức vụ nào' })}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activeItem && (
        <ContextMenuContent className="w-56 z-100">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activeItem)}>
            <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
            <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeItem.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t('management.deleteJobTitle', { defaultValue: 'Xóa chức vụ' })}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
