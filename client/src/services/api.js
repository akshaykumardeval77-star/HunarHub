import axios from 'axios';

const API_BASE = '/api';

export const api = {
  getCategories: () => axios.get(`${API_BASE}/categories`).then(r => r.data),
  getEntrepreneurs: (params = {}) => axios.get(`${API_BASE}/entrepreneurs`, { params }).then(r => r.data),
  getEntrepreneurById: (id) => axios.get(`${API_BASE}/entrepreneurs/${id}`).then(r => r.data),
  updateAvailability: (id, isAvailable) => axios.put(`${API_BASE}/entrepreneurs/${id}/availability`, { isAvailable }).then(r => r.data),
  addProduct: (id, productData) => axios.post(`${API_BASE}/entrepreneurs/${id}/products`, productData).then(r => r.data),
  addService: (id, serviceData) => axios.post(`${API_BASE}/entrepreneurs/${id}/services`, serviceData).then(r => r.data),
  getServiceRequests: () => axios.get(`${API_BASE}/service-requests`).then(r => r.data),
  createServiceRequest: (requestData) => axios.post(`${API_BASE}/service-requests`, requestData).then(r => r.data),
  updateRequestStatus: (id, status) => axios.put(`${API_BASE}/service-requests/${id}/status`, { status }).then(r => r.data),
  createOrder: (orderData) => axios.post(`${API_BASE}/orders`, orderData).then(r => r.data),
  getAdminStats: () => axios.get(`${API_BASE}/admin/stats`).then(r => r.data),
  getPendingApprovals: () => axios.get(`${API_BASE}/admin/approvals`).then(r => r.data),
  approveEntrepreneur: (id) => axios.post(`${API_BASE}/admin/approvals/${id}/approve`).then(r => r.data),
  rejectEntrepreneur: (id) => axios.delete(`${API_BASE}/admin/approvals/${id}`).then(r => r.data),
  addCategory: (categoryData) => axios.post(`${API_BASE}/admin/categories`, categoryData).then(r => r.data)
};
