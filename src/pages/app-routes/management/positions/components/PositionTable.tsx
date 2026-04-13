import { useState } from "react";
import { Edit2, Trash2, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

import type { PositionResponse } from '@/types/position/PositionResponse';

interface PositionTableProps {
  positions: PositionResponse[];
  onEdit: (position: PositionResponse) => void;
  onDelete: (id: string) => void;
}

export default function PositionTable({ positions, onEdit, onDelete }: PositionTableProps) {
  const { t } = useTranslation();
  const [rightClickedPositionId, setRightClickedPositionId] = useState<string | null>(null);
  
  const activePosition = positions.find(r => r.id === rightClickedPositionId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
        <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[220px] border-r border-border text-center align-middle px-6">{t("position.table.name")}</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">{t("position.table.level")}</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-center align-middle px-6">{t("position.table.description")}</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">{t("position.table.status")}</TableHead>
            <TableHead className="font-semibold text-foreground w-[160px] border-r border-border text-center align-middle px-4">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[180px] border-r border-border text-center align-middle px-4">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">{t("position.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {positions.map((position) => (
              <motion.tr 
                key={position.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                onContextMenu={() => setRightClickedPositionId(position.id)}
              >
                <TableCell className="font-bold text-[#1E2062] py-4 border-r border-border text-left align-middle px-6">
                  {position.name}
                </TableCell>
                <TableCell className="py-4 border-r border-border text-center align-middle px-4">
                  {position.manager ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-medium">
                      <ShieldCheck size={12} className="mr-1" /> {t("position.table.manager")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium">
                      {t("position.table.staff")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground py-4 max-w-[300px] truncate border-r border-border text-left align-middle px-6" title={position.description}>{position.description || "—"}</TableCell>
                <TableCell className="py-4 border-r border-border text-center align-middle">
                  <Badge 
                    variant={position.active ? "default" : "secondary"} 
                    className={position.active 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-muted text-muted-foreground hover:bg-slate-800 dark:bg-slate-700 hover:text-muted-foreground font-medium border-0"
                    }
                  >
                    {position.active ? t("position.table.active") : t("position.table.inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                  {position.createdAt ? format(new Date(position.createdAt), "dd/MM/yyyy") : "—"}
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm border-r border-border align-middle py-4">
                  {position.updatedAt ? format(new Date(position.updatedAt), "dd/MM/yyyy") : "—"}
                </TableCell>
                <TableCell className="py-4 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(position)} className="h-8 w-8 text-[#2E3192] hover:bg-[#2E3192]/10 hover:text-[#2E3192] rounded-lg">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(position.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
          {positions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Briefcase size={32} className="mb-2 opacity-50" />
                  <p>{t("position.table.notFound")}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE ROW */}
      {activePosition && (
        <ContextMenuContent className="w-56 z-100">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEdit(activePosition)}>
            <Edit2 className="mr-2 h-4 w-4 text-[#2E3192]" />
            <span>{t("position.legendEdit")}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activePosition.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t("position.legendDelete")}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
