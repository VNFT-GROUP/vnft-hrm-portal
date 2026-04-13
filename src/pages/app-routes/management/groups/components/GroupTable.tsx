import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

import type { GroupResponse } from '@/types/group/GroupResponse';

interface GroupTableProps {
  groups: GroupResponse[];
  onEdit: (group: GroupResponse) => void;
  onDelete: (id: string) => void;
}

export default function GroupTable({ groups, onEdit, onDelete }: GroupTableProps) {
  const { t } = useTranslation();
  const [rightClickedGroupId, setRightClickedGroupId] = useState<string | null>(null);
  
  const activeGroup = groups.find(r => r.id === rightClickedGroupId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
        <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[220px] border-r border-border text-center align-middle px-6">{t('management.colGroupName', { defaultValue: 'Tên nhóm quyền' })}</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-center align-middle px-6">{t('management.colDesc', { defaultValue: 'Mô tả' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">{t('management.colStatus', { defaultValue: 'Trạng thái' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[160px] border-r border-border text-center align-middle px-4">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[180px] border-r border-border text-center align-middle px-4">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">{t('management.colAction', { defaultValue: 'Thao tác' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {groups.map((group) => (
              <motion.tr 
                key={group.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                onContextMenu={() => setRightClickedGroupId(group.id)}
              >
                <TableCell className="font-bold text-[#1E2062] py-4 border-r border-border text-left align-middle px-6">
                  {group.name}
                </TableCell>
                <TableCell className="text-muted-foreground py-4 max-w-[300px] truncate border-r border-border text-left align-middle px-6" title={group.description}>
                  {group.description || "—"}
                </TableCell>
                <TableCell className="py-4 border-r border-border text-center align-middle">
                  <Badge 
                    variant={group.active ? "default" : "secondary"} 
                    className={group.active 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-muted text-muted-foreground hover:bg-slate-800 dark:bg-slate-700 hover:text-muted-foreground font-medium border-0"
                    }
                  >
                    {group.active ? t('management.statusActive', { defaultValue: 'Hoạt động' }) : t('management.statusInactive', { defaultValue: 'Tạm ngưng' })}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                  {group.createdAt ? format(new Date(group.createdAt), "dd/MM/yyyy") : "—"}
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                  {group.updatedAt ? format(new Date(group.updatedAt), "dd/MM/yyyy") : "—"}
                </TableCell>
                <TableCell className="py-4 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(group)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(group.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ShieldCheck size={32} className="mb-2 opacity-50" />
                  <p>{t('management.emptyGroup', { defaultValue: 'Không tìm thấy nhóm quyền nào' })}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activeGroup && (
        <ContextMenuContent className="w-56 z-100">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activeGroup)}>
            <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
            <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeGroup.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t('management.deleteGroup', { defaultValue: 'Xóa nhóm quyền' })}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
