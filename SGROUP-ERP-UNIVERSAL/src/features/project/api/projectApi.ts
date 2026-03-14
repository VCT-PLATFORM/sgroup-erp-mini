import { apiClient } from '../../../core/api/apiClient';

import { DimProject, PropertyProduct } from '../types';

export interface GenerateInventoryParams {
  blocks: string[];
  fromFloor: number;
  toFloor: number;
  unitsPerFloor: number;
  codePattern?: string;
  defaultArea?: number;
  defaultPrice?: number;
  defaultBedrooms?: number;
}

export interface GenerateInventoryResult {
  created: number;
  skipped: number;
  total: number;
}

export const projectApi = {
  // Projects
  getProjects: async (): Promise<DimProject[]> => {
    return apiClient.get('/projects').then(res => res.data?.data || res.data);
  },
  
  getProject: async (id: string): Promise<DimProject> => {
    return apiClient.get(`/projects/${id}`).then(res => res.data?.data || res.data);
  },
  
  createProject: async (data: Partial<DimProject>): Promise<DimProject> => {
    return apiClient.post('/projects', data).then(res => res.data?.data || res.data);
  },
  
  updateProject: async (id: string, data: Partial<DimProject>): Promise<DimProject> => {
    return apiClient.patch(`/projects/${id}`, data).then(res => res.data?.data || res.data);
  },
  
  deleteProject: async (id: string): Promise<void> => {
    return apiClient.delete(`/projects/${id}`).then(res => res.data?.data || res.data);
  },

  // Products (Inventory)
  getProducts: async (projectId: string, params?: any): Promise<{ data: PropertyProduct[], meta?: any}> => {
    return apiClient.get(`/projects/${projectId}/products`, { params }).then(res => {
      // Backend returns { success: true, data: [], meta: {} }
      const body = res.data;
      if (body?.data !== undefined) return body;
      return { data: body }; // fallback
    });
  },
  
  getProduct: async (projectId: string, productId: string): Promise<PropertyProduct> => {
    return apiClient.get(`/projects/${projectId}/products/${productId}`).then(res => res.data?.data || res.data);
  },
  
  createProduct: async (projectId: string, data: Partial<PropertyProduct>): Promise<PropertyProduct> => {
    return apiClient.post(`/projects/${projectId}/products`, data).then(res => res.data?.data || res.data);
  },
  
  updateProduct: async (projectId: string, productId: string, data: Partial<PropertyProduct>): Promise<PropertyProduct> => {
    return apiClient.patch(`/projects/${projectId}/products/${productId}`, data).then(res => res.data?.data || res.data);
  },
  
  deleteProduct: async (projectId: string, productId: string): Promise<void> => {
    return apiClient.delete(`/projects/${projectId}/products/${productId}`).then(res => res.data?.data || res.data);
  },

  // Lock / Unlock
  lockProduct: async (projectId: string, productId: string, staffName?: string): Promise<PropertyProduct> => {
    return apiClient.patch(`/projects/${projectId}/products/${productId}/lock`, { staffName }).then(res => res.data?.data || res.data);
  },

  unlockProduct: async (projectId: string, productId: string): Promise<PropertyProduct> => {
    return apiClient.patch(`/projects/${projectId}/products/${productId}/unlock`, {}).then(res => res.data?.data || res.data);
  },

  // Batch import
  batchCreateProducts: async (projectId: string, items: Partial<PropertyProduct>[]): Promise<any> => {
    return apiClient.post(`/projects/${projectId}/products/batch`, items).then(res => res.data?.data || res.data);
  },

  // Generate inventory (batch create by floor/block pattern)
  generateInventory: async (projectId: string, params: GenerateInventoryParams): Promise<GenerateInventoryResult> => {
    return apiClient.post(`/projects/${projectId}/products/generate`, params).then(res => res.data?.data || res.data);
  },
};
