import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/custom/SearchableSelect";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user/userService";
import { getErrorMessage } from "@/lib/utils";
import {
  useCreateSalesmanMapping,
  useUpdateSalesmanMapping,
} from "@/pages/app-routes/acc/profit-report/hooks/useSalesmanMappings";
import type { ProfitReportSalesmanMappingResponse } from "@/types/profit-report/SalesmanMappingResponse";

interface SalesmanMappingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided, modal enters edit mode */
  editing?: ProfitReportSalesmanMappingResponse | null;
  /** Pre-fill salesmanName when creating from a Profit Report row */
  prefillSalesmanName?: string;
  /** Called after successful create/update */
  onSuccess?: () => void;
}

export default function SalesmanMappingFormModal({
  open,
  onOpenChange,
  editing,
  prefillSalesmanName,
  onSuccess,
}: SalesmanMappingFormModalProps) {
  // Render the inner form only when open — this forces a fresh mount each time
  // the dialog opens, avoiding stale state and useEffect setState issues.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <SalesmanMappingForm
            editing={editing}
            prefillSalesmanName={prefillSalesmanName}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Inner form — remounts each time the dialog opens, so useState initializers run fresh. */
function SalesmanMappingForm({
  editing,
  prefillSalesmanName,
  onClose,
  onSuccess,
}: {
  editing?: ProfitReportSalesmanMappingResponse | null;
  prefillSalesmanName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const isEdit = !!editing;

  // State initialized from props — safe because this component remounts per dialog open
  const [salesmanName, setSalesmanName] = useState(editing?.salesmanName ?? prefillSalesmanName ?? "");
  const [userProfileId, setUserProfileId] = useState(editing?.userProfileId ?? "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [active, setActive] = useState(editing?.active ?? true);

  // ---- Load employees for selector ----
  const { data: usersPage, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users-for-mapping"],
    queryFn: () => userService.getUsers(1, 500),
    staleTime: 5 * 60 * 1000,
  });

  const employeeOptions = useMemo(() => {
    const users = usersPage?.data?.content ?? [];
    return users.map((u) => ({
      value: u.profileId ?? "",
      label: `${u.employeeCode ?? "—"} — ${u.fullName ?? u.username}${u.englishName ? ` (${u.englishName})` : ""}${u.departmentName ? ` - ${u.departmentName}` : ""}`,
    }));
  }, [usersPage]);

  // ---- Mutations ----
  const createMutation = useCreateSalesmanMapping();
  const updateMutation = useUpdateSalesmanMapping();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = useCallback(() => {
    if (!salesmanName.trim()) {
      toast.error("Vui lòng nhập Salesman Name");
      return;
    }
    if (!userProfileId) {
      toast.error("Vui lòng chọn nhân viên");
      return;
    }

    const payload = {
      salesmanName: salesmanName.trim(),
      userProfileId,
      note: note.trim() || null,
      active,
    };

    if (isEdit && editing) {
      toast.promise(
        updateMutation.mutateAsync({ id: editing.id, payload }).then(() => {
          onClose();
          onSuccess?.();
        }),
        {
          loading: "Đang cập nhật mapping…",
          success: "Cập nhật mapping thành công",
          error: (err: unknown) => getErrorMessage(err, "Lỗi cập nhật mapping"),
        },
      );
    } else {
      toast.promise(
        createMutation.mutateAsync(payload).then(() => {
          onClose();
          onSuccess?.();
        }),
        {
          loading: "Đang tạo mapping…",
          success: "Tạo mapping thành công",
          error: (err: unknown) => getErrorMessage(err, "Lỗi tạo mapping"),
        },
      );
    }
  }, [salesmanName, userProfileId, note, active, isEdit, editing, createMutation, updateMutation, onClose, onSuccess]);

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <UserCheck size={20} />
          </span>
          <DialogTitle>{isEdit ? "Sửa Salesman Mapping" : "Tạo Salesman Mapping"}</DialogTitle>
        </div>
        <DialogDescription className="pt-1">
          {isEdit
            ? "Cập nhật alias salesman và nhân viên tương ứng."
            : "Tạo alias để map tên salesman trong Profit Report sang nhân viên."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Salesman Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Salesman Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={salesmanName}
            onChange={(e) => setSalesmanName(e.target.value)}
            placeholder="Tên salesman trong file Excel"
            className="h-11 rounded-xl"
            disabled={isPending}
          />
        </div>

        {/* Employee Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Nhân viên <span className="text-rose-500">*</span>
          </label>
          <SearchableSelect
            options={employeeOptions}
            value={userProfileId}
            onChange={setUserProfileId}
            placeholder="Chọn nhân viên…"
            isLoading={isLoadingUsers}
            disabled={isPending}
          />
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Ghi chú
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú (tùy chọn)"
            className="h-11 rounded-xl"
            disabled={isPending}
          />
        </div>

        {/* Active toggle */}
        {isEdit && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trạng thái
            </label>
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              disabled={isPending}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                active
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {active ? "Đang dùng" : "Ngưng dùng"}
            </button>
          </div>
        )}
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>
          Hủy
        </DialogClose>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-[#2E3192] hover:bg-[#1E2062] text-white"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          {isEdit ? "Cập nhật" : "Tạo mapping"}
        </Button>
      </DialogFooter>
    </>
  );
}
