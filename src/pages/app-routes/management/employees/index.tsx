import { useState } from "react";
import {
  Search,
  Users,
  UserPlus,
  CircleDollarSign,
  Trash2,
  Loader2,
  MousePointerClick,
  UserCog,
  Briefcase,
  Shield,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLayoutStore } from "@/store/useLayoutStore";

import EmployeeTable, { type Employee } from "./components/EmployeeTable";
import EmployeeFormSheet from "./components/EmployeeFormSheet";
import WorkInformationSheet from "./components/WorkInformationSheet";
import GroupInformationSheet from "./components/GroupInformationSheet";
import ChangePasswordSheet from "./components/ChangePasswordSheet";
import UserFormSheet from "../users/components/UserFormSheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { toast } from "sonner";
import type { CreateUserRequest } from '@/types/user/CreateUserRequest';
import { departmentService } from "@/services/department";
import { positionService } from "@/services/position";
import { groupService } from "@/services/group/groupService";
import { mapIdToName } from "@/lib/utils";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const showEmployeeLegend = useLayoutStore(
    (state) => state.showEmployeeLegend,
  );
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [workInfoEmpId, setWorkInfoEmpId] = useState<string | null>(null);
  const [groupInfoEmpId, setGroupInfoEmpId] = useState<string | null>(null);
  const [passwordEmpId, setPasswordEmpId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    empCodePrefix: "VNSGN",
    empCodeId: "",
    attendanceCode: "",
    fullName: "",
    englishName: "",
    email: "",
    department: "",
    position: "",
    func: "",
    status: "Đang làm",
    checkInTime: "08:00",
    checkOutTime: "17:30",
    sysRole: "",
    password: "",
    confirmPassword: "",
  });

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(1, 1000),
  });

  const { data: departmentsResponse } = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentService.getDepartments(),
  });

  const { data: positionsResponse } = useQuery({
    queryKey: ["positions"],
    queryFn: () => positionService.getPositions(),
  });

  const { data: groupsResponse } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.getGroups(),
  });

  const departments = departmentsResponse?.data;
  const positions = positionsResponse?.data;
  const groups = groupsResponse?.data;

  const apiEmployees: Employee[] =
    usersResponse?.data?.content?.map((user) => ({
      id: user.id,
      empCodePrefix: user.employeeCode || "",
      empCodeId: "",
      attendanceCode: user.attendanceCode || "",
      fullName: user.fullName || "Chưa cập nhật",
      englishName: user.englishName || "",
      email: user.username || "",
      department: mapIdToName(user.departmentId, departments),
      position: mapIdToName(user.positionId, positions),
      func: mapIdToName(user.groupId, groups),
      status: user.active ? "Đang làm" : "Đã nghỉ việc",
      checkInTime: user.checkInTime || "08:00",
      checkOutTime: user.checkOutTime || "17:30",
      sysRole: "",
    })) || [];

  const filteredData = apiEmployees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${e.empCodePrefix}${e.empCodeId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      toast.success("Thành công: Tạo nhân viên hệ thống!");
      setIsUserFormOpen(false);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi tạo tài khoản hệ thống.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success("Hủy kích hoạt tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra khi hủy kích hoạt.");
    },
  });

  const handleSaveUser = (data: CreateUserRequest) => {
    createUserMutation.mutate(data);
  };

  const handleOpenForm = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({ ...emp, password: "", confirmPassword: "" });
    } else {
      setEditingEmployee(null);
      setFormData({
        empCodePrefix: "VNSGN",
        empCodeId: Math.floor(100 + Math.random() * 900)
          .toString()
          .padStart(3, "0"),
        attendanceCode: "",
        fullName: "",
        englishName: "",
        email: "",
        department: "",
        position: "",
        func: "",
        status: "Đang làm",
        checkInTime: "08:00",
        checkOutTime: "17:30",
        sysRole: "",
        password: "",
        confirmPassword: "",
      });
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingEmployee) {
      toast.info("Chức năng cập nhật nhân viên chưa có endpoint!");
      setIsOpen(false);
      return;
    }

    const requestData: CreateUserRequest = {
      username: formData.email,
      password: formData.password,
      employeeCodeId: formData.empCodePrefix,
      attendanceCode: formData.attendanceCode,
      fullName: formData.fullName,
      englishName: formData.englishName,
      departmentId: formData.department,
      groupId: formData.func,
      roleId: formData.sysRole,
      positionId: formData.position,
      checkInTime: formData.checkInTime.length === 5 ? `${formData.checkInTime}:00` : formData.checkInTime,
      checkOutTime: formData.checkOutTime.length === 5 ? `${formData.checkOutTime}:00` : formData.checkOutTime,
    };
    
    createUserMutation.mutate(requestData);
  };

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <Users size={28} />
          </span>
          {t('management.employeesTitle', { defaultValue: 'Hồ sơ nhân viên' })}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t('management.employeesDesc', { defaultValue: 'Quản lý toàn bộ thông tin nhân sự và cấp phát tài khoản trong hệ thống.' })}
        </p>
      </motion.div>

      {/* 2. Legend Section */}
      {showEmployeeLegend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card p-4 rounded-xl border border-border flex flex-col gap-3 text-sm text-muted-foreground w-full shadow-sm"
        >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
              <span className="font-semibold text-[#1E2062] mr-2">
                {t('management.actionLegend', { defaultValue: 'Chú thích thao tác:' })}
              </span>
              <div className="flex items-center gap-2">
                <CircleDollarSign size={16} className="text-emerald-500" />
                <span>{t('management.titleEditSalary', { defaultValue: 'Xem/tùy chỉnh lương' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCog size={16} className="text-amber-500" />
                <span>{t('management.titleEditBasicInfo', { defaultValue: 'Xem/tùy chỉnh thông tin cơ bản' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-500" />
                <span>{t('management.titleEditWorkInfo', { defaultValue: 'Xem/tùy chỉnh công việc' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-violet-500" />
                <span>{t('management.titleEditGroupInfo', { defaultValue: 'Xem/tùy chỉnh nhóm quyền' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Key size={16} className="text-teal-500" />
                <span>{t('management.titleEditPassword', { defaultValue: 'Đổi mật khẩu' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 size={16} className="text-rose-500" />
                <span>{t('management.titleDeactivate', { defaultValue: 'Hủy kích hoạt tài khoản' })}</span>
              </div>
              <div className="ml-auto flex items-center text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border opacity-70 hover:opacity-100 transition-opacity">
                {t('management.hideLegendHint', { defaultValue: 'Nhấn Alt + S để bật tắt mục này' })}
              </div>
            </div>
          <div className="w-full h-px bg-border/50 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[#2E3192]">
            <MousePointerClick size={16} />
            <span className="italic">{t('management.actionTooltip', { defaultValue: 'Mẹo: Click chuột phải vào dòng dữ liệu để thao tác nhanh.' })}</span>
          </div>
        </motion.div>
      )}

      {/* 3. Toolbar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder={t('management.searchEmployeePlaceholder', { defaultValue: 'Tìm kiếm theo Tên hoặc Mã NV...' })}
            className="pl-12 h-12 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-base hover:bg-card text-card-foreground transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto flex-col md:flex-row">
          <Button
            onClick={() => handleOpenForm()}
            className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold"
          >
            <UserPlus size={20} className="mr-2" /> {t('management.addEmployee', { defaultValue: 'Thêm nhân viên' })}
          </Button>
        </div>
      </motion.div>

      {/* 5. Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-muted-foreground h-64">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#2E3192]" />
            <p className="animate-pulse">Đang tải dữ liệu nhân viên...</p>
          </div>
        ) : (
          <EmployeeTable
            employees={filteredData}
            onDelete={handleDelete}
            onEditWorkInfo={(id) => setWorkInfoEmpId(id)}
            onEditGroupInfo={(id) => setGroupInfoEmpId(id)}
            onEditPassword={(id) => setPasswordEmpId(id)}
          />
        )}
      </motion.div>

      {/* Side Form (Sheet) */}
      <EmployeeFormSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingEmployee}
        onSave={handleSave}
      />

      <UserFormSheet
        isOpen={isUserFormOpen}
        onOpenChange={setIsUserFormOpen}
        onSave={handleSaveUser}
        isPending={createUserMutation.isPending}
      />

      <WorkInformationSheet
        isOpen={!!workInfoEmpId}
        onOpenChange={(open) => {
          if (!open) setWorkInfoEmpId(null);
        }}
        userId={workInfoEmpId}
      />
      
      <GroupInformationSheet
        isOpen={!!groupInfoEmpId}
        onOpenChange={(open) => {
          if (!open) setGroupInfoEmpId(null);
        }}
        userId={groupInfoEmpId}
      />
      
      <ChangePasswordSheet
        isOpen={!!passwordEmpId}
        onOpenChange={(open) => {
          if (!open) setPasswordEmpId(null);
        }}
        userId={passwordEmpId}
      />
    </div>
  );
}
