
const ApiPaths = {
  // Uses
  LOGIN: "/user/login",
  FORGOT_PASS: "/user/forgot-password",
  CREATE_USER: "/user/create",
  GET_USERS: "/user/list",
  DELETE_USER: (id) => `/user/${id}`,

  // Dashboard
  DASHBOARD: "/dashboard",

  // Projects
  PROJECTS: "/project",
  PROJECT_BY_ID: (id) => `/project/${id}`,

  // Flats
  FLATS: "/flat",
  FLAT_BY_ID: (id) => `/flat/${id}`,

  // Clients
  CLIENTS: "/client",
  CLIENT_BY_ID: (id) => `/client/${id}`,

  // Bookings
  BOOKINGS: "/booking",
  BOOKING_BY_ID: (id) => `/booking/${id}`,
  CANCEL_BOOKING: (id) => `/booking/${id}/cancel`,

  // Payments
  PAYMENTS: "/payment",
  PAYMENT_BY_ID: (id) => `/payment/${id}`,

  // Audit Logs
  AUDIT_LOGS: "/audit-log",

  // Reports
  REPORT_SALES: "/report/sales-summary",
  REPORT_FLATS_AVAIL: "/report/flats-availability",
  REPORT_CLIENT_DUES: "/report/client-dues",
  REPORT_PAYMENTS: "/report/payment-collection",
  REPORT_LEDGER: (clientId) => `/report/client-ledger/${clientId}`,
};

export default ApiPaths;
