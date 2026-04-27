import { Trash2, Users, Shield, CircleDollarSign, UserCog, Briefcase, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FUNCTION_TYPE_LABELS } from "@/types/user/UserFunctionType";
import type { UserFunctionType } from "@/types/user/UserFunctionType";
import { m, AnimatePresence  } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { AvatarPlaceholder } from "@/components/custom/AvatarPlaceholder";
import { getEmployeeStatusColor, formatDate } from "@/lib/utils";

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
  functionType?: UserFunctionType | null;
  status: string;
  sysJobTitle: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: string) => void;
  onEditBasicInfo: (emp: Employee) => void;
  onEditWorkInfo: (id: string) => void;
  onEditGroupInfo: (id: string) => void;
  onEditPassword: (id: string) => void;
  onEditSalary: (id: string) => void;
}

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EmployeeTable({ employees, onDelete, onEditBasicInfo, onEditWorkInfo, onEditGroupInfo, onEditPassword, onEditSalary }: EmployeeTableProps) {
  const { t } = useTranslation();
  const [rightClickedEmpId, setRightClickedEmpId] = useState<string | null>(null);

  const activeEmp = employees.find(e => e.id === rightClickedEmpId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full select-text!">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[120px]">{t('management.colEmpCode', { defaultValue: 'EMP.CODE' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[120px]">{t('management.colAttCode', { defaultValue: 'ATT.CODE' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left min-w-[250px]">{t('management.colFullName', { defaultValue: 'FULLNAME' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left min-w-[180px]">{t('management.colEnglishName', { defaultValue: 'ENGLISH NAME' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left w-[180px]">{t('management.colDepartment', { defaultValue: 'DEPARTMENT' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left w-[180px]">{t('management.colPosition', { defaultValue: 'POSITION' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-left w-[180px]">{t('management.colJobTitle', { defaultValue: 'CHỨC VỤ' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[130px]">{t('management.colFunctionType', { defaultValue: 'CHỨC NĂNG' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colStatus', { defaultValue: 'STATUS' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colCreatedAt', { defaultValue: 'NGÀY TẠO' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colUpdatedAt', { defaultValue: 'NGÀY CẬP NHẬT' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[150px]">{t('management.colUpdatedBy', { defaultValue: 'NGƯỜI CẬP NHẬT' })}</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap text-center w-[180px]">{t('management.colAction', { defaultValue: 'THAO TÁC' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
          <AnimatePresence>
            {employees.map((emp) => (
              <m.tr 
                key={emp.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-muted/30 transition-colors"
                onContextMenu={() => setRightClickedEmpId(emp.id)}
              >
                <td className="px-4 py-3 font-medium text-[#2E3192] text-center align-middle whitespace-nowrap">
                  {emp.empCodePrefix}{emp.empCodeId}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-center align-middle whitespace-nowrap">
                  {emp.attendanceCode || "-"}
                </td>
                <td className="px-4 py-3 text-left align-middle whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <AvatarPlaceholder name={emp.fullName} src={emp.avatarUrl} className="w-10 h-10 text-sm" />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{emp.fullName || "-"}</span>
                      {emp.email && <span className="text-xs text-slate-500">{emp.email}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-left align-middle whitespace-nowrap">
                  {emp.englishName || "-"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-left align-middle whitespace-nowrap">
                  {emp.department || "-"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-left align-middle whitespace-nowrap">
                  {emp.position || "-"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-left align-middle whitespace-nowrap">
                  {emp.sysJobTitle || "-"}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  {emp.functionType ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${
                      emp.functionType === 'SALES'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : emp.functionType === 'MARKETING'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {FUNCTION_TYPE_LABELS[emp.functionType] ?? emp.functionType}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <Badge className={`${getEmployeeStatusColor(emp.status)} shadow-sm font-medium border-0`}>
                    {emp.status === "Đang làm" ? t('management.statusWorking', { defaultValue: 'Đang làm' }) : t('management.statusResigned', { defaultValue: 'Đã nghỉ việc' })}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-center align-middle whitespace-nowrap">
                  {emp.createdAt ? formatDate(emp.createdAt) : "-"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 text-center align-middle whitespace-nowrap">
                  {emp.updatedAt ? formatDate(emp.updatedAt) : "-"}
                </td>
                <td className="px-4 py-3 align-middle text-center text-slate-500 whitespace-nowrap text-xs">
                  {emp.updatedBy ? (
                    <div className="flex items-center justify-center gap-2">
                      <AvatarPlaceholder name={emp.updatedBy} className="w-6 h-6 text-[10px]" />
                      <span>{emp.updatedBy}</span>
                    </div>
                  ) : "-"}
                </td>
                <td className="px-4 py-2 text-center align-middle whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1.5">
                    {/* Hàng 1 */}
                    <div className="flex justify-center gap-1">
                      <button title={t('management.titleEditBasicInfo', { defaultValue: 'Xem/tùy chỉnh thông tin cơ bản' })} onClick={() => onEditBasicInfo(emp)} className="p-1.5 text-amber-500 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors">
                        <UserCog size={16} />
                      </button>
                      <button title={t('management.titleEditWorkInfo', { defaultValue: 'Xem/tùy chỉnh công việc' })} onClick={() => onEditWorkInfo(emp.id)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                        <Briefcase size={16} />
                      </button>
                      <button title={t('management.titleEditGroupInfo', { defaultValue: 'Xem/tùy chỉnh nhóm quyền' })} onClick={() => onEditGroupInfo(emp.id)} className="p-1.5 text-violet-500 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-colors">
                        <Shield size={16} />
                      </button>
                    </div>
                    {/* Hàng 2 */}
                    <div className="flex justify-center gap-1 mt-1">
                      <button title={t('management.titleEditSalary', { defaultValue: 'Xem/tùy chỉnh lương' })} onClick={() => onEditSalary(emp.id)} className="p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                        <CircleDollarSign size={16} />
                      </button>
                      <button title={t('management.titleEditPassword', { defaultValue: 'Đổi mật khẩu' })} onClick={() => onEditPassword(emp.id)} className="p-1.5 text-teal-500 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors">
                        <Key size={16} />
                      </button>
                      <button title={t('management.titleDeactivate', { defaultValue: 'Hủy kích hoạt tài khoản' })} onClick={() => onDelete(emp.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </td>
              </m.tr>
            ))}
          </AnimatePresence>
          {employees.length === 0 && (
            <tr>
              <td colSpan={13} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Users size={32} className="mb-2 opacity-50" />
                  <p>{t('management.emptyEmployee', { defaultValue: 'Không tìm thấy nhân viên nào' })}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </ContextMenuTrigger>

      {/* RENDER CONTEXT MENU FOR THE HOVERED ROW */}
      {activeEmp && (
        <ContextMenuContent className="w-64 z-100">
          <ContextMenuItem className="cursor-pointer" onClick={() => onEditSalary(activeEmp.id)}>
            <CircleDollarSign className="mr-2 h-4 w-4 text-emerald-500" />
            <span>{t('management.titleEditSalary', { defaultValue: 'Xem/tùy chỉnh lương' })}</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer" onClick={() => onEditBasicInfo(activeEmp)}>
            <UserCog className="mr-2 h-4 w-4 text-amber-500" />
            <span>{t('management.titleEditBasicInfo', { defaultValue: 'Xem/tùy chỉnh thông tin cơ bản' })}</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer" onClick={() => onEditWorkInfo(activeEmp.id)}>
            <Briefcase className="mr-2 h-4 w-4 text-indigo-500" />
            <span>{t('management.titleEditWorkInfo', { defaultValue: 'Xem/tùy chỉnh công việc' })}</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer" onClick={() => onEditPassword(activeEmp.id)}>
            <Key className="mr-2 h-4 w-4 text-teal-500" />
            <span>{t('management.titleEditPassword', { defaultValue: 'Đổi mật khẩu' })}</span>
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer" onClick={() => onEditGroupInfo(activeEmp.id)}>
            <Shield className="mr-2 h-4 w-4 text-violet-500" />
            <span>{t('management.titleEditGroupInfo', { defaultValue: 'Xem/tùy chỉnh nhóm quyền' })}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
            onClick={() => onDelete(activeEmp.id)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
            <span>{t('management.titleDeactivate', { defaultValue: 'Hủy kích hoạt tài khoản' })}</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
      </ContextMenu>
    </div>
  );
}
