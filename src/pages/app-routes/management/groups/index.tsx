import { ShieldCheck, Edit2, Trash2, MousePointerClick, CheckSquare, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useLayoutStore } from "@/store/useLayoutStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GroupsTabContent from "./components/GroupsTabContent";
import GroupPermissionsTabContent from "./components/GroupPermissionsTabContent";

export default function GroupsPage() {
  const { t } = useTranslation();
  const showRoleLegend = useLayoutStore((state) => state.showRoleLegend);

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] flex items-center gap-3">
          <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl">
            <ShieldCheck size={28} />
          </span>
          {t('management.groupsTitle', { defaultValue: 'Cấu Hình Quản Trị Phân Quyền' })}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg ml-1">
          {t('management.groupsDesc', { defaultValue: 'Quản lý toàn bộ thông số về nhóm quyền và danh sách mã quyền trong hệ thống.' })}
        </p>
      </motion.div>

      {/* 1.5 Legend Section */}
      {showRoleLegend && (
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
              <Edit2 size={16} className="text-[#2E3192]" />
              <span>{t('management.editLegend', { defaultValue: 'Chỉnh sửa thông tin' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              <span>{t('management.deleteLegend', { defaultValue: 'Xóa / Hủy kích hoạt' })}</span>
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

      {/* TABS CONTAINER */}
      <Tabs defaultValue="groups" className="flex flex-col gap-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-14 md:w-fit w-full flex items-center justify-start border border-border/80 shadow-sm">
          <TabsTrigger
            value="groups"
            className="flex items-center gap-2 px-6 h-11 text-base font-semibold data-[state=active]:bg-[#1E2062] data-[state=active]:text-white rounded-lg transition-all"
          >
            <CheckSquare size={18} /> Nhóm quyền
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="flex items-center gap-2 px-6 h-11 text-base font-semibold data-[state=active]:bg-[#1E2062] data-[state=active]:text-white rounded-lg transition-all"
          >
            <Shield size={18} /> Dữ liệu mã quyền
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups" className="flex-1 mt-0">
          <GroupsTabContent />
        </TabsContent>
        <TabsContent value="permissions" className="flex-1 mt-0">
          <GroupPermissionsTabContent />
        </TabsContent>
      </Tabs>

    </div>
  );
}
