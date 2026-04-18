import { useState } from "react";
import { Check, X, FileEdit, Clock, Calendar, Search, Filter } from "lucide-react";
import { m  } from 'framer-motion';
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import CustomPagination from "@/components/custom/CustomPagination";

const MOCK_REQUESTS = [
  { id: "REQ-001", user: "Phạm Văn A", type: "Nghỉ phép năm", date: "2026-04-16", reason: "Giải quyết việc gia đình", status: "PENDING" },
  { id: "REQ-002", user: "Nguyễn Thị B", type: "Làm thêm giờ", date: "2026-04-15", reason: "Chạy deadline release dự án", status: "PENDING" },
  { id: "REQ-003", user: "Lê C", type: "Làm từ xa (WFH)", date: "2026-04-17", reason: "Lý do sức khoẻ", status: "PENDING" },
  { id: "REQ-004", user: "Trần D", type: "Đi công tác", date: "2026-04-20", reason: "Gặp đối tác tại Hà Nội", status: "APPROVED" },
  { id: "REQ-005", user: "Phạm Văn A", type: "Nghỉ ốm", date: "2026-04-10", reason: "Cảm cúm", status: "REJECTED" },
];

export default function ManagementRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totalPages = Math.ceil(requests.length / pageSize) || 1;
  const paginatedData = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: action === "APPROVE" ? "APPROVED" : "REJECTED" };
      }
      return req;
    }));
    
    if (action === "APPROVE") {
      toast.success(`Đã DUYỆT đơn ${id} thành công!`);
    } else {
      toast.error(`Đã TỪ CHỐI đơn ${id}.`);
    }
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between border-border shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
            <p className="text-2xl font-bold text-amber-500">3</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-full"><Clock size={20} className="text-amber-500" /></div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-border shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã duyệt (Tháng)</p>
            <p className="text-2xl font-bold text-emerald-500">24</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-full"><Check size={20} className="text-emerald-500" /></div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-border shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Từ chối (Tháng)</p>
            <p className="text-2xl font-bold text-red-500">5</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-full"><X size={20} className="text-red-500" /></div>
        </Card>
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
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã đơn</th>
                <th className="px-4 py-3 font-semibold">Nhân viên</th>
                <th className="px-4 py-3 font-semibold">Loại đơn</th>
                <th className="px-4 py-3 font-semibold flex items-center gap-1.5"><Calendar size={14}/> Ngày Áp Dụng</th>
                <th className="px-4 py-3 font-semibold">Lý do</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map(req => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#2E3192]">{req.id}</td>
                  <td className="px-4 py-3 font-medium">{req.user}</td>
                  <td className="px-4 py-3">{req.type}</td>
                  <td className="px-4 py-3">{req.date}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={req.reason}>{req.reason}</td>
                  <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                  <td className="px-4 py-3 text-right">
                    {req.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAction(req.id, "APPROVE")}
                          className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white p-1.5 rounded-md transition-all group"
                          title="Duyệt"
                        >
                          <Check size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, "REJECT")}
                          className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white p-1.5 rounded-md transition-all group"
                          title="Từ chối"
                        >
                          <X size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">Không có dữ liệu</td>
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
    </div>
  );
}
