import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus } from "lucide-react";
import { useRef, useEffect } from "react";
import "./Calendar.css"; // We'll create custom local styling to override fullcalendar layout

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (calendarRef.current) {
        // requestAnimationFrame ensures it updates smoothly after CSS transitions
        requestAnimationFrame(() => {
          calendarRef.current?.getApi().updateSize();
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDateClick = (arg: any) => {
    alert("Ngày được chọn: " + arg.dateStr);
  };

  const handleEventClick = (arg: any) => {
    alert("Sự kiện: " + arg.event.title);
  };

  const hrEvents = [
    { title: "Phỏng vấn ứng viên Dev", date: new Date().toISOString().split('T')[0], color: "#1E2062" },
    { title: "Review Lương T10", date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], color: "#F7941D" },
    { title: "Khai giảng Khóa đào tạo", date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], color: "#10b981" },
    { title: "Team Building Quý 3", start: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], end: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString().split('T')[0], color: "#ef4444" },
  ];

  return (
    <div className="p-4 md:p-6 h-full w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1E2062]">Lịch & Sự kiện</h1>
          <p className="text-slate-500 mt-1">Quản lý và điều phối các sự kiện tập thể, lịch phỏng vấn và ngày nghỉ.</p>
        </div>
        <button className="mt-4 md:mt-0 flex items-center gap-2 bg-[#2E3192] hover:bg-[#1E2062] text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm disabled:opacity-50">
          <Plus size={18} />
          Tạo sự kiện mới
        </button>
      </div>

      {/* Main Calendar Card */}
      <div ref={containerRef} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 w-full overflow-x-auto">
        <div className="min-w-[800px] w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            buttonText={{
              today: "Hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày"
            }}
            locale="vi"
            events={hrEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            dayMaxEvents={true}
          />
        </div>
      </div>
    </div>
  );
}
