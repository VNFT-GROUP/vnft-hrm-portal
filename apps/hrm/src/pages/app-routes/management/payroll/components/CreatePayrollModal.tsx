import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Briefcase, Users, Search, X, CalendarIcon } from "lucide-react";
import { jobTitleService } from "@/services/jobtitle/jobTitleService";
import { userService } from "@/services/user/userService";
import { useDebounce } from "@/hooks/useDebounce";
import type { CreatePayrollRequest } from "@/types/payroll/CalculatePayrollRequest";
import type { JobTitleResponse } from "@/types/jobtitle/JobTitleResponse";
import type { UserResponse } from "@/types/user/UserResponse";

interface CreatePayrollModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreatePayrollRequest) => void;
  isPending: boolean;
  defaultMonth: number;
  defaultYear: number;
}

export default function CreatePayrollModal({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  defaultMonth,
  defaultYear,
}: CreatePayrollModalProps) {
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [allEmployees, setAllEmployees] = useState(false);

  // --- Job Title selection ---
  const [selectedJobTitleIds, setSelectedJobTitleIds] = useState<string[]>([]);
  const { data: jobTitlesResponse } = useQuery({
    queryKey: ["job-titles"],
    queryFn: () => jobTitleService.getJobTitles(),
    enabled: isOpen,
  });
  const jobTitles: JobTitleResponse[] = jobTitlesResponse?.data ?? [];

  const toggleJobTitle = (id: string) => {
    setSelectedJobTitleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // --- User Profile selection ---
  const [selectedUsers, setSelectedUsers] = useState<{ id: string; name: string; code: string }[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const debouncedUserSearch = useDebounce(userSearch, 400);
  const { data: usersPage } = useQuery({
    queryKey: ["users-for-payroll-create", debouncedUserSearch],
    queryFn: () => userService.getUsers(1, 30, debouncedUserSearch),
    enabled: isOpen && debouncedUserSearch.length >= 1,
  });
  const userResults: UserResponse[] = usersPage?.data?.content ?? [];

  const addUser = (u: UserResponse) => {
    if (!selectedUsers.find((s) => s.id === u.id)) {
      setSelectedUsers((prev) => [
        ...prev,
        { id: u.id, name: u.fullName || u.username, code: u.employeeCode || "" },
      ]);
    }
    setUserSearch("");
  };

  const removeUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // --- Employee code manual input ---
  const [employeeCodeInput, setEmployeeCodeInput] = useState("");
  const [employeeCodes, setEmployeeCodes] = useState<string[]>([]);

  const addEmployeeCode = () => {
    const code = employeeCodeInput.trim().toUpperCase();
    if (code && !employeeCodes.includes(code)) {
      setEmployeeCodes((prev) => [...prev, code]);
    }
    setEmployeeCodeInput("");
  };

  const removeEmployeeCode = (code: string) => {
    setEmployeeCodes((prev) => prev.filter((c) => c !== code));
  };

  // --- Validation ---
  const hasSelection =
    allEmployees ||
    selectedJobTitleIds.length > 0 ||
    selectedUsers.length > 0 ||
    employeeCodes.length > 0;

  const handleSubmit = () => {
    const finalName =
      name.trim() ||
      `Bảng lương tháng ${month.toString().padStart(2, "0")}/${year}`;

    onSubmit({
      year,
      month,
      name: finalName,
      note: note.trim() || null,
      allEmployees: allEmployees || null,
      jobTitleIds: !allEmployees && selectedJobTitleIds.length > 0 ? selectedJobTitleIds : null,
      userProfileIds: !allEmployees && selectedUsers.length > 0 ? selectedUsers.map((u) => u.id) : null,
      employeeCodes: !allEmployees && employeeCodes.length > 0 ? employeeCodes : null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50 border-none rounded-xl gap-0">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-[#1E2062] flex items-center gap-2">
            <div className="bg-[#2E3192]/10 p-1.5 rounded-lg text-[#2E3192]">
              <CalendarIcon size={18} />
            </div>
            Tạo bảng lương mới
          </DialogTitle>
          <DialogDescription className="text-sm">
            Chọn tháng/năm và phạm vi nhân sự để khởi tạo bảng lương nháp (DRAFT).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Period & name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-slate-700">Tháng <span className="text-rose-500">*</span></Label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-md h-10 px-3 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-slate-700">Năm <span className="text-rose-500">*</span></Label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-md h-10 px-3 text-sm"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-slate-700">Tên bảng lương</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Bảng lương tháng ${month.toString().padStart(2, "0")}/${year}`}
                className="h-10 bg-slate-50/50 border-slate-200"
              />
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-1.5">
            <Label className="text-[13px] font-semibold text-slate-700">Ghi chú</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú tùy ý..."
              className="bg-slate-50/50 border-slate-200 text-sm min-h-[60px]"
            />
          </div>

          {/* ===== SCOPE SELECTION ===== */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Users size={16} className="text-[#2E3192]" />
              Phạm vi nhân sự <span className="text-rose-500">*</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Chọn toàn bộ nhân sự hoặc chọn theo chức vụ, danh sách, mã nhân viên.
            </p>
          </div>

          {/* 0. All Employees toggle */}
          <label
            className={`flex items-center gap-3 bg-white p-5 border rounded-xl shadow-sm cursor-pointer transition-all ${
              allEmployees
                ? "border-[#2E3192]/40 bg-[#2E3192]/5 ring-1 ring-[#2E3192]/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Checkbox
              checked={allEmployees}
              onCheckedChange={(v) => setAllEmployees(!!v)}
              className="w-5 h-5 data-[state=checked]:bg-[#2E3192] data-[state=checked]:border-[#2E3192]"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">Toàn bộ nhân sự</span>
              <span className="text-xs text-slate-500">Tạo bảng lương cho tất cả nhân sự đang hoạt động trong hệ thống.</span>
            </div>
          </label>

          {/* 1. Job Title multi-select */}
          <div className={`bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-3 transition-opacity ${allEmployees ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Briefcase size={15} className="text-amber-600" />
              Theo chức vụ
              {selectedJobTitleIds.length > 0 && (
                <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {selectedJobTitleIds.length} đã chọn
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto custom-scrollbar">
              {jobTitles.map((jt) => (
                <label
                  key={jt.id}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all ${
                    selectedJobTitleIds.includes(jt.id)
                      ? "bg-[#2E3192]/5 border-[#2E3192]/30 text-[#1E2062] font-medium shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Checkbox
                    checked={selectedJobTitleIds.includes(jt.id)}
                    onCheckedChange={() => toggleJobTitle(jt.id)}
                    className="w-4 h-4 data-[state=checked]:bg-[#2E3192] data-[state=checked]:border-[#2E3192]"
                  />
                  {jt.name}
                </label>
              ))}
              {jobTitles.length === 0 && (
                <span className="text-xs text-slate-400 italic">Không có chức vụ nào.</span>
              )}
            </div>
          </div>

          {/* 2. User Profile multi-select with search */}
          <div className={`bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-3 transition-opacity ${allEmployees ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Users size={15} className="text-indigo-600" />
              Theo nhân sự
              {selectedUsers.length > 0 && (
                <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {selectedUsers.length} đã chọn
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo mã hoặc tên nhân viên..."
                className="pl-9 h-9 bg-slate-50/50 border-slate-200 text-sm"
              />
              {userResults.length > 0 && userSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-48 overflow-auto">
                  {userResults.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors text-sm flex justify-between items-center"
                      onClick={() => addUser(u)}
                    >
                      <span className="font-medium text-slate-700">
                        {u.employeeCode} — {u.fullName}
                      </span>
                      {selectedUsers.find((s) => s.id === u.id) ? (
                        <span className="text-xs text-emerald-600 font-semibold">✓ Đã chọn</span>
                      ) : (
                        <span className="text-xs text-slate-400">+ Thêm</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((u) => (
                  <span
                    key={u.id}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium pl-2.5 pr-1 py-1 rounded-full border border-indigo-100"
                  >
                    {u.code} - {u.name}
                    <button
                      type="button"
                      onClick={() => removeUser(u.id)}
                      className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 3. Employee Codes manual */}
          <div className={`bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-3 transition-opacity ${allEmployees ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="text-emerald-600 text-base font-mono">#</span>
              Nhập mã nhân viên
              {employeeCodes.length > 0 && (
                <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {employeeCodes.length}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={employeeCodeInput}
                onChange={(e) => setEmployeeCodeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEmployeeCode(); } }}
                placeholder="VD: VNSGN001"
                className="flex-1 h-9 bg-slate-50/50 border-slate-200 text-sm font-mono"
              />
              <Button type="button" variant="outline" size="sm" onClick={addEmployeeCode} className="h-9 px-4">
                Thêm
              </Button>
            </div>
            {employeeCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {employeeCodes.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-mono font-medium pl-2.5 pr-1 py-1 rounded-full border border-emerald-100"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeEmployeeCode(c)}
                      className="p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-5 bg-white border-t border-slate-100 flex sm:justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-10 border-slate-200">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !hasSelection}
            className="px-8 h-10 bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-md font-semibold"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Tạo bảng lương
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
