import { Truck } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Phương tiện hoạt động", value: "84",    delta: "+2 hôm nay", trend: "up",  accent: "navy"   },
  { label: "Tài xế đang chạy",      value: "67",    delta: "12 rảnh",    trend: "flat",accent: "orange" },
  { label: "Lịch trình hôm nay",    value: "142",   delta: "+18%",       trend: "up",  accent: "indigo" },
  { label: "Tổng km/tháng",         value: "48,200",delta: "+5%",        trend: "up",  accent: "green"  },
];

export default function OperationsPage() {
  return (
    <MockPage
      icon={<Truck size={20} color="white" />}
      iconBg="linear-gradient(135deg,#16a34a,#15803d)"
      title="Vận hành"
      subtitle="Quản lý đội xe, tài xế, cảng biển và kho bãi"
      stats={stats}
      primaryAction="Lên lịch trình"
    >
      <div className="mp-body">
        {/* Vehicle grid mock */}
        <div className="mp-card">
          <div className="mp-card-title">Đội xe hôm nay <span>Cập nhật lúc 20:55</span></div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"0.75rem" }}>
            {[
              { id:"51K-24832", driver:"Nguyễn Văn A", route:"HCM→Đà Nẵng", status:"Đang chạy",  color:"#16a34a" },
              { id:"29A-17548", driver:"Trần Thị B",   route:"HN→Hải Phòng",status:"Đang chạy",  color:"#16a34a" },
              { id:"51H-99203", driver:"Lê Văn C",     route:"HCM→Cần Thơ", status:"Đang chạy",  color:"#16a34a" },
              { id:"43A-88821", driver:"Phạm Thị D",   route:"Tại kho 3",    status:"Đang bốc",   color:"#F7941D" },
              { id:"29C-43211", driver:"Đỗ Văn E",     route:"—",            status:"Bảo dưỡng",  color:"#dc2626" },
              { id:"51K-55601", driver:"Bùi Thị F",    route:"—",            status:"Chờ lệnh",   color:"#6366f1" },
              { id:"29A-71234", driver:"Hoàng Văn G",  route:"HCM→Vũng Tàu",status:"Đang chạy",  color:"#16a34a" },
              { id:"43B-20011", driver:"Ngô Thị H",    route:"—",            status:"Nghỉ",       color:"#94a3b8" },
            ].map((v,i)=>(
              <div key={i} style={{ padding:"0.85rem", border:"1px solid #f1f5f9", borderRadius:10, borderLeft:`3px solid ${v.color}` }}>
                <div style={{ fontFamily:"monospace", fontWeight:700, fontSize:"0.8rem", color:"#1e293b" }}>{v.id}</div>
                <div style={{ fontSize:"0.75rem", color:"#64748b", marginTop:2 }}>{v.driver}</div>
                <div style={{ fontSize:"0.72rem", color:"#94a3b8", marginTop:2 }}>{v.route}</div>
                <div style={{ marginTop:6 }}>
                  <span className="mp-badge" style={{ background:v.color+"22", color:v.color, fontSize:"0.65rem" }}>{v.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mp-card">
          <div className="mp-card-title">Tình trạng kho bãi</div>
          <div className="mp-mini-list">
            {[
              { label:"Kho Bình Dương 1",  pct:78, cap:"4,800/6,200 m²" },
              { label:"Kho Cát Lái",        pct:92, cap:"9,100/10,000 m²"},
              { label:"Kho Long Bình",      pct:45, cap:"2,250/5,000 m²" },
              { label:"Kho Hải Phòng",      pct:61, cap:"3,050/5,000 m²" },
            ].map((k,i)=>(
              <div key={i} className="mp-mini-item" style={{flexDirection:"column",alignItems:"flex-start"}}>
                <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                  <span className="mp-mini-label">{k.label}</span>
                  <span className="mp-mini-value">{k.cap}</span>
                </div>
                <div className="mp-progress" style={{width:"100%"}}>
                  <div className="mp-progress-fill" style={{width:k.pct+"%", background: k.pct>85?"#dc2626":k.pct>65?"#F7941D":"#16a34a"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockPage>
  );
}
