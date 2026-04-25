import { LayoutDashboard, TrendingUp, Package, Users, Ship, Bell } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Doanh thu hôm nay",  value: "428 tr",  delta: "+12% so hôm qua", trend: "up",  accent: "navy"   },
  { label: "Đơn hàng mới",       value: "34",      delta: "+8 so hôm qua",   trend: "up",  accent: "orange" },
  { label: "Lô đang vận chuyển", value: "126",     delta: "3 đến hôm nay",   trend: "up",  accent: "cyan"   },
  { label: "Khách hàng mới",     value: "7",       delta: "+3 tuần này",     trend: "up",  accent: "green"  },
];

export default function DashboardPage() {
  return (
    <MockPage
      icon={<LayoutDashboard size={20} color="white" />}
      title="Dashboard"
      subtitle={`Tổng quan hệ thống CRM — ${new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"})}`}
      stats={stats}
      primaryAction="Tạo đơn hàng"
    >
      <div className="mp-body">
        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {/* Activity feed */}
          <div className="mp-card">
            <div className="mp-card-title">
              <span style={{display:"flex",alignItems:"center",gap:6}}><Bell size={15} color="#1E2062"/>Hoạt động gần đây</span>
              <span>Hôm nay</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {[
                { time:"20:42", icon:<Package size={14}/>,  color:"#F7941D", text: "Đơn hàng #ORD-8821 được xác nhận bởi Sales Team",  sub:"Hải Long Group — 128 tr"        },
                { time:"20:18", icon:<Ship size={14}/>,     color:"#0891b2", text: "Lô hàng #SHP-4401 rời cảng Cát Lái",              sub:"ETA: 28/04 — Los Angeles, CA"   },
                { time:"19:55", icon:<Users size={14}/>,    color:"#6366f1", text: "Khách hàng mới: Tân Cảng SCL đăng ký",            sub:"Phân loại: Doanh nghiệp"         },
                { time:"18:30", icon:<TrendingUp size={14}/>,color:"#16a34a",text: "Hoá đơn #INV-2024 đã được thanh toán",            sub:"328 tr — Hải Long Group"         },
                { time:"16:11", icon:<Package size={14}/>,  color:"#F7941D", text: "Đơn hàng #ORD-8820 chờ xác nhận",                sub:"Bình Minh Corp — 85 tr"          },
                { time:"14:07", icon:<Ship size={14}/>,     color:"#0891b2", text: "Lô hàng #SHP-4400 cập cảng Cái Mép",             sub:"Từ Shenzhen, CN — 28 tấn"       },
              ].map((a,i)=>(
                <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<5?"1px solid #f8fafc":"none", alignItems:"flex-start" }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:a.color+"18", display:"flex", alignItems:"center", justifyContent:"center", color:a.color, flexShrink:0, marginTop:2 }}>
                    {a.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.81rem", color:"#334155", fontWeight:500 }}>{a.text}</div>
                    <div style={{ fontSize:"0.72rem", color:"#94a3b8", marginTop:2 }}>{a.sub}</div>
                  </div>
                  <span style={{ fontSize:"0.68rem", color:"#cbd5e1", flexShrink:0, paddingTop:3 }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {/* Quick stats */}
          <div className="mp-card">
            <div className="mp-card-title">Tháng 4 / 2026</div>
            <div className="mp-mini-list">
              {[
                { label:"Tổng đơn hàng",      val:"982",    color:"#1E2062" },
                { label:"Lô hoàn thành",       val:"157",    color:"#0891b2" },
                { label:"Doanh thu",           val:"8.4 tỷ", color:"#16a34a" },
                { label:"KH mới",              val:"48",     color:"#F7941D" },
                { label:"Tỷ lệ đúng hạn",     val:"97.2%",  color:"#6366f1" },
              ].map((s,i)=>(
                <div key={i} className="mp-mini-item">
                  <div style={{ width:8, height:8, borderRadius:"50%", background:s.color, flexShrink:0 }}/>
                  <span className="mp-mini-label">{s.label}</span>
                  <span style={{ fontWeight:700, color:"#1e293b", fontSize:"0.82rem" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending tasks */}
          <div className="mp-card">
            <div className="mp-card-title">Cần xử lý hôm nay</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { text:"Duyệt 23 đơn hàng đang chờ",   urgent:true  },
                { text:"Liên hệ KH Phương Nam về HĐ",  urgent:true  },
                { text:"Kiểm tra 3 lô hàng tại cảng",  urgent:false },
                { text:"Gửi báo giá cho Miền Trung XNK",urgent:false },
                { text:"Cập nhật lịch xe tuần tới",    urgent:false },
              ].map((t,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<4?"1px solid #f8fafc":"none" }}>
                  <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${t.urgent?"#F7941D":"#e2e8f0"}`, flexShrink:0, background:t.urgent?"#fff8f0":"transparent" }}/>
                  <span style={{ fontSize:"0.79rem", color: t.urgent?"#1e293b":"#64748b", fontWeight:t.urgent?600:400 }}>{t.text}</span>
                  {t.urgent && <span className="mp-badge mp-badge-orange" style={{marginLeft:"auto",flexShrink:0}}>Gấp</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockPage>
  );
}
