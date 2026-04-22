import { useState } from "react";
import {
  CircleDollarSign,
  Trash2,
  Loader2,
  UserCog,
  Briefcase,
  Shield,
  Key,
  MousePointerClick,
  FileUp,
  Users,
  Search,
  UserPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLayoutStore } from "@/store/useLayoutStore";
import { useDebounce } from "@/hooks/useDebounce";

import EmployeeTable, { type Employee } from "./components/EmployeeTable";
import EmployeeFormSheet from "./components/EmployeeFormSheet";
import WorkInformationSheet from "./components/WorkInformationSheet";
import GroupInformationSheet from "./components/GroupInformationSheet";
import ChangePasswordSheet from "./components/ChangePasswordSheet";
import BasicInformationSheet from "./components/BasicInformationSheet";
import CompensationInformationSheet from "./components/CompensationInformationSheet";
import ImportEmployeeModal from "./components/ImportEmployeeModal";
import UserFormSheet from "../users/components/UserFormSheet";
import CustomPagination from "@/components/custom/CustomPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { departmentService } from "@/services/department";
import { positionService } from "@/services/position";
import { SearchableSelect } from "@/components/custom/SearchableSelect";

import { toast } from "sonner";
import type { CreateUserRequest } from "@/types/user/CreateUserRequest";
export default function EmployeesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const showEmployeeLegend = useLayoutStore((state) => state.showEmployeeLegend);
  const setShowEmployeeLegend = useLayoutStore((state) => state.setShowEmployeeLegend);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [workInfoEmpId, setWorkInfoEmpId] = useState<string | null>(null);
  const [groupInfoEmpId, setGroupInfoEmpId] = useState<string | null>(null);
  const [passwordEmpId, setPasswordEmpId] = useState<string | null>(null);
  const [basicInfoEmpId, setBasicInfoEmpId] = useState<string | null>(null);
  const [compensationEmpId, setCompensationEmpId] = useState<string | null>(
    null,
  );

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

    sysJobTitle: "",
    password: "",
    confirmPassword: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filterDepartmentId, setFilterDepartmentId] = useState<string>("");
  const [filterPositionId, setFilterPositionId] = useState<string>("");

  const { data: departmentsResponse, isFetching: isFetchingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getDepartments(),
  });

  const { data: positionsResponse, isFetching: isFetchingPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => positionService.getPositions(),
  });

  const departmentsOpts = [
    { value: "", label: "Tất cả" },
    ...(departmentsResponse?.data?.map(d => ({ value: d.id, label: d.name })) || [])
  ];
  const positionsOpts = [
    { value: "", label: "Tất cả" },
    ...(positionsResponse?.data?.map(p => ({ value: p.id, label: p.name })) || [])
  ];

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["users", currentPage, pageSize, debouncedSearchTerm, filterDepartmentId, filterPositionId],
    queryFn: () =>
      userService.getUsers(
        currentPage,
        pageSize,
        debouncedSearchTerm || undefined,
        filterDepartmentId || undefined,
        filterPositionId || undefined,
      ),
  });

  const apiEmployees: Employee[] =
    usersResponse?.data?.content?.map((user) => ({
      id: user.id,
      empCodePrefix: user.employeeCode || "",
      empCodeId: "",
      attendanceCode: user.attendanceCode || "",
      fullName: user.fullName || "Chưa cập nhật",
      englishName: user.englishName || "",
      email: user.username || "",
      department: user.departmentName || "-",
      position: user.positionName || "-",
      func: user.groupName || "-",
      status: user.active ? "Đang làm" : "Đã nghỉ việc",

      sysJobTitle: user.jobTitleName || "-",
      avatarUrl: user.avatarUrl,
    })) || [];

  const totalPages = usersResponse?.data?.totalPages || 1;
  const paginatedData = apiEmployees;

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

        sysJobTitle: "",
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
      jobTitleId: formData.sysJobTitle,
      positionId: formData.position,
    };

    createUserMutation.mutate(requestData);
  };

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
            <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
              <Users size={28} />
            </span>
            {t("management.employeesTitle", { defaultValue: "Hồ sơ nhân viên" })}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg ml-1">
            {t("management.employeesDesc", {
              defaultValue:
                "Quản lý toàn bộ thông tin nhân sự và cấp phát tài khoản trong hệ thống.",
            })}
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0">
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="w-full md:w-auto h-11 px-5 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-all font-semibold shadow-sm"
          >
            <FileUp size={18} className="mr-2" /> Import
          </Button>
          <Button
            onClick={() => handleOpenForm()}
            className="w-full md:w-auto h-11 px-6 rounded-xl bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md shadow-[#2E3192]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            <UserPlus size={18} className="mr-2" />{" "}
            <span>{t("management.addEmployee", { defaultValue: "Thêm nhân viên" })}</span>
          </Button>
        </div>
      </m.div>

      {/* 2. Legend Section */}
      <div className="bg-card rounded-xl border border-border flex flex-col w-full shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowEmployeeLegend(!showEmployeeLegend)}
          className="px-4 py-3 flex items-center justify-between w-full hover:bg-muted/50 transition-colors"
        >
          <span className="font-semibold text-[#1E2062] text-sm md:text-base cursor-pointer">
            {t("management.actionLegend", { defaultValue: "Chú thích thao tác:" })}
          </span>
          {showEmployeeLegend ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>
        
        {showEmployeeLegend && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4 pt-1 flex flex-col gap-3 text-sm text-muted-foreground border-t border-border/50"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 w-full">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={16} className="text-emerald-500" />
              <span>
                {t("management.titleEditSalary", {
                  defaultValue: "Xem/tùy chỉnh lương",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCog size={16} className="text-amber-500" />
              <span>
                {t("management.titleEditBasicInfo", {
                  defaultValue: "Xem/tùy chỉnh thông tin cơ bản",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-500" />
              <span>
                {t("management.titleEditWorkInfo", {
                  defaultValue: "Xem/tùy chỉnh công việc",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-violet-500" />
              <span>
                {t("management.titleEditGroupInfo", {
                  defaultValue: "Xem/tùy chỉnh nhóm quyền",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Key size={16} className="text-teal-500" />
              <span>
                {t("management.titleEditPassword", {
                  defaultValue: "Đổi mật khẩu",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              <span>
                {t("management.titleDeactivate", {
                  defaultValue: "Hủy kích hoạt tài khoản",
                })}
              </span>
            </div>

          </div>
          <div className="w-full h-px bg-border/50 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[#2E3192]">
            <MousePointerClick size={16} />
            <span className="italic">
              {t("management.actionTooltip", {
                defaultValue:
                  "Mẹo: Click chuột phải vào dòng dữ liệu để thao tác nhanh.",
              })}
            </span>
          </div>
          </m.div>
      )}
      </div>

      {/* 3. Toolbar Section */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border flex flex-col gap-4"
      >
        <div className="relative w-full shrink-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder={t("management.searchEmployeePlaceholder", {
              defaultValue: "Tìm kiếm bằng Tên, Mã NV...",
            })}
            className="pl-12 h-11 rounded-xl bg-muted border-border focus-visible:ring-[#2E3192] text-sm hover:bg-card text-card-foreground transition-colors"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        {/* Advanced Filters */}
        <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-border">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-700 whitespace-nowrap text-sm">Phòng ban:</span>
            <div className="w-[200px] sm:w-[220px]">
              <SearchableSelect 
                options={departmentsOpts}
                value={filterDepartmentId}
                onChange={(val) => { setFilterDepartmentId(val || ""); setCurrentPage(1); }}
                placeholder="Tất cả"
                isLoading={isFetchingDepts}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-700 whitespace-nowrap text-sm">Vị trí:</span>
            <div className="w-[200px] sm:w-[220px]">
              <SearchableSelect 
                options={positionsOpts}
                value={filterPositionId}
                onChange={(val) => { setFilterPositionId(val || ""); setCurrentPage(1); }}
                placeholder="Tất cả"
                isLoading={isFetchingPositions}
              />
            </div>
          </div>
          
          {(filterDepartmentId || filterPositionId) && (
            <div className="flex items-center h-full ml-auto">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setFilterDepartmentId("");
                  setFilterPositionId("");
                  setCurrentPage(1);
                }}
                className="h-10 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={16} className="mr-2" /> Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </m.div>

      {/* 5. Table Section */}
      <m.div
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
          <>
            <EmployeeTable
              employees={paginatedData}
              onDelete={handleDelete}
              onEditBasicInfo={(emp) => setBasicInfoEmpId(emp.id)}
              onEditWorkInfo={(id) => setWorkInfoEmpId(id)}
              onEditGroupInfo={(id) => setGroupInfoEmpId(id)}
              onEditPassword={(id) => setPasswordEmpId(id)}
              onEditSalary={(id) => setCompensationEmpId(id)}
            />
            {apiEmployees.length > 0 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className="p-4 border-t border-border mt-auto"
              />
            )}
          </>
        )}
      </m.div>

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

      <BasicInformationSheet
        isOpen={!!basicInfoEmpId}
        onOpenChange={(open) => {
          if (!open) setBasicInfoEmpId(null);
        }}
        userId={basicInfoEmpId}
      />

      {/* 5. Compensation (Lương) Form Sheet */}
      <CompensationInformationSheet
        isOpen={!!compensationEmpId}
        onOpenChange={(open) => !open && setCompensationEmpId(null)}
        userId={compensationEmpId}
      />

      <ImportEmployeeModal
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
      />
    </div>
  );
}
