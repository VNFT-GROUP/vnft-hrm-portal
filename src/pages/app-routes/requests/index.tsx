import { FileEdit, Plus, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RequestsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
              <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
                <FileText size={26} strokeWidth={2.5} />
              </span>
              Quáº£n lÃ½ ÄÆ¡n tá»«
            </h1>
            <p className="text-muted-foreground text-sm md:text-base ml-1">
              Táº¡o má»›i vÃ  theo dÃµi tráº¡ng thÃ¡i cÃ¡c yÃªu cáº§u, Ä‘Æ¡n tá»« cá»§a báº¡n.
            </p>
          </motion.div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Button 
               onClick={() => navigate("/app/requests/create")}
               className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-10 px-4 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Táº¡o Ä‘Æ¡n má»›i
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-12">
          <FileEdit className="w-12 h-12 mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-600 mb-1">ChÆ°a cÃ³ Ä‘Æ¡n tá»« nÃ o</h3>
          <p className="text-sm">Báº¡n chÆ°a táº¡o Ä‘Æ¡n tá»« nÃ o hoáº·c lÆ°á»›i dá»¯ liá»‡u Ä‘ang Ä‘Æ°á»£c cáº­p nháº­t.</p>
        </div>
      </div>
    </div>
  );
}
