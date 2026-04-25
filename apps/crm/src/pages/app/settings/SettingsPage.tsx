import { Settings, User, Bell, Shield, Globe, Palette } from "lucide-react";
import MockPage from "@/components/custom/MockPage/MockPage";

const sections = [
  { icon: <User     size={18} color="#1E2062"/>, title:"Tài khoản",            desc:"Cập nhật thông tin cá nhân, ảnh đại diện, mật khẩu"  },
  { icon: <Bell     size={18} color="#F7941D"/>, title:"Thông báo",            desc:"Cấu hình email, push notification và cảnh báo hệ thống"},
  { icon: <Shield   size={18} color="#16a34a"/>, title:"Bảo mật & Quyền truy cập",desc:"Xác thực 2 bước, phân quyền, lịch sử đăng nhập"  },
  { icon: <Globe    size={18} color="#0891b2"/>, title:"Ngôn ngữ & Khu vực",  desc:"Tiếng Việt / English, múi giờ, định dạng số/ngày"    },
  { icon: <Palette  size={18} color="#7c3aed"/>, title:"Giao diện",            desc:"Chủ đề màu sắc, chế độ tối, font chữ, mật độ hiển thị"},
  { icon: <Settings size={18} color="#64748b"/>, title:"Hệ thống & Tích hợp", desc:"API keys, webhook, kết nối ERP/WMS bên ngoài"         },
];

export default function SettingsPage() {
  return (
    <MockPage
      icon={<Settings size={20} color="white" />}
      iconBg="linear-gradient(135deg,#334155,#475569)"
      title="Cài đặt"
      subtitle="Tuỳ chỉnh tài khoản và hệ thống CRM"
    >
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1rem" }}>
        {sections.map((s,i)=>(
          <div key={i} className="mp-card" style={{ cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
            onMouseLeave={e=>(e.currentTarget.style.transform="")}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ width:38, height:38, borderRadius:9, background:"#f8fafc", border:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {s.icon}
              </div>
              <span style={{ fontWeight:700, fontSize:"0.88rem", color:"#1e293b" }}>{s.title}</span>
            </div>
            <p style={{ fontSize:"0.78rem", color:"#94a3b8", lineHeight:1.5, margin:0 }}>{s.desc}</p>
            <div style={{ marginTop:12, fontSize:"0.75rem", color:"#6366f1", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
              Cấu hình →
            </div>
          </div>
        ))}
      </div>
    </MockPage>
  );
}
