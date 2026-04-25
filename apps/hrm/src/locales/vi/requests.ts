export default {
  title: "Quản lý Đơn từ",
  subtitle: "Tạo mới và theo dõi trạng thái các yêu cầu, đơn từ của bạn.",
  createNew: "Tạo đơn mới",
  leaveDays: "Ngày nghỉ phép",
  wfhDays: "Ngày WFH",
  daysSuffix: "ngày",
  loading: "Đang tải dữ liệu đơn từ...",
  noRequests: "Chưa có đơn từ nào",
  noRequestsDesc: "Bạn chưa tạo đơn từ nào trong hệ thống.",
  types: {
    leave: "Đơn xin nghỉ phép",
    absent: "Đơn vắng mặt",
    checkInOut: "Đơn checkin/out",
    business: "Đơn công tác",
    resign: "Đơn thôi việc",
    wfh: "Đơn WFH",
    UNKNOWN: "Không xác định"
  },
  status: {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
    canceled: "Đã hủy"
  },
  columns: {
    type: "Loại đơn",
    status: "Trạng thái",
    appliedDate: "Thời gian áp dụng",
    reason: "Lý do",
    submittedDate: "Ngày gửi",
    actions: "Thao tác"
  },
  actions: {
    viewDetails: "Xem chi tiết",
    edit: "Chỉnh sửa đơn",
    cancel: "Thu hồi đơn"
  },
  isPaidText: "Có tính công",
  create: {
    title: "Tạo đơn mới",
    subtitle: "Điền đầy đủ các thông tin cần thiết để nộp đơn từ.",
    step1Title: "1. Chọn loại đơn",
    step1Subtitle: "Bấm vào để chọn loại đơn cần tạo",
    step2Title: "2. Chi tiết yêu cầu",
    descriptions: {
      leave: "Sử dụng để xin nghỉ phép, nghỉ ốm hoặc công việc cá nhân. Thời gian nghỉ sẽ được đối trừ trực tiếp vào quỹ phép hiện tại của bạn.",
      wfh: "Đăng ký hình thức làm việc từ xa. Phù hợp khi bạn không có mặt tại văn phòng nhưng vẫn đảm bảo được hiệu suất và công việc trong ngày.",
      checkInOut: "Điều chỉnh bổ sung dữ liệu chấm công khi bạn quên quẹt thẻ, hệ thống lỗi, hoặc có lịch trình đột xuất không thể check-in/out đúng giờ.",
      absent: "Đăng ký vắng mặt tạm thời trong ca làm (ra ngoài gặp khách, sự vụ cá nhân). Khung giờ này vẫn sẽ được tính là khung giờ làm việc hợp lệ.",
      business: "Cập nhật hình thức đi công tác. Toàn bộ thời gian xử lý công việc ngoài văn phòng sẽ được hệ thống tính công đầy đủ.",
      resign: "Đề xuất xin nghỉ việc chính thức. Phân vùng chấm công và xử lý lương sẽ được đóng sau 'Ngày làm việc cuối' của bạn."
    }
  },
  management: {
    title: "Duyệt đơn từ",
    subtitle: "Xử lý các yêu cầu của nhân sự trong phạm vi bạn được phân quyền",
    approveSuccess: "Đã DUYỆT đơn {{id}} thành công!",
    approveError: "Duyệt thất bại. Vui lòng thử lại.",
    rejectSuccess: "Đã TỪ CHỐI đơn {{id}}.",
    rejectError: "Từ chối thất bại.",
    noAccessTitle: "Không có quyền truy cập",
    noAccessDesc: "Bạn không có quyền truy cập chức năng duyệt đơn từ. Việc này yêu cầu quyền quản lý cấp phòng ban hoặc toàn hệ thống.",
    noteTitle: "Lưu ý nghiệp vụ:",
    noteDesc: "Quyền duyệt đơn theo phòng ban chỉ áp dụng với người dùng có chức vụ được bật cờ quản lý.",
    overview: "Tổng quan",
    allDepartments: "Tất cả phòng ban",
    department: "Phòng ban",
    allTime: "Tất cả thời gian",
    thisMonth: "Tháng này",
    customRange: "Tùy chọn...",
    pendingTypes: "Phân loại chờ xử lý",
    noTypeData: "Không có dữ liệu phân loại",
    searchLabel: "Tra cứu",
    searchPlaceholder: "Tìm theo mã, nhân viên...",
    statusLabel: "Trạng thái đơn",
    typeLabel: "Loại đơn",
    cols: {
      id: "Mã đơn",
      employee: "Nhân viên",
      department: "Phòng ban",
      type: "Loại đơn",
      applyDate: "Áp dụng",
      status: "Trạng thái",
      submittedDate: "Ngày gửi",
      actions: "Thao tác"
    },
    loadingList: "Đang tải danh sách...",
    noData: "Không có đơn từ phù hợp",
    noDataHint: "Đổi tiêu chí lọc để xem theo kết quả khác.",
    detailsTitle: "Chi tiết đơn từ",
    empId: "Mã NV",
    reason: "Lý do",
    noReason: "Nhân viên không đính kèm mô tả.",
    impactTitle: "Tác động hệ thống",
    impactRules: {
      absent: "Đơn vắng mặt chỉ cộng thời gian được duyệt vào summary định kỳ, không tạo dữ liệu check-in/check-out gốc.",
      leaveWfhTrip: "Duyệt đơn sẽ trừ vào quỹ thời gian (nếu có); hệ thống tiến hành rebuild công của nhân sự, không tạo dữ liệu quẹt thẻ thực tế.",
      attendance: "Duyệt đơn sẽ chèn/sửa dữ liệu chấm công gốc (check-in hoặc check-out) theo yêu cầu. Việc đồng bộ máy chấm công sau này vẫn có thể ghi đè kết quả nếu giờ quét thẻ mới hợp lệ hơn.",
      resign: "Duyệt đơn sẽ khóa mọi tính toán chấm công sau ngày làm việc cuối cùng.",
      default: "Sau khi duyệt, dữ liệu xử lý sẽ được cập nhật tương ứng. Hệ thống ghi nhận kết quả phê duyệt qua cơ chế Audit."
    },
    actions: {
      rejectBtn: "Từ chối đơn",
      approveBtn: "Duyệt đơn",
      processedNote: "Đơn đã được hệ thống ghi nhận xử lý trước đó."
    },
    format: {
      adjustCheckinOut: "Điều chỉnh {{type}} ngày {{date}} thành {{time}}",
      absentDetail: "Ngày {{date}}, từ {{from}} đến {{to}}",
      fullDay: "Cả ngày",
      morning: "Sáng",
      afternoon: "Chiều",
      leaveSameDay: "{{date}} ({{session}})",
      leaveDiffDay: "Từ {{d1}} ({{s1}}) đến {{d2}} ({{s2}})",
      rangeSameDay: "{{date}}",
      rangeDiffDay: "Từ {{d1}} đến {{d2}}",
      resignDetail: "Làm việc đến hết {{date}}",
      unknown: "Không xác định"
    }
  }
};
