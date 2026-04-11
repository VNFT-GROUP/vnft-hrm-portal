import { Trash2, Users, Eye, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import { getEmployeeStatusColor } from "@/lib/utils";

export interface Employee {
  id: string;
  empCodePrefix: string;
  empCodeId: string;
  attendanceCode: string;
  fullName: string;
  englishName: string;
  email: string;
  department: string;
  position: string;
  func: string;
  status: string;
  checkInTime: string;
  checkOutTime: string;
  sysRole: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: string) => void;
}

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  const { t } = useTranslation();
  const [rightClickedEmpId, setRightClickedEmpId] = useState<string | null>(null);

  const activeEmp = employees.find(e => e.id === rightClickedEmpId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
            <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[120px] border-r border-border text-center align-middle px-4">{t('management.colEmpCode', { defaultValue: 'EMP.CODE' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[120px] border-r border-border text-center align-middle px-4">{t('management.colAttCode', { defaultValue: 'ATT.CODE' })}</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6 min-w-[250px]">{t('management.colFullName', { defaultValue: 'FULLNAME' })}</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6 min-w-[180px]">{t('management.colEnglishName', { defaultValue: 'ENGLISH NAME' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[180px] border-r border-border text-left align-middle px-6">{t('management.colDepartment', { defaultValue: 'DEPARTMENT' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[180px] border-r border-border text-left align-middle px-6">{t('management.colPosition', { defaultValue: 'POSITION' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">{t('management.colStatus', { defaultValue: 'STATUS' })}</TableHead>
            <TableHead className="font-semibold text-foreground w-[180px] text-center align-middle px-4">{t('management.colAction', { defaultValue: 'THAO TÁC' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {employees.map((emp) => (
              <motion.tr 
                key={emp.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                onContextMenu={() => setRightClickedEmpId(emp.id)}
              >
                <TableCell className="font-medium text-muted-foreground py-4 border-r border-border text-center align-middle px-4 whitespace-nowrap">
                  {emp.empCodePrefix}{emp.empCodeId}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground py-4 border-r border-border text-center align-middle px-4 whitespace-nowrap">
                  {emp.attendanceCode || "-"}
                </TableCell>
                <TableCell className="py-4 border-r border-border text-left align-middle px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <AvatarPlaceholder name={emp.fullName} className="w-10 h-10 text-sm" />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1E2062]">{emp.fullName || "-"}</span>
                      {emp.email && <span className="text-xs text-muted-foreground">{emp.email}</span>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground py-4 border-r border-border text-left align-middle px-6 whitespace-nowrap">
                  {emp.englishName || "-"}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground py-4 border-r border-border text-left align-middle px-6 whitespace-nowrap">
                  {emp.department || "-"}
                </TableCell>
                <TableCell className="font-medium text-muted-foreground py-4 border-r border-border text-left align-middle px-6 whitespace-nowrap">
                  {emp.position || "-"}
                </TableCell>
                <TableCell className="py-4 border-r border-border text-center align-middle">
                  <Badge className={`${getEmployeeStatusColor(emp.status)} shadow-sm font-medium border-0`}>
                    {emp.status === "Đang làm" ? t('management.statusWorking', { defaultValue: 'Đang làm' }) : t('management.statusResigned', { defaultValue: 'Đã nghỉ việc' })}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-center align-middle whitespace-nowrap">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" title={t('management.titleViewDetail', { defaultValue: 'Xem chi tiết' })} className="h-8 w-8 text-sky-500 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title={t('management.titleEditSalary', { defaultValue: 'Chỉnh lương' })} className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                      <CircleDollarSign size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title={t('management.titleDelete', { defaultValue: 'Xóa' })} onClick={() => onDelete(emp.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Users size={32} className="mb-2 opacity-50" />
                  <p>{t('management.emptyEmployee', { defaultValue: 'Không tìm thấy nhân viên nào' })}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE HOVERED ROW */}
      {activeEmp && (
        <ContextMenuContent className="w-56 z-[100]">
          <ContextMenuItem className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4 text-sky-500" />
            <span>{t('management.viewLegend', { defaultValue: 'Xem chi tiết thông tin chung' })}</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer">
            <CircleDollarSign className="mr-2 h-4 w-4 text-emerald-500" />
            <span>{t('management.salaryLegend', { defaultValue: 'Xem/chỉnh sửa lương' })}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeEmp.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t('management.deactivateLegend', { defaultValue: 'Hủy kích hoạt tài khoản' })}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
