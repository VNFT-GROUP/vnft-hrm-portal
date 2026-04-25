import { DollarSign } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard, TableCol, TableRow } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Doanh thu tháng",   value: "8.4 tỷ",  delta: "+14% so tháng trước", trend: "up",  accent: "navy"   },
  { label: "Hoá đơn chờ thu",   value: "1.2 tỷ",  delta: "23 hoá đơn",          trend: "flat",accent: "orange" },
  { label: "Đã thu tháng này",  value: "7.1 tỷ",  delta: "+18%",                trend: "up",  accent: "green"  },
  { label: "Công nợ quá hạn",   value: "340 tr",  delta: "-8% so tuần qua",     trend: "down",accent: "red"    },
];

const cols: TableCol[] = [
  { key:"id",       label:"Mã hoá đơn",  width:"130px" },
  { key:"customer", label:"Khách hàng"               },
  { key:"amount",   label:"Giá trị",     width:"110px" },
  { key:"issued",   label:"Ngày phát",   width:"110px" },
  { key:"due",      label:"Hạn thanh toán",width:"125px"},
  { key:"status",   label:"Trạng thái",  width:"120px" },
];

const rows: TableRow[] = [
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#INV-2024</span>, customer:"Hải Long Group",    amount:"328 tr",  issued:"01/04/2026", due:"30/04/2026", status:<span className="mp-badge mp-badge-blue">Chờ thanh toán</span>   },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#INV-2023</span>, customer:"Bình Minh Corp",   amount:"1.8 tỷ",  issued:"28/03/2026", due:"27/04/2026", status:<span className="mp-badge mp-badge-green">Đã thanh toán</span>    },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#INV-2022</span>, customer:"ĐL Phương Nam",    amount:"560 tr",  issued:"25/03/2026", due:"24/04/2026", status:<span className="mp-badge mp-badge-red">Quá hạn</span>            },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#INV-2021</span>, customer:"XNK Miền Trung",  amount:"220 tr",  issued:"20/03/2026", due:"19/04/2026", status:<span className="mp-badge mp-badge-green">Đã thanh toán</span>    },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#INV-2020</span>, customer:"Lê Thanh Phong",  amount:"95 tr",   issued:"15/03/2026", due:"14/04/2026", status:<span className="mp-badge mp-badge-yellow">Đang xử lý</span>      },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#INV-2019</span>, customer:"Tân Cảng SCL",    amount:"2.1 tỷ",  issued:"10/03/2026", due:"09/04/2026", status:<span className="mp-badge mp-badge-green">Đã thanh toán</span>    },
];

const sideContent = (
  <div className="mp-mini-list">
    {[
      { label: "Tiền mặt",          val:"3.2 tỷ", pct:38, color:"#1E2062" },
      { label: "Chuyển khoản",      val:"4.5 tỷ", pct:54, color:"#6366f1" },
      { label: "Thanh toán quốc tế",val:"0.7 tỷ", pct:8,  color:"#0891b2" },
    ].map((s,i)=>(
      <div key={i} className="mp-mini-item" style={{flexDirection:"column",alignItems:"flex-start"}}>
        <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
          <span className="mp-mini-label">{s.label}</span>
          <span className="mp-mini-value">{s.val}</span>
        </div>
        <div className="mp-progress" style={{width:"100%"}}>
          <div className="mp-progress-fill" style={{width:s.pct+"%",background:s.color}}/>
        </div>
      </div>
    ))}
  </div>
);

export default function FinancePage() {
  return (
    <MockPage
      icon={<DollarSign size={20} color="white" />}
      iconBg="linear-gradient(135deg,#16a34a,#15803d)"
      title="Tài chính"
      subtitle="Quản lý hoá đơn, thanh toán và công nợ"
      stats={stats}
      tableTitle="Hoá đơn gần đây"
      columns={cols}
      rows={rows}
      sideTitle="Phương thức thanh toán"
      sideContent={sideContent}
      primaryAction="Tạo hoá đơn"
    />
  );
}
