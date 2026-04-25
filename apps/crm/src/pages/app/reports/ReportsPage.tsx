import { BarChart2, TrendingUp, Users, ArrowUpDown } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";
import type { StatCard } from "@/components/custom/MockPage/MockPage";

const stats: StatCard[] = [
  { label: "Doanh thu Q1/2026",  value: "24.3 tỷ", delta: "+19% so cùng kỳ", trend: "up",  accent: "navy"   },
  { label: "Số lô hàng XNK",     value: "1,842",   delta: "+11%",             trend: "up",  accent: "indigo" },
  { label: "KH mới tháng này",   value: "48",      delta: "+25%",             trend: "up",  accent: "cyan"   },
  { label: "NPS Score",          value: "72",      delta: "+4 điểm",          trend: "up",  accent: "green"  },
];

const months = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const revenueData = [4.2,3.8,5.1,4.9,0,0,0,0,0,0,0,0]; // first 4 months 2026

export default function ReportsPage() {
  const maxVal = Math.max(...revenueData.filter(v=>v>0));
  return (
    <MockPage
      icon={<BarChart2 size={20} color="white" />}
      iconBg="linear-gradient(135deg,#7c3aed,#6366f1)"
      title="Báo cáo"
      subtitle="Phân tích doanh thu, KPI và hiệu suất hoạt động"
      stats={stats}
      primaryAction="Xuất báo cáo"
    >
      <div className="mp-body">
        <div className="mp-card">
          <div className="mp-card-title">
            <span style={{display:"flex",alignItems:"center",gap:6}}><TrendingUp size={16} color="#1E2062"/>Doanh thu theo tháng (2026)</span>
            <span>Đơn vị: tỷ VNĐ</span>
          </div>
          {/* Simple bar chart */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:160, paddingBottom:24, position:"relative" }}>
            {/* Y axis lines */}
            {[0,25,50,75,100].map(p=>(
              <div key={p} style={{ position:"absolute", left:0, right:0, bottom:24+p*1.2, height:1, background:"#f1f5f9", zIndex:0 }}/>
            ))}
            {months.map((m,i)=>{
              const val = revenueData[i];
              const h = val>0 ? (val/maxVal)*130 : 0;
              return (
                <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",zIndex:1}}>
                  {val>0 && <span style={{fontSize:"0.65rem",color:"#1E2062",fontWeight:700}}>{val}T</span>}
                  <div style={{
                    width:"100%", height: val>0 ? h : 20,
                    borderRadius:"4px 4px 0 0",
                    background: val>0
                      ? `linear-gradient(180deg,${i===3?"#F7941D":"#1E2062"},${i===3?"#f9a84d":"#2E3192"})`
                      : "#f1f5f9",
                    opacity: val>0 ? 1 : 0.5,
                    transition:"height 0.3s"
                  }}/>
                  <span style={{fontSize:"0.68rem",color:"#94a3b8",position:"absolute",bottom:-20}}>{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title"><span style={{display:"flex",alignItems:"center",gap:6}}><ArrowUpDown size={16} color="#1E2062"/>Top tuyến đường XNK</span></div>
          <div className="mp-mini-list">
            {[
              { route:"HCM → Los Angeles",  pct:28, vol:"340 lô", color:"#1E2062" },
              { route:"Shenzhen → HCM",     pct:22, vol:"267 lô", color:"#F7941D" },
              { route:"HCM → Vancouver",    pct:18, vol:"218 lô", color:"#6366f1" },
              { route:"Houston → HCM",      pct:15, vol:"182 lô", color:"#0891b2" },
              { route:"Phnom Penh → HCM",   pct:10, vol:"121 lô", color:"#16a34a" },
            ].map((r,i)=>(
              <div key={i} className="mp-mini-item" style={{flexDirection:"column",alignItems:"flex-start"}}>
                <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                  <span className="mp-mini-label">{r.route}</span>
                  <span className="mp-mini-value">{r.vol}</span>
                </div>
                <div className="mp-progress" style={{width:"100%"}}>
                  <div className="mp-progress-fill" style={{width:r.pct*3+"%",background:r.color}}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:"1.5rem"}}>
            <div className="mp-card-title"><span style={{display:"flex",alignItems:"center",gap:6}}><Users size={16} color="#1E2062"/>KH tăng trưởng nhất</span></div>
            {[
              { name:"Bình Minh Corp",   growth:"+48%", color:"#16a34a" },
              { name:"Hải Long Group",   growth:"+32%", color:"#16a34a" },
              { name:"Tân Cảng SCL",     growth:"+24%", color:"#F7941D" },
              { name:"XNK Phương Nam",   growth:"+18%", color:"#F7941D" },
            ].map((k,i)=>(
              <div key={i} className="mp-mini-item">
                <div className="mp-avatar" style={{background:k.color,width:28,height:28,minWidth:28,fontSize:"0.65rem"}}>
                  {k.name.slice(0,2).toUpperCase()}
                </div>
                <span className="mp-mini-label">{k.name}</span>
                <span style={{fontWeight:700,color:k.color,fontSize:"0.8rem"}}>{k.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockPage>
  );
}
