import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useGatewayAuthStore } from "@/store/useGatewayAuthStore";
import type { ModuleConfig } from "../data/modules";

export function ModuleCard({ module, index }: { module: ModuleConfig; index: number }) {
  const isActive = module.status === "active";
  const session = useGatewayAuthStore((s) => s.session);

  const handleClick = () => {
    if (!isActive) {
      toast.info(`${module.name} — Hệ thống chưa ra mắt`, {
        description: "Phân hệ này đang được phát triển và sẽ sớm ra mắt.",
      });
      return;
    }
    if (!session) return;

    // Navigate to the sub-app's /verify page.
    // The verify page will check auth via the shared .dev.local cookie.
    window.location.href = `${module.url}/verify`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="h-full"
    >
      <div
        className={`bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden transition-all duration-300 cursor-pointer ${isActive ? "hover:shadow-xl hover:-translate-y-1 hover:border-[#2E3192]/30" : "hover:shadow-md"}`}
        onClick={handleClick}
      >
        {/* Cover Image */}
        <div className="relative h-48 w-full bg-slate-100/50 border-b border-slate-100 flex-none overflow-hidden p-4">
          <img
            src={module.image}
            alt={module.name}
            className={`w-full h-full object-contain transition-transform duration-500 ${isActive ? "hover:scale-105" : ""}`}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="p-3 rounded-lg bg-slate-50 border border-slate-100 shadow-sm"
              style={{ color: module.color }}
            >
              {module.icon}
            </div>
            {!isActive && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                Sắp ra mắt
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{module.name}</h3>
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-4">{module.nameFull}</p>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
            {module.description}
          </p>

          {/* Bottom Area */}
          <div className="pt-5 border-t border-slate-100 mt-auto flex items-center justify-between font-bold text-sm" style={{ color: isActive ? module.color : '#94a3b8' }}>
            <span>{isActive ? "Truy cập ngay" : "Sắp ra mắt"}</span>
            <ArrowRight size={18} className={isActive ? "transition-transform group-hover:translate-x-1" : ""} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
