import { Users } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard, TableCol, TableRow } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Tổng khách hàng",  value: "2,847", delta: "+12% tháng này", trend: "up",   accent: "navy"   },
  { label: "KH tiềm năng",     value: "384",   delta: "+8 hôm nay",    trend: "up",   accent: "orange" },
  { label: "Hợp đồng hiệu lực",value: "1,203", delta: "+3%",           trend: "up",   accent: "indigo" },
  { label: "Tỷ lệ giữ chân",   value: "94.2%", delta: "-0.5%",         trend: "down", accent: "cyan"   },
];

const cols: TableCol[] = [
  { key: "name",    label: "Khách hàng", width: "220px" },
  { key: "type",    label: "Loại",       width: "100px" },
  { key: "contact", label: "Liên hệ"                    },
  { key: "orders",  label: "Đơn hàng",  width: "90px"  },
  { key: "revenue", label: "Doanh thu", width: "120px"  },
  { key: "status",  label: "Trạng thái",width: "110px"  },
];

const mkAvatar = (name: string, bg: string) => (
  <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
    <div className="mp-avatar" style={{ background: bg }}>
      {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
    </div>
    <span style={{ fontWeight: 600, color: "#1e293b" }}>{name}</span>
  </div>
);

const rows: TableRow[] = [
  { name: mkAvatar("Công ty TNHH Hải Long","#1E2062"), type: <span className="mp-badge mp-badge-blue">Doanh nghiệp</span>, contact: "hai.long@example.com",  orders: 48, revenue: "2.4 tỷ",   status: <span className="mp-badge mp-badge-green">Hoạt động</span> },
  { name: mkAvatar("Mai Thị Hoa","#F7941D"),            type: <span className="mp-badge mp-badge-purple">Cá nhân</span>,    contact: "mai.hoa@example.com",    orders: 12, revenue: "340 tr",   status: <span className="mp-badge mp-badge-green">Hoạt động</span> },
  { name: mkAvatar("Đại lý Phương Nam","#0891b2"),      type: <span className="mp-badge mp-badge-orange">Đại lý</span>,    contact: "phuongnam@co.vn",        orders: 92, revenue: "5.1 tỷ",   status: <span className="mp-badge mp-badge-green">Hoạt động</span> },
  { name: mkAvatar("Nguyen Van An","#6366f1"),          type: <span className="mp-badge mp-badge-purple">Cá nhân</span>,   contact: "an.nguyen@mail.com",     orders:  3, revenue: "85 tr",    status: <span className="mp-badge mp-badge-yellow">Tiềm năng</span> },
  { name: mkAvatar("Tập đoàn Bình Minh","#16a34a"),    type: <span className="mp-badge mp-badge-blue">Doanh nghiệp</span>,contact: "contact@binhminh.vn",    orders: 207,revenue: "18.7 tỷ",  status: <span className="mp-badge mp-badge-green">Hoạt động</span> },
  { name: mkAvatar("XNK Miền Trung","#dc2626"),         type: <span className="mp-badge mp-badge-orange">Đại lý</span>,    contact: "info@xnkmientrung.vn",   orders: 56, revenue: "4.2 tỷ",   status: <span className="mp-badge mp-badge-red">Tạm ngưng</span>  },
  { name: mkAvatar("Lê Thanh Phong","#a16207"),         type: <span className="mp-badge mp-badge-purple">Cá nhân</span>,   contact: "phong.le@gmail.com",     orders:  8, revenue: "210 tr",   status: <span className="mp-badge mp-badge-yellow">Tiềm năng</span> },
];

const sideContent = (
  <div className="mp-mini-list">
    {[
      { label: "Hải Long Group",    val: "2.4 tỷ",  pct: 82, color: "#1E2062" },
      { label: "Tập đoàn Bình Minh",val: "18.7 tỷ", pct: 95, color: "#F7941D" },
      { label: "ĐL Phương Nam",     val: "5.1 tỷ",  pct: 68, color: "#6366f1" },
      { label: "XNK Miền Trung",    val: "4.2 tỷ",  pct: 55, color: "#0891b2" },
    ].map((item, i) => (
      <div key={i} className="mp-mini-item" style={{ flexDirection:"column", alignItems:"flex-start" }}>
        <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
          <span className="mp-mini-label">{item.label}</span>
          <span className="mp-mini-value">{item.val}</span>
        </div>
        <div className="mp-progress" style={{ width:"100%" }}>
          <div className="mp-progress-fill" style={{ width:`${item.pct}%`, background: item.color }} />
        </div>
      </div>
    ))}
  </div>
);

export default function CustomersPage() {
  return (
    <MockPage
      icon={<Users size={20} color="white" />}
      title="Khách hàng"
      subtitle="Quản lý danh sách khách hàng và đối tác logistics"
      stats={stats}
      tableTitle="Danh sách khách hàng gần đây"
      columns={cols}
      rows={rows}
      sideTitle="Top doanh thu tháng này"
      sideContent={sideContent}
      primaryAction="Thêm khách hàng"
    />
  );
}
