import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, ProjectData, PropertyProductData } from '../api/projectApi';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  products: (projectId: string) => [...projectKeys.detail(projectId), 'products'] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectApi.getProjects(),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.getProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProjectData>) => projectApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectData> }) => projectApi.updateProject(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
  });
}

export function useProjectProducts(projectId: string) {
  return useQuery({
    queryKey: projectKeys.products(projectId),
    queryFn: () => projectApi.getProducts(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PropertyProductData> }) => projectApi.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // We don't have the projectId readily available in the variables without doing some trickery,
      // so we can invalidate all product queries or return the updated data's projectId.
      // Let's assume the API returns the updated product which contains the projectId.
      if (data && data.projectId) {
        queryClient.invalidateQueries({ queryKey: projectKeys.products(data.projectId) });
      } else {
        queryClient.invalidateQueries({ queryKey: projectKeys.all });
      }
    },
  });
}
