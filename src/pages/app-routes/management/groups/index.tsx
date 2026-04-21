import { ShieldCheck, Edit2, Trash2, MousePointerClick, CheckSquare, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { m  } from 'framer-motion';
import { useLayoutStore } from "@/store/useLayoutStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import GroupsTabContent from "./components/GroupsTabContent";
import GroupPermissionsTabContent from "./components/GroupPermissionsTabContent";

export default function GroupsPage() {
  const { t } = useTranslation();
  const showJobTitleLegend = useLayoutStore((state) => state.showJobTitleLegend);

  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-6 md:gap-8">
      {/* 1. Header Section */}
      <m.div
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
      </m.div>

      {/* 1.5 Legend Section */}
      {showJobTitleLegend && (
        <m.div
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
        </m.div>
      )}

      {/* TABS CONTAINER */}
      <Tabs defaultValue="groups" className="flex flex-col gap-6 mt-2">
        <div className="w-full flex justify-center md:items-start md:justify-start">
          <TabsList className="h-12 bg-muted/80 p-1.5 rounded-xl border border-border shadow-inner min-w-[340px]">
            <TabsTrigger
              value="groups"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2E3192] data-active:bg-background data-active:shadow-sm data-active:text-[#2E3192] text-muted-foreground transition-all h-full"
            >
              <CheckSquare size={16} /> <span>{t('management.groupsTab', { defaultValue: 'Nhóm người dùng' })}</span>
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2E3192] data-active:bg-background data-active:shadow-sm data-active:text-[#2E3192] text-muted-foreground transition-all h-full"
            >
              <Shield size={16} /> <span>{t('management.permissionsTab', { defaultValue: 'Mã quyền' })}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
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
