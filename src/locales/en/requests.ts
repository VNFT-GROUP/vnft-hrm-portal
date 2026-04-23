export default {
  title: "Requests Management",
  subtitle: "Create and track the status of your requests.",
  createNew: "Create New Request",
  leaveDays: "Leave Days",
  wfhDays: "WFH Days",
  daysSuffix: "days",
  loading: "Loading request data...",
  noRequests: "No requests found",
  noRequestsDesc: "You haven't created any requests in the system.",
  types: {
    leave: "Leave Request",
    absent: "Absence Request",
    checkInOut: "Check-in/out Request",
    business: "Business Trip Request",
    resign: "Resignation Request",
    wfh: "WFH Request",
    UNKNOWN: "Unknown"
  },
  status: {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    canceled: "Canceled"
  },
  columns: {
    type: "Request Type",
    status: "Status",
    appliedDate: "Applicable Period",
    reason: "Reason",
    submittedDate: "Submitted Date",
    actions: "Actions"
  },
  actions: {
    viewDetails: "View details",
    edit: "Edit request",
    cancel: "Cancel request"
  },
  isPaidText: "PAID WORK",
  create: {
    title: "Create New Request",
    subtitle: "Fill in all the required information to submit a request.",
    step1Title: "1. Select Request Type",
    step1Subtitle: "Click to choose the type of request you want to create",
    step2Title: "2. Request Details",
    descriptions: {
      leave: "Used for annual leaves, sick leaves, or personal matters. The leave duration will be deducted directly from your current leave balance.",
      wfh: "Register for remote working. Suitable for when you are not at the office but can still ensure daily task performance and productivity.",
      checkInOut: "Adjust and supplement attendance data when you forget to swipe your card, the system errs, or there is a schedule preventing timely check-in/out.",
      absent: "Register for temporary absence during a shift (meeting clients, personal matters). This timeframe will still be counted as valid working hours.",
      business: "Update business trip arrangements. All external work processing times will be fully calculated by the system.",
      resign: "Propose an official resignation. Attendance tracking and payroll processing will be closed after your 'Last Working Day'."
    }
  },
  management: {
    title: "Request Approvals",
    subtitle: "Process employee requests within your permitted scope",
    approveSuccess: "APPROVED request {{id}} successfully!",
    approveError: "Approval failed. Please try again.",
    rejectSuccess: "REJECTED request {{id}}.",
    rejectError: "Rejection failed.",
    noAccessTitle: "Access Denied",
    noAccessDesc: "You do not have permission to access the request approval feature. This requires department-level or system-level management rights.",
    noteTitle: "Business Note:",
    noteDesc: "Department-level approval rights only apply to users with managerial roles enabled.",
    overview: "Overview",
    allDepartments: "All Departments",
    department: "Department",
    allTime: "All Time",
    thisMonth: "This Month",
    customRange: "Custom...",
    pendingTypes: "Pending Types",
    noTypeData: "No categorization data",
    searchLabel: "Search",
    searchPlaceholder: "Search by ID, employee...",
    statusLabel: "Status",
    typeLabel: "Request Type",
    cols: {
      id: "ID",
      employee: "Employee",
      department: "Department",
      type: "Type",
      applyDate: "Apply Time",
      status: "Status",
      submittedDate: "Submitted",
      actions: "Actions"
    },
    loadingList: "Loading list...",
    noData: "No matching requests",
    noDataHint: "Change filter criteria to see different results.",
    detailsTitle: "Request Details",
    empId: "Emp ID",
    reason: "Reason",
    noReason: "Employee did not attach a description.",
    impactTitle: "System Impact",
    impactRules: {
      absent: "Absence requests only add approved time to periodic summary, no raw check-in/out data created.",
      leaveWfhTrip: "Approval will deduct from time allowance (if applicable); system will rebuild timekeeping, no actual swipe data created.",
      attendance: "Approval inserts/modifies raw timekeeping data (check-in or out). Future device sync may still overwrite if new punch time is more valid.",
      resign: "Approval locks all time calculations after the last working day.",
      default: "After approval, processing data will be updated accordingly. System logs approval result via Audit."
    },
    actions: {
      rejectBtn: "Reject",
      approveBtn: "Approve",
      processedNote: "The system has already recorded processing for this request."
    },
    format: {
      adjustCheckinOut: "Adjust {{type}} on {{date}} to {{time}}",
      absentDetail: "On {{date}}, from {{from}} to {{to}}",
      fullDay: "Full Day",
      morning: "Morning",
      afternoon: "Afternoon",
      leaveSameDay: "{{date}} ({{session}})",
      leaveDiffDay: "From {{d1}} ({{s1}}) to {{d2}} ({{s2}})",
      rangeSameDay: "{{date}}",
      rangeDiffDay: "From {{d1}} to {{d2}}",
      resignDetail: "Working until {{date}}",
      unknown: "Unknown"
    }
  }
};
