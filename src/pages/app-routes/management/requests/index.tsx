import { useState, useEffect, useMemo } from "react";
import { Check, X, Search, Eye, Activity, ShieldAlert, Info, Clock, AlertCircle, Loader2 } from "lucide-react";
import { m  } from 'framer-motion';
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { PERMISSIONS } from "@/constants/permissions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomPagination from "@/components/custom/CustomPagination";
import { RichTextViewer } from "@/components/custom/RichTextViewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestFormApprovalService } from "@/services/requestform/approval";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import type { RequestFormStatisticPeriod, RequestFormStatus, RequestFormType } from "@/types/requestform/RequestFormEnums";
import { format, subMonths, setDate } from "date-fns";
import { getErrorMessage, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ManagementRequestsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { session } = useAuthStore();
  const perms = session?.groupPermissions?.map(p => p.code) || [];
  const isAdmin = session?.groupName === "ADMIN";
  const canApprove = isAdmin || perms.includes(PERMISSIONS.REQUEST_FORM_APPROVE_ALL) || perms.includes(PERMISSIONS.REQUEST_FORM_APPROVE_DEPARTMENT);

  const [statisticPeriod, setStatisticPeriod] = useState<RequestFormStatisticPeriod>("THIS_MONTH");
  const [statsDepartmentId, setStatsDepartmentId] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterDepartmentId, setFilterDepartmentId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const [selectedRequest, setSelectedRequest] = useState<RequestFormResponse | null>(null);

  const { data: response, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["approvalRequests", filterStatus, filterType, filterDepartmentId],
    queryFn: () => requestFormApprovalService.getRequestFormsForApproval(
      filterStatus === "ALL" ? undefined : filterStatus as RequestFormStatus, 
      filterType === "ALL" ? undefined : filterType as RequestFormType,
      filterDepartmentId === "ALL" ? undefined : filterDepartmentId
    ),
    enabled: canApprove
  });

  const { data: statsResponse } = useQuery({
    queryKey: ["approvalRequestsStatistics", statisticPeriod, startDate, endDate, statsDepartmentId],
    queryFn: () => requestFormApprovalService.getRequestFormStatistics(
      statisticPeriod, 
      startDate || undefined, 
      endDate || undefined,
      statsDepartmentId === "ALL" ? undefined : statsDepartmentId
    ),
    enabled: canApprove
  });

  const { data: depsData } = useQuery({
    queryKey: ["approvableDepartments"],
    queryFn: () => requestFormApprovalService.getApprovableDepartments(),
    enabled: canApprove
  });
  const departments = useMemo(() => depsData?.data || [], [depsData?.data]);

  useEffect(() => {
    if (departments.length === 1 && statsDepartmentId === "ALL") {
      const id = departments[0].id;
      setTimeout(() => {
        setStatsDepartmentId(id);
        setFilterDepartmentId(id);
      }, 0);
    }
  }, [departments, statsDepartmentId]);

  const handlePeriodChange = (val: RequestFormStatisticPeriod) => {
    setStatisticPeriod(val);
    if (val === "RANGE") {
      const today = new Date();
      const lastMonth25 = setDate(subMonths(today, 1), 25);
      const thisMonth24 = setDate(today, 24);
      
      setStartDate(format(lastMonth25, "yyyy-MM-dd"));
      setEndDate(format(thisMonth24, "yyyy-MM-dd"));
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const requests = response?.data || [];
  const stats = statsResponse?.data;

  // Search filter applied locally
  const filteredRequests = requests.filter(req => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return req.id.toLowerCase().includes(q) || 
           (req.requesterName || "").toLowerCase().includes(q) || 
           (req.requesterEmployeeCode || "").toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedData = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const approveMutation = useMutation({
    mutationFn: (id: string) => requestFormApprovalService.approveRequestForm(id),
    onSuccess: (_, id) => {
      toast.success(t("requests.management.approveSuccess", { id, defaultValue: `Đã DUYỆT đơn ${id} thành công!` }));
      
      queryClient.invalidateQueries({ queryKey: ["approvalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["approvalRequestsStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });

      if (selectedRequest?.id === id) {
        const payload = requests.find(r => r.id === id);
        setSelectedRequest(payload ? { ...payload, status: "APPROVED" } : null);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("requests.management.approveError", { defaultValue: "Duyệt thất bại. Vui lòng thử lại." })));
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => requestFormApprovalService.rejectRequestForm(id),
    onSuccess: (_, id) => {
      toast.success(t("requests.management.rejectSuccess", { id, defaultValue: `Đã TỪ CHỐI đơn ${id}.` }));
      queryClient.invalidateQueries({ queryKey: ["approvalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["approvalRequestsStatistics"] });

      if (selectedRequest?.id === id) {
        const payload = requests.find(r => r.id === id);
        setSelectedRequest(payload ? { ...payload, status: "REJECTED" } : null);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("requests.management.rejectError", { defaultValue: "Từ chối thất bại." })));
    }
  });

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    if (action === "APPROVE") approveMutation.mutate(id);
    else rejectMutation.mutate(id);
  };

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-md text-[11px] font-bold uppercase tracking-wider">{t("requests.status.pending", { defaultValue: "Chờ duyệt" })}</span>;
      case "APPROVED":
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-md text-[11px] font-bold uppercase tracking-wider">{t("requests.status.approved", { defaultValue: "Đã duyệt" })}</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200/60 rounded-md text-[11px] font-bold uppercase tracking-wider">{t("requests.status.rejected", { defaultValue: "Từ chối" })}</span>;
      case "CANCELED":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200/60 rounded-md text-[11px] font-bold uppercase tracking-wider">{t("requests.status.canceled", { defaultValue: "Đã hủy" })}</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200/60 rounded-md text-[11px] font-bold uppercase tracking-wider">{status || "UNKNOWN"}</span>;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "LEAVE": return t("requests.types.leave", { defaultValue: "Nghỉ phép" });
      case "ABSENCE": return t("requests.types.absent", { defaultValue: "Vắng mặt" });
      case "ATTENDANCE_ADJUSTMENT": return t("requests.types.checkInOut", { defaultValue: "Điều chỉnh chấm công" });
      case "BUSINESS_TRIP": return t("requests.types.business", { defaultValue: "Công tác" });
      case "WFH": return t("requests.types.wfh", { defaultValue: "Làm việc tại nhà" });
      case "RESIGNATION": return t("requests.types.resign", { defaultValue: "Thôi việc" });
      default: return type;
    }
  };

  const safeFormatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "—";
    }
  };

  const formatRequestApplyDate = (req: RequestFormResponse) => {
    if (req.type === "ATTENDANCE_ADJUSTMENT") {
      let tType = "check-out";
      if (req.timeType === "CHECK_IN") tType = "check-in";
      const dateStr = safeFormatDate(req.attendanceDate);
      const reqTime = req.requestedTime ? req.requestedTime.substring(0, 5) : "";
      return t("requests.management.format.adjustCheckinOut", { type: tType, date: dateStr, time: reqTime, defaultValue: `Điều chỉnh ${tType} ngày ${dateStr} thành ${reqTime}` });
    } else if (req.type === "ABSENCE") {
      const dateStr = safeFormatDate(req.absenceDate);
      const fTime = req.fromTime ? req.fromTime.substring(0, 5) : "";
      const tTime = req.toTime ? req.toTime.substring(0, 5) : "";
      return t("requests.management.format.absentDetail", { date: dateStr, from: fTime, to: tTime, defaultValue: `Ngày ${dateStr}, từ ${fTime} đến ${tTime}` });
    } else if (req.type === "LEAVE") {
      let s1 = t("requests.management.format.afternoon", { defaultValue: "Chiều" });
      if (req.startSession === "FULL_DAY") s1 = t("requests.management.format.fullDay", { defaultValue: "Cả ngày" });
      else if (req.startSession === "MORNING") s1 = t("requests.management.format.morning", { defaultValue: "Sáng" });
      
      let s2 = t("requests.management.format.afternoon", { defaultValue: "Chiều" });
      if (req.endSession === "FULL_DAY") s2 = t("requests.management.format.fullDay", { defaultValue: "Cả ngày" });
      else if (req.endSession === "MORNING") s2 = t("requests.management.format.morning", { defaultValue: "Sáng" });
      
      const d1 = safeFormatDate(req.startDate);
      const d2 = safeFormatDate(req.endDate);
      if (d1 === d2) {
        if (s1 === s2) return t("requests.management.format.leaveSameDay", { date: d1, session: s1, defaultValue: `${d1} (${s1})` });
        return t("requests.management.format.leaveSameDay", { date: d1, session: `${s1} - ${s2}`, defaultValue: `${d1} (${s1} - ${s2})` });
      }
      return t("requests.management.format.leaveDiffDay", { d1, s1, d2, s2, defaultValue: `Từ ${d1} (${s1}) đến ${d2} (${s2})` });
    } else if (req.type === "WFH" || req.type === "BUSINESS_TRIP") {
      const d1 = safeFormatDate(req.startDate);
      const d2 = safeFormatDate(req.endDate);
      if (d1 === d2) return t("requests.management.format.rangeSameDay", { date: d1, defaultValue: `${d1}` });
      return t("requests.management.format.rangeDiffDay", { d1, d2, defaultValue: `Từ ${d1} đến ${d2}` });
    } else if (req.type === "RESIGNATION") {
      if (!req.lastWorkingDate) return t("requests.management.format.unknown", { defaultValue: "Không xác định" });
      const dateStr = safeFormatDate(req.lastWorkingDate);
      return t("requests.management.format.resignDetail", { date: dateStr, defaultValue: `Làm việc đến hết ${dateStr}` });
    }
    return t("requests.management.format.unknown", { defaultValue: "Không xác định" });
  };

  if (!canApprove) {
    return (
      <div className="w-full min-h-full flex flex-col items-center justify-center p-6 gap-6 md:gap-8">
        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{t("requests.management.noAccessTitle", { defaultValue: "Không có quyền truy cập" })}</h2>
          <p className="text-slate-500 mb-6">{t("requests.management.noAccessDesc", { defaultValue: "Bạn không có quyền truy cập chức năng duyệt đơn từ. Việc này yêu cầu quyền quản lý cấp phòng ban hoặc toàn hệ thống." })}</p>
        </m.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8">
      
      {/* Header Section */}
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1E2062] tracking-tight">{t("requests.management.title", { defaultValue: "Duyệt đơn từ" })}</h1>
          <p className="text-slate-500 font-medium text-sm">{t("requests.management.subtitle", { defaultValue: "Xử lý các yêu cầu của nhân sự trong phạm vi bạn được phân quyền" })}</p>
        </div>
      </m.div>

      {/* Info Banner */}
      <m.div 
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[#2E3192]/5 border border-[#2E3192]/10 rounded-xl p-3.5 flex items-start sm:items-center gap-3 shadow-sm"
      >
        <Info className="w-5 h-5 text-[#2E3192] shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-slate-700">
          <strong>{t("requests.management.noteTitle", { defaultValue: "Lưu ý nghiệp vụ:" })}</strong> {t("requests.management.noteDesc", { defaultValue: "Quyền duyệt đơn theo phòng ban chỉ áp dụng với người dùng có chức vụ được bật cờ quản lý." })}
        </p>
      </m.div>

      {/* Stats Section */}
      <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center divide-x divide-slate-100">
          
          <div className="p-5 flex flex-col w-full md:w-1/2 space-y-4">
             <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider shrink-0">{t("requests.management.overview", { defaultValue: "Tổng quan" })}</span>
                <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
                  <Select value={statsDepartmentId} onValueChange={(val) => setStatsDepartmentId(val as string)} disabled={departments.length === 1}>
                    <SelectTrigger className="h-8 text-xs border-slate-200 font-medium w-[150px] focus:ring-[#2E3192] bg-slate-50 disabled:opacity-75 disabled:bg-slate-100">
                      <SelectValue placeholder={t("requests.management.department", { defaultValue: "Phòng ban" })}>
                        <span className="truncate">
                          {statsDepartmentId === "ALL" ? t("requests.management.allDepartments", { defaultValue: "Tất cả phòng ban" }) : departments.find((d: { id: string; name: string }) => d.id === statsDepartmentId)?.name || t("requests.management.department", { defaultValue: "Phòng ban" })}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px] rounded-xl">
                      <SelectItem value="ALL">{t("requests.management.allDepartments", { defaultValue: "Tất cả phòng ban" })}</SelectItem>
                      {departments.map((dep: { id: string; name: string; level: number }) => (
                        <SelectItem key={dep.id} value={dep.id}>
                           <span style={{ paddingLeft: `${(dep.level - 1) * 12}px` }}>
                             {dep.level > 1 && <span className="text-slate-300 mr-2">└</span>}
                             {dep.name}
                           </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statisticPeriod} onValueChange={(val) => handlePeriodChange(val as RequestFormStatisticPeriod)}>
                    <SelectTrigger className="h-8 text-xs border-slate-200 font-medium w-[120px] focus:ring-[#2E3192] bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="ALL">{t("requests.management.allTime", { defaultValue: "Tất cả thời gian" })}</SelectItem>
                      <SelectItem value="THIS_MONTH">{t("requests.management.thisMonth", { defaultValue: "Tháng này" })}</SelectItem>
                      <SelectItem value="RANGE">{t("requests.management.customRange", { defaultValue: "Tùy chọn..." })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-slate-500 text-xs font-medium mb-1">{t("requests.status.pending", { defaultValue: "Chờ duyệt" })}</p>
                  <p className="text-2xl font-black text-amber-500">{stats?.pendingCount ?? 0}</p>
               </div>
               <div>
                  <p className="text-slate-500 text-xs font-medium mb-1">{t("requests.status.approved", { defaultValue: "Đã duyệt" })}</p>
                  <p className="text-2xl font-black text-emerald-500">{stats?.approvedCount ?? 0}</p>
               </div>
             </div>
          </div>

          <div className="p-5 w-full md:w-1/2 bg-slate-50/50 h-full">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-4">{t("requests.management.pendingTypes", { defaultValue: "Phân loại chờ xử lý" })}</span>
            {(!stats?.typeStatistics || stats?.typeStatistics.length === 0) ? (
              <p className="text-sm text-slate-400 italic">{t("requests.management.noTypeData", { defaultValue: "Không có dữ liệu phân loại" })}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stats.typeStatistics.map((typeStat) => (
                   <div key={typeStat.type} className="inline-flex flex-col bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm min-w-[120px]">
                     <span className="text-xs text-slate-500 font-medium truncate max-w-[150px] mb-1" title={getRequestTypeLabel(typeStat.type)}>
                       {getRequestTypeLabel(typeStat.type)}
                     </span>
                     <span className="font-bold text-[#1E2062] text-lg leading-none">{typeStat.pendingCount} <span className="text-xs font-normal text-slate-400">/ {typeStat.total}</span></span>
                   </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </m.div>

      {/* Main Table Interface */}
      <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-end gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-xs space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("requests.management.searchLabel", { defaultValue: "Tra cứu" })}</label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t("requests.management.searchPlaceholder", { defaultValue: "Tìm theo mã, nhân viên..." })}
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                className="pl-9 pr-4 h-10 w-full text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#2E3192]/20 focus:border-[#2E3192] outline-none transition-all font-medium placeholder:font-normal"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("requests.management.department", { defaultValue: "Phòng ban" })}</label>
              <Select value={filterDepartmentId} onValueChange={(val) => handleFilterChange(setFilterDepartmentId, val as string)} disabled={departments.length === 1}>
                <SelectTrigger className="h-10 w-[165px] rounded-xl border-slate-200 text-sm font-medium focus:ring-[#2E3192]/20 bg-white disabled:opacity-75 disabled:bg-slate-50">
                  <SelectValue placeholder={t("requests.management.department", { defaultValue: "Phòng ban" })}>
                    <span className="truncate">
                      {filterDepartmentId === "ALL" ? t("requests.management.allDepartments", { defaultValue: "Tất cả phòng" }) : departments.find((d: { id: string; name: string }) => d.id === filterDepartmentId)?.name || t("requests.management.department", { defaultValue: "Phòng ban" })}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[250px] rounded-xl">
                  <SelectItem value="ALL">{t("requests.management.allDepartments", { defaultValue: "Tất cả phòng" })}</SelectItem>
                  {departments.map((dep: { id: string; name: string; level: number }) => (
                    <SelectItem key={dep.id} value={dep.id}>
                       <span style={{ paddingLeft: `${(dep.level - 1) * 12}px` }}>
                         {dep.level > 1 && <span className="text-slate-300 mr-2">└</span>}
                         {dep.name}
                       </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("requests.management.statusLabel", { defaultValue: "Trạng thái đơn" })}</label>
              <Select value={filterStatus} onValueChange={(val) => handleFilterChange(setFilterStatus, val as string)}>
                <SelectTrigger className="h-10 w-[145px] rounded-xl border-slate-200 text-sm font-medium focus:ring-[#2E3192]/20 bg-white">
                  <SelectValue placeholder={t("requests.statusLabel", { defaultValue: "Trạng thái" })}>
                    {filterStatus === "ALL" ? t("requests.management.allTime", { defaultValue: "Tất cả", context: "status" }) : 
                     filterStatus === "PENDING" ? t("requests.status.pending", { defaultValue: "Chờ duyệt" }) : 
                     filterStatus === "APPROVED" ? t("requests.status.approved", { defaultValue: "Đã duyệt" }) : 
                     filterStatus === "REJECTED" ? t("requests.status.rejected", { defaultValue: "Từ chối" }) : 
                     filterStatus === "CANCELED" ? t("requests.status.canceled", { defaultValue: "Đã hủy" }) : t("requests.statusLabel", { defaultValue: "Trạng thái" })}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">{t("requests.management.allTime", { defaultValue: "Tất cả", context: "status" })}</SelectItem>
                  <SelectItem value="PENDING">{t("requests.status.pending", { defaultValue: "Chờ duyệt" })}</SelectItem>
                  <SelectItem value="APPROVED">{t("requests.status.approved", { defaultValue: "Đã duyệt" })}</SelectItem>
                  <SelectItem value="REJECTED">{t("requests.status.rejected", { defaultValue: "Từ chối" })}</SelectItem>
                  <SelectItem value="CANCELED">{t("requests.status.canceled", { defaultValue: "Đã hủy" })}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("requests.management.typeLabel", { defaultValue: "Loại đơn" })}</label>
              <Select value={filterType} onValueChange={(val) => handleFilterChange(setFilterType, val as string)}>
                <SelectTrigger className="h-10 w-[165px] rounded-xl border-slate-200 text-sm font-medium focus:ring-[#2E3192]/20 bg-white">
                  <SelectValue placeholder={t("requests.management.typeLabel", { defaultValue: "Loại đơn" })}>
                    {filterType === "ALL" ? t("requests.management.allTime", { defaultValue: "Tất cả loại đơn", context: "type" }) : getRequestTypeLabel(filterType)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                <SelectItem value="ALL">{t("requests.management.allTime", { defaultValue: "Tất cả", context: "type" })}</SelectItem>
                <SelectItem value="LEAVE">{t("requests.types.leave", { defaultValue: "Nghỉ phép" })}</SelectItem>
                <SelectItem value="ABSENCE">{t("requests.types.absent", { defaultValue: "Vắng mặt" })}</SelectItem>
                <SelectItem value="ATTENDANCE_ADJUSTMENT">{t("requests.types.checkInOut", { defaultValue: "Điều chỉnh công" })}</SelectItem>
                <SelectItem value="BUSINESS_TRIP">{t("requests.types.business", { defaultValue: "Công tác" })}</SelectItem>
                <SelectItem value="WFH">{t("requests.types.wfh", { defaultValue: "Làm tại nhà" })}</SelectItem>
                <SelectItem value="RESIGNATION">{t("requests.types.resign", { defaultValue: "Thôi việc" })}</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </div>
        {/* Data Table */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_rgba(226,232,240,1)]">
              <tr>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.id", { defaultValue: "Mã đơn" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.employee", { defaultValue: "Nhân viên" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.department", { defaultValue: "Phòng ban" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.type", { defaultValue: "Loại đơn" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.applyDate", { defaultValue: "Áp dụng" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.status", { defaultValue: "Trạng thái" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062]">{t("requests.management.cols.submittedDate", { defaultValue: "Ngày gửi" })}</th>
                <th className="px-5 py-3.5 font-bold tracking-wider text-[#1E2062] text-center w-[120px]">{t("requests.management.cols.actions", { defaultValue: "Thao tác" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingRequests ? (
                <tr>
                  <td colSpan={8} className="h-[200px] text-center">
                    <Loader2 className="w-8 h-8 mx-auto text-[#2E3192] animate-spin mb-2" />
                    <span className="text-slate-500">{t("requests.management.loadingList", { defaultValue: "Đang tải danh sách..." })}</span>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-[300px] text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <Activity className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-base font-semibold text-slate-800">{t("requests.management.noData", { defaultValue: "Không có đơn từ phù hợp" })}</p>
                      <p className="text-sm mt-1">{t("requests.management.noDataHint", { defaultValue: "Đổi tiêu chí lọc để xem theo kết quả khác." })}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3 text-slate-600 font-mono text-[13px]">{req.id.substring(0, 8)}...</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-[#2E3192] transition-colors">{req.requesterName}</span>
                        <span className="text-xs text-slate-500">{req.requesterEmployeeCode || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                       <span className="text-[13px] font-medium text-slate-600 truncate max-w-[150px] inline-block" title={req.requesterDepartmentName || ""}>
                         {req.requesterDepartmentName || "—"}
                       </span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
                         {getRequestTypeLabel(req.type)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <div className="text-sm whitespace-nowrap">{formatRequestApplyDate(req)}</div>
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-[13px]">
                      {(req.submittedAt || req.createdAt) ? formatDateTime((req.submittedAt || req.createdAt) as string) : "-"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedRequest(req)}
                          className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 shrink-0"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {req.status === "PENDING" && (
                          <>
                             <Button
                               variant="ghost" 
                               size="icon"
                               onClick={() => handleAction(req.id, "APPROVE")}
                               disabled={approveMutation.isPending && approveMutation.variables === req.id}
                               className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0 bg-emerald-50/50"
                               title={t("requests.management.actions.approveBtn", { defaultValue: "Duyệt đơn" })}
                             >
                                <Check className="w-4 h-4" />
                             </Button>
                             <Button
                               variant="ghost" 
                               size="icon"
                               onClick={() => handleAction(req.id, "REJECT")}
                               disabled={rejectMutation.isPending && rejectMutation.variables === req.id}
                               className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 bg-red-50/50"
                               title={t("requests.management.actions.rejectBtn", { defaultValue: "Từ chối" })}
                             >
                                <X className="w-4 h-4" />
                             </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {requests.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            className="p-4 border-t border-slate-200 bg-white mt-auto"
          />
        )}
      </m.div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white/95 backdrop-blur-md border-0 ring-1 ring-slate-200 shadow-2xl rounded-2xl">
          <div className="bg-[#2E3192] px-6 py-4 flex items-center justify-between">
             <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
               {t("requests.management.detailsTitle", { defaultValue: "Chi tiết đơn từ" })}
             </DialogTitle>
          </div>
          
          {selectedRequest && (
            <div className="p-6 space-y-6">
               
               <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                     <span className="text-2xl font-black text-[#1E2062] tracking-tight">{selectedRequest.requesterName}</span>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-slate-500">{t("requests.management.empId", { defaultValue: "Mã NV" })}: {selectedRequest.requesterEmployeeCode || "N/A"}</span>
                        {selectedRequest.requesterDepartmentName && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                             {selectedRequest.requesterDepartmentName}
                          </span>
                        )}
                     </div>
                  </div>
                  {getStatusBadge(selectedRequest.status)}
               </div>

               <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  <div className="flex flex-col gap-1">
                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("requests.management.typeLabel", { defaultValue: "Loại đơn" })}</span>
                     <span className="text-sm font-semibold text-slate-700">{getRequestTypeLabel(selectedRequest.type)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("requests.columns.submittedDate", { defaultValue: "Ngày gửi" })}</span>
                     <span className="text-sm font-semibold text-slate-700">{formatDateTime(selectedRequest.createdAt)}</span>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("requests.columns.appliedDate", { defaultValue: "Thời gian áp dụng" })}</span>
                     <span className="text-sm font-semibold text-[#1E2062] bg-[#2E3192]/5 px-3 py-2 rounded-lg border border-[#2E3192]/10 inline-flex w-fit items-center gap-2">
                       <Clock className="w-4 h-4 text-[#2E3192]/70" />
                       {formatRequestApplyDate(selectedRequest)}
                     </span>
                  </div>
               </div>

               <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("requests.management.reason", { defaultValue: "Lý do" })}</span>
                 <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[80px]">
                   {selectedRequest.description ? (
                      <RichTextViewer htmlContent={selectedRequest.description} />
                   ) : (
                      <span className="text-slate-400 italic">{t("requests.management.noReason", { defaultValue: "Nhân viên không đính kèm mô tả." })}</span>
                   )}
                 </div>
               </div>
               
               <div className="flex flex-col gap-1 bg-amber-50/50 p-4 border border-amber-100 rounded-xl">
                 <div className="flex items-center gap-2 mb-1 cursor-default">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-700 uppercase">{t("requests.management.impactTitle", { defaultValue: "Tác động hệ thống" })}</span>
                 </div>
                 <p className="text-[13px] text-amber-800/80 leading-relaxed">
                   {selectedRequest.type === "ABSENCE" ? t("requests.management.impactRules.absent", { defaultValue: "Đơn vắng mặt chỉ cộng thời gian được duyệt vào summary định kỳ, không tạo dữ liệu check-in/check-out gốc." }) :
                    (selectedRequest.type === "LEAVE" || selectedRequest.type === "WFH" || selectedRequest.type === "BUSINESS_TRIP") ? t("requests.management.impactRules.leaveWfhTrip", { defaultValue: "Duyệt đơn sẽ trừ vào quỹ thời gian (nếu có); hệ thống tiến hành rebuild công của nhân sự, không tạo dữ liệu quẹt thẻ thực tế." }) :
                    selectedRequest.type === "ATTENDANCE_ADJUSTMENT" ? t("requests.management.impactRules.attendance", { defaultValue: "Duyệt đơn sẽ chèn/sửa dữ liệu chấm công gốc (check-in hoặc check-out) theo yêu cầu. Việc đồng bộ máy chấm công sau này vẫn có thể ghi đè kết quả nếu giờ quét thẻ mới hợp lệ hơn." }) :
                    selectedRequest.type === "RESIGNATION" ? t("requests.management.impactRules.resign", { defaultValue: "Duyệt đơn sẽ khóa mọi tính toán chấm công sau ngày làm việc cuối cùng." }) :
                    t("requests.management.impactRules.default", { defaultValue: "Sau khi duyệt, dữ liệu xử lý sẽ được cập nhật tương ứng. Hệ thống ghi nhận kết quả phê duyệt qua cơ chế Audit." })}
                 </p>
               </div>
            </div>
          )}

          {selectedRequest?.status === "PENDING" && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
              <Button 
                variant="outline"
                className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-10 px-5 rounded-xl transition-all"
                onClick={() => handleAction(selectedRequest.id, "REJECT")}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                {t("requests.management.actions.rejectBtn", { defaultValue: "Từ chối đơn" })}
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg h-10 px-6 rounded-xl transition-all font-semibold"
                onClick={() => handleAction(selectedRequest.id, "APPROVE")}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                {t("requests.management.actions.approveBtn", { defaultValue: "Duyệt đơn" })}
              </Button>
            </div>
          )}
          {selectedRequest?.status !== "PENDING" && (
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-2xl">
               <span className="text-sm font-medium text-slate-500">{t("requests.management.actions.processedNote", { defaultValue: "Đơn đã được hệ thống ghi nhận xử lý trước đó." })}</span>
             </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
