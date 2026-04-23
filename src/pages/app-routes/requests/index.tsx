import { useState, useMemo } from "react";
import { FileEdit, Plus, FileText, Umbrella, Home, Calendar, Clock, CheckCircle2, XCircle, Ban, Loader2, Eye } from "lucide-react";
import { m  } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { PERMISSIONS } from "@/constants/permissions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestFormMeService } from "@/services/requestform/me";
import CustomPagination from "@/components/custom/CustomPagination";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichTextViewer } from "@/components/custom/RichTextViewer";
import { getErrorMessage } from "@/lib/utils";
import RequestFormModal from "./components/RequestFormModal";
const ApplicableDate = ({ req }: { req: RequestFormResponse }) => {
  try {
    if (req.type === "ATTENDANCE_ADJUSTMENT") {
      const tType = req.timeType === "CHECK_IN" ? "check-in" : "check-out";
      return <>{req.attendanceDate ? `Điều chỉnh ${tType} ngày ${format(new Date(req.attendanceDate), "dd/MM/yyyy")} thành ${req.requestedTime?.substring(0, 5)}` : "Không xác định"}</>;
    } else if (req.type === "ABSENCE") {
      if (!req.absenceDate) return <>Không xác định</>;
      return (
         <div className="flex flex-col gap-1 sm:flex-row sm:items-center justify-center">
            <span>{`Vắng mặt ngày ${format(new Date(req.absenceDate), "dd/MM/yyyy")}, từ ${req.fromTime?.substring(0, 5)} đến ${req.toTime?.substring(0, 5)}`}</span>
            {req.absenceReasonType && (
               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 w-fit mx-auto sm:mx-0 ${req.absenceReasonType === 'PERSONAL' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                 {req.absenceReasonType === 'PERSONAL' ? 'Việc cá nhân' : 'Việc công ty'}
               </span>
            )}
         </div>
      );
    } else if (req.type === "LEAVE") {
      if (!req.startDate || !req.endDate) return <>Không xác định</>;
      const s1 = req.startSession === "FULL_DAY" ? "Cả ngày" : req.startSession === "MORNING" ? "Sáng" : "Chiều";
      const s2 = req.endSession === "FULL_DAY" ? "Cả ngày" : req.endSession === "MORNING" ? "Sáng" : "Chiều";
      const d1 = format(new Date(req.startDate), "dd/MM/yyyy");
      const d2 = format(new Date(req.endDate), "dd/MM/yyyy");
      if (d1 === d2) {
        return <>{`Nghỉ phép ngày ${d1} ${s1 === s2 ? `(${s1})` : `(${s1} - ${s2})`}`}</>;
      }
      return <>{`Nghỉ phép từ ${d1} (${s1}) đến ${d2} (${s2})`}</>;
    } else if (req.type === "WFH") {
      if (!req.startDate || !req.endDate) return <>Không xác định</>;
      const d1 = format(new Date(req.startDate), "dd/MM/yyyy");
      const d2 = format(new Date(req.endDate), "dd/MM/yyyy");
      return <>{d1 === d2 ? `WFH ngày ${d1}` : `WFH từ ${d1} đến ${d2}`}</>;
    } else if (req.type === "BUSINESS_TRIP") {
      if (!req.startDate || !req.endDate) return <>Không xác định</>;
      const d1 = format(new Date(req.startDate), "dd/MM/yyyy");
      const d2 = format(new Date(req.endDate), "dd/MM/yyyy");
      return <>{d1 === d2 ? `Công tác ngày ${d1}` : `Công tác từ ${d1} đến ${d2}`}</>;
    } else if (req.type === "RESIGNATION") {
      if (!req.lastWorkingDate) return <>Không xác định</>;
      return <>{`Làm việc đến hết ${format(new Date(req.lastWorkingDate), "dd/MM/yyyy")}`}</>;
    }
  } catch {
    return <>Không xác định</>;
  }
  return <>Không xác định</>;
};

export default function RequestsPage() {
  const navigate = useNavigate();
  const session = useAuthStore(state => state.session);

  const perms = session?.groupPermissions?.map(p => p.code) || [];
  const isAdmin = session?.groupName === "ADMIN";
  const canCreate = isAdmin || perms.includes(PERMISSIONS.REQUEST_FORM_CREATE_SELF);
  const canCancel = isAdmin || perms.includes(PERMISSIONS.REQUEST_FORM_CANCEL_SELF);

  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [selectedRequest, setSelectedRequest] = useState<RequestFormResponse | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRequest, setEditRequest] = useState<RequestFormResponse | null>(null);

  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (id: string) => requestFormMeService.cancelCurrentUserRequestForm(id),
    onSuccess: () => {
      toast.success("Đã thu hồi đơn từ!");
      queryClient.invalidateQueries({ queryKey: ["my-request-forms"] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Lỗi khi thu hồi đơn."));
    }
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ['my-request-forms', currentPage, pageSize],
    queryFn: () => requestFormMeService.getCurrentUserRequestForms(currentPage, pageSize)
  });

  const requests = useMemo(() => response?.data?.content || [], [response?.data?.content]);
  
  const totalPages = response?.data?.totalPages || 1;
  const paginatedData = requests;


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-xs font-semibold uppercase flex items-center gap-1 w-fit"><Clock size={12}/> {t("requests.status.pending", { defaultValue: "Chờ duyệt" })}</span>;
      case "APPROVED":
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-xs font-semibold uppercase flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> {t("requests.status.approved", { defaultValue: "Đã duyệt" })}</span>;
      case "REJECTED":
        return <span className="px-2 py-1 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-xs font-semibold uppercase flex items-center gap-1 w-fit"><XCircle size={12}/> {t("requests.status.rejected", { defaultValue: "Từ chối" })}</span>;
      case "CANCELED":
        return <span className="px-2 py-1 bg-slate-500/10 text-slate-600 border border-slate-500/20 rounded text-xs font-semibold uppercase flex items-center gap-1 w-fit"><Ban size={12}/> {t("requests.status.canceled", { defaultValue: "Đã hủy" })}</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/10 text-gray-600 rounded text-xs font-semibold uppercase">{status}</span>;
    }
  };

  const getTypeName = (type: string) => {
    switch(type) {
      case "LEAVE": return t("requests.types.leave", { defaultValue: "Nghỉ phép" });
      case "WFH": return t("requests.types.wfh", { defaultValue: "Làm việc tại nhà" });
      case "ABSENCE": return t("requests.types.absent", { defaultValue: "Vắng mặt" });
      case "BUSINESS_TRIP": return t("requests.types.business", { defaultValue: "Công tác" });
      case "ATTENDANCE_ADJUSTMENT": return t("requests.types.checkInOut", { defaultValue: "Điều chỉnh chấm công" });
      case "RESIGNATION": return t("requests.types.resign", { defaultValue: "Thôi việc" });
      default: return t("requests.types.UNKNOWN", { defaultValue: type });
    }
  };

  const extractPlainText = (html?: string) => {
    if (!html) return "-";
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent?.trim() || "-";
    } catch {
      return "-";
    }
  };

  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8 h-full">
      <div className="w-full space-y-6 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
              <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
                <FileText size={26} strokeWidth={2.5} />
              </span>
              {t("requests.title", { defaultValue: "Quản lý Đơn từ" })}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base ml-1">
              {t("requests.subtitle", { defaultValue: "Tạo mới và theo dõi trạng thái các yêu cầu, đơn từ của bạn." })}
            </p>
          </m.div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {canCreate && (
              <Button 
                 onClick={() => navigate("/app/requests/create")}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-10 px-4 rounded-lg shadow-sm"
              >
                <Plus className="w-4 h-4" /> {t("requests.createNew", { defaultValue: "Tạo đơn mới" })}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Umbrella size={18} strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{t("requests.leaveDays", { defaultValue: "Ngày nghỉ phép" })}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-3xl font-bold text-slate-800">{session?.remainingLeaveDays ?? 0}</div>
              <div className="text-sm font-semibold text-slate-400">/ {session?.maxLeaveDays ?? 0} {t("requests.daysSuffix", { defaultValue: "ngày" })}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Home size={18} strokeWidth={2} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{t("requests.wfhDays", { defaultValue: "Ngày WFH" })}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-3xl font-bold text-slate-800">{session?.remainingWfhDays ?? 0}</div>
              <div className="text-sm font-semibold text-slate-400">/ {session?.maxWfhDays ?? 0} {t("requests.daysSuffix", { defaultValue: "ngày" })}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col flex-1 min-h-[400px] overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
              <p>{t("requests.loading", { defaultValue: "Đang tải dữ liệu đơn từ..." })}</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12">
              <FileEdit className="w-12 h-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium text-foreground mb-1">{t("requests.noRequests", { defaultValue: "Chưa có đơn từ nào" })}</h3>
              <p className="text-sm">{t("requests.noRequestsDesc", { defaultValue: "Bạn chưa tạo đơn từ nào trong hệ thống." })}</p>
            </div>
          ) : (
            <div className="flex flex-col h-full flex-1 justify-between">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
                  <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">{t("requests.columns.type", { defaultValue: "Loại đơn" })}</th>
                      <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t("requests.columns.status", { defaultValue: "Trạng thái" })}</th>
                      <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">
                        <div className="flex items-center justify-center gap-1.5"><Calendar size={14}/> {t("requests.columns.appliedDate", { defaultValue: "Thời gian áp dụng" })}</div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">{t("requests.columns.reason", { defaultValue: "Lý do" })}</th>
                      <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t("requests.columns.submittedDate", { defaultValue: "Ngày gửi" })}</th>
                      <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">{t("requests.columns.actions", { defaultValue: "Thao tác" })}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedData.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-slate-800 border-x border-slate-200 whitespace-nowrap text-left">{getTypeName(req.type)}</td>
                        <td className="px-4 py-3.5 border-x border-slate-200 whitespace-nowrap text-center">{getStatusBadge(req.status)}</td>
                        <td className="px-4 py-3.5 text-slate-600 border-x border-slate-200 whitespace-nowrap text-center"><ApplicableDate req={req} /></td>
                        <td className="px-4 py-3.5 text-slate-700 border-x border-slate-200 max-w-[300px]">
                          <div className="line-clamp-2 whitespace-normal" title={extractPlainText(req.description)}>
                            {extractPlainText(req.description)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 border-x border-slate-200 whitespace-nowrap text-center">
                          {(req.submittedAt || req.createdAt) ? format(new Date(req.submittedAt || req.createdAt), 'dd/MM/yyyy HH:mm') : "-"}
                        </td>
                        <td className="px-4 py-3.5 border-x border-slate-200 whitespace-nowrap text-center items-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title={t("requests.actions.viewDetails", { defaultValue: "Xem chi tiết" })}
                            >
                              <Eye size={18} />
                            </button>
                            {req.status === "PENDING" && (
                              <button
                                onClick={() => { setEditRequest(req); setIsModalOpen(true); }}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                title={t("requests.actions.edit", { defaultValue: "Chỉnh sửa đơn" })}
                              >
                                <FileEdit size={18} />
                              </button>
                            )}
                            {req.status === "PENDING" && canCancel && (
                              <button
                                onClick={() => cancelMutation.mutate(req.id)}
                                disabled={cancelMutation.isPending}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-50"
                                title={t("requests.actions.cancel", { defaultValue: "Thu hồi đơn" })}
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-auto border-t border-border p-4">
                 <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                 />
              </div>
            </div>
          )}
        </div>
      </div>

      <RequestFormModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        initialData={editRequest} 
      />

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn từ</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Loại đơn:</span>
                  <span className="font-medium text-slate-800">{getTypeName(selectedRequest.type)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Trạng thái:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-1">Thời gian áp dụng:</span>
                  <span className="font-medium text-slate-800"><ApplicableDate req={selectedRequest} /></span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-2">Mô tả/Lý do:</span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                    {selectedRequest.description ? (
                      <RichTextViewer htmlContent={selectedRequest.description} />
                    ) : (
                      <span className="text-slate-400 italic">Không có mô tả</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

