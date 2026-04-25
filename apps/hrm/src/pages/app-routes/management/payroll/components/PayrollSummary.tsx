import { DollarSign, ShieldCheck, FileText, Banknote, CalendarDays } from "lucide-react";
import type { PayrollTotalsResponse } from "@/types/payroll/PayrollResponse";

interface PayrollSummaryProps {
  totals: PayrollTotalsResponse;
}

const fmt = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl border ${bgColor} transition-all hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-800 font-mono tracking-tight">{value}</span>
    </div>
  );
}

export default function PayrollSummary({ totals }: PayrollSummaryProps) {
  return (
    <div className="space-y-5">
      {/* Row 1: Key totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
        <StatCard
          label="Số nhân sự"
          value={totals.employeeCount.toString()}
          icon={<FileText size={16} />}
          color="bg-indigo-100 text-indigo-600"
          bgColor="border-indigo-100 bg-indigo-50/40"
        />
        <StatCard
          label="Tổng lương theo công"
          value={fmt(totals.workdaySalary)}
          icon={<DollarSign size={16} />}
          color="bg-emerald-100 text-emerald-600"
          bgColor="border-emerald-100 bg-emerald-50/40"
        />
        <StatCard
          label="Thu nhập chịu thuế"
          value={fmt(totals.taxableIncome)}
          icon={<FileText size={16} />}
          color="bg-amber-100 text-amber-600"
          bgColor="border-amber-100 bg-amber-50/40"
        />
        <StatCard
          label="Thực lãnh"
          value={fmt(totals.netSalary)}
          icon={<Banknote size={16} />}
          color="bg-[#2E3192]/10 text-[#2E3192]"
          bgColor="border-[#2E3192]/10 bg-[#2E3192]/5"
        />
        <StatCard
          label="Chuyển khoản"
          value={fmt(totals.bankTransfer)}
          icon={<Banknote size={16} />}
          color="bg-sky-100 text-sky-600"
          bgColor="border-sky-100 bg-sky-50/40"
        />
      </div>

      {/* Row 2: Detail sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insurance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
            <ShieldCheck size={14} className="text-teal-500" />
            Bảo hiểm
          </div>
          <div className="text-[13px] space-y-1.5 text-slate-600">
            <Row label="BHXH Cty" value={fmt(totals.companySocialInsurance)} />
            <Row label="BHYT Cty" value={fmt(totals.companyHealthInsurance)} />
            <Row label="BHTN Cty" value={fmt(totals.companyUnemploymentInsurance)} />
            <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1.5" />
            <Row label="BHXH NV" value={fmt(totals.employeeSocialInsurance)} />
            <Row label="BHYT NV" value={fmt(totals.employeeHealthInsurance)} />
            <Row label="BHTN NV" value={fmt(totals.employeeUnemploymentInsurance)} />
          </div>
        </div>

        {/* Tax */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
            <FileText size={14} className="text-rose-500" />
            Thuế
          </div>
          <div className="text-[13px] space-y-1.5 text-slate-600">
            <Row label="TN Chịu thuế" value={fmt(totals.taxableIncome)} />
            <Row label="GTGC bản thân" value={fmt(totals.personalDeduction)} />
            <Row label="SL NPT" value={totals.dependentCount.toString()} />
            <Row label="GT NPT" value={fmt(totals.dependentDeduction)} />
            <Row label="TN tính thuế" value={fmt(totals.assessableIncome)} />
            <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1.5" />
            <Row label="Thuế TNCN" value={fmt(totals.personalIncomeTax)} bold className="text-rose-600" />
          </div>
        </div>

        {/* Workdays & Payments */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
            <CalendarDays size={14} className="text-violet-500" />
            Công & Chi trả
          </div>
          <div className="text-[13px] space-y-1.5 text-slate-600">
            <Row label="Công chuẩn" value={totals.standardWorkdays.toString()} />
            <Row label="Công thực" value={fmtWorkday(totals.actualWorkdays)} />
            <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1.5" />
            <Row label="Chuyển khoản" value={fmt(totals.bankTransfer)} />
            <Row label="Tiền mặt" value={fmt(totals.cashPayment)} />
            <div className="border-t border-dashed border-slate-200 pt-1.5 mt-1.5" />
            <Row label="Thực lãnh" value={fmt(totals.netSalary)} bold className="text-[#2E3192]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, className }: { label: string; value: string; bold?: boolean; className?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className={`font-mono ${bold ? "font-bold" : "font-medium"} ${className || "text-slate-800"}`}>{value}</span>
    </div>
  );
}

function fmtWorkday(v: number) {
  return Number.isInteger(v) ? v.toString() : v.toFixed(2).replace(/\.?0+$/, "");
}
