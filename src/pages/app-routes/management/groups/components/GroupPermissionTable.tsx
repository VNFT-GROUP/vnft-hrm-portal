import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Shield, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { GroupPermissionResponse } from "@/types/group/GroupPermissionResponse";

interface Props {
  items: GroupPermissionResponse[];
  onEdit: (item: GroupPermissionResponse) => void;
  onDelete: (id: string) => void;
}

export default function GroupPermissionTable({ items, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const [rightClickedItem, setRightClickedItem] = useState<GroupPermissionResponse | null>(null);

  return (
    <div className="w-full overflow-x-auto relative min-h-[300px]">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
            <TableHeader className="bg-muted/80">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground w-[220px] border-r border-border text-center align-middle px-4">{t('management.permCode', { defaultValue: 'Mã Quyền' })}</TableHead>
                <TableHead className="font-semibold text-foreground border-r border-border text-center align-middle px-4">{t('management.permCategory', { defaultValue: 'Nhóm Tính Năng' })}</TableHead>
                <TableHead className="font-semibold text-foreground border-r border-border text-center align-middle px-4">{t('management.description', { defaultValue: 'Mô Tả' })}</TableHead>
                <TableHead className="w-[150px] font-semibold text-foreground text-center border-r border-border align-middle px-4">{t('management.status', { defaultValue: 'Trạng Thái' })}</TableHead>
                <TableHead className="w-[160px] font-semibold text-foreground text-center border-r border-border align-middle px-4">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</TableHead>
                <TableHead className="w-[180px] font-semibold text-foreground text-center border-r border-border align-middle px-4">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</TableHead>
                <TableHead className="w-[120px] font-semibold text-foreground text-center align-middle px-4">{t('management.action', { defaultValue: 'Thao tác' })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id}
                    className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors cursor-pointer" 
                    onDoubleClick={() => onEdit(item)}
                    onContextMenu={() => setRightClickedItem(item)}
                  >
                    <TableCell className="font-bold text-[#1E2062] border-r border-border text-center align-middle py-4">
                      {item.code}
                    </TableCell>
                    <TableCell className="font-medium text-[#2E3192] border-r border-border text-center align-middle py-4">
                      {item.category || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground border-r border-border align-middle max-w-[300px] truncate py-4" title={item.description}>
                      {item.description || '—'}
                    </TableCell>
                    <TableCell className="text-center border-r border-border align-middle py-4">
                      <Badge 
                        variant={item.active !== false ? "default" : "secondary"} 
                        className={item.active !== false 
                          ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                          : "bg-muted text-muted-foreground hover:bg-slate-800 dark:bg-slate-700 hover:text-muted-foreground font-medium border-0"
                        }
                      >
                        {item.active !== false
                          ? t('common.active', { defaultValue: 'Hoạt động' })
                          : t('common.inactive', { defaultValue: 'Tạm ngưng' })}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                      {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                      {item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-center align-middle py-4">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Shield size={32} className="mb-2 opacity-50 text-[#2E3192]" />
                      <p className="text-lg font-medium">{t('management.noPerms', { defaultValue: 'Chưa có mã quyền nào' })}</p>
                      <p className="text-sm opacity-70 mt-1">{t('management.noPermsDesc', { defaultValue: 'Bạn có thể thêm mã quyền mới bằng nút bấm bên trên.' })}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ContextMenuTrigger>
        {rightClickedItem && (
          <ContextMenuContent className="w-48 shadow-lg border-border/60">
            <ContextMenuItem onClick={() => onEdit(rightClickedItem)} className="gap-2 focus:bg-[#2E3192]/10 focus:text-[#2E3192] cursor-pointer">
              <Edit2 size={15} /> {t('common.edit')}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDelete(rightClickedItem.id)} className="gap-2 text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
              <Trash2 size={15} /> {rightClickedItem.active !== false ? "Tạm ngưng" : "Xóa"}
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
