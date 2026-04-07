import { Edit2, Trash2, Users, Eye, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export interface Employee {
  id: string;
  empCodePrefix: string;
  empCodeId: string;
  attendanceCode: string;
  fullName: string;
  englishName: string;
  email: string;
  department: string;
  position: string;
  func: string;
  status: string;
  checkInTime: string;
  checkOutTime: string;
  sysRole: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Đang làm": return "bg-[#10b981] hover:bg-[#10b981]/90 shadow-[#10b981]/20";
      case "Nghỉ sinh": return "bg-pink-500 hover:bg-pink-500/90 shadow-pink-500/20 text-white";
      case "Tạm hoãn": return "bg-amber-500 hover:bg-amber-500/90 shadow-amber-500/20 text-white";
      case "Đã nghỉ việc": return "bg-slate-300 hover:bg-slate-400 text-foreground shadow-none border-0";
      default: return "bg-muted text-muted-foreground border-0";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse">
        <TableHeader className="bg-muted/80">
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[120px] border-r border-border text-center align-middle px-4">Mã NV</TableHead>
            <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6 min-w-[250px]">Họ và Tên</TableHead>
            <TableHead className="font-semibold text-foreground w-[200px] border-r border-border text-left align-middle px-6">Phòng ban</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">Trạng thái</TableHead>
            <TableHead className="font-semibold text-foreground w-[180px] text-center align-middle px-4">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {employees.map((emp) => (
              <motion.tr 
                key={emp.id}
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
              >
                <TableCell className="font-medium text-muted-foreground py-4 border-r border-border text-center align-middle px-4">
                  {emp.empCodePrefix}{emp.empCodeId}
                </TableCell>
                <TableCell className="py-4 border-r border-border text-left align-middle px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E2062]/10 flex flex-shrink-0 items-center justify-center text-[#1E2062] font-bold shadow-sm">
                      {emp.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1E2062]">{emp.fullName}</span>
                      <span className="text-xs text-muted-foreground">{emp.englishName ? `(${emp.englishName})` : ''} - {emp.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 border-r border-border text-left align-middle px-6 text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium">{emp.department}</span>
                    <span className="text-xs text-muted-foreground">{emp.position}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 border-r border-border text-center align-middle">
                  <Badge className={`${getStatusColor(emp.status)} shadow-sm font-medium border-0`}>
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-center align-middle">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" title="Xem chi tiết" className="h-8 w-8 text-sky-500 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Chỉnh sửa" onClick={() => onEdit(emp)} className="h-8 w-8 text-amber-500 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Chỉnh lương" className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                      <CircleDollarSign size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Xóa" onClick={() => onDelete(emp.id)} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Users size={32} className="mb-2 opacity-50" />
                  <p>Không tìm thấy nhân viên nào</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
