import { Package } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard, TableCol, TableRow } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Tổng đơn hàng",    value: "1,492", delta: "+34 hôm nay",   trend: "up",   accent: "navy"   },
  { label: "Chờ xử lý",        value: "87",    delta: "-5 so với qua", trend: "down", accent: "orange" },
  { label: "Đang vận chuyển",  value: "423",   delta: "+12%",          trend: "up",   accent: "indigo" },
  { label: "Hoàn thành tháng", value: "982",   delta: "+8% tháng trước",trend:"up",   accent: "green"  },
];

const cols: TableCol[] = [
  { key: "id",       label: "Mã đơn",      width: "110px" },
  { key: "customer", label: "Khách hàng"                   },
  { key: "route",    label: "Tuyến đường"                  },
  { key: "date",     label: "Ngày đặt",    width: "110px" },
  { key: "value",    label: "Giá trị",     width: "110px" },
  { key: "status",   label: "Trạng thái",  width: "120px" },
];

const rows: TableRow[] = [
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8821</span>, customer: "Hải Long Group",    route: "HCM → Hà Nội",    date: "19/04/2026", value: "128 tr",  status: <span className="mp-badge mp-badge-blue">Đang xử lý</span>     },
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8820</span>, customer: "Bình Minh Corp",   route: "HCM → Đà Nẵng",   date: "19/04/2026", value: "85 tr",   status: <span className="mp-badge mp-badge-yellow">Chờ xử lý</span>    },
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8819</span>, customer: "XNK Phương Nam",  route: "Shenzhen → HCM",  date: "18/04/2026", value: "342 tr",  status: <span className="mp-badge mp-badge-green">Hoàn thành</span>    },
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8818</span>, customer: "Mai Thị Hoa",     route: "Hà Nội → HCM",   date: "18/04/2026", value: "42 tr",   status: <span className="mp-badge mp-badge-green">Hoàn thành</span>    },
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8817</span>, customer: "Miền Trung XNK",  route: "HCM → Cần Thơ",  date: "17/04/2026", value: "67 tr",   status: <span className="mp-badge mp-badge-red">Đã huỷ</span>          },
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8816</span>, customer: "Lê Thanh Phong",  route: "Houston → HCM",  date: "17/04/2026", value: "1.2 tỷ", status: <span className="mp-badge mp-badge-blue">Đang xử lý</span>     },
  { id: <span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#ORD-8815</span>, customer: "Hải Long Group",  route: "Vancouver → HCM",date: "16/04/2026", value: "890 tr",  status: <span className="mp-badge mp-badge-green">Hoàn thành</span>    },
];

const sideContent = (
  <div className="mp-mini-list">
    {[
      { label: "Đang xử lý",    count: 423, color: "#6366f1" },
      { label: "Chờ xác nhận",  count: 87,  color: "#F7941D" },
      { label: "Hoàn thành",    count: 982, color: "#16a34a" },
      { label: "Đã huỷ",        count: 18,  color: "#dc2626" },
    ].map((s, i) => (
      <div key={i} className="mp-mini-item">
        <div className="mp-avatar" style={{ background: s.color, width:10, height:10, minWidth:10, borderRadius:"50%" }} />
        <span className="mp-mini-label">{s.label}</span>
        <span className="mp-mini-value" style={{ fontWeight:700, color:"#1e293b" }}>{s.count}</span>
      </div>
    ))}
  </div>
);

export default function OrdersPage() {
  return (
    <MockPage
      icon={<Package size={20} color="white" />}
      iconBg="linear-gradient(135deg,#F7941D,#f9a84d)"
      title="Đơn hàng"
      subtitle="Theo dõi và quản lý toàn bộ đơn hàng logistics"
      stats={stats}
      tableTitle="Đơn hàng mới nhất"
      columns={cols}
      rows={rows}
      sideTitle="Phân loại đơn hàng"
      sideContent={sideContent}
      primaryAction="Tạo đơn hàng"
    />
  );
}
