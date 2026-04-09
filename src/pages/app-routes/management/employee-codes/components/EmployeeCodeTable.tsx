import { useState } from 'react';
import { SearchX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import type { EmployeeCodeResponse } from '@/types/response/user/EmployeeCodeResponse';

export default function EmployeeCodeTable({ data, onDelete }: { data: EmployeeCodeResponse[], onDelete: (id: string) => void }) {
  const [rightClickedId, setRightClickedId] = useState<string | null>(null);

  const activeItem = data.find(d => d.id === rightClickedId);

  return (
    <div className="overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          <Table className="border-collapse">
            <TableHeader className="bg-muted/80">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground w-[250px] border-r border-border text-left align-middle px-6">Prefix</TableHead>
                <TableHead className="font-semibold text-foreground border-r border-border text-left align-middle px-6 min-w-[200px]">Mô tả</TableHead>
                <TableHead className="font-semibold text-foreground w-[150px] border-r border-border text-center align-middle px-4">Trạng thái</TableHead>
                <TableHead className="font-semibold text-foreground w-[120px] text-center align-middle px-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {data.map((item) => (
                  <motion.tr 
                    key={item.id}
                    layout 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border group/row hover:bg-[#1E2062]/5 transition-colors duration-200"
                    onContextMenu={() => setRightClickedId(item.id)}
                  >
                    <TableCell className="font-bold text-[#1E2062] py-4 border-r border-border text-left align-middle px-6">
                      {item.prefix}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 border-r border-border text-left align-middle px-6 truncate max-w-[300px]" title={item.description}>
                      {item.description || "—"}
                    </TableCell>
                    <TableCell className="py-4 border-r border-border text-center align-middle">
                      <Badge 
                        variant={item.active ? "default" : "secondary"} 
                        className={item.active 
                          ? "bg-[#10b981] hover:bg-[#10b981]/90 shadow-sm shadow-[#10b981]/20 font-medium border-0" 
                          : "bg-muted text-muted-foreground hover:bg-slate-800 dark:bg-slate-700 hover:text-muted-foreground font-medium border-0"
                        }
                      >
                        {item.active ? "Đang hoạt động" : "Vô hiệu hóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { if(window.confirm('Bạn có chắc chắn muốn xóa mã này?')) onDelete(item.id); }} className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <SearchX size={32} className="mb-2 opacity-50" />
                      <p>Không tìm thấy dữ liệu</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ContextMenuTrigger>

        {/* RENDER CONTEXT MENU FOR THE ROW */}
        {activeItem && (
          <ContextMenuContent className="w-56 z-50">
            <ContextMenuItem 
              className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10" 
              onClick={() => { if(window.confirm('Bạn có chắc chắn muốn xóa mã này?')) onDelete(activeItem.id); }}
            >
              <Trash2 className="mr-2 h-4 w-4 text-rose-500" />
              <span>Xóa Prefix</span>
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
