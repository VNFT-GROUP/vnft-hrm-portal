import { useState } from "react";
import { Check, X, FileEdit, Clock, Calendar, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const MOCK_REQUESTS = [
  { id: "REQ-001", user: "Pháº¡m VÄƒn A", type: "Nghá»‰ phÃ©p nÄƒm", date: "2026-04-16", reason: "Giáº£i quyáº¿t viá»‡c gia Ä‘Ã¬nh", status: "PENDING" },
  { id: "REQ-002", user: "Nguyá»…n Thá»‹ B", type: "LÃ m thÃªm giá»", date: "2026-04-15", reason: "Cháº¡y deadline release dá»± Ã¡n", status: "PENDING" },
  { id: "REQ-003", user: "LÃª C", type: "LÃ m tá»« xa (WFH)", date: "2026-04-17", reason: "LÃ½ do sá»©c khoáº»", status: "PENDING" },
  { id: "REQ-004", user: "Tráº§n D", type: "Äi cÃ´ng tÃ¡c", date: "2026-04-20", reason: "Gáº·p Ä‘á»‘i tÃ¡c táº¡i HÃ  Ná»™i", status: "APPROVED" },
  { id: "REQ-005", user: "Pháº¡m VÄƒn A", type: "Nghá»‰ á»‘m", date: "2026-04-10", reason: "Cáº£m cÃºm", status: "REJECTED" },
];

export default function ManagementRequestsPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: action === "APPROVE" ? "APPROVED" : "REJECTED" };
      }
      return req;
    }));
    
    if (action === "APPROVE") {
      toast.success(`ÄÃ£ DUYá»†T Ä‘Æ¡n ${id} thÃ nh cÃ´ng!`);
    } else {
      toast.error(`ÄÃ£ Tá»ª CHá»I Ä‘Æ¡n ${id}.`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-xs font-semibold uppercase">Chá» duyá»‡t</span>;
      case "APPROVED":
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-xs font-semibold uppercase">ÄÃ£ duyá»‡t</span>;
      case "REJECTED":
        return <span className="px-2 py-1 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-xs font-semibold uppercase">Tá»« chá»‘i</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8 relative isolate">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <FileEdit size={28} />
          </span>
          Quáº£n lÃ½ ÄÆ¡n tá»«
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          Duyá»‡t vÃ  xá»­ lÃ½ cÃ¡c yÃªu cáº§u nghá»‰ phÃ©p, tÄƒng ca cá»§a toÃ n bá»™ nhÃ¢n viÃªn.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between border-border shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chá» duyá»‡t</p>
            <p className="text-2xl font-bold text-amber-500">3</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-full"><Clock size={20} className="text-amber-500" /></div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-border shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ÄÃ£ duyá»‡t (ThÃ¡ng)</p>
            <p className="text-2xl font-bold text-emerald-500">24</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-full"><Check size={20} className="text-emerald-500" /></div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-border shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tá»« chá»‘i (ThÃ¡ng)</p>
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
              placeholder="TÃ¬m kiáº¿m mÃ£ Ä‘Æ¡n, nhÃ¢n viÃªn..." 
              className="pl-9 pr-4 py-2 w-full text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-[#2E3192] outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-input rounded-md hover:bg-muted text-sm font-medium transition-colors ml-auto">
            <Filter size={16} /> Lá»c
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">MÃ£ Ä‘Æ¡n</th>
                <th className="px-4 py-3 font-semibold">NhÃ¢n viÃªn</th>
                <th className="px-4 py-3 font-semibold">Loáº¡i Ä‘Æ¡n</th>
                <th className="px-4 py-3 font-semibold flex items-center gap-1.5"><Calendar size={14}/> NgÃ y Ãp Dá»¥ng</th>
                <th className="px-4 py-3 font-semibold">LÃ½ do</th>
                <th className="px-4 py-3 font-semibold">Tráº¡ng thÃ¡i</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tÃ¡c</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map(req => (
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
                          title="Duyá»‡t"
                        >
                          <Check size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, "REJECT")}
                          className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white p-1.5 rounded-md transition-all group"
                          title="Tá»« chá»‘i"
                        >
                          <X size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">ÄÃ£ xá»­ lÃ½</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">KhÃ´ng cÃ³ dá»¯ liá»‡u</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
