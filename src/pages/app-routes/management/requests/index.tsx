import { useState } from "react";
import { Check, X, FileEdit, Calendar, Search, Filter, Eye, Activity } from "lucide-react";
import { m  } from 'framer-motion';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import CustomPagination from "@/components/custom/CustomPagination";
import { RichTextViewer } from "@/components/custom/RichTextViewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestFormApprovalService } from "@/services/requestform/approval";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import type { RequestFormStatisticPeriod } from "@/types/requestform/RequestFormEnums";
import { format, subMonths, setDate } from "date-fns";
import { getErrorMessage } from "@/lib/utils";

export default function ManagementRequestsPage() {
  const queryClient = useQueryClient();

  const { data: response } = useQuery({
    queryKey: ["approvalRequests"],
    queryFn: () => requestFormApprovalService.getRequestFormsForApproval()
  });
  
  const [statisticPeriod, setStatisticPeriod] = useState<RequestFormStatisticPeriod>("THIS_MONTH");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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

  const { data: statsResponse } = useQuery({
    queryKey: ["approvalRequestsStatistics", statisticPeriod, startDate, endDate],
    queryFn: () => requestFormApprovalService.getRequestFormStatistics(statisticPeriod, startDate || undefined, endDate || undefined)
  });

  const requests = response?.data || [];
  const stats = statsResponse?.data;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const [selectedRequest, setSelectedRequest] = useState<RequestFormResponse | null>(null);

  const totalPages = Math.ceil(requests.length / pageSize) || 1;
  const paginatedData = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const approveMutation = useMutation({
    mutationFn: (id: string) => requestFormApprovalService.approveRequestForm(id),
    onSuccess: (_, id) => {
      toast.success(`Đã DUYỆT đơn ${id} thành công!`);
      queryClient.invalidateQueries({ queryKey: ["approvalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["approvalRequestsStatistics"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Duyệt thất bại."));
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => requestFormApprovalService.rejectRequestForm(id),
    onSuccess: (_, id) => {
      toast.success(`Đã TỪ CHỐI đơn ${id}.`);
      queryClient.invalidateQueries({ queryKey: ["approvalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["approvalRequestsStatistics"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Từ chối thất bại."));
    }
  });

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    if (action === "APPROVE") approveMutation.mutate(id);
    else rejectMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-xs font-semibold uppercase">Chờ duyệt</span>;
      case "APPROVED":
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-xs font-semibold uppercase">Đã duyệt</span>;
      case "REJECTED":
        return <span className="px-2 py-1 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-xs font-semibold uppercase">Từ chối</span>;
      default:
        return null;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "LEAVE": return "Nghỉ phép";
      case "ABSENCE": return "Vắng mặt";
      case "ATTENDANCE_ADJUSTMENT": return "Chấm công";
      case "BUSINESS_TRIP": return "Công tác";
      case "WFH": return "Làm từ xa";
      case "RESIGNATION": return "Thôi việc";
      default: return type;
    }
  };

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8 relative isolate">
      {/* Header Section */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <FileEdit size={28} />
          </span>
          Quản lý Đơn từ
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          Duyệt và xử lý các yêu cầu nghỉ phép, tăng ca của toàn bộ nhân viên.
        </p>
      </m.div>

      {/* Stats Cards Dashboard */}
      <div className="flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#2E3192] text-white px-5 py-3 flex flex-col md:flex-row md:items-center justify-between border-b border-[#2E3192]/80 gap-3 md:gap-0">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-200" />
              <h3 className="font-semibold text-base">Tổng quan quản lý đơn từ</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-blue-100 font-medium px-1 gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Select 
                  value={statisticPeriod} 
                  onValueChange={(val) => handlePeriodChange(val as RequestFormStatisticPeriod)}
                >
                  <SelectTrigger className="w-[180px] h-9 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors focus:ring-white/30">
                    <div className="flex-1 text-left truncate">
                      {statisticPeriod === "ALL" ? "Tất cả thời gian" : 
                      statisticPeriod === "THIS_MONTH" ? "Tháng này (mặc định)" : 
                      "Tìm ngày tùy chọn"}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả thời gian</SelectItem>
                    <SelectItem value="THIS_MONTH">Tháng này (mặc định)</SelectItem>
                    <SelectItem value="RANGE">Tìm ngày tùy chọn</SelectItem>
                  </SelectContent>
                </Select>

                {statisticPeriod === "RANGE" && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <input 
                      type="date" 
                      style={{ colorScheme: "dark" }}
                      className="border border-white/20 rounded px-2 h-9 text-sm bg-white/10 text-white focus:bg-white/20 focus:ring-1 focus:ring-white/40 outline-none transition-colors"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="text-blue-200">đến</span>
                    <input 
                      type="date" 
                      style={{ colorScheme: "dark" }}
                      className="border border-white/20 rounded px-2 h-9 text-sm bg-white/10 text-white focus:bg-white/20 focus:ring-1 focus:ring-white/40 outline-none transition-colors"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                )}
                
                {stats?.startDate && stats?.endDate && statisticPeriod !== "RANGE" && (
                   <div className="hidden md:flex items-center gap-1.5 ml-2 text-white/80 font-medium border-l border-blue-400 pl-3 h-6">
                     <Calendar size={14} />
                     <span>
                       {format(new Date(stats.startDate), "dd/MM")} - {format(new Date(stats.endDate), "dd/MM/yyyy")}
                     </span>
                   </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column */}
            <div className="p-5 border-r border-slate-100 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">THỐNG KÊ TRẠNG THÁI</span>
              <ul className="divide-y divide-slate-100 flex-1 flex flex-col justify-start">
                <li className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Tổng số đơn</span>
                  <span className="font-bold text-[#1E2062] text-lg">{stats?.total ?? 0} <span className="text-sm font-normal text-slate-400 ml-1">đơn</span></span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Chờ duyệt</span>
                  <span className="font-bold text-amber-500 text-lg">{stats?.pendingCount ?? 0}</span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Đã duyệt</span>
                  <span className="font-bold text-emerald-500 text-lg">{stats?.approvedCount ?? 0}</span>
                </li>
                <li className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Từ chối</span>
                  <span className="font-bold text-red-500 text-lg">{stats?.rejectedCount ?? 0}</span>
                </li>
              </ul>
            </div>
            
            {/* Right Column */}
            <div className="p-5 flex flex-col bg-slate-50/30">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PHÂN LOẠI ĐƠN TỪ</span>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 flex-1 content-start">
                {(stats?.typeStatistics || []).map((typeStat) => (
                  <div key={typeStat.type} className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between shadow-sm hover:shadow transition-shadow">
                    <span className="text-sm font-medium text-slate-600 mb-2 truncate" title={getRequestTypeLabel(typeStat.type)}>
                      {getRequestTypeLabel(typeStat.type)}
                    </span>
                    <div className="flex items-end justify-between">
                      <span className="font-bold text-[#1E2062] text-xl leading-none">{typeStat.total}</span>
                      {typeStat.pendingCount > 0 && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100" title="Chờ duyệt">
                          {typeStat.pendingCount} chờ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {(!stats?.typeStatistics || stats.typeStatistics.length === 0) && (
                  <div className="col-span-full py-4 text-center text-slate-400 text-sm">Chưa có dữ liệu phân loại</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col flex-1">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã đơn, nhân viên..." 
              className="pl-9 pr-4 py-2 w-full text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-[#2E3192] outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-input rounded-md hover:bg-muted text-sm font-medium transition-colors ml-auto">
            <Filter size={16} /> Lọc
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 flex flex-col">
          <table className="w-full text-sm text-left border-collapse border border-slate-200 select-text">
            <thead className="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">Mã đơn</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">Nhân viên</th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">Loại đơn</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">
                  <div className="flex items-center justify-center gap-1.5"><Calendar size={14}/> Ngày Áp Dụng</div>
                </th>
                <th className="px-4 py-3 font-semibold text-left border-x border-slate-200">Lý do</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-center border-x border-slate-200">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#2E3192] border-x border-slate-200 whitespace-nowrap text-center">{req.id}</td>
                  <td className="px-4 py-3 font-medium border-x border-slate-200 whitespace-nowrap text-left">{req.requesterId}</td>
                  <td className="px-4 py-3 border-x border-slate-200 whitespace-nowrap text-left">{req.type}</td>
                  <td className="px-4 py-3 border-x border-slate-200 whitespace-nowrap text-center">
                    {req.startDate ? format(new Date(req.startDate), "dd/MM/yyyy") : ""}
                  </td>
                  <td className="px-4 py-3 text-slate-700 border-x border-slate-200 max-w-[300px]">
                    <div className="line-clamp-2 whitespace-normal" title={req.description || ""}>
                      {req.description ? req.description.replace(/<[^>]*>?/gm, "").substring(0, 100) : "Không có lý do"}
                    </div>
                  </td>
                        <td className="px-4 py-3 border-x border-slate-200 whitespace-nowrap text-center">{getStatusBadge(req.status)}</td>
                        <td className="px-4 py-3 border-x border-slate-200 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      {req.status === "PENDING" ? (
                        <>
                          <button 
                            onClick={() => handleAction(req.id, "APPROVE")}
                            disabled={approveMutation.isPending && approveMutation.variables === req.id}
                            className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white p-1.5 rounded-md transition-all group"
                            title="Duyệt"
                          >
                            <Check size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, "REJECT")}
                            disabled={rejectMutation.isPending && rejectMutation.variables === req.id}
                            className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white p-1.5 rounded-md transition-all group"
                            title="Từ chối"
                          >
                            <X size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-xs italic ml-2">Đã xử lý</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground border-x border-slate-200">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
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
              className="p-4 border-t border-border mt-auto"
            />
          )}
        </div>
      </div>
      
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn từ - {selectedRequest?.requesterId}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Loại đơn:</span>
                  <span className="font-medium text-slate-800">{selectedRequest.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Trạng thái:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-1">Thời gian áp dụng:</span>
                  <span className="font-medium text-slate-800">
                    {selectedRequest.startDate ? format(new Date(selectedRequest.startDate), "dd/MM/yyyy HH:mm") : ""}
                    {selectedRequest.endDate ? ` - ${format(new Date(selectedRequest.endDate), "dd/MM/yyyy HH:mm")}` : ""}
                  </span>
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
