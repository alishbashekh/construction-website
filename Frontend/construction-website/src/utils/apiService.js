import axios from "axios";

const BASE_URL = "/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ottoman_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ottoman_token");
      localStorage.removeItem("ottoman_user");
      window.location.href = "/#/login";
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (email, password) => api.post("/user/login", { email, password }),

  forgotPassword: (email) => api.post("/user/forgot-password", { email }),

  createUser: (userData) => api.post("/user/create", userData),

  getUsers: (page = 1, limit = 20) =>
    api.get(`/user/list?page=${page}&limit=${limit}`),

  deleteUser: (id) => api.delete(`/user/${id}`),
};

export const dashboardAPI = {
  get: () => api.get("/dashboard"),
};

export const projectsAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get(`/project?page=${page}&limit=${limit}`),

  create: (data) => api.post("/project", data),

  update: (id, data) => api.put(`/project/${id}`, data),

  delete: (id) => api.delete(`/project/${id}`),
};

export const flatsAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get(`/flat?page=${page}&limit=${limit}`),

  create: (data) => api.post("/flat", data),

  update: (id, data) => api.put(`/flat/${id}`, data),

  delete: (id) => api.delete(`/flat/${id}`),
};

export const clientsAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get(`/client?page=${page}&limit=${limit}`),

  create: (data) => api.post("/client", data),

  update: (id, data) => api.put(`/client/${id}`, data),

  delete: (id) => api.delete(`/client/${id}`),
};

export const bookingsAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get(`/booking?page=${page}&limit=${limit}`),

  create: (data) => api.post("/booking", data),

  cancel: (id, reason = "") =>
    api.post(`/booking/${id}/cancel`, { cancellationReason: reason }),
};

export const paymentsAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get(`/payment?page=${page}&limit=${limit}`),

  create: (data) => api.post("/payment", data),
};

export const logsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/audit-log?${query}`);
  },
};

export const reportsAPI = {
  salesSummary: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/report/sales-summary?${query}`);
  },
  flatsAvailability: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/report/flats-availability?${query}`);
  },
  clientDues: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/report/client-dues?${query}`);
  },
  paymentCollection: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/report/payment-collection?${query}`);
  },
  clientLedger: (clientId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/report/client-ledger/${clientId}?${query}`);
  },
};

export default api;
