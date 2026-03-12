import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  useListMachineAssets as useGeneratedListMachineAssets,
  useDeleteMachineAsset as useGeneratedDeleteMachineAsset,
  getListMachineAssetsQueryKey,
  VisualizationAsset
} from "@workspace/api-client-react";

export function useMachineAssets(machineId: number) {
  return useGeneratedListMachineAssets(machineId);
}

// Custom hook using native fetch for multipart/form-data support
export function useUploadMachineAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ machineId, file, assetType }: { machineId: number, file: File, assetType: '2d' | '3d' }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', assetType);
      formData.append('displayName', file.name);

      // Resolve the API URL relative to the frontend BASE_URL
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      // Assuming frontend is at /admin/ and API is at /api
      const apiUrl = baseUrl ? `${baseUrl}/../api/machines/${machineId}/assets/upload` : `/api/machines/${machineId}/assets/upload`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = "Failed to upload file";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      return (await res.json()) as VisualizationAsset;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getListMachineAssetsQueryKey(variables.machineId) });
    }
  });
}

export function useDeleteMachineAsset() {
  const queryClient = useQueryClient();
  const mutation = useGeneratedDeleteMachineAsset();

  return {
    ...mutation,
    mutate: (data: Parameters<typeof mutation.mutate>[0], options?: Parameters<typeof mutation.mutate>[1]) => {
      mutation.mutate(data, {
        ...options,
        onSuccess: (result, variables, context) => {
          queryClient.invalidateQueries({ queryKey: getListMachineAssetsQueryKey(variables.machineId) });
          options?.onSuccess?.(result, variables, context);
        }
      });
    }
  };
}
