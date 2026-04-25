export default {
  title: "申请管理",
  subtitle: "新建并追踪您的各项申请状态。",
  createNew: "新建申请",
  leaveDays: "年假天数",
  wfhDays: "居家办公天数",
  daysSuffix: "天",
  loading: "正在加载申请数据...",
  noRequests: "暂无申请记录",
  noRequestsDesc: "您在系统中尚未存在任何申请记录。",
  types: {
    leave: "休假申请",
    absent: "缺勤申请",
    checkInOut: "补签卡申请",
    business: "出差申请",
    resign: "离职申请",
    wfh: "居家办公申请",
    UNKNOWN: "未知"
  },
  status: {
    pending: "待审批",
    approved: "已批准",
    rejected: "已拒绝",
    canceled: "已取消"
  },
  columns: {
    type: "申请类型",
    status: "状态",
    appliedDate: "适用时间",
    reason: "理由",
    submittedDate: "提交日期",
    actions: "操作"
  },
  actions: {
    viewDetails: "查看详情",
    edit: "编辑申请",
    cancel: "撤回申请"
  },
  isPaidText: "带薪",
  create: {
    title: "新建申请",
    subtitle: "填写必要信息以提交申请。",
    step1Title: "1. 选择申请类型",
    step1Subtitle: "点击选择您要创建的申请类型",
    step2Title: "2. 申请详情",
    descriptions: {
      leave: "用于申请年假、病假或事假。休假时间将直接从您当前的假期余额中扣除。",
      wfh: "申请远程办公。适用于您不在办公室但仍能保证当日工作效率和任务的情况。",
      checkInOut: "当您忘记打卡、系统异常或有突发日程导致无法准时打卡时，用来调整和补充考勤数据。",
      absent: "申请在班次内短暂外出（见客户、处理个人事务等）。该时间段仍将计为有效工作时间。",
      business: "更新出差记录。所有在办公室外处理工作的时间都将被系统计入全勤。",
      resign: "提交正式的离职申请。在您的“最后工作日”之后，考勤记录和薪酬处理将会封闭结算。"
    }
  },
  management: {
    title: "申请审批",
    subtitle: "在您授权的范围内处理员工申请",
    approveSuccess: "已成功批准申请 {{id}}！",
    approveError: "批准失败。请重试。",
    rejectSuccess: "已拒绝申请 {{id}}。",
    rejectError: "拒绝失败。",
    noAccessTitle: "无访问权限",
    noAccessDesc: "您无权访问申请审批功能。这需要部门级或系统级的管理权限。",
    noteTitle: "业务须知：",
    noteDesc: "部门级审批权限仅适用于开启了管理角色的用户。",
    overview: "概览",
    allDepartments: "所有部门",
    department: "部门",
    allTime: "所有时间",
    thisMonth: "本月",
    customRange: "自定义...",
    pendingTypes: "待处理分类",
    noTypeData: "没有分类数据",
    searchLabel: "搜索",
    searchPlaceholder: "按单号、员工搜索...",
    statusLabel: "状态",
    typeLabel: "申请类型",
    cols: {
      id: "单号",
      employee: "员工",
      department: "部门",
      type: "类型",
      applyDate: "适用时间",
      status: "状态",
      submittedDate: "提交日期",
      actions: "操作"
    },
    loadingList: "正在加载列表...",
    noData: "没有匹配的申请",
    noDataHint: "更改过滤条件以查看不同结果。",
    detailsTitle: "申请详情",
    empId: "工号",
    reason: "理由",
    noReason: "员工没有附加说明。",
    impactTitle: "系统影响",
    impactRules: {
      absent: "缺勤申请仅将会计入定期摘要，不创建原始签到/签退数据。",
      leaveWfhTrip: "批准后将从时间额度中扣除（如适用）；系统将重构出勤，不产生实际打卡数据。",
      attendance: "批准后将插入/修改原始出勤数据（签到或签退）。将来的设备同步仍可能覆盖如果新打卡时间更有效。",
      resign: "批准后将锁定最后工作日后的所有出勤计算。",
      default: "批准后，处理数据将被相应更新。系统通过审计机制记录批准结果。"
    },
    actions: {
      rejectBtn: "拒绝申请",
      approveBtn: "批准申请",
      processedNote: "系统已经记录了该申请的处理结果。"
    },
    format: {
      adjustCheckinOut: "调整 {{date}} 的 {{type}} 为 {{time}}",
      absentDetail: "{{date}}，从 {{from}} 到 {{to}}",
      fullDay: "全天",
      morning: "上午",
      afternoon: "下午",
      leaveSameDay: "{{date}} ({{session}})",
      leaveDiffDay: "从 {{d1}} ({{s1}}) 到 {{d2}} ({{s2}})",
      rangeSameDay: "{{date}}",
      rangeDiffDay: "从 {{d1}} 到 {{d2}}",
      resignDetail: "工作至 {{date}}",
      unknown: "未知"
    }
  }
};
