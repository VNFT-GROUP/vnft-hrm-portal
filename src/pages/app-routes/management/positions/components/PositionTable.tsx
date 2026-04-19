import { useState } from "react";
import { Edit2, Trash2, Briefcase, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { m, AnimatePresence  } from 'framer-motion';
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
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200 w-[220px]">{t("position.table.name")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t("position.table.level")}</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">{t("position.table.description")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[150px]">{t("position.table.status")}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[160px]">{t('management.createdAt', { defaultValue: 'Ngày Tạo' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[180px]">{t('management.updatedAt', { defaultValue: 'Cập Nhật Lần Cuối' })}</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200 w-[120px]">{t("position.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
          <AnimatePresence>
            {positions.map((position) => (
              <m.tr 
                key={position.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-slate-50 transition-colors duration-200"
                onContextMenu={() => setRightClickedPositionId(position.id)}
              >
                <td className="px-4 py-3 font-bold text-[#2E3192] border-x border-slate-200 align-middle">
                  {position.name}
                </td>
                <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                  {position.manager ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-medium whitespace-nowrap">
                      <ShieldCheck size={12} className="mr-1 inline-block" /> {t("position.table.manager")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium whitespace-nowrap">
                      {t("position.table.staff")}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700 border-x border-slate-200 align-middle max-w-[300px]">
                  <div className="line-clamp-2" title={position.description}>{position.description || "—"}</div>
                </td>
                <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                  <Badge 
                    variant={position.active ? "default" : "secondary"} 
                    className={position.active 
                      ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300 font-medium border-0"
                    }
                  >
                    {position.active ? t("position.table.active") : t("position.table.inactive")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                  {position.createdAt ? format(new Date(position.createdAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-center text-slate-600 border-x border-slate-200 align-middle">
                  {position.updatedAt ? format(new Date(position.updatedAt), "dd/MM/yyyy") : "—"}
                </td>
                <td className="px-4 py-3 border-x border-slate-200 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(position)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(position.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </m.tr>
            ))}
          </AnimatePresence>
          {positions.length === 0 && (
            <tr>
              <td colSpan={7} className="h-40 text-center border-x border-slate-200">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Briefcase size={32} className="mb-2 opacity-50" />
                  <p>{t("position.table.notFound")}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
