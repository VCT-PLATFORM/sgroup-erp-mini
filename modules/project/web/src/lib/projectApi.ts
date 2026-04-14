import api from "./api";
import type { Project, Product, LegalDoc, DashboardStats, StatusCount, ApiResponse, CreateProjectForm, CreateProductForm } from "./types";

// ==================== Projects ====================

export async function listProjects(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<Project[]>> {
  const res = await api.get("/projects", { params });
  return res.data;
}

export async function getProject(id: string): Promise<Project> {
  const res = await api.get(`/projects/${id}`);
  return res.data.data;
}

export async function createProject(data: CreateProjectForm): Promise<Project> {
  const res = await api.post("/projects", data);
  return res.data.data;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await api.put(`/projects/${id}`, data);
  return res.data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}

// ==================== Products ====================

export async function listProducts(projectId: string, params?: {
  page?: number;
  limit?: number;
  status?: string;
  block?: string;
  search?: string;
  sort?: string;
  bedrooms?: number;
}): Promise<ApiResponse<Product[]>> {
  const res = await api.get(`/projects/${projectId}/products`, { params });
  return res.data;
}

export async function createProduct(projectId: string, data: CreateProductForm): Promise<Product> {
  const res = await api.post(`/projects/${projectId}/products`, data);
  return res.data.data;
}

export async function batchCreateProducts(projectId: string, products: CreateProductForm[]): Promise<{ created: number }> {
  const res = await api.post(`/projects/${projectId}/products/batch`, products);
  return res.data.data;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

// ==================== Product Actions ====================

export async function lockProduct(id: string, bookedBy: string): Promise<void> {
  await api.post(`/products/${id}/lock`, { bookedBy });
}

export async function unlockProduct(id: string, requestedBy: string, isAdmin: boolean = false): Promise<void> {
  await api.post(`/products/${id}/unlock`, { requestedBy, isAdmin });
}

export async function depositProduct(id: string, requestedBy: string): Promise<void> {
  await api.post(`/products/${id}/deposit`, { requestedBy });
}

export async function soldProduct(id: string, requestedBy: string): Promise<void> {
  await api.post(`/products/${id}/sold`, { requestedBy });
}

// ==================== Dashboard ====================

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get("/dashboard/stats");
  return res.data.data;
}

export async function getStatusBreakdown(projectId: string): Promise<StatusCount[]> {
  const res = await api.get(`/projects/${projectId}/products/breakdown`);
  return res.data.data;
}

export async function getTotalStatusBreakdown(): Promise<StatusCount[]> {
  const res = await api.get("/dashboard/breakdown");
  return res.data.data;
}

// ==================== Legal Docs ====================

export async function listDocs(projectId: string): Promise<LegalDoc[]> {
  const res = await api.get(`/projects/${projectId}/docs`);
  return res.data.data || [];
}

export async function uploadDoc(projectId: string, data: { title: string; docType: string; fileUrl: string; description?: string }): Promise<LegalDoc> {
  const res = await api.post(`/projects/${projectId}/docs`, data);
  return res.data.data;
}

export async function updateDocStatus(projectId: string, docId: string, status: string): Promise<void> {
  await api.put(`/projects/${projectId}/docs/${docId}/status`, { status });
}

export async function deleteDoc(projectId: string, docId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/docs/${docId}`);
}
