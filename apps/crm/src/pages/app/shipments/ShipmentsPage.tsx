import { Ship } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard, TableCol, TableRow } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Tổng lô hàng",       value: "341",   delta: "+7 tuần này",  trend: "up",  accent: "navy"   },
  { label: "Đang vận chuyển",    value: "126",   delta: "+3 hôm nay",   trend: "up",  accent: "indigo" },
  { label: "Tại cảng",           value: "58",    delta: "-12 so với qua",trend:"down", accent: "orange" },
  { label: "Lô hoàn thành/tháng",value: "157",   delta: "+22%",         trend: "up",  accent: "cyan"   },
];

const cols: TableCol[] = [
  { key: "id",      label: "Mã lô",        width: "120px" },
  { key: "type",    label: "Loại",         width: "90px"  },
  { key: "origin",  label: "Xuất phát"                    },
  { key: "dest",    label: "Đến"                          },
  { key: "eta",     label: "ETA",          width: "110px" },
  { key: "weight",  label: "Khối lượng",  width: "100px" },
  { key: "status",  label: "Trạng thái",  width: "120px" },
];

const rows: TableRow[] = [
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#SHP-4401</span>, type:<span className="mp-badge mp-badge-orange">Xuất khẩu</span>, origin:"Cảng Cát Lái, HCM",  dest:"Los Angeles, CA",  eta:"28/04/2026", weight:"42 tấn",  status:<span className="mp-badge mp-badge-blue">Trên biển</span>    },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#SHP-4400</span>, type:<span className="mp-badge mp-badge-blue">Nhập khẩu</span>,  origin:"Shenzhen, CN",       dest:"Cảng Cái Mép, BR-VT",eta:"22/04/2026", weight:"28 tấn",  status:<span className="mp-badge mp-badge-yellow">Tại cảng</span>   },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#SHP-4399</span>, type:<span className="mp-badge mp-badge-orange">Xuất khẩu</span>, origin:"Cảng Hải Phòng",    dest:"Vancouver, BC",    eta:"02/05/2026", weight:"65 tấn",  status:<span className="mp-badge mp-badge-blue">Trên biển</span>    },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#SHP-4398</span>, type:<span className="mp-badge mp-badge-blue">Nhập khẩu</span>,  origin:"Houston, TX",        dest:"Cảng Cát Lái, HCM", eta:"20/04/2026", weight:"33 tấn",  status:<span className="mp-badge mp-badge-yellow">Thủ tục HQ</span>  },
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#SHP-4397</span>, type:<span className="mp-badge mp-badge-purple">Nội địa</span>,   origin:"HCM",               dest:"Hà Nội",           eta:"21/04/2026", weight:"8 tấn",   status:<span className="mp-badge mp-badge-blue">Đang vận chuyển</span>},
  { id:<span style={{fontFamily:"monospace",color:"#1E2062",fontWeight:700}}>#SHP-4396</span>, type:<span className="mp-badge mp-badge-orange">Xuất khẩu</span>, origin:"Cảng Cái Mép",      dest:"New York, NY",     eta:"15/04/2026", weight:"51 tấn",  status:<span className="mp-badge mp-badge-green">Hoàn thành</span>  },
];

const sideContent = (
  <div className="mp-mini-list">
    {[
      { label: "Xuất khẩu", pct: 62, color: "#F7941D", val:"62%" },
      { label: "Nhập khẩu", pct: 28, color: "#6366f1", val:"28%" },
      { label: "Nội địa",   pct: 10, color: "#0891b2", val:"10%" },
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

export default function ShipmentsPage() {
  return (
    <MockPage
      icon={<Ship size={20} color="white" />}
      iconBg="linear-gradient(135deg,#0891b2,#0e7490)"
      title="Lô hàng"
      subtitle="Theo dõi toàn bộ lô hàng xuất nhập khẩu và nội địa"
      stats={stats}
      tableTitle="Lô hàng đang hoạt động"
      columns={cols}
      rows={rows}
      sideTitle="Tỷ lệ loại hàng"
      sideContent={sideContent}
      primaryAction="Tạo lô hàng"
    />
  );
}
